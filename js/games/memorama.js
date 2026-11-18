import { INSTRUMENTS } from '../data/instruments.js';
import { INSTRUMENT_SVGS } from '../ui/assets.js';
import { getState, awardStar, markIslandCompleted } from '../core/state.js';
import { dbPut } from '../core/database.js';
import { navigate } from '../core/router.js';
import { playCorrect, playWrong, playStar, playSelect, playVictory } from '../ui/audio.js';
import { confetti } from '../ui/components.js';
import { toast } from '../ui/modal.js';

let game = null;

export function renderMemorama(main) {
  main.innerHTML = `
    <div class="game-screen">
      <h1>Isla 02 — Memorama de laboratorio</h1>
      <p style="color:var(--text-muted-dark);margin-bottom:var(--space-3)">Encuentra las 6 parejas: cada instrumento con su nombre y función.</p>
      <div class="hud">
        <div class="hud-stat"><span class="hud-stat-label">Parejas</span><span class="hud-stat-value" id="hud-pairs">0 / 6</span></div>
        <div class="hud-stat"><span class="hud-stat-label">Movimientos</span><span class="hud-stat-value" id="hud-moves">0</span></div>
        <div class="hud-stat"><span class="hud-stat-label">Tiempo</span><span class="hud-stat-value" id="hud-time">00:00</span></div>
        <button class="btn btn-secondary" id="btn-help">Pista</button>
        <button class="btn btn-secondary" id="btn-restart">Reiniciar</button>
      </div>
      <div class="memo-board" id="board"></div>
    </div>
  `;

  startGame(main);

  main.querySelector('#btn-restart').addEventListener('click', () => {
    playSelect();
    startGame(main);
  });
  main.querySelector('#btn-help').addEventListener('click', () => {
    if (!game || game.helpUsed) { toast('Pista ya utilizada'); return; }
    game.helpUsed = true;
    const unmatched = game.cards.filter(c => !c.matched);
    if (unmatched.length < 2) return;
    const a = unmatched[0];
    const b = unmatched.find(c => c.pairId === a.pairId && c.id !== a.id);
    if (b) {
      flipCard(main, a, false);
      flipCard(main, b, false);
    }
    toast('Pista usada (una pareja revelada)');
  });
}

function startGame(main) {
  const pool = INSTRUMENTS.slice(0, 6);
  const cards = [];
  pool.forEach((ins, idx) => {
    cards.push({ id: `img-${idx}`, pairId: ins.id, kind: 'image', data: ins });
    cards.push({ id: `txt-${idx}`, pairId: ins.id, kind: 'text', data: ins });
  });
  // Mezclar
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  game = {
    cards,
    flipped: [],
    moves: 0,
    matchedCount: 0,
    startTime: Date.now(),
    timerInterval: null,
    helpUsed: false,
    locked: false
  };

  const board = main.querySelector('#board');
  board.innerHTML = '';
  cards.forEach(card => {
    const el = document.createElement('button');
    el.className = 'memo-card';
    el.dataset.id = card.id;
    el.setAttribute('aria-label', 'Carta boca abajo');
    el.innerHTML = '<span class="memo-back-symbol">?</span>';
    el.addEventListener('click', () => onCardClick(main, card, el));
    card.el = el;
    board.appendChild(el);
  });

  // Timer
  clearInterval(game.timerInterval);
  game.timerInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - game.startTime) / 1000);
    const t = main.querySelector('#hud-time');
    if (t) t.textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  }, 500);

  main.querySelector('#hud-pairs').textContent = '0 / 6';
  main.querySelector('#hud-moves').textContent = '0';
}

function flipCard(main, card, playSound = true) {
  if (playSound) playSelect();
  const el = card.el;
  el.classList.add('flipped');
  if (card.kind === 'image') {
    el.innerHTML = INSTRUMENT_SVGS[card.data.id];
  } else {
    el.innerHTML = `<div class="memo-label"><strong>${card.data.name}</strong><br>${card.data.fn.slice(0, 42)}…</div>`;
  }
}

function unflipCard(card) {
  card.el.classList.remove('flipped');
  card.el.innerHTML = '<span class="memo-back-symbol">?</span>';
}

function onCardClick(main, card, el) {
  if (game.locked) return;
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
  if (game.flipped.length >= 2) return;

  flipCard(main, card);
  game.flipped.push(card);
  if (game.flipped.length === 2) {
    game.moves++;
    main.querySelector('#hud-moves').textContent = game.moves;
    const [a, b] = game.flipped;
    if (a.pairId === b.pairId) {
      setTimeout(() => {
        a.el.classList.add('matched');
        b.el.classList.add('matched');
        playCorrect();
        game.matchedCount++;
        main.querySelector('#hud-pairs').textContent = `${game.matchedCount} / 6`;
        game.flipped = [];
        if (game.matchedCount === 6) finishGame(main);
      }, 250);
    } else {
      game.locked = true;
      setTimeout(() => {
        playWrong();
        unflipCard(a);
        unflipCard(b);
        game.flipped = [];
        game.locked = false;
      }, 850);
    }
  }
}

async function finishGame(main) {
  clearInterval(game.timerInterval);
  const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
  playVictory();
  confetti(60);

  const state = getState();
  const sessionId = 'memorama-' + Date.now();
  await dbPut('gameSessions', {
    id: sessionId,
    game: 'memorama',
    startedAt: new Date(game.startTime).toISOString(),
    finishedAt: new Date().toISOString(),
    moves: game.moves,
    timeSeconds: elapsed,
    completed: true
  });

  const awarded = await awardStar('star-memorama', 'memorama', sessionId);
  if (awarded) {
    playStar();
    await markIslandCompleted(2);
    toast('¡Primera estrella obtenida!');
  }

  main.innerHTML = `
    <div class="victory-screen">
      <div class="victory-badge">★</div>
      <h1>¡Memorama completado!</h1>
      <p style="font-size:var(--fs-lg)">Tiempo: <strong>${elapsed}s</strong> · Movimientos: <strong>${game.moves}</strong></p>
      ${awarded ? '<p style="color:var(--color-gold);font-weight:800">¡Has obtenido la primera estrella!</p>' : '<p style="color:var(--text-muted-dark)">Ya habías obtenido esta estrella.</p>'}
      <p style="color:var(--text-muted-dark);font-size:var(--fs-sm)">Repasa: ${INSTRUMENTS.slice(0,6).map(i => i.name).join(', ')}.</p>
      <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-4);flex-wrap:wrap">
        <button class="btn btn-primary" id="btn-map">Volver al mapa</button>
        <button class="btn btn-secondary" id="btn-replay">Jugar otra vez</button>
      </div>
    </div>
  `;
  main.querySelector('#btn-map').addEventListener('click', () => navigate('map'));
  main.querySelector('#btn-replay').addEventListener('click', () => renderMemorama(main));
}
