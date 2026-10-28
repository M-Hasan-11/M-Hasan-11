// Generates the static SVGs in assets/ that the profile README uses.
// Run with `node scripts/build-assets.mjs` after editing anything below.
import { readFileSync } from "node:fs";
import {
  C, fontCss, typeCss, motionCss, measure, wrap, esc, panel, blur, arrowNE, rng, svgDoc, write,
} from "./lib.mjs";
import { robot, robotCss, robotDefs } from "./robot.mjs";

const OUT = new URL("../assets/", import.meta.url).pathname;
const icons = JSON.parse(readFileSync(new URL("./icons.json", import.meta.url)));
const base = typeCss + motionCss;

/* ─────────────────────────────── content ─────────────────────────────── */

const NAME = "Mahedi Hasan";
const TAGLINE = "Full-stack developer crafting cinematic 3D web, AI products and games.";
const ROLES = ["FULL-STACK DEVELOPMENT", "3D & CREATIVE WEB", "AI PRODUCT ENGINEERING", "UNITY GAME DEVELOPMENT"];
const STACK = ["TYPESCRIPT", "NEXT.JS", "REACT THREE FIBER", "SUPABASE", "UNITY"];

const ACCENT = { web3d: C.cyan, ai: C.pink, platform: C.violet, game: C.lime };

const PROJECTS = [
  {
    slug: "liberty250", kind: "web3d", category: "3D & cinematic web", title: "Liberty 250", status: "live",
    desc: "Cinematic scrollytelling for America's 250th: a 3D globe and live fireworks.",
    tech: ["Next.js 16", "R3F", "GSAP", "Supabase"], host: "liberty250.vercel.app",
  },
  {
    slug: "vesta", kind: "web3d", category: "3D commerce", title: "VESTA", status: "live",
    desc: "Luxury lifestyle storefront with interactive 3D product previews.",
    tech: ["TypeScript", "Three.js", "Vercel"], host: "wearvesta.vercel.app",
  },
  {
    slug: "car-plant", kind: "web3d", category: "3D simulation", title: "Car Plant Simulation", status: "dev",
    desc: "Near-photoreal browser simulation of an automated car assembly plant.",
    tech: ["Vite", "TypeScript", "Three.js"], host: "Coming soon",
  },
  {
    slug: "auralens", kind: "ai", category: "AI app", title: "AuraLens", status: "live",
    desc: "AI aesthetic portrait studio for polished, stylized portraits.",
    tech: ["Next.js", "TypeScript", "AI"], host: "aura-lens.vercel.app",
  },
  {
    slug: "rind-and-ember", kind: "platform", category: "Full-stack platform", title: "Rind & Ember", status: "live",
    desc: "Restaurant ordering, reservations, loyalty and live order tracking.",
    tech: ["Next.js", "TypeScript", "Full-stack"], host: "cinder-citrus.vercel.app",
  },
  {
    slug: "ielts-app", kind: "ai", category: "AI edtech", title: "IELTS App", status: "live",
    desc: "IELTS preparation platform with a built-in AI tutor.",
    tech: ["TypeScript", "AI tutor"], host: "ielts-app-pi.vercel.app",
  },
  {
    slug: "ai-story-weaver", kind: "ai", category: "Generative AI", title: "AI Story Weaver", status: "source",
    desc: "AI-powered interactive story generator.",
    tech: ["TypeScript", "Generative AI"], host: "github.com/M-Hasan-11/AI-Story-Weaver",
  },
  {
    slug: "growzone", kind: "platform", category: "E-commerce", title: "GrowZone", status: "live",
    desc: "Full-stack e-commerce platform.",
    tech: ["TypeScript", "React"], host: "grow-zone.vercel.app",
  },
  {
    slug: "relic-arena", kind: "game", category: "Unity game", title: "Relic Arena Realms", status: "source",
    desc: "Free Windows action arena, with its Unity source kit and download site.",
    tech: ["Unity", "C#"], host: "github.com/M-Hasan-11/relic-arena",
  },
  {
    slug: "astrobluster", kind: "game", category: "Unity game", title: "AstroBluster", status: "source",
    desc: "2D space shooting game built in Unity.",
    tech: ["Unity", "C#"], host: "github.com/M-Hasan-11/AstroBluster",
  },
];

const TOOLKIT = [
  ["Languages", ["typescript", "javascript", "csharp", "html5", "css"]],
  ["Frontend & 3D", ["react", "nextdotjs", "tailwindcss", "threedotjs", "gsap", "vite"]],
  ["Backend & cloud", ["nodedotjs", "supabase", "postgresql", "vercel"]],
  ["Games & tools", ["unity", "git", "github", "figma"]],
];

const SECTIONS = [
  ["about", "01", "About", "Who I am"],
  ["toolkit", "02", "Toolkit", "What I build with"],
  ["work", "03", "Selected work", "Things I've shipped"],
  ["telemetry", "04", "Activity", "Live from GitHub"],
  ["connect", "05", "Let's talk", "Open to collaboration"],
];

