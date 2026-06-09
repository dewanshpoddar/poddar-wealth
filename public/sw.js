const CACHE_NAME = 'poddar-wealth-v1';
const PRECACHE = [
  '/',
  '/assets/pwm-logo.svg',
  '/offline',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Only handle GET requests and exclude internal Next /_next paths and Vercel analytics
  if (e.request.method !== 'GET') return;
  
  const url = new URL(e.request.url);
  
  // Network-first for API, admin dashboard, dynamic actions, and _next/webpack
  if (
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_next/') ||
    url.hostname.includes('vercel-insights.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/offline'))
    );
    return;
  }

  // Cache-first for precached resources and static assets (images, SVGs)
  const isStatic = PRECACHE.includes(url.pathname) || url.pathname.startsWith('/assets/') || url.pathname.includes('/icon-');
  
  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(e.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Network-first, fall back to offline page for document fetches
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Only return offline page for page navigations (HTML request)
          if (e.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline');
          }
          return new Response('Network error. Check connection.', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});
