const CACHE_NAME = "lam-electrotech-static-v14";
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
  "./realisations/electricite/cellule-electrique-technicien.jpg",
  "./realisations/electricite/pupitre-cellules-electriques.jpg",
  "./realisations/electricite/ensemble-cellules-electriques.jpg",
  "./realisations/electricite/raccordements-transformateur.jpg",
  "./realisations/electricite/technicien-devant-cellules.jpg",
  "./realisations/electricite/transformateur-vue-ensemble.jpg",
  "./realisations/electricite/acheminement-cables-transformateur.jpg",
  "./realisations/electricite/coffret-electrique-commande-et-cablage.jpg",
  "./realisations/electricite/tableau-commande-et-protection-des-pompes.jpg",
  "./realisations/electricite/controleur-installation-ordre-des-phases.jpg",
  "./realisations/electricite/lecture-testeur-installation-electrique.jpg",
  "./realisations/electricite/technicien-en-chantier-electricite-batiment.jpg",
  "./realisations/electricite/technicien-sur-chantier-en-construction.jpg",
  "./realisations/electricite/vue-generale-chantier-en-cours.jpg",
  "./realisations/electricite/gaines-electriques-en-plafond-gros-oeuvre-vue-01.jpg",
  "./realisations/electricite/cheminements-cables-plateau-grillage-plafond-vue-02.jpg",
  "./realisations/electricite/gaines-electriques-plafond-piece-en-construction-vue-03.jpg",
  "./realisations/electricite/cheminements-electriques-sous-plafond-vue-04.jpg",
  "./realisations/electricite/gaines-electriques-couloir-en-construction-vue-05.jpg",
  "./realisations/electricite/boitier-electrique-en-cours-de-pose.jpg",
  "./realisations/electricite/gaines-et-conducteurs-en-attente-au-sol-vue-01.jpg",
  "./realisations/electricite/gaines-electriques-en-attente-dans-la-piece-vue-02.jpg",
  "./realisations/electricite/disjoncteur-schneider-et-cables-de-puissance.jpg",
  "./contact.vcf",
  "./styles.css?v=14",
  "./script.js",
  "./favicon.svg",
  "./logo-horizontal.png",
  "./logo-icon.png",
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
    if (request.mode === "navigate") {
      const response = await refreshedResponse;
      if (response && response.ok) return response;

      const cached = await cachedResponse;
      if (cached) return cached;
      if (response) return response;

      return (await caches.match("./offline.html")) || Response.error();
    }

    const cached = await cachedResponse;
    if (cached) return cached;

    const response = await refreshedResponse;
    if (response) return response;

    return new Response("Contenu indisponible hors connexion.", {
      status: 503,
      statusText: "Offline",
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  })());
});
