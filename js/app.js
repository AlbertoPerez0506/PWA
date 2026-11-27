import './experience.js';
import { getState, setState, getPreference } from './db.js';
import { initAudio, setAudioEnabled } from './audio.js';

const splash = document.querySelector('#splash-screen');
const welcome = document.querySelector('#welcome-screen');
const shell = document.querySelector('#app-shell');
const toastRegion = document.querySelector('#toast-region');

const onboardingSteps = [
  {
    title: 'Un archipiélago de descubrimientos',
    copy: 'Conoce los fundamentos de la biotecnología y descubre cómo los sistemas biológicos pueden transformar nuestro mundo.',
    speech: '¡Hola! Te acompañaré durante esta pequeña introducción a BIOISLAS.',
    benefits: ['Aprende a tu ritmo', 'Avanza isla por isla']
  },
  {
    title: 'Aprende, practica y juega',
    copy: 'Después de los tres módulos te esperan tres desafíos: relacionar instrumentos, descubrir términos y ordenar las etapas de un bioproceso.',
    speech: 'Cada reto pone a prueba algo distinto. ¡No hay prisa, lo importante es descubrir!',
    benefits: ['Memorama de laboratorio', 'Ahorcado científico y secuencia']
  },
  {
    title: 'Tu progreso crece contigo',
    copy: 'Consigue estrellas, mantén tu racha de estudio y desbloquea el examen final. Tu avance se conserva en este dispositivo, incluso al volver otro día.',
    speech: 'Una actividad al día puede mantener viva tu racha. ¡Vamos a comenzar!',
    benefits: ['Tres estrellas para abrir el examen', 'Progreso guardado localmente']
  }
];

let activeStep = 0;

export function toast(message, type = 'success', duration = 3000) {
  if (!toastRegion) return;
  const item = document.createElement('div');
  item.className = `toast ${type}`;
  item.textContent = message;
  toastRegion.appendChild(item);
  window.setTimeout(() => item.remove(), duration);
}

function renderOnboardingStep() {
  const step = onboardingSteps[activeStep];
  const title = document.querySelector('#onboarding-title');
  const copy = document.querySelector('#onboarding-copy');
  const speech = document.querySelector('#mascot-speech');
  const benefits = document.querySelector('#onboarding-benefits');
  const label = document.querySelector('#onboarding-step-label');
  const dots = document.querySelectorAll('#onboarding-dots span');
  const next = document.querySelector('#onboarding-next');
  const skip = document.querySelector('#onboarding-skip');

  [title, copy, speech, benefits].forEach(element => element?.classList.add('is-changing'));
  window.setTimeout(() => {
    if (title) title.textContent = step.title;
    if (copy) copy.textContent = step.copy;
    if (speech) speech.textContent = step.speech;
    if (benefits) benefits.innerHTML = step.benefits.map(item => `<span><i></i>${item}</span>`).join('');
    if (label) label.textContent = `${String(activeStep + 1).padStart(2, '0')} / 03`;
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeStep));
    document.querySelector('#onboarding-dots')?.setAttribute('aria-label', `Paso ${activeStep + 1} de 3`);
    if (next) next.innerHTML = activeStep === 2 ? 'Comenzar aventura <span aria-hidden="true">→</span>' : 'Continuar <span aria-hidden="true">→</span>';
    if (skip) skip.hidden = activeStep === 2;
    [title, copy, speech, benefits].forEach(element => element?.classList.remove('is-changing'));
  }, 160);
}

async function finishOnboarding() {
  const next = document.querySelector('#onboarding-next');
  if (next) next.disabled = true;
  await setState('welcomeSeen', true).catch(error => console.warn('No se pudo guardar la introducción:', error));
  welcome?.classList.add('is-hidden');
  shell?.classList.remove('is-hidden');
  toast('¡Tu aventura comienza! La Isla 01 está disponible.');
}

async function showEntryFlow() {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  await new Promise(resolve => window.setTimeout(resolve, reducedMotion ? 120 : 900));
  splash?.classList.add('is-leaving');
  const seen = await getState('welcomeSeen', false).catch(() => false);
  window.setTimeout(() => {
    splash?.classList.add('is-hidden');
    if (seen) shell?.classList.remove('is-hidden');
    else {
      activeStep = 0;
      welcome?.classList.remove('is-hidden');
      renderOnboardingStep();
    }
  }, reducedMotion ? 0 : 420);
}

document.querySelector('#onboarding-next')?.addEventListener('click', async () => {
  if (activeStep < onboardingSteps.length - 1) {
    activeStep += 1;
    renderOnboardingStep();
    return;
  }
  await finishOnboarding();
});
document.querySelector('#onboarding-skip')?.addEventListener('click', finishOnboarding);

async function initSound() {
  await initAudio();
  const button = document.querySelector('#sound-toggle');
  const target = document.querySelector('#sound-icon');
  if (!button) return;
  const paint = enabled => {
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'Silenciar sonidos' : 'Activar sonidos';
    if (target) target.textContent = enabled ? '♫' : '×';
  };
  const enabled = await getPreference('soundEnabled', !(await getPreference('muted', false)));
  paint(enabled);
  button.addEventListener('click', async () => {
    const next = button.getAttribute('aria-pressed') !== 'true';
    await setAudioEnabled(next);
    paint(next);
    toast(next ? 'Sonidos activados.' : 'Sonidos silenciados.');
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => console.warn('Service Worker:', error));
  });
}

initSound().catch(console.warn);
showEntryFlow().catch(error => {
  console.error(error);
  splash?.classList.add('is-hidden');
  welcome?.classList.add('is-hidden');
  shell?.classList.remove('is-hidden');
});
