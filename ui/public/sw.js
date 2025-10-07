// public/sw.js - conservative, on-demand caching for preview/production
const CACHE_NAME = 'static-cache-v1';
const PRECACHE = ['/', '/index.html'];

// Install: try to cache index and root, but don't fail installation if a fetch fails
self.addEventListener('install', (event) => {
  console.log('[SW] install');
  const p = caches.open(CACHE_NAME).then(async (cache) => {
    const results = await Promise.allSettled(
      PRECACHE.map(async (path) => {
        try {
          // avoid returning a cached entry; force network to ensure we get fresh files
          const res = await fetch(path, { cache: 'no-store' });
          if (!res || !res.ok) throw new Error(`Bad response for ${path}: ${res && res.status}`);
          await cache.put(path, res.clone());
          return { path, ok: true };
        } catch (err) {
          console.error('[SW] precache entry failed', path, err);
          return { path, ok: false, err };
        }
      })
    );
    const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value && !r.value.ok));
    if (failed.length) {
      console.warn('[SW] some precache entries failed', failed.map((f) => f.status === 'fulfilled' ? f.value.path : f.reason));
    }
  }).catch((err) => console.error('[SW] precache overall failed', err));

  event.waitUntil(p);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  event.waitUntil(self.clients.claim());
});

// Fetch handler:
// - navigation requests: try network, fallback to cached index.html
// - same-origin GET requests: return cache match or fetch -> cache-on-success
// - don't handle cross-origin requests
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Don't interfere with requests to other origins (CDNs, APIs)
  if (url.origin !== self.location.origin) {
    return;
  }

  // SPA navigation request
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // successful navigation response -> return it
          return res;
        })
        .catch(() => {
          // offline -> serve cached index.html
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For static assets & other GETs — try cache first, then network, then fallback 503
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((networkRes) => {
            // Cache successful responses for later
            if (networkRes && networkRes.status === 200) {
              const clone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return networkRes;
          })
          .catch(() => {
            // final fallback if both cache and network fail
            return new Response('Offline', { status: 503, statusText: 'Offline' });
          });
      })
    );
  }
});

// Listen for messages (e.g., from the page to trigger skip-waiting)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'skip-waiting') {
    self.skipWaiting();
    // If the sender used MessageChannel, reply on the port
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ ok: true });
    }
  }
});