const BUTTONS = [
  { slug: "portfolio", label: "Portfolio", primary: true },
  { slug: "email", label: "Email me" },
  { slug: "repos", label: "All repos" },
];

const IDENTITY = [
  ["Role", "Full-stack developer & creative technologist"],
  ["Frontend", "TypeScript, Next.js, React, Tailwind"],
  ["Backend", "Node.js, Supabase, PostgreSQL"],
  ["Creative", "Three.js, React Three Fiber, GSAP"],
  ["Games", "Unity, C#"],
];
const NOW_BUILDING = ["Car assembly plant simulation", "Humanoid Rubik's-cube simulation"];
const SHIPPED = ["Liberty 250", "Relic Arena Realms"];

const BOT_LINES = [
  ["Hi, I'm M-11.", "Mahedi's build assistant."],
  ["Currently rendering", "a photoreal car plant in Three.js."],
  ["Favourite stack", "TypeScript, Next.js, R3F, Unity."],
  ["Have an idea worth building?", "Let's talk. Links are below."],
];

const LINK_CHIPS = [
  { slug: "label-source", label: "SOURCE", kind: "label" },
  { slug: "src-auralens", label: "AuraLens", kind: "source" },
  { slug: "src-ielts-app", label: "IELTS App", kind: "source" },
  { slug: "src-storyspark", label: "StorySpark AI", kind: "source" },
  { slug: "src-growzone", label: "GrowZone", kind: "source" },
  { slug: "src-ornaislam", label: "OrnaIslam", kind: "source" },
  { slug: "label-live", label: "MORE LIVE", kind: "label" },
  { slug: "live-zen-bonsai", label: "Zen Bonsai", kind: "live" },
  { slug: "live-beehive", label: "Beehive Manager", kind: "live" },
  { slug: "live-fleetpulse", label: "FleetPulse BD", kind: "live" },
  { slug: "live-rms", label: "RMS", kind: "live" },
];

/** Throws when a line of text would not fit, so copy edits can't silently overflow. */
function fits(text, font, size, max, what, spacing = 0) {
  const w = measure(text, font, size, spacing);
  if (w > max) throw new Error(`${what} too wide (${w.toFixed(0)} > ${max}): ${text}`);
  return w;
}

/* ─────────────────────────────── hero ─────────────────────────────── */

function hero() {
  const W = 1280, H = 480, HZ = 372, CX = W / 2;
  const rand = rng(250);

  const stars = Array.from({ length: 80 }, () => {
    const x = (rand() * W).toFixed(1), y = (rand() * (HZ - 30)).toFixed(1);
    const r = (0.4 + rand() * 0.9).toFixed(2), d = (3 + rand() * 4).toFixed(2), del = (-rand() * 7).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" style="animation:twinkle ${d}s ease-in-out ${del}s infinite"/>`;
  }).join("");

  const vlines = Array.from({ length: 41 }, (_, k) => {
    const i = k - 20;
    return `<line x1="${CX + i * 9}" y1="${HZ}" x2="${CX + i * 110}" y2="${H}"/>`;
  }).join("");
  const N = 7, DUR = 4.2;
  const hlines = Array.from({ length: N }, (_, k) =>
    `<line x1="0" y1="${HZ}" x2="${W}" y2="${HZ}" style="animation:floor ${DUR}s cubic-bezier(.6,0,1,.6) ${(-k * DUR / N).toFixed(2)}s infinite"/>`,
  ).join("");

  const meteors = [[1080, 46, 1.5], [640, 30, 6.5]].map(([x, y, d]) =>
    `<line x1="${x}" y1="${y}" x2="${x + 90}" y2="${y - 45}" stroke="url(#meteor)" stroke-width="1.6" stroke-linecap="round" opacity="0" style="animation:meteor 11s ease-out ${d}s infinite"/>`,
  ).join("");

  const pillText = "Available for collaboration";
  const pillW = 46 + fits(pillText, "sg500", 15, 400, "hero pill");
  fits(NAME, "sg700", 104, 1100, "hero name", -2);
  fits(TAGLINE, "sg400", 24, 1120, "hero tagline");

  const ROLE_Y = 320, SLOT = 3, CYCLE = SLOT * ROLES.length, show = 100 / ROLES.length;
  const roles = ROLES.map((role, i) => {
    const w = measure(role, "mono400", 15, 4);
    return `<g style="animation:role ${CYCLE}s linear ${(-CYCLE + i * SLOT).toFixed(2)}s infinite" opacity="${i === 0 ? 1 : 0}">
  <rect x="${(CX - w / 2 - 36).toFixed(1)}" y="${ROLE_Y - 6}" width="22" height="1.5" fill="${C.cyan}"/>
  <text x="${CX}" y="${ROLE_Y}" text-anchor="middle" class="m4" font-size="15" letter-spacing="4" fill="${C.cyan}">${esc(role)}</text>
  <rect x="${(CX + w / 2 + 14).toFixed(1)}" y="${ROLE_Y - 6}" width="22" height="1.5" fill="${C.cyan}"/>
</g>`;
  }).join("\n");

  const css = fontCss({ sans: [400, 500, 700], mono: [400] }) + base + `
@keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.7}}
@keyframes floor{0%{transform:translateY(0);opacity:0}20%{opacity:.7}100%{transform:translateY(${H - HZ + 4}px);opacity:.7}}
@keyframes meteor{0%{transform:translate(0,0);opacity:0}1%{opacity:.9}8%{transform:translate(-300px,150px);opacity:0}100%{transform:translate(-300px,150px);opacity:0}}
@keyframes driftA{from{transform:translate(0,0)}to{transform:translate(140px,30px)}}
@keyframes driftB{from{transform:translate(0,0)}to{transform:translate(-160px,-20px)}}
@keyframes driftC{from{transform:translate(0,0)}to{transform:translate(90px,-40px)}}
@keyframes role{0%{opacity:0;transform:translateY(5px)}3%{opacity:1;transform:none}${(show - 3).toFixed(2)}%{opacity:1;transform:none}${show.toFixed(2)}%,100%{opacity:0;transform:translateY(-5px)}}
line,g,ellipse{transform-box:view-box}`;

  const defs = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg0}"/><stop offset=".78" stop-color="#090C1F"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<linearGradient id="name" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#DDEBFF"/><stop offset=".75" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
