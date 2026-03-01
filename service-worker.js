// ═══════════════════════════════════════════════════════════
//  HAMMS ASSET AUTODETECT — Service Worker
//  Cache Name: mantrack-cache-v1
//  Strategy:
//    - Core shell  → Cache First (offline-safe)
//    - CDN fonts   → Network First (fallback to cache)
//    - Navigation  → Always serve index.html shell
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'mantrack-cache-v1';

// Core assets to precache on install
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// CDN origins — use network-first for these
const CDN_ORIGINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
];

// ── INSTALL: precache shell assets ──────────────────────────
self.addEventListener('install', event => {
  console.log('[HAMMS SW] Installing — cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        // Silently fail on individual icon misses during dev
        console.warn('[HAMMS SW] Precache partial failure (ok during dev):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ───────────────────────────
self.addEventListener('activate', event => {
  console.log('[HAMMS SW] Activating — cleaning old caches');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[HAMMS SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: routing strategy ──────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests entirely
  if (request.method !== 'GET') return;

  // 2. CDN / external resources → Network First, fallback to cache
  if (CDN_ORIGINS.some(origin => url.hostname.includes(origin))) {
    event.respondWith(networkFirstThenCache(request));
    return;
  }

  // 3. Navigation requests (HTML pages) → serve index.html shell
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        if (cached) return cached;
        return fetch(request).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // 4. Same-origin static assets → Cache First, fallback to network
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstThenNetwork(request));
    return;
  }

  // 5. Everything else → network only (don't block)
});

// ── STRATEGY: Cache First ─────────────────────────────────────
async function cacheFirstThenNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[HAMMS SW] Network failed, no cache for:', request.url);
    // Return minimal offline fallback for same-origin HTML
    if (request.destination === 'document') {
      return caches.match('./index.html');
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// ── STRATEGY: Network First ───────────────────────────────────
async function networkFirstThenCache(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    console.warn('[HAMMS SW] CDN request failed, no cached fallback for:', request.url);
    return new Response('', { status: 503 });
  }
}
