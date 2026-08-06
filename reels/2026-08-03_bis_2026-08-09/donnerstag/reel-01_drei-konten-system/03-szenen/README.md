# Szenen

## Zentrale Dateien

- `alle-bildprompts.txt`: zuerst der vollständige Cover-Prompt, danach Szene 01 bis Szene 14 in chronologischer Reihenfolge.
- `scene-index.json`: maschinenlesbare Zuordnung zwischen Szenennummer, Sprechtext, Promptdatei und Bildordner.

## Bilder einfügen

Für jede Szene existiert unter `EINZELNE-SZENEN/scene-XX/` ein eigener Ordner. Lege das fertige Bild direkt in den passenden Ordner, neben `bildprompt.txt` und `szene.md`.

Beispiel:

```text
EINZELNE-SZENEN/scene-04/
├── bildprompt.txt
├── szene.md
└── mein-fertiges-bild.png
```

Pro Szenenordner ist genau eine Bilddatei erlaubt. Unterstützt werden `.png`, `.jpg`, `.jpeg`, `.webp` und `.avif`. Der Ordnername bestimmt die Szene; der Bilddateiname ist frei wählbar.
