// Méthode : leçons de grammaire et de conjugaison, conjugueur, exercices.

import { h, ar, icon, iconBtn, shuffle } from '../ui.js';
import { GRAMMAR } from '../data/grammar.js';
import { allVerbs, PERSONS, IMP_PERSONS } from '../conjugate.js';
import { getState, update } from '../store.js';
import { speak } from '../audio.js';
import { quiz } from '../components.js';

const AR_RE = /[؀-ۿ]/;

// Texte mêlant français et arabe : on isole l'arabe.
function mixed(text) {
  const parts = text.split(/([؀-ۿࢠ-ࣿ][؀-ۿࢠ-ࣿ\s،؟…]*[؀-ۿࢠ-ࣿ])/u);
  return parts.map((p, i) => (i % 2 ? ar(p, 'ar-s') : p));
}

function score(id) { return getState().progress.grammar?.[id]; }

export function grammarListView() {
  const section = (kind, title, intro) => {
    const lessons = GRAMMAR.filter((l) => l.kind === kind);
    const done = lessons.filter((l) => score(l.id) !== undefined).length;
    return h('div', null,
      h('div', { class: 'section-title' }, `${title} • ${done}/${lessons.length}`),
      h('p', { class: 'small muted', style: { margin: '0 4px 8px' } }, intro),
      h('ul', { class: 'list' }, lessons.map((l, i) => {
        const sc = score(l.id);
        return h('li', null, h('a', { class: 'list-item', href: `#/grammaire/${l.id}` },
          h('span', { class: `badge ${sc !== undefined ? 'ok' : ''}`, style: { minWidth: '34px', justifyContent: 'center' } }, sc !== undefined ? icon('check') : String(i + 1)),
          h('span', { class: 'grow' }, h('div', { class: 'title' }, l.title), h('div', { class: 'sub' }, sc !== undefined ? `${l.goal} • quiz : ${sc} %` : l.goal)),
          ar(l.titleAr.split(' ')[0], 'ar-s')));
      })));
  };
  const node = h('div', null,
    h('div', { class: 'note' }, h('b', null, 'La méthode : '), 'une leçon courte, des exemples tirés du Coran et des hadiths, puis un quiz. Faites les leçons dans l’ordre, une ou deux par semaine, et revenez-y quand un texte vous pose problème.'),
    section('nahw', 'Grammaire (nahw)', 'Comprendre comment la phrase arabe est construite.'),
    section('sarf', 'Conjugaison et formes (sarf)', 'Comprendre comment les mots et les verbes se forment.'),
    h('a', { class: 'btn block', href: '#/conjugaison', style: { marginTop: '14px' } }, icon('grid'), 'Ouvrir le conjugueur'),
  );
  return { title: 'Grammaire', back: '#/mots', node, keepScroll: true };
}

function renderBlock(b) {
  if (b.p) return h('p', null, mixed(b.p));
  if (b.tip) return h('div', { class: 'note' }, h('div', { class: 'lbl' }, 'À retenir'), mixed(b.tip));
  if (b.ex) return h('div', { class: 'card stack' }, b.ex.map((e) => h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
    h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { textAlign: 'right' } }, ar(e.ar, 'ar-m')), h('div', { class: 'small' }, mixed(e.fr))),
    iconBtn('volume', 'Écouter', () => speak(e.ar), 'small'))));
  if (b.table) {
    const { head, rows, ar: arCols = [] } = b.table;
    return h('div', { class: 'table-wrap' }, h('table', { class: 'gtable' },
      h('thead', null, h('tr', null, head.map((x) => h('th', null, x)))),
      h('tbody', null, rows.map((r) => h('tr', null, r.map((cell, k) => h('td', null, arCols.includes(k) && AR_RE.test(cell) && !/[a-zà-ÿ]/i.test(cell) ? ar(cell, 'ar-s') : mixed(cell))))))));
  }
  return null;
}

export function grammarLessonView({ id }) {
  const l = GRAMMAR.find((x) => x.id === id);
  if (!l) return null;
  const i = GRAMMAR.indexOf(l);
  const prev = GRAMMAR[i - 1];
  const next = GRAMMAR[i + 1];
  const node = h('div', null,
    h('div', { class: 'surah-head' }, ar(l.titleAr, 'ar-m'), h('h2', null, l.title), h('p', { class: 'muted' }, l.goal)),
    h('div', { class: 'stack' }, l.blocks.map(renderBlock)),
    h('div', { class: 'stack', style: { marginTop: '18px' } },
      h('a', { class: 'btn primary block', href: `#/grammaire/${l.id}/quiz` }, icon('star'), score(l.id) !== undefined ? `Refaire le quiz (meilleur : ${score(l.id)} %)` : 'Faire le quiz'),
      h('div', { class: 'btn-row' },
        prev ? h('a', { class: 'btn', href: `#/grammaire/${prev.id}` }, icon('back'), 'Précédente') : null,
        next ? h('a', { class: 'btn', href: `#/grammaire/${next.id}` }, 'Suivante', icon('next')) : null)),
  );
  return { title: l.kind === 'sarf' ? 'Conjugaison' : 'Grammaire', back: '#/grammaire', node };
}

