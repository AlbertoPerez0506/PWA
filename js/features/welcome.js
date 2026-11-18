import { getState, hasStar, getStars } from '../core/state.js';
import { navigate } from '../core/router.js';
import { logoSVG, starsHTML } from '../ui/components.js';
import { LOGO_SVG } from '../ui/assets.js';
import { openModal } from '../ui/modal.js';

export function renderWelcome(main) {
  const state = getState();
  const stars = getStars();
  const hasProgress = state.userProgress && state.userProgress.islandsCompleted.length > 0;

  main.innerHTML = `
    <div class="welcome-screen">
      <div class="welcome-logo">${LOGO_SVG}</div>
      <p class="welcome-slogan">La ruta de los bioprocesos</p>
      <h1 class="welcome-title">BIOISLAS</h1>
      <p class="welcome-text">
        Explora un mundo donde la ciencia y la naturaleza se conectan.
        Descubre los procesos biotecnológicos, supera desafíos interactivos
        y demuestra cuánto has aprendido.
      </p>
      <div class="welcome-actions">
        ${hasProgress
          ? `<button class="btn btn-primary" id="btn-continue">Continuar aventura</button>
             <button class="btn btn-secondary" id="btn-new">Comenzar de nuevo</button>`
          : `<button class="btn btn-primary" id="btn-start">Comenzar aventura</button>`}
        <button class="btn btn-ghost" id="btn-info">Acerca de BIOISLAS</button>
      </div>
    </div>
  `;

  const start = () => {
    // Primera vez: introducción narrativa
    if (!hasProgress) showIntro();
    else navigate('map');
  };

  const startBtn = main.querySelector('#btn-start') || main.querySelector('#btn-continue');
  if (startBtn) startBtn.addEventListener('click', start);

  const newBtn = main.querySelector('#btn-new');
  if (newBtn) newBtn.addEventListener('click', showIntro);

  main.querySelector('#btn-info').addEventListener('click', () => {
    openModal({
      title: 'Acerca de BIOISLAS',
      bodyHTML: `
        <p><strong>BIOISLAS</strong> es una aplicación educativa gamificada sobre procesos biotecnológicos y bioprocesos.</p>
        <p>Recorre cinco islas: una de aprendizaje y tres de juegos, para obtener tres estrellas y desbloquear el examen final.</p>
        <p>Universidad Tecnológica del Usumacinta — Proyecto académico.</p>
      `,
      actions: [{ label: 'Cerrar', className: 'btn-primary' }]
    });
  });
}

function showIntro() {
  openModal({
    title: 'Bienvenido a BIOISLAS',
    bodyHTML: `
      <p>Frente a ti se encuentra un archipiélago donde cada isla guarda un nuevo descubrimiento.</p>
      <ul style="padding-left:1.2rem">
        <li>Explora primero la <strong>isla del conocimiento</strong>.</li>
        <li>Completa <strong>tres desafíos</strong> para obtener <strong>tres estrellas</strong>.</li>
        <li>Con las tres estrellas accederás al <strong>examen final</strong>.</li>
      </ul>
      <p>Tu progreso se guarda automáticamente en este dispositivo.</p>
    `,
    actions: [
      { label: 'Entendido, comenzar', className: 'btn-primary', onClick: () => navigate('map') }
    ]
  });
}
