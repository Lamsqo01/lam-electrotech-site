const CACHE_NAME = "lam-electrotech-static-v8";
const APP_FILES = [
  "./",
  "./index.html",
  "./depannage.html",
  "./electricite.html",
  "./videosurveillance.html",
  "./antennes.html",
  "./solaire.html",
  "./maintenance.html",
  "./normes-securite.html",
  "./mentions-legales.html",
  "./politique-confidentialite.html",
  "./offline.html",
  "./404.html",
  "./contact.vcf",
  "./styles.css",
  "./script.js",
  "./favicon.svg",
  "./pwa-icon.svg",
  "./manifest.webmanifest",
  "./robots.txt"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("lam-electrotech-") && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

async function refreshCache(request) {
  let response;
  try {
    response = await fetch(request);
  } catch {
    return null;
  }

  if (response.ok) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    } catch {
      return response;
    }
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (!self.navigator.onLine) {
    event.respondWith((async () => {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === "navigate") {
        return (await caches.match("./offline.html")) || Response.error();
      }
      return new Response("Contenu indisponible hors connexion.", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })());
    return;
  }

  const cachedResponse = caches.match(request, { ignoreSearch: true });
  const refreshedResponse = refreshCache(request);
  event.waitUntil(refreshedResponse.then(() => undefined));
  event.respondWith((async () => {
    const cached = await cachedResponse;
    if (cached) return cached;

    const response = await refreshedResponse;
    if (response) return response;

    if (request.mode === "navigate") {
      return (await caches.match("./offline.html")) || Response.error();
    }

    return new Response("Contenu indisponible hors connexion.", {
      status: 503,
      statusText: "Offline",
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  })());
});
