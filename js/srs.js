// Répétition espacée (inspirée de l'algorithme SM-2 d'Anki), simplifiée.
// Une carte : { e: facilité, i: intervalle en jours, r: réussites d'affilée, d: échéance (ms), l: oublis, a: ajout }

import { getState, update } from './store.js';

const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

export const GRADES = [
  { g: 0, label: 'À revoir' },
  { g: 1, label: 'Difficile' },
  { g: 2, label: 'Bien' },
  { g: 3, label: 'Facile' },
];

export function hasCard(id) { return !!getState().srs[id]; }

export function addCards(ids) {
  let added = 0;
  update((s) => {
    const now = Date.now();
    for (const id of ids) {
      if (!s.srs[id]) {
        s.srs[id] = { e: 2.5, i: 0, r: 0, d: now, l: 0, a: now };
        added++;
      }
    }
  });
  return added;
}

export function removeCard(id) {
  update((s) => { delete s.srs[id]; });
}

// Calcule le nouvel état d'une carte selon la note donnée (sans l'enregistrer).
export function schedule(card, g, now = Date.now()) {
  const c = { ...card };
  if (g === 0) {
    c.r = 0;
    c.l = (c.l || 0) + 1;
    c.e = Math.max(1.3, c.e - 0.2);
    c.i = 0;
    c.d = now + MIN;
    return c;
  }
  c.r += 1;
  if (c.r === 1) c.i = g === 3 ? 3 : 1;
  else if (c.r === 2) c.i = g === 1 ? 3 : g === 3 ? 8 : 6;
  else c.i = Math.max(c.i + 1, Math.round(c.i * c.e * (g === 1 ? 0.8 : g === 3 ? 1.3 : 1)));
  if (g === 1) c.e = Math.max(1.3, c.e - 0.15);
  if (g === 3) c.e = c.e + 0.15;
  c.d = now + c.i * DAY;
  return c;
}

export function previewLabel(card, g) {
  const next = schedule(card, g);
  if (g === 0) return '1 min';
  return next.i === 1 ? '1 jour' : `${next.i} jours`;
}

export function gradeCard(id, g) {
  update((s) => {
    const card = s.srs[id];
    if (card) s.srs[id] = schedule(card, g);
  });
}

export function dueIds(now = Date.now()) {
  const srs = getState().srs;
  return Object.keys(srs)
    .filter((id) => srs[id].d <= now)
    .sort((a, b) => srs[a].d - srs[b].d);
}

export function stats() {
  const srs = getState().srs;
  const ids = Object.keys(srs);
  const now = Date.now();
  return {
    total: ids.length,
    due: ids.filter((id) => srs[id].d <= now).length,
    known: ids.filter((id) => srs[id].i >= 7).length,
  };
}
