// Module « Lecture » : alphabet, signes, exercices de lecture fluide, lecture guidée, wolofal.

import { h, ar, wolofalEl, icon, iconBtn, progressBar, shuffle, toast, arabicDigits } from '../ui.js';
import { LETTERS, EXTRA_LETTERS, SIMILAR_GROUPS, WOLOFAL_LETTERS } from '../data/alphabet.js';
import { SIGN_SECTIONS, SYLLABLE_MARKS } from '../data/signs.js';
import { SURAHS, BISMILLAH, getSurah, getItem, allQuranWordIds, letterCount, verseAudioUrls, wordAudioUrls } from '../content.js';
import { play, playSequence, speak, stop } from '../audio.js';
import { getState, update, logActivity, settings } from '../store.js';
import { quiz } from '../components.js';
import { toWolofal } from '../wolofal.js';

const ZWJ = '‍';
const ALL_LETTERS = [...LETTERS, ...EXTRA_LETTERS];

function forms(letter) {
  const L = letter.ar;
  const joins = letter.join !== false;
  return {
    isolated: L,
    initial: joins ? L + ZWJ : L,
    medial: joins ? ZWJ + L + ZWJ : ZWJ + L,
    final: ZWJ + L,
  };
}

// ── Accueil du module ──
export function hubView() {
  const st = getState();
  const seen = Object.keys(st.progress.lettersSeen).length;
  const fluent = Object.keys(st.progress.fluent).length;
  const tile = (href, ic, title, sub, accent) => h('a', { class: 'tile', href },
    h('span', { class: `tile-icon ${accent ? 'accent' : ''}` }, typeof ic === 'string' ? icon(ic) : ic),
    h('span', { class: 'title' }, title), h('span', { class: 'sub' }, sub));
  const node = h('div', null,
    h('p', { class: 'muted' }, 'Vous savez déjà lire : ici, on gagne en fluidité. Révisez les lettres difficiles, maîtrisez les signes propres au Coran, puis entraînez-vous avec de vrais mots et versets récités.'),
    h('div', { class: 'section-title' }, 'Apprendre'),
    h('div', { class: 'grid-2' },
      tile('#/lecture/alphabet', ar('أ ب ت', 'ar-s'), 'L’alphabet', `${seen}/28 lettres revues`),
      tile('#/lecture/signes/base', ar('ـَـِـُ', 'ar-s'), 'Voyelles et signes', 'Fatḥa, shadda, tanwîn…'),
      tile('#/lecture/signes/article', ar('ال', 'ar-s'), 'Lettres solaires', 'Lire l’article « al- »'),
      tile('#/lecture/signes/uthmani', ar('ۡ ٰ ۥ', 'ar-s'), 'Signes du Coran', 'L’écriture du mushaf', true),
      tile('#/lecture/signes/tajwid', icon('volume'), 'Tajwîd de base', 'Ghunna, qalqala, madd'),
      tile('#/lecture/wolofal', ar('ݒ ݖ ݧ', 'ar-s'), 'Le wolofal', 'Le wolof en lettres arabes', true)),
    h('div', { class: 'section-title' }, 'S’entraîner'),
    h('div', { class: 'list' },
      listLink('#/lecture/guidee', 'quran', 'Lecture guidée', `Verset par verset, avec le récitateur • ${fluent} versets maîtrisés`),
      listLink('#/lecture/mots', 'eye', 'Lire les mots du Coran', 'Lisez, puis écoutez la bonne prononciation'),
      listLink('#/lecture/syllabes', 'read', 'Syllabes rapides', 'Lettre + voyelle : gagner en vitesse'),
      listLink('#/lecture/semblables', 'shuffle', 'Lettres qui se ressemblent', 'Ne plus confondre ح خ ج, ص ض…')),
  );
  return { title: 'Lecture', node };
}

function listLink(href, ic, title, sub) {
  return h('a', { class: 'list-item', href },
    h('span', { style: { color: 'var(--primary)' } }, icon(ic)),
    h('span', { class: 'grow' }, h('div', { class: 'title' }, title), h('div', { class: 'sub' }, sub)),
    icon('next', 'chev'));
}

