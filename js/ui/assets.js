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

export const STAR_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="star"><path d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.9 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6z"/></svg>`;

export const ISLAND_ICONS = {
  book: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14 Q20 10 32 14 Q44 10 56 14 V52 Q44 48 32 52 Q20 48 8 52 Z"/><path d="M32 14 V52"/><path d="M14 22 Q22 20 28 22"/><path d="M14 30 Q22 28 28 30"/><path d="M36 22 Q42 20 50 22"/><path d="M36 30 Q42 28 50 30"/></svg>`,
  cards: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="10" y="10" width="22" height="30" rx="3"/><rect x="32" y="24" width="22" height="30" rx="3"/><circle cx="21" cy="25" r="4"/><circle cx="43" cy="39" r="4"/></svg>`,
  letters: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 18 L20 46 L28 18 M14 36 H26"/><circle cx="44" cy="32" r="12"/><path d="M38 32 L44 38 L52 26"/></svg>`,
  puzzle: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 12 H32 V20 Q28 24 32 28 H40 V40 Q36 44 32 48 H20 V40 Q16 36 12 40 V12 Z" fill="currentColor" fill-opacity="0.15"/><path d="M32 12 H44 Q48 16 44 20 V32 Q40 36 44 40 V52 H32 V44 Q28 40 32 36 H40"/></svg>`,
  trophy: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M20 10 H44 V22 Q44 32 32 36 Q20 32 20 22 Z"/><path d="M20 14 H12 V22 Q12 28 20 28"/><path d="M44 14 H52 V22 Q52 28 44 28"/><path d="M32 36 V46"/><path d="M22 54 H42 L40 46 H24 Z"/></svg>`
};

export const INSTRUMENT_SVGS = {
  bioreactor: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="14" y="12" width="36" height="40" rx="10"/><path d="M32 12 V52"/><circle cx="24" cy="24" r="2" fill="currentColor"/><circle cx="24" cy="34" r="2" fill="currentColor"/><circle cx="40" cy="28" r="2" fill="currentColor"/><path d="M14 26 H22"/><path d="M20 6 H44"/></svg>`,
  microscope: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M14 54 H50"/><path d="M20 54 V40 Q20 30 32 30 Q44 30 44 40 V48"/><circle cx="38" cy="18" r="6"/><path d="M38 24 L34 30"/><path d="M32 30 V22"/></svg>`,
  pipette: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M24 8 H40 V24 L46 44 Q46 52 38 52 H26 Q18 52 18 44 L24 24 Z"/><path d="M24 24 H40"/><path d="M30 8 V4 H34 V8"/></svg>`,
  autoclave: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="10" y="18" width="44" height="36" rx="6"/><circle cx="32" cy="36" r="10"/><circle cx="32" cy="36" r="4" fill="currentColor"/><rect x="20" y="10" width="24" height="6" rx="2"/></svg>`,
  centrifuge: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><ellipse cx="32" cy="24" rx="22" ry="6"/><path d="M10 24 V42 Q10 48 32 48 Q54 48 54 42 V24"/><circle cx="32" cy="36" r="4"/><path d="M32 36 L26 42 M32 36 L38 42"/></svg>`,
  phmeter: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><rect x="20" y="8" width="24" height="20" rx="3"/><path d="M32 28 V42"/><path d="M24 44 Q24 52 32 54 Q40 52 40 44 Z"/><path d="M26 16 H38"/></svg>`
};
