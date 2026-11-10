#!/usr/bin/env python3
"""Écrit sw.js : la liste des fichiers à garder hors connexion et un numéro de version
calculé à partir de leur contenu (chaque modification déclenche une mise à jour).

Usage : python3 outils/construire-sw.py
"""
import hashlib
import pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
FICHIERS = ["./", "index.html", "manifest.webmanifest"]
for dossier, motif in [("css", "*.css"), ("js", "**/*.js"), ("fonts", "*.woff2"), ("icons", "*.png")]:
    FICHIERS += sorted(str(p.relative_to(RACINE)) for p in (RACINE / dossier).glob(motif))

empreinte = hashlib.sha256()
for f in FICHIERS:
    if f == "./":
        continue
    empreinte.update(f.encode())
    empreinte.update((RACINE / f).read_bytes())
version = empreinte.hexdigest()[:10]

liste = ",\n".join(f"  '{f}'" for f in FICHIERS)
modele = (RACINE / "outils" / "sw-modele.js").read_text(encoding="utf-8")
sortie = modele.replace("__VERSION__", version).replace("__FICHIERS__", liste)
(RACINE / "sw.js").write_text(sortie, encoding="utf-8")
print(f"sw.js : version {version}, {len(FICHIERS)} fichiers")
