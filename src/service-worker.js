/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'smart-hive-v1';
const urlsToCache = ['/', '/index.html'];

// @ts-ignore
self.addEventListener('install', (event) => {
  // @ts-ignore
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// @ts-ignore
self.addEventListener('fetch', (event) => {
  // @ts-ignore
  event.respondWith(
    // @ts-ignore
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