<linearGradient id="hz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>
<mask id="floorMask"><rect x="0" y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#fade)"/></mask>
<linearGradient id="meteor" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="24"/></clipPath>
<clipPath id="skyClip"><rect width="${W}" height="${HZ}"/></clipPath>
${blur("soft", 70)}${blur("halo", 22)}`;

  const body = `<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<g filter="url(#soft)" opacity=".55">
  <ellipse cx="380" cy="170" rx="260" ry="120" fill="${C.violet}" style="animation:driftA 22s ease-in-out infinite alternate"/>
  <ellipse cx="900" cy="150" rx="240" ry="110" fill="${C.cyan}" opacity=".7" style="animation:driftB 26s ease-in-out infinite alternate"/>
  <ellipse cx="660" cy="330" rx="300" ry="70" fill="${C.pink}" opacity=".45" style="animation:driftC 19s ease-in-out infinite alternate"/>
</g>
<g>${stars}</g>
<g clip-path="url(#skyClip)">${meteors}</g>
<g mask="url(#floorMask)">
  <g stroke="${C.cyan}" stroke-width=".8" opacity=".35">${vlines}</g>
  <g stroke="${C.violet}" stroke-width="1">${hlines}</g>
</g>
<rect x="0" y="${HZ}" width="${W}" height="1.5" fill="url(#hz)"/>

<g transform="translate(${(CX - pillW / 2).toFixed(1)} 84)">
  <rect width="${pillW.toFixed(1)}" height="34" rx="17" fill="#FFFFFF" fill-opacity=".05" stroke="#FFFFFF" stroke-opacity=".14"/>
  <circle cx="20" cy="17" r="4.5" fill="${C.lime}" class="pulse"/>
  <text x="34" y="22.5" class="s5" font-size="15" fill="${C.soft}">${pillText}</text>
</g>

<text x="${CX}" y="232" text-anchor="middle" class="s7" font-size="104" letter-spacing="-2" fill="${C.violet}" opacity=".45" filter="url(#halo)">${NAME}</text>
<text x="${CX}" y="232" text-anchor="middle" class="s7" font-size="104" letter-spacing="-2" fill="url(#name)">${NAME}</text>
<text x="${CX}" y="278" text-anchor="middle" class="s4" font-size="24" fill="${C.soft}">${esc(TAGLINE)}</text>

${roles}

<text x="${CX}" y="${H - 34}" text-anchor="middle" class="m4" font-size="13" letter-spacing="2" fill="${C.dim}">${esc(STACK.join("   ·   "))}</text>
</g>
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="23.25" fill="none" stroke="#FFFFFF" stroke-opacity=".1" stroke-width="1.5"/>`;

  return svgDoc({ w: W, h: H, title: `${NAME}: ${TAGLINE}`, css, defs, body });
}

/* ─────────────────────────────── section headers ─────────────────────────────── */

// Transparent, so they come in a dark and a light version (<picture> picks one).
function section(num, title, sub, theme) {
  const W = 1000, H = 86;
  const dark = theme === "dark";
  const ink = dark ? C.text : C.lightText, dim = dark ? C.dim : C.lightDim;
  const idx = dark ? C.cyan : "#3A5BD9";
  fits(title, "sg700", 34, 640, "section title");
  const css = fontCss({ sans: [400, 700], mono: [400] }) + base + `
