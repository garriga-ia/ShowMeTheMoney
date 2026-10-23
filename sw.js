/**
 * SERVICE WORKER (sw.js) - ShowMeTheMoney PWA
 * Permet instal·lar l'aplicació com a nativa i funcionar 100% offline sense connexió.
 */

const CACHE_NAME = 'smtm-v1.0.7';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'css/chat.css',
  'css/widgets.css',
  'js/state.js',
  'js/sound.js',
  'js/colla.js',
  'js/engine.js',
  'js/data/capitols-index.js',
  'js/data/capitol1.js',
  'js/data/capitol2.js',
  'js/data/capitol3.js',
  'js/data/capitol4.js',
  'js/data/capitol5.js',
  'js/data/capitol6.js',
  'js/data/capitol7.js',
  'js/data/capitol8.js',
  'js/data/capitol9.js',
  'js/data/capitol10.js',
  'js/data/capitol11.js',
  'js/data/capitol12.js',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/icon-maskable.png',
  'img/apple-touch-icon.png',
  'img/icon.svg',
  'img/og-show-me-the-money.png',
  'img/avatars/marc.jpg',
  'img/avatars/nil.jpg',
  'img/avatars/marta.jpg',
  'img/avatars/aina.jpg',
  'img/avatars/pau.jpg',
  'img/avatars/tu.jpg'
];

// 1. Instal·lació i precache de tots els recursos estàtics
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Activació i neteja de versions antigues de memòria cau
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estratègia Stale-While-Revalidate / Cache-First per a navegació offline instantània
self.addEventListener('fetch', event => {
  // Només gestionar peticions GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Intentar actualitzar en segon pla (revalidate) si hi ha connexió
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // En cas de fallada de xarxa (mode offline), si és navegació HTML retornar index.html
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });

      // Retornar la versió en cau immediatament si existeix; sinó esperar la xarxa
      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Gestió del clic a la notificació diària de ratxa
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./#dashboard');
      }
    })
  );
});
