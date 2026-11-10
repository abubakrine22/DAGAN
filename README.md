# DAGAN — l’arabe du Coran, en français et en wolof

DAGAN est une application pour iPhone (et tout smartphone) qui aide à **lire avec fluidité** et à **comprendre l’arabe du Coran**, avec la traduction de chaque mot en **français** et en **wolof** (alphabet latin et **wolofal**).

C’est une application web installable (PWA) : pas besoin de l’App Store, elle s’ajoute à l’écran d’accueil et **fonctionne sans Internet** (seuls les enregistrements audio demandent une connexion).

## Ce que contient la version 1

| Module | Contenu |
|---|---|
| **Lecture** | Les 28 lettres (formes, prononciation, comparaisons avec le français et le wolof), voyelles et signes, lettres solaires, **signes propres à l’écriture du Coran** (uthmani), premières règles de tajwîd. Exercices : syllabes rapides, lettres qui se ressemblent, lecture de mots du Coran avec le vrai récitateur, **lecture guidée** verset par verset. |
| **Coran** | Al-Fâtiha et 11 sourates courtes (103, 105 à 114), soit 244 mots : chaque mot avec translittération, français, wolof, wolofal, racine et note de grammaire. Récitation verset par verset (Al-Husary pédagogique, Al-Minshawi, Al-Afasy…), répétition, vitesse lente, quiz par sourate (sens des mots, remettre un verset dans l’ordre). |
| **Mots** | 120 mots et expressions parmi les plus fréquents du Coran, en 12 leçons. **Révision espacée** (comme Anki) : chaque mot revient au bon moment. Explorateur de **racines** (ك ت ب → كِتَاب، كَاتِب…). |
| **Wolofal** | Conversion automatique du wolof (latin) vers le wolofal, et page d’explication des lettres et voyelles propres au wolof. |
| **Vos corrections** | Chaque traduction peut être corrigée dans l’application (bouton « Corriger »). La correction s’applique à toutes les occurrences du mot et peut être partagée. |

Votre progression (série de jours, objectif quotidien, mots en révision) reste sur le téléphone. Vous pouvez la sauvegarder et la restaurer depuis **Réglages**.

## Installer DAGAN sur l’iPhone

### 1. Mettre l’application en ligne (une seule fois)

L’application est publiée gratuitement par **GitHub Pages** :

1. Sur github.com, ouvrez le dépôt **DAGAN** puis **Settings** (Paramètres). Sur iPhone, si l’onglet n’apparaît pas, touchez **aA › Version pour ordinateur** dans Safari.
2. Dans le menu, choisissez **Pages**.
3. Sous **Build and deployment › Source**, choisissez **Deploy from a branch**.
4. Choisissez la branche `claude/arabic-learning-app-hfjs4i` et le dossier **/ (root)**, puis **Save**.
5. Après une à deux minutes, l’application est disponible à l’adresse :
   **https://abubakrine22.github.io/DAGAN/**

### 2. L’ajouter à l’écran d’accueil

1. Ouvrez cette adresse dans **Safari**.
2. Touchez le bouton **Partager** (carré avec une flèche), puis **Sur l’écran d’accueil**.
3. Ouvrez DAGAN depuis l’icône : elle fonctionne comme une vraie application, même hors connexion.

**Voix arabe :** pour entendre les lettres et les mots de vocabulaire, l’iPhone doit avoir une voix arabe. Allez dans *Réglages › Accessibilité › Contenu énoncé › Voix › Arabe*. Les récitations du Coran, elles, viennent de vrais récitateurs.

## Important : les traductions wolof

Les gloses wolof et le wolofal ont été rédigés pour DAGAN et **doivent être relus** par un locuteur ou un enseignant. Pour les améliorer :

- **dans l’application** : touchez un mot, puis « Corriger ». Partagez ensuite vos corrections depuis *Réglages › Mes corrections* ;
- **dans le dépôt** : modifiez `contenu/gloses-coran.txt` pour les sourates (une ligne par mot) ou `js/data/vocab.js` pour le vocabulaire.

Le wolofal suit l’orthographe harmonisée (DPLN, 1990) telle que décrite par Richard Ishida ([Arabic (Wolofal) orthography notes](https://r12a.github.io/scripts/arab/wo)). Il existe d’autres usages, notamment dans les écrits des confréries. Une correction de wolofal peut être saisie mot par mot dans l’application.

## Pour les développeurs

L’application n’a besoin d’aucune compilation : HTML, CSS et JavaScript (modules ES), sans dépendance.

```
index.html, css/app.css      interface
js/app.js                    navigation et démarrage
js/views/                    écrans (accueil, lecture, coran, mots, réglages)
js/data/                     contenu : alphabet, signes, vocabulaire, Coran (généré)
js/wolofal.js                conversion wolof → wolofal
js/srs.js                    révision espacée
contenu/                     sources des sourates et gloses mot à mot
outils/                      scripts de génération
```

Tester en local :

```bash
python3 -m http.server 8000   # puis ouvrir http://localhost:8000
```

Après une modification :

```bash
python3 outils/construire-coran.py   # si contenu/gloses-coran.txt a changé
python3 outils/construire-sw.py      # toujours : met à jour la liste hors connexion et la version
```

## Prochaines étapes

- Grammaire progressive (phrase nominale et verbale, pronoms attachés, formes verbales)
- Les 40 hadiths de Nawawi, mot à mot
- Module oral : dialogues du quotidien en arabe, prononciation
- D’autres sourates (Juz ʿAmma complet)
- Relecture des traductions wolof

## Sources et licences

- **Texte du Coran** (écriture uthmani, lecture de Hafs) et **traduction française de Muhammad Hamidullah** : [QuranEnc](https://quranenc.com), via le paquet [quran-json](https://github.com/risan/quran-json) (CC BY-SA 4.0).
- **Mot à mot, translittération et audio des mots** : [Quran.com](https://quran.com).
- **Récitations** : [EveryAyah.com](https://everyayah.com).
- **Police** : [Scheherazade New](https://software.sil.org/scheherazade/) de SIL Global, licence SIL Open Font License 1.1 (`fonts/LICENCE-OFL.txt`).
- Gloses françaises et wolof, contenu pédagogique et code : DAGAN.
