// SVGs inline para no depender de archivos externos
export const LOGO_SVG = `
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BIOISLAS">
  <defs>
    <linearGradient id="bioGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#239B72"/>
      <stop offset="100%" stop-color="#38B8AF"/>
    </linearGradient>
  </defs>
  <circle cx="120" cy="120" r="105" fill="none" stroke="#38B8AF" stroke-width="4" stroke-dasharray="380 60" opacity="0.55"/>
  <circle cx="120" cy="55" r="14" fill="url(#bioGrad)"/>
  <circle cx="70" cy="100" r="12" fill="#65C995"/>
  <circle cx="170" cy="100" r="12" fill="#65C995"/>
  <circle cx="80" cy="170" r="12" fill="#38B8AF"/>
  <circle cx="160" cy="170" r="14" fill="#F3BD4F"/>
  <path d="M120 55 L120 100 M120 100 L70 100 M120 100 L170 100 M70 100 L80 170 M170 100 L160 170 M80 170 L160 170"
        stroke="#38B8AF" stroke-width="3" fill="none" opacity="0.8"/>
  <circle cx="120" cy="120" r="30" fill="none" stroke="url(#bioGrad)" stroke-width="3" opacity="0.6"/>
</svg>`;

export const STAR_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="star" aria-hidden="true"><path d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.9 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>`;

/* ---------- Iconos de interfaz (sin emojis) ---------- */
const I = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  map: I(`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>`),
  chart: I(`<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`),
  download: I(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`),
  gear: I(`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`),
  star: I(`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`),
  check: I(`<polyline points="20 6 9 17 4 12"/>`),
  close: I(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`),
  arrowLeft: I(`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`),
  arrowRight: I(`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`)
};

export const ISLAND_ICONS = {
  book: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14 Q20 10 32 14 Q44 10 56 14 V52 Q44 48 32 52 Q20 48 8 52 Z"/><path d="M32 14 V52"/><path d="M14 22 Q22 20 28 22"/><path d="M14 30 Q22 28 28 30"/><path d="M36 22 Q42 20 50 22"/><path d="M36 30 Q42 28 50 30"/></svg>`,
  cards: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="10" y="10" width="22" height="30" rx="3"/><rect x="32" y="24" width="22" height="30" rx="3"/><circle cx="21" cy="25" r="4"/><circle cx="43" cy="39" r="4"/></svg>`,
  letters: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 18 L20 46 L28 18 M14 36 H26"/><circle cx="44" cy="32" r="12"/><path d="M38 32 L44 38 L52 26"/></svg>`,
  puzzle: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 12 H32 V20 Q28 24 32 28 H40 V40 Q36 44 32 48 H20 V40 Q16 36 12 40 V12 Z" fill="currentColor" fill-opacity="0.15"/><path d="M32 12 H44 Q48 16 44 20 V32 Q40 36 44 40 V52 H32 V44 Q28 40 32 36 H40"/></svg>`,
  trophy: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 10 H44 V22 Q44 32 32 36 Q20 32 20 22 Z"/><path d="M20 14 H12 V22 Q12 28 20 28"/><path d="M44 14 H52 V22 Q52 28 44 28"/><path d="M32 36 V46"/><path d="M22 54 H42 L40 46 H24 Z"/></svg>`
};

/* ---------- Decoración 3D para islas (coordenadas relativas al centro) ---------- */
export function treeSVG(x, y, scale = 1) {
  return `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="-2.5" y="0" width="5" height="9" fill="#6B4A2E"/>
      <ellipse cx="0" cy="-6" rx="10" ry="8" fill="#4F7A5E"/>
      <ellipse cx="-2" cy="-8" rx="6.5" ry="5" fill="#7BA685"/>
      <ellipse cx="-3" cy="-10" rx="3" ry="2" fill="rgba(255,255,255,0.45)"/>
    </g>`;
}

export function rockSVG(x, y, scale = 1) {
  return `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="1" rx="6" ry="4" fill="#8A9A92"/>
      <ellipse cx="-1" cy="0" rx="4" ry="2.5" fill="#A8B5AD"/>
      <ellipse cx="-2" cy="-1" rx="2" ry="1.2" fill="rgba(255,255,255,0.5)"/>
    </g>`;
}

export function towerSVG(x, y, scale = 1) {
  return `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="-6" y="-14" width="12" height="16" rx="1.5" fill="#C9AE7A"/>
      <polygon points="-8,-14 8,-14 0,-22" fill="#8A4F3A"/>
      <rect x="-3" y="-9" width="6" height="6" fill="#1A402E"/>
      <ellipse cx="0" cy="2" rx="8" ry="2" fill="rgba(0,0,0,0.15)"/>
    </g>`;
}

export function templeSVG(x, y, scale = 1) {
  return `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="-10" y="-12" width="20" height="4" fill="#E8D4A8"/>
      <rect x="-8" y="-8" width="16" height="2" fill="#C9AE7A"/>
      <rect x="-7" y="-6" width="3" height="6" fill="#E8D4A8"/>
      <rect x="-1" y="-6" width="3" height="6" fill="#E8D4A8"/>
      <rect x="5" y="-6" width="3" height="6" fill="#E8D4A8"/>
      <rect x="-10" y="0" width="20" height="3" fill="#C9AE7A"/>
    </g>`;
}

export const INSTRUMENT_SVGS = {
  bioreactor: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="14" y="12" width="36" height="40" rx="10"/><path d="M32 12 V52"/><circle cx="24" cy="24" r="2" fill="currentColor"/><circle cx="24" cy="34" r="2" fill="currentColor"/><circle cx="40" cy="28" r="2" fill="currentColor"/><path d="M14 26 H22"/><path d="M20 6 H44"/></svg>`,
  microscope: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M14 54 H50"/><path d="M20 54 V40 Q20 30 32 30 Q44 30 44 40 V48"/><circle cx="38" cy="18" r="6"/><path d="M38 24 L34 30"/><path d="M32 30 V22"/></svg>`,
  pipette: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M24 8 H40 V24 L46 44 Q46 52 38 52 H26 Q18 52 18 44 L24 24 Z"/><path d="M24 24 H40"/><path d="M30 8 V4 H34 V8"/></svg>`,
  autoclave: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="10" y="18" width="44" height="36" rx="6"/><circle cx="32" cy="36" r="10"/><circle cx="32" cy="36" r="4" fill="currentColor"/><rect x="20" y="10" width="24" height="6" rx="2"/></svg>`,
  centrifuge: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><ellipse cx="32" cy="24" rx="22" ry="6"/><path d="M10 24 V42 Q10 48 32 48 Q54 48 54 42 V24"/><circle cx="32" cy="36" r="4"/><path d="M32 36 L26 42 M32 36 L38 42"/></svg>`,
  phmeter: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><rect x="20" y="8" width="24" height="20" rx="3"/><path d="M32 28 V42"/><path d="M24 44 Q24 52 32 54 Q40 52 40 44 Z"/><path d="M26 16 H38"/></svg>`
};
