import { VOCABULARY } from '../data/vocabulary.js';
import { getState, awardStar, markIslandCompleted } from '../core/state.js';
import { dbPut } from '../core/database.js';
import { navigate } from '../core/router.js';
import { playCorrect, playWrong, playStar, playSelect, playVictory } from '../ui/audio.js';
import { confetti } from '../ui/components.js';
import { toast } from '../ui/modal.js';

let game = null;
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const MAX_ERRORS = 6;

export function renderHangman(main) {
  startGame(main);
}

function pickWords() {
  const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

function startGame(main) {
  game = {
    words: pickWords(),
    currentIdx: 0,
    solvedCount: 0,
    word: '',
    guessed: new Set(),
    errors: 0,
    startTime: Date.now(),
    wordsResults: []
  };
  loadWord(main);
}

function normalizeChar(c) {
  return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function loadWord(main) {
  if (game.currentIdx >= game.words.length) { finishGame(main); return; }
  const entry = game.words[game.currentIdx];
  game.word = entry.word.toUpperCase();
  game.hint = entry.hint;
  game.guessed = new Set();
  game.errors = 0;
  renderUI(main);
}

function renderUI(main) {
  const hintUsed = game.hintUsed;
  main.innerHTML = `
    <div class="hangman-screen">
      <h1>Isla 03 — Adivina el término</h1>
      <p style="color:var(--text-muted-dark)">Palabra ${game.currentIdx + 1} de 5 · Errores: ${game.errors}/${MAX_ERRORS}</p>
      <div class="hangman-figure" id="figure"></div>
      <div class="hangman-hint"><strong>Pista:</strong> ${game.hint}</div>
      <div class="hangman-word" id="word"></div>
      <div class="hangman-keyboard" id="keyboard"></div>
      <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-4);flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-hint" ${hintUsed ? 'disabled' : ''}>Pista extra</button>
        <button class="btn btn-secondary" id="btn-reset">Reiniciar palabra</button>
      </div>
    </div>
  `;
  renderFigure(main);
  renderWord(main);
  renderKeyboard(main);

  main.querySelector('#btn-hint').addEventListener('click', () => {
    game.hintUsed = true;
    // Revela una letra no adivinada
    for (const ch of game.word) {
      const n = normalizeChar(ch);
      if (/[A-ZÑ]/.test(n) && !game.guessed.has(n)) {
        game.guessed.add(n);
        break;
      }
    }
    playSelect();
    renderUI(main);
  });

  main.querySelector('#btn-reset').addEventListener('click', () => {
    game.errors = 0;
    game.guessed = new Set();
    game.hintUsed = false;
    playSelect();
    renderUI(main);
  });
}

function renderWord(main) {
  const el = main.querySelector('#word');
  el.innerHTML = '';
  for (const ch of game.word) {
    const n = normalizeChar(ch);
    const span = document.createElement('span');
    if (ch === ' ') { span.className = 'hangman-letter space'; }
    else if (/[A-ZÑ]/.test(n)) {
      span.className = 'hangman-letter' + (game.guessed.has(n) ? ' revealed' : '');
      span.textContent = game.guessed.has(n) ? ch : '_';
    } else {
      span.className = 'hangman-letter revealed';
      span.textContent = ch;
    }
    el.appendChild(span);
  }
}

function renderKeyboard(main) {
  const kb = main.querySelector('#keyboard');
  kb.innerHTML = '';
  ALPHABET.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.textContent = letter;
    if (game.guessed.has(letter)) {
      const inWord = game.word.split('').some(c => normalizeChar(c) === letter);
      btn.classList.add(inWord ? 'correct' : 'wrong');
      btn.disabled = true;
    }
    btn.addEventListener('click', () => guessLetter(main, letter));
    kb.appendChild(btn);
  });
}