@keyframes run{from{transform:translateX(0)}to{transform:translateX(${W - 160}px)}}
.run{transform-box:view-box;animation:run 6s ease-in-out infinite alternate}`;
  const defs = `
<linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".45" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></linearGradient>
<linearGradient id="hl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${dark ? 0.9 : 0.7}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  const body = `
<text x="0" y="50" class="m4" font-size="15" letter-spacing="2" fill="${idx}">${num}</text>
<text x="52" y="52" class="s7" font-size="34" letter-spacing="-.5" fill="${ink}">${esc(title)}</text>
<text x="${W}" y="50" text-anchor="end" class="s4" font-size="17" fill="${dim}">${esc(sub)}</text>
<rect x="0" y="72" width="${W}" height="1.5" fill="url(#ln)" opacity="${dark ? 0.85 : 0.7}"/>
<rect x="0" y="71" width="120" height="3.5" fill="url(#hl)" class="run"/>`;
  return svgDoc({ w: W, h: H, title: `${num} ${title}: ${sub}`, css, defs, body });
}

/* ─────────────────────────────── robot scene ─────────────────────────────── */

function robotScene() {
  const W = 1000, H = 330;
  const BX = 336, BY = 40, BW = W - BX - 32, BH = 250;
  const TX = BX + 34, SIZE = 22, SLOT = 4.5, CYCLE = SLOT * BOT_LINES.length;
  const typeDur = 1.3, gap = 0.25;
  const pct = (t) => ((t / CYCLE) * 100).toFixed(3);
  const show = 100 / BOT_LINES.length;
  const P = panel({ w: W, h: H, r: 24 });

  let typeKeys = "";
  const messages = BOT_LINES.map((lines, i) => {
    const delay = (-CYCLE + i * SLOT).toFixed(2);
    const rows = lines.map((line, j) => {
      const font = j === 0 ? "mono700" : "mono400";
      const w = fits(line, font, SIZE, BW - 68, "bot line");
      const start = j * (typeDur + gap), end = start + typeDur;
      const name = `type${i}${j}`;
      const last = j === lines.length - 1;
      typeKeys += `@keyframes ${name}{0%,${pct(start)}%{transform:translateX(0)}${pct(end)}%,100%{transform:translateX(${w.toFixed(1)}px)}}`;
      // The cursor sits on a line only while that line is being typed (the last line keeps it).
      typeKeys += `@keyframes ${name}c{0%{opacity:0}${pct(start)}%{opacity:1}${last ? "" : `${pct(end + gap)}%{opacity:1}${pct(end + gap + 0.01)}%,`}100%{opacity:${last ? 1 : 0}}}`;
      const y = BY + 112 + j * 44;
      return `<text x="${TX}" y="${y}" class="${j === 0 ? "m7" : "m4"}" font-size="${SIZE}" fill="${j === 0 ? C.cyan : C.soft}">${esc(line)}</text>
  <g class="cover" style="animation:${name} ${CYCLE}s steps(${line.length}) ${delay}s infinite">
    <rect x="${TX - 2}" y="${y - 26}" width="${(w + 26).toFixed(1)}" height="36" fill="${C.bg0}"/>
    <g style="animation:${name}c ${CYCLE}s steps(1) ${delay}s infinite"><rect x="${TX}" y="${y - 21}" width="11" height="26" rx="2" fill="${C.violet}" class="blink"/></g>
  </g>`;
    }).join("\n  ");
    return `<g style="animation:msg ${CYCLE}s linear ${delay}s infinite" opacity="${i === 0 ? 1 : 0}">
  ${rows}
