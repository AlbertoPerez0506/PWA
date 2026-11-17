/* ============================================================
   APP — Bio en Procesos · Etapa 1
   ============================================================ */
(function () {
  'use strict';

  const CONTENT = window.BIO_CONTENT;
  if (!CONTENT || !Array.isArray(CONTENT.capsules)) {
    console.error('[Bio en Procesos] content.js no se cargó correctamente.');
    return;
  }

  const STORAGE_KEY = 'bio-procesos-v1';
  const CAPSULE_IDS = CONTENT.capsules.map((c) => c.id);

  /* ---------- ESTADO ---------- */
  const state = {
    screen: 'welcome',
    completed: Object.fromEntries(CAPSULE_IDS.map((id) => [id, false])),
    capsuleId: null,
    segmentIndex: 0,
    phase: 'segment', // 'segment' | 'quiz'
    quizSelected: null,
    quizAnswered: false,
    quizCorrect: false
  };

  /* ---------- PERSISTENCIA ---------- */
  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completed: state.completed })
      );
    } catch (e) { /* almacenamiento no disponible */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !data.completed) return;
      CAPSULE_IDS.forEach((id) => {
        if (data.completed[id]) state.completed[id] = true;
      });
    } catch (e) { /* datos corruptos: ignorar */ }
  }

  function hasProgress() { return CAPSULE_IDS.some((id) => state.completed[id]); }
  function allComplete() { return CAPSULE_IDS.every((id) => state.completed[id]); }

  /* ---------- HELPERS DOM ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- TOAST ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
  }

  /* ---------- ILUSTRACIONES SVG ---------- */
  let illCounter = 0;
  function illustration(type) {
    const id = 'ill-' + (++illCounter);
    const common = `fill="none" stroke="url(#${id})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
    const defs = `
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3fe6a6"/>
          <stop offset="1" stop-color="#2bb8cf"/>
        </linearGradient>
      </defs>`;
    const map = {
      flask: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M80 36h40M86 36v36l-22 42a14 14 0 0 0 12.4 20.6h47.2A14 14 0 0 0 136 114l-22-42V36" ${common}/>
          <path d="M74 104h52" ${common}/>
          <circle cx="90" cy="118" r="5" fill="#3fe6a6"/>
          <circle cx="108" cy="126" r="4" fill="#2bb8cf"/>
          <circle cx="102" cy="112" r="3" fill="#a8e05f"/>
        </svg>`,
      cycle: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M100 30a50 50 0 1 1-35.3 14.6" ${common}/>
          <path d="M100 30v14M100 30h14" ${common}/>
          <path d="M64.7 44.6 71 53M64.7 44.6l-9.3 3" ${common}/>
          <circle cx="100" cy="80" r="8" fill="#3fe6a6"/>
          <circle cx="100" cy="30" r="4" fill="#2bb8cf"/>
          <circle cx="150" cy="80" r="4" fill="#a8e05f"/>
        </svg>`,
      cells: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <circle cx="80" cy="70" r="22" ${common}/>
          <circle cx="124" cy="80" r="18" ${common}/>
          <circle cx="95" cy="112" r="14" ${common}/>
          <circle cx="80" cy="70" r="5" fill="#3fe6a6"/>
          <circle cx="124" cy="80" r="4" fill="#2bb8cf"/>
          <circle cx="95" cy="112" r="3" fill="#a8e05f"/>
        </svg>`,
      gear: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <circle cx="100" cy="80" r="34" ${common}/>
          <circle cx="100" cy="80" r="12" ${common}/>
          <path d="M100 40v-12M100 132v-12M56 80H44M156 80h-12M70.5 50.5 62 42M138 42l-8.5 8.5M70.5 109.5 62 118M138 118l-8.5-8.5" ${common}/>
        </svg>`,
      factory: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M46 122V74l24 18V74l24 18V70l30 10 20-6v48z" ${common}/>
          <path d="M46 122h108" ${common}/>
          <circle cx="66" cy="100" r="5" ${common}/>
          <circle cx="90" cy="100" r="5" ${common}/>
          <circle cx="114" cy="100" r="5" ${common}/>
        </svg>`,
      leaf: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M150 40C90 40 50 70 50 120c0 6 .5 10 1.5 14 50-8 98-40 98-94z" ${common}/>
          <path d="M51 134c16-30 40-52 76-66" ${common}/>
        </svg>`,
      graph: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M50 120V44M50 120h106" ${common}/>
          <path d="M50 100 80 80 110 96 140 60" ${common}/>
          <circle cx="140" cy="60" r="5" fill="#3fe6a6"/>
        </svg>`,
      droplet: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M100 40c0 0-32 32-32 52a32 32 0 0 0 64 0c0-20-32-52-32-52z" ${common}/>
          <path d="M84 102a16 16 0 0 0 16 16" ${common}/>
        </svg>`,
      layers: `
        <svg viewBox="0 0 200 160" role="img" aria-hidden="true">
          ${defs}
          <circle cx="100" cy="80" r="58" fill="url(#${id})" opacity=".06"/>
          <path d="M100 40 50 66l50 26 50-26z" ${common}/>
          <path d="M50 90l50 26 50-26" ${common}/>
          <path d="M50 114l50 26 50-26" ${common}/>
        </svg>`
    };
    return map[type] || map.flask;
  }

  /* ---------- RENDER: PANTALLAS ---------- */
  function renderScreen() {
    document.body.dataset.screen = state.screen;
    $$('.screen').forEach((s) => {
      s.classList.toggle('is-active', s.dataset.screen === state.screen);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ---------- RENDER: PROGRESO ---------- */
  function renderProgress() {
    const done = CAPSULE_IDS.filter((id) => state.completed[id]).length;
    $$('.meter__bar').forEach((bar) => {
      bar.classList.toggle('is-done', !!state.completed[bar.dataset.cap]);
    });
    const label = $('#meter-label');
    if (label) label.textContent = `${done}/${CAPSULE_IDS.length}`;

    const resetBtn = $('#welcome-reset');
    if (resetBtn) resetBtn.hidden = !hasProgress();
  }

  /* ---------- RENDER: HUB ---------- */
  function renderHub() {
    const grid = $('#capsule-grid');
    if (!grid) return;

    grid.innerHTML = CONTENT.capsules
      .map((cap) => {
        const done = state.completed[cap.id];
        return `
          <article class="capsule-card ${done ? 'is-done' : ''}" data-capsule="${cap.id}">
            <div class="capsule-card__head">
              <span class="capsule-card__num">Cápsula ${cap.number}</span>
              <span class="capsule-card__icon">
                <svg class="icon"><use href="#${cap.icon}"/></svg>
              </span>
            </div>
            <h3>${escapeHTML(cap.title)}</h3>
            <p class="capsule-card__sub">${escapeHTML(cap.subtitle)}</p>
            <div class="capsule-card__foot">
              <span class="capsule-card__state">
                ${
                  done
                    ? '<svg class="icon"><use href="#i-check"/></svg> Completada'
                    : `${cap.segments.length} segmentos · 1 comprobación`
                }
              </span>
              <button class="capsule-card__btn" data-open-capsule="${cap.id}">
                ${done ? 'Repasar' : 'Explorar'}
                <svg class="icon"><use href="#i-arrow-right"/></svg>
              </button>
            </div>
          </article>`;
      })
      .join('');

    const finale = $('#finale-card');
    if (finale) finale.hidden = !allComplete();
  }

  /* ---------- RENDER: CÁPSULA ---------- */
  function getCapsule() {
    return CONTENT.capsules.find((c) => c.id === state.capsuleId);
  }

  function renderCapsule() {
    const cap = getCapsule();
    if (!cap) { goHub(); return; }

    const numberEl = $('#cap-number');
    const titleEl = $('#cap-title');
    if (numberEl) numberEl.textContent = `Cápsula ${cap.number}`;
    if (titleEl) titleEl.textContent = cap.title;

    /* Puntos de progreso */
    const dots = $('#segment-dots');
    if (dots) {
      const total = cap.segments.length + 1;
      let html = '';
      for (let i = 0; i < total; i++) {
        let cls = 'dots__dot';
        if (state.phase === 'quiz' && i === cap.segments.length) cls += ' is-current';
        else if (state.phase === 'segment' && i === state.segmentIndex) cls += ' is-current';
        else if (state.phase === 'quiz' || i < state.segmentIndex) cls += ' is-done';
        html += `<span class="${cls}"></span>`;
      }
      dots.innerHTML = html;
    }

    /* Cuerpo */
    const body = $('#reader-body');
    if (!body) return;

    if (state.phase === 'segment') {
      const seg = cap.segments[state.segmentIndex];
      if (!seg) return;
      body.innerHTML = `
        <article class="segment">
          <div class="segment__art">${illustration(seg.illustration)}</div>
          <span class="segment__kicker">
            Segmento ${state.segmentIndex + 1} de ${cap.segments.length} · ${escapeHTML(seg.kicker)}
          </span>
          <h3 class="segment__title">${escapeHTML(seg.title)}</h3>
          <p class="segment__text">${escapeHTML(seg.text)}</p>
          <div class="key-concept">
            <span class="key-concept__label">Concepto clave</span>
            <p>${escapeHTML(seg.keyConcept)}</p>
          </div>
          <div class="fact">
            <svg class="icon"><use href="#i-spark"/></svg>
            <div>
              <strong>Dato importante</strong>
              <p>${escapeHTML(seg.fact)}</p>
            </div>
          </div>
        </article>`;
    } else {
      const quiz = cap.quiz;
      const letters = ['A', 'B', 'C', 'D'];
      const feedbackCls = state.quizAnswered
        ? state.quizCorrect ? 'is-correct' : 'is-wrong'
        : '';

      body.innerHTML = `
        <article class="quiz">
          <span class="segment__kicker">Comprobación de aprendizaje</span>
          <h3 class="segment__title">${escapeHTML(quiz.question)}</h3>
          <div class="quiz__options">
            ${quiz.options
              .map((opt, i) => {
                let cls = 'quiz__option';
                if (state.quizAnswered && i === quiz.correct) cls += ' is-correct';
                else if (state.quizAnswered && i === state.quizSelected && !state.quizCorrect)
                  cls += ' is-wrong';
                else if (!state.quizAnswered && i === state.quizSelected) cls += ' is-selected';
                return `
                  <button class="${cls}" data-option="${i}" ${state.quizAnswered ? 'disabled' : ''}>
                    <span class="quiz__letter">${letters[i]}</span>
                    <span>${escapeHTML(opt)}</span>
                  </button>`;
              })
              .join('')}
          </div>
          ${
            state.quizAnswered
              ? `
            <div class="quiz__feedback ${feedbackCls}">
              <svg class="icon"><use href="#${state.quizCorrect ? 'i-check' : 'i-target'}"/></svg>
              <div>
                <strong>${state.quizCorrect ? '¡Correcto!' : 'Casi…'}</strong>
                ${escapeHTML(state.quizCorrect ? quiz.feedbackOk : quiz.feedbackKo)}
              </div>
            </div>
            <div class="quiz__actions">
              ${
                state.quizCorrect
                  ? `<button class="btn btn--primary" data-action="finish-capsule">
                       Continuar <svg class="icon"><use href="#i-arrow-right"/></svg>
                     </button>`
                  : `<button class="btn btn--primary" data-action="retry-quiz">
                       <svg class="icon"><use href="#i-refresh"/></svg> Volver a intentarlo
                     </button>`
              }
            </div>`
              : ''
          }
        </article>`;
    }

    /* Navegación */
    const prevBtn = $('#btn-prev');
    const nextBtn = $('#btn-next');
    if (prevBtn) {
      prevBtn.disabled = state.phase === 'segment' && state.segmentIndex === 0;
      prevBtn.hidden = false;
    }
    if (nextBtn) {
      if (state.phase === 'quiz') {
        nextBtn.hidden = true;
      } else {
        nextBtn.hidden = false;
        nextBtn.innerHTML =
          state.segmentIndex >= cap.segments.length - 1
            ? `Ir a comprobación <svg class="icon"><use href="#i-arrow-right"/></svg>`
            : `Siguiente <svg class="icon"><use href="#i-arrow-right"/></svg>`;
      }
    }
  }

  /* ---------- RENDER: CONCLUSIÓN ---------- */
  function renderConclusion() {
    const list = $('#summary-list');
    if (!list) return;
    list.innerHTML = CONTENT.capsules
      .map(
        (cap) => `
        <div class="summary__item">
          <span class="summary__icon"><svg class="icon"><use href="#${cap.icon}"/></svg></span>
          <div class="summary__text">
            <h4>${escapeHTML(cap.title)}</h4>
            <p>${escapeHTML(cap.subtitle)}</p>
          </div>
          <span class="summary__check"><svg class="icon"><use href="#i-check"/></svg></span>
        </div>`
      )
      .join('');
  }

  /* ---------- RENDER MASTER ---------- */
  function render() {
    renderScreen();
    renderProgress();
    if (state.screen === 'hub') renderHub();
    if (state.screen === 'capsule') renderCapsule();
    if (state.screen === 'conclusion') renderConclusion();
  }

  /* ---------- NAVEGACIÓN ---------- */
  function goWelcome() { state.screen = 'welcome'; save(); render(); }
  function goMission() { state.screen = 'mission'; save(); render(); }
  function goHub() {
    state.screen = 'hub';
    state.capsuleId = null;
    save();
    render();
  }
  function goConclusion() { state.screen = 'conclusion'; save(); render(); }

  function openCapsule(id) {
    if (!CONTENT.capsules.find((c) => c.id === id)) return;
    state.capsuleId = id;
    state.segmentIndex = 0;
    state.phase = 'segment';
    state.quizSelected = null;
    state.quizAnswered = false;
    state.quizCorrect = false;
    state.screen = 'capsule';
    save();
    render();
  }

  function nextStep() {
    const cap = getCapsule();
    if (!cap) return;
    if (state.phase === 'segment') {
      if (state.segmentIndex < cap.segments.length - 1) {
        state.segmentIndex++;
      } else {
        state.phase = 'quiz';
        state.quizSelected = null;
        state.quizAnswered = false;
        state.quizCorrect = false;
      }
    }
    render();
  }

  function prevStep() {
    if (state.phase === 'quiz') {
      state.phase = 'segment';
      state.quizSelected = null;
      state.quizAnswered = false;
      state.quizCorrect = false;
    } else if (state.segmentIndex > 0) {
      state.segmentIndex--;
    }
    render();
  }

  function selectOption(idx) {
    if (state.quizAnswered) return;
    const cap = getCapsule();
    if (!cap) return;
    state.quizSelected = idx;
    state.quizAnswered = true;
    state.quizCorrect = idx === cap.quiz.correct;
    if (state.quizCorrect && !state.completed[cap.id]) {
      state.completed[cap.id] = true;
      save();
      toast('Cápsula completada');
    }
    render();
  }

  function retryQuiz() {
    state.quizSelected = null;
    state.quizAnswered = false;
    state.quizCorrect = false;
    render();
  }

  function finishCapsule() { goHub(); }

  function resetProgress() {
    const ok = window.confirm(
      '¿Reiniciar todo el progreso de la Etapa 1? Esta acción no se puede deshacer.'
    );
    if (!ok) return;
    state.completed = Object.fromEntries(CAPSULE_IDS.map((id) => [id, false]));
    state.capsuleId = null;
    state.segmentIndex = 0;
    state.phase = 'segment';
    state.quizSelected = null;
    state.quizAnswered = false;
    state.quizCorrect = false;
    state.screen = 'welcome';
    save();
    render();
    toast('Progreso reiniciado');
  }

  /* ---------- EVENTOS ---------- */
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(
        '[data-action], [data-open-capsule], [data-option]'
      );
      if (!target) return;

      const openId = target.getAttribute('data-open-capsule');
      if (openId) { openCapsule(openId); return; }

      const optIdx = target.getAttribute('data-option');
      if (optIdx !== null) { selectOption(parseInt(optIdx, 10)); return; }

      const action = target.getAttribute('data-action');
      switch (action) {
        case 'start': goMission(); break;
        case 'go-welcome': goWelcome(); break;
        case 'mission-continue': goHub(); break;
        case 'back-hub': goHub(); break;
        case 'prev': prevStep(); break;
        case 'next': nextStep(); break;
        case 'retry-quiz': retryQuiz(); break;
        case 'finish-capsule': finishCapsule(); break;
        case 'go-conclusion': goConclusion(); break;
        case 'reset': resetProgress(); break;
      }
    });
  }

  /* ---------- SERVICE WORKER ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* silencioso */ });
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    load();
    bindEvents();
    render();
    registerSW();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
