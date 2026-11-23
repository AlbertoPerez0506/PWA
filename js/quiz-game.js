// quiz-game.js — Motor genérico para juegos y examen.
// Soporta feedback por pregunta (modo juego) o solo al final (modo examen).

import { renderIcons, icon } from './icons.js';
import { sounds } from './audio.js';
import { saveGameProgress, saveExamAnswer } from './db.js';

export class QuizGame {
  /**
   * @param {Object} cfg
   * @param {Array} cfg.questions
   * @param {string} cfg.gameName
   * @param {boolean} cfg.showFeedback - true: retroalimentación por pregunta
   * @param {string} cfg.mode - 'game' | 'exam'
   * @param {string} cfg.introIcon - nombre del icono de la portada
   * @param {string} cfg.introTitle
   * @param {string} cfg.introDesc
   * @param {string[]} cfg.introObjectives
   * @param {string} cfg.backHref
   */
  constructor(cfg) {
    this.cfg = cfg;
    this.current = 0;
    this.answers = []; // { index, selected, isCorrect }
    this.locked = false;
  }

  mount() {
    this.introScreen = document.getElementById('intro-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.resultsScreen = document.getElementById('results-screen');
    this.startBtn = document.getElementById('start-btn');
    this.restartBtn = document.getElementById('restart-btn');

    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
    this.questionIcon = document.getElementById('question-icon');
    this.questionPrompt = document.getElementById('question-prompt');
    this.questionContext = document.getElementById('question-context');
    this.optionsEl = document.getElementById('options');
    this.feedbackEl = document.getElementById('feedback');
    this.nextBtn = document.getElementById('next-btn');

    this.scoreEl = document.getElementById('results-score');
    this.messageEl = document.getElementById('results-message');

    if (this.startBtn) this.startBtn.addEventListener('click', () => this.start());
    if (this.restartBtn) this.restartBtn.addEventListener('click', () => this.reset());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    this.populateIntro();
  }

  populateIntro() {
    const titleEl = document.getElementById('intro-title');
    const descEl = document.getElementById('intro-desc');
    const objEl = document.getElementById('intro-objectives');
    const iconEl = document.getElementById('intro-icon');
    if (titleEl) titleEl.textContent = this.cfg.introTitle;
    if (descEl) descEl.textContent = this.cfg.introDesc;
    if (objEl && this.cfg.introObjectives) {
      objEl.innerHTML = this.cfg.introObjectives
        .map((o) => `<li>${icon('check-circle', 20)}<span>${o}</span></li>`)
        .join('');
    }
    if (iconEl && this.cfg.introIcon) iconEl.innerHTML = icon(this.cfg.introIcon, 44);
  }

  start() {
    this.introScreen.hidden = true;
    this.gameScreen.hidden = false;
    this.resultsScreen.hidden = true;
    this.current = 0;
    this.answers = [];
    this.showQuestion();
  }

  reset() {
    this.introScreen.hidden = false;
    this.gameScreen.hidden = true;
    this.resultsScreen.hidden = true;
  }

  showQuestion() {
    this.locked = false;
    const q = this.cfg.questions[this.current];

    // Progreso
    this.progressFill.style.width = `${((this.current) / this.cfg.questions.length) * 100}%`;
    this.progressText.textContent = `Pregunta ${this.current + 1} de ${this.cfg.questions.length}`;

    // Pregunta
    this.questionIcon.innerHTML = icon(q.icon || 'info', 40);
    this.questionPrompt.textContent = q.prompt;
    this.questionContext.textContent = q.context || '';

    // Opciones
    this.optionsEl.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.innerHTML = `<span class="option__badge">${String.fromCharCode(65 + idx)}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => this.selectAnswer(idx));
      this.optionsEl.appendChild(btn);
    });

    // Feedback oculto
    this.feedbackEl.hidden = true;
    this.feedbackEl.innerHTML = '';

    // Botón siguiente
    this.nextBtn.disabled = true;
    this.nextBtn.textContent = this.current === this.cfg.questions.length - 1
      ? 'Finalizar'
      : 'Continuar';
    this.nextBtn.classList.add('btn--primary');
    this.nextBtn.classList.remove('btn--secondary');
  }

  selectAnswer(idx) {
    if (this.locked) return;
    this.locked = true;

    const q = this.cfg.questions[this.current];
    const isCorrect = idx === q.correct;
    const buttons = this.optionsEl.querySelectorAll('.option');

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('is-correct');
      if (i === idx && !isCorrect) b.classList.add('is-incorrect');
    });

    this.answers.push({ index: this.current, selected: idx, isCorrect });

    if (isCorrect) sounds.correct(); else sounds.incorrect();

    if (this.cfg.showFeedback) {
      this.feedbackEl.hidden = false;
      this.feedbackEl.className = 'feedback ' + (isCorrect ? 'feedback--correct' : 'feedback--incorrect');
      this.feedbackEl.innerHTML = `
        ${icon(isCorrect ? 'check-circle' : 'x-circle', 22)}
        <div>
          <strong>${isCorrect ? '¡Correcto!' : 'No es la respuesta correcta.'}</strong><br>
          <span>${q.feedback || ''}</span>
        </div>`;
    }

    this.nextBtn.disabled = false;
  }

  next() {
    if (this.current < this.cfg.questions.length - 1) {
      this.current++;
      this.showQuestion();
    } else {
      this.finish();
    }
  }

  async finish() {
    sounds.complete();
    const total = this.cfg.questions.length;
    const score = this.answers.filter((a) => a.isCorrect).length;
    const pct = Math.round((score / total) * 100);

    // Guardar en IndexedDB
    try {
      await saveGameProgress(this.cfg.gameName, score, total);
      if (this.cfg.mode === 'exam') {
        for (const a of this.answers) {
          const q = this.cfg.questions[a.index];
          await saveExamAnswer(q.id, a.selected, a.isCorrect);
        }
      }
    } catch (e) {
      console.warn('No se pudo guardar el progreso:', e);
    }

    // Mostrar pantalla de resultados
    this.gameScreen.hidden = true;
    this.resultsScreen.hidden = false;

    // Actualizar barra al 100%
    this.progressFill.style.width = '100%';

    this.scoreEl.textContent = `${score} / ${total}`;
    let msg = '';
    if (pct === 100) msg = '¡Excelente! Dominas el tema por completo.';
    else if (pct >= 80) msg = '¡Muy bien! Tienes un gran dominio del tema.';
    else if (pct >= 60) msg = 'Buen trabajo. Repasa algunos conceptos para mejorar.';
    else if (pct >= 40) msg = 'Vas por buen camino. Te recomendamos repasar los temas.';
    else msg = 'Sigue practicando. Repasa los contenidos y vuelve a intentarlo.';
    this.messageEl.textContent = `${msg} Aciertos: ${pct}%.`;
  }
}
