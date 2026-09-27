# Reels

Hier liegen FinanzNeo-Reel-Projekte. Einige vorhandene Wochen-/Tagesordner sind historische oder frühere Arbeitsstände und sind **keine Regelquelle** für neue Produktionen.

Autoritativ für neue Reels:

```text
CLAUDE.md
→ config/finanzneo-production-standard.json
→ reels/PRODUKTIONSSTANDARD.md
→ docs/3-PHASEN-WORKFLOW.md
```

## Pfad

```text
reels/<Wochenordner>/<Wochentag>/<Reel-Ordner>/
```

## Neue Reel-Struktur

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
├── caption.txt
└── word-timings.json
05-projektdateien/
06-export/
README.md
```

`00-cover/` ist nur ein technischer Alias/Vertrag. `scene-01` ist das Cover; es gibt keinen separaten Bild-00-Job.

## Neues Reel

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

## Prüfen

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

`reel:validate` prüft Struktur und Verträge. `reel:ready` entscheidet streng, ob Phase 3 ohne erfundene Ersatzassets starten darf.
