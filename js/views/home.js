// Accueil : salutation, série de jours, programme du jour, parcours de la méthode.

import { h, ar, icon, iconBtn, progressBar } from '../ui.js';
import { getState, update, currentStreak, todayCount } from '../store.js';
import { SURAHS, LESSONS, BOOKS, getSurah, lessonWordIds } from '../content.js';
import { GRAMMAR } from '../data/grammar.js';
import { stats, hasCard } from '../srs.js';
import { refresh } from '../nav.js';

function isIosSafariBrowser() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches;
  return ios && !standalone;
}

function tileIcon(kind) {
  return {
    width: '40px', height: '40px', borderRadius: '12px', display: 'grid', placeItems: 'center', flex: 'none',
    background: kind === 'accent' ? 'var(--accent-soft)' : 'var(--primary-soft)',
    color: kind === 'accent' ? 'var(--accent)' : 'var(--primary)',
  };
}

function todoItem(href, ic, title, sub, kind, trailing) {
  return h('a', { class: 'list-item', href },
    h('span', { style: tileIcon(kind) }, icon(ic)),
    h('span', { class: 'grow' }, h('div', { class: 'title' }, title), h('div', { class: 'sub' }, sub)),
    trailing || icon('next', 'chev'));
}

export function homeView() {
  const st = getState();
  const srs = stats();
  const streak = currentStreak();
  const done = todayCount();
  const goal = st.settings.dailyGoal || 15;
  const books = st.progress.books || {};
  const grammar = st.progress.grammar || {};

  const learnedSurahs = SURAHS.filter((s) => st.progress.surahs[s.id]?.learned).length;
  const vocabTotal = LESSONS.reduce((n, l) => n + l.words.length, 0);
  const vocabIn = LESSONS.reduce((n, l) => n + lessonWordIds(l.id).filter(hasCard).length, 0);
  const lettersSeen = Object.keys(st.progress.lettersSeen).length;
  const fluentCount = Object.keys(st.progress.fluent).length;
  const nahw = GRAMMAR.filter((l) => l.kind === 'nahw');
  const sarf = GRAMMAR.filter((l) => l.kind === 'sarf');
  const nahwDone = nahw.filter((l) => grammar[l.id] !== undefined).length;
  const sarfDone = sarf.filter((l) => grammar[l.id] !== undefined).length;
  const bookDone = (id) => Object.keys(books[id] || {}).length;
  const bookOf = (id) => BOOKS.find((b) => b.id === id);

  const lastSurah = st.progress.lastSurah ? getSurah(st.progress.lastSurah) : null;
  const nextLesson = LESSONS.find((l) => !lessonWordIds(l.id).every(hasCard));
  const nextGrammar = GRAMMAR.find((l) => grammar[l.id] === undefined);
  const nextHadith = bookOf('nawawi').chapters.find((c) => !(books.nawawi || {})[c.id]);

  // Programme du jour : révisions, une leçon, un texte.
  const todo = [];
  if (srs.due > 0) todo.push(todoItem('#/mots/revision', 'cards', `Réviser ${srs.due} mot${srs.due > 1 ? 's' : ''}`, 'Commencez toujours par vos révisions', 'accent'));
  if (nextGrammar) todo.push(todoItem(`#/grammaire/${nextGrammar.id}`, 'grid', `${nextGrammar.kind === 'sarf' ? 'Conjugaison' : 'Grammaire'} : ${nextGrammar.title}`, nextGrammar.goal));
  if (nextHadith) todo.push(todoItem(`#/livres/nawawi/${nextHadith.id}`, 'book', `Hadith ${nextHadith.num} : ${nextHadith.title}`, 'Lire, comprendre, apprendre ses mots clés'));
  if (lastSurah) todo.push(todoItem(`#/coran/${lastSurah.id}`, 'quran', `Continuer : ${lastSurah.translit}`, lastSurah.fr, '', ar(lastSurah.name, 'ar-s')));
  else todo.push(todoItem('#/lecture/guidee', 'read', 'Lecture guidée', 'Lire un verset, écouter, répéter'));
  if (nextLesson && todo.length < 5) todo.push(todoItem(`#/mots/lecon/${nextLesson.id}`, 'plus', `Vocabulaire : ${nextLesson.title}`, '10 mots nouveaux'));

  const steps = [
    { title: 'Lecture fluide', sub: `Alphabet, signes du Coran, lecture guidée • ${fluentCount} versets lus avec aisance`, href: '#/lecture', ratio: Math.min(1, (lettersSeen / 28) * 0.5 + Math.min(fluentCount, 20) / 40) },
    { title: 'Les sourates courtes', sub: `${learnedSurahs}/${SURAHS.length} sourates apprises mot à mot`, href: '#/coran', ratio: learnedSurahs / SURAHS.length },
    { title: 'Le vocabulaire', sub: `${vocabIn}/${vocabTotal} mots fréquents en révision`, href: '#/mots', ratio: vocabIn / vocabTotal },
    { title: 'La grammaire', sub: `${nahwDone}/${nahw.length} leçons de nahw`, href: '#/grammaire', ratio: nahwDone / nahw.length },
    { title: 'La conjugaison', sub: `${sarfDone}/${sarf.length} leçons de sarf • conjugueur de 50 verbes`, href: '#/conjugaison', ratio: sarfDone / sarf.length },
    { title: 'Les 40 hadiths', sub: `${bookDone('nawawi')}/42 hadiths étudiés`, href: '#/livres/nawawi', ratio: bookDone('nawawi') / 42 },
    { title: 'Al-Akhdari', sub: `${bookDone('akhdari')}/${bookOf('akhdari').chapters.length} chapitres de fiqh étudiés`, href: '#/livres/akhdari', ratio: bookDone('akhdari') / bookOf('akhdari').chapters.length },
    { title: 'Les Trois fondements et les Quatre règles', sub: `${bookDone('usul') + bookDone('qawaid')}/${bookOf('usul').chapters.length + bookOf('qawaid').chapters.length} chapitres de croyance`, href: '#/livres', ratio: (bookDone('usul') + bookDone('qawaid')) / (bookOf('usul').chapters.length + bookOf('qawaid').chapters.length) },
    { title: 'Parler', sub: 'Bientôt : dialogues et prononciation (commencez avec « Premières conversations »)', soon: true },
  ].map((s) => ({ ...s, done: !s.soon && s.ratio >= 1 }));
  const currentIdx = steps.findIndex((s) => !s.done && !s.soon);

  const node = h('div', null,
    isIosSafariBrowser() && !st.hints.installDismissed ? installHint() : null,
    h('section', { class: 'hero' },
      ar('السَّلَامُ عَلَيْكُمْ', ''),
      h('p', { style: { margin: '2px 0 14px' } }, 'Bienvenue à Daaraji, votre daara de poche. Un peu chaque jour : révisions, une leçon, un texte.'),
      h('div', { class: 'stat-row' },
        h('div', { class: 'stat' }, h('b', null, String(streak)), h('span', null, streak > 1 ? 'jours d’affilée' : 'jour d’affilée')),
        h('div', { class: 'stat' }, h('b', null, `${Math.min(done, goal)}/${goal}`), h('span', null, 'objectif du jour')),
        h('div', { class: 'stat' }, h('b', null, String(srs.total)), h('span', null, 'mots en révision'))),
      h('div', { style: { marginTop: '12px' } }, progressBar(done / goal))),
    h('div', { class: 'section-title' }, 'Programme du jour'),
    h('div', { class: 'list' }, todo.slice(0, 5)),
    h('div', { class: 'section-title' }, 'La méthode Daaraji'),
    h('div', { class: 'card steps stack' }, steps.map((s, i) => {
      const inner = h('div', { class: `step ${s.done ? 'done' : ''} ${i === currentIdx ? 'current' : ''}` },
        h('span', { class: 'step-num' }, s.done ? icon('check') : String(i + 1)),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { fontWeight: 650, color: s.soon ? 'var(--muted)' : 'inherit' } }, s.title, s.soon ? h('span', { class: 'badge', style: { marginInlineStart: '6px' } }, 'bientôt') : null),
          h('div', { class: 'small muted' }, s.sub),
          !s.soon && s.ratio > 0 && !s.done ? h('div', { style: { marginTop: '6px' } }, progressBar(s.ratio)) : null));
      return s.href ? h('a', { href: s.href, style: { color: 'inherit', textDecoration: 'none', display: 'block' } }, inner) : inner;
    })),
    h('p', { class: 'small muted center', style: { marginTop: '14px' } }, 'Les étapes avancent ensemble : on peut lire un hadith dès qu’on lit l’arabe, et la grammaire éclaire peu à peu les textes.'),
  );
  return { title: 'Daaraji', node, actions: [iconBtn('settings', 'Réglages', () => { location.hash = '#/reglages'; })] };
}

function installHint() {
  return h('div', { class: 'note', style: { marginBottom: '14px' } },
    h('b', null, 'Installer Daaraji sur votre iPhone'),
    h('p', null, 'Dans Safari, touchez le bouton Partager ', icon('share'), ' puis « Sur l’écran d’accueil ». Daaraji s’ouvrira alors comme une vraie application, même sans Internet.'),
    h('button', { class: 'btn small', type: 'button', on: { click: () => { update((s) => { s.hints.installDismissed = true; }); refresh(); } } }, 'J’ai compris'));
}
