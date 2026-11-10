#!/usr/bin/env python3
"""Génère les livres de Daaraji (js/data/books/*.js) à partir de contenu/livres/ :
  - *.source.txt / nawawi-source.json : texte arabe vocalisé
  - *.fr.txt : traduction française (Daaraji)
  - structure.txt : chapitres et vocabulaire clé (français, wolof, racine)

Usage : python3 outils/construire-livres.py
"""
import json
import pathlib
import re
import sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
LIVRES = RACINE / "contenu" / "livres"
SORTIE = RACINE / "js" / "data" / "books"

META = {
    "nawawi": {
        "title": "Les quarante hadiths",
        "titleAr": "الأَرْبَعُونَ النَّوَوِيَّة",
        "author": "Imam an-Nawawî (m. 676 H / 1277)",
        "level": "Débutant",
        "desc": "Les 42 hadiths qui résument les fondements de la religion : l’intention, l’islam, la foi, le bon caractère…",
        "credit": "Texte arabe : paquet « nawawi-40-hadith-data » (CC BY 4.0). Traduction française et vocabulaire : Daaraji.",
    },
    "qawaid": {
        "title": "Les quatre règles",
        "titleAr": "القَوَاعِدُ الأَرْبَع",
        "author": "Muhammad ibn ‘Abd al-Wahhâb (m. 1206 H / 1792)",
        "level": "Débutant",
        "desc": "Un court traité sur le tawhîd et l’association, appuyé sur des versets du Coran.",
        "credit": "Texte arabe : édition vérifiée par Sâlih al-‘Usaymî, publiée sur alukah.net (vocalisation sans sukûn). Traduction française et vocabulaire : Daaraji.",
    },
    "usul": {
        "title": "Les trois fondements",
        "titleAr": "ثَلَاثَةُ الأُصُولِ وَأَدِلَّتُهَا",
        "author": "Muhammad ibn ‘Abd al-Wahhâb (m. 1206 H / 1792)",
        "level": "Intermédiaire",
        "desc": "Connaître son Seigneur, sa religion et son Prophète ﷺ, avec les preuves du Coran et de la sunna.",
        "credit": "Texte arabe : édition vérifiée par Sâlih al-‘Usaymî, publiée sur alukah.net (vocalisation sans sukûn). Traduction française et vocabulaire : Daaraji.",
    },
    "akhdari": {
        "title": "Al-Akhdari",
        "titleAr": "مُخْتَصَرُ الأَخْضَرِي",
        "author": "‘Abd ar-Rahmân al-Akhdarî (m. 983 H / 1575)",
        "level": "Intermédiaire",
        "desc": "Le précis de fiqh malikite étudié dans les daaras : purification, ablutions, prière et prosternation de l’oubli.",
        "credit": "Texte arabe : al-Maktaba ash-Shâmila (livre n° 9548). Traduction française et vocabulaire : Daaraji.",
    },
}
ORDRE = ["nawawi", "qawaid", "usul", "akhdari"]

