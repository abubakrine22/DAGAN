// Petits utilitaires d'interface : création d'éléments, icônes, feuilles, messages.

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

// Texte arabe : toujours isolé et en RTL.
export function ar(text, cls = 'ar-m', extra = {}) {
  return h('span', { class: `ar ${cls}`, lang: 'ar', dir: 'rtl', ...extra }, text);
}

export function wolofalEl(text, cls = '') {
  return h('span', { class: `wolofal ${cls}`, lang: 'wo-Arab', dir: 'rtl' }, text);
}

// ── Icônes (tracés simples dessinés pour DAGAN) ──
const PATHS = {
  home: 'M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  read: 'M4 6V4h16v2M12 4v16M8 20h8',
  quran: 'M12 6.5C10 5 7 4.5 3 5v14c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5V20.5',
  cards: 'M7 3h12a2 2 0 0 1 2 2v12M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  settings: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  volume: 'M4 9.5h4l5-4v13l-5-4H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11',
  repeat: 'M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4',
  share: 'M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6',
  download: 'M12 3v12M7.5 10.5 12 15l4.5-4.5M5 19h14',
  upload: 'M12 15V3M7.5 7.5 12 3l4.5 4.5M5 19h14',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  flame: 'M12 3c.8 3.6 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.6 1.4-4.4 2.6-5.4.1 1.9 1 3 2 3.1-.3-2.8-.3-5.4.9-8.2z',
  info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  eye: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
  root: 'M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z',
  shuffle: 'M16 4h4v4M4 20 20 4M20 16v4h-4M14.5 14.5 20 20M4 4l5 5',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
};
const FILLED = {
  play: 'M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  stop: 'M6 6h12v12H6z',
};

export function icon(name, cls = '') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const filled = FILLED[name];
  svg.setAttribute('class', `icon ${filled ? 'filled' : ''} ${cls}`);
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', filled || PATHS[name] || '');
  svg.append(p);
  return svg;
}

export function iconBtn(name, label, onClick, cls = '') {
  return h('button', { class: `icon-btn ${cls}`, type: 'button', 'aria-label': label, title: label, on: { click: onClick } }, icon(name));
}

// ── Message temporaire ──
let toastTimer = null;
export function toast(message, { action, onAction, duration = 2600 } = {}) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  clearTimeout(toastTimer);
  const t = h('div', { class: 'toast', role: 'status' }, h('span', null, message));
  if (action) {
    t.append(h('button', { type: 'button', on: { click: () => { t.remove(); onAction?.(); } } }, action));
  }
  document.body.append(t);
  toastTimer = setTimeout(() => t.remove(), action ? Math.max(duration, 6000) : duration);
}

// ── Feuille montante (bottom sheet) ──
let openSheet = null;
export function sheet(title, content, { onClose } = {}) {
  closeSheet();
  const root = document.getElementById('overlay-root');
  const scrim = h('div', { class: 'scrim', on: { click: () => closeSheet() } });
  const panel = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title || 'Détails' },
    h('div', { class: 'sheet-grip' }),
    h('div', { class: 'sheet-head' }, h('h3', null, title || ''), iconBtn('close', 'Fermer', () => closeSheet())),
    content);
  root.append(scrim, panel);
  document.body.style.overflow = 'hidden';
  openSheet = { scrim, panel, onClose };
  return { close: closeSheet, panel, setContent: (node) => { panel.lastChild.replaceWith(node); } };
}

export function closeSheet() {
  if (!openSheet) return;
  const { scrim, panel, onClose } = openSheet;
  openSheet = null;
  scrim.remove();
  panel.remove();
  document.body.style.overflow = '';
  onClose?.();
}

export function progressBar(ratio, cls = '') {
  const pct = Math.max(0, Math.min(1, ratio || 0)) * 100;
  return h('div', { class: `progress ${cls}`, role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct)) },
    h('span', { style: { width: `${pct}%` } }));
}

export function toggleSwitch(label, checked, onChange, sub) {
  const input = h('input', { type: 'checkbox', role: 'switch', 'aria-label': label });
  input.checked = !!checked;
  input.addEventListener('change', () => onChange(input.checked));
  return h('label', { class: 'switch-row' },
    h('span', null, h('span', null, label), sub ? h('div', { class: 'small muted' }, sub) : null),
    h('span', { class: 'switch' }, input, h('span')));
}

export function arabicDigits(n) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}
