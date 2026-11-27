const CACHE_NAME = 'bioislas-rewild-v5.0.0';
const APP_SHELL = [
  '/', '/index.html', '/modules.html', '/game-memorama.html', '/game-terms.html', '/game-sequence.html',
  '/exam.html', '/results.html', '/settings.html', '/manual.html', '/about.html',
  '/games.html', '/game-biodiversity.html', '/game-ecosystem.html', '/game-conservation.html',
  '/manifest.webmanifest', '/css/styles.css', '/css/experience.css',
  '/js/app.js', '/js/audio.js', '/js/db.js', '/js/map.js', '/js/content.js', '/js/modules.js',
  '/js/data.js', '/js/game-guard.js', '/js/game-memorama.js', '/js/game-terms.js', '/js/game-sequence.js',
  '/js/exam.js', '/js/results.js', '/js/settings.js', '/js/notifications.js', '/js/experience.js',
  '/assets/images/app-icon.svg', '/assets/images/app-icon-maskable.svg',
  '/assets/images/app-icon-192.png', '/assets/images/app-icon-512.png', '/assets/images/app-icon-maskable-512.png',
  '/assets/images/mascot.svg', '/assets/images/tucan-guide.jpg',
  '/assets/images/island-01.svg', '/assets/images/island-02.svg', '/assets/images/island-03.svg',
  '/assets/images/island-04.svg', '/assets/images/island-05.svg',
  '/assets/images/instruments/bioreactor.svg', '/assets/images/instruments/microscope.svg',
  '/assets/images/instruments/pipette.svg', '/assets/images/instruments/autoclave.svg',
  '/assets/images/instruments/centrifuge.svg', '/assets/images/instruments/ph-meter.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('bioislas-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      const refresh = fetch(request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => null);
      if (request.mode === 'navigate') event.waitUntil(refresh);
      return cached;
    }
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') return (await caches.match('/index.html')) || Response.error();
      return Response.error();
    }
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const destination = event.notification.data?.url || '/index.html';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    for (const client of windows) {
      if (new URL(client.url).pathname === destination && 'focus' in client) return client.focus();
    }
    return self.clients.openWindow?.(destination);
  }));
});
