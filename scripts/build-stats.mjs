// Builds the "telemetry" panel (stats.svg) from live GitHub data.
// Runs in the profile workflow; replaces third-party stat cards. Uses GITHUB_TOKEN,
// or a PROFILE_TOKEN secret (a personal token) to include private contributions.
//
//   node scripts/build-stats.mjs <outDir> [--fixture data.json] [--dump data.json]
import { readFileSync } from "node:fs";
import { C, DISPLAY, MONO, MONO_ADV, fontCss, esc, chamferPath, svgDoc, write } from "./lib.mjs";

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
    languages: top,
  };
}

const fmt = (n) => n.toLocaleString("en-US");

function render(s) {
  const W = 1000, H = 440, PAD = 30;
  const css = fontCss({ monoBold: true }) + `
.d{font-family:${DISPLAY};font-weight:800}.m{font-family:${MONO};font-weight:400}.mb{font-family:${MONO};font-weight:700}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(${W - PAD * 2 - 60}px)}}
.pulse{animation:pulse 1.8s ease-in-out infinite}
.sweep{transform-box:view-box;animation:sweep 6s ease-in-out infinite alternate}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

  const defs = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.cyan}" stop-opacity=".18"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
<linearGradient id="barG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.violet}"/><stop offset=".6" stop-color="${C.cyan}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${C.cyan}" stroke-opacity=".05"/></pattern>
<filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="langClip"><rect x="${PAD}" y="364" width="${W - PAD * 2}" height="10" rx="5"/></clipPath>`;

  const tiles = [
    s.source === "contributions"
      ? ["CONTRIBUTIONS", "LAST 12 MONTHS", fmt(s.activity), C.cyan]
      : ["PUBLIC COMMITS", "LAST 12 MONTHS", fmt(s.activity), C.cyan],
    ["ACTIVE DAYS", "LAST 12 MONTHS", fmt(s.activeDays), C.violet],
    ["CURRENT STREAK", "DAYS", fmt(s.currentStreak), C.lime],
    ["LONGEST STREAK", "DAYS", fmt(s.longestStreak), C.amber],
    ["PUBLIC REPOS", "OWNED", fmt(s.publicRepos), C.magenta],
    ["LANGUAGES", "IN PUBLIC CODE", fmt(s.languageCount), C.cyan],
  ];
  const TG = 12, TW = (W - PAD * 2 - TG * (tiles.length - 1)) / tiles.length, TY = 64, TH = 92;
  const tileSvg = tiles.map(([label, sub, value, color], i) => {
    const x = PAD + i * (TW + TG);
    return `<g transform="translate(${x.toFixed(1)} ${TY})">
  <path d="${chamferPath(0.5, 0.5, TW - 1, TH - 1, 12)}" fill="${C.bg0}" fill-opacity=".7" stroke="${color}" stroke-opacity=".35"/>
  <rect x="14" y="0" width="28" height="2" fill="${color}"/>
  <text x="14" y="46" class="d" font-size="30" fill="${color}" filter="url(#g)">${esc(value)}</text>
  <text x="14" y="66" class="mb" font-size="10.5" letter-spacing="1" fill="${C.text}">${label}</text>
  <text x="14" y="80" class="m" font-size="10" letter-spacing="1" fill="${C.dim}">${sub}</text>
</g>`;
  }).join("\n");

  const CY0 = 196, CH = 120, base = CY0 + CH;
  const max = Math.max(1, ...s.weeks);
  const slot = (W - PAD * 2) / Math.max(1, s.weeks.length), bw = Math.max(2, slot - 5);
  const peakIdx = s.weeks.indexOf(Math.max(...s.weeks));
  const bars = s.weeks.map((n, i) => {
    const h = n === 0 ? 2 : Math.max(4, (n / max) * CH);
    const x = PAD + i * slot + (slot - bw) / 2;
    const fill = n === 0 ? C.line : "url(#barG)";
    return `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${fill}"/>`;
  }).join("");
  const peakX = PAD + peakIdx * slot + slot / 2;
  const peakLabel = `PEAK ${fmt(max)}`;
  const peakAnchor = peakX > W - 120 ? "end" : peakX < 120 ? "start" : "middle";

  let lx = PAD;
  const segs = s.languages.map((l) => {
    const w = ((W - PAD * 2) * l.pct) / 100;
    const r = `<rect x="${lx.toFixed(1)}" y="364" width="${Math.max(0, w - 2).toFixed(1)}" height="10" fill="${l.color}"/>`;
    lx += w;
    return r;
  }).join("");
  const legendStep = (W - PAD * 2) / Math.max(1, s.languages.length);
  const legend = s.languages.map((l, i) => {
    const x = PAD + i * legendStep;
    const label = `${l.name} ${l.pct.toFixed(1)}%`;
    const size = Math.min(11.5, (legendStep - 22) / (label.length * MONO_ADV));
    return `<g transform="translate(${x.toFixed(1)} 400)"><rect width="10" height="10" rx="2" fill="${l.color}"/><text x="16" y="9.5" class="m" font-size="${size.toFixed(1)}" fill="${C.text}">${esc(l.name)} <tspan fill="${C.dim}">${l.pct.toFixed(1)}%</tspan></text></g>`;
  }).join("");

  const synced = s.generatedAt.slice(0, 10);
  const body = `
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 24)}" fill="url(#bg)"/>
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 24)}" fill="url(#grid)"/>
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 24)}" fill="none" stroke="${C.line}"/>

<text x="${PAD}" y="40" class="m" font-size="13" letter-spacing="3" fill="${C.dim}">// TELEMETRY FEED: <tspan fill="${C.text}">${esc(s.login.toUpperCase())}</tspan></text>
<circle cx="${(W - PAD - 6 - `SYNCED ${synced} UTC`.length * (13 * MONO_ADV + 2) - 10).toFixed(1)}" cy="35" r="4.5" fill="${C.lime}" class="pulse"/>
<text x="${W - PAD - 6}" y="40" text-anchor="end" class="m" font-size="13" letter-spacing="2" fill="${C.dim}">SYNCED <tspan fill="${C.lime}">${synced}</tspan> UTC</text>

${tileSvg}

<text x="${PAD}" y="184" class="m" font-size="12" letter-spacing="3" fill="${C.dim}">// 52-WEEK ${s.source === "contributions" ? "CONTRIBUTION" : "COMMIT"} SIGNAL</text>
<g stroke="${C.line}" stroke-dasharray="2 6">
  <line x1="${PAD}" y1="${CY0}" x2="${W - PAD}" y2="${CY0}"/><line x1="${PAD}" y1="${CY0 + CH / 2}" x2="${W - PAD}" y2="${CY0 + CH / 2}"/>
</g>
<g filter="url(#g)">${bars}</g>
<rect class="sweep" x="${PAD}" y="${CY0 - 4}" width="60" height="${CH + 4}" fill="url(#sweepG)"/>
<line x1="${PAD}" y1="${base + 0.5}" x2="${W - PAD}" y2="${base + 0.5}" stroke="${C.faint}"/>
<text x="${peakX.toFixed(1)}" y="${CY0 - 8}" text-anchor="${peakAnchor}" class="mb" font-size="11" letter-spacing="1" fill="${C.cyan}">${peakLabel}</text>
<text x="${PAD}" y="${base + 18}" class="m" font-size="10" letter-spacing="2" fill="${C.faint}">52 WEEKS AGO</text>
<text x="${W - PAD}" y="${base + 18}" text-anchor="end" class="m" font-size="10" letter-spacing="2" fill="${C.faint}">THIS WEEK</text>

<text x="${PAD}" y="354" class="m" font-size="12" letter-spacing="3" fill="${C.dim}">// LANGUAGE MATRIX (PUBLIC REPOS)</text>
<rect x="${PAD}" y="364" width="${W - PAD * 2}" height="10" rx="5" fill="${C.line}"/>
<g clip-path="url(#langClip)">${segs}</g>
${legend}`;

  const langText = s.languages.map((l) => `${l.name} ${l.pct.toFixed(1)}%`).join(", ");
  return svgDoc({
    w: W, h: H, css, defs, body,
    title: `GitHub telemetry for ${s.login}: ${s.activity} ${s.source} in the last year, ${s.activeDays} active days, current streak ${s.currentStreak} days, longest streak ${s.longestStreak} days, ${s.publicRepos} public repos. Languages: ${langText}`,
  });
}

const fixture = flag("--fixture");
const stats = fixture ? JSON.parse(readFileSync(fixture, "utf8")) : await fetchData();
const dump = flag("--dump");
if (dump) write(dump, JSON.stringify(stats, null, 2));
console.log(JSON.stringify({ ...stats, weeks: `[${stats.weeks.length} weeks]` }, null, 2));
write(`${outDir}/stats.svg`, render(stats));
