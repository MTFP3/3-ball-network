// Service Worker for 3 Ball Network PWA
const CACHE_NAME = '3ball-network-v2.0-homepage-swap';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/firebaseConfig.js',
  '/assets/js/firebaseAuth.js',
  '/logo.png',
  '/about.html',
  '/register.html',
  '/login.html',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
