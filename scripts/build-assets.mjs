// Generates the static SVGs in assets/ that the profile README uses.
// Run with `node scripts/build-assets.mjs` after editing anything below.
import { readFileSync } from "node:fs";
import {
  C, DISPLAY, MONO, MONO_ADV, fontCss, esc, wrap, chamferPath, brackets, arrowNE, rng, svgDoc, write,
} from "./lib.mjs";

const OUT = new URL("../assets/", import.meta.url).pathname;
const icons = JSON.parse(readFileSync(new URL("./icons.json", import.meta.url)));

/* ─────────────────────────────── data ─────────────────────────────── */

const ROLES = ["FULL-STACK DEVELOPER", "3D WEB ENGINEER", "AI PRODUCT BUILDER", "UNITY GAME DEVELOPER"];

const ACCENT = { web3d: C.cyan, ai: C.magenta, platform: C.violet, game: C.lime };

const PROJECTS = [
  {
    slug: "liberty250", kind: "web3d", category: "3D & CINEMATIC WEB", title: "LIBERTY 250", status: "live",
    desc: "Cinematic scrollytelling for America's 250th birthday: a photoreal globe, GSAP-driven scenes and realtime fireworks.",
    tech: ["Next.js 16", "R3F", "GSAP", "Supabase"], host: "liberty250.vercel.app",
  },
  {
    slug: "vesta", kind: "web3d", category: "3D COMMERCE", title: "VESTA", status: "live",
    desc: "A luxury lifestyle storefront with interactive 3D product previews and a test checkout flow.",
    tech: ["TypeScript", "Three.js", "Vercel"], host: "wearvesta.vercel.app",
  },
  {
    slug: "car-plant", kind: "web3d", category: "3D SIMULATION", title: "CAR PLANT SIMULATION", status: "dev",
    desc: "A near-photoreal browser simulation of an automated car assembly plant.",
    tech: ["Vite", "TypeScript", "Three.js"], host: "work in progress",
  },
  {
    slug: "auralens", kind: "ai", category: "AI APP", title: "AURALENS", status: "live",
    desc: "An AI aesthetic portrait studio for generating polished, stylized portraits.",
    tech: ["Next.js", "TypeScript", "AI"], host: "aura-lens.vercel.app",
  },
  {
    slug: "rind-and-ember", kind: "platform", category: "FULL-STACK PLATFORM", title: "RIND & EMBER", status: "live",
    desc: "Restaurant platform with online ordering, reservations, loyalty, live order tracking and operations tools.",
    tech: ["Next.js", "TypeScript", "Full-stack"], host: "cinder-citrus.vercel.app",
  },
  {
    slug: "ielts-app", kind: "ai", category: "AI EDTECH", title: "IELTS APP", status: "live",
    desc: "An IELTS preparation platform with a built-in AI tutor.",
    tech: ["TypeScript", "AI Tutor"], host: "ielts-app-pi.vercel.app",
  },
  {
    slug: "ai-story-weaver", kind: "ai", category: "GENERATIVE AI", title: "AI STORY WEAVER", status: "live",
    desc: "An AI-powered interactive story generator.",
    tech: ["TypeScript", "Generative AI"], host: "ai-story-weaver-theta.vercel.app",
  },
  {
    slug: "growzone", kind: "platform", category: "E-COMMERCE", title: "GROWZONE", status: "live",
    desc: "A full-stack e-commerce platform.",
    tech: ["TypeScript", "React"], host: "grow-zone.vercel.app",
  },
  {
    slug: "relic-arena", kind: "game", category: "UNITY GAME", title: "RELIC ARENA REALMS", status: "source",
    desc: "A free Windows action arena game, shipped with its Unity source kit and a download website.",
    tech: ["Unity", "C#"], host: "github.com/M-Hasan-11/relic-arena",
  },
  {
    slug: "astrobluster", kind: "game", category: "UNITY GAME", title: "ASTROBLUSTER", status: "source",
    desc: "A 2D space shooting game built in Unity.",
    tech: ["Unity", "C#"], host: "github.com/M-Hasan-11/AstroBluster",
  },
];

const TOOLKIT = [
  ["LANGUAGES", ["typescript", "javascript", "csharp", "html5", "css"]],
  ["FRONTEND / 3D", ["react", "nextdotjs", "tailwindcss", "threedotjs", "gsap", "vite"]],
  ["BACKEND / CLOUD", ["nodedotjs", "supabase", "postgresql", "vercel"]],
  ["GAMES / TOOLS", ["unity", "git", "github", "figma"]],
];

