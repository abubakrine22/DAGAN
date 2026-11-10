// Lecture audio : récitations (fichiers en ligne) et synthèse vocale arabe de l'iPhone.

import { getState } from './store.js';
import { toast } from './ui.js';

const player = new Audio();
player.preload = 'auto';
player.setAttribute('playsinline', '');
if ('preservesPitch' in player) player.preservesPitch = true;

let session = 0;           // identifiant de la lecture en cours (pour ignorer les anciens événements)
let listeners = new Set();
let playing = false;
let pending = null;        // termine la lecture en cours quand on l'interrompt
let warnedNoVoice = false;

function setPlaying(v) {
  playing = v;
  listeners.forEach((fn) => fn(v));
}

export function onPlayingChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isPlaying() { return playing; }

function applyRate(rate) {
  player.defaultPlaybackRate = rate;
  player.playbackRate = rate;
}

// Joue la première URL qui fonctionne. Renvoie une promesse résolue à la fin de la lecture.
function playOne(urls, rate, id) {
  return new Promise((resolve, reject) => {
    let idx = 0;
    const cleanup = () => {
      player.onended = null;
      player.onerror = null;
      player.onloadedmetadata = null;
      pending = null;
    };
    pending = () => { cleanup(); resolve('stopped'); };
    const tryNext = () => {
      if (id !== session) { cleanup(); resolve('stopped'); return; }
      if (idx >= urls.length) { cleanup(); reject(new Error('audio')); return; }
      player.src = urls[idx++];
      applyRate(rate);
      player.onloadedmetadata = () => applyRate(rate);
      player.onended = () => { cleanup(); resolve('ended'); };
      player.onerror = () => tryNext();
      const p = player.play();
      if (p && p.catch) p.catch((err) => {
        if (err && err.name === 'NotAllowedError') { cleanup(); reject(err); }
        // les autres erreurs déclenchent onerror
      });
    };
    tryNext();
  });
}

export function stop() {
  session++;
  try { player.pause(); } catch { /* rien */ }
  if (pending) pending();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  setPlaying(false);
}

function audioError(err) {
  if (err && err.name === 'NotAllowedError') toast('Touchez à nouveau pour lancer l’audio.');
  else toast('Audio indisponible : vérifiez votre connexion Internet.');
}

// Joue une liste d'éléments audio à la suite.
// items : [{ urls } | { tts }], options : { onItem(i), onDone(), repeat, rate, gap }
export async function playSequence(items, { onItem, onDone, repeat = 1, rate, gap = 0 } = {}) {
  stop();
  const id = ++session;
  const r = rate || getState().settings.rate || 1;
  setPlaying(true);
  try {
    for (let i = 0; i < items.length; i++) {
      for (let k = 0; k < repeat; k++) {
        if (id !== session) return;
        onItem?.(i, k);
        const it = items[i];
        if (it.tts) await speakAsync(it.tts, r, id);
        else await playOne(it.urls, r, id);
        if (gap && id === session) await new Promise((res) => setTimeout(res, gap));
      }
    }
  } catch (err) {
    if (id === session) audioError(err);
  } finally {
    if (id === session) {
      setPlaying(false);
      onDone?.();
    }
  }
}

export function play(item, opts = {}) {
  return playSequence([item], opts);
}

// ── Synthèse vocale (voix arabe intégrée à iOS) ──
let arabicVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  arabicVoice = voices.find((v) => /^ar(-|_|$)/i.test(v.lang)) || null;
  return arabicVoice;
}
if ('speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export function hasTTS() { return 'speechSynthesis' in window; }

function speakAsync(text, rate, id) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      toast('La synthèse vocale n’est pas disponible sur cet appareil.');
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    const v = arabicVoice || pickVoice();
    if (v) u.voice = v;
    u.rate = Math.max(0.5, Math.min(1.5, 0.85 * rate));
    let done = false;
    const finish = () => { if (!done) { done = true; pending = null; resolve(); } };
    pending = finish;
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    // Sécurité : certaines versions d'iOS n'envoient pas toujours « onend ».
    setTimeout(() => { if (id === session) finish(); }, 1500 + text.length * 260);
    if (!v && !warnedNoVoice) {
      warnedNoVoice = true;
      toast('Astuce : ajoutez une voix arabe dans Réglages › Accessibilité › Contenu énoncé › Voix.');
    }
  });
}

export function speak(text) {
  return playSequence([{ tts: text }]);
}
