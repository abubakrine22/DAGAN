// Voyelles, signes et règles de lecture, du plus simple au propre au Coran.
// Chaque fiche : glyphe (affiché en grand), nom, explication, exemple tiré du Coran.

export const SIGN_SECTIONS = [
  {
    id: 'base',
    title: 'Voyelles et signes de base',
    intro: 'En arabe, les voyelles courtes sont de petits signes posés sur ou sous la lettre. Dans le Coran, elles sont toujours écrites : on peut tout lire sans deviner.',
    items: [
      { glyph: 'بَ', name: 'Fatḥa', tr: 'ba', desc: 'Petit trait au-dessus de la lettre : son « a ».', ex: { ar: 'خَلَقَ', tr: 'khalaqa', fr: 'il a créé' } },
      { glyph: 'بِ', name: 'Kasra', tr: 'bi', desc: 'Petit trait sous la lettre : son « i ».', ex: { ar: 'بِسۡمِ', tr: 'bismi', fr: 'au nom de' } },
      { glyph: 'بُ', name: 'Ḍamma', tr: 'bu', desc: 'Petit wâw au-dessus : son « ou ».', ex: { ar: 'نَعۡبُدُ', tr: 'naʿbudu', fr: 'nous adorons' } },
      { glyph: 'بْ', name: 'Sukûn', tr: 'b', desc: 'Pas de voyelle : on ferme la syllabe. Dans le Coran (écriture de Médine), le sukûn a la forme d’une petite tête de khâ : ۡ', ex: { ar: 'قُلۡ', tr: 'qul', fr: 'dis' } },
      { glyph: 'بّ', name: 'Shadda', tr: 'bb', desc: 'Lettre doublée : on appuie dessus, comme les consonnes doubles du wolof (« dëgg », « bëgg »).', ex: { ar: 'رَبِّ', tr: 'rabbi', fr: 'Seigneur' } },
      { glyph: 'بً بٍ بٌ', name: 'Tanwîn', tr: 'ban, bin, bun', desc: 'Voyelle doublée : on ajoute un « n » à la fin du mot. À la pause, on ne le prononce pas (et « an » devient « â »).', ex: { ar: 'أَحَدٌ', tr: 'aḥadun', fr: 'unique' } },
      { glyph: 'بَا بِي بُو', name: 'Voyelles longues', tr: 'bâ, bî, bû', desc: 'Une voyelle suivie de ا, ي ou و sans signe se prolonge : on tient deux temps.', ex: { ar: 'ٱلرَّحِيمِ', tr: 'ar-raḥîmi', fr: 'le Très Miséricordieux' } },
      { glyph: 'أ إ ؤ ئ ء', name: 'Hamza', tr: 'ʾ', desc: 'Petit coup de glotte. Elle se pose seule ou sur un support (alif, wâw, yâ) selon les voyelles qui l’entourent.', ex: { ar: 'إِيَّاكَ', tr: 'iyyâka', fr: 'c’est Toi' } },
      { glyph: 'ة', name: 'Tâ marbûṭa', tr: 'a / at', desc: 'Marque du féminin en fin de mot : « a » à la pause, « at » quand on enchaîne.', ex: { ar: 'صَلَاة', tr: 'ṣalât', fr: 'prière' } },
    ],
  },
  {
    id: 'article',
    title: 'L’article « al- » et les lettres solaires',
    intro: 'L’article ال (« le, la ») se lit différemment selon la lettre qui suit. Il y a 14 lettres « solaires » et 14 « lunaires ».',
    items: [
      { glyph: 'ٱلنَّ', name: 'Lettre solaire', tr: 'an-n…', desc: 'Devant ت ث د ذ ر ز س ش ص ض ط ظ ل ن, le « l » ne se prononce pas : la lettre suivante est doublée (elle porte une shadda).', ex: { ar: 'ٱلنَّاسِ', tr: 'an-nâsi', fr: 'les hommes' } },
      { glyph: 'ٱلۡحَ', name: 'Lettre lunaire', tr: 'al-ḥ…', desc: 'Devant les autres lettres, le « l » se prononce : il porte un sukûn.', ex: { ar: 'ٱلۡحَمۡدُ', tr: 'al-ḥamdu', fr: 'la louange' } },
      { glyph: 'ٱ', name: 'Alif de liaison (waṣla)', tr: '—', desc: 'Alif surmonté d’un petit ṣâd : il ne se prononce pas quand on enchaîne avec le mot précédent. « بِسۡمِ ٱللَّهِ » se lit « bismi-llâhi ».', ex: { ar: 'بِسۡمِ ٱللَّهِ', tr: 'bismi-llâhi', fr: 'au nom d’Allah' } },
      { glyph: 'ٱللَّه', name: 'Le nom d’Allah', tr: 'Allâh', desc: 'Le « l » est lourd (voix grave) après « a » ou « ou » : « qul huwa-llâhu ». Il est léger après « i » : « bismi-llâhi ».', ex: { ar: 'هُوَ ٱللَّهُ', tr: 'huwa-llâhu', fr: 'Il est Allah' } },
    ],
  },
  {
    id: 'uthmani',
    title: 'Les signes propres au Coran',
    intro: 'Le Coran est écrit selon l’orthographe dite « uthmani » (celle du mushaf de Médine). Quelques petits signes y apparaissent souvent : les connaître rend la lecture beaucoup plus fluide.',
    items: [
      { glyph: 'مَٰ', name: 'Alif suscrit', tr: 'mâ', desc: 'Petit alif vertical au-dessus de la lettre : on prolonge en « â » comme si un alif était écrit.', ex: { ar: 'ٱلرَّحۡمَٰنِ', tr: 'ar-raḥmâni', fr: 'le Tout Miséricordieux' } },
      { glyph: 'هُۥ', name: 'Petit wâw', tr: 'hû', desc: 'Après le pronom « hu » (lui), un petit wâw indique qu’on prolonge en « hû ».', ex: { ar: 'لَّهُۥ', tr: 'lahû', fr: 'à Lui' } },
      { glyph: 'إِۦ', name: 'Petit yâ', tr: 'î', desc: 'Un petit yâ indique qu’on prolonge en « î ».', ex: { ar: 'إِۦلَٰفِهِمۡ', tr: 'îlâfihim', fr: 'leur pacte' } },
      { glyph: 'آ', name: 'Madda (allongement)', tr: 'â…', desc: 'La vague au-dessus d’une lettre de prolongation : on allonge davantage (4 à 6 temps), surtout avant une hamza ou une shadda.', ex: { ar: 'ٱلضَّآلِّينَ', tr: 'aḍ-ḍââllîna', fr: 'les égarés' } },
      { glyph: 'وْا', name: 'Lettre non prononcée', tr: '—', desc: 'Un petit rond (ou un petit rectangle) sur une lettre signifie qu’on l’écrit sans la prononcer.', ex: { ar: 'ءَامَنُواْ', tr: 'âmanû', fr: 'ils ont cru' } },
      { glyph: 'نۢ', name: 'Petit mîm (iqlâb)', tr: 'm', desc: 'Devant un bâ, le son « n » (nûn ou tanwîn) se transforme en « m ». Le petit mîm le rappelle.', ex: { ar: 'مِنۢ بَعۡدِ', tr: 'mim baʿdi', fr: 'après' } },
      { glyph: 'ـࣲ مِّ', name: 'Tanwîn décalé', tr: '-im m…', desc: 'Quand les deux traits du tanwîn sont décalés, le « n » se fond dans la lettre suivante ou se nasalise. Si la lettre suivante a une shadda, le « n » disparaît complètement.', ex: { ar: 'بِحِجَارَةࣲ مِّن', tr: 'biḥijâratim min', fr: 'des pierres de' } },
      { glyph: 'ۚ ۖ ۗ ۘ ۙ', name: 'Signes de pause', tr: '—', desc: 'ۘ : pause obligatoire • ۗ : pause préférable • ۚ : pause permise • ۖ : mieux vaut continuer • ۙ : ne pas s’arrêter.', ex: { ar: 'وَٱسۡتَغۡفِرۡهُۚ', tr: 'wa-staghfirh', fr: 'et demande-Lui pardon (pause permise)' } },
    ],
  },
  {
    id: 'tajwid',
    title: 'Premières règles de tajwîd',
    intro: 'Le tajwîd est l’art de bien réciter. Voici les règles qu’on rencontre dès les premières sourates.',
    items: [
      { glyph: 'نّ مّ', name: 'Ghunna (nasalisation)', tr: 'nn, mm', desc: 'Un nûn ou un mîm avec shadda se prononce en faisant vibrer le nez pendant deux temps.', ex: { ar: 'إِنَّ', tr: 'inna', fr: 'certes' } },
      { glyph: 'ق ط ب ج د', name: 'Qalqala (écho)', tr: 'q ṭ b j d', desc: 'Ces 5 lettres, quand elles portent un sukûn, font un petit rebond, comme un écho. Moyen mnémotechnique : « quṭbu jad ».', ex: { ar: 'ٱلۡفَلَقِ', tr: 'al-falaq', fr: 'l’aube (à la pause : « al-falaq » avec rebond)' } },
      { glyph: 'ـَا ـِي ـُو', name: 'Madd naturel', tr: '2 temps', desc: 'Une voyelle longue simple dure deux temps : ni plus, ni moins. C’est la base du rythme de la récitation.', ex: { ar: 'مَٰلِكِ', tr: 'mâliki', fr: 'Maître' } },
      { glyph: 'ـٓ', name: 'Madd prolongé', tr: '4-6 temps', desc: 'Avec la madda, on tient le son 4 à 6 temps. Écoutez le récitateur et imitez la longueur.', ex: { ar: 'إِنَّآ', tr: 'innââ', fr: 'certes Nous' } },
    ],
  },
];

// Syllabes pour l'exercice de lecture rapide.
export const SYLLABLE_MARKS = [
  { mark: 'َ', tr: 'a' },
  { mark: 'ِ', tr: 'i' },
  { mark: 'ُ', tr: 'u' },
  { mark: 'َا', tr: 'â' },
  { mark: 'ِي', tr: 'î' },
  { mark: 'ُو', tr: 'û' },
  { mark: 'ًا', tr: 'an' },
  { mark: 'ٍ', tr: 'in' },
  { mark: 'ٌ', tr: 'un' },
];
