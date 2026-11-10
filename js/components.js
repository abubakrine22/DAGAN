// Composants partagés : fiche d'un mot, formulaire de correction, moteur de quiz.

import { h, ar, wolofalEl, icon, sheet, closeSheet, toast, progressBar, shuffle } from './ui.js';
import { getItem, saveCorrection, resetCorrection, wordsOfRoot, lookupWord, saveUserWord } from './content.js';
import { addCards, hasCard, removeCard } from './srs.js';
import { play, speak } from './audio.js';
import { settings, logActivity } from './store.js';
import { toWolofal } from './wolofal.js';

export function rootHref(root) {
  return `#/mots/racine/${encodeURIComponent(root)}`;
}

export function audioButton(item, label = 'Écouter', cls = 'btn small') {
  return h('button', { class: cls, type: 'button', on: { click: (e) => { e.stopPropagation(); play(item.audio); } } }, icon('volume'), label ? h('span', null, label) : null);
}

// Bloc d'affichage d'un mot : arabe, translittération, français, wolof, wolofal (selon les réglages).
export function glossLines(item, { force = false } = {}) {
  const st = settings();
  return [
    (force || st.translit) && item.tr ? h('div', { class: 'tr' }, item.tr) : null,
    (force || st.fr) ? h('div', { class: 'fr' }, item.fr) : null,
    (force || st.wo) && item.wo ? h('div', { class: 'wo' }, item.wo) : null,
    (force || st.wolofal) && item.wo ? wolofalEl(item.wolofal) : null,
  ];
}

// Ouvre la fiche d'un mot. onChange n'est appelé à la fermeture que si quelque chose a changé.
export function openWordSheet(id, { onChange } = {}) {
  let changed = false;
  const mark = () => { changed = true; };
  return sheet('', wordDetails(id, { mark }), { onClose: () => { if (changed) onChange?.(); } });
}

function wordDetails(id, { mark }) {
  const it = getItem(id);
  if (!it) return h('p', null, 'Mot introuvable.');
  const inSrs = hasCard(id);
  const related = it.root ? wordsOfRoot(it.root).filter((w) => w.ar !== it.ar).slice(0, 6) : [];
  const srsBtn = h('button', {
    class: `btn small ${inSrs ? '' : 'primary'}`, type: 'button',
    on: {
      click: () => {
        if (hasCard(id)) { removeCard(id); toast('Retiré de vos révisions.'); }
        else { addCards([id]); logActivity(1); toast('Ajouté à vos révisions.'); }
        mark();
        rerender();
      },
    },
  }, icon(inSrs ? 'check' : 'plus'), h('span', null, inSrs ? 'En révision' : 'Réviser ce mot'));

  const node = h('div', null,
    h('div', { class: 'center' }, ar(it.ar, 'ar-xl')),
    it.tr ? h('div', { class: 'center tr' }, it.tr) : null,
    h('dl', { class: 'kv' },
      h('dt', null, 'Français'), h('dd', { class: 'fr' }, it.fr),
      h('dt', null, 'Wolof'), h('dd', { class: 'wo' }, it.wo || '—'),
      it.wo ? h('dt', null, 'Wolofal') : null, it.wo ? h('dd', null, wolofalEl(it.wolofal)) : null,
      it.root ? h('dt', null, 'Racine') : null,
      it.root ? h('dd', null, h('a', { href: rootHref(it.root), class: 'root-chip ar ar-s', lang: 'ar', dir: 'rtl', on: { click: () => closeSheet() } }, it.root)) : null,
      it.note ? h('dt', null, 'Note') : null, it.note ? h('dd', null, noteText(it.note)) : null,
      h('dt', null, 'Source'), h('dd', { class: 'small muted' }, it.source),
    ),
    it.corrected ? h('p', null, h('span', { class: 'badge accent' }, icon('edit'), 'Traduction corrigée par vous')) : null,
    h('div', { class: 'btn-row' },
      audioButton(it),
      srsBtn,
      h('button', { class: 'btn small', type: 'button', on: { click: () => showCorrection() } }, icon('edit'), h('span', null, 'Corriger')),
    ),
    related.length ? h('div', null,
      h('div', { class: 'section-title' }, 'Même racine'),
      h('ul', { class: 'list' }, related.map((w) => h('li', null,
        h('button', { class: 'list-item', type: 'button', on: { click: () => swap(w.ids[0]) } },
          ar(w.ar, 'ar-s'), h('span', { class: 'grow' }, h('div', { class: 'title' }, w.fr), h('div', { class: 'sub' }, w.source)))))),
    ) : null,
  );

  function rerender() { node.replaceWith(wordDetails(id, { mark })); }
  function swap(otherId) { node.replaceWith(wordDetails(otherId, { mark })); }
  function showCorrection() {
    const form = correctionForm(id, () => { mark(); form.replaceWith(wordDetails(id, { mark })); }, () => form.replaceWith(wordDetails(id, { mark })));
    node.replaceWith(form);
  }
  return node;
}

