// Service worker de Daaraji — fichier généré par outils/construire-sw.py.
// L'application fonctionne hors connexion ; seuls les fichiers audio demandent Internet.

const VERSION = '999362d5ce';
const CACHE = `daaraji-${VERSION}`;
const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/audio.js',
  'js/components.js',
  'js/conjugate.js',
  'js/content.js',
  'js/data/alphabet.js',
  'js/data/books/akhdari.js',
  'js/data/books/index.js',
  'js/data/books/nawawi.js',
  'js/data/books/qawaid.js',
  'js/data/books/usul.js',
  'js/data/grammar.js',
  'js/data/quran.js',
  'js/data/signs.js',
  'js/data/verbs.js',
  'js/data/vocab.js',
  'js/nav.js',
  'js/srs.js',
  'js/store.js',
  'js/ui.js',
  'js/views/home.js',
  'js/views/library.js',
  'js/views/method.js',
  'js/views/quran.js',
  'js/views/reading.js',
  'js/views/settings.js',
  'js/views/vocab.js',
  'js/wolofal.js',
  'fonts/scheherazade-new-arabic-400-normal.woff2',
  'fonts/scheherazade-new-arabic-700-normal.woff2',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
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
