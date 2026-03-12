/* ══════════════════════════════════════
   SW.JS — Service Worker (PWA Offline)
   Tierras Altas Transparente v1.0
   Crítico para zonas con conectividad limitada
   (Cerro Punta, Paso Ancho, comunidades Ngäbe)
══════════════════════════════════════ */

const CACHE_NAME = 'tat-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/components.css',
  '/css/layout.css',
  '/css/accessibility.css',
  '/js/data.js',
  '/js/i18n.js',
  '/js/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// Instalación: guardar archivos clave en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-first con fallback a caché
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
