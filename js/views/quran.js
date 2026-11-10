// Module « Coran » : liste des sourates, lecteur mot à mot, quiz par sourate.

import { h, ar, icon, iconBtn, progressBar, sheet, closeSheet, toast, arabicDigits, shuffle } from '../ui.js';
import { SURAHS, BISMILLAH, getSurah, getItem, qid, surahWordIds, verseAudioUrls, RECITERS } from '../content.js';
import { playSequence, stop, onPlayingChange } from '../audio.js';
import { getState, update, settings, logActivity } from '../store.js';
import { addCards, hasCard } from '../srs.js';
import { openWordSheet, glossLines, quiz, meaningQuestions } from '../components.js';
import { refresh } from '../nav.js';

export function listView() {
  const st = getState();
  const node = h('div', null,
    h('p', { class: 'muted' }, 'Al-Fâtiha et les sourates courtes, celles qu’on récite dans la prière. Chaque mot est traduit en français et en wolof.'),
    h('ul', { class: 'list' }, SURAHS.map((s) => {
      const ids = surahWordIds(s.id);
      const inSrs = ids.filter(hasCard).length;
      const learned = st.progress.surahs[s.id]?.learned;
      return h('li', null, h('a', { class: 'list-item', href: `#/coran/${s.id}` },
        h('span', { class: `badge ${learned ? 'ok' : ''}`, style: { minWidth: '34px', justifyContent: 'center' } }, learned ? icon('check') : String(s.id)),
        h('span', { class: 'grow' },
          h('div', { class: 'title' }, s.translit),
          h('div', { class: 'sub' }, `${s.fr} • ${s.verses.length} versets • ${s.type}`),
          inSrs ? h('div', { style: { marginTop: '5px' } }, progressBar(inSrs / ids.length)) : null),
        ar(s.name, 'ar-m')));
    })),
    h('p', { class: 'small muted', style: { marginTop: '14px' } }, 'Texte : mushaf de Médine (écriture uthmani, lecture de Hafs). Traduction française : Muhammad Hamidullah.'),
  );
  return { title: 'Coran', node, keepScroll: true };
}

