# Phase 2 — START HERE

Dieses Dokument ist der schnelle Einstieg für Phase 2. Für Bilder und Voiceover muss der restliche Projektbaum nicht analysiert werden.

## Nur diese Pfade jetzt benutzen

### 1. Google-Flow-Prompts
`02-bilder/alle-bildprompts.txt`

Diese Datei enthält alle Bildjobs. Bilder strikt einzeln erzeugen, vollständig warten, exakt umbenennen und erst danach das nächste Bild starten.

### YouTube-Bildwelt

Diese YouTube-Produktion verwendet die **bestehende FinanzNeo-Reel-Bildwelt** in ihrer horizontalen YouTube-Adaption:

```text
YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-cg-animated-black-v2
SOURCE_VISUAL_LANGUAGE:    finanzneo-stylized-3d-animated-black-v9
```

Kanonische Definition: `config/finanzneo-image-worlds/finanzneo-youtube-cg-animated-black-v2.txt`
Projektfassung: `02-bilder/bildwelt.txt`

Die alte projekteigene Welt `finanzneo-youtube-animated-feature-3d-v1` und der Pixar-Zielbegriff sind abgeschafft.

### Keine Bild-zu-Bild-Referenz

**Kein Bild wird als Referenz hochgeladen oder angehängt — auch Bild 01 nicht.**

Google Flow hat zwischen zwei Jobs kein Gedächtnis. Eine Bildreferenz schleppt Motiv und Komposition mit, und der Rendering-Stil fällt trotzdem auf den fotorealistischen Default zurück. Genau daran sind die bisherigen Durchläufe gescheitert.

Die Einheitlichkeit entsteht ausschließlich dadurch, dass der vollständige Style Lock in **jedem einzelnen Prompt** ausgeschrieben steht. `alle-bildprompts.txt` enthält ihn pro Block bereits vollständig — einfach Block für Block abarbeiten, nichts ergänzen, nichts kürzen.

### Literal first, creative second

Jeder Block startet bei der konkreten realen Situation hinter dem gesprochenen Satz. Zielbild: klar stilisiertes Premium-3D im Animationsfilm-Rendering mit **echten Alltagsgegenständen** in glaubwürdigen Proportionen, auf einer einzigen nahtlos tiefschwarzen Welt.

QA-Fail und dieselbe Bildnummer neu erzeugen, wenn das Bild:
- fotorealistisch oder wie ein Produkt-/Stockfoto wirkt
- wie flache Infografik, Präsentationsfolie, Dashboard oder App-UI aussieht
- die reale Situation weglässt und nur Finanzsymbole zeigt
- Ursache und Wirkung nicht erkennen lässt
- Hauptobjekte zu klein zeigt
- den schwarzen Hintergrund durch einen hellen Raum, eine Boden-Wand-Grenze oder farbige Zonen ersetzt
- zusätzlichen oder falschen Text enthält (z. B. `FinanzNeo V9`)

Bestehende Flow-Bilder aus älteren Prompt-Versionen sind **nicht automatisch bestanden** — sie stammen aus der abgeschafften Bildwelt und werden neu erzeugt.

Ein Bild = ein klarer Gedanke.

### 2. Fertige Bilder
`02-bilder/00-ALLE-BILDER-HIER-REIN/`

Alle finalen 16:9-Bilder und das Thumbnail kommen gemeinsam hier hinein.

### 3. Voiceover
`01-script/`

Genau eine finale Voiceover-Datei ablegen.

### 4. Wort-Zeitstempel
`01-script/word-timings.json`

Erst aus dem finalen Voiceover erzeugen/aktualisieren.

## Phase-2-Manifest

`phase2-manifest.json` enthält die exakten erwarteten Dateinamen und Zielpfade, ohne dass `visual-index.json` oder die Motion-Unterordner gelesen werden müssen.

## In Phase 2 NICHT öffnen/analysieren

Solange keine Phase-1-Korrektur ausdrücklich nötig ist:

- `04-projekt/VISUALS/`
- alle `animation.tsx`
- alle `remotion.md`
- `04-projekt/visual-plan.md`
- `04-projekt/remotion-plan.md`
- `04-projekt/external-assets-manifest.json`
- `04-projekt/external-assets-plan.md`
- `04-projekt/external-assets/`
- `src/`
- andere Reel-/YouTube-Projekte

Die externen Support-Assets sind bereits in Phase 1 geplant und werden **erst in Phase 3** anhand des Manifests gesucht, lizenzgeprüft und lokal integriert. Dadurch bleibt Phase 2 schnell.

## Wichtig

Für das bloße Öffnen/Aktualisieren von Phase 2 sind **kein `npm install`, kein voller Repo-Validate, kein Remotion-Bundle und kein Render** nötig.

Erst wenn alle finalen Bilder, genau ein Voiceover und echte Wort-Zeitstempel vorhanden sind, startet die Phase-3-Prüfung mit:

```bash
npm run youtube:ready -- youtube/2026-09-14_bis_2026-09-20/notgroschen
```
