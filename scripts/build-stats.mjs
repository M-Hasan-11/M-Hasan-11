// Builds the "telemetry" panel (stats.svg) and the activity grid (activity.svg)
// from live GitHub data. The workflow commits them to assets/telemetry.svg and
// assets/activity.svg so the README serves them like every other image (the
// GitHub mobile app would not load them from another branch).
// Runs in the profile workflow; replaces third-party stat cards. Uses GITHUB_TOKEN,
// or a PROFILE_TOKEN secret (a personal token) to include private contributions.
//
//   node scripts/build-stats.mjs <outDir> [--fixture data.json] [--dump data.json]
import { readFileSync } from "node:fs";
import { C, fontCss, typeCss, motionCss, measure, esc, panel, glow, blur, svgDoc, write } from "./lib.mjs";

const args = process.argv.slice(2);
const outDir = args[0] ?? "dist";
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

const LOGIN = process.env.PROFILE_LOGIN ?? "M-Hasan-11";
// Unity projects carry large amounts of engine-generated shader/script code.
const IGNORED_LANGUAGES = new Set(["ShaderLab", "HLSL", "TeX", "Batchfile", "PowerShell", "Makefile", "Dockerfile"]);

const REPO_HISTORY = `history(since: $since, first: 100, after: $after) {
  totalCount pageInfo { hasNextPage endCursor } nodes { committedDate }
}`;

const QUERY = `query($login: String!, $since: GitTimestamp!, $after: String) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        name
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
        defaultBranchRef { target { ... on Commit { ${REPO_HISTORY} } } }
      }
    }
  }
}`;

const MORE_HISTORY = `query($login: String!, $name: String!, $since: GitTimestamp!, $after: String) {
  repository(owner: $login, name: $name) { defaultBranchRef { target { ... on Commit { ${REPO_HISTORY} } } } }
}`;

async function gql(query, variables) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required (or pass --fixture)");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-telemetry" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub GraphQL failed (${res.status}): ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

const DAY = 86_400_000;

async function fetchData() {
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  const since = new Date(today - 364 * DAY).toISOString();
  const { user } = await gql(QUERY, { login: LOGIN, since });

  // Commit dates on the default branch of every public repo, paginated.
  const commitDates = [];
  for (const repo of user.repositories.nodes) {
    let history = repo.defaultBranchRef?.target?.history;
    for (let page = 0; history && page < 20; page++) {
      commitDates.push(...history.nodes.map((c) => c.committedDate));
      if (!history.pageInfo.hasNextPage) break;
      const data = await gql(MORE_HISTORY, { login: LOGIN, name: repo.name, since, after: history.pageInfo.endCursor });
      history = data.repository.defaultBranchRef?.target?.history;
    }
  }
  return summarize(user, commitDates, today);
}

