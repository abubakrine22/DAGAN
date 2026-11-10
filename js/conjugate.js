// Conjugueur des verbes réguliers (racines saines, formes I à X) et tables des verbes faibles.

import { VERBS, IRREGULAR } from './data/verbs.js';

const FA = 'َ';
const DA = 'ُ';
const KA = 'ِ';
const SK = 'ْ';
const SH = 'ّ';
const V = { a: FA, i: KA, u: DA };

// Ordre des personnes utilisé partout (passé et présent).
export const PERSONS = [
  { ar: 'أَنَا', fr: 'je', wo: 'man' },
  { ar: 'نَحْنُ', fr: 'nous', wo: 'nun' },
  { ar: 'أَنْتَ', fr: 'tu (masc.)', wo: 'yaw' },
  { ar: 'أَنْتِ', fr: 'tu (fém.)', wo: 'yaw' },
  { ar: 'أَنْتُمَا', fr: 'vous deux', wo: 'yeen ñaar', dual: true },
  { ar: 'أَنْتُمْ', fr: 'vous (masc.)', wo: 'yeen' },
  { ar: 'أَنْتُنَّ', fr: 'vous (fém.)', wo: 'yeen', rare: true },
  { ar: 'هُوَ', fr: 'il', wo: 'moom' },
  { ar: 'هِيَ', fr: 'elle', wo: 'moom' },
  { ar: 'هُمَا', fr: 'eux deux', wo: 'ñoom ñaar', dual: true },
  { ar: 'هُمَا', fr: 'elles deux', wo: 'ñoom ñaar', dual: true },
  { ar: 'هُمْ', fr: 'ils', wo: 'ñoom' },
  { ar: 'هُنَّ', fr: 'elles', wo: 'ñoom', rare: true },
];
// Personnes de l'impératif (indices dans PERSONS).
export const IMP_PERSONS = [2, 3, 4, 5, 6];

const PAST_SUFFIX = [SK + 'تُ', SK + 'نَا', SK + 'تَ', SK + 'تِ', SK + 'تُمَا', SK + 'تُمْ', SK + 'تُنَّ', FA, FA + 'تْ', FA + 'ا', FA + 'تَا', DA + 'وا', SK + 'نَ'];
const PRES_PREFIX = ['أ', 'ن', 'ت', 'ت', 'ت', 'ت', 'ت', 'ي', 'ت', 'ي', 'ت', 'ي', 'ي'];
const PRES_ENDING = [DA, DA, DA, KA + 'ينَ', FA + 'انِ', DA + 'ونَ', SK + 'نَ', DA, DA, FA + 'انِ', FA + 'انِ', DA + 'ونَ', SK + 'نَ'];
const IMP_ENDING = [SK, KA + 'ي', FA + 'ا', DA + 'وا', SK + 'نَ'];

// Assemble radical + terminaison ; deux consonnes identiques séparées par un sukûn fusionnent (shadda).
function join(stem, c3, suffix) {
  if (suffix.startsWith(SK) && suffix[1] === c3) return (stem + c3 + SH + suffix.slice(2)).normalize('NFC');
  return (stem + c3 + suffix).normalize('NFC');
}

function stems(r, form, pv, cv) {
  const [c1, c2] = r;
  switch (form) {
    case 'I': return { past: c1 + FA + c2 + V[pv], pres: c1 + SK + c2 + V[cv], pfx: FA };
    case 'II': return { past: c1 + FA + c2 + SH + FA, pres: c1 + FA + c2 + SH + KA, pfx: DA };
    case 'III': return { past: c1 + FA + 'ا' + c2 + FA, pres: c1 + FA + 'ا' + c2 + KA, pfx: DA };
    case 'IV': return { past: 'أَ' + c1 + SK + c2 + FA, pres: c1 + SK + c2 + KA, pfx: DA, impPrefix: 'أَ' };
    case 'V': return { past: 'تَ' + c1 + FA + c2 + SH + FA, pres: 'تَ' + c1 + FA + c2 + SH + FA, pfx: FA };
    case 'VI': return { past: 'تَ' + c1 + FA + 'ا' + c2 + FA, pres: 'تَ' + c1 + FA + 'ا' + c2 + FA, pfx: FA };
    case 'VII': return { past: 'اِنْ' + c1 + FA + c2 + FA, pres: 'نْ' + c1 + FA + c2 + KA, pfx: FA, impPrefix: 'اِ' };
    case 'VIII': return { past: 'اِ' + c1 + SK + 'تَ' + c2 + FA, pres: c1 + SK + 'تَ' + c2 + KA, pfx: FA, impPrefix: 'اِ' };
    case 'X': return { past: 'اِسْتَ' + c1 + SK + c2 + FA, pres: 'سْتَ' + c1 + SK + c2 + KA, pfx: FA, impPrefix: 'اِ' };
    default: throw new Error(`Forme inconnue ${form}`);
  }
}

