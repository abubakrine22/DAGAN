// Sauvegarde locale de la progression (sur le téléphone uniquement).

const KEY = 'dagan:v1';

export const DEFAULT_SETTINGS = {
  translit: true,      // afficher la translittération
  fr: true,            // traduction française
  wo: true,            // wolof en alphabet latin
  wolofal: true,       // wolof en écriture arabe
  arScale: 1,          // taille du texte arabe
  theme: 'auto',       // auto | light | dark
  reciter: 'Husary_Muallim_128kbps',
  rate: 1,             // vitesse de lecture audio
  repeat: 1,           // répétitions de chaque verset
  dailyGoal: 15,       // activités par jour
  quranMode: 'verse',  // verse | wbw
  cardDir: 'ar-fr',    // sens des cartes de révision : ar-fr | fr-ar | mix
};

function fresh() {
  return {
    v: 1,
    settings: { ...DEFAULT_SETTINGS },
    srs: {},
    corrections: {},
    progress: { surahs: {}, fluent: {}, lettersSeen: {}, quizzes: {}, lastSurah: null },
    activity: {},
    streak: { last: null, count: 0 },
    hints: {},
  };
}

let memoryOnly = false;
let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    return migrate(JSON.parse(raw));
  } catch {
    memoryOnly = true;
    return fresh();
  }
}

function migrate(s) {
  const base = fresh();
  return {
    ...base,
    ...s,
    settings: { ...base.settings, ...(s.settings || {}) },
    progress: { ...base.progress, ...(s.progress || {}) },
    streak: { ...base.streak, ...(s.streak || {}) },
  };
}

function save() {
  if (memoryOnly) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    memoryOnly = true;
  }
}

export function isPersistent() { return !memoryOnly; }

export function getState() { return state; }
export function settings() { return state.settings; }

export function update(fn) {
  fn(state);
  save();
  listeners.forEach((l) => l(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function today(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return today(d);
}

// Compte une activité (carte révisée, exercice réussi…) pour l'objectif du jour et la série.
export function logActivity(n = 1) {
  update((s) => {
    const t = today();
    s.activity[t] = (s.activity[t] || 0) + n;
    if (s.streak.last !== t) {
      s.streak.count = s.streak.last === yesterday() ? s.streak.count + 1 : 1;
      s.streak.last = t;
    }
  });
}

export function todayCount() { return state.activity[today()] || 0; }

export function currentStreak() {
  const { last, count } = state.streak;
  if (last === today() || last === yesterday()) return count;
  return 0;
}

export function exportData() {
  return JSON.stringify({ app: 'DAGAN', exportedAt: new Date().toISOString(), data: state }, null, 1);
}

export function importData(text) {
  const parsed = JSON.parse(text);
  const data = parsed && parsed.app === 'DAGAN' ? parsed.data : parsed;
  if (!data || typeof data !== 'object' || !data.settings) throw new Error('Fichier non reconnu');
  state = migrate(data);
  save();
  listeners.forEach((l) => l(state));
}

export function resetAll() {
  state = fresh();
  save();
  listeners.forEach((l) => l(state));
}
