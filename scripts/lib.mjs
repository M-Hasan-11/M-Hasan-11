// Shared helpers for the profile's self-hosted SVG assets.
// Fonts are embedded as base64 so the SVGs render identically everywhere
// (GitHub serves README images in a sandbox that can't load web fonts).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const fontsDir = new URL("./fonts/", import.meta.url);
const b64 = (file) => readFileSync(new URL(file, fontsDir)).toString("base64");

export const C = {
  bg0: "#04050D",
  bg1: "#0A0E24",
  bg2: "#140B33",
  cyan: "#00F0FF",
  magenta: "#FF2BD6",
  violet: "#8B5CFF",
  lime: "#39FF88",
  amber: "#FFC447",
  text: "#E6F1FF",
  dim: "#8A9BC4",
  faint: "#3A4677",
  line: "#1C2550",
};

export const DISPLAY = "'Orb', 'Orbitron', 'Segoe UI', sans-serif";
export const MONO = "'JBM', 'JetBrains Mono', ui-monospace, Consolas, monospace";
/** JetBrains Mono advance width, in em. */
export const MONO_ADV = 0.6;

export function fontCss({ display = true, mono = true, monoBold = false } = {}) {
  const face = (family, file, weight) =>
    `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;
  return [
    display && face("Orb", "orbitron-800.woff2", 800),
    mono && face("JBM", "jetbrains-mono-400.woff2", 400),
    monoBold && face("JBM", "jetbrains-mono-700.woff2", 700),
  ]
    .filter(Boolean)
    .join("");
}

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Greedy word wrap for monospace text. */
export function wrap(text, maxChars) {
  const lines = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    if (cur && (cur + " " + word).length > maxChars) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cur ? `${cur} ${word}` : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Rectangle with the top-right and bottom-left corners cut off. */
export function chamferPath(x, y, w, h, c) {
  return `M${x} ${y}H${x + w - c}L${x + w} ${y + c}V${y + h}H${x + c}L${x} ${y + h - c}Z`;
}

/** Small HUD brackets in the four corners of a box. */
export function brackets(x, y, w, h, len, color, width = 2) {
  const p = [
    `M${x} ${y + len}V${y}H${x + len}`,
    `M${x + w - len} ${y}H${x + w}V${y + len}`,
    `M${x + w} ${y + h - len}V${y + h}H${x + w - len}`,
    `M${x + len} ${y + h}H${x}V${y + h - len}`,
  ];
  return `<path d="${p.join("")}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
}

/** Up-right arrow drawn as a path (the embedded font subset has no arrow glyphs). */
export function arrowNE(x, y, size, color, width = 2) {
  return `<path d="M${x} ${y + size}L${x + size} ${y}M${x + size * 0.35} ${y}H${x + size}V${y + size * 0.65}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="square"/>`;
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