function guessLetter(main, letter) {
  if (game.guessed.has(letter)) return;
  game.guessed.add(letter);
  const inWord = game.word.split('').some(c => normalizeChar(c) === letter);
  if (inWord) playCorrect();
  else { playWrong(); game.errors++; }

  // Revisar si ganó
  const won = game.word.split('').every(c => {
    const n = normalizeChar(c);
    return !/[A-ZÑ]/.test(n) || game.guessed.has(n);
  });
  if (won) {
    setTimeout(() => {
      game.solvedCount++;
      game.wordsResults.push({ word: game.word, solved: true });
      toast('¡Correcto!');
      game.hintUsed = false;
      game.currentIdx++;
      setTimeout(() => loadWord(main), 500);
    }, 400);
    return;
  }
  if (game.errors >= MAX_ERRORS) {
    // Permitir reintento (no avanza)
    setTimeout(() => {
      toast('Demasiados errores. Intenta de nuevo esta palabra.');
      game.errors = 0;
      game.guessed = new Set();
      game.hintUsed = false;
      renderUI(main);
    }, 800);
    return;
  }
  renderUI(main);
}

function renderFigure(main) {
  const f = main.querySelector('#figure');
  const errs = game.errors;
  f.innerHTML = `
    <svg viewBox="0 0 120 160" fill="none" stroke="#38B8AF" stroke-width="4" stroke-linecap="round">
      <line x1="10" y1="150" x2="70" y2="150"/>
      <line x1="30" y1="150" x2="30" y2="20"/>
      <line x1="30" y1="20" x2="90" y2="20"/>
      <line x1="90" y1="20" x2="90" y2="40"/>
      ${errs >= 1 ? '<circle cx="90" cy="52" r="12" stroke="#F3BD4F"/>' : ''}
      ${errs >= 2 ? '<line x1="90" y1="64" x2="90" y2="100" stroke="#F3BD4F"/>' : ''}
      ${errs >= 3 ? '<line x1="90" y1="72" x2="76" y2="86" stroke="#F3BD4F"/>' : ''}
      ${errs >= 4 ? '<line x1="90" y1="72" x2="104" y2="86" stroke="#F3BD4F"/>' : ''}
      ${errs >= 5 ? '<line x1="90" y1="100" x2="78" y2="124" stroke="#F3BD4F"/>' : ''}
      ${errs >= 6 ? '<line x1="90" y1="100" x2="102" y2="124" stroke="#F3BD4F"/>' : ''}
    </svg>`;
}

async function finishGame(main) {
  playVictory();
  confetti(60);
  const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
  const sessionId = 'hangman-' + Date.now();
  await dbPut('gameSessions', {
    id: sessionId,
    game: 'hangman',
    startedAt: new Date(game.startTime).toISOString(),
    finishedAt: new Date().toISOString(),
    words: game.words.map(w => w.word),
    timeSeconds: elapsed,
    completed: true
  });

  const awarded = await awardStar('star-hangman', 'hangman', sessionId);
  if (awarded) {
    playStar();
    await markIslandCompleted(3);
    toast('¡Segunda estrella obtenida!');
  }

  main.innerHTML = `
    <div class="victory-screen">
      <div class="victory-badge">★</div>
      <h1>¡Vocabulario dominado!</h1>
      <p style="font-size:var(--fs-lg)">Resolviste las 5 palabras.</p>
      ${awarded ? '<p style="color:var(--color-gold);font-weight:800">¡Has obtenido la segunda estrella!</p>' : '<p style="color:var(--text-muted-dark)">Ya habías obtenido esta estrella.</p>'}
      <div class="card" style="text-align:left;margin-top:var(--space-4)">
        <h3 style="color:var(--text-inverse)">Definiciones</h3>
        <ul style="color:var(--text-inverse);padding-left:1.2rem">
          ${game.words.map(w => `<li><strong>${w.word}:</strong> ${w.hint}</li>`).join('')}
        </ul>
      </div>
      <div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-4);flex-wrap:wrap">
        <button class="btn btn-primary" id="btn-map">Volver al mapa</button>
        <button class="btn btn-secondary" id="btn-replay">Jugar otra vez</button>
      </div>
    </div>
  `;
  main.querySelector('#btn-map').addEventListener('click', () => navigate('map'));
  main.querySelector('#btn-replay').addEventListener('click', () => renderHangman(main));
}