// ── Alphabet ──
export function alphabetView() {
  const seen = getState().progress.lettersSeen;
  const tiles = (list, offset) => list.map((l, i) => h('a', {
    class: `letter-tile ${l.hard ? 'hard' : ''}`, href: `#/lecture/lettre/${i + offset}`,
    'aria-label': `${l.name}${seen[l.ar] ? ', revue' : ''}`,
  }, ar(l.ar, ''), h('span', { class: 'name' }, l.name, seen[l.ar] ? ' ✓' : '')));
  const node = h('div', null,
    h('p', { class: 'muted small' }, 'Touchez une lettre pour voir ses formes et sa prononciation. Le point doré signale un son absent du français et du wolof : à travailler en priorité.'),
    h('div', { class: 'letters' }, tiles(LETTERS, 0)),
    h('div', { class: 'section-title' }, 'Lettres particulières'),
    h('div', { class: 'letters' }, tiles(EXTRA_LETTERS, LETTERS.length)),
  );
  return { title: 'L’alphabet', back: '#/lecture', node, keepScroll: true };
}

export function letterView({ i }) {
  const idx = Number(i);
  const l = ALL_LETTERS[idx];
  if (!l) return null;
  update((s) => { s.progress.lettersSeen[l.ar] = Date.now(); });
  const f = forms(l);
  const wolofTip = WOLOFAL_LETTERS.find((w) => w.ar === l.ar);
  const node = h('div', null,
    h('div', { class: 'card center' },
      ar(l.ar, 'ar-xxl'),
      h('h2', null, l.name, ' ', ar(l.nameAr, 'ar-s')),
      h('div', null, h('span', { class: 'badge primary' }, `son : ${l.tr}`), l.hard ? h('span', { class: 'badge accent', style: { marginInlineStart: '6px' } }, 'son à travailler') : null),
      h('p', { style: { marginTop: '12px' } }, l.sound),
      h('div', { class: 'btn-row', style: { marginTop: '10px', justifyContent: 'center' } },
        h('button', { class: 'btn small', type: 'button', on: { click: () => speak(l.nameAr) } }, icon('volume'), 'Nom de la lettre'))),
    h('div', { class: 'section-title' }, 'Les 4 formes'),
    h('div', { class: 'forms' },
      [['isolée', f.isolated], ['début', f.initial], ['milieu', f.medial], ['fin', f.final]].map(([lbl, g]) =>
        h('div', null, ar(g, ''), h('div', { class: 'lbl' }, lbl)))),
    l.join === false ? h('p', { class: 'small muted' }, 'Cette lettre ne s’attache jamais à la lettre qui la suit : la lettre suivante prend donc sa forme de début.') : null,
    h('div', { class: 'section-title' }, 'Exemple'),
    h('div', { class: 'card', style: { display: 'flex', alignItems: 'center', gap: '12px' } },
      ar(l.ex.ar, 'ar-l'),
      h('div', { style: { flex: 1 } }, h('div', { class: 'tr' }, l.ex.tr), h('div', null, l.ex.fr)),
      iconBtn('volume', 'Écouter l’exemple', () => speak(l.ex.ar))),
    wolofTip ? h('p', { class: 'note' }, wolofTip.note) : null,
    h('div', { class: 'btn-row', style: { marginTop: '18px' } },
      idx > 0 ? h('a', { class: 'btn', href: `#/lecture/lettre/${idx - 1}` }, icon('back'), ALL_LETTERS[idx - 1].name) : null,
      idx < ALL_LETTERS.length - 1 ? h('a', { class: 'btn primary', href: `#/lecture/lettre/${idx + 1}` }, ALL_LETTERS[idx + 1].name, icon('next')) : null),
  );
  return { title: `Lettre ${l.name}`, back: '#/lecture/alphabet', node };
}

