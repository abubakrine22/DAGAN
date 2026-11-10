// Accueil : salutation, série de jours, objectif du jour, prochaines étapes, parcours.

import { h, ar, icon, progressBar } from '../ui.js';
import { getState, update, currentStreak, todayCount } from '../store.js';
import { SURAHS, LESSONS, getSurah, lessonWordIds } from '../content.js';
import { stats, hasCard } from '../srs.js';
import { refresh } from '../nav.js';

function isIosSafariBrowser() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches;
  return ios && !standalone;
}

export function homeView() {
  const st = getState();
  const srs = stats();
  const streak = currentStreak();
  const done = todayCount();
  const goal = st.settings.dailyGoal || 15;
  const learnedSurahs = SURAHS.filter((s) => st.progress.surahs[s.id]?.learned).length;
  const vocabTotal = LESSONS.reduce((n, l) => n + l.words.length, 0);
  const vocabIn = LESSONS.reduce((n, l) => n + lessonWordIds(l.id).filter(hasCard).length, 0);
  const lettersSeen = Object.keys(st.progress.lettersSeen).length;
  const fluentCount = Object.keys(st.progress.fluent).length;
  const lastSurah = st.progress.lastSurah ? getSurah(st.progress.lastSurah) : null;
  const nextLesson = LESSONS.find((l) => !lessonWordIds(l.id).every(hasCard));

  const todo = [];
  if (srs.due > 0) {
    todo.push(h('a', { class: 'list-item', href: '#/mots/revision' },
      h('span', { class: 'tile-icon accent', style: tileIcon('accent') }, icon('cards')),
      h('span', { class: 'grow' }, h('div', { class: 'title' }, `Réviser ${srs.due} mot${srs.due > 1 ? 's' : ''}`), h('div', { class: 'sub' }, 'Vos révisions du jour')),
      icon('next', 'chev')));
  }
  if (lastSurah) {
    todo.push(h('a', { class: 'list-item', href: `#/coran/${lastSurah.id}` },
      h('span', { class: 'tile-icon', style: tileIcon() }, icon('quran')),
      h('span', { class: 'grow' }, h('div', { class: 'title' }, `Continuer : ${lastSurah.translit}`), h('div', { class: 'sub' }, lastSurah.fr)),
      ar(lastSurah.name, 'ar-s')));
  }
  todo.push(h('a', { class: 'list-item', href: fluentCount ? '#/lecture/guidee' : '#/lecture' },
    h('span', { class: 'tile-icon', style: tileIcon() }, icon('read')),
    h('span', { class: 'grow' }, h('div', { class: 'title' }, fluentCount ? 'Lecture guidée' : 'Travailler la lecture'), h('div', { class: 'sub' }, fluentCount ? `${fluentCount} verset${fluentCount > 1 ? 's' : ''} lu${fluentCount > 1 ? 's' : ''} avec aisance` : 'Lettres, voyelles et signes du Coran')),
    icon('next', 'chev')));
  if (nextLesson) {
    todo.push(h('a', { class: 'list-item', href: `#/mots/lecon/${nextLesson.id}` },
      h('span', { class: 'tile-icon', style: tileIcon() }, icon('plus')),
      h('span', { class: 'grow' }, h('div', { class: 'title' }, `Nouvelle leçon : ${nextLesson.title}`), h('div', { class: 'sub' }, '10 mots fréquents du Coran')),
      icon('next', 'chev')));
  }

  const steps = [
    { title: 'Lecture fluide', sub: `Alphabet, voyelles, signes du Coran • ${lettersSeen}/28 lettres revues`, href: '#/lecture', done: lettersSeen >= 28 && fluentCount >= 20, ratio: Math.min(1, (lettersSeen / 28) * 0.5 + Math.min(fluentCount, 20) / 40) },
    { title: 'Les sourates courtes', sub: `${learnedSurahs}/${SURAHS.length} sourates apprises mot à mot`, href: '#/coran', done: learnedSurahs === SURAHS.length, ratio: learnedSurahs / SURAHS.length },
    { title: 'Le vocabulaire du Coran', sub: `${vocabIn}/${vocabTotal} mots fréquents en révision`, href: '#/mots', done: vocabIn === vocabTotal, ratio: vocabIn / vocabTotal },
    { title: 'Les racines', sub: 'Comprendre la famille des mots', href: '#/mots/racines', done: false, ratio: 0 },
    { title: 'Grammaire', sub: 'Bientôt : phrase nominale, verbes, pronoms…', soon: true },
    { title: 'Les hadiths', sub: 'Bientôt : les 40 hadiths de Nawawi', soon: true },
    { title: 'Parler', sub: 'Bientôt : dialogues et prononciation', soon: true },
  ];
  const currentIdx = steps.findIndex((s) => !s.done && !s.soon);

  const node = h('div', null,
    isIosSafariBrowser() && !st.hints.installDismissed ? installHint() : null,
    h('section', { class: 'hero' },
      ar('السَّلَامُ عَلَيْكُمْ', ''),
      h('p', { style: { margin: '2px 0 14px' } }, 'Bienvenue sur DAGAN. Un peu chaque jour, et le Coran s’ouvrira à vous.'),
      h('div', { class: 'stat-row' },
        h('div', { class: 'stat' }, h('b', null, String(streak)), h('span', null, streak > 1 ? 'jours d’affilée' : 'jour d’affilée')),
        h('div', { class: 'stat' }, h('b', null, `${Math.min(done, goal)}/${goal}`), h('span', null, 'objectif du jour')),
        h('div', { class: 'stat' }, h('b', null, String(srs.total)), h('span', null, 'mots en révision'))),
      h('div', { style: { marginTop: '12px' } }, progressBar(done / goal))),
    h('div', { class: 'section-title' }, 'Aujourd’hui'),
    h('div', { class: 'list' }, todo),
    h('div', { class: 'section-title' }, 'Votre parcours'),
    h('div', { class: 'card steps stack' }, steps.map((s, i) => {
      const inner = h('div', { class: `step ${s.done ? 'done' : ''} ${i === currentIdx ? 'current' : ''}` },
        h('span', { class: 'step-num' }, s.done ? icon('check') : String(i + 1)),
        h('div', { class: 'grow', style: { flex: 1 } },
          h('div', { class: 'title', style: { fontWeight: 650, color: s.soon ? 'var(--muted)' : 'inherit' } }, s.title, s.soon ? h('span', { class: 'badge', style: { marginInlineStart: '6px' } }, 'bientôt') : null),
          h('div', { class: 'small muted' }, s.sub),
          !s.soon && s.ratio > 0 && !s.done ? h('div', { style: { marginTop: '6px' } }, progressBar(s.ratio)) : null));
      return s.href ? h('a', { href: s.href, style: { color: 'inherit', textDecoration: 'none', display: 'block' } }, inner) : inner;
    })),
  );
  return { title: 'DAGAN', node };
}

function tileIcon(kind) {
  return {
    width: '40px', height: '40px', borderRadius: '12px', display: 'grid', placeItems: 'center', flex: 'none',
    background: kind === 'accent' ? 'var(--accent-soft)' : 'var(--primary-soft)',
    color: kind === 'accent' ? 'var(--accent)' : 'var(--primary)',
  };
}

function installHint() {
  return h('div', { class: 'note', style: { marginBottom: '14px' } },
    h('b', null, 'Installer DAGAN sur votre iPhone'),
    h('p', null, 'Dans Safari, touchez le bouton Partager ', icon('share'), ' puis « Sur l’écran d’accueil ». DAGAN s’ouvrira alors comme une vraie application, même sans Internet.'),
    h('button', { class: 'btn small', type: 'button', on: { click: () => { update((s) => { s.hints.installDismissed = true; }); refresh(); } } }, 'J’ai compris'));
}
