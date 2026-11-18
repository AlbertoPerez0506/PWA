// js/features/map.js
import { getState, isIslandUnlocked } from '../core/state.js';
import { navigate } from '../core/router.js';
import { ISLAND_ICONS, STAR_SVG, treeSVG, rockSVG, towerSVG, templeSVG } from '../ui/assets.js';
import { toast } from '../ui/modal.js';

const ISLANDS = [
  { n: 1, key: 'book',    name: 'Explora',            desc: 'Fundamentos de los bioprocesos', route: 'lesson'   },
  { n: 2, key: 'cards',   name: 'Memorama',           desc: 'Instrumentos de laboratorio',    route: 'memorama' },
  { n: 3, key: 'letters', name: 'Adivina el término', desc: 'Vocabulario científico',         route: 'hangman'  },
  { n: 4, key: 'puzzle',  name: 'Arma el bioproceso', desc: 'Ordena las etapas',              route: 'puzzle'   },
  { n: 5, key: 'trophy',  name: 'Examen final',       desc: 'Pon a prueba lo aprendido',      route: 'exam'     }
];

export function renderMap(main) {
  const state = getState();
  const completed = new Set(state.userProgress.islandsCompleted || []);
  const modulesDone = Array.isArray(state.lessonProgress?.modulesCompleted)
    ? state.lessonProgress.modulesCompleted.length
    : 0;

  const starsEarned =
    (completed.has(2) ? 1 : 0) +
    (completed.has(3) ? 1 : 0) +
    (completed.has(4) ? 1 : 0);

  const isCompleted = (n) => completed.has(n);
  const isUnlocked  = (n) => isIslandUnlocked(n);
  const isCurrent   = (n) => isUnlocked(n) && !isCompleted(n);

  main.innerHTML = `
    <section class="map-screen" aria-labelledby="map-title">
      <header class="map-intro">
        <h1 id="map-title">La ruta de los bioprocesos</h1>
        <p class="map-subtitle">Explora el archipiélago y domina cada etapa.</p>
        <div class="map-stars" aria-label="${starsEarned} de 3 estrellas obtenidas">
          ${renderStarsInline(starsEarned)}
          <span>${starsEarned} / 3 estrellas</span>
        </div>
      </header>

      <div class="map-canvas" role="application" aria-label="Mapa del archipiélago BIOISLAS">
        ${renderSVG()}

        <ol class="map-nodes">
          ${ISLANDS.map((island) => renderNode(island, {
            completed: isCompleted(island.n),
            unlocked:  isUnlocked(island.n),
            current:   isCurrent(island.n),
            modulesDone: island.n === 1 ? modulesDone : null
          })).join('')}
        </ol>
      </div>
    </section>
  `;

  main.querySelectorAll('.map-node').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = Number(btn.dataset.island);
      if (!isUnlocked(n)) {
        const prev = n === 2 ? 'la Isla 01' : `la Isla 0${n - 1}`;
        toast(`Primero completa ${prev}.`);
        return;
      }
      const route = ISLANDS.find((i) => i.n === n)?.route;
      if (route) navigate(route);
    });
  });
}

function renderStarsInline(count) {
  let out = '';
  for (let i = 0; i < 3; i++) {
    out += STAR_SVG.replace('class="star"', `class="star ${i < count ? 'earned' : ''}"`);
  }
  return out;
}

function renderNode(island, { completed, unlocked, current, modulesDone }) {
  const stateClass = completed ? 'state-completed'
    : current    ? 'state-current state-available'
    : unlocked   ? 'state-available'
    : 'state-locked';

  const statusText = completed ? 'Completada'
    : current    ? 'Siguiente'
    : unlocked   ? 'Disponible'
    : 'Bloqueada';

  const ariaLabel =
    `${island.name}. ${statusText}.` +
    (modulesDone != null ? ` Progreso: ${modulesDone} de 3 módulos.` : '');

  const sub = modulesDone != null
    ? `<span class="map-node-subprogress">${modulesDone} / 3</span>`
    : '';

  return `
    <li class="map-node-item">
      <button
        type="button"
        class="map-node ${stateClass}"
        data-island="${island.n}"
        aria-label="${ariaLabel}"
        ${unlocked ? '' : 'aria-disabled="true"'}
      >
        <span class="map-node-num" aria-hidden="true">${island.n}</span>
        ${ISLAND_ICONS[island.key] || ''}
      </button>
      <span class="map-node-label">${island.name}</span>
      ${sub}
    </li>
  `;
}

/* ---------- SVG del archipiélago con islas 3D ---------- */