// Les notes mélangent français et arabe : on isole les segments arabes pour un affichage correct.
function noteText(note) {
  const parts = note.split(/([؀-ۿݐ-ݿࢠ-ࣿ]+(?:\s+[؀-ۿݐ-ݿࢠ-ࣿ]+)*)/u);
  return h('span', null, parts.map((p, i) => (i % 2 ? ar(p, 'ar-s') : p)));
}

function correctionForm(id, done, cancel) {
  const it = getItem(id);
  const fr = h('input', { class: 'input', value: it.fr, autocomplete: 'off' });
  const wo = h('input', { class: 'input', value: it.wo, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
  const preview = wolofalEl(toWolofal(wo.value));
  const wolofal = h('input', { class: 'input ar', dir: 'rtl', lang: 'wo-Arab', placeholder: 'Laisser vide = automatique', value: it.corrected && it.wolofal !== toWolofal(it.wo) ? it.wolofal : '' });
  wo.addEventListener('input', () => { preview.textContent = toWolofal(wo.value); });
  return h('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        saveCorrection(id, { fr: fr.value.trim(), wo: wo.value.trim(), wolofal: wolofal.value.trim() });
        toast('Correction enregistrée.');
        done();
      },
    },
  },
    h('div', { class: 'center' }, ar(it.ar, 'ar-l')),
    h('label', { class: 'field' }, h('span', null, 'Français'), fr),
    h('label', { class: 'field' }, h('span', null, 'Wolof (alphabet latin)'), wo),
    h('div', { class: 'note' }, h('div', { class: 'lbl' }, 'Wolofal généré'), preview),
    h('label', { class: 'field' }, h('span', null, 'Wolofal (facultatif, si vous l’écrivez autrement)'), wolofal),
    h('p', { class: 'small muted' }, 'Vos corrections restent sur ce téléphone. Vous pouvez les partager depuis Réglages › Mes corrections.'),
    h('div', { class: 'btn-row' },
      h('button', { class: 'btn primary', type: 'submit' }, icon('check'), 'Enregistrer'),
      it.corrected ? h('button', { class: 'btn danger', type: 'button', on: { click: () => { resetCorrection(id); toast('Traduction d’origine rétablie.'); done(); } } }, 'Rétablir l’original') : null,
      h('button', { class: 'btn ghost', type: 'button', on: { click: cancel } }, 'Annuler'),
    ),
  );
}

