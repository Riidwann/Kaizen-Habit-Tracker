// KaizenFlow Service Worker for Offline Habit Tracking
const CACHE_NAME = "kaizenflow-v2";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// Install: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Cache addAll warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
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
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate for instant launch, Cache-first for static chunks
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-GET or chrome-extension requests
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  // Navigation requests (HTML pages) - Instant cached response to dismiss OS splash immediately
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Fetch latest version in background
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => null);

        // Return instant cached response if available (renders in < 30ms, zero OS freeze)
        if (cachedResponse) {
          return cachedResponse;
        }

        // First visit / no cache: wait for network response or root cache fallback
        return networkFetch.then(async (res) => {
          if (res) return res;
          const rootCached = await caches.match("/");
          return rootCached || new Response("Offline", { status: 200, headers: { "Content-Type": "text/html" } });
        });
      })
    );
    return;
  }

  // Static assets (scripts, styles, icons, fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Offline - noop
          });
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return networkResponse;
      }).catch(() => {
        return new Response("", { status: 408, statusText: "Offline" });
      });
    })
  );
});
