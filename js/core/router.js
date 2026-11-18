// Router basado en hash
const routes = new Map();
let current = null;

export function registerRoute(name, renderFn) {
  routes.set(name, renderFn);
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
  const fn = routes.get(name);
  if (!fn) {
    console.warn('Ruta no encontrada:', name);
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
