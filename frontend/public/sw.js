const CACHE_VERSION = '1.0.2'; // Increment manually for new deployments
const CACHE_NAME = `smart-calculator-hub-v${CACHE_VERSION}`;
const STATIC_CACHE = `static-cache-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-v${CACHE_VERSION}`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Calculator routes that should be cached
const CALCULATOR_ROUTES = [
  '/calculators/financial/compound-interest',
  '/calculators/financial/loan-calculator',
  '/calculators/financial/mortgage-calculator',
  '/calculators/financial/retirement-calculator',
  '/calculators/financial/roi-calculator',
  '/calculators/financial/credit-card-payoff',
  '/calculators/financial/emergency-fund',
  '/calculators/financial/investment-calculator',
  '/calculators/financial/simple-interest',
  '/calculators/math/percentage-calculator',
  '/calculators/math/age-calculator',
  '/calculators/math/unit-converter',
  '/calculators/health/bmi-calculator',
  '/calculators/utility/currency-converter',
  '/calculators/utility/tip-calculator',
  '/calculators/us/loan-calculator',
  '/calculators/us/mortgage-calculator',
  '/calculators/us/state-tax-calculator',
  '/hub/finance-tools',
  '/hub/math-tools',
  '/hub/health-tools',
  '/hub/utility-tools'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        // Don't automatically skip waiting, let the app control it
      })
      .catch(err => {
        console.error('Service Worker: Failed to cache static files', err);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (not same origin)
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200 && response.type === 'basic') {
            try {
              // Clone response for cache
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone))
                .catch(error => console.warn('Failed to cache API response:', error));
            } catch (error) {
              console.warn('Failed to clone API response for caching:', error);
            }
          }
          
          return response;
        })
        .catch(() => {
          // Try to serve from cache if network fails
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page for failed API requests
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle navigation requests with network-first strategy for fresh content
  if (request.mode === 'navigate') {
    event.respondWith(
      // Try network first to get fresh content
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200 && response.type === 'basic' && shouldCache(url.pathname)) {
            try {
              // Clone response for cache
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone))
                .catch(error => console.warn('Failed to cache navigation response:', error));
            } catch (error) {
              console.warn('Failed to clone navigation response for caching:', error);
            }
          }
          
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Serve offline page if no cache available
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle static assets with stale-while-revalidate strategy
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version immediately if available
        const networkResponse = fetch(request)
          .then(response => {
            // Update cache in the background
            if (response && response.status === 200 && response.type === 'basic') {
              try {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone))
                  .catch(error => console.warn('Failed to cache asset response:', error));
              } catch (error) {
                console.warn('Failed to clone asset response for caching:', error);
              }
            }
            return response;
          })
          .catch(() => cachedResponse); // Fall back to cache on network error
        
        // Return cached response immediately, update in background
        return cachedResponse || networkResponse;
      })
  );
});

// Helper function to determine if a route should be cached
function shouldCache(pathname) {
  // Cache calculator routes and important pages
  return CALCULATOR_ROUTES.some(route => pathname.includes(route)) ||
         pathname === '/' ||
         pathname.startsWith('/hub/') ||
         pathname.startsWith('/calculators/');
}

// Handle background sync for offline forms
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submissions when back online
      syncContactForm()
    );
  }
});

async function syncContactForm() {
  try {
    // Retrieve pending form submissions from IndexedDB
    const pendingForms = await getPendingForms();
    
    for (const form of pendingForms) {
      try {
        await fetch('/api/contact/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });
        
        // Remove from pending if successful
        await removePendingForm(form.id);
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle messages from the client
self.addEventListener('message', event => {
  // Silently ignore invalid messages
  if (!event.data || typeof event.data !== 'object') {
    return;
  }

  // Handle known message types
  try {
    if (event.data.action === 'skipWaiting') {
      console.log('Service Worker: Skip waiting requested');
      self.skipWaiting();
      // Notify all clients that the update is ready
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ action: 'reload' });
        });
      });
    }
  } catch (error) {
    console.warn('Service Worker: Error processing message:', error);
  }
});

// IndexedDB helpers for offline form storage
async function getPendingForms() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CalculatorHub', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingForms'], 'readonly');
      const store = transaction.objectStore('pendingForms');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingForms')) {
        db.createObjectStore('pendingForms', { keyPath: 'id' });
      }
    };
  });
}

async function removePendingForm(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CalculatorHub', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingForms'], 'readwrite');
      const store = transaction.objectStore('pendingForms');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}