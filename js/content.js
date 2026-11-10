// Accès centralisé au contenu (Coran, vocabulaire) avec les corrections de l'utilisateur.

import { SURAHS } from './data/quran.js';
import { LESSONS } from './data/vocab.js';
import { getState, update } from './store.js';
import { toWolofal } from './wolofal.js';

export { SURAHS, LESSONS };

export const BISMILLAH = SURAHS[0].verses[0].ar;

export const RECITERS = [
  { id: 'Husary_Muallim_128kbps', name: 'Al-Husary — pédagogique (lent)' },
  { id: 'Husary_128kbps', name: 'Al-Husary — murattal' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Al-Minshawi — murattal' },
  { id: 'Alafasy_128kbps', name: 'Mishary Al-Afasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul-Basit — murattal' },
];

const pad = (n, l = 3) => String(n).padStart(l, '0');

export function verseAudioUrls(s, v, reciter = getState().settings.reciter) {
  const file = `${pad(s)}${pad(v)}.mp3`;
  const urls = [`https://everyayah.com/data/${reciter}/${file}`];
  if (reciter !== 'Husary_128kbps') urls.push(`https://everyayah.com/data/Husary_128kbps/${file}`);
  return urls;
}

export function wordAudioUrls(s, v, w) {
  const file = `wbw/${pad(s)}_${pad(v)}_${pad(w)}.mp3`;
  return [`https://audio.qurancdn.com/${file}`, `https://verses.quran.com/${file}`];
}

export function getSurah(id) {
  return SURAHS.find((s) => s.id === Number(id));
}

// ── Identifiants ──
// Mot du Coran : « q:sourate:verset:mot » ; mot de vocabulaire : « v:leçon:index »
export const qid = (s, v, w) => `q:${s}:${v}:${w}`;
export const vid = (lessonId, i) => `v:${lessonId}:${i}`;

// Une correction s'applique aussi aux autres occurrences du même mot
// (même écriture arabe et même wolof d'origine, sans tenir compte des majuscules).
function formKey(ar, original) {
  return `forme:${stripMarks(ar)}|${(original.wo || original.fr).toLowerCase()}`;
}

function applyCorrection(id, base) {
  const all = getState().corrections;
  const c = all[id] || all[formKey(base.ar, base.original)];
  const merged = { ...base, fr: c?.fr ?? base.fr, wo: c?.wo ?? base.wo };
  merged.corrected = !!c;
  merged.wolofal = c?.wolofal || toWolofal(merged.wo);
  return merged;
}

// Renvoie une description complète d'un mot (Coran ou vocabulaire).
export function getItem(id) {
  const parts = id.split(':');
  if (parts[0] === 'q') {
    const [s, v, w] = parts.slice(1).map(Number);
    const surah = getSurah(s);
    const verse = surah?.verses[v - 1];
    const word = verse?.w[w - 1];
    if (!word) return null;
    return applyCorrection(id, {
      id, kind: 'q', s, v, w,
      ar: word.ar, tr: word.tr, fr: word.fr, wo: word.wo,
      root: word.root || '', note: word.note || '',
      source: `${surah.translit} ${s}:${v}`,
      audio: { urls: wordAudioUrls(s, v, w) },
      original: { fr: word.fr, wo: word.wo },
    });
  }
  if (parts[0] === 'v') {
    const lesson = LESSONS.find((l) => l.id === parts[1]);
    const i = Number(parts[2]);
    const word = lesson?.words[i];
    if (!word) return null;
    return applyCorrection(id, {
      id, kind: 'v', lesson: lesson.id, i,
      ar: word.ar, tr: word.tr, fr: word.fr, wo: word.wo,
      root: word.root || '', note: word.t || '',
      source: `Leçon « ${lesson.title} »`,
      audio: { tts: word.ar },
      original: { fr: word.fr, wo: word.wo },
    });
  }
  return null;
}

export function saveCorrection(id, { fr, wo, wolofal }) {
  const item = getItem(id);
  if (!item) return;
  const fk = formKey(item.ar, item.original);
  update((s) => {
    const c = {};
    if (fr && fr !== item.original.fr) c.fr = fr;
    if (wo && wo !== item.original.wo) c.wo = wo;
    if (wolofal && wolofal !== toWolofal(c.wo ?? item.original.wo)) c.wolofal = wolofal;
    if (Object.keys(c).length) { s.corrections[id] = c; s.corrections[fk] = c; }
    else { delete s.corrections[id]; delete s.corrections[fk]; }
  });
}

export function resetCorrection(id) {
  const item = getItem(id);
  update((s) => {
    delete s.corrections[id];
    if (item) delete s.corrections[formKey(item.ar, item.original)];
  });
}

export function correctionCount() {
  return Object.keys(getState().corrections).filter((k) => !k.startsWith('forme:')).length;
}

// Corrections au format du fichier contenu/gloses-coran.txt (pour les partager).
export function correctionsAsText() {
  const lines = [];
  for (const id of Object.keys(getState().corrections)) {
    if (id.startsWith('forme:')) continue;
    const it = getItem(id);
    if (!it) continue;
    const ref = it.kind === 'q' ? `${it.s}:${it.v}:${it.w}` : `${it.lesson}:${it.i}`;
    lines.push(`${ref} | ${it.ar} | ${it.fr} | ${it.wo}${it.wolofal !== toWolofal(it.wo) ? ` | wolofal: ${it.wolofal}` : ''}`);
  }
  return lines.join('\n');
}

// ── Racines ──
let rootIndex = null;
export function roots() {
  if (rootIndex) return rootIndex;
  rootIndex = new Map();
  const add = (root, id) => {
    if (!root) return;
    if (!rootIndex.has(root)) rootIndex.set(root, []);
    rootIndex.get(root).push(id);
  };
  LESSONS.forEach((l) => l.words.forEach((w, i) => add(w.root, vid(l.id, i))));
  SURAHS.forEach((s) => s.verses.forEach((v) => v.w.forEach((w, i) => add(w.root, qid(s.id, v.n, i + 1)))));
  return rootIndex;
}

// Mots d'une racine, en regroupant les formes identiques.
export function wordsOfRoot(root) {
  const ids = roots().get(root) || [];
  const seen = new Map();
  for (const id of ids) {
    const it = getItem(id);
    const key = stripMarks(it.ar);
    if (!seen.has(key)) seen.set(key, { ...it, count: 1, ids: [id] });
    else { seen.get(key).count++; seen.get(key).ids.push(id); }
  }
  return [...seen.values()];
}

export function stripMarks(s) {
  return s
    .normalize('NFC')
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

// Nombre de lettres de base d'un mot (pour classer les mots par difficulté).
export function letterCount(s) {
  return stripMarks(s).replace(/\s/g, '').length;
}

export function allQuranWordIds() {
  const ids = [];
  SURAHS.forEach((s) => s.verses.forEach((v) => v.w.forEach((_, i) => ids.push(qid(s.id, v.n, i + 1)))));
  return ids;
}

export function surahWordIds(s) {
  const surah = getSurah(s);
  return surah.verses.flatMap((v) => v.w.map((_, i) => qid(surah.id, v.n, i + 1)));
}

export function lessonWordIds(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  return lesson.words.map((_, i) => vid(lesson.id, i));
}
