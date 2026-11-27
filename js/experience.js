import './theme.js';
import { getState, setState } from './db.js';

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = '/css/experience.css';
styleLink.dataset.bioislasExperience = 'true';
if (!document.querySelector('link[href="/css/experience.css"]')) document.head.appendChild(styleLink);

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

let streakRequest = null;
async function recordStudyActivity() {
  if (streakRequest) return streakRequest;

  streakRequest = (async () => {
    const today = dateKey();
    const previous = await getState('learningStreak', { current: 0, longest: 0, lastDate: null });
    if (previous.lastDate === today) return previous;

    const nextCount = previous.lastDate === yesterdayKey()
      ? Number(previous.current || 0) + 1
      : 1;
    const next = {
      current: nextCount,
      longest: Math.max(Number(previous.longest || 0), nextCount),
      lastDate: today,
      updatedAt: new Date().toISOString()
    };

    await setState('learningStreak', next);
    return next;
  })().catch(error => {
    console.warn('No fue posible actualizar la racha de estudio:', error);
    return null;
  }).finally(() => {
    streakRequest = null;
  });

  return streakRequest;
}

// La racha se registra al iniciar una sesión real de aprendizaje, no solo al abrir la página.
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : null;
  const activityButton = target?.closest('#memory-start, #terms-start, #sequence-start, #exam-start, .module-complete');
  if (!activityButton || activityButton.disabled) return;
  recordStudyActivity();
}, true);

function observeReveals(root = document) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    root.querySelectorAll?.('[data-reveal], .module-card, .history-row, .setting-row, .team-card, .content-panel, .page-top')
      .forEach(element => element.classList.add('is-visible'));
    return;
  }

  const selector = '[data-reveal], .island-node, .module-card, .history-row, .setting-row, .team-card, .content-panel, .page-top';
  const matches = [
    ...(root.matches?.(selector) ? [root] : []),
    ...(root.querySelectorAll ? [...root.querySelectorAll(selector)] : [])
  ];

  matches.forEach((element, index) => {
    if (element.dataset.revealReady || element.closest('[hidden]')) return;
    element.dataset.revealReady = 'true';
    element.classList.add('reveal-on-scroll');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 65}ms`);
    revealObserver.observe(element);
  });
}

const revealObserver = !reducedMotion && 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' })
  : null;

function initReadingProgress() {
  if (document.querySelector('.reading-progress')) return;
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
}

function initParallax() {
  if (reducedMotion) return;
  const elements = [...document.querySelectorAll('[data-parallax]')];
  if (!elements.length) return;

  let scheduled = false;
  const update = () => {
    const y = Math.min(window.scrollY || 0, 900);
    elements.forEach((element, index) => {
      element.style.setProperty('--parallax-offset', `${y * (index % 2 ? 0.035 : -0.025)}px`);
    });
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function initTextReveal() {
  document.querySelectorAll('.map-intro h1, .page-top h1, .onboarding-content h1, .about-hero h1').forEach(element => {
    element.classList.add('text-reveal');
    window.requestAnimationFrame(() => element.classList.add('text-reveal-in'));
  });
}

observeReveals();
initReadingProgress();
initParallax();
initTextReveal();

const mutationObserver = new MutationObserver(records => {
  records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) observeReveals(node);
  }));
});
mutationObserver.observe(document.body, { childList: true, subtree: true });
