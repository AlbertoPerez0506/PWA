import { loadState, getState, getStars, subscribe } from './core/state.js';
import { startRouter, registerRoute, getRoute, navigate } from './core/router.js';
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
import { registerSW, promptInstall, isInstalled } from './pwa/install.js';
import { logoSVG } from './ui/components.js';
import { ICONS, STAR_SVG } from './ui/assets.js';
import { toast } from './ui/modal.js';

async function init() {
  await loadState();
  const state = getState();

  setAudioEnabled(state.settings.sound);
  setVolume(state.settings.volume);
  if (state.settings.reduceMotion) {
    document.documentElement.style.setProperty('--transition-med', '0ms');
  }

  renderHeader();
  renderBottomNav();

  registerRoute('welcome', renderWelcome);
  registerRoute('map', renderMap);
  registerRoute('lesson', renderLessons);
  registerRoute('memorama', renderMemorama);
  registerRoute('hangman', renderHangman);
  registerRoute('puzzle', renderPuzzle);
  registerRoute('exam', renderExam);
  registerRoute('progress', renderProgress);
  registerRoute('settings', renderSettings);

  startRouter();
  registerSW();

  window.addEventListener('hashchange', renderHeader);
  subscribe(renderHeader); // actualiza estrellas del header al instante

  // Si la app se instala desde otra pestaña/ventana, ocultar botón Instalar
  document.addEventListener('pwa-installed', () => {
    const btn = document.querySelector('#install-btn');
    if (btn) btn.style.display = 'none';
  });
}

function renderHeader() {
  const header = document.getElementById('app-header');
  if (!header) return;
  const stars = getStars();
  const route = getRoute();
  const isWelcome = route.name === 'welcome' || route.name === '';

  header.innerHTML = `
    <button class="btn btn-ghost hdr-logo-btn" id="hdr-logo" aria-label="Ir al mapa">
      ${logoSVG(36)}
    </button>
    <div class="hdr-right">
      ${!isWelcome ? `<div class="hdr-stars" aria-label="${stars} de 3 estrellas">
        ${STAR_SVG.replace('class="star"', 'class="star earned"')}
        <span>${stars}/3</span>
      </div>` : ''}
      <button class="btn btn-ghost hdr-icon-btn" id="hdr-settings" aria-label="Configuración">
        ${ICONS.gear}
      </button>
    </div>
  `;
  header.querySelector('#hdr-logo').addEventListener('click', () => navigate('map'));
  header.querySelector('#hdr-settings').addEventListener('click', () => navigate('settings'));
}

function renderBottomNav() {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  nav.innerHTML = `
    <button class="btn btn-ghost nav-btn" data-route="map" aria-label="Mapa">
      <span class="nav-icon">${ICONS.map}</span><span class="nav-label">Mapa</span>
    </button>
    <button class="btn btn-ghost nav-btn" data-route="progress" aria-label="Progreso">
      <span class="nav-icon">${ICONS.chart}</span><span class="nav-label">Progreso</span>
    </button>
    <button class="btn btn-ghost nav-btn" id="install-btn" aria-label="Instalar aplicación">
      <span class="nav-icon">${ICONS.download}</span><span class="nav-label">Instalar</span>
    </button>
  `;

  nav.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });

  const installBtn = nav.querySelector('#install-btn');

  // Si ya está instalada, ocultar de inmediato
  if (isInstalled()) {
    installBtn.style.display = 'none';
  }

  installBtn.addEventListener('click', async () => {
    const result = await promptInstall();

    if (result.ok && result.accepted) {
      toast('Aplicación instalada');
      installBtn.style.display = 'none';
    } else if (result.ok && !result.accepted) {
      toast('Instalación cancelada');
    } else if (result.reason === 'installed') {
      toast('La aplicación ya está instalada');
      installBtn.style.display = 'none';
    } else if (result.reason === 'unavailable') {
      toast('Usa el menú del navegador para instalar la aplicación.');
    } else {
      toast('No se pudo iniciar la instalación');
    }
  });
}

init().catch(err => {
  console.error(err);
  const main = document.getElementById('app-main');
  if (main) main.innerHTML = `<p style="padding:2rem;color:#C5443B">Error al iniciar la aplicación: ${err.message}</p>`;
});