# Coquilles relevées dans les éditions sources, corrigées ici de façon transparente.
CORRECTIONS = {
    "usul": [
        ("لِيَعبُدُوِنِ", "لِيَعبُدُونِ"), ("الذَِّي", "الَّذِي"), ("وَالذِّّينَ", "وَالَّذِينَ"),
        ("تَعَلُمُونَ", "تَعلَمُونَ"), ("الُرَّجَاءِ", "الرَّجَاءِ"), ("قَوُلُهُ", "قَولُهُ"),
        ("قَلنَا", "قُلنَا"), ("قَولُه ُتَعَالَى", "قَولُهُ تَعَالَى"), ("الإِيمِانِ", "الإِيمَانِ"),
        ("التَوَكُّلِ", "التَّوَكُّلِ"), ("وَالَّدلِيلُ", "وَالدَّلِيلُ"),
    ],
    "qawaid": [
        ("الطَّهَاَرِة", "الطَّهَارَةِ"), ("وَلِلِمُشرِكِينَ", "وَلِلمُشرِكِينَ"), ("يُقَالَ لَهَا", "يُقَالُ لَهَا"),
        ("لَم يُدخِلَهُم", "لَم يُدخِلهُم"), ("أذَنبَ", "أَذنَبَ"), ("المُثبِتَةُ", "المُثبَتَةُ"),
    ],
    "akhdari": [
        ("وَانتْهَارِ", "وَانْتِهَارِ"), ("فَحَافَظَ عَلَى", "فَحَافِظْ عَلَى"), ("وَاشْتَغِلَ", "وَاشْتَغِلْ"),
        ("تُصَلِّى", "تُصَلِّي"), ("بِطَلَتْ", "بَطَلَتْ"), ("يَشْغُلْهُ", "يَشْغَلُهُ"), ("للِصَّلَاةٍ", "لِلصَّلَاةِ"),
        ("أُنْصَتَ", "أَنْصَتَ"), ("سُبْحَانَ اللَّهَ", "سُبْحَانَ اللَّهِ"), ("وَتَذَكَّرِ بَعْدَ", "وَتَذَكَّرَ بَعْدَ"),
        ("صِلَاتِهِ", "صَلَاتِهِ"), ("لَلْمُبْتَدِأَةِ", "لِلْمُبْتَدِئَةِ"), ("مُبْتَدَأَةٌ", "مُبْتَدِئَةٌ"),
        ("نَوْمِةٍ", "نَوْمَةٍ"), ("وَنَحَوِهِ", "وَنَحْوِهِ"), ("تَمَامِ اَلنِّفَاسُ", "تَمَامِ النِّفَاسِ"),
        ("آخَرَ الْقَامَةِ", "آخِرِ الْقَامَةِ"), ("لِلْعَشَاءِ", "لِلْعِشَاءِ"), ("الْجُمْعَةِ", "الْجُمُعَةِ"),
        ("تَنَجَّسِ", "تَنَجَّسَ"), ("الطُّمَانِينَةُ", "الطُّمَأْنِينَةُ"), ("وَالْتَّسْلِيمِةُ", "وَالتَّسْلِيمَةُ"),
        ("بَالتَّسْلِيمِةِ", "بِالتَّسْلِيمَةِ"), ("وَالْتَّيَامُنُ", "وَالتَّيَامُنُ"), ("كُمِّهُ", "كُمِّهِ"),
        ("مَعْصِيَّةِ", "مَعْصِيَةِ"), ("التَّسْمِيَّةُ", "التَّسْمِيَةُ"), ("وَالْمِرْفَقَيْنَ", "وَالْمِرْفَقَيْنِ"),
        ("تُبْطُلُ", "تَبْطُلُ"),
    ],
}


def corriger(livre, texte):
    for avant, apres in CORRECTIONS.get(livre, []):
        texte = texte.replace(avant, apres)
    texte = texte.replace(" * ", " ۝ ")
    texte = re.sub(r"\{([^}]*)\}", r"﴿\1﴾", texte)
    return re.sub(r"\s+", " ", texte).strip()


def lire_lignes(fichier):
    lignes = {}
    for num, ligne in enumerate(fichier.read_text(encoding="utf-8").splitlines(), 1):
        if not ligne.strip() or ligne.startswith("#"):
            continue
        ident, _, reste = ligne.partition(" | ")
        if not reste:
            sys.exit(f"{fichier.name}:{num} : ligne mal formée")
        lignes[ident.strip()] = reste.strip()
    return lignes


def lire_structure():
    livres, livre, chap = {}, None, None
    for num, ligne in enumerate((LIVRES / "structure.txt").read_text(encoding="utf-8").splitlines(), 1):
        ligne = ligne.rstrip()
        if not ligne or (ligne.startswith("# ") and livre is None):
            continue
        if ligne.startswith("## "):
            livre = ligne[3:].strip()
            livres[livre] = []
            continue
        if ligne.startswith("# "):
            parts = [p.strip() for p in ligne[2:].split("|")]
            chap = {"range": parts[0], "title": parts[1] if len(parts) > 1 else "", "titleAr": parts[2] if len(parts) > 2 else "", "vocab": []}
            livres[livre].append(chap)
            continue
        if ligne.startswith("- "):
            parts = [p.strip() for p in ligne[2:].split("|")]
            while len(parts) < 4:
                parts.append("")
            chap["vocab"].append({"ar": parts[0], "fr": parts[1], "wo": parts[2], "root": parts[3]})
            continue
        sys.exit(f"structure.txt:{num} : ligne non reconnue : {ligne}")
    return livres


def etendre(plage, ids):
    debut, _, fin = plage.partition("-")
    fin = fin or debut
    i, j = ids.index(debut), ids.index(fin)
    return ids[i:j + 1]