// ── Moteur de quiz ──
// Question QCM : { type: 'mcq', prompt: Node, options: [{ node, correct }], explain?: Node, audio? }
// Question d'ordre : { type: 'order', prompt: Node, words: [texte arabe dans l'ordre], explain?: Node }
export function quiz(questions, { onFinish, retry, backHref, backLabel = 'Terminer' } = {}) {
  const root = h('div');
  let index = 0;
  let score = 0;

  function next() {
    index++;
    if (index >= questions.length) finish();
    else show();
  }

  function show() {
    const q = questions[index];
    const top = h('div', { class: 'quiz-top' },
      progressBar(index / questions.length),
      h('span', { class: 'small muted' }, `${index + 1}/${questions.length}`));
    const body = q.type === 'order' ? orderQuestion(q) : mcqQuestion(q);
    root.replaceChildren(top, body);
  }

  function feedbackBlock(ok, q) {
    return h('div', null,
      h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, ok ? 'Bonne réponse !' : 'Pas tout à fait.', q.explain ? h('div', { class: 'fr', style: { fontWeight: 400, marginTop: '6px' } }, q.explain) : null),
      h('div', { class: 'btn-row', style: { marginTop: '12px' } },
        q.audio ? h('button', { class: 'btn', type: 'button', on: { click: () => play(q.audio) } }, icon('volume'), 'Écouter') : null,
        h('button', { class: 'btn primary', type: 'button', on: { click: next } }, 'Continuer', icon('next'))));
  }

  function mcqQuestion(q) {
    const area = h('div');
    const opts = h('div', { class: `options ${q.options.length === 4 && q.compact ? 'two' : ''}` });
    q.options.forEach((o) => {
      const b = h('button', { class: 'option', type: 'button' }, o.node);
      b.addEventListener('click', () => {
        const buttons = [...opts.children];
        buttons.forEach((x) => { x.disabled = true; });
        const ok = !!o.correct;
        if (ok) { score++; logActivity(1); }
        b.classList.add(ok ? 'correct' : 'wrong');
        buttons.forEach((x, i) => { if (q.options[i].correct) x.classList.add('correct'); });
        area.append(feedbackBlock(ok, q));
        if (q.audio && ok) play(q.audio);
      });
      opts.append(b);
    });
    area.prepend(h('div', { class: 'card big-prompt' }, q.prompt), opts);
    return area;
  }

  function orderQuestion(q) {
    const area = h('div');
    const answer = h('div', { class: 'chips answer', 'aria-label': 'Votre réponse' });
    const pool = h('div', { class: 'chips', 'aria-label': 'Mots à placer' });
    const items = shuffle(q.words.map((w, i) => ({ w, i })));
    const check = h('button', { class: 'btn primary block', type: 'button', disabled: true }, 'Vérifier');
    const chipFor = (item) => {
      const c = h('button', { class: 'chip', type: 'button' }, ar(item.w, 'ar-m'));
      c.addEventListener('click', () => {
        (c.parentElement === pool ? answer : pool).append(c);
        check.disabled = answer.children.length !== q.words.length;
      });
      c._item = item;
      return c;
    };
    items.forEach((it) => pool.append(chipFor(it)));
    check.addEventListener('click', () => {
      const order = [...answer.children].map((c) => c._item.w);
      const ok = order.every((w, i) => w === q.words[i]);
      if (ok) { score++; logActivity(1); }
      [...answer.children, ...pool.children].forEach((c) => { c.disabled = true; });
      check.remove();
      area.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('div', { class: 'lbl' }, 'Bonne réponse'), ar(q.words.join(' '), 'ar-m')), feedbackBlock(ok, q));
    });
    area.append(h('div', { class: 'card big-prompt' }, q.prompt), h('p', { class: 'small muted' }, 'Touchez les mots dans l’ordre (de droite à gauche).'), answer, pool, check);
    return area;
  }

  function finish() {
    const ratio = score / questions.length;
    onFinish?.(score, questions.length);
    root.replaceChildren(h('div', { class: 'card center' },
      h('div', { style: { color: 'var(--accent)' } }, icon('star')),
      h('h2', null, `${score} / ${questions.length}`),
      h('p', null, ratio === 1 ? 'Parfait, mâ shâʾ Allâh !' : ratio >= 0.7 ? 'Très bien ! Encore un effort.' : 'Continuez : la répétition est la clé.'),
      h('div', { class: 'btn-row', style: { marginTop: '12px' } },
        retry ? h('button', { class: 'btn', type: 'button', on: { click: retry } }, icon('repeat'), 'Recommencer') : null,
        backHref ? h('a', { class: 'btn primary', href: backHref }, backLabel) : null)));
  }

  if (!questions.length) {
    root.append(h('div', { class: 'empty' }, 'Pas assez de contenu pour ce quiz.'));
  } else show();
  return root;
}

