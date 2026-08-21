# Reels

Hier liegen ausschließlich FinanzNeo-Reel-Projekte. Aktuell ist keines angelegt.

Pfad:

`reels/<Wochenordner>/<Wochentag>/<Reel-Ordner>/`

Jedes neue Reel hat diese Struktur:

```text
01-script/
02-audio/
03-szenen/
├── 00-cover/
├── 00-ALLE-BILDER-HIER-REIN/
├── EINZELNE-SZENEN/scene-XX/
├── alle-bildprompts.txt
├── bildwelt.txt
└── scene-index.json
04-caption/
05-projektdateien/
README.md
```

Vollständige Regeln: `reels/PRODUKTIONSSTANDARD.md`

Neues Reel erzeugen:

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Reel prüfen:

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

`reel:validate` prüft die Struktur. `reel:ready` entscheidet streng, ob Phase 3 ohne Rückfragen starten darf.