export function surahView({ s }) {
  const surah = getSurah(s);
  if (!surah) return null;
  update((st) => { st.progress.lastSurah = surah.id; });
  const st = settings();
  const mode = st.quranMode === 'wbw' ? 'wbw' : 'verse';
  const verseEls = [];
  const wordEls = [];
  let playBtn;

  const learned = !!getState().progress.surahs[surah.id]?.learned;

  function setActive(vIndex, wIndex = -1) {
    verseEls.forEach((el, i) => el.classList.toggle('active', i === vIndex));
    wordEls.forEach((row, i) => row.forEach((el, k) => el.classList.toggle('active', i === vIndex && k === wIndex)));
    const el = verseEls[vIndex];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function playFrom(vIndex) {
    const items = [];
    const map = [];
    if (vIndex === 0 && surah.id !== 1) { items.push({ urls: verseAudioUrls(1, 1) }); map.push(-1); }
    for (let i = vIndex; i < surah.verses.length; i++) { items.push({ urls: verseAudioUrls(surah.id, surah.verses[i].n) }); map.push(i); }
    playSequence(items, {
      repeat: settings().repeat || 1,
      onItem: (k) => setActive(map[k]),
      onDone: () => setActive(-1),
    });
  }

  function playOneVerse(i) {
    playSequence([{ urls: verseAudioUrls(surah.id, surah.verses[i].n) }], {
      repeat: settings().repeat || 1,
      onItem: () => setActive(i),
      onDone: () => setActive(-1),
    });
  }

  const verses = surah.verses.map((v, vi) => {
    const items = v.w.map((_, wi) => getItem(qid(surah.id, v.n, wi + 1)));
    let body;
    if (mode === 'wbw') {
      const cells = items.map((it) => h('button', { class: 'wbw-cell', type: 'button', on: { click: () => openWordSheet(it.id, { onChange: refresh }) } },
        ar(it.ar, ''), glossLines(it)));
      wordEls[vi] = cells;
      body = h('div', null,
        h('div', { class: 'wbw', lang: 'ar' }, cells, h('span', { class: 'verse-num ar', style: { alignSelf: 'center', fontSize: '20px' } }, arabicDigits(v.n))),
        st.fr ? h('div', { class: 'verse-fr' }, v.fr) : null);
    } else {
      const spans = items.map((it) => {
        const sp = ar(it.ar, 'w', { role: 'button', tabindex: '0' });
        sp.addEventListener('click', () => openWordSheet(it.id, { onChange: refresh }));
        return sp;
      });
      wordEls[vi] = spans;
      body = h('div', null,
        h('div', { class: 'verse-ar ar' }, spans.flatMap((sp, i) => (i ? [' ', sp] : [sp])), ' ', h('span', { class: 'verse-num' }, arabicDigits(v.n))),
        st.translit ? h('div', { class: 'verse-tr tr' }, items.map((it) => it.tr).join(' ')) : null,
        st.fr ? h('div', { class: 'verse-fr' }, v.fr) : null);
    }
    const el = h('article', { class: 'verse', id: `v${v.n}` },
      body,
      h('div', { class: 'verse-tools' },
        iconBtn('play', `Écouter le verset ${v.n}`, () => playOneVerse(vi), 'small'),
        iconBtn('plus', 'Réviser les mots de ce verset', () => {
          const n = addCards(items.map((it) => it.id));
          toast(n ? `${n} mot${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''} à vos révisions.` : 'Ces mots sont déjà dans vos révisions.');
          if (n) logActivity(1);
        }, 'small')));
    verseEls[vi] = el;
    return el;
  });

  playBtn = h('button', { class: 'btn small primary', type: 'button' }, icon('play'), h('span', null, 'Écouter'));
  playBtn.addEventListener('click', () => {
    if (playBtn.dataset.playing === '1') stop();
    else playFrom(0);
  });
  const unsub = onPlayingChange((p) => {
    playBtn.dataset.playing = p ? '1' : '';
    playBtn.replaceChildren(icon(p ? 'stop' : 'play'), h('span', null, p ? 'Arrêter' : 'Écouter'));
  });

  const modeSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Affichage' },
    [['verse', 'Verset'], ['wbw', 'Mot à mot']].map(([m, label]) => h('button', {
      type: 'button', 'aria-pressed': String(mode === m),
      on: { click: () => { update((x) => { x.settings.quranMode = m; }); refresh(); } },
    }, label)));

  const toolbar = h('div', { class: 'toolbar' },
    playBtn, modeSeg,
    h('span', { style: { flex: 1 } }),
    iconBtn('settings', 'Options d’affichage et d’audio', () => openOptions(), 'small'));

  const node = h('div', null,
    h('div', { class: 'surah-head' },
      ar(surah.name, ''),
      h('div', { class: 'muted' }, `${surah.translit} — ${surah.fr} • ${surah.verses.length} versets`)),
    toolbar,
    surah.id !== 1 ? h('div', { class: 'bismillah ar', lang: 'ar' }, BISMILLAH) : null,
    verses,
    h('div', { class: 'stack', style: { marginTop: '18px' } },
      h('a', { class: 'btn primary block', href: `#/coran/${surah.id}/quiz` }, icon('star'), 'Quiz sur cette sourate'),
      h('button', {
        class: 'btn block', type: 'button',
        on: {
          click: () => {
            const n = addCards(surahWordIds(surah.id));
            toast(n ? `${n} mots ajoutés à vos révisions.` : 'Tous les mots sont déjà dans vos révisions.');
            if (n) logActivity(1);
          },
        },
      }, icon('plus'), 'Réviser tous les mots de la sourate'),
      h('button', {
        class: `btn block ${learned ? '' : 'ghost'}`, type: 'button',
        on: {
          click: () => {
            update((x) => { x.progress.surahs[surah.id] = { ...(x.progress.surahs[surah.id] || {}), learned: !learned }; });
            if (!learned) { logActivity(2); toast('Sourate marquée comme apprise. Bârak Allâhu fîk !'); }
            refresh();
          },
        },
      }, icon('check'), learned ? 'Apprise ✓ (toucher pour annuler)' : 'Marquer comme apprise'),
      navLinks(surah)),
  );
  return { title: surah.translit, back: '#/coran', node, cleanup: unsub };
}

