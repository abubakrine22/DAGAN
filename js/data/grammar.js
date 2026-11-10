// Méthode de grammaire (nahw) et de conjugaison (sarf), progressive, illustrée par le Coran.
// Blocs : { p } paragraphe, { table: { head, rows, ar } } tableau (ar = colonnes en arabe),
// { ex: [{ ar, fr }] } exemples, { tip } à retenir.
// Quiz : { q, ar?, options, answer, explain }.

export const GRAMMAR = [
  {
    id: 'g1', kind: 'nahw', title: 'Nom, verbe et particule', titleAr: 'الاسْمُ وَالفِعْلُ وَالحَرْفُ',
    goal: 'Reconnaître les trois sortes de mots de l’arabe.',
    blocks: [
      { p: 'En arabe, tout mot est soit un nom (اسم), soit un verbe (فعل), soit une particule (حرف). Le nom désigne une chose, une personne ou une qualité ; le verbe exprime une action dans le temps ; la particule n’a de sens qu’avec d’autres mots.' },
      { table: { head: ['Sorte', 'Indices', 'Exemples'], ar: [2], rows: [
        ['Nom', 'peut prendre ال, le tanwîn (ـٌ ـٍ ـً), une préposition avant lui', 'كِتَابٌ، الرَّحْمَنُ، فِي البَيْتِ'],
        ['Verbe', 'peut prendre قَدْ, سَـ, لَمْ ; se conjugue', 'خَلَقَ، يَعْلَمُ، قُلْ'],
        ['Particule', 'ne prend ni ال ni tanwîn, ne se conjugue pas', 'مِنْ، فِي، لَا، إِنَّ، وَ'],
      ] } },
      { ex: [
        { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', fr: 'قُلْ = verbe ; هُوَ = nom (pronom) ; اللَّهُ et أَحَدٌ = noms.' },
        { ar: 'إِنَّ الإِنْسَانَ لَفِي خُسْرٍ', fr: 'إِنَّ et فِي = particules ; الإِنْسَانَ et خُسْرٍ = noms.' },
      ] },
      { tip: 'Un mot avec ال ou avec tanwîn est toujours un nom.' },
    ],
    quiz: [
      { q: 'Quelle sorte de mot est الكِتَابُ ?', options: ['Nom', 'Verbe', 'Particule'], answer: 0, explain: 'Il porte l’article ال : c’est un nom.' },
      { q: 'Quelle sorte de mot est خَلَقَ ?', options: ['Nom', 'Verbe', 'Particule'], answer: 1, explain: 'Il exprime une action passée : « il a créé ».' },
      { q: 'Quelle sorte de mot est فِي ?', options: ['Nom', 'Verbe', 'Particule'], answer: 2, explain: 'فِي (dans) est une préposition, donc une particule.' },
      { q: 'Lequel est un nom ?', options: ['رَحِيمٌ', 'يَعْلَمُ', 'لَمْ'], answer: 0, explain: 'Le tanwîn ـٌ montre que رَحِيمٌ est un nom.' },
    ],
  },
  {
    id: 'g2', kind: 'nahw', title: 'Masculin et féminin', titleAr: 'المُذَكَّرُ وَالمُؤَنَّثُ',
    goal: 'Reconnaître et former le féminin.',
    blocks: [
      { p: 'Le nom est masculin ou féminin. La marque la plus courante du féminin est le tâ’ marbûṭa (ة) à la fin du mot. Beaucoup d’adjectifs forment leur féminin en ajoutant simplement ة.' },
      { table: { head: ['Masculin', 'Féminin', 'Sens'], ar: [0, 1], rows: [
        ['مُؤْمِنٌ', 'مُؤْمِنَةٌ', 'croyant / croyante'],
        ['مُسْلِمٌ', 'مُسْلِمَةٌ', 'musulman / musulmane'],
        ['صَالِحٌ', 'صَالِحَةٌ', 'vertueux / vertueuse'],
        ['كَبِيرٌ', 'كَبِيرَةٌ', 'grand / grande'],
      ] } },
      { p: 'Certains noms sont féminins sans marque : أُمٌّ (mère), شَمْسٌ (soleil), أَرْضٌ (terre), نَارٌ (feu), نَفْسٌ (âme). Les noms terminés par ـَاءُ ou ـَى sont souvent féminins : صَحْرَاءُ (désert), دُنْيَا (ce monde).' },
      { tip: 'ة à la fin du mot = presque toujours féminin.' },
    ],
    quiz: [
      { q: 'Quel est le féminin de مُؤْمِنٌ ?', options: ['مُؤْمِنَةٌ', 'مُؤْمِنُونَ', 'مُؤْمِنَانِ'], answer: 0, explain: 'On ajoute ة : مُؤْمِنَةٌ.' },
      { q: 'Lequel de ces mots est féminin ?', options: ['صَلَاةٌ', 'كِتَابٌ', 'بَيْتٌ'], answer: 0, explain: 'صَلَاةٌ se termine par ة.' },
      { q: 'شَمْسٌ (soleil) est…', options: ['féminin, sans marque', 'masculin', 'pluriel'], answer: 0, explain: 'C’est un féminin sans ة, comme أَرْضٌ et نَارٌ.' },
    ],
  },
  {
    id: 'g3', kind: 'nahw', title: 'Défini et indéfini', titleAr: 'المَعْرِفَةُ وَالنَّكِرَةُ',
    goal: 'Distinguer « un livre » et « le livre ».',
    blocks: [
      { p: 'Un nom indéfini porte le tanwîn : كِتَابٌ = « un livre ». Pour le rendre défini, on ajoute ال et on retire le tanwîn : الكِتَابُ = « le livre ». Un nom ne peut jamais avoir à la fois ال et le tanwîn.' },
      { table: { head: ['Indéfini', 'Défini', 'Sens'], ar: [0, 1], rows: [
        ['رَسُولٌ', 'الرَّسُولُ', 'un messager / le messager'],
        ['يَوْمٌ', 'اليَوْمُ', 'un jour / le jour'],
        ['نُورٌ', 'النُّورُ', 'une lumière / la lumière'],
      ] } },
      { p: 'Sont aussi définis : les noms propres (مُحَمَّدٌ, مَكَّةُ), les pronoms (هُوَ), et un nom suivi d’un autre nom défini (annexion, voir leçon 9).' },
      { tip: 'Tanwîn = indéfini. ال = défini.' },
    ],
    quiz: [
      { q: 'Comment dit-on « le jour » ?', options: ['اليَوْمُ', 'يَوْمٌ', 'اليَوْمٌ'], answer: 0, explain: 'Avec ال et sans tanwîn.' },
      { q: 'خُسْرٍ (dans « لَفِي خُسْرٍ ») est…', options: ['indéfini', 'défini'], answer: 0, explain: 'Il porte le tanwîn ـٍ : « une perte ».' },
      { q: 'Quelle forme est impossible ?', options: ['الكِتَابٌ', 'الكِتَابُ', 'كِتَابٌ'], answer: 0, explain: 'ال et tanwîn ne vont jamais ensemble.' },
    ],
  },
  {
    id: 'g4', kind: 'nahw', title: 'Singulier, duel et pluriel', titleAr: 'المُفْرَدُ وَالمُثَنَّى وَالجَمْعُ',
    goal: 'Reconnaître le nombre d’un nom.',
    blocks: [
      { p: 'L’arabe a trois nombres : le singulier, le duel (pour deux) et le pluriel (trois et plus).' },
      { table: { head: ['Nombre', 'Terminaison', 'Exemple'], ar: [1, 2], rows: [
        ['Duel', 'ـَانِ / ـَيْنِ', 'يَدَانِ، يَدَيْنِ (deux mains)'],
        ['Pluriel masculin', 'ـُونَ / ـِينَ', 'مُؤْمِنُونَ، المُسْلِمِينَ'],
        ['Pluriel féminin', 'ـَاتٌ', 'مُؤْمِنَاتٌ، الصَّالِحَاتِ'],
      ] } },
      { p: 'Beaucoup de pluriels sont « brisés » : on change la forme intérieure du mot. Ils s’apprennent avec le singulier.' },
      { ex: [
        { ar: 'كِتَابٌ ← كُتُبٌ', fr: 'livre → livres' },
        { ar: 'رَسُولٌ ← رُسُلٌ', fr: 'messager → messagers' },
        { ar: 'قَلْبٌ ← قُلُوبٌ', fr: 'cœur → cœurs' },
        { ar: 'نَبِيٌّ ← أَنْبِيَاءُ', fr: 'prophète → prophètes' },
      ] },
      { tip: 'En rencontrant un nouveau nom, apprenez toujours son pluriel avec lui.' },
    ],
    quiz: [
      { q: 'المُؤْمِنُونَ est…', options: ['un pluriel masculin', 'un duel', 'un singulier'], answer: 0, explain: 'Terminaison ـُونَ.' },
      { q: 'يَدَا (dans تَبَّتْ يَدَا أَبِي لَهَبٍ) est…', options: ['un duel : « les deux mains »', 'un pluriel', 'un verbe'], answer: 0, explain: 'C’est le duel يَدَانِ, dont le ن tombe dans l’annexion.' },
      { q: 'Quel est le pluriel de قَلْبٌ ?', options: ['قُلُوبٌ', 'قَلْبَاتٌ', 'قَلْبُونَ'], answer: 0, explain: 'C’est un pluriel brisé : قُلُوبٌ.' },
    ],
  },
  {
    id: 'g5', kind: 'nahw', title: 'Les pronoms isolés', titleAr: 'الضَّمَائِرُ المُنْفَصِلَةُ',
    goal: 'Connaître « je, tu, il… » en arabe.',
    blocks: [
      { table: { head: ['Arabe', 'Français', 'Wolof'], ar: [0], rows: [
        ['أَنَا', 'je, moi', 'man'], ['نَحْنُ', 'nous', 'nun'],
        ['أَنْتَ', 'tu (masc.)', 'yaw'], ['أَنْتِ', 'tu (fém.)', 'yaw'],
        ['أَنْتُمْ', 'vous (masc.)', 'yeen'], ['أَنْتُنَّ', 'vous (fém.)', 'yeen'],
        ['هُوَ', 'il, lui', 'moom'], ['هِيَ', 'elle', 'moom'],
        ['هُمْ', 'ils, eux', 'ñoom'], ['هُنَّ', 'elles', 'ñoom'],
        ['أَنْتُمَا / هُمَا', 'vous deux / eux deux', 'yeen ñaar / ñoom ñaar'],
      ] } },
      { p: 'Comme en wolof, l’arabe distingue le masculin et le féminin à la 2e personne (tu, vous), ce que le français ne fait pas.' },
      { ex: [{ ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', fr: 'Dis : Il est Allah, Unique.' }, { ar: 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ', fr: 'Et moi, je ne suis pas adorateur de ce que vous avez adoré.' }] },
    ],
    quiz: [
      { q: 'Comment dit-on « nous » ?', options: ['نَحْنُ', 'هُمْ', 'أَنْتُمْ'], answer: 0, explain: 'نَحْنُ = nous (wolof : nun).' },
      { q: 'هِيَ signifie…', options: ['elle', 'il', 'tu'], answer: 0, explain: 'هِيَ = elle ; هُوَ = il.' },
      { q: 'Quel pronom s’adresse à une femme ?', options: ['أَنْتِ', 'أَنْتَ', 'هُوَ'], answer: 0, explain: 'أَنْتِ avec kasra = tu (féminin).' },
    ],
  },
  {
    id: 'g6', kind: 'nahw', title: 'Les pronoms attachés', titleAr: 'الضَّمَائِرُ المُتَّصِلَةُ',
    goal: 'Comprendre « mon, ton, son… » collés au mot.',
    blocks: [
      { p: 'Les pronoms possessifs (et compléments) se collent à la fin du mot. Ils sont partout dans le Coran : c’est l’une des clés pour comprendre.' },
      { table: { head: ['Suffixe', 'Sens', 'Exemple avec رَبّ'], ar: [0, 2], rows: [
        ['ـِي', 'mon, me', 'رَبِّي (mon Seigneur)'],
        ['ـنَا', 'notre, nous', 'رَبُّنَا (notre Seigneur)'],
        ['ـكَ / ـكِ', 'ton (m./f.)', 'رَبُّكَ (ton Seigneur)'],
        ['ـكُمْ', 'votre', 'رَبُّكُمْ (votre Seigneur)'],
        ['ـهُ', 'son (à lui)', 'رَبُّهُ (son Seigneur)'],
        ['ـهَا', 'son (à elle)', 'رَبُّهَا'],
        ['ـهُمْ', 'leur', 'رَبُّهُمْ (leur Seigneur)'],
      ] } },
      { p: 'Après un kasra ou un yâ’, ـهُ devient ـهِ et ـهُمْ devient ـهِمْ : عَلَيْهِمْ (sur eux), بِهِ (par lui).' },
      { ex: [{ ar: 'اهْدِنَا', fr: 'guide-nous (اهْدِ + نَا)' }, { ar: 'إِيَّاكَ نَعْبُدُ', fr: 'c’est Toi que nous adorons' }, { ar: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', fr: 'à vous votre religion, et à moi ma religion' }] },
    ],
    quiz: [
      { q: 'رَبُّنَا signifie…', options: ['notre Seigneur', 'mon Seigneur', 'leur Seigneur'], answer: 0, explain: 'ـنَا = notre.' },
      { q: 'Dans عَلَيْهِمْ, le suffixe ـهِمْ signifie…', options: ['eux', 'nous', 'toi'], answer: 0, explain: 'عَلَيْهِمْ = sur eux.' },
      { q: 'Comment dit-on « ton Seigneur » (à un homme) ?', options: ['رَبُّكَ', 'رَبُّهُ', 'رَبِّي'], answer: 0, explain: 'ـكَ = ton (masculin).' },
      { q: 'دِينُكُمْ signifie…', options: ['votre religion', 'leur religion', 'ma religion'], answer: 0, explain: 'ـكُمْ = votre.' },
    ],
  },
  {
    id: 'g7', kind: 'nahw', title: 'Démonstratifs et relatifs', titleAr: 'أَسْمَاءُ الإِشَارَةِ وَالأَسْمَاءُ المَوْصُولَةُ',
    goal: 'Ceci, cela, celui qui…',
    blocks: [
      { table: { head: ['Arabe', 'Sens', 'Emploi'], ar: [0], rows: [
        ['هَذَا / هَذِهِ', 'ceci, celui-ci / celle-ci', 'proche'],
        ['هَؤُلَاءِ', 'ceux-ci, celles-ci', 'proche, pluriel'],
        ['ذَلِكَ / تِلْكَ', 'cela, celui-là / celle-là', 'lointain'],
        ['أُولَئِكَ', 'ceux-là', 'lointain, pluriel'],
        ['الَّذِي / الَّتِي', 'celui qui / celle qui', 'relatif singulier'],
        ['الَّذِينَ', 'ceux qui', 'relatif pluriel'],
      ] } },
      { ex: [
        { ar: 'ذَلِكَ الكِتَابُ لَا رَيْبَ فِيهِ', fr: 'Ce Livre, nul doute en lui.' },
        { ar: 'فَلْيَعْبُدُوا رَبَّ هَذَا البَيْتِ', fr: 'Qu’ils adorent donc le Seigneur de cette Maison.' },
        { ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', fr: 'le chemin de ceux que Tu as comblés.' },
      ] },
      { tip: 'Wolof : هَذَا ≈ « lii / kii », الَّذِي ≈ « ki », الَّذِينَ ≈ « ñi ».' },
    ],
    quiz: [
      { q: 'الَّذِينَ signifie…', options: ['ceux qui', 'celui qui', 'ceci'], answer: 0, explain: 'Relatif pluriel.' },
      { q: 'هَذِهِ s’emploie pour…', options: ['un féminin proche', 'un masculin lointain', 'un pluriel'], answer: 0, explain: 'هَذِهِ = celle-ci.' },
      { q: 'أُولَئِكَ signifie…', options: ['ceux-là', 'celle-ci', 'celui qui'], answer: 0, explain: 'Démonstratif pluriel lointain.' },
    ],
  },
  {
    id: 'g8', kind: 'nahw', title: 'La phrase nominale', titleAr: 'الجُمْلَةُ الاسْمِيَّةُ',
    goal: 'Construire « Allah est Unique » sans verbe « être ».',
    blocks: [
      { p: 'La phrase nominale commence par un nom. Elle a deux parties : le sujet (مُبْتَدَأ), en général défini, et le prédicat (خَبَر), qui donne l’information. Il n’y a pas de verbe « être » au présent.' },
      { ex: [
        { ar: 'اللَّهُ أَحَدٌ', fr: 'Allah est Unique. (sujet : اللَّهُ ; prédicat : أَحَدٌ)' },
        { ar: 'الحَمْدُ لِلَّهِ', fr: 'La louange est à Allah.' },
        { ar: 'اللَّهُ الصَّمَدُ', fr: 'Allah est Celui que tous implorent.' },
        { ar: 'الدِّينُ النَّصِيحَةُ', fr: 'La religion est le bon conseil.' },
      ] },
      { p: 'Le sujet et le prédicat sont au cas nominatif, avec la ḍamma (ـُ ou ـٌ).' },
      { tip: 'Wolof et arabe se ressemblent ici : « Yàlla benn la » se construit aussi sans verbe « être » séparé.' },
    ],
    quiz: [
      { q: 'Dans اللَّهُ أَحَدٌ, le prédicat (خبر) est…', options: ['أَحَدٌ', 'اللَّهُ'], answer: 0, explain: 'أَحَدٌ donne l’information sur Allah.' },
      { q: 'Comment traduire الحَمْدُ لِلَّهِ ?', options: ['La louange est à Allah', 'Allah a loué', 'Louez Allah'], answer: 0, explain: 'Phrase nominale, sans verbe.' },
      { q: 'Quel est le cas du sujet d’une phrase nominale ?', options: ['nominatif (ـُ)', 'accusatif (ـَ)', 'génitif (ـِ)'], answer: 0, explain: 'Le مبتدأ est au nominatif.' },
    ],
  },
  {
    id: 'g9', kind: 'nahw', title: 'L’annexion', titleAr: 'الإِضَافَةُ',
    goal: 'Dire « le Seigneur des mondes », « la maison d’Allah ».',
    blocks: [
      { p: 'Pour dire « le X de Y », on place les deux noms côte à côte : رَبُّ العَالَمِينَ = « le Seigneur des mondes ». Le premier nom ne prend ni ال ni tanwîn ; le second est au génitif (ـِ).' },
      { ex: [
        { ar: 'رَبِّ العَالَمِينَ', fr: 'Seigneur des mondes' },
        { ar: 'يَوْمِ الدِّينِ', fr: 'le Jour de la Rétribution' },
        { ar: 'بَيْتُ اللَّهِ', fr: 'la Maison d’Allah' },
        { ar: 'أَصْحَابِ الفِيلِ', fr: 'les gens de l’Éléphant' },
        { ar: 'نَصْرُ اللَّهِ', fr: 'le secours d’Allah' },
      ] },
      { tip: 'C’est comme « kër Yàlla » en wolof : le possédé d’abord, le possesseur ensuite.' },
    ],
    quiz: [
      { q: 'Comment dit-on « le jour du jugement » ?', options: ['يَوْمُ الدِّينِ', 'اليَوْمُ الدِّينُ', 'يَوْمٌ دِينٌ'], answer: 0, explain: 'Premier nom sans ال, second au génitif.' },
      { q: 'Dans رَبُّ العَالَمِينَ, quel mot est au génitif ?', options: ['العَالَمِينَ', 'رَبُّ'], answer: 0, explain: 'Le second terme est au génitif (ici avec ـِينَ).' },
      { q: 'Pourquoi رَبُّ n’a-t-il pas ال ?', options: ['parce qu’il est le premier terme d’une annexion', 'parce qu’il est un verbe', 'c’est une erreur'], answer: 0, explain: 'Le premier terme est défini par le second.' },
    ],
  },
  {
    id: 'g10', kind: 'nahw', title: 'L’adjectif', titleAr: 'النَّعْتُ',
    goal: 'Dire « le chemin droit », « une parole bonne ».',
    blocks: [
      { p: 'L’adjectif se place après le nom et s’accorde avec lui en tout : genre, nombre, défini/indéfini et cas.' },
      { ex: [
        { ar: 'الصِّرَاطَ المُسْتَقِيمَ', fr: 'le chemin droit (défini + défini, accusatif)' },
        { ar: 'الكَلِمَةُ الطَّيِّبَةُ', fr: 'la bonne parole (féminin + féminin)' },
        { ar: 'نَارًا حَامِيَةً', fr: 'un feu ardent (indéfini + indéfini)' },
        { ar: 'الرَّحْمَنِ الرَّحِيمِ', fr: 'le Tout Miséricordieux, le Très Miséricordieux' },
      ] },
      { tip: 'Si le nom a ال, l’adjectif a ال. Sinon, l’adjectif n’en a pas.' },
    ],
    quiz: [
      { q: 'Comment dit-on « le chemin droit » ?', options: ['الصِّرَاطُ المُسْتَقِيمُ', 'صِرَاطُ المُسْتَقِيمِ', 'المُسْتَقِيمُ الصِّرَاطُ'], answer: 0, explain: 'Nom défini + adjectif défini, même cas.' },
      { q: 'Où se place l’adjectif en arabe ?', options: ['après le nom', 'avant le nom'], answer: 0, explain: 'Toujours après.' },
      { q: 'Quel adjectif s’accorde avec الكَلِمَةُ ?', options: ['الطَّيِّبَةُ', 'الطَّيِّبُ', 'طَيِّبَةٌ'], answer: 0, explain: 'Féminin et défini.' },
    ],
  },
  {
    id: 'g11', kind: 'nahw', title: 'Les prépositions', titleAr: 'حُرُوفُ الجَرِّ',
    goal: 'Comprendre « dans, sur, de, vers… ».',
    blocks: [
      { p: 'Après une préposition, le nom se met au génitif (ـِ ou ـٍ).' },
      { table: { head: ['Préposition', 'Sens', 'Exemple'], ar: [0, 2], rows: [
        ['مِنْ', 'de, parmi', 'مِنْ شَرِّ مَا خَلَقَ'],
        ['إِلَى', 'vers', 'إِلَى اللَّهِ'],
        ['عَنْ', 'de, au sujet de', 'عَنْ صَلَاتِهِمْ'],
        ['عَلَى', 'sur', 'عَلَى طَعَامِ المِسْكِينِ'],
        ['فِي', 'dans', 'فِي جِيدِهَا'],
        ['بِـ', 'par, avec', 'بِسْمِ اللَّهِ'],
        ['لِـ', 'pour, à', 'لِلَّهِ'],
        ['كَـ', 'comme', 'كَعَصْفٍ'],
      ] } },
      { tip: 'بِـ, لِـ et كَـ se collent au mot suivant : لِلَّهِ = لِ + اللَّهِ.' },
    ],
    quiz: [
      { q: 'Que signifie عَلَى ?', options: ['sur', 'dans', 'vers'], answer: 0, explain: 'عَلَى = sur (wolof : ci kaw).' },
      { q: 'Dans بِسْمِ اللَّهِ, la préposition est…', options: ['بِـ', 'اسْم', 'اللَّه'], answer: 0, explain: 'بِـ (par, au) + اسْمِ.' },
      { q: 'Après une préposition, le nom est au…', options: ['génitif (ـِ)', 'nominatif (ـُ)', 'accusatif (ـَ)'], answer: 0, explain: 'Toujours au génitif.' },
    ],
  },
  {
    id: 'g12', kind: 'nahw', title: 'Les trois cas', titleAr: 'الرَّفْعُ وَالنَّصْبُ وَالجَرُّ',
    goal: 'Lire la fonction d’un mot grâce à sa dernière voyelle.',
    blocks: [
      { p: 'La dernière voyelle d’un nom change selon sa fonction dans la phrase. C’est ce qu’on appelle l’i‘râb.' },
      { table: { head: ['Cas', 'Marque', 'Emploi principal', 'Exemple'], ar: [1, 3], rows: [
        ['Nominatif (رَفْع)', 'ـُ / ـٌ', 'sujet, prédicat', 'اللَّهُ'],
        ['Accusatif (نَصْب)', 'ـَ / ـً', 'complément d’objet, après إِنَّ', 'إِنَّ اللَّهَ'],
        ['Génitif (جَرّ)', 'ـِ / ـٍ', 'après préposition, 2e terme d’annexion', 'بِسْمِ اللَّهِ'],
      ] } },
      { ex: [
        { ar: 'نَصْرُ اللَّهِ', fr: 'اللَّهِ au génitif (annexion)' },
        { ar: 'قُلْ هُوَ اللَّهُ', fr: 'اللَّهُ au nominatif (prédicat)' },
        { ar: 'فِي دِينِ اللَّهِ', fr: 'دِينِ au génitif (après فِي)' },
      ] },
      { tip: 'Regardez toujours la fin du mot : elle vous dit son rôle.' },
    ],
    quiz: [
      { q: 'Dans إِنَّ اللَّهَ, اللَّهَ est au…', options: ['accusatif', 'nominatif', 'génitif'], answer: 0, explain: 'Après إِنَّ, le nom est à l’accusatif (ـَ).' },
      { q: 'Dans لِلَّهِ, اللَّهِ est au…', options: ['génitif', 'nominatif', 'accusatif'], answer: 0, explain: 'Après la préposition لِـ.' },
      { q: 'Quelle voyelle marque le nominatif ?', options: ['ـُ', 'ـَ', 'ـِ'], answer: 0, explain: 'La ḍamma.' },
    ],
  },
  {
    id: 'g13', kind: 'nahw', title: 'La phrase verbale', titleAr: 'الجُمْلَةُ الفِعْلِيَّةُ',
    goal: 'Comprendre l’ordre verbe – sujet – complément.',
    blocks: [
      { p: 'La phrase verbale commence par un verbe. L’ordre habituel est : verbe (فِعْل) + sujet (فَاعِل, au nominatif) + complément (مَفْعُول بِهِ, à l’accusatif).' },
      { ex: [
        { ar: 'خَلَقَ اللَّهُ السَّمَاوَاتِ', fr: 'Allah a créé les cieux.' },
        { ar: 'أَرْسَلَ اللَّهُ رَسُولًا', fr: 'Allah a envoyé un messager.' },
        { ar: 'جَاءَ نَصْرُ اللَّهِ', fr: 'Le secours d’Allah est venu.' },
      ] },
      { p: 'Le verbe placé avant un sujet pluriel reste souvent au singulier : قَالَ الكَافِرُونَ (les mécréants ont dit).' },
    ],
    quiz: [
      { q: 'Dans خَلَقَ اللَّهُ السَّمَاوَاتِ, le sujet est…', options: ['اللَّهُ', 'السَّمَاوَاتِ', 'خَلَقَ'], answer: 0, explain: 'اللَّهُ au nominatif est le sujet.' },
      { q: 'Le complément d’objet est au…', options: ['accusatif', 'nominatif', 'génitif'], answer: 0, explain: 'Le مفعول به est à l’accusatif.' },
      { q: 'Par quoi commence une phrase verbale ?', options: ['un verbe', 'un nom', 'une particule'], answer: 0, explain: 'Par définition.' },
    ],
  },
  {
    id: 'g14', kind: 'nahw', title: 'إِنَّ et كَانَ', titleAr: 'إِنَّ وَأَخَوَاتُهَا وَكَانَ وَأَخَوَاتُهَا',
    goal: 'Deux petits mots qui changent les cas.',
    blocks: [
      { p: 'إِنَّ (certes) et ses « sœurs » (أَنَّ، لَكِنَّ، لَعَلَّ، كَأَنَّ) se placent devant une phrase nominale : le sujet passe à l’accusatif, le prédicat reste au nominatif.' },
      { ex: [{ ar: 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ', fr: 'Certes, Allah est Pardonneur et Miséricordieux.' }, { ar: 'إِنَّ الإِنْسَانَ لَفِي خُسْرٍ', fr: 'L’homme est certes en perdition.' }] },
      { p: 'كَانَ (il était) et ses sœurs (أَصْبَحَ، لَيْسَ، صَارَ…) font l’inverse : le sujet reste au nominatif, le prédicat passe à l’accusatif.' },
      { ex: [{ ar: 'كَانَ اللَّهُ غَفُورًا رَحِيمًا', fr: 'Allah est Pardonneur et Miséricordieux.' }, { ar: 'إِنَّهُ كَانَ تَوَّابًا', fr: 'Il est certes Celui qui accueille le repentir.' }] },
      { tip: 'إِنَّ → sujet en ـَ. كَانَ → prédicat en ـَ.' },
    ],
    quiz: [
      { q: 'Après إِنَّ, le sujet est…', options: ['à l’accusatif', 'au nominatif', 'au génitif'], answer: 0, explain: 'إِنَّ اللَّهَ…' },
      { q: 'Dans كَانَ اللَّهُ عَلِيمًا, عَلِيمًا est…', options: ['le prédicat à l’accusatif', 'le sujet', 'un verbe'], answer: 0, explain: 'كَانَ met son prédicat à l’accusatif.' },
      { q: 'لَعَلَّ fait partie des sœurs de…', options: ['إِنَّ', 'كَانَ'], answer: 0, explain: 'لَعَلَّ (peut-être, afin que) est une sœur de إِنَّ.' },
    ],
  },
  {
    id: 'g15', kind: 'nahw', title: 'La négation', titleAr: 'النَّفْيُ',
    goal: 'Dire « ne… pas » au passé, au présent et au futur.',
    blocks: [
      { table: { head: ['Particule', 'Avec', 'Sens', 'Exemple'], ar: [0, 3], rows: [
        ['لَا', 'présent', 'ne… pas (maintenant)', 'لَا أَعْبُدُ'],
        ['لَمْ', 'présent apocopé (ـْ)', 'ne… pas (au passé)', 'لَمْ يَلِدْ'],
        ['لَنْ', 'présent subjonctif (ـَ)', 'ne… jamais (futur)', 'لَنْ يُبْعَثُوا'],
        ['مَا', 'passé', 'ne… pas', 'مَا أَغْنَى عَنْهُ'],
        ['لَيْسَ', 'phrase nominale', 'n’est pas', 'لَيْسَ كَمِثْلِهِ شَيْءٌ'],
        ['لَا (interdiction)', 'présent apocopé', 'ne fais pas !', 'لَا تَغْضَبْ'],
      ] } },
      { tip: 'لَمْ + présent = sens passé : لَمْ يَلِدْ = « Il n’a pas engendré ».' },
    ],
    quiz: [
      { q: 'لَمْ يَلِدْ signifie…', options: ['Il n’a pas engendré', 'Il n’engendrera pas', 'N’engendre pas !'], answer: 0, explain: 'لَمْ donne un sens passé.' },
      { q: 'Quelle particule exprime le futur négatif ?', options: ['لَنْ', 'لَمْ', 'مَا'], answer: 0, explain: 'لَنْ = ne… jamais (futur).' },
      { q: 'لَا تَغْضَبْ est…', options: ['une interdiction', 'une question', 'un futur'], answer: 0, explain: '« Ne te mets pas en colère ! »' },
    ],
  },
  {
    id: 'g16', kind: 'nahw', title: 'Questions et appel', titleAr: 'الاسْتِفْهَامُ وَالنِّدَاءُ',
    goal: 'Poser une question, s’adresser à quelqu’un.',
    blocks: [
      { table: { head: ['Mot', 'Sens', 'Wolof'], ar: [0], rows: [
        ['هَلْ / أَ', 'est-ce que ?', 'ndax ?'], ['مَنْ', 'qui ?', 'kan ?'], ['مَا / مَاذَا', 'quoi ?', 'lan ?'],
        ['كَيْفَ', 'comment ?', 'naka ?'], ['أَيْنَ', 'où ?', 'fan ?'], ['مَتَى', 'quand ?', 'kañ ?'], ['لِمَاذَا', 'pourquoi ?', 'lu tax ?'],
      ] } },
      { p: 'Pour appeler quelqu’un, on utilise يَا + le nom au nominatif sans tanwîn : يَا مُحَمَّدُ. Devant un nom avec ال, on dit يَا أَيُّهَا : يَا أَيُّهَا النَّاسُ (ô gens !).' },
      { ex: [{ ar: 'مَنْ رَبُّكَ؟', fr: 'Qui est ton Seigneur ?' }, { ar: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ', fr: 'N’as-tu pas vu comment ton Seigneur a agi ?' }, { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا', fr: 'Ô vous qui croyez !' }] },
    ],
    quiz: [
      { q: 'كَيْفَ signifie…', options: ['comment ?', 'où ?', 'qui ?'], answer: 0, explain: 'كَيْفَ = comment (wolof : naka).' },
      { q: 'مَنْ رَبُّكَ؟ signifie…', options: ['Qui est ton Seigneur ?', 'Où est ton Seigneur ?', 'Ton Seigneur est-il là ?'], answer: 0, explain: 'مَنْ = qui.' },
      { q: 'Comment appelle-t-on « ô gens ! » ?', options: ['يَا أَيُّهَا النَّاسُ', 'يَا النَّاسُ', 'أَيْنَ النَّاسُ'], answer: 0, explain: 'Devant ال, on utilise يَا أَيُّهَا.' },
    ],
  },
  // ── Conjugaison (sarf) ──
  {
    id: 's1', kind: 'sarf', title: 'Racines et schèmes', titleAr: 'الجَذْرُ وَالوَزْنُ',
    goal: 'Comprendre comment les mots naissent d’une racine.',
    blocks: [
      { p: 'Presque tous les mots arabes sont construits sur une racine de trois consonnes, qui porte une idée. On les place dans un moule (un « schème »), représenté par les lettres ف ع ل.' },
      { table: { head: ['Schème', 'Sens du moule', 'Avec ك ت ب (écrire)', 'Avec ع ب د (adorer)'], ar: [0, 2, 3], rows: [
        ['فَعَلَ', 'il a fait', 'كَتَبَ (il a écrit)', 'عَبَدَ (il a adoré)'],
        ['فَاعِل', 'celui qui fait', 'كَاتِب (écrivain)', 'عَابِد (adorateur)'],
        ['مَفْعُول', 'ce qui est fait', 'مَكْتُوب (écrit)', 'مَعْبُود (adoré)'],
        ['فِعَال / فِعَالَة', 'l’action', 'كِتَاب، كِتَابَة', 'عِبَادَة'],
      ] } },
      { tip: 'Retrouvez la racine d’un mot inconnu : vous en devinerez souvent le sens. Voir aussi « Les racines » dans Langue.' },
    ],
    quiz: [
      { q: 'Quelle est la racine de مَعْبُود ?', options: ['ع ب د', 'م ع ب', 'ب د و'], answer: 0, explain: 'On retire م et و du schème مَفْعُول.' },
      { q: 'Sur le schème فَاعِل, ع ل م donne…', options: ['عَالِم (savant)', 'مَعْلُوم', 'عِلْم'], answer: 0, explain: 'فَاعِل = celui qui fait : عَالِم.' },
      { q: 'مَكْتُوب signifie…', options: ['écrit (ce qui est écrit)', 'écrivain', 'il a écrit'], answer: 0, explain: 'Schème مَفْعُول.' },
    ],
  },
  {
    id: 's2', kind: 'sarf', title: 'Le passé', titleAr: 'الفِعْلُ المَاضِي',
    goal: 'Conjuguer un verbe au passé.',
    blocks: [
      { p: 'Le verbe se cite à la 3e personne du masculin singulier du passé : كَتَبَ = « il a écrit ». On ajoute ensuite des terminaisons pour chaque personne.' },
      { table: { head: ['Pronom', 'Terminaison', 'كَتَبَ', 'Français'], ar: [0, 1, 2], rows: [
        ['هُوَ', 'ـَ', 'كَتَبَ', 'il a écrit'], ['هِيَ', 'ـَتْ', 'كَتَبَتْ', 'elle a écrit'],
        ['هُمْ', 'ـُوا', 'كَتَبُوا', 'ils ont écrit'], ['أَنْتَ', 'ـْتَ', 'كَتَبْتَ', 'tu as écrit (m.)'],
        ['أَنْتِ', 'ـْتِ', 'كَتَبْتِ', 'tu as écrit (f.)'], ['أَنْتُمْ', 'ـْتُمْ', 'كَتَبْتُمْ', 'vous avez écrit'],
        ['أَنَا', 'ـْتُ', 'كَتَبْتُ', 'j’ai écrit'], ['نَحْنُ', 'ـْنَا', 'كَتَبْنَا', 'nous avons écrit'],
      ] } },
      { ex: [{ ar: 'أَنْعَمْتَ عَلَيْهِمْ', fr: 'Tu as comblé (ـْتَ = tu)' }, { ar: 'آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', fr: 'ils ont cru et accompli les bonnes œuvres (ـُوا = ils)' }, { ar: 'إِنَّا أَعْطَيْنَاكَ', fr: 'Nous t’avons donné (ـْنَا = nous)' }] },
      { tip: 'Entraînez-vous avec le conjugueur : tous les verbes de la liste se conjuguent automatiquement.' },
    ],
    quiz: [
      { q: 'كَتَبْنَا signifie…', options: ['nous avons écrit', 'ils ont écrit', 'j’ai écrit'], answer: 0, explain: 'ـْنَا = nous.' },
      { q: 'Comment dit-on « elle a créé » ?', options: ['خَلَقَتْ', 'خَلَقْتُ', 'خَلَقُوا'], answer: 0, explain: 'ـَتْ = elle.' },
      { q: 'عَبَدْتُمْ signifie…', options: ['vous avez adoré', 'tu as adoré', 'ils ont adoré'], answer: 0, explain: 'ـْتُمْ = vous.' },
    ],
  },
  {
    id: 's3', kind: 'sarf', title: 'Le présent', titleAr: 'الفِعْلُ المُضَارِعُ',
    goal: 'Conjuguer au présent (et futur proche).',
    blocks: [
      { p: 'Au présent, on ajoute surtout des préfixes : أَ (je), نَ (nous), تَ (tu, elle), يَ (il, ils). La voyelle du milieu dépend du verbe : يَكْتُبُ (u), يَجْلِسُ (i), يَفْتَحُ (a). Elle s’apprend avec le verbe.' },
      { table: { head: ['Pronom', 'Forme', 'كَتَبَ', 'Français'], ar: [0, 1, 2], rows: [
        ['أَنَا', 'أَـ…ـُ', 'أَكْتُبُ', 'j’écris'], ['نَحْنُ', 'نَـ…ـُ', 'نَكْتُبُ', 'nous écrivons'],
        ['أَنْتَ', 'تَـ…ـُ', 'تَكْتُبُ', 'tu écris (m.)'], ['أَنْتِ', 'تَـ…ـِينَ', 'تَكْتُبِينَ', 'tu écris (f.)'],
        ['أَنْتُمْ', 'تَـ…ـُونَ', 'تَكْتُبُونَ', 'vous écrivez'], ['هُوَ', 'يَـ…ـُ', 'يَكْتُبُ', 'il écrit'],
        ['هِيَ', 'تَـ…ـُ', 'تَكْتُبُ', 'elle écrit'], ['هُمْ', 'يَـ…ـُونَ', 'يَكْتُبُونَ', 'ils écrivent'],
      ] } },
      { ex: [{ ar: 'إِيَّاكَ نَعْبُدُ', fr: 'C’est Toi que nous adorons (نَـ = nous)' }, { ar: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', fr: 'Je n’adore pas ce que vous adorez (أَـ = je ; تَـ…ـُونَ = vous)' }] },
      { tip: 'Le futur se forme avec سَـ ou سَوْفَ : سَيَصْلَى = « il brûlera ».' },
    ],
    quiz: [
      { q: 'نَعْبُدُ signifie…', options: ['nous adorons', 'j’adore', 'ils adorent'], answer: 0, explain: 'Préfixe نَـ = nous.' },
      { q: 'Comment dit-on « ils entrent » (دَخَلَ) ?', options: ['يَدْخُلُونَ', 'تَدْخُلُونَ', 'نَدْخُلُ'], answer: 0, explain: 'يَـ…ـُونَ = ils.' },
      { q: 'سَيَعْلَمُونَ signifie…', options: ['ils sauront', 'ils savaient', 'sachez !'], answer: 0, explain: 'سَـ + présent = futur.' },
    ],
  },
  {
    id: 's4', kind: 'sarf', title: 'L’impératif', titleAr: 'فِعْلُ الأَمْرِ',
    goal: 'Donner un ordre : « Dis ! », « Lis ! », « Adorez ! ».',
    blocks: [
      { p: 'L’impératif se forme à partir du présent : on retire le préfixe et on met un sukûn à la fin. Si le mot commence alors par une consonne sans voyelle, on ajoute un alif de liaison : اُ (si la voyelle du milieu est u) ou اِ (sinon).' },
      { table: { head: ['Présent', 'Impératif', 'Sens'], ar: [0, 1], rows: [
        ['يَكْتُبُ', 'اُكْتُبْ', 'écris !'], ['يَجْلِسُ', 'اِجْلِسْ', 'assieds-toi !'], ['يَفْتَحُ', 'اِفْتَحْ', 'ouvre !'],
        ['يَعْبُدُ', 'اُعْبُدُوا', 'adorez !'], ['يَقُولُ', 'قُلْ', 'dis ! (verbe creux)'], ['يَقْرَأُ', 'اِقْرَأْ', 'lis !'],
      ] } },
      { ex: [{ ar: 'اقْرَأْ بِاسْمِ رَبِّكَ', fr: 'Lis, au nom de ton Seigneur !' }, { ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', fr: 'Prie donc pour ton Seigneur et sacrifie !' }, { ar: 'اعْبُدُوا اللَّهَ', fr: 'Adorez Allah !' }] },
    ],
    quiz: [
      { q: 'L’impératif de يَكْتُبُ est…', options: ['اُكْتُبْ', 'اِكْتِبْ', 'كْتُبْ'], answer: 0, explain: 'Voyelle u → اُ.' },
      { q: 'قُلْ signifie…', options: ['dis !', 'il a dit', 'nous disons'], answer: 0, explain: 'Impératif de قَالَ / يَقُولُ.' },
      { q: 'اعْبُدُوا s’adresse à…', options: ['plusieurs personnes', 'une femme', 'une seule personne'], answer: 0, explain: 'ـُوا = vous (pluriel).' },
    ],
  },
  {
    id: 's5', kind: 'sarf', title: 'Participes et nom d’action', titleAr: 'اسْمُ الفَاعِلِ وَاسْمُ المَفْعُولِ وَالمَصْدَرُ',
    goal: 'Passer du verbe à « celui qui fait », « ce qui est fait », « le fait de faire ».',
    blocks: [
      { table: { head: ['Verbe', 'Participe actif (فَاعِل)', 'Participe passif (مَفْعُول)', 'Nom d’action (مَصْدَر)'], ar: [0, 1, 2, 3], rows: [
        ['كَتَبَ', 'كَاتِبٌ', 'مَكْتُوبٌ', 'كِتَابَةٌ'],
        ['عَبَدَ', 'عَابِدٌ', 'مَعْبُودٌ', 'عِبَادَةٌ'],
        ['خَلَقَ', 'خَالِقٌ', 'مَخْلُوقٌ', 'خَلْقٌ'],
        ['غَضِبَ', 'غَاضِبٌ', 'مَغْضُوبٌ', 'غَضَبٌ'],
      ] } },
      { ex: [{ ar: 'غَيْرِ المَغْضُوبِ عَلَيْهِمْ', fr: 'non pas ceux qui ont encouru la colère (participe passif)' }, { ar: 'وَلَا أَنَا عَابِدٌ', fr: 'et je ne suis pas adorateur (participe actif)' }] },
      { tip: 'Le nom d’action (masdar) du verbe simple est irrégulier : apprenez-le avec le verbe.' },
    ],
    quiz: [
      { q: 'Le participe actif de خَلَقَ est…', options: ['خَالِقٌ', 'مَخْلُوقٌ', 'خَلْقٌ'], answer: 0, explain: 'Schème فَاعِل.' },
      { q: 'مَخْلُوقٌ signifie…', options: ['créé, créature', 'créateur', 'création (action)'], answer: 0, explain: 'Schème مَفْعُول.' },
      { q: 'عِبَادَةٌ est…', options: ['un nom d’action (masdar)', 'un participe', 'un verbe'], answer: 0, explain: 'L’adoration, le fait d’adorer.' },
    ],
  },
  {
    id: 's6', kind: 'sarf', title: 'Les formes dérivées', titleAr: 'الأَفْعَالُ المَزِيدَةُ',
    goal: 'Reconnaître les 9 grandes familles de verbes.',
    blocks: [
      { p: 'À partir d’une racine, on fabrique d’autres verbes en ajoutant des lettres. Chaque forme a un sens typique. Les grammairiens européens les numérotent de I à X.' },
      { table: { head: ['Forme', 'Passé', 'Présent', 'Sens typique', 'Exemple du Coran'], ar: [1, 2, 4], rows: [
        ['I', 'فَعَلَ', 'يَفْعَلُ', 'sens de base', 'عَلِمَ (savoir)'],
        ['II', 'فَعَّلَ', 'يُفَعِّلُ', 'intensif, faire faire', 'عَلَّمَ (enseigner)'],
        ['III', 'فَاعَلَ', 'يُفَاعِلُ', 'faire avec quelqu’un', 'جَاهَدَ (lutter)'],
        ['IV', 'أَفْعَلَ', 'يُفْعِلُ', 'faire faire', 'أَنْزَلَ (faire descendre)'],
        ['V', 'تَفَعَّلَ', 'يَتَفَعَّلُ', 'réfléchi de II', 'تَعَلَّمَ (apprendre)'],
        ['VI', 'تَفَاعَلَ', 'يَتَفَاعَلُ', 'réciproque', 'تَوَاصَوْا (s’enjoindre)'],
        ['VII', 'اِنْفَعَلَ', 'يَنْفَعِلُ', 'passif, subir', 'اِنْقَلَبَ (se retourner)'],
        ['VIII', 'اِفْتَعَلَ', 'يَفْتَعِلُ', 'réfléchi', 'اِجْتَنَبَ (éviter)'],
        ['X', 'اِسْتَفْعَلَ', 'يَسْتَفْعِلُ', 'demander', 'اِسْتَغْفَرَ (demander pardon)'],
      ] } },
      { tip: 'نَسْتَعِينُ (Fâtiha) = forme X de ع و ن : « nous demandons l’aide ».' },
    ],
    quiz: [
      { q: 'اِسْتَغْفَرَ est de forme…', options: ['X : demander (pardon)', 'II', 'IV'], answer: 0, explain: 'اِسْتَـ = forme X, « demander ».' },
      { q: 'عَلَّمَ (forme II de ع ل م) signifie…', options: ['enseigner', 'savoir', 'apprendre'], answer: 0, explain: 'La forme II rend « faire savoir ».' },
      { q: 'تَوَاصَوْا (sourate al-‘Asr) exprime…', options: ['une action réciproque', 'un passif', 'une demande'], answer: 0, explain: 'Forme VI : « ils se sont recommandé mutuellement ».' },
    ],
  },
  {
    id: 's7', kind: 'sarf', title: 'Les verbes faibles', titleAr: 'الفِعْلُ المُعْتَلُّ',
    goal: 'Ne pas être surpris par قَالَ, كَانَ, دَعَا, هَدَى…',
    blocks: [
      { p: 'Quand la racine contient و ou ي, le verbe change un peu de forme. Ces verbes sont très fréquents dans le Coran.' },
      { table: { head: ['Type', 'Exemple', 'Ce qui change'], ar: [1], rows: [
        ['Creux (و/ي au milieu)', 'قَالَ – يَقُولُ – قُلْ', 'le و devient ا au passé, et disparaît devant sukûn : قُلْتُ'],
        ['Défectueux (و/ي à la fin)', 'دَعَا – يَدْعُو ; هَدَى – يَهْدِي', 'la fin varie : دَعَوْتُ، هَدَيْتُ, impératif اُدْعُ، اِهْدِ'],
        ['Assimilé (و au début)', 'وَعَدَ – يَعِدُ – عِدْ', 'le و disparaît au présent'],
      ] } },
      { ex: [{ ar: 'اهْدِنَا الصِّرَاطَ المُسْتَقِيمَ', fr: 'Guide-nous (اهْدِ + نَا) dans le droit chemin.' }, { ar: 'لَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', fr: 'يَكُنْ = forme courte de يَكُونُ après لَمْ.' }] },
      { tip: 'Le conjugueur montre les tableaux complets de قَالَ, كَانَ, دَعَا, هَدَى et وَعَدَ.' },
    ],
    quiz: [
      { q: 'قُلْتُ signifie…', options: ['j’ai dit', 'dis !', 'il dit'], answer: 0, explain: 'Passé de قَالَ avec ـْتُ.' },
      { q: 'Le présent de وَعَدَ est…', options: ['يَعِدُ', 'يَوْعِدُ', 'يَوَعَدُ'], answer: 0, explain: 'Le و disparaît au présent.' },
      { q: 'اهْدِنَا contient l’impératif de…', options: ['هَدَى (guider)', 'هَدَمَ', 'دَعَا'], answer: 0, explain: 'اِهْدِ + نَا = guide-nous.' },
    ],
  },
];
