import './experience.js';
import { getJourney, getState } from './db.js';

const islands = [
  { id: 'island-1', number: 'ISLA 01', title: 'Descubriendo los bioprocesos', short: 'Fundamentos', image: '/assets/images/island-01.svg', href: '/modules.html', requirement: null, kind: 'modules' },
  { id: 'island-2', number: 'ISLA 02', title: 'Memorama de laboratorio', short: 'Memorama', image: '/assets/images/island-02.svg', href: '/game-memorama.html', requirement: 'modules', kind: 'game', gameId: 'game-memorama' },
  { id: 'island-3', number: 'ISLA 03', title: 'Adivina el término', short: 'Ahorcado', image: '/assets/images/island-03.svg', href: '/game-terms.html', requirement: 'game-memorama', kind: 'game', gameId: 'game-terms' },
  { id: 'island-4', number: 'ISLA 04', title: 'Arma el bioproceso', short: 'Secuencia', image: '/assets/images/island-04.svg', href: '/game-sequence.html', requirement: 'game-terms', kind: 'game', gameId: 'game-sequence' },
  { id: 'island-5', number: 'ISLA 05', title: 'Examen final', short: 'Examen final', image: '/assets/images/island-05.svg', href: '/exam.html', requirement: 'exam', kind: 'exam' }
];

const $ = selector => document.querySelector(selector);

function accessible(island, journey) {
  if (!island.requirement) return true;
  if (island.requirement === 'modules') return ['module-1', 'module-2', 'module-3'].every(id => journey.completedModules.includes(id));
  if (island.requirement === 'exam') return journey.stars >= 3;
  return journey.completedGames.includes(island.requirement);
}

function completed(island, journey) {
  if (island.kind === 'modules') return ['module-1', 'module-2', 'module-3'].every(id => journey.completedModules.includes(id));
  if (island.kind === 'game') return journey.completedGames.includes(island.gameId);
  if (island.kind === 'exam') return Boolean(journey.examPassed);
  return false;
}

function renderIsland(island, journey, index) {
  const open = accessible(island, journey);
  const done = completed(island, journey);
  const status = done ? 'Completada' : !open ? 'Bloqueada' : island.kind === 'modules' ? `${journey.completedModules.length}/3 módulos` : island.kind === 'exam' && journey.examAttempts ? 'Nuevo intento disponible' : 'Disponible';
  const action = done ? '✓' : open ? '→' : '⌑';
  const stars = island.kind === 'game' ? (done ? '★' : '☆') : '';
  return `<button class="island-node ${open ? 'is-available' : 'is-locked'} ${done ? 'is-completed' : ''}" data-href="${island.href}" ${open ? '' : 'disabled'} aria-label="${island.title}. ${status}">
    <span class="island-art-wrap"><img class="island-art" src="${island.image}" alt="Ilustración de ${island.title}" loading="${index < 2 ? 'eager' : 'lazy'}"><span class="island-action" aria-hidden="true">${action}</span><span class="island-stars" aria-hidden="true">${stars}</span></span>
    <span class="island-label"><span class="island-number">${island.number}</span><strong>${island.short}</strong></span>
    <span class="island-status">${status}</span>
  </button>`;
}

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export async function renderMap() {
  const [journey, streak] = await Promise.all([
    getJourney(),
    getState('learningStreak', { current: 0, longest: 0, lastDate: null })
  ]);
  const list = $('#island-route-list');
  if (!list) return;
  list.innerHTML = islands.map((item, index) => renderIsland(item, journey, index)).join('');
  list.querySelectorAll('[data-href]').forEach(button => {
    button.addEventListener('click', () => {
      if (!button.disabled) window.location.href = button.dataset.href;
    });
  });

  const modules = journey.completedModules.length;
  const stars = journey.stars;
  const done = modules + stars + (journey.examPassed ? 1 : 0);
  const percentage = Math.round(done / 7 * 100);
  $('#star-count').textContent = stars;
  $('#module-count').textContent = modules;
  $('#top-progress-fill').style.width = `${percentage}%`;
  $('#top-progress-label').textContent = `${percentage}% completado`;
  $('#side-progress-percent').textContent = `${percentage}%`;
  $('#side-progress-fill').style.width = `${percentage}%`;
  $('#side-modules').textContent = `${modules}/3`;
  $('#side-stars').textContent = `${stars}/3`;

  const title = $('#map-progress-title');
  const subtitle = $('#map-progress-subtitle');
  if (title) title.textContent = journey.examPassed ? '¡Recorrido completado!' : stars >= 3 ? '¡El examen está desbloqueado!' : modules < 3 ? 'Tu aventura comienza aquí' : stars === 0 ? 'Tu primer desafío te espera' : 'Vas por buen camino';
  if (subtitle) subtitle.textContent = journey.examPassed ? 'Has aprobado el examen final.' : stars >= 3 ? 'Ya puedes demostrar lo que aprendiste.' : modules < 3 ? `${3 - modules} módulo(s) para desbloquear el primer juego.` : `${3 - stars} estrella(s) para abrir el examen final.`;

  const currentStreak = Number(streak.current || 0);
  const today = localDateKey();
  const activeToday = streak.lastDate === today;
  $('#streak-count').textContent = currentStreak;
  $('#header-streak-count').textContent = currentStreak;
  $('#streak-longest').textContent = `${Number(streak.longest || 0)} ${Number(streak.longest || 0) === 1 ? 'día' : 'días'}`;
  $('#streak-message').textContent = currentStreak === 0
    ? 'Inicia una actividad para encender tu primera racha.'
    : activeToday
      ? '¡Día registrado! Vuelve mañana para mantener tu racha.'
      : 'Completa una actividad hoy para mantener tu racha encendida.';
}

renderMap().catch(error => {
  console.error(error);
  const list = $('#island-route-list');
  if (list) list.innerHTML = '<p class="muted">No se pudo cargar tu progreso. Recarga la aplicación.</p>';
});