def nettoyer_hadith(texte):
    texte = texte.replace("\n", " ")
    texte = re.sub(r"صلى الله عليه و ?سلم", "ﷺ", texte)
    texte = re.sub(r"[\s.،,]+$", "", texte) + "."
    texte = re.sub(r"\s+([.،,؛:])", r"\1", texte)
    # Guillemets droits -> chevrons, par paires.
    morceaux = texte.split('"')
    if len(morceaux) % 2 == 1:
        texte = "".join(m + ("«" if k % 2 == 0 else "»") if k < len(morceaux) - 1 else m for k, m in enumerate(morceaux))
    texte = re.sub(r"«\s+", "«", texte)
    texte = re.sub(r"\s+»", "»", texte)
    return re.sub(r"\s+", " ", texte).strip()


def construire_nawawi(structure):
    source = json.loads((LIVRES / "nawawi-source.json").read_text(encoding="utf-8"))["data"]
    fr = lire_lignes(LIVRES / "nawawi.fr.txt")
    vocab = {c["range"]: c["vocab"] for c in structure}
    chapitres = []
    for h in source:
        n = int(h["id"].split("_")[1])
        ident = f"N{n:02d}"
        parts = [p.strip() for p in fr[ident].split(" | ")]
        if len(parts) != 4:
            sys.exit(f"nawawi.fr.txt {ident} : 4 champs attendus, {len(parts)} trouvés")
        titre, retenir, traduction, source_fr = parts
        chapitres.append({
            "id": ident, "num": n, "title": titre, "titleAr": "", "takeaway": retenir, "source": source_fr,
            "units": [{"id": ident, "ar": nettoyer_hadith(h["arabic"]), "fr": traduction}],
            "vocab": vocab.get(ident, []),
        })
    return chapitres


def construire_texte(livre, structure):
    ar = lire_lignes(LIVRES / f"{livre}.source.txt")
    fr = lire_lignes(LIVRES / f"{livre}.fr.txt")
    ids = list(ar.keys())
    manquants = [i for i in ids if i not in fr]
    if manquants:
        sys.exit(f"{livre} : traductions manquantes {manquants}")
    unites = {}
    for i in ids:
        texte_ar = corriger(livre, ar[i])
        texte_fr = fr[i]
        if " ¶ " in texte_fr:
            phrases_ar = [s for s in re.split(r"(?<=\.)\s+", texte_ar) if s]
            phrases_fr = texte_fr.split(" ¶ ")
            if len(phrases_ar) != len(phrases_fr):
                sys.exit(f"{livre} {i} : {len(phrases_ar)} phrases arabes pour {len(phrases_fr)} françaises")
            unites[i] = [{"id": f"{i}.{k + 1}", "ar": a, "fr": f} for k, (a, f) in enumerate(zip(phrases_ar, phrases_fr))]
        else:
            unites[i] = [{"id": i, "ar": texte_ar, "fr": texte_fr}]
    chapitres = []
    vus = set()
    for k, c in enumerate(structure, 1):
        membres = etendre(c["range"], ids)
        vus.update(membres)
        chapitres.append({
            "id": f"c{k}", "num": k, "title": c["title"], "titleAr": c["titleAr"],
            "units": [u for m in membres for u in unites[m]], "vocab": c["vocab"],
        })
    oublies = [i for i in ids if i not in vus]
    if oublies:
        sys.exit(f"{livre} : paragraphes hors chapitre {oublies}")
    return chapitres


def main():
    structure = lire_structure()
    SORTIE.mkdir(parents=True, exist_ok=True)
    index = []
    for livre in ORDRE:
        chapitres = construire_nawawi(structure["nawawi"]) if livre == "nawawi" else construire_texte(livre, structure[livre])
        meta = META[livre]
        contenu = {"id": livre, **meta, "chapters": [{k: v for k, v in c.items() if k != "vocab"} for c in chapitres]}
        (SORTIE / f"{livre}.js").write_text(
            "// Fichier généré par outils/construire-livres.py — ne pas modifier à la main.\n"
            f"export const BOOK = {json.dumps(contenu, ensure_ascii=False, separators=(',', ':'))};\n",
            encoding="utf-8",
        )
        index.append({
            "id": livre, **meta,
            "chapters": [{"id": c["id"], "num": c["num"], "title": c["title"], "titleAr": c["titleAr"], "n": len(c["units"]), "vocab": c["vocab"]} for c in chapitres],
        })
        nb_mots = sum(len(c["vocab"]) for c in chapitres)
        print(f"{livre} : {len(chapitres)} chapitres, {sum(len(c['units']) for c in chapitres)} passages, {nb_mots} mots de vocabulaire")
    (SORTIE / "index.js").write_text(
        "// Fichier généré par outils/construire-livres.py — ne pas modifier à la main.\n"
        f"export const BOOKS = {json.dumps(index, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