</g>`;
  }).join("\n");

  const rand = rng(11);
  const waveBars = Array.from({ length: 24 }, (_, i) => {
    const h = 5 + rand() * 14, d = (0.5 + rand() * 0.6).toFixed(2), del = (-rand()).toFixed(2);
    return `<rect x="${TX + i * 8}" y="${(BY + BH - 30 - h).toFixed(1)}" width="4" height="${h.toFixed(1)}" rx="2" fill="${i % 6 === 2 ? C.violet : C.cyan}" opacity=".8" class="wave" style="animation-duration:${d}s;animation-delay:${del}s"/>`;
  }).join("");
  const motes = Array.from({ length: 18 }, () => {
    const x = (20 + rand() * 300).toFixed(0), y = (80 + rand() * 220).toFixed(0);
    const r = (1 + rand() * 1.4).toFixed(1), d = (6 + rand() * 6).toFixed(1), del = (-rand() * 10).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${rand() > 0.5 ? C.cyan : C.violet}" class="mote" style="animation-duration:${d}s;animation-delay:${del}s"/>`;
  }).join("");

  const css = fontCss({ sans: [700], mono: [400, 700] }) + base + robotCss + `
@keyframes msg{0%{opacity:0}1.5%{opacity:1}${(show - 2).toFixed(3)}%{opacity:1}${show.toFixed(3)}%,100%{opacity:0}}
${typeKeys}
@keyframes wave{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
@keyframes mote{0%{transform:translateY(0);opacity:0}20%{opacity:.7}100%{transform:translateY(-60px);opacity:0}}
@keyframes ping{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.7);opacity:0}}
.wave{transform-box:fill-box;transform-origin:50% 100%;animation:wave .7s ease-in-out infinite alternate}
.mote{animation:mote 8s linear infinite}
.ping{transform-box:fill-box;transform-origin:50% 50%;animation:ping 2.6s ease-out infinite}
@media (prefers-reduced-motion:reduce){.cover{display:none}}`;

  const defs = P.defs + robotDefs + `<clipPath id="bubble"><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="18"/></clipPath>${blur("soft", 50)}`;
  const body = `
${P.back}
<g clip-path="${P.clip}">
  <ellipse cx="172" cy="170" rx="150" ry="120" fill="${C.violet}" opacity=".28" filter="url(#soft)"/>
  ${motes}
</g>
<ellipse cx="172" cy="299" rx="46" ry="9" fill="none" stroke="${C.cyan}" stroke-opacity=".5" class="ping"/>
<g transform="translate(172 118) scale(.8)">${robot()}</g>

<path d="M${BX + 1} ${BY + 72}L${BX - 22} ${BY + 86}L${BX + 1} ${BY + 100}Z" fill="${C.bg0}" stroke="${C.line2}"/>
<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="18" fill="${C.bg0}" stroke="${C.line2}" stroke-width="1.5"/>
<rect x="${BX - 0.5}" y="${BY + 73}" width="3" height="26" fill="${C.bg0}"/>
<circle cx="${TX + 5}" cy="${BY + 37}" r="5" fill="${C.lime}" class="pulse"/>
<text x="${TX + 20}" y="${BY + 43}" class="s7" font-size="17" fill="${C.text}">M-11</text>
<text x="${(TX + 30 + measure("M-11", "sg700", 17)).toFixed(1)}" y="${BY + 43}" class="m4" font-size="14" letter-spacing="1" fill="${C.dim}">build assistant</text>
<line x1="${TX}" y1="${BY + 62}" x2="${BX + BW - 34}" y2="${BY + 62}" stroke="${C.line}"/>
<g clip-path="url(#bubble)">
${messages}
</g>
${waveBars}
${P.edge}`;
  return svgDoc({
    w: W, h: H, css, defs, body,
    title: `M-11, an animated robot mascot, says: ${BOT_LINES.map((l) => l.join(" ")).join(" / ")}`,
  });
}

/* ─────────────────────────────── profile panel ─────────────────────────────── */

