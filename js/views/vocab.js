// Module « Mots » : leçons de vocabulaire, révisions espacées, racines, mes mots.

import { h, ar, wolofalEl, icon, iconBtn, progressBar, toast } from '../ui.js';
import { LESSONS, getItem, lessonWordIds, roots, wordsOfRoot } from '../content.js';
import { addCards, hasCard, removeCard, dueIds, gradeCard, previewLabel, stats, GRADES } from '../srs.js';
import { getState, update, settings, logActivity } from '../store.js';
import { play } from '../audio.js';
import { openWordSheet, glossLines, quiz, meaningQuestions, rootHref, audioButton } from '../components.js';
import { refresh } from '../nav.js';
import { GRAMMAR } from '../data/grammar.js';

export function hubView() {
  const s = stats();
  const g = getState().progress.grammar || {};
  const nahw = GRAMMAR.filter((l) => l.kind === 'nahw');
  const sarf = GRAMMAR.filter((l) => l.kind === 'sarf');
  const doneOf = (list) => list.filter((l) => g[l.id] !== undefined).length;
  const userWords = Object.keys(getState().userDict || {}).length;
  const tile = (href, ic, title, sub, accent) => h('a', { class: 'tile', href },
    h('span', { class: `tile-icon ${accent ? 'accent' : ''}` }, icon(ic)), h('span', { class: 'title' }, title), h('span', { class: 'sub' }, sub));
  const node = h('div', null,
    h('div', { class: 'card' },
      h('div', { class: 'stat-row' },
        h('div', { class: 'stat' }, h('b', null, String(s.due)), h('span', null, 'à réviser')),
        h('div', { class: 'stat' }, h('b', null, String(s.total)), h('span', null, 'en révision')),
        h('div', { class: 'stat' }, h('b', null, String(s.known)), h('span', null, 'bien connus'))),
      h('a', { class: `btn block ${s.due ? 'primary' : ''}`, href: '#/mots/revision', style: { marginTop: '12px' } },
        icon('cards'), s.due ? `Réviser maintenant (${s.due})` : 'Aucune révision pour le moment'),
      !s.total ? h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Commencez une leçon ci-dessous ou ajoutez des mots depuis une sourate : ils apparaîtront ici au bon moment.') : null),
    h('div', { class: 'section-title' }, 'La méthode'),
    h('div', { class: 'grid-2' },
      tile('#/grammaire', 'grid', 'Grammaire', `${doneOf(nahw)}/${nahw.length} leçons`),
      tile('#/grammaire/s1', 'list', 'Conjugaison', `${doneOf(sarf)}/${sarf.length} leçons`),
      tile('#/conjugaison', 'repeat', 'Conjugueur', '50 verbes du Coran', true),
      tile('#/conjugaison/exercice', 'star', 'Exercice', 'Conjuguer sans se tromper', true)),
    h('div', { class: 'section-title' }, 'Vocabulaire : 20 leçons'),
    h('ul', { class: 'list' }, LESSONS.map((l, i) => {
      const ids = lessonWordIds(l.id);
      const n = ids.filter(hasCard).length;
      return h('li', null, h('a', { class: 'list-item', href: `#/mots/lecon/${l.id}` },
        h('span', { class: `badge ${n === ids.length ? 'ok' : ''}`, style: { minWidth: '30px', justifyContent: 'center' } }, n === ids.length ? icon('check') : String(i + 1)),
        h('span', { class: 'grow' }, h('div', { class: 'title' }, l.title), h('div', { class: 'sub' }, l.desc), n ? h('div', { style: { marginTop: '5px' } }, progressBar(n / ids.length)) : null),
        ar(l.words[0].ar, 'ar-s')));
    })),
    h('div', { class: 'section-title' }, 'Explorer'),
    h('div', { class: 'list' },
      h('a', { class: 'list-item', href: '#/mots/racines' }, h('span', { style: { color: 'var(--primary)' } }, icon('root')), h('span', { class: 'grow' }, h('div', { class: 'title' }, 'Les racines'), h('div', { class: 'sub' }, 'Trois lettres, une famille de mots')), icon('next', 'chev')),
      h('a', { class: 'list-item', href: '#/mots/mes-mots' }, h('span', { style: { color: 'var(--primary)' } }, icon('list')), h('span', { class: 'grow' }, h('div', { class: 'title' }, 'Mes mots'), h('div', { class: 'sub' }, `${s.total} mot${s.total > 1 ? 's' : ''} en révision${userWords ? ` • ${userWords} dans mon dictionnaire` : ''}`)), icon('next', 'chev'))),
  );
  return { title: 'Langue', node, keepScroll: true };
}

export function lessonView({ id }) {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return null;
  const ids = lessonWordIds(lesson.id);
  const allIn = ids.every(hasCard);
  const node = h('div', null,
    h('p', { class: 'muted' }, lesson.desc),
    h('ul', { class: 'list' }, ids.map((wid) => {
      const it = getItem(wid);
      return h('li', null, h('div', { class: 'list-item' },
        h('button', { class: 'grow', type: 'button', style: { display: 'flex', alignItems: 'center', gap: '12px', border: 0, background: 'none', padding: 0, textAlign: 'start' }, on: { click: () => openWordSheet(wid, { onChange: refresh }) } },
          h('span', { style: { minWidth: '92px', textAlign: 'center' } }, ar(it.ar, 'ar-m')),
          h('span', { style: { flex: 1, minWidth: 0 } }, glossLines(it))),
        hasCard(wid) ? h('span', { class: 'badge ok', title: 'En révision' }, icon('check')) : null,
        iconBtn('volume', `Écouter ${it.tr}`, () => play(it.audio), 'small')));
    })),
    h('div', { class: 'stack', style: { marginTop: '16px' } },
      h('button', {
        class: `btn block ${allIn ? '' : 'primary'}`, type: 'button', disabled: allIn,
        on: { click: () => { const n = addCards(ids); logActivity(1); toast(`${n} mots ajoutés : révisez-les dès maintenant.`, { action: 'Réviser', onAction: () => { location.hash = '#/mots/revision'; } }); refresh(); } },
      }, icon(allIn ? 'check' : 'plus'), allIn ? 'Tous les mots sont en révision' : 'Apprendre ces 10 mots'),
      h('a', { class: 'btn block', href: `#/mots/lecon/${lesson.id}/quiz` }, icon('star'), 'Quiz sur cette leçon')),
  );
  return { title: lesson.title, back: '#/mots', node };
}

export function lessonQuizView({ id }) {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return null;
  const root = h('div');
  function start() {
    const ids = lessonWordIds(lesson.id);
    root.replaceChildren(quiz(meaningQuestions(ids, ids, 10), {
      retry: start, backHref: `#/mots/lecon/${lesson.id}`, backLabel: 'Retour à la leçon',
      onFinish: (score, total) => update((x) => { x.progress.quizzes[`l:${lesson.id}`] = Math.max(x.progress.quizzes[`l:${lesson.id}`] || 0, Math.round((score / total) * 100)); }),
    }));
  }
  start();
  return { title: `Quiz : ${lesson.title}`, back: `#/mots/lecon/${lesson.id}`, node: root };
}

// ── Révision espacée ──
export function reviewView() {
  const root = h('div');
  let queue = dueIds().slice(0, 30);
  const total = queue.length;
  let done = 0;
  let again = 0;
  const dirSetting = settings().cardDir || 'ar-fr';

  function show() {
    if (!queue.length) { finish(); return; }
    const id = queue[0];
    const it = getItem(id);
    const card = getState().srs[id];
    if (!it || !card) { queue.shift(); show(); return; }
    const dir = dirSetting === 'mix' ? (Math.random() < 0.5 ? 'ar-fr' : 'fr-ar') : dirSetting;
    const front = dir === 'ar-fr'
      ? h('div', null, ar(it.ar, 'ar-xl'))
      : h('div', null, h('h2', null, it.fr), it.wo ? h('div', { class: 'wo' }, it.wo) : null);
    const back = h('div', { hidden: true, style: { borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' } },
      dir === 'fr-ar' ? ar(it.ar, 'ar-xl') : null,
      it.tr ? h('div', { class: 'tr' }, it.tr) : null,
      dir === 'ar-fr' ? h('div', { style: { fontSize: '20px', fontWeight: 650 } }, it.fr) : null,
      dir === 'ar-fr' && it.wo ? h('div', { class: 'wo' }, it.wo) : null,
      it.wo && settings().wolofal ? wolofalEl(it.wolofal) : null,
      it.root ? h('div', { class: 'small muted' }, 'Racine : ', ar(it.root, 'ar-s')) : null,
      h('div', { class: 'small muted' }, it.source));
    const reveal = h('button', { class: 'btn primary block', type: 'button' }, icon('eye'), 'Afficher la réponse');
    const grades = h('div', { class: 'grade-row', hidden: true }, GRADES.map(({ g, label }) =>
      h('button', { class: `btn grade-${g}`, type: 'button', on: { click: () => grade(g) } }, label, h('small', null, previewLabel(card, g)))));
    reveal.addEventListener('click', () => {
      back.hidden = false; reveal.hidden = true; grades.hidden = false;
      play(it.audio);
    });
    function grade(g) {
      gradeCard(id, g);
      logActivity(1);
      queue.shift();
      done++;
      if (g === 0) { again++; queue.splice(Math.min(queue.length, 3), 0, id); }
      show();
    }
    root.replaceChildren(
      h('div', { class: 'quiz-top' }, progressBar(total ? done / (total + again) : 1), h('span', { class: 'small muted' }, `${queue.length} restant${queue.length > 1 ? 's' : ''}`)),
      h('div', { class: 'card flash' }, front, back, h('div', null, audioButton(it, ''))),
      reveal, grades,
      h('p', { class: 'small muted center', style: { marginTop: '10px' } }, 'Soyez honnête : « À revoir » fait revenir la carte tout de suite, « Facile » l’éloigne de plusieurs jours.'));
  }

  function finish() {
    const s = stats();
    root.replaceChildren(h('div', { class: 'card center' },
      h('div', { style: { color: 'var(--accent)' } }, icon('star')),
      h('h2', null, done ? 'Révision terminée !' : 'Rien à réviser pour l’instant'),
      h('p', null, done ? `${done} carte${done > 1 ? 's' : ''} révisée${done > 1 ? 's' : ''}. Revenez demain pour garder le rythme.` : (s.total ? 'Vos prochains mots reviendront au bon moment. Vous pouvez apprendre une nouvelle leçon.' : 'Ajoutez des mots depuis une leçon ou une sourate pour commencer.')),
      h('div', { class: 'btn-row', style: { marginTop: '12px' } },
        h('a', { class: 'btn', href: '#/mots' }, 'Leçons'),
        h('a', { class: 'btn primary', href: '#/' }, 'Accueil'))));
  }

  const dirSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Sens des cartes' },
    [['ar-fr', 'Arabe → FR'], ['fr-ar', 'FR → Arabe'], ['mix', 'Mélangé']].map(([d, label]) => h('button', {
      type: 'button', 'aria-pressed': String(dirSetting === d),
      on: { click: () => { update((x) => { x.settings.cardDir = d; }); refresh(); } },
    }, label)));

  show();
  return { title: 'Révision', back: '#/mots', node: h('div', null, h('div', { style: { marginBottom: '12px' } }, dirSeg), root) };
}

// ── Racines ──
export function rootsView() {
  const list = [...roots().entries()]
    .map(([root, ids]) => ({ root, n: ids.length, words: wordsOfRoot(root) }))
    .sort((a, b) => b.words.length - a.words.length || b.n - a.n);
  const node = h('div', null,
    h('p', { class: 'muted' }, 'La plupart des mots arabes viennent d’une racine de trois lettres qui porte une idée. Par exemple ك ت ب (écrire) donne كَتَبَ (il a écrit), كِتَاب (livre), كَاتِب (écrivain). Reconnaître la racine aide à deviner le sens d’un mot nouveau.'),
    h('ul', { class: 'list' }, list.map((r) => h('li', null, h('a', { class: 'list-item', href: rootHref(r.root) },
      h('span', { style: { minWidth: '84px', textAlign: 'center' } }, ar(r.root, 'ar-m')),
      h('span', { class: 'grow' }, h('div', { class: 'title' }, r.words.slice(0, 3).map((w) => w.fr).join(' • ')), h('div', { class: 'sub' }, `${r.words.length} forme${r.words.length > 1 ? 's' : ''} • ${r.n} occurrence${r.n > 1 ? 's' : ''}`)),
      icon('next', 'chev'))))));
  return { title: 'Les racines', back: '#/mots', node, keepScroll: true };
}

export function rootView({ root }) {
  const words = wordsOfRoot(root);
  if (!words.length) return null;
  const node = h('div', null,
    h('div', { class: 'card center' }, ar(root, 'ar-xl'), h('p', { class: 'muted' }, `${words.length} forme${words.length > 1 ? 's' : ''} dans Daaraji`)),
    h('ul', { class: 'list', style: { marginTop: '12px' } }, words.map((w) => h('li', null,
      h('button', { class: 'list-item', type: 'button', on: { click: () => openWordSheet(w.ids[0], { onChange: refresh }) } },
        h('span', { style: { minWidth: '92px', textAlign: 'center' } }, ar(w.ar, 'ar-m')),
        h('span', { class: 'grow' }, h('div', { class: 'title' }, w.fr), h('div', { class: 'sub' }, w.wo ? `${w.wo} • ` : '', w.count > 1 ? `${w.count} fois` : w.source)),
        icon('next', 'chev'))))),
    h('button', {
      class: 'btn block primary', type: 'button', style: { marginTop: '14px' },
      on: { click: () => { const n = addCards(words.map((w) => w.ids[0])); toast(n ? `${n} mot${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''} à vos révisions.` : 'Déjà en révision.'); } },
    }, icon('plus'), 'Réviser cette famille de mots'));
  return { title: 'Racine', back: '#/mots/racines', node };
}

export function myWordsView() {
  const srs = getState().srs;
  const ids = Object.keys(srs).sort((a, b) => srs[a].d - srs[b].d);
  const now = Date.now();
  const fmt = (d) => {
    if (d <= now) return 'à réviser';
    const days = Math.round((d - now) / 86400000);
    return days <= 0 ? 'aujourd’hui' : days === 1 ? 'demain' : `dans ${days} jours`;
  };
  const node = ids.length
    ? h('ul', { class: 'list' }, ids.map((id) => {
      const it = getItem(id);
      if (!it) return null;
      return h('li', null, h('div', { class: 'list-item' },
        h('button', { class: 'grow', type: 'button', style: { display: 'flex', alignItems: 'center', gap: '12px', border: 0, background: 'none', padding: 0, textAlign: 'start' }, on: { click: () => openWordSheet(id, { onChange: refresh }) } },
          h('span', { style: { minWidth: '84px', textAlign: 'center' } }, ar(it.ar, 'ar-s')),
          h('span', { style: { flex: 1, minWidth: 0 } }, h('div', { class: 'title' }, it.fr), h('div', { class: 'sub' }, `${fmt(srs[id].d)} • ${it.source}`))),
        iconBtn('trash', 'Retirer de mes révisions', () => { removeCard(id); refresh(); }, 'small')));
    }))
    : h('div', { class: 'empty' }, h('p', null, 'Aucun mot pour l’instant.'), h('a', { class: 'btn primary', href: '#/mots' }, 'Voir les leçons'));
  return { title: 'Mes mots', back: '#/mots', node };
}
