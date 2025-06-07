const CACHE_NAME = 'multi-touch-winner-v1';
const urlsToCache = [
  './', // The main HTML file (this page)
  './index.html', // Explicitly cache index.html
  // Add other assets if they were separate files (e.g., 'style.css', 'script.js')
  // For a single HTML file, caching '/' is usually sufficient.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache, caching assets.');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('[Service Worker] Failed to cache:', error);
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        // No cache hit - fetch from network
        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('[Service Worker] Activated.');
});