function summarize(user, commitDates, today) {
  // One entry per UTC day for the last 52 weeks, oldest first.
  const keys = Array.from({ length: 364 }, (_, i) => new Date(today - (363 - i) * DAY).toISOString().slice(0, 10));
  const cal = user.contributionsCollection.contributionCalendar;

  // Prefer the contribution calendar; when the profile hides it (or the token
  // can't see it) fall back to commit activity across public repos.
  let source, counts;
  if (cal.totalContributions > 0) {
    source = "contributions";
    const byDay = new Map(cal.weeks.flatMap((w) => w.contributionDays).map((d) => [d.date, d.contributionCount]));
    counts = keys.map((k) => byDay.get(k) ?? 0);
  } else {
    source = "commits";
    const byDay = new Map();
    for (const d of commitDates) byDay.set(d.slice(0, 10), (byDay.get(d.slice(0, 10)) ?? 0) + 1);
    counts = keys.map((k) => byDay.get(k) ?? 0);
  }

  let longest = 0, run = 0;
  for (const n of counts) {
    run = n > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Today may simply not have activity *yet*; don't let that break the streak.
  let i = counts.length - 1;
  if (i >= 0 && counts[i] === 0) i--;
  let current = 0;
  for (; i >= 0 && counts[i] > 0; i--) current++;

  const weeks = Array.from({ length: 52 }, (_, w) => counts.slice(w * 7, w * 7 + 7).reduce((a, b) => a + b, 0));

  const bytes = new Map();
  for (const repo of user.repositories.nodes) {
    for (const { size, node } of repo.languages.edges) {
      if (IGNORED_LANGUAGES.has(node.name)) continue;
      const prev = bytes.get(node.name) ?? { size: 0, color: node.color };
      bytes.set(node.name, { size: prev.size + size, color: node.color ?? prev.color });
    }
  }
  const total = [...bytes.values()].reduce((n, l) => n + l.size, 0) || 1;
  const sorted = [...bytes.entries()].sort((a, b) => b[1].size - a[1].size);
  const top = sorted.slice(0, 6).map(([name, l]) => ({ name, color: l.color ?? C.dim, pct: (l.size / total) * 100 }));
  const otherPct = 100 - top.reduce((n, l) => n + l.pct, 0);
  if (sorted.length > 6 && otherPct > 0.05) top.push({ name: "Other", color: C.faint, pct: otherPct });

  return {
    login: LOGIN,
    generatedAt: new Date().toISOString(),
    source,
    activity: counts.reduce((a, b) => a + b, 0),
    activeDays: counts.filter((n) => n > 0).length,
    currentStreak: current,
    longestStreak: longest,
    publicRepos: user.repositories.totalCount,
    languageCount: bytes.size,
    weeks,
    days: keys.map((date, i) => [date, counts[i]]),
    languages: top,
  };
}

const fmt = (n) => n.toLocaleString("en-US");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const base = typeCss + motionCss;

/** A 52 x 7 day grid of activity, oldest column first, with a scanning highlight. */
function renderGrid(s) {
  const W = 1000, PAD = 40, CELL = 14, GAP = 4, STEP = CELL + GAP, GY = 108;
  const H = GY + 7 * STEP + 66;
  const max = Math.max(1, ...s.days.map(([, n]) => n));
  const shades = [C.line, "#2E2A6E", "#5B4FD6", "#3FB6F5", C.cyan];
  const level = (n) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));
  const x0 = (W - (52 * STEP - GAP)) / 2;
  const P = panel({ w: W, h: H, r: 24 });

  const months = [];
  let lastMonth = -1;
  const cells = s.days.map(([date, n], i) => {
    const col = Math.floor(i / 7), row = i % 7;
    const x = x0 + col * STEP, y = GY + row * STEP;
    const m = +date.slice(5, 7) - 1;
    if (row === 0 && m !== lastMonth) {
      // A month that only shows a few columns (like the partial first one) gives way to the next.
      if (months.length && col - months.at(-1).col < 3) months.pop();
      if (col < 50) months.push({ col, text: `<text x="${x}" y="${GY - 14}" class="s4" font-size="13" fill="${C.dim}">${MONTHS[m]}</text>` });
      lastMonth = m;
    }
    const lv = level(n);
    const isToday = i === s.days.length - 1;
    return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3.5" fill="${shades[lv]}"${lv >= 3 ? ` filter="url(#g)"` : ""}${isToday ? ` class="pulse"` : ""}/>`;
  }).join("");

  const legendX = W - PAD - 5 * 20 - measure("More", "sg400", 13) - 8;
  const legend = shades.map((c, i) => `<rect x="${legendX + i * 20}" y="${H - 40}" width="14" height="14" rx="3.5" fill="${c}"/>`).join("");
  const label = s.source === "contributions" ? "Contributions" : "Commits";
  const css = fontCss({ sans: [400, 700], mono: [] }) + base + `
@keyframes scan{from{transform:translateX(0)}to{transform:translateX(${52 * STEP - 40}px)}}
.scan{transform-box:view-box;animation:scan 8s ease-in-out infinite alternate}`;
  const defs = P.defs + glow("g", 2) + `
<linearGradient id="scanG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.cyan}" stop-opacity=".16"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>`;
  const body = `
${P.back}
<text x="${PAD}" y="52" class="s7" font-size="22" fill="${C.text}">${label}, last 52 weeks</text>
<text x="${W - PAD}" y="52" text-anchor="end" class="s4" font-size="16" fill="${C.soft}">${fmt(s.activeDays)} active days</text>
${months.map((m) => m.text).join("")}
<rect class="scan" x="${x0 - 10}" y="${GY - 6}" width="60" height="${7 * STEP + 8}" fill="url(#scanG)"/>
${cells}
<text x="${x0}" y="${H - 28}" class="s4" font-size="13" fill="${C.faint}">Today pulses</text>
<text x="${legendX - 10}" y="${H - 28}" text-anchor="end" class="s4" font-size="13" fill="${C.dim}">Less</text>
${legend}
<text x="${W - PAD}" y="${H - 28}" text-anchor="end" class="s4" font-size="13" fill="${C.dim}">More</text>
${P.edge}`;
  return svgDoc({ w: W, h: H, css, defs, body, title: `${label} grid for ${s.login}: ${s.activeDays} active days in the last 52 weeks` });
}