const BUTTONS = [
  { slug: "portfolio", label: "PORTFOLIO", color: C.cyan },
  { slug: "email", label: "EMAIL ME", color: C.magenta },
  { slug: "repos", label: "ALL REPOS", color: C.violet },
];

const SECTIONS = [
  ["about", "01", "ABOUT", "WHO IS BEHIND THE KEYBOARD"],
  ["toolkit", "02", "TOOLKIT", "WEAPONS OF CHOICE"],
  ["work", "03", "FEATURED WORK", "SELECTED BUILDS"],
  ["telemetry", "04", "TELEMETRY", "LIVE GITHUB SIGNAL"],
  ["connect", "05", "CONNECT", "OPEN A CHANNEL"],
];

/* ─────────────────────────────── shared css ─────────────────────────────── */

const baseCss = `
.d{font-family:${DISPLAY};font-weight:800}
.m{font-family:${MONO};font-weight:400}
.mb{font-family:${MONO};font-weight:700}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.pulse{animation:pulse 1.8s ease-in-out infinite}
.blink{animation:blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

const glowFilter = (id, std = 3) =>
  `<filter id="${id}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="${std}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

const monoWidth = (text, size, spacing = 0) => text.length * (size * MONO_ADV + spacing);

/* ─────────────────────────────── hero ─────────────────────────────── */

function hero() {
  const W = 1280, H = 420, HZ = 292, CX = 640, CY = 168;
  const rand = rng(250);

  const stars = Array.from({ length: 110 }, () => {
    const x = (rand() * W).toFixed(1), y = (rand() * (HZ - 20)).toFixed(1);
    const r = (0.5 + rand() * 1.2).toFixed(2);
    const dur = (2 + rand() * 4).toFixed(2), delay = (-rand() * 6).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" style="animation:twinkle ${dur}s ease-in-out ${delay}s infinite"/>`;
  }).join("");

  const vlines = [];
  for (let i = -26; i <= 26; i++) {
    vlines.push(`<line x1="${CX + i * 7}" y1="${HZ}" x2="${CX + i * 95}" y2="${H}"/>`);
  }
  const N = 9, DUR = 3.6;
  const hlines = Array.from({ length: N }, (_, k) =>
    `<line x1="0" y1="${HZ}" x2="${W}" y2="${HZ}" style="animation:floor ${DUR}s cubic-bezier(.6,0,1,.6) ${(-k * DUR / N).toFixed(2)}s infinite"/>`,
  ).join("");

  const ring = (r, color, dash, width, dur, rev, op) =>
    `<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" opacity="${op}" style="animation:spin ${dur}s linear infinite${rev ? " reverse" : ""}"/>`;

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2, r1 = 182, r2 = i % 6 === 0 ? 194 : 188;
    const p = (r) => `${(CX + Math.cos(a) * r).toFixed(1)} ${(CY + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(r1)}L${p(r2)}`;
  }).join("");

  const ROLE_SIZE = 22, ROLE_SP = 4, ROLE_Y = 246, SLOT = 3, CYCLE = SLOT * ROLES.length;
  const roleShow = (100 / ROLES.length).toFixed(3);
  const roles = ROLES.map((role, i) => {
    const text = `> ${role}`;
    const w = monoWidth(text, ROLE_SIZE, ROLE_SP) - ROLE_SP;
    const style = `animation:role ${CYCLE}s linear ${(-CYCLE + i * SLOT).toFixed(2)}s infinite`;
    // The first role stays visible when animation is off (reduced motion, static renderers).
    return `<g style="${style}" opacity="${i === 0 ? 1 : 0}">
  <text x="${CX - w / 2 - 10}" y="${ROLE_Y}" class="m" font-size="${ROLE_SIZE}" letter-spacing="${ROLE_SP}" fill="${C.text}">${esc(text)}</text>
  <rect x="${CX + w / 2 - 4}" y="${ROLE_Y - 18}" width="12" height="22" fill="${C.cyan}" class="blink"/>
</g>`;
  }).join("\n");

  const css = fontCss({ monoBold: true }) + baseCss + `
@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
@keyframes floor{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(${H - HZ + 4}px);opacity:.9}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scan{0%{transform:translateY(-90px)}100%{transform:translateY(${H + 10}px)}}
@keyframes role{0%{opacity:0;transform:translateY(6px)}2%{opacity:1;transform:none}${(+roleShow - 2).toFixed(3)}%{opacity:1;transform:none}${roleShow}%,100%{opacity:0;transform:translateY(-6px)}}
@keyframes glitchA{0%,90%,100%{opacity:0;transform:none}91%{opacity:.85;transform:translate(-5px,1px)}93%{opacity:.85;transform:translate(4px,-2px)}95%{opacity:0}}
@keyframes glitchB{0%,90%,100%{opacity:0;transform:none}92%{opacity:.85;transform:translate(5px,-1px)}94%{opacity:.85;transform:translate(-3px,2px)}96%{opacity:0}}
circle,line,g{transform-box:view-box}
circle[style*=spin]{transform-origin:${CX}px ${CY}px}
`;

  const defs = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${C.bg0}"/><stop offset=".55" stop-color="${C.bg1}"/>
  <stop offset=".695" stop-color="${C.bg2}"/><stop offset=".7" stop-color="${C.bg0}"/><stop offset="1" stop-color="${C.bg0}"/>
