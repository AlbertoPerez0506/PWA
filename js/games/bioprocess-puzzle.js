import { BIOPROCESS_STEPS } from '../data/bioprocess.js';
import { awardStar, markIslandCompleted, getStars } from '../core/state.js';
import { dbPut } from '../core/database.js';
import { navigate } from '../core/router.js';
import { playCorrect, playWrong, playStar, playSelect, playVictory } from '../ui/audio.js';
import { confetti, starBadgeHTML } from '../ui/components.js';
import { toast } from '../ui/modal.js';

let game = null;

export function renderPuzzle(main) { startGame(main); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame(main) {
  game = {
    pool: shuffle(BIOPROCESS_STEPS),
    slots: Array(BIOPROCESS_STEPS.length).fill(null),
    selected: null,
    startTime: Date.now(),
    attempts: 0
  };
  renderUI(main);
}

function renderUI(main) {
  main.innerHTML = `
    <div class="puzzle-screen">
      <h1>Isla 04 — Arma el bioproceso</h1>
      <p style="color:var(--color-muted);margin-bottom:var(--space-3)">
        Ordena las 7 etapas de un bioproceso típico. Toca una pieza y luego un espacio.
      </p>
      <div class="puzzle-columns">
        <div>
          <h3 class="puzzle-col-title">Piezas disponibles</h3>
          <div class="puzzle-pool" id="pool"></div>
        </div>
        <div>
          <h3 class="puzzle-col-title">Secuencia</h3>
          <div class="puzzle-slots" id="slots"></div>
        </div>
      </div>
    </div>
  `;

  const pool = main.querySelector('#pool');
  const slots = main.querySelector('#slots');

  game.pool.forEach(step => {
    const btn = document.createElement('button');
    btn.className = 'puzzle-piece';
    btn.dataset.id = step.id;
    if (game.selected === step.id) btn.classList.add('selected');
    btn.innerHTML = `<strong>${step.title}</strong>`;
    btn.addEventListener('click', () => {
      if (!game.pool.find(p => p.id === step.id)) return;
      game.selected = game.selected === step.id ? null : step.id;
      playSelect();
      renderUI(main);
    });
    pool.appendChild(btn);
  });

  game.slots.forEach((step, idx) => {
    const slot = document.createElement('button');
    slot.className = 'puzzle-slot' + (step ? ' filled' : '');
    slot.dataset.idx = idx;
    slot.innerHTML = `<span class="puzzle-slot-num">${idx + 1}</span>
      <span>${step ? step.title : 'Toca aquí para colocar'}</span>`;
    slot.addEventListener('click', () => onSlotClick(main, idx));
    slots.appendChild(slot);
  });
}

async function onSlotClick(main, idx) {
  if (game.selected == null) {
    if (game.slots[idx]) {
      const step = game.slots[idx];
      game.pool.push(step);
      game.slots[idx] = null;
      playSelect();
      renderUI(main);
    }
    return;
  }

  const stepId = game.selected;
  const pieceIndex = game.pool.findIndex(p => p.id === stepId);
  if (pieceIndex === -1) return;
  const piece = game.pool[pieceIndex];

  if (game.slots[idx]) game.pool.push(game.slots[idx]);
  game.pool.splice(pieceIndex, 1);
  game.slots[idx] = piece;
  game.selected = null;
  game.attempts++;

  if (piece.id === idx + 1) {
    playCorrect();
  } else {
    playWrong();
    setTimeout(() => {
      game.slots[idx] = null;
      game.pool.push(piece);
      renderUI(main);
      toast('Ese no es el orden correcto. Intenta de nuevo.');
    }, 600);
    return;
  }
  renderUI(main);

  const complete = game.slots.every((s, i) => s && s.id === i + 1);
  if (complete) finishGame(main);
}

async function finishGame(main) {
  playVictory();
  confetti(60);
  const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
  const sessionId = 'puzzle-' + Date.now();
  await dbPut('gameSessions', {
    id: sessionId, game: 'puzzle',
    startedAt: new Date(game.startTime).toISOString(),
    finishedAt: new Date().toISOString(),
    attempts: game.attempts, timeSeconds: elapsed, completed: true
  });

  const awarded = await awardStar('star-puzzle', 'puzzle', sessionId);
  if (awarded) {
    playStar();
    await markIslandCompleted(4);
  }
  const totalStars = getStars();

  main.innerHTML = `
    <div class="victory-screen">
      <div class="victory-badge">${starBadgeHTML()}</div>
      <h1>¡Bioproceso completado!</h1>
      <p style="font-size:var(--fs-lg)">Tiempo: ${elapsed}s · Intentos: ${game.attempts}</p>
      ${awarded
        ? `<p style="color:var(--color-primary);font-weight:800">¡Has obtenido una estrella! (${totalStars}/3)</p>`
        : `<p style="color:var(--color-muted)">Ya habías obtenido esta estrella.</p>`}
      <p style="color:var(--color-muted);font-size:var(--fs-sm);margin-top:var(--space-3)">
        La secuencia exacta puede variar según el organismo y el producto, pero estas son las etapas generales.
      </p>
      <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-4);flex-wrap:wrap">
        <button class="btn btn-primary" id="btn-map">Volver al mapa</button>
        <button class="btn btn-secondary" id="btn-replay">Jugar otra vez</button>
      </div>
    </div>
  `;
  main.querySelector('#btn-map').addEventListener('click', () => navigate('map'));
  main.querySelector('#btn-replay').addEventListener('click', () => renderPuzzle(main));
}