function navLinks(surah) {
  const i = SURAHS.indexOf(surah);
  const prev = SURAHS[i - 1];
  const next = SURAHS[i + 1];
  return h('div', { class: 'btn-row' },
    prev ? h('a', { class: 'btn', href: `#/coran/${prev.id}` }, icon('back'), prev.translit) : null,
    next ? h('a', { class: 'btn', href: `#/coran/${next.id}` }, next.translit, icon('next')) : null);
}

function openOptions() {
  const st = settings();
  const set = (k, v) => { update((x) => { x.settings[k] = v; }); };
  const sw = (label, key) => {
    const input = h('input', { type: 'checkbox', role: 'switch', 'aria-label': label });
    input.checked = !!st[key];
    input.addEventListener('change', () => set(key, input.checked));
    return h('label', { class: 'switch-row' }, h('span', null, label), h('span', { class: 'switch' }, input, h('span')));
  };
  const select = (label, key, options) => {
    const el = h('select', { class: 'input' }, options.map(([v, l]) => h('option', { value: String(v), selected: String(st[key]) === String(v) }, l)));
    el.addEventListener('change', () => set(key, typeof options[0][0] === 'number' ? Number(el.value) : el.value));
    return h('label', { class: 'field' }, h('span', null, label), el);
  };
  sheet('Affichage et audio', h('div', null,
    h('div', { class: 'list' },
      sw('Translittération', 'translit'), sw('Traduction française', 'fr'), sw('Wolof (alphabet latin)', 'wo'), sw('Wolofal', 'wolofal')),
    select('Récitateur', 'reciter', RECITERS.map((r) => [r.id, r.name])),
    select('Vitesse', 'rate', [[0.75, 'Lente (0,75×)'], [1, 'Normale'], [1.25, 'Rapide (1,25×)']]),
    select('Répéter chaque verset', 'repeat', [[1, '1 fois'], [2, '2 fois'], [3, '3 fois'], [5, '5 fois'], [10, '10 fois']]),
    h('button', { class: 'btn primary block', type: 'button', on: { click: () => { closeSheet(); refresh(); } } }, 'Appliquer')));
}

export function quizView({ s }) {
  const surah = getSurah(s);
  if (!surah) return null;
  const root = h('div');
  function start() {
    const ids = surahWordIds(surah.id);
    const meaning = meaningQuestions(ids, null, 7);
    const orderable = surah.verses.filter((v) => v.w.length >= 3 && v.w.length <= 7);
    const order = shuffle(orderable).slice(0, 3).map((v) => ({
      type: 'order',
      prompt: h('div', null, h('div', { class: 'lbl' }, `Remettez le verset ${v.n} dans l’ordre`), h('p', null, v.fr)),
      words: v.w.map((w) => w.ar),
      explain: v.fr,
      audio: { urls: verseAudioUrls(surah.id, v.n) },
    }));
    const qs = shuffle(meaning).concat(order);
    root.replaceChildren(quiz(qs, {
      retry: start,
      backHref: `#/coran/${surah.id}`,
      backLabel: 'Retour à la sourate',
      onFinish: (score, total) => update((x) => {
        const best = x.progress.quizzes[`s${surah.id}`] || 0;
        x.progress.quizzes[`s${surah.id}`] = Math.max(best, Math.round((score / total) * 100));
      }),
    }));
  }
  start();
  return { title: `Quiz : ${surah.translit}`, back: `#/coran/${surah.id}`, node: root };
}
