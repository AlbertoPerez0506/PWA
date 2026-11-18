// Router basado en hash
const routes = new Map();
let current = null;
let cleanupFn = null;

export function registerRoute(name, renderFn) {
  routes.set(name, renderFn);
}

export function setRouteCleanup(fn) {
  cleanupFn = typeof fn === 'function' ? fn : null;
}

export function navigate(name, params = {}) {
  const hash = '#' + name + (Object.keys(params).length ? '?' + new URLSearchParams(params) : '');
  if (location.hash === hash) {
    render(name, params);
  } else {
    location.hash = hash;
  }
}

export function getRoute() {
  const hash = location.hash.slice(1) || 'welcome';
  const [name, qs] = hash.split('?');
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  return { name, params };
}

async function render(name, params) {
  // Ejecutar cleanup de la ruta anterior (ej: clearInterval de juegos)
  if (cleanupFn) {
    try { cleanupFn(); } catch (e) { console.warn('[router cleanup]', e); }
    cleanupFn = null;
  }
  const fn = routes.get(name);
  if (!fn) {
    console.warn('Ruta no encontrada:', name);
    // Evita pantalla en blanco
    if (name !== 'welcome') navigate('welcome');
    return;
  }
  const main = document.getElementById('app-main');
  main.innerHTML = '';
  current = name;
  await fn(main, params);
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener('hashchange', () => {
    const { name, params } = getRoute();
    render(name, params);
  });
  const { name, params } = getRoute();
  render(name, params);
}
