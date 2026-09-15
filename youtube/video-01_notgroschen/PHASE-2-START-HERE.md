# Phase 2 — START HERE

Dieses Dokument ist der schnelle Einstieg für Phase 2. Für Bilder und Voiceover muss der restliche Projektbaum nicht analysiert werden.

## Nur diese Pfade jetzt benutzen

### 1. Google-Flow-Prompts
`04-visuals/alle-bildprompts.txt`

Diese Datei enthält alle Bildjobs. Bilder strikt einzeln erzeugen, vollständig warten, exakt umbenennen und erst danach das nächste Bild starten.

### 2. Fertige Bilder
`04-visuals/00-ALLE-BILDER-HIER-REIN/`

Alle finalen 16:9-Bilder und das Thumbnail kommen gemeinsam hier hinein.

### 3. Voiceover
`03-audio/`

Genau eine finale Voiceover-Datei ablegen.

### 4. Wort-Zeitstempel
`03-audio/word-timings.json`

Erst aus dem finalen Voiceover erzeugen/aktualisieren.

## Phase-2-Manifest

`phase2-manifest.json` enthält die exakten erwarteten Dateinamen und Zielpfade, ohne dass `visual-index.json` oder die Motion-Unterordner gelesen werden müssen.

## In Phase 2 NICHT öffnen/analysieren

Solange keine Phase-1-Korrektur ausdrücklich nötig ist:

- `04-visuals/EINZELNE-VISUALS/`
- alle `animation.tsx`
- alle `remotion.md`
- `06-projektdateien/visual-plan.md`
- `06-projektdateien/remotion-plan.md`
- `06-projektdateien/external-assets-manifest.json`
- `06-projektdateien/external-assets-plan.md`
- `04-visuals/external-assets/`
- `src/`
- andere Reel-/YouTube-Projekte

Die externen Support-Assets sind bereits in Phase 1 geplant und werden **erst in Phase 3** anhand des Manifests gesucht, lizenzgeprüft und lokal integriert. Dadurch bleibt Phase 2 schnell.

Diese Dateien bleiben unverändert für Phase 3 erhalten.

## Wichtig

Für das bloße Öffnen/Aktualisieren von Phase 2 sind **kein `npm install`, kein voller Repo-Validate, kein Remotion-Bundle und kein Render** nötig.

Erst wenn alle finalen Bilder, genau ein Voiceover und echte Wort-Zeitstempel vorhanden sind, startet die Phase-3-Prüfung mit:

```bash
npm run youtube:ready -- youtube/video-01_notgroschen
```