export function grammarQuizView({ id }) {
  const l = GRAMMAR.find((x) => x.id === id);
  if (!l) return null;
  const root = h('div');
  const start = () => {
    const qs = shuffle(l.quiz).map((q) => {
      const opts = shuffle(q.options.map((o, k) => ({ o, ok: k === q.answer })));
      return {
        type: 'mcq',
        prompt: h('div', null, h('div', { class: 'lbl' }, l.title), h('h3', null, mixed(q.q))),
        options: opts.map(({ o, ok }) => ({ node: AR_RE.test(o) && !/[a-zà-ÿ]/i.test(o) ? ar(o, 'ar-m') : h('span', null, mixed(o)), correct: ok })),
        explain: h('span', null, mixed(q.explain)),
      };
    });
    root.replaceChildren(quiz(qs, {
      retry: start, backHref: `#/grammaire/${l.id}`, backLabel: 'Revoir la leçon',
      onFinish: (sc, total) => update((s) => {
        s.progress.grammar = s.progress.grammar || {};
        s.progress.grammar[l.id] = Math.max(s.progress.grammar[l.id] || 0, Math.round((sc / total) * 100));
      }),
    }));
  };
  start();
  return { title: `Quiz : ${l.title}`, back: `#/grammaire/${l.id}`, node: root };
}

// ── Conjugueur ──
const FORM_LABEL = {
  I: 'Forme I (verbe simple)', II: 'Forme II', III: 'Forme III', IV: 'Forme IV', V: 'Forme V', VI: 'Forme VI', VII: 'Forme VII', VIII: 'Forme VIII', X: 'Forme X',
  creux: 'Verbes creux', 'défectueux': 'Verbes défectueux', 'assimilé': 'Verbes assimilés',
};

export function conjugationListView() {
  const verbs = allVerbs();
  const groups = [];
  for (const v of verbs) {
    let g = groups.find((x) => x.form === v.form);
    if (!g) groups.push(g = { form: v.form, verbs: [] });
    g.verbs.push(v);
  }
  const node = h('div', null,
    h('p', { class: 'muted' }, `${verbs.length} verbes du Coran, conjugués au passé, au présent et à l’impératif, avec leurs participes et leur nom d’action.`),
    h('a', { class: 'btn primary block', href: '#/conjugaison/exercice' }, icon('star'), 'S’entraîner à conjuguer'),
    groups.map((g) => h('div', null,
      h('div', { class: 'section-title' }, FORM_LABEL[g.form] || g.form),
      h('ul', { class: 'list' }, g.verbs.map((v) => h('li', null, h('a', { class: 'list-item', href: `#/conjugaison/verbe/${encodeURIComponent(v.id)}` },
        h('span', { style: { minWidth: '110px', textAlign: 'center' } }, ar(`${v.base} – ${v.present}`, 'ar-s')),
        h('span', { class: 'grow' }, h('div', { class: 'title' }, v.fr), h('div', { class: 'sub wo' }, v.wo)),
        icon('next', 'chev'))))))),
  );
  return { title: 'Conjugueur', back: '#/mots', node, keepScroll: true };
}