function renderSVG() {
  return `
    <svg class="map-svg" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="waterGrad" cx="50%" cy="35%" r="85%">
          <stop offset="0%" stop-color="#E8EFEA"/>
          <stop offset="100%" stop-color="#C8D8D2"/>
        </radialGradient>
        <radialGradient id="islandGrass" cx="35%" cy="25%" r="80%">
          <stop offset="0%"  stop-color="#A8D4B8"/>
          <stop offset="55%" stop-color="#7BA685"/>
          <stop offset="100%" stop-color="#4F7A5E"/>
        </radialGradient>
        <linearGradient id="islandSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#F2DDB3"/>
          <stop offset="100%" stop-color="#C9AE7A"/>
        </linearGradient>
        <radialGradient id="islandShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="rgba(26,64,46,0.42)"/>
          <stop offset="100%" stop-color="rgba(26,64,46,0)"/>
        </radialGradient>
        <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.55)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>

      <!-- Agua -->
      <rect width="400" height="900" fill="url(#waterGrad)"/>

      <!-- Destellos de agua -->
      <ellipse cx="80"  cy="180" rx="90" ry="10" fill="url(#waveGlow)" opacity="0.6"/>
      <ellipse cx="320" cy="360" rx="110" ry="12" fill="url(#waveGlow)" opacity="0.5"/>
      <ellipse cx="70"  cy="560" rx="80" ry="10" fill="url(#waveGlow)" opacity="0.55"/>
      <ellipse cx="310" cy="720" rx="100" ry="11" fill="url(#waveGlow)" opacity="0.5"/>

      <!-- Ondas decorativas -->
      <path class="wave-line" d="M 0 150 Q 50 140 100 150 T 200 150 T 300 150 T 400 150" stroke="#B8CFC6" stroke-width="1.5" fill="none" opacity="0.5"/>
      <path class="wave-line" d="M 0 420 Q 50 410 100 420 T 200 420 T 300 420 T 400 420" stroke="#B8CFC6" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path class="wave-line" d="M 0 700 Q 50 690 100 700 T 200 700 T 300 700 T 400 700" stroke="#B8CFC6" stroke-width="1.5" fill="none" opacity="0.4"/>

      <!-- Ruta -->
      <path class="map-path-shadow" d="M 120 99 Q 220 140 280 252 Q 210 340 120 414 Q 90 500 280 576 Q 260 690 140 792"/>
      <path class="map-path-main"   d="M 120 99 Q 220 140 280 252 Q 210 340 120 414 Q 90 500 280 576 Q 260 690 140 792"/>

      <!-- Islas 3D (dibujadas después para que la ruta se vea por debajo) -->
      ${island3D(120, 99,  90, 60, 1)}
      ${island3D(280, 252, 95, 62, 2)}
      ${island3D(120, 414, 92, 60, 3)}
      ${island3D(280, 576, 100, 66, 4)}
      ${island3D(140, 792, 105, 68, 5)}
    </svg>
  `;
}

function island3D(cx, cy, rx, ry, idx) {
  // Diferentes orientaciones de luz/decoración por isla
  const decor = islandDecor(idx, rx, ry);
  const highlightX = -rx * 0.22;
  const highlightY = -ry * 0.42;

  return `
    <g class="island-3d island-${idx}" transform="translate(${cx},${cy})">
      <!-- Sombra proyectada sobre el agua -->
      <ellipse cx="4" cy="${ry * 0.55}" rx="${rx * 1.08}" ry="${ry * 0.42}" fill="url(#islandShadow)"/>

      <!-- Anillo de espuma alrededor -->
      <ellipse cx="0" cy="${ry * 0.32}" rx="${rx * 1.1}" ry="${ry * 0.55}"
               fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.8"
               stroke-dasharray="5 9"/>

      <!-- Playita (base color arena) -->
      <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="url(#islandSand)"/>

      <!-- Césped con volumen -->
      <ellipse cx="0" cy="${-ry * 0.12}" rx="${rx * 0.86}" ry="${ry * 0.72}" fill="url(#islandGrass)"/>

      <!-- Highlight superior (luz del sol) -->
      <ellipse cx="${highlightX}" cy="${highlightY}" rx="${rx * 0.42}" ry="${ry * 0.22}"
               fill="rgba(255,255,255,0.32)"/>

      <!-- Brillo más pequeño -->
      <ellipse cx="${highlightX - rx * 0.08}" cy="${highlightY - ry * 0.05}" rx="${rx * 0.18}" ry="${ry * 0.09}"
               fill="rgba(255,255,255,0.5)"/>

      <!-- Decoración 3D -->
      ${decor}
    </g>
  `;
}

function islandDecor(idx, rx, ry) {
  const parts = [];
  // Árboles repartidos (varían por isla)
  const trees = [
    [-rx * 0.55, -ry * 0.10, 1.00],
    [ rx * 0.45, -ry * 0.15, 1.10],
    [ rx * 0.05,  ry * 0.20, 0.85],
    [-rx * 0.20,  ry * 0.35, 0.75]
  ];
  trees.forEach(([x, y, s], i) => {
    if ((idx + i) % 3 !== 0) parts.push(treeSVG(x, y, s));
  });

  // Rocas
  parts.push(rockSVG(rx * 0.62, ry * 0.22, 0.9));
  if (idx % 2 === 0) parts.push(rockSVG(-rx * 0.62, ry * 0.18, 0.7));

  // Elemento singular por isla
  switch (idx) {
    case 1: parts.push(templeSVG(-rx * 0.05, -ry * 0.15, 0.9)); break;
    case 3: parts.push(towerSVG(rx * 0.45, -ry * 0.28, 1.0));   break;
    case 4: parts.push(rockSVG(-rx * 0.45, ry * 0.05, 1.2));    break;
    case 5: parts.push(templeSVG(0, -ry * 0.10, 1.25));         break;
    default: break;
  }
  return parts.join('');
}
