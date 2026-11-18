// sw.js
const SW_VERSION = 'v1.0.0';
const CACHE_SHELL  = `bioislas-shell-${SW_VERSION}`;
const CACHE_ASSETS = `bioislas-assets-${SW_VERSION}`;
const CACHE_HTML   = `bioislas-html-${SW_VERSION}`;
const CURRENT_CACHES = [CACHE_SHELL, CACHE_ASSETS, CACHE_HTML];

const SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

/* ---------- INSTALL ---------- */
// Precarga el shell, pero NO activa la nueva versión automáticamente.
// La activación se dispara desde el cliente con postMessage({ type: 'SKIP_WAITING' })
// (o el string 'SKIP_WAITING'), típicamente desde un banner "Actualizar".
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_SHELL);
    // addAll aborta si UNA URL falla → usar add() por URL con allSettled
    await Promise.allSettled(SHELL_URLS.map((url) => cache.add(url)));
  })());
});

/* ---------- ACTIVATE ---------- */
// Borra cachés de versiones anteriores y toma control de clientes abiertos.
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => !CURRENT_CACHES.includes(k))
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* ---------- MESSAGE ---------- */
// Único punto donde se permite skipWaiting: bajo demanda explícita del cliente.
self.addEventListener('message', (event) => {
  const data = event.data;
  const wantsSkip =
    data === 'SKIP_WAITING' ||
    (data && data.type === 'SKIP_WAITING');

  if (wantsSkip) {
    event.waitUntil(self.skipWaiting());
  }
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // No cachear peticiones cross-origin: dejamos que el navegador las gestione.
  if (url.origin !== self.location.origin) return;

  // 1) Navegación (HTML) → network-first con fallback al shell
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(req));
    return;
  }

  // 2) Estáticos versionados por Vite → stale-while-revalidate
  if (url.pathname.includes('/assets/')) {
    event.respondWith(staleWhileRevalidate(req, CACHE_ASSETS));
    return;
  }

  // 3) Resto (css/js sueltos, svg, ico, manifest) → network-first
  event.respondWith(networkFirst(req, CACHE_SHELL));
});

/* ---------- ESTRATEGIAS ---------- */

async function networkFirstNavigation(req) {
  const cache = await caches.open(CACHE_HTML);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      // Await: garantiza la escritura antes de devolver (latencia despreciable).
      await cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;

    const shell = await caches.open(CACHE_SHELL);
    const fallback =
      (await shell.match('./index.html')) ||
      (await shell.match('./'));

    if (fallback) return fallback;

    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Sin conexión</title>' +
      '<h1>Sin conexión</h1><p>Vuelve a intentarlo cuando recuperes la red.</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      await cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Fallback explícito: evita errores de red opacos en respondWith.
    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  // Revalidación en segundo plano (no bloquea la respuesta).
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) {
        // No esperamos: SWR debe responder rápido.
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => null);

  if (cached) return cached;

  const fresh = await network;
  if (fresh) return fresh;
  return new Response('', { status: 504, statusText: 'Gateway Timeout' });
}