</linearGradient>
<radialGradient id="glow" cx=".5" cy="${HZ / H}" r=".5" gradientTransform="translate(0 ${HZ / H}) scale(1 .35) translate(0 -${HZ / H})">
  <stop offset="0" stop-color="${C.magenta}" stop-opacity=".55"/><stop offset=".45" stop-color="${C.violet}" stop-opacity=".18"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="${C.magenta}"/>
</linearGradient>
<linearGradient id="hz" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".3" stop-color="${C.cyan}"/>
  <stop offset=".7" stop-color="${C.magenta}"/><stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff"/>
</linearGradient>
<mask id="floorMask"><rect x="0" y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#fade)"/></mask>
<linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.cyan}" stop-opacity=".07"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
</linearGradient>
<pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#fff" opacity=".035"/></pattern>
<clipPath id="skyClip"><rect width="${W}" height="${HZ}"/></clipPath>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
${glowFilter("g1", 6)}${glowFilter("g2", 2.5)}`;

  const name = "MAHEDI HASAN";
  const nameAttrs = `x="${CX}" y="${CY + 26}" text-anchor="middle" class="d" font-size="80" letter-spacing="7"`;
  const stack = "TYPESCRIPT  /  NEXT.JS  /  REACT THREE FIBER  /  SUPABASE  /  UNITY + C#";
  const stackW = monoWidth(stack, 14, 2);

  const body = `<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g>${stars}</g>
<g clip-path="url(#skyClip)">
  ${ring(206, C.faint, "2 6", 1, 120, false, 1)}
  ${ring(160, C.cyan, "3 9", 1.5, 50, false, 0.45)}
  ${ring(140, C.magenta, "70 24 6 24", 2, 36, true, 0.5)}
  ${ring(118, C.violet, "1 5", 1, 80, false, 0.6)}
  <path d="${ticks}" stroke="${C.cyan}" stroke-width="1.2" opacity=".35"/>
</g>
<g mask="url(#floorMask)">
  <g stroke="${C.cyan}" stroke-width="1.1" opacity=".55">${vlines.join("")}</g>
  <g stroke="${C.magenta}" stroke-width="1.4">${hlines}</g>
</g>
<line x1="0" y1="${HZ}" x2="${W}" y2="${HZ}" stroke="url(#hz)" stroke-width="2" filter="url(#g2)"/>

<text x="${CX}" y="${CY - 64}" text-anchor="middle" class="m" font-size="15" letter-spacing="6" fill="${C.dim}">// HELLO WORLD, I AM</text>
<text ${nameAttrs} fill="${C.cyan}" style="animation:glitchA 7s steps(1) infinite" opacity="0">${name}</text>
<text ${nameAttrs} fill="${C.magenta}" style="animation:glitchB 7s steps(1) infinite" opacity="0">${name}</text>
<text ${nameAttrs} fill="url(#name)" filter="url(#g1)">${name}</text>

${roles}

<rect x="${CX - stackW / 2 - 22}" y="${H - 58}" width="${stackW + 44}" height="34" rx="17" fill="${C.bg0}" fill-opacity=".8" stroke="${C.line}"/>
<text x="${CX}" y="${H - 36}" text-anchor="middle" class="m" font-size="14" letter-spacing="2" fill="${C.cyan}">${esc(stack)}</text>

