#!/usr/bin/env python3
"""Génère js/data/quran.js à partir de :
  - contenu/sourates-source.json : texte uthmani + traduction française (Hamidullah)
    + translittération mot à mot (extraits de quran-json et de quran.com)
  - contenu/gloses-coran.txt : gloses françaises / wolof, racines, notes

Usage : python3 outils/construire-coran.py
"""
import json
import pathlib
import re
import sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
SOURCE = RACINE / "contenu" / "sourates-source.json"
GLOSES = RACINE / "contenu" / "gloses-coran.txt"
SORTIE = RACINE / "js" / "data" / "quran.js"

TYPES = {"meccan": "mecquoise", "medinan": "médinoise"}

# Le texte source suit l'ancien encodage de la police KFGQPC, où les tanwins
# « ouverts » (échelonnés) occupent d'autres points de code. On les remplace
# par les caractères Unicode prévus pour cela, afin que toute police correcte
# (ici Scheherazade New) les affiche bien.
TANWIN_OUVERT = str.maketrans({
    "ٖ": "ࣲ",  # kasratan ouvert
    "ٗ": "ࣰ",  # fathatan ouvert
    "ٞ": "ࣱ",  # dammatan ouvert
})


def ar(texte):
    return texte.translate(TANWIN_OUVERT)


# Translittération : on applique l'assimilation des lettres solaires
# (« l-raḥmāni » -> « r-raḥmāni », « wal-ṣayfi » -> « waṣ-ṣayfi »),
# comme on les prononce réellement.
SOLAIRES = re.compile(r"l-(th|dh|sh|t|d|r|z|s|ṣ|ḍ|ṭ|ẓ|n)")


def tr(texte):
    return SOLAIRES.sub(lambda m: m.group(1) + "-" + m.group(1), texte or "")


def lire_gloses():
    gloses = {}
    for num, ligne in enumerate(GLOSES.read_text(encoding="utf-8").splitlines(), 1):
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#"):
            continue
        parts = [p.strip() for p in ligne.split("|")]
        if len(parts) < 4:
            sys.exit(f"Ligne {num} invalide : {ligne}")
        while len(parts) < 5:
            parts.append("")
        ref, fr, wo, racine, note = parts[:5]
        if ref in gloses:
            sys.exit(f"Ligne {num} : référence en double {ref}")
        gloses[ref] = {
            "fr": fr,
            "wo": wo,
            "root": "" if racine in ("", "—", "-") else racine,
            "note": note,
        }
    return gloses


def main():
    sourates = json.loads(SOURCE.read_text(encoding="utf-8"))
    gloses = lire_gloses()
    utilisees = set()
    manquantes = []
    sortie = []
    for s in sourates:
        versets = []
        for v in s["verses"]:
            mots = []
            for i, w in enumerate(v["w"], 1):
                ref = f"{s['id']}:{v['n']}:{i}"
                g = gloses.get(ref)
                if g is None:
                    manquantes.append(ref)
                    g = {"fr": w["en"], "wo": "", "root": "", "note": ""}
                utilisees.add(ref)
                mot = {"ar": ar(w["ar"]), "tr": tr(w["tr"]), "fr": g["fr"], "wo": g["wo"]}
                if g["root"]:
                    mot["root"] = g["root"]
                if g["note"]:
                    mot["note"] = g["note"]
                mots.append(mot)
            versets.append({"n": v["n"], "ar": ar(v["ar"]), "fr": v["fr"], "w": mots})
        sortie.append({
            "id": s["id"],
            "name": s["name"],
            "translit": s["translit"],
            "fr": s["fr"],
            "type": TYPES.get(s["type"], s["type"]),
            "verses": versets,
        })
    en_trop = sorted(set(gloses) - utilisees)
    if manquantes or en_trop:
        print("Gloses manquantes :", manquantes)
        print("Gloses sans mot correspondant :", en_trop)
        sys.exit(1)
    entete = (
        "// Fichier généré par outils/construire-coran.py — ne pas modifier à la main.\n"
        "// Texte uthmani et traduction française de Muhammad Hamidullah : QuranEnc\n"
        "// (via le paquet quran-json, CC BY-SA 4.0). Translittération mot à mot : quran.com.\n"
        "// Gloses wolof : Daaraji (à vérifier).\n"
    )
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(
        entete + "export const SURAHS = " + json.dumps(sortie, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    nb = sum(len(v["w"]) for s in sortie for v in s["verses"])
    print(f"OK : {len(sortie)} sourates, {nb} mots -> {SORTIE.relative_to(RACINE)}")


if __name__ == "__main__":
    main()