function identity() {
  const W = 1000, PAD = 40, KEY_W = 190, ROW = 58, TOP = 128;
  const listTop = TOP + (IDENTITY.length - 1) * ROW + 52;
  const H = listTop + 200;
  const half = (W - PAD * 3) / 2;
  const P = panel({ w: W, h: H, r: 24 });

  const rows = IDENTITY.map(([key, value], i) => {
    const y = TOP + i * ROW;
    fits(value, "sg500", 24, W - PAD * 2 - KEY_W, "profile value");
    return `<g>
  <text x="${PAD}" y="${y}" class="m4" font-size="14" letter-spacing="2" fill="${C.dim}">${esc(key.toUpperCase())}</text>
  <text x="${PAD + KEY_W}" y="${y}" class="s5" font-size="24" fill="${C.text}">${esc(value)}</text>
  ${i < IDENTITY.length - 1 ? `<line x1="${PAD}" y1="${y + 22}" x2="${W - PAD}" y2="${y + 22}" stroke="${C.line}"/>` : ""}
</g>`;
  }).join("\n");

  const list = (title, items, color, x, kind) => {
    const head = `<text x="${x}" y="${listTop + 40}" class="s7" font-size="19" fill="${C.text}">${title}</text>`;
    const entries = items.map((item, i) => {
      const y = listTop + 92 + i * 58;
      fits(item, "sg500", 21, half - 40, "profile list item");
      const mark = kind === "build"
        ? `<circle cx="${x + 8}" cy="${y - 7}" r="5.5" fill="${color}" class="pulse" style="animation-delay:${-i * 0.7}s"/>`
        : `<path d="M${x + 1} ${y - 8}L${x + 7} ${y - 2}L${x + 17} ${y - 14}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      const bar = kind === "build"
        ? `<rect x="${x + 30}" y="${y + 14}" width="${half - 30}" height="3" rx="1.5" fill="${C.line}"/>
<g clip-path="url(#bar${i})"><rect x="${x + 30}" y="${y + 14}" width="110" height="3" rx="1.5" fill="${color}" class="busy" style="animation-delay:${-i * 0.9}s"/></g>
<clipPath id="bar${i}"><rect x="${x + 30}" y="${y + 14}" width="${half - 30}" height="3"/></clipPath>`
        : `<rect x="${x + 30}" y="${y + 14}" width="${half - 30}" height="3" rx="1.5" fill="${color}" opacity=".7"/>`;
      return `${mark}
<text x="${x + 30}" y="${y}" class="s5" font-size="21" fill="${C.soft}">${esc(item)}</text>
${bar}`;
    }).join("\n");
    return `${head}\n${entries}`;
  };

  const status = "Open to collaboration";
  const css = fontCss({ sans: [500, 700], mono: [400] }) + base + `
@keyframes busy{from{transform:translateX(-120px)}to{transform:translateX(${half}px)}}
.busy{animation:busy 2.4s ease-in-out infinite}`;
  const defs = P.defs + blur("soft", 60);
  const body = `
${P.back}
<g clip-path="${P.clip}"><ellipse cx="${W - 120}" cy="0" rx="260" ry="140" fill="${C.cyan}" opacity=".12" filter="url(#soft)"/></g>
<text x="${PAD}" y="58" class="s7" font-size="24" fill="${C.text}">Profile</text>
<circle cx="${(W - PAD - measure(status, "sg500", 16) - 16).toFixed(1)}" cy="52" r="5" fill="${C.lime}" class="pulse"/>
<text x="${W - PAD}" y="58" text-anchor="end" class="s5" font-size="16" fill="${C.soft}">${status}</text>
<line x1="${PAD}" y1="82" x2="${W - PAD}" y2="82" stroke="${C.line2}"/>
${rows}
<line x1="${PAD}" y1="${listTop}" x2="${W - PAD}" y2="${listTop}" stroke="${C.line2}"/>
${list("Now building", NOW_BUILDING, C.amber, PAD, "build")}
${list("Recently shipped", SHIPPED, C.lime, PAD * 2 + half, "shipped")}
${P.edge}`;
  const title = `Profile. ${IDENTITY.map(([k, v]) => `${k}: ${v}`).join(". ")}. Now building: ${NOW_BUILDING.join(", ")}. Recently shipped: ${SHIPPED.join(", ")}.`;
  return svgDoc({ w: W, h: H, title, css, defs, body });
}

/* ─────────────────────────────── toolkit ─────────────────────────────── */

function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Brand colour, lifted so it stays legible on the dark panel. */
function iconColor(hex) {
  const lum = luminance(hex);
  if (lum < 0.22) return C.text;
  if (lum >= 0.4) return `#${hex}`;
  const mix = (i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.6 + 255 * 0.4).toString(16).padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

function toolkit() {
  const W = 1000, ROW = 108, TOP = 34, LABEL_W = 230, TILE = 64, GAP = 60;
  const H = TOP * 2 + ROW * TOOLKIT.length - 20;
  const P = panel({ w: W, h: H, r: 24 });
  const css = fontCss({ sans: [400, 700], mono: [] }) + base + `
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-4px)}}
.bob{animation:bob 1.8s ease-in-out infinite alternate}`;

  const rows = TOOLKIT.map(([label, slugs], r) => {
    const y = TOP + r * ROW;
    const tiles = slugs.map((slug, c) => {
      const x = LABEL_W + c * (TILE + GAP);
      let glyph, name, color;
      if (slug === "csharp") {
        name = "C#"; color = "#B39DFF";
        glyph = `<path d="M12 0L22.4 6V18L12 24L1.6 18V6Z" fill="none" stroke="${color}" stroke-width="2"/><text x="12" y="16" text-anchor="middle" class="s7" font-size="9" fill="${color}">C#</text>`;
      } else {
        const ic = icons[slug];
        name = ic.title; color = iconColor(ic.hex);
        glyph = `<path d="${ic.path}" fill="${color}"/>`;
      }
      return `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${(-(c * 0.4 + r * 0.7) % 3.6).toFixed(2)}s">
  <rect x=".5" y=".5" width="${TILE - 1}" height="${TILE - 1}" rx="16" fill="#FFFFFF" fill-opacity=".03" stroke="#FFFFFF" stroke-opacity=".1"/>
  <rect x="14" y="${TILE - 2}" width="${TILE - 28}" height="2" rx="1" fill="${color}" opacity=".7"/>
  <g transform="translate(${TILE / 2 - 15} ${TILE / 2 - 15}) scale(1.25)">${glyph}</g>
  <text x="${TILE / 2}" y="${TILE + 22}" text-anchor="middle" class="s4" font-size="13.5" fill="${C.dim}">${esc(name)}</text>
</g></g>`;
    }).join("");
    return `<text x="40" y="${y + 38}" class="s7" font-size="19" fill="${C.text}">${esc(label)}</text>
<text x="40" y="${y + 62}" class="s4" font-size="14" fill="${C.faint}">${slugs.length} tools</text>
${tiles}`;
  }).join("\n");

  const body = `${P.back}\n${rows}\n${P.edge}`;
  return svgDoc({ w: W, h: H, title: "Toolkit: TypeScript, JavaScript, C#, HTML, CSS, React, Next.js, Tailwind CSS, Three.js, GSAP, Vite, Node.js, Supabase, PostgreSQL, Vercel, Unity, Git, GitHub, Figma", css, defs: P.defs, body });
}

/* ─────────────────────────────── project cards ─────────────────────────────── */

const STATUS = {
  live: { label: "Live", color: C.lime },
  dev: { label: "In development", color: C.amber },
  source: { label: "Source", color: C.cyan },
};

function card(p, index) {
  // Large type: on a phone each card renders roughly 200px wide.
  const W = 600, H = 320, PAD = 34;
  const accent = ACCENT[p.kind];
  const st = STATUS[p.status];
  const P = panel({ w: W, h: H, r: 22 });

  fits(p.title, "sg700", 36, W - PAD * 2, "card title", -0.5);
  const DESC = 21, LH = 31;
  const lines = wrap(p.desc, "sg400", DESC, W - PAD * 2);
  if (lines.length > 2) throw new Error(`description too long for card: ${p.title}`);

  const pillW = 34 + measure(st.label, "sg500", 14);
  let cx = PAD;
  const chips = p.tech.map((t) => {
    const w = measure(t, "mono400", 13.5) + 24;
    const s = `<g transform="translate(${cx.toFixed(1)} 222)"><rect width="${w.toFixed(1)}" height="30" rx="9" fill="${accent}" fill-opacity=".08" stroke="${accent}" stroke-opacity=".35"/><text x="12" y="20" class="m4" font-size="13.5" fill="${accent}">${esc(t)}</text></g>`;
    cx += w + 8;
    return s;
  }).join("");
  if (cx > W - PAD + 8) throw new Error(`tech chips overflow card: ${p.title}`);

  const css = fontCss({ sans: [400, 500, 700], mono: [400] }) + base + `
@keyframes sweep{to{stroke-dashoffset:-1000}}
@keyframes shimmer{0%{transform:translateX(-300px)}30%,100%{transform:translateX(${W + 80}px)}}
.sweep{animation:sweep 9s linear infinite}
.shimmer{animation:shimmer 8s ease-in-out ${(index * 0.8).toFixed(1)}s infinite}`;
  const defs = P.defs + blur("soft", 46) + `
<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}" stop-opacity="0"/><stop offset="1" stop-color="${accent}"/></linearGradient>
<linearGradient id="holo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  const body = `
${P.back}
<g clip-path="${P.clip}">
  <ellipse cx="${W - 40}" cy="10" rx="180" ry="110" fill="${accent}" opacity=".16" filter="url(#soft)"/>
  <path d="M0 ${H}L130 0H250L120 ${H}Z" fill="url(#holo)" class="shimmer"/>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="21" fill="none" stroke="url(#sw)" stroke-width="1.5" pathLength="1000" stroke-dasharray="120 880" class="sweep" opacity=".8"/>

<text x="${PAD}" y="56" class="m4" font-size="13" letter-spacing="2" fill="${accent}">${esc(p.category.toUpperCase())}</text>
<g transform="translate(${(W - PAD - pillW).toFixed(1)} 34)">
  <rect width="${pillW.toFixed(1)}" height="30" rx="15" fill="${st.color}" fill-opacity=".1" stroke="${st.color}" stroke-opacity=".35"/>
  <circle cx="15" cy="15" r="4" fill="${st.color}" class="pulse"/>
  <text x="26" y="20" class="s5" font-size="14" fill="${st.color}">${st.label}</text>
</g>

<text x="${PAD}" y="118" class="s7" font-size="36" letter-spacing="-.5" fill="${C.text}">${esc(p.title)}</text>
${lines.map((l, i) => `<text x="${PAD}" y="${158 + i * LH}" class="s4" font-size="${DESC}" fill="${C.soft}">${esc(l)}</text>`).join("\n")}

${chips}

<line x1="${PAD}" y1="272" x2="${W - PAD}" y2="272" stroke="${C.line}"/>
<text x="${PAD}" y="298" class="m4" font-size="14" fill="${C.dim}">${esc(p.host)}</text>
${arrowNE(W - PAD - 14, 286, 14, accent, 2)}
${P.edge}`;
  return svgDoc({ w: W, h: H, title: `${p.title}: ${p.desc}`, css, defs, body });
}

/* ─────────────────────────────── link chips ─────────────────────────────── */

function linkChip({ label, kind }) {
  const H = 40;
  if (kind === "label") {
    const W = Math.ceil(measure(label, "mono400", 13, 2) + 28);
    const css = fontCss({ sans: [], mono: [400] }) + base;
    const body = `<rect x="0" y="19" width="10" height="2" fill="${C.violet}"/><text x="18" y="25" class="m4" font-size="13" letter-spacing="2" fill="${C.dim}">${label}</text>`;
    return svgDoc({ w: W, h: H, title: label, css, body });
  }
  const color = kind === "live" ? C.lime : C.cyan;
  const W = Math.ceil(44 + measure(label, "sg500", 16) + 20);
  const icon = kind === "live"
    ? `<path d="M19 14.5L28 20L19 25.5Z" fill="${color}"/>`
    : `<path d="M21 14L15.5 20L21 26M27 14L32.5 20L27 26" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  const css = fontCss({ sans: [500], mono: [] }) + base;
  const body = `
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="${H / 2}" fill="${C.bg1}" stroke="${color}" stroke-opacity=".35" stroke-width="1.5"/>
${icon}
<text x="42" y="26" class="s5" font-size="16" fill="${C.text}">${esc(label)}</text>`;
  return svgDoc({ w: W, h: H, title: label, css, body });
}

/* ─────────────────────────────── buttons & footer ─────────────────────────────── */

function button({ label, primary }) {
  const W = 260, H = 62;
  const css = fontCss({ sans: [700], mono: [] }) + base + `
@keyframes shine{0%{transform:translateX(-140px)}40%,100%{transform:translateX(${W + 40}px)}}
.shine{animation:shine 4.5s ease-in-out infinite}`;
  const defs = `
<linearGradient id="fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".7"/><stop offset="1" stop-color="${C.violet}" stop-opacity=".7"/></linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="pill"><rect width="${W}" height="${H}" rx="${H / 2}"/></clipPath>`;
  const ink = primary ? C.bg0 : C.text;
  const tw = measure(label, "sg700", 19);
  const shape = primary
    ? `<rect width="${W}" height="${H}" rx="${H / 2}" fill="url(#fill)"/>
<g clip-path="url(#pill)"><rect x="0" y="0" width="90" height="${H}" fill="url(#gloss)" class="shine"/></g>`
    : `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${C.bg1}" stroke="url(#edge)" stroke-width="1.5"/>`;
  const x = (W - tw - 30) / 2;
  return svgDoc({
    w: W, h: H, title: label, css, defs,
    body: `${shape}
<text x="${x.toFixed(1)}" y="${H / 2 + 7}" class="s7" font-size="19" fill="${ink}">${esc(label)}</text>
${arrowNE(+(x + tw + 16).toFixed(1), H / 2 - 7, 13, primary ? C.bg0 : C.cyan, 2.2)}`,
  });
}

function footer() {
  const W = 1000, H = 150;
  const P = panel({ w: W, h: H, r: 24 });
  const css = fontCss({ sans: [400, 700], mono: [400] }) + base + robotCss;
  const defs = P.defs + robotDefs + blur("soft", 40);
  const sign = "M-11 SIGNING OFF";
  const body = `
${P.back}
<g clip-path="${P.clip}"><ellipse cx="120" cy="80" rx="120" ry="70" fill="${C.violet}" opacity=".22" filter="url(#soft)"/></g>
<g transform="translate(118 62) scale(.33)">${robot()}</g>
<text x="220" y="70" class="s7" font-size="26" fill="${C.text}">Thanks for stopping by.</text>
<text x="220" y="102" class="s4" font-size="17" fill="${C.dim}">Built with TypeScript, a lot of coffee and one small robot.</text>
<text x="${W - 58}" y="70" text-anchor="end" class="m4" font-size="13" letter-spacing="2" fill="${C.faint}">${sign}</text>
<rect x="${W - 50}" y="58" width="8" height="15" rx="1" fill="${C.cyan}" class="blink"/>
${P.edge}`;
  return svgDoc({ w: W, h: H, title: "Thanks for stopping by. M-11 the robot waves goodbye.", css, defs, body });
}

/* ─────────────────────────────── build ─────────────────────────────── */

write(`${OUT}hero.svg`, hero());
for (const [slug, num, title, sub] of SECTIONS) {
  write(`${OUT}section-${slug}.svg`, section(num, title, sub, "dark"));
  write(`${OUT}section-${slug}-light.svg`, section(num, title, sub, "light"));
}
write(`${OUT}robot.svg`, robotScene());
write(`${OUT}identity.svg`, identity());
write(`${OUT}toolkit.svg`, toolkit());
PROJECTS.forEach((p, i) => write(`${OUT}cards/${p.slug}.svg`, card(p, i)));
for (const c of LINK_CHIPS) write(`${OUT}chips/${c.slug}.svg`, linkChip(c));
for (const b of BUTTONS) write(`${OUT}btn-${b.slug}.svg`, button(b));
write(`${OUT}footer.svg`, footer());
