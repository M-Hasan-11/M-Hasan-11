// Shared design system for the profile's self-hosted SVG assets.
// Fonts are embedded as base64 so the SVGs render identically everywhere
// (GitHub serves README images in a sandbox that can't load web fonts), and
// text is measured with the fonts' real advance widths so nothing overflows.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const fontsDir = new URL("./fonts/", import.meta.url);
const b64 = (file) => readFileSync(new URL(file, fontsDir)).toString("base64");
const METRICS = JSON.parse(readFileSync(new URL("metrics.json", fontsDir)));

export const C = {
  bg0: "#05060B",
  bg1: "#0B0E1A",
  bg2: "#13163A",
  line: "#1E2440",
  line2: "#2A3158",
  text: "#EDF2FF",
  soft: "#C3CCE6",
  dim: "#8C97B8",
  faint: "#4A5578",
  cyan: "#38E1FF",
  violet: "#8B7CFF",
  pink: "#F472B6",
  lime: "#4ADE80",
  amber: "#FBBF24",
  // Light-theme counterparts, for assets that sit directly on the page.
  lightText: "#0B1020",
  lightDim: "#5B6584",
  lightLine: "#D8DEEE",
};

export const SANS = "'SG', 'Space Grotesk', 'Segoe UI', sans-serif";
export const MONO = "'JBM', 'JetBrains Mono', ui-monospace, Consolas, monospace";

/** Font faces to embed. Only include what an asset uses; each adds ~6-8 KB. */
export function fontCss({ sans = [500, 700], mono = [400] } = {}) {
  const face = (family, file, weight) =>
    `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;
  return [
    ...sans.map((w) => face("SG", `space-grotesk-${w}.woff2`, w)),
    ...mono.map((w) => face("JBM", `jetbrains-mono-${w}.woff2`, w)),
  ].join("");
}

/** Text classes shared by every asset: s4/s5/s7 = sans weights, m4/m7 = mono. */
export const typeCss = `
.s4{font-family:${SANS};font-weight:400}.s5{font-family:${SANS};font-weight:500}.s7{font-family:${SANS};font-weight:700}
.m4{font-family:${MONO};font-weight:400}.m7{font-family:${MONO};font-weight:700}`;

/** Width in px of `text` in font key (sg400|sg500|sg700|mono400|mono700). */
export function measure(text, font, size, letterSpacing = 0) {
  const m = METRICS[font];
  let w = 0;
  for (const ch of text) w += (m[ch] ?? 0.6) * size;
  return w + letterSpacing * Math.max(0, [...text].length - 1);
}

/** Greedy word wrap to a pixel width. */
export function wrap(text, font, size, maxWidth) {
  const lines = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && measure(next, font, size) > maxWidth) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** A panel: soft gradient fill, hairline border, faint top highlight. */
export function panel({ w, h, r = 22, id = "p" }) {
  return {
    defs: `
<linearGradient id="${id}Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
<linearGradient id="${id}Edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".4" stop-color="#FFFFFF" stop-opacity=".05"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".1"/></linearGradient>
<clipPath id="${id}Clip"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}"/></clipPath>`,
    back: `<rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="url(#${id}Fill)"/>`,
    edge: `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="${r - 0.75}" fill="none" stroke="url(#${id}Edge)" stroke-width="1.5"/>`,
    clip: `url(#${id}Clip)`,
  };
}

/** Soft blurred colour blob, the building block of the aurora backgrounds. */
export const blur = (id, std) =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${std}"/></filter>`;

export const glow = (id, std = 3) =>
  `<filter id="${id}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="${std}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

/** Up-right arrow drawn as a path (the font subsets have no arrow glyphs). */
export function arrowNE(x, y, size, color, width = 2) {
  return `<path d="M${x} ${y + size}L${x + size} ${y}M${x + size * 0.3} ${y}H${x + size}V${y + size * 0.7}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Deterministic PRNG so regenerated assets don't churn in git. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const motionCss = `
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.pulse{animation:pulse 2s ease-in-out infinite}
.blink{animation:blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

export function svgDoc({ w, h, title, css = "", defs = "", body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${css}</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

export function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`wrote ${path} (${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
}
