import { QUESTIONS } from '../data/questions.js';
import { getState, getStars } from '../core/state.js';
import { dbPut } from '../core/database.js';
import { navigate } from '../core/router.js';
import { openModal } from '../ui/modal.js';
import { playSelect, playCorrect, playWrong, playVictory } from '../ui/audio.js';
import { confetti } from '../ui/components.js';

const EXAM_SIZE = 12;
const PASS_THRESHOLD = 70;

let exam = null;

export function renderExam(main) {
  const stars = getStars();
  if (stars < 3) {
    main.innerHTML = `
      <div class="exam-screen">
        <h1>Demuestra lo aprendido</h1>
        <div class="card card-dark" style="margin-top:var(--space-4)">
          <h3 style="color:var(--color-gold)">Examen bloqueado</h3>
          <p>Necesitas las 3 estrellas para acceder al examen final.</p>
          <p>Tienes <strong>${stars}/3</strong> estrellas. Completa los tres juegos para desbloquearlo.</p>
          <button class="btn btn-primary" id="btn-back">Volver al mapa</button>
        </div>
      </div>`;
    main.querySelector('#btn-back').addEventListener('click', () => navigate('map'));
    return;
  }
  startExam(main);
}

function pickQuestions() {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, EXAM_SIZE);
}

function startExam(main) {
  exam = {
    questions: pickQuestions(),
    answers: {},
    current: 0,
    startTime: Date.now()
  };
  renderQuestion(main);
}

function renderQuestion(main) {
  const q = exam.questions[exam.current];
  const total = exam.questions.length;
  const answered = Object.keys(exam.answers).length;

  main.innerHTML = `
    <div class="exam-screen">
      <div class="hud">
        <div class="hud-stat"><span class="hud-stat-label">Pregunta</span><span class="hud-stat-value">${exam.current + 1} / ${total}</span></div>
        <div class="hud-stat"><span class="hud-stat-label">Contestadas</span><span class="hud-stat-value">${answered} / ${total}</span></div>
        <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${((exam.current+1)/total)*100}%"></div></div>
      </div>
      <div class="exam-question">
        <h3>${q.q}</h3>
        <div class="exam-options" id="options"></div>
      </div>
      <div style="display:flex;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap">
        <button class="btn btn-secondary" id="prev" ${exam.current === 0 ? 'disabled' : ''}>← Anterior</button>
        <div style="display:flex;gap:var(--space-2)">
          ${exam.current === total - 1
            ? '<button class="btn btn-gold" id="finish">Entregar examen</button>'
            : '<button class="btn btn-primary" id="next">Siguiente →</button>'}
        </div>
      </div>
    </div>
  `;

  const optWrap = main.querySelector('#options');
  const letters = ['A','B','C','D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'exam-option' + (exam.answers[q.id] === i ? ' selected' : '');
    btn.innerHTML = `<span class="exam-option-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => {
      exam.answers[q.id] = i;
      playSelect();
      renderQuestion(main);
    });
    optWrap.appendChild(btn);
  });

  main.querySelector('#prev')?.addEventListener('click', () => {
    if (exam.current > 0) { exam.current--; renderQuestion(main); }
  });
  main.querySelector('#next')?.addEventListener('click', () => {
    if (exam.current < total - 1) { exam.current++; renderQuestion(main); }
  });
  main.querySelector('#finish')?.addEventListener('click', () => {
    const answeredAll = Object.keys(exam.answers).length === total;
    if (!answeredAll) {
      openModal({
        title: 'Faltan respuestas',
        bodyHTML: `<p>Has contestado ${Object.keys(exam.answers).length} de ${total}. ¿Deseas entregar de todas formas?</p>`,
        actions: [
          { label: 'Seguir contestando', className: 'btn-secondary' },
          { label: 'Entregar ahora', className: 'btn-primary', onClick: () => finishExam(main) }
        ]
      });
    } else {
      openModal({
        title: 'Entregar examen',
        bodyHTML: `<p>¿Confirmas que deseas entregar tu examen? No podrás cambiar tus respuestas después.</p>`,
        actions: [
          { label: 'Cancelar', className: 'btn-secondary' },
          { label: 'Entregar', className: 'btn-primary', onClick: () => finishExam(main) }
        ]
      });
    }
  });
}

async function finishExam(main) {
  const total = exam.questions.length;
  let correct = 0;
  const details = exam.questions.map(q => {
    const selected = exam.answers[q.id];
    const isCorrect = selected === q.correct;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      question: q.q,
      selected,
      correct: q.correct,
      isCorrect,
      explain: q.explain,
      topic: q.topic
    };
  });
  const score = Math.round((correct / total) * 100);
  const elapsed = Math.floor((Date.now() - exam.startTime) / 1000);
  const passed = score >= PASS_THRESHOLD;

  const attemptId = 'exam-' + Date.now();
  await dbPut('examAttempts', {
    id: attemptId,
    date: new Date().toISOString(),
    score,
    correct,
    total,
    duration: elapsed,
    passed,
    details
  });

  if (passed) { playVictory(); confetti(80); } else playWrong();

  renderResults(main, { score, correct, total, elapsed, passed, details });
}

function renderResults(main, r) {
  main.innerHTML = `
    <div class="exam-screen">
      <div class="exam-result-big">
        <div class="exam-result-score ${r.passed ? 'pass' : 'fail'}">${r.score}</div>
        <p style="font-size:var(--fs-lg)">${r.passed ? '¡Aprobado!' : 'No aprobado'}</p>
        <p style="color:var(--text-muted-dark)">Correctas: ${r.correct}/${r.total} · Tiempo: ${Math.floor(r.elapsed/60)}m ${r.elapsed%60}s</p>
        <p style="color:var(--text-muted-dark);font-size:var(--fs-sm)">Criterio aprobatorio: 70/100</p>
      </div>
      <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-bottom:var(--space-4)">
        <button class="btn btn-secondary" id="btn-review">Revisar respuestas</button>
        <button class="btn btn-primary" id="btn-map">Volver al mapa</button>
        <button class="btn btn-secondary" id="btn-retry">Nuevo intento</button>
      </div>
      <div id="review" hidden>
        ${r.details.map((d, i) => `
          <div class="exam-question" style="margin-bottom:var(--space-3)">
            <h3 style="font-size:var(--fs-base)">${i+1}. ${d.question}</h3>
            <p style="color:${d.isCorrect ? '#239B72' : '#E05252'};font-weight:700">
              ${d.isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
            </p>
            <p style="font-size:var(--fs-sm)">
              <strong>Tu respuesta:</strong> ${d.selected != null ? exam.questions.find(q => q.id === d.questionId).options[d.selected] : '(sin responder)'}<br>
              <strong>Respuesta correcta:</strong> ${exam.questions.find(q => q.id === d.questionId).options[d.correct]}<br>
              <em>${d.explain}</em>
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  main.querySelector('#btn-review').addEventListener('click', () => {
    const rev = main.querySelector('#review');
    rev.hidden = !rev.hidden;
  });
  main.querySelector('#btn-map').addEventListener('click', () => navigate('map'));
  main.querySelector('#btn-retry').addEventListener('click', () => startExam(main));
}