<g transform="translate(40 44)">
  <path d="M0 -7L7 0L0 7L-7 0Z" fill="${C.magenta}" class="pulse"/>
  <text x="18" y="5" class="m" font-size="14" letter-spacing="3" fill="${C.dim}">SYS://M-HASAN-11</text>
  <text x="18" y="27" class="m" font-size="12" letter-spacing="2" fill="${C.faint}">BUILD 2026.10  /  NODE ONLINE</text>
</g>
<g transform="translate(${W - 40} 44)">
  <text x="0" y="5" text-anchor="end" class="mb" font-size="14" letter-spacing="3" fill="${C.lime}">ONLINE</text>
  <circle cx="-92" cy="0" r="5" fill="${C.lime}" class="pulse"/>
  <text x="0" y="27" text-anchor="end" class="m" font-size="12" letter-spacing="2" fill="${C.faint}">OPEN TO COLLABORATION</text>
</g>

<rect width="${W}" height="${H}" fill="url(#scanlines)"/>
<rect width="${W}" height="90" fill="url(#scanG)" style="animation:scan 7s linear infinite"/>
${brackets(16, 16, W - 32, H - 32, 30, C.cyan, 2)}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${C.line}"/>`;

  return svgDoc({ w: W, h: H, title: "Mahedi Hasan — Full-Stack Developer, 3D Web Engineer, AI Product Builder, Unity Game Developer", css, defs, body });
}

/* ─────────────────────────────── section header ─────────────────────────────── */

function section(num, title, sub) {
  const W = 1000, H = 72;
  const css = fontCss({ mono: true }) + baseCss + `
@keyframes run{0%{transform:translateX(0)}100%{transform:translateX(${W - 140}px)}}
rect{transform-box:view-box}`;
  const defs = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.magenta}" stop-opacity=".1"/></linearGradient>
