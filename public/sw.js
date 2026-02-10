// Service Worker for Habit Garden
// Provides offline support by caching app shell and serving offline page

const CACHE_NAME = 'habit-garden-v2';
const OFFLINE_URL = '/offline.html';

// Essential files to cache for offline support
const ESSENTIAL_ASSETS = [
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache essential assets one by one to avoid failure if one fails
      const cachePromises = ESSENTIAL_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.log(`Failed to cache ${url}:`, error);
        }
      });

      await Promise.all(cachePromises);

      // Try to cache the root page, but don't fail if it doesn't work
      try {
        const rootResponse = await fetch('/');
        if (rootResponse.ok) {
          await cache.put('/', rootResponse);
        }
      } catch (error) {
        console.log('Failed to cache root page:', error);
      }
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network, show offline page if needed
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (like Google Ads, analytics, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests (page loads), use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, cache the response for future offline use
          if (response && response.ok && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            }).catch((err) => {
              console.log('Failed to cache navigation response:', err);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed, try to serve from cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // No cached version, serve offline page
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) {
            return offlinePage;
          }

          // If even the offline page isn't cached, return a basic response
          return new Response(
            '<html><body><h1>Offline</h1><p>You are currently offline. Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // For other requests (assets), use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version, but also fetch and update cache in background
        fetch(event.request).then((response) => {
          if (response && response.ok && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            }).catch(() => {
              // Ignore cache errors for background updates
            });
          }
        }).catch(() => {
          // Ignore fetch errors for background updates
        });
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response && response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          }).catch(() => {
            // Ignore cache errors
          });
        }
        return response;
      }).catch(() => {
        // For failed asset requests, return a minimal response
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
