/**
 * JMC Network service worker.
 *
 * Every build ships this file at its own base (the production site and each
 * PR preview), so a worker registered from a page is always the copy that
 * belongs to that build, scoped to its own base. The app additionally skips
 * registration when a site-root build is served under a preview path (see
 * src/main.tsx), so the production worker never adopts preview pages.
 *
 * Strategy:
 * - Navigations: network-first, falling back to the cached SPA shell
 *   (404.html is a copy of index.html) when the network is unavailable.
 * - Hashed Vite assets (/assets/...): cache-first - the filenames are
 *   content-hashed and never change for a given URL.
 * - Other same-origin requests: network-first, caching successful responses.
 * - Cross-origin requests (Discord widget, mcsrvstat API) are passed through
 *   untouched.
 */

const CACHE_NAME = "jmc-cache-v1";

/**
 * Files precached on install so the app shell can render offline.
 * Relative to the worker's scope.
 */
const PRECACHE = [
  "./",
  "./404.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

function scopeUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE.map(scopeUrl)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first with the SPA shell as the offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(scopeUrl("./404.html"), copy),
          );
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match(scopeUrl("./404.html"))) ??
            Response.error()
          );
        }),
    );
    return;
  }

  // Hashed build assets: cache-first, they are immutable per URL.
  if (url.pathname.includes("/assets/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, copy),
            );
            return response;
          }),
      ),
    );
    return;
  }

  // Everything else same-origin: network-first, cache on success.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, copy),
          );
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