<linearGradient id="pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
${glowFilter("g", 3)}`;
  const body = `
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 16)}" fill="url(#bg)" stroke="${C.line}"/>
<text x="28" y="44" class="d" font-size="18" fill="${C.magenta}" letter-spacing="2">${num}</text>
<text x="72" y="44" class="m" font-size="18" fill="${C.faint}">//</text>
<text x="108" y="45" class="d" font-size="26" fill="${C.text}" letter-spacing="4" filter="url(#g)">${esc(title)}</text>
<text x="${W - 34}" y="43" text-anchor="end" class="m" font-size="13" letter-spacing="3" fill="${C.dim}">${esc(sub)}</text>
<rect x="28" y="58" width="${W - 76}" height="2" fill="url(#ln)" opacity=".8"/>
<rect x="28" y="56" width="90" height="6" fill="url(#pl)" opacity=".9" style="animation:run 5s ease-in-out infinite alternate"/>
<rect x="${W - 40}" y="54" width="10" height="10" fill="none" stroke="${C.cyan}" stroke-width="1.5" class="pulse"/>`;
  return svgDoc({ w: W, h: H, title: `${num} — ${title}`, css, defs, body });
}

/* ─────────────────────────────── project card ─────────────────────────────── */

const STATUS = {
  live: { label: "LIVE", color: C.lime },
  dev: { label: "IN DEV", color: C.amber },
  source: { label: "SOURCE", color: C.cyan },
};

function card(p, index) {
  const W = 600, H = 300, PAD = 30;
  const accent = ACCENT[p.kind];
  const st = STATUS[p.status];
  const num = String(index + 1).padStart(2, "0");

  const DESC_SIZE = 16.5, DESC_LH = 25;
  const lines = wrap(p.desc, Math.floor((W - PAD * 2) / (DESC_SIZE * MONO_ADV)));
  if (lines.length > 3) throw new Error(`description too long for card: ${p.title}`);

  const pillText = st.label, PILL_SIZE = 12, PILL_SP = 2;
  const pillW = 34 + monoWidth(pillText, PILL_SIZE, PILL_SP);
  const pillX = W - PAD - pillW;

  let cx = PAD;
  const CHIP_SIZE = 12, CHIP_SP = 1;
  const chips = p.tech.map((t) => {
    const label = t.toUpperCase();
    const w = monoWidth(label, CHIP_SIZE, CHIP_SP) + 20;
    const s = `<g transform="translate(${cx} 216)"><rect width="${w}" height="26" rx="3" fill="${accent}" fill-opacity=".07" stroke="${accent}" stroke-opacity=".55"/><text x="10" y="17.5" class="m" font-size="${CHIP_SIZE}" letter-spacing="${CHIP_SP}" fill="${accent}">${esc(label)}</text></g>`;
    cx += w + 8;
    return s;
  }).join("");
  if (cx > W - PAD + 8) throw new Error(`tech chips overflow card: ${p.title}`);

  const css = fontCss({ monoBold: true }) + baseCss + `
@keyframes sweep{to{stroke-dashoffset:-1000}}
.sweep{animation:sweep 7s linear infinite}`;
  const defs = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<radialGradient id="spot" cx="1" cy="0" r=".9"><stop offset="0" stop-color="${accent}" stop-opacity=".16"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}" stop-opacity="0"/><stop offset=".5" stop-color="${accent}"/><stop offset="1" stop-color="#fff"/></linearGradient>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${accent}" stroke-opacity=".06"/></pattern>
${glowFilter("g", 4)}`;
  const shape = chamferPath(1, 1, W - 2, H - 2, 28);
  const body = `
<path d="${shape}" fill="url(#bg)"/>
<path d="${shape}" fill="url(#grid)"/>
<path d="${shape}" fill="url(#spot)"/>
<path d="${shape}" fill="none" stroke="${C.line}" stroke-width="1.5"/>
<path d="${shape}" fill="none" stroke="url(#sw)" stroke-width="2.2" pathLength="1000" stroke-dasharray="110 890" class="sweep" filter="url(#g)"/>

<text x="${PAD}" y="47" class="d" font-size="15" fill="${accent}" letter-spacing="2">${num}</text>
<text x="${PAD + 36}" y="46" class="m" font-size="13" fill="${C.dim}" letter-spacing="2">// ${esc(p.category)}</text>

<g transform="translate(${pillX} 26)">
  <rect width="${pillW}" height="28" rx="14" fill="${st.color}" fill-opacity=".08" stroke="${st.color}" stroke-opacity=".7"/>
  <circle cx="15" cy="14" r="4" fill="${st.color}" class="pulse"/>
  <text x="26" y="18.5" class="mb" font-size="${PILL_SIZE}" letter-spacing="${PILL_SP}" fill="${st.color}">${pillText}</text>
</g>

<text x="${PAD}" y="102" class="d" font-size="29" letter-spacing="1.5" fill="${C.text}">${esc(p.title)}</text>
<rect x="${PAD}" y="116" width="46" height="3" fill="${accent}"/>

${lines.map((l, i) => `<text x="${PAD}" y="${148 + i * DESC_LH}" class="m" font-size="${DESC_SIZE}" fill="#AFC0E6">${esc(l)}</text>`).join("\n")}

${chips}

<line x1="${PAD}" y1="258" x2="${W - PAD}" y2="258" stroke="${C.line}"/>
<text x="${PAD}" y="282" class="m" font-size="13" letter-spacing="1" fill="${C.dim}">${esc(p.host)}</text>
${arrowNE(W - PAD - 13, 270, 13, accent, 2)}`;
  return svgDoc({ w: W, h: H, title: `${p.title} — ${p.desc}`, css, defs, body });
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
  const W = 1000, ROW = 104, TOP = 26, LABEL_W = 220, TILE = 64, GAP = 64;
  const H = TOP * 2 + ROW * TOOLKIT.length - 16;
  const css = fontCss({ display: true, mono: true }) + baseCss;
  const defs = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${C.cyan}" stroke-opacity=".05"/></pattern>
${glowFilter("g", 2.5)}`;

  let i = 0;
  const rows = TOOLKIT.map(([label, slugs], r) => {
    const y = TOP + r * ROW;
    const tiles = slugs.map((slug, c) => {
      const x = LABEL_W + c * (TILE + GAP);
      const delay = (-(i++ * 0.37) % 4).toFixed(2);
      let glyph, name, color;
      if (slug === "csharp") {
        name = "C#"; color = "#A179DC";
        glyph = `<path d="M12 0L22.4 6V18L12 24L1.6 18V6Z" fill="none" stroke="${color}" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" class="d" font-size="9" fill="${color}">C#</text>`;
      } else {
        const ic = icons[slug];
        name = ic.title; color = iconColor(ic.hex);
        glyph = `<path d="${ic.path}" fill="${color}"/>`;
      }
      return `<g transform="translate(${x} ${y})">
  <path d="${chamferPath(0.5, 0.5, TILE - 1, TILE - 1, 12)}" fill="${C.bg0}" stroke="${color}" stroke-opacity=".45"/>
  <path d="${chamferPath(0.5, 0.5, TILE - 1, TILE - 1, 12)}" fill="${color}" fill-opacity=".06"/>
  <g transform="translate(${TILE / 2 - 15} ${TILE / 2 - 15}) scale(1.25)" filter="url(#g)">${glyph}</g>
  <text x="${TILE / 2}" y="${TILE + 18}" text-anchor="middle" class="m" font-size="11" fill="${C.dim}">${esc(name)}</text>
  <rect x="${TILE - 9}" y="${TILE - 9}" width="4" height="4" fill="${color}" style="animation:pulse 2.4s ease-in-out ${delay}s infinite"/>
</g>`;
    }).join("");
    return `<text x="34" y="${y + 30}" class="d" font-size="13" fill="${C.magenta}" letter-spacing="2">${String(r + 1).padStart(2, "0")}</text>
<text x="34" y="${y + 50}" class="m" font-size="13" fill="${C.text}" letter-spacing="2">${esc(label)}</text>
<rect x="34" y="${y + 60}" width="28" height="2" fill="${C.cyan}"/>
${tiles}`;
  }).join("\n");

  const body = `
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 22)}" fill="url(#bg)"/>
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 22)}" fill="url(#grid)"/>
<path d="${chamferPath(0.5, 0.5, W - 1, H - 1, 22)}" fill="none" stroke="${C.line}"/>
${rows}`;
  return svgDoc({ w: W, h: H, title: "Toolkit: TypeScript, JavaScript, C#, HTML, CSS, React, Next.js, Tailwind CSS, Three.js, GSAP, Vite, Node.js, Supabase, PostgreSQL, Vercel, Unity, Git, GitHub, Figma", css, defs, body });
}