function derivedNouns(r, form) {
  const [c1, c2, c3] = r;
  const t = {
    I: [c1 + FA + 'ا' + c2 + KA + c3, 'مَ' + c1 + SK + c2 + DA + 'و' + c3, null],
    II: ['مُ' + c1 + FA + c2 + SH + KA + c3, 'مُ' + c1 + FA + c2 + SH + FA + c3, 'تَ' + c1 + SK + c2 + KA + 'ي' + c3],
    III: ['مُ' + c1 + FA + 'ا' + c2 + KA + c3, 'مُ' + c1 + FA + 'ا' + c2 + FA + c3, 'مُ' + c1 + FA + 'ا' + c2 + FA + c3 + FA + 'ة'],
    IV: ['مُ' + c1 + SK + c2 + KA + c3, 'مُ' + c1 + SK + c2 + FA + c3, 'إِ' + c1 + SK + c2 + FA + 'ا' + c3],
    V: ['مُتَ' + c1 + FA + c2 + SH + KA + c3, 'مُتَ' + c1 + FA + c2 + SH + FA + c3, 'تَ' + c1 + FA + c2 + SH + DA + c3],
    VI: ['مُتَ' + c1 + FA + 'ا' + c2 + KA + c3, 'مُتَ' + c1 + FA + 'ا' + c2 + FA + c3, 'تَ' + c1 + FA + 'ا' + c2 + DA + c3],
    VII: ['مُنْ' + c1 + FA + c2 + KA + c3, null, 'اِنْ' + c1 + KA + c2 + FA + 'ا' + c3],
    VIII: ['مُ' + c1 + SK + 'تَ' + c2 + KA + c3, 'مُ' + c1 + SK + 'تَ' + c2 + FA + c3, 'اِ' + c1 + SK + 'تِ' + c2 + FA + 'ا' + c3],
    X: ['مُسْتَ' + c1 + SK + c2 + KA + c3, 'مُسْتَ' + c1 + SK + c2 + FA + c3, 'اِسْتِ' + c1 + SK + c2 + FA + 'ا' + c3],
  }[form];
  return t.map((x) => (x ? x.normalize('NFC') : null));
}

export function conjugate(verb) {
  if (verb.past) return { ...verb, active: null, passive: null }; // verbe faible : tables fournies
  const r = [...verb.root];
  const s = stems(r, verb.form, verb.pv, verb.cv);
  const c3 = r[2];
  const past = PAST_SUFFIX.map((suf) => join(s.past, c3, suf));
  const pres = PRES_PREFIX.map((p, k) => join(p + s.pfx + s.pres, c3, PRES_ENDING[k]));
  let impPrefix = s.impPrefix ?? '';
  if (verb.form === 'I') impPrefix = verb.cv === 'u' ? 'اُ' : 'اِ';
  const imp = IMP_ENDING.map((e) => join(impPrefix + s.pres, c3, e));
  const [active, passive, masdar] = derivedNouns(r, verb.form);
  return {
    ...verb,
    base: past[7], present: pres[7],
    past, pres, imp, active, passive: verb.intr ? null : passive,
    masdar: verb.masdar || masdar,
  };
}

export function allVerbs() {
  return [
    ...VERBS.map((v, i) => ({ ...v, id: `${v.root}-${v.form}-${i}` })),
    ...IRREGULAR.map((v) => ({ ...v, form: v.type })),
  ].map(conjugate);
}

export function verbById(id) {
  return allVerbs().find((v) => v.id === id);
}
