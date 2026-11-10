// Bibliothèque : les 40 hadiths, Al-Akhdari, les Trois fondements, les Quatre règles.

import { h, ar, wolofalEl, icon, iconBtn, progressBar, toast } from '../ui.js';
import { BOOKS, getBook, getItem, chapterWordIds } from '../content.js';
import { addCards, hasCard } from '../srs.js';
import { getState, update, settings, logActivity } from '../store.js';
import { speak, play } from '../audio.js';
import { openWordSheet, openTextWordSheet, glossLines, quiz, meaningQuestions } from '../components.js';
import { refresh } from '../nav.js';

const cache = new Map();
function loadBook(id) {
  if (!cache.has(id)) cache.set(id, import(`../data/books/${id}.js`).then((m) => m.BOOK));
  return cache.get(id);
}

function studied(bookId) {
  return getState().progress.books?.[bookId] || {};
}

export function libraryView() {
  const node = h('div', null,
    h('p', { class: 'muted' }, 'Les textes que l’on étudie dans les daaras, en arabe vocalisé, avec la traduction française et le vocabulaire clé en français et en wolof.'),
    h('div', { class: 'stack' }, BOOKS.map((b) => {
      const done = Object.keys(studied(b.id)).length;
      return h('a', { class: 'card', href: `#/livres/${b.id}`, style: { display: 'block', color: 'inherit', textDecoration: 'none' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('h3', null, b.title),
            h('div', { class: 'small muted' }, b.author),
            h('div', { style: { marginTop: '6px' } }, h('span', { class: 'badge primary' }, b.level), ' ', h('span', { class: 'badge' }, `${b.chapters.length} ${b.id === 'nawawi' ? 'hadiths' : 'chapitres'}`))),
          ar(b.titleAr, 'ar-m')),
        h('p', { class: 'small', style: { margin: '10px 0 8px' } }, b.desc),
        progressBar(done / b.chapters.length),
        h('div', { class: 'small muted', style: { marginTop: '4px' } }, `${done}/${b.chapters.length} étudiés`));
    })),
    h('div', { class: 'section-title' }, 'Comment étudier un texte'),
    h('div', { class: 'card' }, h('ol', { style: { margin: 0, paddingInlineStart: '20px' } },
      h('li', null, 'Lisez l’arabe à voix haute, sans regarder la traduction.'),
      h('li', null, 'Touchez chaque mot inconnu : Daaraji vous donne son sens s’il le connaît, sinon vous pouvez l’ajouter à votre dictionnaire.'),
      h('li', null, 'Affichez la traduction pour vérifier votre compréhension.'),
      h('li', null, 'Ajoutez le vocabulaire du chapitre à vos révisions, puis faites le quiz.'))),
  );
  return { title: 'Livres', node, keepScroll: true };
}

export function bookView({ book: id }) {
  const b = getBook(id);
  if (!b) return null;
  const done = studied(id);
  const node = h('div', null,
    h('div', { class: 'card center' },
      ar(b.titleAr, 'ar-l'),
      h('h2', null, b.title),
      h('div', { class: 'small muted' }, b.author),
      h('p', { class: 'small' }, b.desc),
      progressBar(Object.keys(done).length / b.chapters.length)),
    h('ul', { class: 'list', style: { marginTop: '14px' } }, b.chapters.map((c) => h('li', null,
      h('a', { class: 'list-item', href: `#/livres/${id}/${c.id}` },
        h('span', { class: `badge ${done[c.id] ? 'ok' : ''}`, style: { minWidth: '34px', justifyContent: 'center' } }, done[c.id] ? icon('check') : String(c.num)),
        h('span', { class: 'grow' }, h('div', { class: 'title' }, c.title), h('div', { class: 'sub' }, `${c.vocab.length} mots clés${c.n > 1 ? ` • ${c.n} passages` : ''}`)),
        c.titleAr ? ar(c.titleAr, 'ar-s') : icon('next', 'chev'))))),
    h('p', { class: 'small muted', style: { marginTop: '14px' } }, b.credit, ' Les traductions françaises et wolof sont à faire relire par un enseignant.'),
  );
  return { title: b.title, back: '#/livres', node, keepScroll: true };
}

// Texte arabe dont chaque mot est touchable.
function tappableArabic(text, source) {
  const el = h('div', { class: 'ar book-ar', lang: 'ar', dir: 'rtl' });
  text.split(/(\s+)/).forEach((tok) => {
    if (/^\s+$/.test(tok) || !/[ء-ي]/.test(tok)) { el.append(tok); return; }
    const m = tok.match(/^([«(﴿[{]*)(.*?)([».،؛:؟!)﴾\]}]*)$/u);
    const [, pre, word, post] = m || ['', '', tok, ''];
    if (pre) el.append(pre);
    const sp = h('span', { class: 'w', role: 'button', tabindex: '0' }, word);
    sp.addEventListener('click', () => {
      el.querySelectorAll('.w.active').forEach((x) => x.classList.remove('active'));
      sp.classList.add('active');
      openTextWordSheet(word, source);
    });
    el.append(sp);
    if (post) el.append(post);
  });
  return el;
}