// Construit des questions de sens à partir d'une liste d'identifiants de mots.
export function meaningQuestions(ids, pool, n = 10) {
  const items = shuffle(ids).map(getItem).filter(Boolean);
  const distinct = [];
  const seenFr = new Set();
  for (const it of items) {
    if (seenFr.has(it.fr)) continue;
    seenFr.add(it.fr);
    distinct.push(it);
  }
  const poolItems = (pool || ids).map(getItem).filter(Boolean);
  return distinct.slice(0, n).map((it, k) => {
    const others = shuffle(poolItems.filter((p) => p.fr !== it.fr && p.ar !== it.ar));
    const wrong = [];
    for (const o of others) {
      if (wrong.length === 3) break;
      if (!wrong.some((w) => w.fr === o.fr)) wrong.push(o);
    }
    const reverse = k % 3 === 2; // une question sur trois : du français vers l'arabe
    const options = shuffle([{ it, correct: true }, ...wrong.map((w) => ({ it: w, correct: false }))]);
    return {
      type: 'mcq',
      prompt: reverse
        ? h('div', null, h('div', { class: 'lbl' }, 'Quel mot signifie…'), h('h2', null, it.fr))
        : h('div', null, h('div', { class: 'lbl' }, 'Que signifie ce mot ?'), ar(it.ar, 'ar-xl')),
      options: options.map((o) => ({ node: reverse ? ar(o.it.ar, 'ar-m') : h('span', null, o.it.fr), correct: o.correct })),
      explain: h('span', null, ar(it.ar, 'ar-s'), ' = ', it.fr, it.wo ? ` • wolof : ${it.wo}` : ''),
      audio: it.audio,
    };
  });
}

// Fiche d'un mot touché dans un texte (livre) : sens connu, forme proche, ou ajout à mon dictionnaire.
export function openTextWordSheet(word, source) {
  const found = lookupWord(word);
  if (found) {
    const s = openWordSheet(found.id);
    if (!found.exact) {
      s.panel.querySelector('.sheet-head h3').textContent = 'Forme proche';
      s.panel.querySelector('.sheet-head').after(h('div', { class: 'note', style: { marginBottom: '8px' } },
        'Dans le texte : ', ar(word, 'ar-s'), '. Le mot ci-dessous a la même base (préfixe ou pronom en plus).'));
    }
    return s;
  }
  const fr = h('input', { class: 'input', placeholder: 'Sens en français', autocomplete: 'off' });
  const wo = h('input', { class: 'input', placeholder: 'Sens en wolof (facultatif)', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
  const preview = wolofalEl('');
  wo.addEventListener('input', () => { preview.textContent = toWolofal(wo.value); });
  const form = h('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!fr.value.trim()) { fr.focus(); return; }
        const id = saveUserWord(word, { fr: fr.value.trim(), wo: wo.value.trim(), source });
        addCards([id]);
        logActivity(1);
        toast('Mot ajouté à votre dictionnaire et à vos révisions.');
        closeSheet();
      },
    },
  },
    h('div', { class: 'center' }, ar(word, 'ar-xl')),
    h('div', { class: 'btn-row', style: { justifyContent: 'center' } }, h('button', { class: 'btn small', type: 'button', on: { click: () => speak(word) } }, icon('volume'), 'Écouter')),
    h('p', { class: 'muted' }, 'Ce mot n’est pas encore dans le dictionnaire de Daaraji. Cherchez son sens (enseignant, dictionnaire, traduction du passage) et ajoutez-le : il entrera dans vos révisions.'),
    h('label', { class: 'field' }, h('span', null, 'Français'), fr),
    h('label', { class: 'field' }, h('span', null, 'Wolof'), wo),
    preview,
    h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '10px' } }, icon('plus'), 'Ajouter à mon dictionnaire'));
  return sheet('Mot inconnu', form);
}
