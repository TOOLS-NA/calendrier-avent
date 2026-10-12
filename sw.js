/* Calendrier de l'Avent — service worker
   Stratégie « réseau d'abord » : la page et les cadeaux sont toujours rechargés
   depuis Internet quand il y en a, la copie locale ne sert qu'hors connexion.
   Conséquence pratique : un cadeau modifié dans cadeaux.js est visible dès le
   rechargement, sans avoir à changer de numéro de version ici. */

const CACHE = "avent-v5";
const FICHIERS = [
  "./",
  "index.html",
  "cadeaux.js",
  "sons.js",
  "manifest.webmanifest",
  "fonts/barlow-latin-400-normal.woff2",
  "fonts/barlow-latin-600-normal.woff2",
  "fonts/barlow-condensed-latin-600-normal.woff2",
  "fonts/barlow-condensed-latin-700-normal.woff2",
  "fonts/berkshire-swash-latin-400-normal.woff2",
  "icons/icone-180.png",
  "icons/icone-192.png",
  "icons/icone-512.png",
  "icons/icone-masque-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-store" })
      .then((rep) => {
        if (rep && rep.ok) {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(req, copie));
        }
        return rep;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