// ── Signes ──
export function signsView({ id }) {
  const section = SIGN_SECTIONS.find((s) => s.id === id);
  if (!section) return null;
  const idx = SIGN_SECTIONS.indexOf(section);
  const node = h('div', null,
    h('p', { class: 'muted' }, section.intro),
    section.items.map((it) => h('div', { class: 'card' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
        h('div', { style: { minWidth: '74px', textAlign: 'center' } }, ar(it.glyph, 'ar-l')),
        h('div', { style: { flex: 1 } }, h('h3', null, it.name), h('div', { class: 'tr' }, it.tr))),
      h('p', null, it.desc),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', background: 'var(--surface-2)' } },
        ar(it.ex.ar, 'ar-m'),
        h('div', { style: { flex: 1 } }, h('div', { class: 'tr' }, it.ex.tr), h('div', { class: 'small' }, it.ex.fr)),
        iconBtn('volume', 'Écouter', () => speak(it.ex.ar))))),
    h('div', { class: 'btn-row', style: { marginTop: '18px' } },
      idx > 0 ? h('a', { class: 'btn', href: `#/lecture/signes/${SIGN_SECTIONS[idx - 1].id}` }, icon('back'), 'Précédent') : null,
      idx < SIGN_SECTIONS.length - 1 ? h('a', { class: 'btn primary', href: `#/lecture/signes/${SIGN_SECTIONS[idx + 1].id}` }, 'Suivant', icon('next')) : h('a', { class: 'btn primary', href: '#/lecture/guidee' }, 'S’entraîner', icon('next'))),
    h('p', { class: 'small muted', style: { marginTop: '16px' } }, 'La voix de synthèse de l’iPhone sert à donner une idée du son. Pour la récitation exacte, écoutez les récitateurs dans « Lecture guidée ».'),
  );
  return { title: section.title, back: '#/lecture', node };
}

// ── Syllabes rapides ──
export function syllablesView() {
  const bases = LETTERS.filter((l) => l.ar !== 'ا');
  let level = 1;
  const root = h('div');
  let count = 0;

  function makeItem() {
    const parts = [];
    for (let k = 0; k < level; k++) {
      const L = bases[Math.floor(Math.random() * bases.length)];
      const m = SYLLABLE_MARKS[Math.floor(Math.random() * (k === level - 1 ? SYLLABLE_MARKS.length : 6))];
      parts.push({ ar: L.ar + m.mark, tr: L.tr.split(' ')[0] + m.tr });
    }
    return { ar: parts.map((p) => p.ar).join(''), tr: parts.map((p) => p.tr).join('-') };
  }

  function show() {
    const it = makeItem();
    const answer = h('div', { hidden: true }, h('div', { class: 'tr', style: { fontSize: '22px' } }, it.tr));
    const reveal = h('button', { class: 'btn primary block', type: 'button' }, icon('eye'), 'Voir la réponse');
    const nextBtn = h('button', { class: 'btn primary block', type: 'button', hidden: true }, 'Suivant', icon('next'));
    reveal.addEventListener('click', () => {
      answer.hidden = false; reveal.hidden = true; nextBtn.hidden = false;
      speak(it.ar);
      count++;
      if (count % 5 === 0) logActivity(1);
    });
    nextBtn.addEventListener('click', show);
    root.replaceChildren(
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Niveau', style: { marginBottom: '12px' } },
        [[1, '1 syllabe'], [2, '2 syllabes'], [3, '3 syllabes']].map(([n, lbl]) => h('button', { type: 'button', 'aria-pressed': String(level === n), on: { click: () => { level = n; show(); } } }, lbl))),
      h('div', { class: 'card flash' }, ar(it.ar, 'ar-xxl'), answer),
      h('p', { class: 'muted small center' }, 'Lisez à voix haute, puis vérifiez.'),
      reveal, nextBtn,
      h('p', { class: 'small muted center', style: { marginTop: '10px' } }, `${count} syllabe${count > 1 ? 's' : ''} lue${count > 1 ? 's' : ''}`));
  }
  show();
  return { title: 'Syllabes rapides', back: '#/lecture', node: root };
}