export function verbView({ id }) {
  const v = allVerbs().find((x) => x.id === id);
  if (!v) return null;
  let showAll = !!getState().settings.conjAll;
  const root = h('div');
  function table(title, forms, personIdx) {
    const rows = personIdx.map((pi, k) => ({ p: PERSONS[pi], f: forms[k] })).filter((r) => showAll || (!r.p.dual && !r.p.rare));
    return h('div', null,
      h('div', { class: 'section-title' }, title),
      h('div', { class: 'list' }, rows.map((r) => h('button', { class: 'list-item', type: 'button', on: { click: () => speak(r.f) } },
        h('span', { style: { minWidth: '64px' } }, ar(r.p.ar, 'ar-s')),
        h('span', { class: 'grow small muted' }, `${r.p.fr} • ${r.p.wo}`),
        ar(r.f, 'ar-m')))));
  }
  function render() {
    const all = PERSONS.map((_, i) => i);
    root.replaceChildren(
      h('div', { class: 'card center' },
        ar(`${v.base} – ${v.present}`, 'ar-l'),
        h('h2', null, v.fr), h('div', { class: 'wo' }, v.wo),
        h('div', { style: { marginTop: '6px' } }, h('span', { class: 'badge primary' }, FORM_LABEL[v.form] || v.form), v.root ? h('span', { class: 'badge', style: { marginInlineStart: '6px' } }, 'racine ', ar([...v.root].join(' '), 'ar-s')) : null)),
      h('div', { class: 'btn-row', style: { marginTop: '10px' } },
        h('button', { class: 'btn small', type: 'button', on: { click: () => { showAll = !showAll; update((s) => { s.settings.conjAll = showAll; }); render(); } } }, showAll ? 'Masquer le duel et le féminin pluriel' : 'Afficher toutes les personnes')),
      h('p', { class: 'small muted' }, 'Touchez une forme pour l’entendre.'),
      table('Passé (المَاضِي)', v.past, all),
      table('Présent (المُضَارِع)', v.pres, all),
      table('Impératif (الأَمْر)', v.imp, IMP_PERSONS),
      h('div', { class: 'section-title' }, 'Mots dérivés'),
      h('div', { class: 'list' },
        v.active ? h('div', { class: 'list-item' }, h('span', { class: 'grow' }, 'Participe actif (celui qui fait)'), ar(v.active, 'ar-m')) : null,
        v.passive ? h('div', { class: 'list-item' }, h('span', { class: 'grow' }, 'Participe passif (ce qui est fait)'), ar(v.passive, 'ar-m')) : null,
        v.masdar ? h('div', { class: 'list-item' }, h('span', { class: 'grow' }, 'Nom d’action (masdar)'), ar(v.masdar, 'ar-m')) : null),
    );
  }
  render();
  return { title: v.fr, back: '#/conjugaison', node: root };
}

export function conjugationDrillView() {
  const verbs = allVerbs();
  const tenses = [
    { key: 'past', label: 'au passé', persons: PERSONS.map((_, i) => i) },
    { key: 'pres', label: 'au présent', persons: PERSONS.map((_, i) => i) },
    { key: 'imp', label: 'à l’impératif', persons: IMP_PERSONS },
  ];
  const common = (pi) => !PERSONS[pi].dual && !PERSONS[pi].rare;
  const root = h('div');
  function start() {
    const qs = [];
    for (let k = 0; k < 10; k++) {
      const v = verbs[Math.floor(Math.random() * verbs.length)];
      const t = tenses[k % 5 === 4 ? 2 : k % 2];
      const idxs = t.persons.map((pi, j) => ({ pi, j })).filter((x) => common(x.pi));
      const target = idxs[Math.floor(Math.random() * idxs.length)];
      const forms = v[t.key];
      const answer = forms[target.j];
      const reverse = k % 3 === 2;
      if (reverse) {
        const opts = shuffle([target, ...shuffle(idxs.filter((x) => forms[x.j] !== answer)).slice(0, 3)]);
        qs.push({
          type: 'mcq',
          prompt: h('div', null, h('div', { class: 'lbl' }, `${v.fr} ${t.label} — quel pronom ?`), ar(answer, 'ar-xl')),
          options: opts.map((o) => ({ node: h('span', null, ar(PERSONS[o.pi].ar, 'ar-s'), ` ${PERSONS[o.pi].fr}`), correct: o === target })),
          explain: h('span', null, ar(`${PERSONS[target.pi].ar} ${answer}`, 'ar-s'), ` = ${PERSONS[target.pi].fr}`),
          audio: { tts: answer },
        });
      } else {
        const wrong = [...new Set(idxs.map((x) => forms[x.j]).filter((f) => f !== answer))];
        const opts = shuffle([answer, ...shuffle(wrong).slice(0, 3)]);
        qs.push({
          type: 'mcq', compact: true,
          prompt: h('div', null, h('div', { class: 'lbl' }, `Conjuguez ${t.label}`), ar(`${v.base}`, 'ar-l'), h('div', null, `(${v.fr}) avec `, ar(PERSONS[target.pi].ar, 'ar-m'), ` — ${PERSONS[target.pi].fr}`)),
          options: opts.map((o) => ({ node: ar(o, 'ar-m'), correct: o === answer })),
          explain: h('span', null, ar(`${PERSONS[target.pi].ar} ${answer}`, 'ar-s')),
          audio: { tts: answer },
        });
      }
    }
    root.replaceChildren(quiz(qs, { retry: start, backHref: '#/conjugaison', backLabel: 'Retour au conjugueur' }));
  }
  start();
  return { title: 'Exercice de conjugaison', back: '#/conjugaison', node: root };
}

