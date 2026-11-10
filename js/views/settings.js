// Réglages, sauvegarde des données, corrections partagées, à propos et sources.

import { h, icon, toast, toggleSwitch } from '../ui.js';
import { getState, update, settings, exportData, importData, resetAll, isPersistent } from '../store.js';
import { RECITERS, correctionsAsText, correctionCount } from '../content.js';
import { stats } from '../srs.js';
import { speak, hasTTS } from '../audio.js';
import { refresh } from '../nav.js';

const set = (k, v) => update((s) => { s.settings[k] = v; });

function selectField(label, key, options) {
  const st = settings();
  const el = h('select', { class: 'input' }, options.map(([v, l]) => h('option', { value: String(v), selected: String(st[key]) === String(v) }, l)));
  el.addEventListener('change', () => set(key, typeof options[0][0] === 'number' ? Number(el.value) : el.value));
  return h('label', { class: 'field' }, h('span', null, label), el);
}

async function shareOrDownload(filename, text, mime = 'application/json') {
  try {
    const file = new File([text], filename, { type: mime });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: filename });
      return;
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch (err) { if (err && err.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast('Copié dans le presse-papiers.');
  } catch {
    toast('Impossible de partager depuis ce navigateur.');
  }
}

export function settingsView() {
  const st = settings();
  const s = stats();
  const nCorr = correctionCount();
  const scale = h('input', { type: 'range', min: '0.8', max: '1.6', step: '0.1', value: String(st.arScale || 1), 'aria-label': 'Taille du texte arabe' });
  const sample = h('div', { class: 'ar center', lang: 'ar', style: { fontSize: 'calc(30px * var(--ar-scale))' } }, 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ');
  scale.addEventListener('input', () => { set('arScale', Number(scale.value)); });
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files?.[0];
    if (!f) return;
    try {
      importData(await f.text());
      toast('Progression restaurée.');
      refresh();
    } catch {
      toast('Ce fichier n’est pas une sauvegarde Daaraji.');
    }
  });

  const node = h('div', null,
    !isPersistent() ? h('p', { class: 'note' }, 'Attention : ce navigateur n’autorise pas l’enregistrement. Votre progression sera perdue à la fermeture (navigation privée ?).') : null,
    h('div', { class: 'section-title' }, 'Affichage'),
    h('div', { class: 'list' },
      toggleSwitch('Translittération', st.translit, (v) => set('translit', v), 'La prononciation en lettres latines'),
      toggleSwitch('Traduction française', st.fr, (v) => set('fr', v)),
      toggleSwitch('Wolof (alphabet latin)', st.wo, (v) => set('wo', v)),
      toggleSwitch('Wolofal', st.wolofal, (v) => set('wolofal', v), 'Le wolof en écriture arabe')),
    h('div', { class: 'card' },
      h('div', { class: 'lbl' }, 'Taille du texte arabe'), scale, sample),
    selectField('Thème', 'theme', [['auto', 'Automatique (comme l’iPhone)'], ['light', 'Clair'], ['dark', 'Sombre']]),

    h('div', { class: 'section-title' }, 'Audio'),
    selectField('Récitateur', 'reciter', RECITERS.map((r) => [r.id, r.name])),
    selectField('Vitesse de lecture', 'rate', [[0.75, 'Lente (0,75×)'], [1, 'Normale'], [1.25, 'Rapide (1,25×)']]),
    selectField('Répéter chaque verset', 'repeat', [[1, '1 fois'], [2, '2 fois'], [3, '3 fois'], [5, '5 fois'], [10, '10 fois']]),
    hasTTS() ? h('button', { class: 'btn block', type: 'button', on: { click: () => speak('السَّلَامُ عَلَيْكُمْ') } }, icon('volume'), 'Tester la voix arabe de l’iPhone') : null,
    h('p', { class: 'small muted' }, 'Les récitations sont lues depuis Internet. Si la voix arabe de l’iPhone ne parle pas, ajoutez-la : Réglages › Accessibilité › Contenu énoncé › Voix › Arabe.'),

    h('div', { class: 'section-title' }, 'Objectif'),
    selectField('Activités par jour', 'dailyGoal', [[5, '5 — tranquille'], [15, '15 — régulier'], [30, '30 — motivé'], [50, '50 — intensif']]),

    h('div', { class: 'section-title' }, 'Mes corrections de traduction'),
    h('div', { class: 'card' },
      h('p', null, nCorr ? `Vous avez corrigé ${nCorr} traduction${nCorr > 1 ? 's' : ''}.` : 'Aucune correction pour l’instant. Touchez un mot, puis « Corriger » pour améliorer le français ou le wolof.'),
      nCorr ? h('div', { class: 'btn-row' },
        h('button', { class: 'btn small primary', type: 'button', on: { click: () => shareText(`Corrections Daaraji (référence | arabe | français | wolof)\n${correctionsAsText()}`) } }, icon('share'), 'Partager'),
        h('button', { class: 'btn small danger', type: 'button', on: { click: () => { if (confirm('Effacer toutes vos corrections ?')) { update((x) => { x.corrections = {}; }); refresh(); } } } }, 'Tout effacer')) : null,
      h('p', { class: 'small muted' }, 'Partagez-les (par exemple avec le développeur ou votre oustaz) pour qu’elles soient intégrées à l’application pour tous.')),

    h('div', { class: 'section-title' }, 'Mes données'),
    h('div', { class: 'card' },
      h('p', null, `${s.total} mots en révision • tout est enregistré sur ce téléphone, sans compte.`),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn small', type: 'button', on: { click: () => shareOrDownload(`daaraji-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`, exportData()) } }, icon('download'), 'Sauvegarder'),
        h('button', { class: 'btn small', type: 'button', on: { click: () => fileInput.click() } }, icon('upload'), 'Restaurer'),
        fileInput),
      h('button', { class: 'btn small danger block', type: 'button', style: { marginTop: '10px' }, on: { click: () => { if (confirm('Tout effacer ? Votre progression sera perdue.')) { resetAll(); toast('Progression effacée.'); refresh(); } } } }, 'Réinitialiser l’application')),

    h('div', { class: 'list', style: { marginTop: '18px' } },
      h('a', { class: 'list-item', href: '#/apropos' }, h('span', { style: { color: 'var(--primary)' } }, icon('info')), h('span', { class: 'grow' }, h('div', { class: 'title' }, 'À propos et sources')), icon('next', 'chev'))),
  );
  return { title: 'Réglages', node };
}