// ── Lettres qui se ressemblent ──
export function similarView() {
  const root = h('div');
  function chooser() {
    root.replaceChildren(
      h('p', { class: 'muted' }, 'Choisissez un groupe de lettres. Vous verrez le nom et le son, et devrez trouver la bonne lettre.'),
      h('div', { class: 'list' },
        h('button', { class: 'list-item', type: 'button', on: { click: () => start(null) } },
          h('span', { class: 'grow' }, h('div', { class: 'title' }, 'Tout mélanger'), h('div', { class: 'sub' }, '10 questions sur tous les groupes')), icon('next', 'chev')),
        SIMILAR_GROUPS.map((g) => h('button', { class: 'list-item', type: 'button', on: { click: () => start(g) } },
          h('span', { class: 'grow' }, h('div', { class: 'title' }, g.title)), ar(g.letters.join(' '), 'ar-s'), icon('next', 'chev')))));
  }
  function start(group) {
    const groups = group ? [group] : SIMILAR_GROUPS;
    const qs = [];
    for (let k = 0; k < 10; k++) {
      const g = groups[Math.floor(Math.random() * groups.length)];
      const target = ALL_LETTERS.find((l) => l.ar === g.letters[Math.floor(Math.random() * g.letters.length)]);
      const reverse = Math.random() < 0.4;
      const opts = shuffle(g.letters).slice(0, 4).map((c) => ALL_LETTERS.find((l) => l.ar === c));
      if (!opts.includes(target)) opts[0] = target;
      qs.push({
        type: 'mcq', compact: true,
        prompt: reverse
          ? h('div', null, h('div', { class: 'lbl' }, 'Comment s’appelle cette lettre ?'), ar(target.ar, 'ar-xxl'))
          : h('div', null, h('div', { class: 'lbl' }, 'Trouvez la lettre'), h('h2', null, `${target.name} (${target.tr})`), h('p', { class: 'small muted' }, target.sound)),
        options: shuffle(opts).map((o) => ({ node: reverse ? h('span', null, `${o.name} (${o.tr})`) : ar(o.ar, 'ar-l'), correct: o === target })),
        explain: h('span', null, ar(target.ar, 'ar-s'), ` = ${target.name} : ${target.sound}`),
        audio: { tts: target.nameAr },
      });
    }
    root.replaceChildren(quiz(qs, { retry: () => start(group), backHref: '#/lecture', backLabel: 'Retour à la lecture' }));
  }
  chooser();
  return { title: 'Lettres semblables', back: '#/lecture', node: root };
}

// ── Lire les mots du Coran ──
export function wordsDrillView() {
  const all = allQuranWordIds().map(getItem);
  const levels = [
    { id: 'court', label: 'Courts', test: (n) => n <= 3 },
    { id: 'moyen', label: 'Moyens', test: (n) => n >= 4 && n <= 5 },
    { id: 'long', label: 'Longs', test: (n) => n >= 6 },
  ];
  let level = levels[0];
  let queue = [];
  let ok = 0;
  let seen = 0;
  const root = h('div');

  function refill() {
    const seenAr = new Set();
    queue = shuffle(all.filter((it) => level.test(letterCount(it.ar)) && !seenAr.has(it.ar) && seenAr.add(it.ar)));
  }

  function show() {
    if (!queue.length) refill();
    const it = queue.shift();
    const answer = h('div', { hidden: true },
      h('div', { class: 'tr', style: { fontSize: '20px' } }, it.tr), h('div', null, it.fr), h('div', { class: 'small muted' }, it.source),
      iconBtn('volume', 'Réécouter', () => play(it.audio)));
    const reveal = h('button', { class: 'btn primary block', type: 'button' }, icon('volume'), 'Écouter et vérifier');
    const grades = h('div', { class: 'btn-row', hidden: true },
      h('button', { class: 'btn', type: 'button', on: { click: () => { seen++; show(); } } }, 'À revoir'),
      h('button', { class: 'btn primary', type: 'button', on: { click: () => { seen++; ok++; logActivity(1); show(); } } }, icon('check'), 'Bien lu'));
    reveal.addEventListener('click', () => {
      answer.hidden = false; reveal.hidden = true; grades.hidden = false;
      play(it.audio);
    });
    root.replaceChildren(
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Longueur des mots', style: { marginBottom: '12px' } },
        levels.map((lv) => h('button', { type: 'button', 'aria-pressed': String(lv === level), on: { click: () => { level = lv; refill(); show(); } } }, lv.label))),
      h('div', { class: 'card flash' },
        ar(it.ar, 'ar-xxl'),
        answer),
      h('p', { class: 'muted small center' }, 'Lisez le mot à voix haute, puis écoutez le récitateur.'),
      reveal, grades,
      h('p', { class: 'small muted center', style: { marginTop: '10px' } }, seen ? `${ok} bien lu${ok > 1 ? 's' : ''} sur ${seen}` : ''));
  }
  refill();
  show();
  return { title: 'Lire les mots', back: '#/lecture', node: root };
}

