# Phase 2 — START HERE

Dieses Dokument ist der schnelle Einstieg für Phase 2. Für Bilder und Voiceover muss der restliche Projektbaum nicht analysiert werden.

## Nur diese Pfade jetzt benutzen

### 1. Google-Flow-Prompts
`04-visuals/alle-bildprompts.txt`

Diese Datei enthält alle Bildjobs. Bilder strikt einzeln erzeugen, vollständig warten, exakt umbenennen und erst danach das nächste Bild starten.

### YouTube-Bildwelt

Diese YouTube-Produktion verwendet absichtlich eine eigene Bildwelt:

`finanzneo-youtube-animated-feature-3d-v1`

Die Reel-Bildwelt bleibt unverändert.

### Direkte Stilreferenz

`04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Waschmaschine kaputt.png`

Bild 01 ist der verbindliche visuelle Referenzanker. Vor jedem weiteren Bild muss der Flow-Agent Bild 01 als visuelle Referenz prüfen/verwenden und dessen 3D-Stilisierung, Formen, Materialien, Licht, Tiefe und Animationsfilm-Look übernehmen.

Das Ziel ist **realitätsnah erkennbar, aber niemals realistisch**: klarer hochwertiger 3D-Animationsfilm-Look mit weichen gerundeten Formen und vereinfachten Details. Fotorealismus, semi-realistischer Produktlook, real wirkende Personen/Autos/Räume oder Stockfoto-Optik sind QA-Fails.

Bestehende Flow-Bilder aus älteren Prompt-Versionen sind **nicht automatisch bestanden**. Regenerieren, wenn sie:
- zu realistisch/fotorealistisch sind
- wie Produktwerbung oder Stockfoto aussehen
- nicht wie Bild 01 gerendert sind
- real wirkende Menschen oder Autos zeigen
- wie UI/Dashboard aussehen
- cyberpunkig/blau-lila werden
- zu voll oder schwer verständlich sind
- erfundene Texte wie `FinanzNeo V9` enthalten

Darstellungsfreiheit ist ausdrücklich erlaubt: schwebende 3D-Objekte, stilisierte Figuren, 3D-Charts, Diagramme, Zeitachsen, große Zahlen, Vorher/Nachher und räumliche Finanzmechaniken. Reale Räume/Schreibtische nur, wenn sie die Aussage wirklich besser erklären.

Ein Bild = ein klarer Gedanke.

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

## Wichtig

Für das bloße Öffnen/Aktualisieren von Phase 2 sind **kein `npm install`, kein voller Repo-Validate, kein Remotion-Bundle und kein Render** nötig.

Erst wenn alle finalen Bilder, genau ein Voiceover und echte Wort-Zeitstempel vorhanden sind, startet die Phase-3-Prüfung mit:

```bash
npm run youtube:ready -- youtube/video-01_notgroschen
```