export function aboutView() {
  const src = (title, text) => h('div', { class: 'card' }, h('h3', null, title), h('p', { class: 'small' }, text));
  const node = h('div', null,
    h('div', { class: 'card center' },
      h('h2', null, 'Daaraji'),
      h('p', null, 'Votre daara de poche : apprendre à lire et à comprendre l’arabe du Coran et des textes religieux, avec le français et le wolof.'),
      h('p', { class: 'small muted' }, 'Version 2 — lecture fluide, 12 sourates mot à mot, 4 livres (40 hadiths, Al-Akhdari, Les trois fondements, Les quatre règles), 23 leçons de grammaire et de conjugaison, 200 mots de vocabulaire.')),
    h('div', { class: 'section-title' }, 'Sources'),
    src('Texte du Coran', 'Écriture uthmani du mushaf de Médine (lecture de Hafs), via QuranEnc (Encyclopédie du Noble Coran) et le paquet libre « quran-json » (licence CC BY-SA 4.0).'),
    src('Traduction française', 'Traduction du sens du Coran par Muhammad Hamidullah, révisée par le Complexe du Roi Fahd, diffusée par QuranEnc. Les gloses françaises mot à mot sont propres à Daaraji.'),
    src('Mot à mot et audio des mots', 'Découpage, translittération et enregistrements mot par mot : Quran.com.'),
    src('Les 40 hadiths', 'Texte arabe : paquet libre « nawawi-40-hadith-data » (CC BY 4.0). Traduction française, titres et vocabulaire : Daaraji.'),
    src('Al-Akhdari', 'Texte arabe vocalisé : al-Maktaba ash-Shâmila (livre n° 9548), quelques coquilles corrigées. Traduction française et vocabulaire : Daaraji.'),
    src('Les trois fondements et Les quatre règles', 'Texte arabe : édition vérifiée par Sâlih al-‘Usaymî, publiée par le réseau al-Alûka (vocalisation sans sukûn). Traduction française et vocabulaire : Daaraji.'),
    src('Récitations', 'Fichiers audio verset par verset : EveryAyah.com (Al-Husary, Al-Minshawi, Al-Afasy, Abdul-Basit).'),
    src('Wolof et wolofal', 'Les traductions wolof ont été rédigées pour Daaraji et doivent être vérifiées par un locuteur ou un enseignant : corrigez-les librement. Le wolofal est généré automatiquement selon l’orthographe harmonisée (DPLN, 1990), décrite par Richard Ishida (« Arabic (Wolofal) orthography notes »).'),
    src('Police arabe', 'Scheherazade New, de SIL Global, sous licence SIL Open Font License 1.1. Elle prend en charge les signes du Coran et les lettres du wolofal.'),
    h('p', { class: 'small muted', style: { marginTop: '14px' } }, 'Pour une récitation correcte, rien ne remplace un enseignant : utilisez Daaraji comme compagnon de votre apprentissage.'),
  );
  return { title: 'À propos', back: '#/reglages', node };
}
