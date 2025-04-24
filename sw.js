const CACHE_NAME = 'super-pet-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/images/pet/idle.png',
  '/images/pet/happy.png',
  '/images/pet/hungry.png',
  '/images/pet/sleep.png',
  '/images/ui/coin.png',
  '/images/ui/gem.png',
  '/sounds/click.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
