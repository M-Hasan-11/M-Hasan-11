// M-11, the profile's robot mascot. Drawn around (0, 0) at the neck; spans
// roughly x -80..80 and y -132..236. Every animated part is its own element
// without a transform attribute, so CSS animations never fight placement.
import { C } from "./lib.mjs";

export const robotCss = `
@keyframes r-hover{from{transform:translateY(0)}to{transform:translateY(-12px)}}
@keyframes r-shadow{from{transform:scale(1);opacity:.35}to{transform:scale(.78);opacity:.18}}
@keyframes r-flame{0%,100%{transform:scaleY(1);opacity:.9}25%{transform:scaleY(.72);opacity:.7}50%{transform:scaleY(1.12);opacity:1}75%{transform:scaleY(.85);opacity:.8}}
@keyframes r-look{0%,18%{transform:translateX(0)}22%,40%{transform:translateX(-7px)}44%,62%{transform:translateX(7px)}66%,100%{transform:translateX(0)}}
@keyframes r-blink{0%,46%,50%,94%,98%,100%{transform:scaleY(1)}48%,96%{transform:scaleY(.1)}}
@keyframes r-wave{0%,48%,100%{transform:rotate(-10deg)}6%{transform:rotate(-150deg)}11%{transform:rotate(-112deg)}16%{transform:rotate(-150deg)}21%{transform:rotate(-112deg)}26%{transform:rotate(-150deg)}31%{transform:rotate(-112deg)}38%{transform:rotate(-150deg)}}
@keyframes r-idle-l{0%,100%{transform:rotate(12deg)}50%{transform:rotate(4deg)}}
@keyframes r-idle-r{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(-4deg)}}
@keyframes r-core{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.82)}}
@keyframes r-spin{to{transform:rotate(360deg)}}
@keyframes r-tip{0%,100%{opacity:1}50%{opacity:.2}}
.r-hover{animation:r-hover 2.6s ease-in-out infinite alternate}
.r-shadow{transform-box:fill-box;transform-origin:50% 50%;animation:r-shadow 2.6s ease-in-out infinite alternate}
.r-flame{transform-box:fill-box;transform-origin:50% 0;animation:r-flame .35s linear infinite}
.r-look{animation:r-look 7s ease-in-out infinite}
.r-blink{transform-box:fill-box;transform-origin:50% 50%;animation:r-blink 5.5s linear infinite}
.r-wave{transform-box:fill-box;transform-origin:50% 8%;animation:r-wave 6s ease-in-out infinite}
.r-idle-l{transform-box:fill-box;transform-origin:50% 8%;animation:r-idle-l 3s ease-in-out infinite}
.r-idle-r{transform-box:fill-box;transform-origin:50% 8%;animation:r-idle-r 3s ease-in-out infinite}
.r-core{transform-box:fill-box;transform-origin:50% 50%;animation:r-core 2.2s ease-in-out infinite}
.r-ring{transform-box:fill-box;transform-origin:50% 50%;animation:r-spin 6s linear infinite}
.r-tip{animation:r-tip 1.4s ease-in-out infinite}
`;

export const robotDefs = `
<linearGradient id="r-shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26306A"/><stop offset="1" stop-color="#0E1334"/></linearGradient>
<linearGradient id="r-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#222B60"/><stop offset="1" stop-color="#0B0F2A"/></linearGradient>
<radialGradient id="r-coreG"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="${C.magenta}"/><stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/></radialGradient>
<linearGradient id="r-flameG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></linearGradient>
<filter id="r-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

function arm(side, animClass) {
  const x = side * 58;
  return `<g transform="translate(${x} 22)"><g class="${animClass}">
  <rect x="-9" y="0" width="18" height="62" rx="9" fill="url(#r-body)" stroke="${C.violet}" stroke-opacity=".7" stroke-width="1.5"/>
  <rect x="-9" y="26" width="18" height="5" fill="${C.cyan}" opacity=".5"/>
  <circle cx="0" cy="70" r="12" fill="#1B2350" stroke="${C.cyan}" stroke-width="1.5"/>
  <circle cx="0" cy="70" r="4" fill="${C.cyan}" filter="url(#r-glow)"/>
</g></g>`;
}

/** The robot. `wave` makes the right arm wave periodically. */
export function robot({ wave = true } = {}) {
  return `<g>
<ellipse cx="0" cy="226" rx="62" ry="10" fill="${C.cyan}" class="r-shadow"/>
<g class="r-hover">
  <path d="M-16 150Q0 214 16 150Z" fill="url(#r-flameG)" class="r-flame" filter="url(#r-glow)"/>
  <rect x="-22" y="136" width="44" height="16" rx="5" fill="#141A3A" stroke="${C.faint}"/>

  ${arm(-1, "r-idle-l")}
  ${arm(1, wave ? "r-wave" : "r-idle-r")}

  <rect x="-52" y="8" width="104" height="132" rx="32" fill="url(#r-body)" stroke="${C.violet}" stroke-opacity=".8" stroke-width="2"/>
  <path d="M-30 30H30M-36 118H36" stroke="${C.faint}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="0" cy="72" r="26" fill="none" stroke="${C.cyan}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="8 6" class="r-ring"/>
  <circle cx="0" cy="72" r="20" fill="url(#r-coreG)" class="r-core"/>
  <rect x="-34" y="100" width="10" height="5" rx="2" fill="${C.lime}" class="r-tip"/>
  <rect x="-20" y="100" width="10" height="5" rx="2" fill="${C.amber}"/>
  <rect x="24" y="100" width="10" height="5" rx="2" fill="${C.cyan}" class="r-tip" style="animation-delay:-.7s"/>

  <rect x="-14" y="-4" width="28" height="16" rx="4" fill="#141A3A"/>

  <line x1="0" y1="-96" x2="0" y2="-120" stroke="${C.dim}" stroke-width="3"/>
  <circle cx="0" cy="-126" r="7" fill="${C.magenta}" filter="url(#r-glow)" class="r-tip"/>
  <rect x="-78" y="-66" width="14" height="40" rx="6" fill="${C.violet}"/>
  <rect x="64" y="-66" width="14" height="40" rx="6" fill="${C.violet}"/>
  <rect x="-66" y="-98" width="132" height="98" rx="30" fill="url(#r-shell)" stroke="${C.cyan}" stroke-opacity=".8" stroke-width="2"/>
  <rect x="-50" y="-80" width="100" height="58" rx="18" fill="#04050D" stroke="${C.line}" stroke-width="2"/>
  <g class="r-look"><g class="r-blink" filter="url(#r-glow)">
    <rect x="-30" y="-68" width="18" height="26" rx="8" fill="${C.cyan}"/>
    <rect x="12" y="-68" width="18" height="26" rx="8" fill="${C.cyan}"/>
  </g></g>
  <path d="M-10 -32Q0 -25 10 -32" fill="none" stroke="${C.cyan}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
  <path d="M-40 -88Q-20 -96 6 -92" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>
</g>
</g>`;
}
