# Video 01 — Notgroschen: Wie viel brauchst du wirklich?

Eigenständiges FinanzNeo-YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.

- Format: 1920 × 1080, 16:9, 30 fps
- Zielsprache: Deutsch
- Zielgruppe: Finanzanfänger, besonders junge Erwachsene/Azubis/Berufseinsteiger
- Ziellänge: ca. 6–7 Minuten, Inhalt entscheidet
- Status: **Phase 1 vollständig validiert und mit Motion V3 versiegelt — Phase 2 startklar**
- Branch: `youtube/notgroschen-video-01`

## Phase-1-Abschluss

Phase 1 ist vollständig vorbereitet und formal abgeschlossen:

- Recherche und Quellen geprüft, Datenstand 16.09.2026
- vollständiges deutsches Voiceover-Skript
- Kapitel-Dramaturgie und Retention-Plan
- 28 geplante Visuals
- 10 konkrete Flow-Bildjobs plus Thumbnail
- 23 produktionsreife Motion-V3-Quellen
- vollständige Viewer-Change-/Mechanik-/Technik-Metadaten
- Daten- und Rechenhinweise
- vollständiges Publishing- und Social-Promo-Paket
- optionale externe Support-Asset-Slots geplant
- `youtube:validate` erfolgreich
- `youtube:animation:validate` erfolgreich
- `youtube:phase1:seal` erfolgreich
- kanonischer Seal: `06-projektdateien/animation-seal.json`

Kreative Änderungen an versiegelten Motion-Quellen erfordern erneute Motion-Validation und einen neuen Phase-1-Seal.

## Phase 2 — schneller Einstieg

Für Bilder und Voiceover **nicht den gesamten Projektbaum analysieren**.

Direkt öffnen:

```text
PHASE-2-START-HERE.md
phase2-manifest.json
```

Danach werden nur diese Bereiche benötigt:

```text
04-visuals/alle-bildprompts.txt
04-visuals/00-ALLE-BILDER-HIER-REIN/
03-audio/
```

`04-visuals/EINZELNE-VISUALS/` enthält die bereits versiegelten Phase-1-Motionquellen und muss während Phase 2 nicht rekursiv eingelesen werden.

## Optionale externe Support-Assets

Phase 1 hat zusätzlich konkrete, optionale Slots für B-Roll, SVG-Icons und kleine Lottie-Cues vorbereitet. Diese Slots werden **nicht in Phase 2 gesucht oder heruntergeladen**, damit der Fast-Path schlank bleibt.

Kanonische Dateien:

```text
06-projektdateien/external-assets-plan.md
06-projektdateien/external-assets-manifest.json
04-visuals/external-assets/README.md
04-visuals/external-assets/external-assets-ledger.json
```

Phase 3 darf nur die dort freigegebenen Slots mit lizenzgeprüften lokalen Assets füllen. Wenn kein Treffer die Qualitäts- oder Lizenzprüfung besteht, bleibt der Slot leer und die vorbereitete Hauptvisualisierung läuft unverändert weiter.

## Kernidee

Nicht nur eine Faustregel nennen, sondern zeigen, wie Zuschauer die Größe eines Notgroschens sinnvoll einschätzen, wo das Geld liegen kann und warum kurzfristig benötigte Rücklagen nicht dasselbe sind wie langfristiges Investieren.

## Produktionsprinzip

Skript → gesprochene Gedanken → Visual Beats → Viewer Change → beste Visualart → optionale Support-Asset-Prüfung → konkrete Bild-/Motion-Produktion.

Die YouTube-Bildwelt ist `finanzneo-youtube-animated-feature-3d-v1`. Bild 01 (`YouTube Bild 01 - Waschmaschine kaputt.png`) ist der direkte Stilanker für alle weiteren generierten Bilder dieses Videos: klar stilisierter, cineastischer 3D-Animationsfilm-Look auf tiefschwarzer Bühne, nicht fotorealistisch.

## Sicherheit

Der Phase-2-Fast-Path löscht oder vereinfacht keine Produktionsdateien. Animationen, Motion-V3-Metadaten, Visual-Pläne, Seal und Validatoren bleiben vollständig für Phase 3 erhalten.

Externe Assets sind ausschließlich Support. Sie dürfen weder eine versiegelte `animation.tsx` kreativ verändern noch Flow-/Remotion-Hauptbeats durch Stockmaterial ersetzen. Remote-Assets und API-Keys sind im Render/Repository verboten.
