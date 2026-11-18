import { loadState, getState, updateSettings } from './core/state.js';
import { startRouter, registerRoute } from './core/router.js';
import { setAudioEnabled, setVolume } from './ui/audio.js';
import { renderWelcome } from './features/welcome.js';
import { renderMap } from './features/map.js';
import { renderLessons } from './features/lessons.js';
import { renderMemorama } from './games/memorama.js';
import { renderHangman } from './games/hangman.js';
import { renderPuzzle } from './games/bioprocess-puzzle.js';
import { renderExam } from './exam/exam.js';
import { renderProgress } from './features/progress.js';
import { renderSettings } from './features/settings.js';
import { registerSW, promptInstall } from './pwa/install.js';
import { starsHTML, logoSVG } from './ui/components.js';
import { getStars } from './core/state.js';
import { navigate, getRoute } from './core/router.js';
import { toast } from './ui/modal.js';

async function init() {
  await loadState();
  const state = getState();

  // Aplicar settings
  setAudioEnabled(state.settings.sound);
  setVolume(state.settings.volume);
  if (state.settings.reduceMotion) {
    document.documentElement.style.setProperty('--transition-med', '0ms');
  }

  // Header
  renderHeader();

  // Nav inferior
  renderBottomNav();

  // Rutas
  registerRoute('welcome', renderWelcome);
  registerRoute('map', renderMap);
  registerRoute('lesson', renderLessons);
  registerRoute('memorama', renderMemorama);
  registerRoute('hangman', renderHangman);
  registerRoute('puzzle', renderPuzzle);
  registerRoute('exam', renderExam);
  registerRoute('progress', renderProgress);
  registerRoute('settings', renderSettings);

  // Arrancar router
  startRouter();

  registerSW();

  // Suscribirse a cambios de estado para actualizar header
  window.addEventListener('hashchange', renderHeader);
}

function renderHeader() {
  const header = document.getElementById('app-header');
  const stars = getStars();
  const state = getState();
  const route = getRoute();
  const isWelcome = route.name === 'welcome' || route.name === '';
  header.innerHTML = `
    <button class="btn btn-ghost" id="hdr-logo" aria-label="Ir al mapa" style="padding:0;min-height:auto">
      ${logoSVG(36)}
    </button>
    <div style="display:flex;align-items:center;gap:var(--space-3)">
      ${!isWelcome ? `<div style="display:flex;align-items:center;gap:6px;font-weight:800;color:var(--color-gold)">★ ${stars}/3</div>` : ''}
      <button class="btn btn-ghost" id="hdr-settings" aria-label="Configuración" style="min-height:40px;padding:0 var(--space-2)">⚙</button>
    </div>
  `;
  header.querySelector('#hdr-logo').addEventListener('click', () => navigate('map'));
  header.querySelector('#hdr-settings').addEventListener('click', () => navigate('settings'));
}

function renderBottomNav() {
  const nav = document.getElementById('app-nav');
  nav.innerHTML = `
    <button class="btn btn-ghost" data-route="map" style="flex-direction:column;font-size:var(--fs-xs);min-height:56px">🗺<br>Mapa</button>
    <button class="btn btn-ghost" data-route="progress" style="flex-direction:column;font-size:var(--fs-xs);min-height:56px">📊<br>Progreso</button>
    <button class="btn btn-ghost" id="install-btn" style="flex-direction:column;font-size:var(--fs-xs);min-height:56px">⬇<br>Instalar</button>
  `;
  nav.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
  nav.querySelector('#install-btn').addEventListener('click', () => {
    if (!promptInstall()) toast('Usa el menú del navegador → "Instalar aplicación"');
  });
}

init().catch(err => {
  console.error(err);
  document.getElementById('app-main').innerHTML = `<p style="padding:2rem;color:#E05252">Error al iniciar la aplicación: ${err.message}</p>`;
});