// ── Lecture guidée ──
export function guidedListView() {
  const fluent = getState().progress.fluent;
  const node = h('div', null,
    h('p', { class: 'muted' }, 'Pour chaque verset : 1) lisez-le seul, à voix haute ; 2) écoutez le récitateur ; 3) répétez en l’imitant. Quand vous le lisez sans hésiter, validez-le.'),
    h('ul', { class: 'list' }, SURAHS.map((s) => {
      const done = s.verses.filter((v) => fluent[`${s.id}:${v.n}`]).length;
      return h('li', null, h('a', { class: 'list-item', href: `#/lecture/guidee/${s.id}` },
        h('span', { class: 'badge' }, String(s.id)),
        h('span', { class: 'grow' }, h('div', { class: 'title' }, s.translit), h('div', { class: 'sub' }, `${done}/${s.verses.length} versets maîtrisés`), h('div', { style: { marginTop: '4px' } }, progressBar(done / s.verses.length))),
        ar(s.name, 'ar-s')));
    })));
  return { title: 'Lecture guidée', back: '#/lecture', node, keepScroll: true };
}

export function guidedView({ s }) {
  const surah = getSurah(s);
  if (!surah) return null;
  let vi = 0;
  let showHelp = false;
  const root = h('div');

  function render() {
    const v = surah.verses[vi];
    const key = `${surah.id}:${v.n}`;
    const isFluent = !!getState().progress.fluent[key];
    const wordSpans = v.w.map((w) => ar(w.ar, 'w'));
    const line = h('div', { class: 'verse-ar ar' }, wordSpans.flatMap((sp, i) => (i ? [' ', sp] : [sp])), ' ', h('span', { class: 'verse-num' }, arabicDigits(v.n)));
    wordSpans.forEach((sp, i) => sp.addEventListener('click', () => {
      wordSpans.forEach((x) => x.classList.remove('active'));
      sp.classList.add('active');
      play({ urls: wordAudioUrls(surah.id, v.n, i + 1) });
    }));
    const help = h('div', { hidden: !showHelp },
      h('div', { class: 'verse-tr tr' }, v.w.map((w) => w.tr).join(' ')),
      h('div', { class: 'verse-fr' }, v.fr));
    const highlight = (i) => wordSpans.forEach((x, k) => x.classList.toggle('active', k === i));
    const playWords = () => playSequence(v.w.map((_, i) => ({ urls: wordAudioUrls(surah.id, v.n, i + 1) })), { onItem: highlight, onDone: () => highlight(-1), gap: 120 });
    const playVerse = () => playSequence([{ urls: verseAudioUrls(surah.id, v.n) }], { repeat: settings().repeat || 1 });

    root.replaceChildren(
      h('div', { class: 'quiz-top' }, progressBar((vi + 1) / surah.verses.length), h('span', { class: 'small muted' }, `${vi + 1}/${surah.verses.length}`)),
      h('div', { class: 'card' },
        vi === 0 && surah.id !== 1 ? h('div', { class: 'bismillah ar', lang: 'ar' }, BISMILLAH) : null,
        line,
        h('div', { class: 'verse-tools' },
          h('button', { class: 'btn small', type: 'button', on: { click: () => { showHelp = !showHelp; help.hidden = !showHelp; } } }, icon('eye'), 'Aide'),
          isFluent ? h('span', { class: 'badge ok', style: { alignSelf: 'center' } }, icon('check'), 'maîtrisé') : null),
        help),
      h('div', { class: 'stack', style: { marginTop: '12px' } },
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn', type: 'button', on: { click: playWords } }, icon('list'), 'Mot par mot'),
          h('button', { class: 'btn', type: 'button', on: { click: playVerse } }, icon('play'), 'Verset entier'),
          h('button', { class: 'btn ghost', type: 'button', on: { click: stop } }, icon('stop'), 'Stop')),
        h('button', {
          class: `btn block ${isFluent ? '' : 'primary'}`, type: 'button',
          on: {
            click: () => {
              update((st) => {
                if (st.progress.fluent[key]) delete st.progress.fluent[key];
                else st.progress.fluent[key] = Date.now();
              });
              if (!isFluent) { logActivity(1); if (vi < surah.verses.length - 1) { vi++; } else toast('Sourate terminée, mâ shâʾ Allâh !'); }
              render();
            },
          },
        }, icon('check'), isFluent ? 'Retirer « maîtrisé »' : 'Je le lis sans hésiter'),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn', type: 'button', disabled: vi === 0, on: { click: () => { stop(); vi--; render(); } } }, icon('back'), 'Précédent'),
          h('button', { class: 'btn', type: 'button', disabled: vi === surah.verses.length - 1, on: { click: () => { stop(); vi++; render(); } } }, 'Suivant', icon('next')))),
      h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Astuce : touchez un mot pour l’entendre seul. La vitesse et le récitateur se règlent dans Réglages.'),
    );
  }
  render();
  return { title: surah.translit, back: '#/lecture/guidee', node: root };
}

