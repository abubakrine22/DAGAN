# Daaraji — votre daara de poche

Daaraji est une application pour iPhone (et tout smartphone) qui aide à **lire avec fluidité**, à **comprendre l’arabe du Coran et des textes religieux**, et à **commencer à parler**, avec la traduction de chaque mot en **français** et en **wolof** (alphabet latin et **wolofal**).

C’est une application web installable (PWA) : pas besoin de l’App Store, elle s’ajoute à l’écran d’accueil et **fonctionne sans Internet** (seuls les enregistrements audio des récitateurs demandent une connexion).

## Contenu (version 2)

| Onglet | Contenu |
|---|---|
| **Accueil** | Programme du jour (révisions, une leçon, un texte), série de jours, objectif quotidien, et les étapes de la méthode Daaraji. |
| **Lecture** | Les 28 lettres (formes, prononciation, repères français/wolof), voyelles et signes, lettres solaires, **signes de l’écriture du Coran**, tajwîd de base. Exercices : syllabes, lettres semblables, mots du Coran avec le récitateur, **lecture guidée** verset par verset. Page sur le **wolofal** avec convertisseur. |
| **Coran** | Al-Fâtiha et 11 sourates courtes (244 mots) en mot à mot : translittération, français, wolof, wolofal, racine, note de grammaire. Récitation verset par verset, répétition, vitesse lente, quiz. |
| **Livres** | **Les 40 hadiths** de l’imam an-Nawawî (42 hadiths), **Al-Akhdari** (fiqh malikite, en entier), **Les trois fondements** (Thalâthat al-Usûl) et **Les quatre règles** (al-Qawâ‘id al-Arba‘) : texte arabe vocalisé, traduction française phrase par phrase, vocabulaire clé en français et en wolof (307 mots), quiz. Chaque mot du texte se touche : Daaraji donne son sens, ou vous l’ajoutez à **votre dictionnaire**. |
| **Langue** | **Méthode de grammaire** (16 leçons de nahw) et **de conjugaison** (7 leçons de sarf), avec exemples du Coran et quiz. **Conjugueur** de 50 verbes du Coran (passé, présent, impératif, participes, nom d’action, formes I à X et verbes faibles) et exercices. **Vocabulaire** : 20 leçons (200 mots, dont nombres, famille, corps, temps, prière, croyance, verbes du quotidien et premières conversations). **Révision espacée**, racines, mes mots. |

Votre progression reste sur le téléphone ; vous pouvez la sauvegarder et la restaurer depuis les **Réglages** (icône en haut de l’accueil).

## Installer Daaraji sur l’iPhone

### 1. Mettre l’application en ligne (une seule fois)

L’application est publiée gratuitement par **GitHub Pages** :

1. Sur github.com, ouvrez le dépôt puis **Settings**. Sur iPhone, si l’onglet n’apparaît pas, touchez **aA › Version pour ordinateur** dans Safari.
2. Dans le menu, choisissez **Pages**.
3. Sous **Build and deployment › Source**, choisissez **Deploy from a branch**.
4. Choisissez la branche `claude/arabic-learning-app-hfjs4i` et le dossier **/ (root)**, puis **Save**.
5. Après une à deux minutes, l’application est disponible à l’adresse **https://abubakrine22.github.io/DAGAN/**.
   (Si vous renommez le dépôt en « Daaraji » dans Settings › General, l’adresse devient https://abubakrine22.github.io/Daaraji/.)

### 2. L’ajouter à l’écran d’accueil

1. Ouvrez l’adresse dans **Safari**.
2. Touchez **Partager** (carré avec une flèche), puis **Sur l’écran d’accueil**.
3. Ouvrez Daaraji depuis l’icône.

**Voix arabe :** pour entendre les lettres, le vocabulaire et les textes des livres, ajoutez une voix arabe dans *Réglages › Accessibilité › Contenu énoncé › Voix › Arabe*.

## La méthode

1. **Lire** : lettres, signes du Coran, lecture guidée.
2. **Comprendre le Coran** : sourates courtes mot à mot.
3. **Vocabulaire** : 10 mots à la fois, révisés au bon moment.
4. **Grammaire et conjugaison** : une leçon courte + un quiz, une ou deux par semaine.
5. **Textes** : un hadith ou un passage par jour ; toucher les mots inconnus ; réviser le vocabulaire du chapitre.

## Important : relecture des traductions

Les traductions françaises des livres, les gloses wolof et le wolofal ont été rédigés pour Daaraji et **doivent être relus** par un enseignant ou un locuteur. Pour les améliorer :

- **dans l’application** : touchez un mot, puis « Corriger » ; partagez vos corrections depuis *Réglages › Mes corrections* ;
- **dans le dépôt** : `contenu/gloses-coran.txt` (sourates), `contenu/livres/*.fr.txt` (traductions des livres), `contenu/livres/structure.txt` (chapitres et vocabulaire des livres), `js/data/vocab.js` (leçons de vocabulaire).

Le wolofal suit l’orthographe harmonisée (DPLN, 1990) décrite par Richard Ishida ([Arabic (Wolofal) orthography notes](https://r12a.github.io/scripts/arab/wo)).

## Pour les développeurs

Aucune compilation : HTML, CSS et JavaScript (modules ES), sans dépendance.

```
index.html, css/app.css      interface
js/app.js                    navigation et démarrage
js/views/                    écrans (accueil, lecture, coran, livres, langue, méthode, réglages)
js/data/                     contenu : alphabet, signes, vocabulaire, grammaire, verbes, Coran et livres (générés)
js/conjugate.js              conjugueur
js/wolofal.js                conversion wolof → wolofal
js/srs.js                    révision espacée
contenu/                     sources : sourates, gloses, livres (arabe, traduction, structure)
outils/                      scripts de génération
```

```bash
python3 -m http.server 8000          # tester en local : http://localhost:8000
python3 outils/construire-coran.py   # après une modification de contenu/gloses-coran.txt
python3 outils/construire-livres.py  # après une modification de contenu/livres/
python3 outils/construire-sw.py      # toujours en dernier : liste hors connexion et version
```

## Prochaines étapes

- Module oral : dialogues en arabe, écoute et prononciation
- D’autres sourates (Juz ‘Amma complet), d’autres textes (Ajurrumiyya, Risâla…)
- Relecture des traductions françaises et wolof

## Sources et licences

- **Coran** (écriture uthmani, lecture de Hafs) et traduction française de **Muhammad Hamidullah** : [QuranEnc](https://quranenc.com), via [quran-json](https://github.com/risan/quran-json) (CC BY-SA 4.0).
- **Mot à mot, translittération et audio des mots** : [Quran.com](https://quran.com). **Récitations** : [EveryAyah.com](https://everyayah.com).
- **40 hadiths** (texte arabe) : paquet « nawawi-40-hadith-data » (CC BY 4.0).
- **Al-Akhdari** (texte arabe vocalisé) : [al-Maktaba ash-Shâmila](https://shamela.ws/book/9548).
- **Les trois fondements** et **Les quatre règles** (édition de Sâlih al-‘Usaymî) : [al-Alûka](https://www.alukah.net/sharia/0/68158/).
- Quelques coquilles des éditions sources sont corrigées dans `outils/construire-livres.py` (liste visible).
- **Police** : [Scheherazade New](https://software.sil.org/scheherazade/) de SIL Global, licence SIL Open Font License 1.1.
- Traductions françaises des livres, gloses wolof, contenu pédagogique et code : Daaraji.
