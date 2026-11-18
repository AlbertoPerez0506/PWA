import { LESSONS } from '../data/lessons.js';
import { INSTRUMENTS } from '../data/instruments.js';
import { INSTRUMENT_SVGS } from '../ui/assets.js';
import { getState, saveLessonProgress, markIslandCompleted } from '../core/state.js';
import { navigate } from '../core/router.js';
import { playSelect, playCorrect } from '../ui/audio.js';
import { toast } from '../ui/modal.js';

export function renderLessons(main) {
  const state = getState();
  const done = state.lessonProgress.modulesCompleted;

  main.innerHTML = `
    <div class="lesson-screen">
      <h1>Isla 01 — Explora</h1>
      <p style="color:var(--text-muted-dark)">Aprende los fundamentos de los bioprocesos. Recorre los tres módulos para desbloquear los juegos.</p>
      <div class="lesson-modules" id="modules"></div>
    </div>
  `;

  const wrap = main.querySelector('#modules');
  LESSONS.forEach(m => {
    const isDone = done.includes(m.id);
    const card = document.createElement('div');
    card.className = `module-card ${isDone ? 'done' : ''}`;
    card.innerHTML = `
      <div class="module-header">
        <div>
          <h3 style="margin:0 0 4px">${m.title}</h3>
          <p style="margin:0;color:var(--text-muted-dark);font-size:var(--fs-sm)">${m.segments.length} segmentos</p>
        </div>
        ${isDone ? '<span class="badge badge-success">Completado</span>' : ''}
      </div>
      <button class="btn btn-primary" data-module="${m.id}">${isDone ? 'Repasar' : 'Comenzar'}</button>
    `;
    card.querySelector('button').addEventListener('click', () => {
      playSelect();
      renderModule(main, m.id, 0);
    });
    wrap.appendChild(card);
  });
}

function renderModule(main, moduleId, segmentIndex) {
  const m = LESSONS.find(x => x.id === moduleId);
  const state = getState();
  const completed = state.lessonProgress.segmentsCompleted[moduleId] || [];

  main.innerHTML = `
    <div class="lesson-screen">
      <button class="btn btn-ghost" id="back-btn">← Volver a los módulos</button>
      <div class="segment-view">
        <p style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:0.08em;color:#55656B">
          ${m.title} · Segmento ${segmentIndex + 1} de ${m.segments.length}
        </p>
        <div class="segment-progress" id="dots"></div>
        <div id="seg-content"></div>
        <div class="segment-nav">
          <button class="btn btn-secondary" id="prev-btn" ${segmentIndex === 0 ? 'disabled' : ''}>Anterior</button>
          <button class="btn btn-primary" id="next-btn">
            ${segmentIndex === m.segments.length - 1 ? 'Terminar módulo' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  `;

  const seg = m.segments[segmentIndex];
  const dots = main.querySelector('#dots');
  m.segments.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'segment-dot' + (i === segmentIndex ? ' active' : (completed.includes(i) ? ' done' : ''));
    dots.appendChild(d);
  });

  const content = main.querySelector('#seg-content');
  let body = `
    <h2>${seg.title}</h2>
    <p>${seg.body}</p>
  `;
  if (seg.keywords) {
    body += `<p>Palabras clave: ${seg.keywords.map(k => `<span class="keyword">${k}</span>`).join(' ')}</p>`;
  }
  if (seg.fact) {
    body += `<div class="fact"><strong>Dato interesante:</strong> ${seg.fact}</div>`;
  }
  if (seg.instrument === 'all') {
    body += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px">${
      INSTRUMENTS.map(ins => `
        <div style="padding:10px;border-radius:10px;background:rgba(0,0,0,0.04);text-align:center">
          <div style="width:56px;height:56px;margin:0 auto 6px;color:#102329">${INSTRUMENT_SVGS[ins.id]}</div>
          <strong style="font-size:0.85rem">${ins.name}</strong>
        </div>
      `).join('')
    }</div>`;
  } else if (seg.instrument) {
    const ins = INSTRUMENTS.find(x => x.id === seg.instrument);
    if (ins) {
      body += `<div style="display:flex;gap:14px;align-items:center;margin-top:12px;padding:12px;background:rgba(0,0,0,0.04);border-radius:10px">
        <div style="width:64px;height:64px;color:#102329;flex-shrink:0">${INSTRUMENT_SVGS[ins.id]}</div>
        <div><strong>${ins.name}</strong><br><span style="font-size:0.9rem">${ins.fn}</span></div>
      </div>`;
    }
  }
  content.innerHTML = body;

  main.querySelector('#back-btn').addEventListener('click', () => { playSelect(); renderLessons(main); });
  main.querySelector('#prev-btn').addEventListener('click', () => {
    if (segmentIndex > 0) renderModule(main, moduleId, segmentIndex - 1);
  });
  main.querySelector('#next-btn').addEventListener('click', async () => {
    playSelect();
    if (!completed.includes(segmentIndex)) {
      completed.push(segmentIndex);
      state.lessonProgress.segmentsCompleted[moduleId] = completed;
      await saveLessonProgress();
    }
    if (segmentIndex === m.segments.length - 1) {
      if (!state.lessonProgress.modulesCompleted.includes(moduleId)) {
        state.lessonProgress.modulesCompleted.push(moduleId);
        await saveLessonProgress();
      }
      if (state.lessonProgress.modulesCompleted.length === LESSONS.length) {
        await markIslandCompleted(1);
        playCorrect();
        toast('¡Has completado la isla de conocimiento!');
        setTimeout(() => navigate('map'), 800);
      } else {
        renderLessons(main);
      }
    } else {
      renderModule(main, moduleId, segmentIndex + 1);
    }
  });
}
