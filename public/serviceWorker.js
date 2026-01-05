// PWA Service Worker with cache-first strategy and network fallback
const CACHE_NAME = 'mintxt-cache-v1';

// Get base path for GitHub Pages subdirectory
function getBasePath() {
  const path = self.location.pathname;
  // Remove serviceWorker.js from path to get base directory
  return path.substring(0, path.lastIndexOf('/'));
}

// Install event - cache static assets
self.addEventListener('install', function(event) {
  const basePath = getBasePath();
  const STATIC_CACHE_URLS = [
    basePath + '/',
    basePath + '/index.html',
    basePath + '/manifest.json',
    basePath + '/logo192.png',
    basePath + '/logo512.png',
    basePath + '/favicon.ico',
  ];
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_CACHE_URLS).catch(function(err) {
        // If some files fail to cache, continue anyway
        console.log('Cache addAll failed:', err);
      });
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Return cached version if available
      if (response) {
        return response;
      }
      
      // Otherwise fetch from network
      return fetch(event.request).then(function(response) {
        // Don't cache non-GET requests or non-successful responses
        if (event.request.method !== 'GET' || !response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache the fetched response
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(function() {
        // If network fails and it's a navigation request, return cached index.html
        if (event.request.mode === 'navigate') {
          const basePath = getBasePath();
          return caches.match(basePath + '/index.html');
        }
      });
    })
  );
});