// ── Wolofal ──
export function wolofalView() {
  const input = h('textarea', { class: 'input', rows: '3', autocapitalize: 'off', spellcheck: 'false', placeholder: 'Écrivez en wolof…' });
  input.value = 'Cant ñeel na Yàlla, Boroom àddina yépp.';
  const out = wolofalEl(toWolofal(input.value), 'ar-l');
  out.style.fontSize = 'calc(30px * var(--ar-scale))';
  input.addEventListener('input', () => { out.textContent = toWolofal(input.value); });
  const vowels = [
    ['a', 'ـَ'], ['à', 'ـࣵ'], ['e', 'ـࣹ'], ['é', 'ـࣺ'], ['ë', 'ـࣴ'], ['i', 'ـِ'], ['o', 'ـࣷ'], ['ó', 'ـࣸ'], ['u', 'ـُ'],
  ];
  const node = h('div', null,
    h('p', null, 'Le wolofal, c’est le wolof écrit avec l’alphabet arabe. Il est utilisé depuis des siècles dans les daaras, et beaucoup de khassaïdes ont été écrits ainsi. Comme vous lisez l’arabe, c’est un excellent pont entre vos deux langues.'),
    h('div', { class: 'section-title' }, 'Essayez'),
    h('div', { class: 'card' }, input, h('div', { style: { marginTop: '12px', textAlign: 'right' } }, out)),
    h('div', { class: 'section-title' }, 'Les lettres ajoutées pour le wolof'),
    h('div', { class: 'list' }, WOLOFAL_LETTERS.map((l) => h('div', { class: 'list-item' }, ar(l.ar, 'ar-l'), h('span', { class: 'grow' }, h('div', { class: 'title' }, `« ${l.wo} »`), h('div', { class: 'sub' }, l.note))))),
    h('div', { class: 'section-title' }, 'Les 9 voyelles'),
    h('div', { class: 'forms', style: { gridTemplateColumns: 'repeat(5, 1fr)', direction: 'ltr' } },
      vowels.map(([lat, mark]) => h('div', null, h('div', { class: 'ar', style: { fontSize: '34px' } }, 'ب' + mark.slice(1)), h('div', { class: 'lbl', style: { textTransform: 'none', fontSize: '14px' } }, `b${lat}`)))),
    h('div', { class: 'card', style: { marginTop: '12px' } },
      h('h3', null, 'Règles à retenir'),
      h('ul', { style: { paddingInlineStart: '20px', margin: '6px 0' } },
        h('li', null, 'Toutes les voyelles sont écrites, contrairement à l’arabe courant.'),
        h('li', null, 'Une voyelle en début de mot est portée par un alif (ا) ; « aa » au début s’écrit آ.'),
        h('li', null, 'Voyelle longue : on ajoute ا, ي ou و après le signe.'),
        h('li', null, 'Consonne double (« kk », « ll ») : shadda ّ ; consonne sans voyelle : sukûn ْ.'),
        h('li', null, 'mb, nd, nj, ng : le m ou le n ne porte aucun signe.'))),
    h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Conversion automatique selon l’orthographe harmonisée (DPLN, 1990) décrite par Richard Ishida. Il existe d’autres usages (notamment dans les écrits mourides et tidianes) : vous pouvez corriger chaque mot dans l’application.'),
  );
  return { title: 'Le wolofal', back: '#/lecture', node };
}
