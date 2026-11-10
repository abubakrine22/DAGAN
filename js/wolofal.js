// Conversion du wolof en alphabet latin (orthographe CLAD) vers le wolofal
// (wolof en écriture arabe), selon l'orthographe moderne harmonisée par la DPLN
// et décrite par Richard Ishida (« Arabic (Wolofal) orthography notes »).
//
// Règles principales :
//  - toutes les voyelles sont écrites (signes diacritiques) ;
//  - voyelle en début de mot : portée par un alif (ا), sauf « aa » qui s'écrit آ ;
//  - deux voyelles qui se suivent dans un mot : la seconde est portée par ع ;
//  - consonne sans voyelle : sukûn (ْ) ; consonne double : shadda (ّ) ;
//  - consonnes prénasalisées (mb, nd, nj, ng…) : la nasale ne porte aucun signe.

const CONSONANTS = {
  b: 'ب', p: 'ݒ', t: 'ت', d: 'د', c: 'ݖ', j: 'ج', k: 'ک', g: 'گ', q: 'ق',
  f: 'ف', s: 'س', x: 'خ', h: 'ه', m: 'م', n: 'ن', 'ñ': 'ݧ', 'ŋ': 'ݝ',
  w: 'و', r: 'ر', l: 'ل', y: 'ي',
  // lettres d'emprunt, rares
  z: 'ز', v: 'ڤ',
};

const SUKUN = 'ْ';
const SHADDA = 'ّ';

// Voyelles : [signe, lettre de prolongation pour la voyelle longue]
const VOWELS = {
  a: ['َ', 'ا'],        // fatha
  'à': ['ࣵ', 'ا'],      // fatha surmontée d'un point (devant consonne double ou prénasalisée)
  i: ['ِ', 'ي'],        // kasra
  u: ['ُ', 'و'],        // damma
  'é': ['ࣺ', 'ي'],      // pointe de flèche dessous (é = [e])
  e: ['ࣹ', 'ي'],        // pointe de flèche dessous, autre sens (e = [ɛ])
  'ó': ['ࣸ', 'و'],      // pointe de flèche dessus (ó = [o])
  o: ['ࣷ', 'و'],        // pointe de flèche dessus, autre sens (o = [ɔ])
  'ë': ['ࣴ', null],     // fatha avec anneau (ë = [ə]) ; long : ࣴعࣴ
};

// Voyelles longues telles qu'on les écrit en alphabet latin.
const LONG_VOWELS = { aa: 'a', ee: 'e', 'ée': 'é', 'éé': 'é', ii: 'i', oo: 'o', 'óo': 'ó', 'óó': 'ó', uu: 'u', 'ëë': 'ë', 'ëe': 'ë' };

const PRENASAL = new Set(['mb', 'mp', 'nd', 'nc', 'nj', 'nk', 'ng', 'nq']);

function tokenizeWord(word) {
  // Découpe un mot en unités : {type:'C', l, gem, prenasal} ou {type:'V', v, long}
  const units = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2);
    const ch = word[i];
    if (LONG_VOWELS[two]) {
      units.push({ type: 'V', v: LONG_VOWELS[two], long: true });
      i += 2;
      continue;
    }
    if (VOWELS[ch]) {
      units.push({ type: 'V', v: ch, long: false });
      i += 1;
      continue;
    }
    if (CONSONANTS[ch]) {
      if (word[i + 1] === ch) {
        units.push({ type: 'C', l: ch, gem: true });
        i += 2;
        continue;
      }
      if (PRENASAL.has(two)) {
        units.push({ type: 'C', l: ch, prenasal: true });
        i += 1;
        continue;
      }
      units.push({ type: 'C', l: ch });
      i += 1;
      continue;
    }
    // caractère inconnu : on le garde tel quel
    units.push({ type: 'X', s: ch });
    i += 1;
  }
  return units;
}

function vowelString(unit) {
  const [mark, lengthener] = VOWELS[unit.v];
  if (!unit.long) return mark;
  if (unit.v === 'ë') return mark + 'ع' + mark;
  return mark + lengthener;
}

function convertWord(word) {
  const units = tokenizeWord(word);
  let out = '';
  for (let k = 0; k < units.length; k++) {
    const u = units[k];
    const next = units[k + 1];
    if (u.type === 'X') { out += u.s; continue; }
    if (u.type === 'C') {
      out += CONSONANTS[u.l];
      if (u.prenasal) continue; // la nasale d'une prénasalisée ne porte rien
      if (u.gem) out += SHADDA;
      if (next && next.type === 'V') {
        out += vowelString(next);
        k += 1;
      } else if (!u.gem) {
        out += SUKUN;
      }
      continue;
    }
    // Voyelle non précédée d'une consonne
    const prev = units[k - 1];
    if (!prev || prev.type === 'X') {
      if (u.v === 'a' && u.long) { out += 'آ'; continue; }
      out += 'ا' + vowelString(u);
    } else {
      out += 'ع' + vowelString(u);
    }
  }
  return out;
}

// Convertit un texte wolof (alphabet latin) en wolofal.
export function toWolofal(text) {
  if (!text) return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/’|'/g, '')
    .split(/([^a-zàéëóñŋ]+)/u)
    .map((part) => (/^[a-zàéëóñŋ]+$/u.test(part) ? convertWord(part) : part.replace(/\?/g, '؟').replace(/,/g, '،')))
    .join('')
    .normalize('NFC');
}
