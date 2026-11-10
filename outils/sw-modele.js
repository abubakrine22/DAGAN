// Service worker de Daaraji — fichier généré par outils/construire-sw.py.
// L'application fonctionne hors connexion ; seuls les fichiers audio demandent Internet.

const VERSION = '__VERSION__';
const CACHE = `daaraji-${VERSION}`;
const FICHIERS = [
__FICHIERS__
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FICHIERS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => (k.startsWith('daaraji-') || k.startsWith('dagan-')) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // On ne touche pas aux fichiers audio ni aux autres sites : le navigateur les gère directement.
  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range')) return;

  if (req.mode === 'navigate') {
    // Page : réseau d'abord (pour les mises à jour), sinon la version gardée.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy));
          return res;
        })
        .catch(() => caches.match('./', { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
    );
    return;
  }

  // Fichiers de l'application : version gardée d'abord, réseau sinon.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => cached || fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })),
  );
});
