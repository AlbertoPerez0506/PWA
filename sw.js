// Service Worker de BIOISLAS
// Cache-first para recursos estáticos, network-first con fallback para navegación.

const CACHE_NAME = 'bioislas-v1.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/games.html',
  '/game-biodiversity.html',
  '/game-ecosystem.html',
  '/game-conservation.html',
  '/exam.html',
  '/results.html',
  '/manual.html',
  '/settings.html',
  '/manifest.webmanifest',
  '/css/styles.css',
  '/js/app.js',
  '/js/icons.js',
  '/js/db.js',
  '/js/audio.js',
  '/js/notifications.js',
  '/js/data.js',
  '/js/quiz-game.js',
  '/js/results-page.js',
  '/js/settings-page.js',
  '/assets/images/icon.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('/index.html');
        });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if (c.url === url && 'focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