export function chapterView({ book: id, chapter: cid }) {
  const meta = getBook(id);
  const cm = meta?.chapters.find((c) => c.id === cid);
  if (!cm) return null;
  const idx = meta.chapters.indexOf(cm);
  const prev = meta.chapters[idx - 1];
  const next = meta.chapters[idx + 1];
  const root = h('div', null, h('p', { class: 'muted center' }, 'Chargement…'));
  let showFr = getState().settings.bookFr !== false;

  loadBook(id).then((book) => {
    const c = book.chapters.find((x) => x.id === cid);
    const units = c.units.map((u) => {
      const fr = h('div', { class: 'book-fr', hidden: !showFr }, u.fr);
      return { node: h('article', { class: 'card book-unit' },
        tappableArabic(u.ar, `${meta.title} — ${cm.title}`),
        h('div', { class: 'verse-tools' }, iconBtn('volume', 'Écouter (voix de l’iPhone)', () => speak(u.ar), 'small')),
        fr), fr };
    });
    const toggle = h('button', { class: 'btn small', type: 'button' }, icon('eye'), h('span', null, showFr ? 'Masquer la traduction' : 'Afficher la traduction'));
    toggle.addEventListener('click', () => {
      showFr = !showFr;
      update((s) => { s.settings.bookFr = showFr; });
      units.forEach((u) => { u.fr.hidden = !showFr; });
      toggle.lastChild.textContent = showFr ? 'Masquer la traduction' : 'Afficher la traduction';
    });
    const ids = chapterWordIds(id, cid);
    const isDone = !!studied(id)[cid];
    root.replaceChildren(h('div', null,
      h('div', { class: 'surah-head' },
        cm.titleAr ? ar(cm.titleAr, 'ar-m') : null,
        h('h2', null, id === 'nawawi' ? `Hadith ${cm.num} — ${cm.title}` : cm.title)),
      c.takeaway ? h('div', { class: 'note', style: { marginBottom: '12px' } }, h('div', { class: 'lbl' }, 'À retenir'), c.takeaway) : null,
      h('div', { class: 'btn-row', style: { marginBottom: '12px' } }, toggle),
      h('p', { class: 'small muted' }, 'Touchez un mot arabe pour voir son sens.'),
      h('div', { class: 'stack' }, units.map((u) => u.node)),
      c.source ? h('p', { class: 'small muted', style: { marginTop: '10px' } }, c.source) : null,
      cm.vocab.length ? h('div', null,
        h('div', { class: 'section-title' }, 'Vocabulaire clé'),
        h('ul', { class: 'list' }, ids.map((wid) => {
          const it = getItem(wid);
          return h('li', null, h('div', { class: 'list-item' },
            h('button', { class: 'grow', type: 'button', style: { display: 'flex', alignItems: 'center', gap: '12px', border: 0, background: 'none', padding: 0, textAlign: 'start' }, on: { click: () => openWordSheet(wid, { onChange: refresh }) } },
              h('span', { style: { minWidth: '96px', textAlign: 'center' } }, ar(it.ar, 'ar-s')),
              h('span', { style: { flex: 1, minWidth: 0 } }, glossLines(it))),
            hasCard(wid) ? h('span', { class: 'badge ok' }, icon('check')) : null,
            iconBtn('volume', 'Écouter', () => play(it.audio), 'small')));
        })),
        h('div', { class: 'btn-row', style: { marginTop: '12px' } },
          h('button', { class: 'btn primary', type: 'button', disabled: ids.every(hasCard), on: { click: () => { const n = addCards(ids); logActivity(1); toast(`${n} mots ajoutés à vos révisions.`); refresh(); } } }, icon('plus'), 'Réviser ces mots'),
          h('a', { class: 'btn', href: `#/livres/${id}/${cid}/quiz` }, icon('star'), 'Quiz'))) : null,
      h('div', { class: 'stack', style: { marginTop: '18px' } },
        h('button', {
          class: `btn block ${isDone ? '' : 'primary'}`, type: 'button',
          on: {
            click: () => {
              update((s) => {
                s.progress.books = s.progress.books || {};
                s.progress.books[id] = s.progress.books[id] || {};
                if (s.progress.books[id][cid]) delete s.progress.books[id][cid];
                else s.progress.books[id][cid] = Date.now();
              });
              if (!isDone) { logActivity(2); toast('Chapitre marqué comme étudié.'); if (next) { location.hash = `#/livres/${id}/${next.id}`; return; } }
              refresh();
            },
          },
        }, icon('check'), isDone ? 'Étudié ✓ (toucher pour annuler)' : 'J’ai étudié ce passage'),
        h('div', { class: 'btn-row' },
          prev ? h('a', { class: 'btn', href: `#/livres/${id}/${prev.id}` }, icon('back'), 'Précédent') : null,
          next ? h('a', { class: 'btn', href: `#/livres/${id}/${next.id}` }, 'Suivant', icon('next')) : null)),
    ));
  }).catch(() => {
    root.replaceChildren(h('div', { class: 'empty' }, 'Impossible de charger ce livre. Réessayez avec une connexion Internet.'));
  });

  return { title: id === 'nawawi' ? `Hadith ${cm.num}` : meta.title, back: `#/livres/${id}`, node: root };
}

export function chapterQuizView({ book: id, chapter: cid }) {
  const ids = chapterWordIds(id, cid);
  if (!ids.length) return null;
  const meta = getBook(id);
  const pool = meta.chapters.flatMap((c) => chapterWordIds(id, c.id));
  const root = h('div');
  const start = () => root.replaceChildren(quiz(meaningQuestions(ids, pool, Math.min(8, ids.length + 2)), {
    retry: start, backHref: `#/livres/${id}/${cid}`, backLabel: 'Retour au texte',
  }));
  start();
  return { title: 'Quiz de vocabulaire', back: `#/livres/${id}/${cid}`, node: root };
}

export { wolofalEl };