function render(s) {
  const W = 1000, H = 486, PAD = 40;
  const P = panel({ w: W, h: H, r: 24 });
  const css = fontCss({ sans: [400, 500, 700], mono: [400] }) + base + `
@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(${W - PAD * 2 - 60}px)}}
.sweep{transform-box:view-box;animation:sweep 7s ease-in-out infinite alternate}`;

  const defs = P.defs + glow("g", 3) + blur("soft", 60) + `
<linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.cyan}" stop-opacity=".14"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
<linearGradient id="barG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
<clipPath id="langClip"><rect x="${PAD}" y="404" width="${W - PAD * 2}" height="8" rx="4"/></clipPath>`;

  const tiles = [
    s.source === "contributions" ? ["Contributions", fmt(s.activity), C.cyan] : ["Public commits", fmt(s.activity), C.cyan],
    ["Active days", fmt(s.activeDays), C.violet],
    ["Current streak", `${fmt(s.currentStreak)}d`, C.lime],
    ["Longest streak", `${fmt(s.longestStreak)}d`, C.amber],
    ["Public repos", fmt(s.publicRepos), C.pink],
    ["Languages", fmt(s.languageCount), C.cyan],
  ];
  const TG = 12, TW = (W - PAD * 2 - TG * (tiles.length - 1)) / tiles.length, TY = 84, TH = 96;
  const tileSvg = tiles.map(([label, value, color], i) => {
    const x = PAD + i * (TW + TG);
    return `<g transform="translate(${x.toFixed(1)} ${TY})">
  <rect x=".5" y=".5" width="${(TW - 1).toFixed(1)}" height="${TH - 1}" rx="16" fill="#FFFFFF" fill-opacity=".03" stroke="#FFFFFF" stroke-opacity=".08"/>
  <circle cx="18" cy="22" r="4" fill="${color}"/>
  <text x="16" y="62" class="s7" font-size="32" letter-spacing="-.5" fill="${C.text}">${esc(value)}</text>
  <text x="16" y="82" class="s4" font-size="13" fill="${C.dim}">${label}</text>
</g>`;
  }).join("\n");

  const CY0 = 232, CH = 104, base0 = CY0 + CH;
  const max = Math.max(1, ...s.weeks);
  const slot = (W - PAD * 2) / Math.max(1, s.weeks.length), bw = Math.max(2, slot - 6);
  const peakIdx = s.weeks.indexOf(Math.max(...s.weeks));
  const bars = s.weeks.map((n, i) => {
    const h = n === 0 ? 2 : Math.max(4, (n / max) * CH);
    const x = PAD + i * slot + (slot - bw) / 2;
    return `<rect x="${x.toFixed(1)}" y="${(base0 - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2.5" fill="${n === 0 ? C.line : "url(#barG)"}"/>`;
  }).join("");
  const peakX = PAD + peakIdx * slot + slot / 2;

  let lx = PAD;
  const segs = s.languages.map((l) => {
    const w = ((W - PAD * 2) * l.pct) / 100;
    const r = `<rect x="${lx.toFixed(1)}" y="404" width="${Math.max(0, w - 2).toFixed(1)}" height="8" fill="${l.color}"/>`;
    lx += w;
    return r;
  }).join("");
  // Legend items flow left to right, spaced by their real widths.
  let gx = PAD;
  const legend = s.languages.map((l) => {
    const nameW = measure(l.name, "sg500", 14), pct = `${l.pct.toFixed(1)}%`;
    const item = `<g transform="translate(${gx.toFixed(1)} 438)"><circle cx="5" cy="5" r="5" fill="${l.color}"/><text x="16" y="10" class="s5" font-size="14" fill="${C.soft}">${esc(l.name)}</text><text x="${(22 + nameW).toFixed(1)}" y="10" class="s4" font-size="14" fill="${C.dim}">${pct}</text></g>`;
    gx += 22 + nameW + measure(pct, "sg400", 14) + 26;
    return item;
  }).join("");
  if (gx - 26 > W - PAD) throw new Error("language legend too wide");

  const synced = `Synced ${s.generatedAt.slice(0, 10)}`;
  const kind = s.source === "contributions" ? "contributions" : "commits";
  const body = `
${P.back}
<g clip-path="${P.clip}"><ellipse cx="${W - 140}" cy="0" rx="280" ry="130" fill="${C.violet}" opacity=".14" filter="url(#soft)"/></g>
<text x="${PAD}" y="54" class="s7" font-size="22" fill="${C.text}">GitHub at a glance</text>
<circle cx="${(W - PAD - measure(synced, "sg400", 15) - 14).toFixed(1)}" cy="49" r="4.5" fill="${C.lime}" class="pulse"/>
<text x="${W - PAD}" y="54" text-anchor="end" class="s4" font-size="15" fill="${C.dim}">${synced}</text>

${tileSvg}

<text x="${PAD}" y="218" class="s5" font-size="15" fill="${C.soft}">Weekly ${kind}</text>
<text x="${W - PAD}" y="218" text-anchor="end" class="s4" font-size="14" fill="${C.dim}">Peak ${fmt(max)} / week</text>
<line x1="${PAD}" y1="${CY0 + CH / 2}" x2="${W - PAD}" y2="${CY0 + CH / 2}" stroke="${C.line}" stroke-dasharray="2 6"/>
<g filter="url(#g)">${bars}</g>
<rect class="sweep" x="${PAD}" y="${CY0 - 4}" width="60" height="${CH + 4}" fill="url(#sweepG)"/>
<path d="M${(peakX - 4).toFixed(1)} ${CY0 - 10}H${(peakX + 4).toFixed(1)}L${peakX.toFixed(1)} ${CY0 - 4}Z" fill="${C.cyan}"/>
<line x1="${PAD}" y1="${base0 + 0.5}" x2="${W - PAD}" y2="${base0 + 0.5}" stroke="${C.line2}"/>
<text x="${PAD}" y="${base0 + 20}" class="s4" font-size="12" fill="${C.faint}">52 weeks ago</text>
<text x="${W - PAD}" y="${base0 + 20}" text-anchor="end" class="s4" font-size="12" fill="${C.faint}">This week</text>

<text x="${PAD}" y="390" class="s5" font-size="15" fill="${C.soft}">Languages in public repos</text>
<rect x="${PAD}" y="404" width="${W - PAD * 2}" height="8" rx="4" fill="${C.line}"/>
<g clip-path="url(#langClip)">${segs}</g>
${legend}
${P.edge}`;

  const langText = s.languages.map((l) => `${l.name} ${l.pct.toFixed(1)}%`).join(", ");
  return svgDoc({
    w: W, h: H, css, defs, body,
    title: `GitHub at a glance for ${s.login}: ${s.activity} ${s.source} in the last year, ${s.activeDays} active days, current streak ${s.currentStreak} days, longest streak ${s.longestStreak} days, ${s.publicRepos} public repos. Languages: ${langText}`,
  });
}

const fixture = flag("--fixture");
const stats = fixture ? JSON.parse(readFileSync(fixture, "utf8")) : await fetchData();
const dump = flag("--dump");
if (dump) write(dump, JSON.stringify(stats, null, 2));
const activeDays = stats.days.filter(([, n]) => n > 0).map(([d, n]) => `${d}:${n}`).join(" ");
console.log(JSON.stringify({ ...stats, weeks: `[${stats.weeks.length} weeks]`, days: activeDays }, null, 2));
write(`${outDir}/stats.svg`, render(stats));
write(`${outDir}/activity.svg`, renderGrid(stats));
