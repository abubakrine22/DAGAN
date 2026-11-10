// Point d'entrée : navigation, barre d'onglets, thème, service worker.

import { h, clear, icon, closeSheet, toast } from './ui.js';
import { getState, subscribe } from './store.js';
import { stop as stopAudio } from './audio.js';
import { setRenderer } from './nav.js';
import { homeView } from './views/home.js';
import * as reading from './views/reading.js';
import * as quran from './views/quran.js';
import * as vocab from './views/vocab.js';
import * as settingsViews from './views/settings.js';

const TABS = [
  { href: '#/', label: 'Accueil', icon: 'home', match: (p) => p === '/' },
  { href: '#/lecture', label: 'Lecture', icon: 'read', match: (p) => p.startsWith('/lecture') },
  { href: '#/coran', label: 'Coran', icon: 'quran', match: (p) => p.startsWith('/coran') },
  { href: '#/mots', label: 'Mots', icon: 'cards', match: (p) => p.startsWith('/mots') },
  { href: '#/reglages', label: 'Réglages', icon: 'settings', match: (p) => p.startsWith('/reglages') || p.startsWith('/apropos') },
];

// Table des routes : motif -> fonction de vue. Une vue renvoie { title, node, back?, actions?, cleanup? }.
const ROUTES = [
  ['/', homeView],
  ['/lecture', reading.hubView],
  ['/lecture/alphabet', reading.alphabetView],
  ['/lecture/lettre/:i', reading.letterView],
  ['/lecture/signes/:id', reading.signsView],
  ['/lecture/syllabes', reading.syllablesView],
  ['/lecture/semblables', reading.similarView],
  ['/lecture/mots', reading.wordsDrillView],
  ['/lecture/guidee', reading.guidedListView],
  ['/lecture/guidee/:s', reading.guidedView],
  ['/lecture/wolofal', reading.wolofalView],
  ['/coran', quran.listView],
  ['/coran/:s', quran.surahView],
  ['/coran/:s/quiz', quran.quizView],
  ['/mots', vocab.hubView],
  ['/mots/revision', vocab.reviewView],
  ['/mots/lecon/:id', vocab.lessonView],
  ['/mots/lecon/:id/quiz', vocab.lessonQuizView],
  ['/mots/racines', vocab.rootsView],
  ['/mots/racine/:root', vocab.rootView],
  ['/mots/mes-mots', vocab.myWordsView],
  ['/reglages', settingsViews.settingsView],
  ['/apropos', settingsViews.aboutView],
];

function matchRoute(path) {
  for (const [pattern, view] of ROUTES) {
    const pp = pattern.split('/');
    const ap = path.split('/');
    if (pp.length !== ap.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
      else if (pp[i] !== ap[i]) { ok = false; break; }
    }
    if (ok) return { view, params };
  }
  return null;
}

const viewEl = document.getElementById('view');
const titleEl = document.getElementById('page-title');
const backBtn = document.getElementById('back-btn');
const actionsEl = document.getElementById('topbar-actions');
const tabbar = document.getElementById('tabbar');
let current = null;
const scrollMemory = new Map();

backBtn.append(icon('back'));
backBtn.addEventListener('click', () => {
  location.hash = backBtn.dataset.href || '#/';
});

function renderTabs(path) {
  clear(tabbar);
  for (const t of TABS) {
    tabbar.append(h('a', { class: 'tab', href: t.href, 'aria-current': t.match(path) ? 'page' : null }, icon(t.icon), h('span', null, t.label)));
  }
}

function currentPath() {
  const raw = location.hash.replace(/^#/, '') || '/';
  return raw.length > 1 ? raw.replace(/\/$/, '') : raw;
}

function render() {
  const path = currentPath();
  if (current) {
    scrollMemory.set(current.path, window.scrollY);
    current.cleanup?.();
  }
  stopAudio();
  closeSheet();
  const match = matchRoute(path);
  let result;
  try {
    result = match ? match.view(match.params) : null;
  } catch (err) {
    console.error(err);
    result = null;
  }
  if (!result) {
    result = { title: 'Page introuvable', back: '#/', node: h('div', { class: 'empty' }, h('p', null, 'Cette page n’existe pas.'), h('a', { class: 'btn primary', href: '#/' }, 'Retour à l’accueil')) };
  }
  current = { path, cleanup: result.cleanup };
  titleEl.textContent = result.title || 'DAGAN';
  document.title = result.title ? `${result.title} · DAGAN` : 'DAGAN – L’arabe du Coran';
  backBtn.hidden = !result.back;
  backBtn.dataset.href = result.back || '';
  clear(actionsEl);
  (result.actions || []).forEach((a) => actionsEl.append(a));
  clear(viewEl).append(result.node);
  renderTabs(path);
  window.scrollTo(0, result.keepScroll ? (scrollMemory.get(path) || 0) : 0);
}

function applyTheme() {
  const { theme, arScale } = getState().settings;
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
  root.style.setProperty('--ar-scale', String(arScale || 1));
}

window.addEventListener('hashchange', render);
setRenderer(render);
subscribe(applyTheme);
applyTheme();
render();

// ── Hors connexion : service worker ──
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      const offerUpdate = (worker) => {
        toast('Une nouvelle version de DAGAN est prête.', { action: 'Mettre à jour', onAction: () => worker.postMessage('skipWaiting') });
      };
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(nw);
        });
      });
    }).catch(() => { /* hors ligne ou non pris en charge */ });
  });
}