/* ─────────────────────────────── buttons & footer ─────────────────────────────── */

function button({ label, color }) {
  const W = 260, H = 58;
  const css = fontCss({ mono: false }) + baseCss + `
@keyframes sweep{to{stroke-dashoffset:-1000}}`;
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>${glowFilter("g", 3)}`;
  const shape = chamferPath(1, 1, W - 2, H - 2, 14);
  const body = `
<path d="${shape}" fill="${C.bg0}"/>
<path d="${shape}" fill="url(#bg)" stroke="${color}" stroke-opacity=".8" stroke-width="1.5"/>
<path d="${shape}" fill="none" stroke="${color}" stroke-width="2.5" pathLength="1000" stroke-dasharray="80 920" filter="url(#g)" style="animation:sweep 4s linear infinite"/>
<text x="28" y="36" class="d" font-size="16" letter-spacing="4" fill="${C.text}">${esc(label)}</text>
${arrowNE(W - 44, 22, 14, color, 2.2)}`;
  return svgDoc({ w: W, h: H, title: label, css, defs, body });
}

function footer() {
  const W = 1000, H = 64;
  const text = "END OF TRANSMISSION";
  const css = fontCss({ display: false }) + baseCss;
  const defs = `<linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".25" stop-color="${C.cyan}"/><stop offset=".75" stop-color="${C.magenta}"/><stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/></linearGradient>`;
  const tw = monoWidth(text, 14, 6);
  const body = `
<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="${C.bg0}"/>
<rect x="40" y="31" width="${W / 2 - tw / 2 - 64}" height="2" fill="url(#ln)"/>
<rect x="${W / 2 + tw / 2 + 24}" y="31" width="${W / 2 - tw / 2 - 64}" height="2" fill="url(#ln)"/>
<text x="${W / 2}" y="37" text-anchor="middle" class="m" font-size="14" letter-spacing="6" fill="${C.dim}">${text}</text>
<rect x="${W / 2 + tw / 2 + 2}" y="24" width="9" height="16" fill="${C.cyan}" class="blink"/>`;
  return svgDoc({ w: W, h: H, title: "End of transmission", css, defs, body });
}

/* ─────────────────────────────── build ─────────────────────────────── */

write(`${OUT}hero.svg`, hero());
for (const [slug, num, title, sub] of SECTIONS) write(`${OUT}section-${slug}.svg`, section(num, title, sub));
PROJECTS.forEach((p, i) => write(`${OUT}cards/${p.slug}.svg`, card(p, i)));
write(`${OUT}toolkit.svg`, toolkit());
for (const b of BUTTONS) write(`${OUT}btn-${b.slug}.svg`, button(b));
write(`${OUT}footer.svg`, footer());
