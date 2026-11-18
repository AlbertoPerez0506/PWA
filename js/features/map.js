import { getState, getStars, isIslandUnlocked } from '../core/state.js';
import { navigate } from '../core/router.js';
import { starsHTML, logoSVG } from '../ui/components.js';
import { ISLAND_ICONS } from '../ui/assets.js';
import { openModal } from '../ui/modal.js';

const ISLANDS = [
  { n: 1, id: 'explora', name: 'Explora', desc: 'Descubre los fundamentos de los bioprocesos.', icon: 'book', route: 'lesson' },
  { n: 2, id: 'memorama', name: 'Memorama de laboratorio', desc: 'Relaciona instrumentos con sus nombres y funciones.', icon: 'cards', route: 'memorama' },
  { n: 3, id: 'ahorcado', name: 'Adivina el término', desc: 'Adivina 5 palabras del vocabulario científico.', icon: 'letters', route: 'hangman' },
  { n: 4, id: 'puzzle', name: 'Arma el bioproceso', desc: 'Ordena las etapas de un proceso biotecnológico.', icon: 'puzzle', route: 'puzzle' },
  { n: 5, id: 'examen', name: 'Demuestra lo aprendido', desc: 'Examen final. Requiere las 3 estrellas.', icon: 'trophy', route: 'exam' }
];

export function renderMap(main) {
  const stars = getStars();
  const state = getState();

  main.innerHTML = `
    <div class="map-screen">
      <div class="map-intro">
        <h1 style="margin-bottom:var(--space-2)">Tu ruta por BIOISLAS</h1>
        <p style="color:var(--text-muted-dark); margin-bottom:var(--space-3)">
          ${stars}/3 estrellas · ${state.userProgress.islandsCompleted.length}/5 islas completadas
        </p>
        ${starsHTML(stars)}
      </div>
      <div class="map-path" id="map-path"></div>
    </div>
  `;

  const path = main.querySelector('#map-path');

  ISLANDS.forEach(island => {
    const unlocked = isIslandUnlocked(island.n);
    const completed = state.userProgress.islandsCompleted.includes(island.n);
    const status = completed ? 'completed' : (unlocked ? 'available' : 'locked');
    const statusLabel = completed ? 'Completada' : (unlocked ? 'Disponible' : 'Bloqueada');

    const card = document.createElement('button');
    card.className = `island-card ${status}`;
    card.disabled = !unlocked;
    card.setAttribute('aria-label', `Isla ${island.n}: ${island.name} — ${statusLabel}`);
    card.innerHTML = `
      <div class="island-icon-wrap" style="color:var(--color-accent)">
        <span class="island-number">${island.n}</span>
        ${ISLAND_ICONS[island.icon]}
      </div>
      <div class="island-info">
        <h3 class="island-name">${island.name}</h3>
        <p class="island-desc">${island.desc}</p>
        <span class="island-status ${status}">
          ${completed ? '★ ' : ''}${statusLabel}
        </span>
      </div>
    `;
    card.addEventListener('click', () => {
      if (!unlocked) {
        showLockedInfo(island);
        return;
      }
      navigate(island.route);
    });
    path.appendChild(card);
  });
}

function showLockedInfo(island) {
  const req = island.n === 2 ? 'Completa la isla 1 (Explora).'
    : island.n === 3 ? 'Obtén la primera estrella completando el memorama.'
    : island.n === 4 ? 'Obtén la segunda estrella completando el ahorcado.'
    : island.n === 5 ? 'Reúne las 3 estrellas completando los tres juegos.'
    : '';
  openModal({
    title: `${island.name} está bloqueada`,
    bodyHTML: `<p>${req}</p>`,
    actions: [{ label: 'Entendido', className: 'btn-primary' }]
  });
}
