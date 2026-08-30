# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt immer `CLAUDE.md`.

## 1. Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
```

`04-caption/` enthält in aktiven Reels nur die universelle Publishing-Caption `caption.txt` und `word-timings.json`. Es gibt keine separaten Plattform-Captiondateien.

## 2. Drei Phasen

### Phase 1 — ChatGPT / Motion Authoring

- Recherche + Quellen
- einfaches, anfängerfreundliches Skript
- Szenenplan und V9-Flow-Prompts
- Header + Icons
- fertige kanonische `animation.tsx` je Animationsszene
- Lottie nur als gezielte Support-Ebene vor dem Animation-Seal
- Sound-Cue-Plan
- genau eine universelle Caption: `04-caption/caption.txt`

### Phase 2 — Nutzer

- finale Google-Flow-Bilder
- genau ein finales Haupt-Voiceover
- echte Wort-Timings aus diesem Voiceover

Kein Agent ersetzt oder generiert diese Flow-Bilder oder das Haupt-Voiceover eigenmächtig.

### Phase 3 — konfigurierter Executor

`scene-index.json.phase3Executor` entscheidet den Executor. Phase 3 integriert die finalen Nutzerassets, den versiegelten Animationscode und freigegebene lokale SFX. Sie darf zusätzlich Playwright Visual QA gegen die lokale Remotion-Preview durchführen. Eine kreative Änderung an Animation/Lottie nach dem Seal muss zurück in Phase 1 und neu versiegelt werden.

## 3. Visual Beats und Timing

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

- Szenenzahl ist frei und themenabhängig.
- Erst gesprochene Gedanken definieren, dann pro Gedanken einen sichtbaren Beat planen, danach Szenen gruppieren.
- Ein Satz darf ein eigenes Bild erhalten; zwei Aussagen/Aktionen/Beispiele in einem Satz dürfen in zwei Beats geteilt werden.
- Statische Bildbeats ideal 1,8–3,4 s und ohne neue sichtbare Information maximal 4,5 s.
- Mehrere Bildszenen nacheinander sind erlaubt, wenn jede die Erklärung sichtbar fortsetzt.
- Animationen müssen während ihrer Laufzeit mehrere sichtbare Zustände durchlaufen; reine Kamera-Bewegung zählt nicht als neuer Beat.
- Finale Schnitte folgen den echten Wort-Zeitstempeln des Nutzer-Voiceovers.
- 60/40 Bild/Animation bleibt Richtwert, keine Quote.

## 4. Bilder / Google Flow

- exakt ein Bildjob gleichzeitig
- vollständig warten → exakt umbenennen → V9-QA → erst dann nächster Job
- keine Batch-/Parallelgenerierung
- scene-01 ist automatisch das Cover; kein Bild 00
- finale Bilder liegen in `03-szenen/00-ALLE-BILDER-HIER-REIN/`

Bildwelt: `finanzneo-stylized-3d-animated-black-v9`. Reale Alltagssituation und klare Ursache/Wirkung zuerst; glaubwürdige Objektkonstruktion und Proportionen; semi-realistische Materialdetails in klar stilisiertem 3D; niemals fotorealistisch. Deep Black bleibt Pflicht.

## 5. Layout V5

Quelle ist ausschließlich `REEL_STYLE`:

```text
Header Y154
Header 56 px, Minimum 50 px, max. 2 Zeilen
Icon 34 px, optisch normalisiert
Visual Y320–1400
Caption bottom340, max. 2 Zeilen
Transition 3 Frames
```

Zweizeilige Header halten das Icon an der ersten Textzeile. `AnimationStage` clippt hart auf Y320–1400. Der produktive Hintergrund ist statisch `#000000`.

## 6. Animationen

Animationsszenen sind kleine visuelle Geschichten:

```text
START → TRIGGER → PHYSISCHE AKTION → REAKTION → ERGEBNIS → RESULT HOLD
```

Pflicht sind konkrete Realwelt-Objekte, sichtbare Ursache/Wirkung, mehrere koordinierte Motion-Channels und mindestens 15 Frames Ergebnis-Hold. Remotion bleibt Timeline-/Render-Autorität. Three/R3F, Paths, Shapes, Motion Blur und Lottie sind Support-Werkzeuge, keine Ersatzmechanik. Kartenreihen, Flowcharts, Dashboard-UI, Fortschrittsbalken als Hauptgeschichte, Partikel/Aurora/Grid-Hintergründe und Debug-/Wackel-Hacks sind verboten.

Nach `reel:ready` ist die kanonische Animation per SHA-256 versiegelt.

## 7. SFX

SFX bestätigen sichtbare Ereignisse framegenau. Voiceover bleibt immer dominant. Keine Placeholder-Beeps, keine Remote-Sound-URLs, keine Casino-/Jackpot-Geldsounds. Fehlende freigegebene SFX dürfen mit dem konfigurierten Sound-Skill lokal erzeugt werden; das Haupt-Voiceover bleibt unverändert Nutzerasset.

## 8. Playwright Visual QA

Playwright CLI prüft die lokale Remotion-Preview. Jede Bildszene erhält mindestens einen stabilen Check; jede Animationsszene mindestens START, TRIGGER, MID, NEAR RESULT und FINAL HOLD. Geprüft werden insbesondere Header/Icon-Konsistenz, Y320–1400, Caption-Abstand, Clipping, Hero-Größe, Leerraum und sichtbare Start→Ergebnis-Veränderung. Sichtbare Fehler müssen an der kanonischen Quelle behoben werden, auch wenn TypeScript/Bundle bereits grün sind.

## 9. Phase 3 / Abschluss

Normale Kette:

```bash
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` erzeugt den Candidate, führt Post-Render-QA aus und startet nach PASS automatisch den kanonischen Export. Ein direkter `reel:export`-Aufruf ist nur ein kontrollierter Re-Export einer bereits geprüften finalen MP4.

FINAL_COMPLETE verlangt: alle Szenen belegt, exakter Animations-Seal, Audio vorhanden, 1080×1920, korrekte Timeline, Visual-QA bestanden und vollständiges `06-export/`.

## 10. Publishing

Finaler Standard:

```text
06-export/<reel-name>.mp4
06-export/cover.<ext>
06-export/caption-universal.txt
06-export/untertitel.srt
06-export/bilder.zip
06-export/UPLOAD.md
```

`caption-universal.txt` ist die einzige Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat. Keine separaten Plattform-Captiondateien. YouTube bleibt eigenständiges Longform unter `youtube/`.
