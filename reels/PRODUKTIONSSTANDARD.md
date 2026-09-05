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
- **scene-01 als Cover + erster Content-Beat**
- direkte Hook-Zeile als allererste gesprochene Zeile; Frage/Aussage/Problem/Warnung/Kontrast/Zahl + konkreter Themenanker
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

## 3. Cover + erster Content-Beat

```text
FUTURE_COVER_HOOK: finanzneo-cover-hook-v3
```

Für neu erzeugte Reels gilt:

- `scene-01` ist gleichzeitig **Cover + erster Content-Beat**.
- Frame 0 ist nur der Cover-Snapshot derselben normalen scene-01.
- Es gibt **keinen separaten 0,1-s-/3-Frame-Cover-Clip**, keine stille Titelkarte und kein Bild 00.
- **Voiceover startet bereits in scene-01** mit dem ersten gesprochenen Wort.
- Die erste Zeile ist direkt eine konkrete Frage, Aussage, Problem-/Warn-Aussage, ein Kontrast oder eine Zahl und macht das Thema sofort klar.
- Generische Starts wie „Hallo“, „Heute geht es um …“ oder „In diesem Video …“ sind verboten.
- Frame 0 zeigt Hero-Bild + Remotion-Hook-Titel und bleibt caption-frei/ohne Standard-Header-Icon.
- Captions dürfen nach Frame 0 innerhalb derselben scene-01 starten.
- scene-01-Dauer folgt dem echten ersten Hook-Voiceover; kein künstlicher Cover-Hold.
- `cover.png` wird aus Frame 0 der geprüften finalen MP4 exportiert.

Bestehende V2-Reels werden nicht rückwirkend verändert.

## 4. Visual Beats und Timing

VISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

- Szenenzahl ist frei und themenabhängig.
- Der Hook beginnt mit dem **ersten gesprochenen Wort in scene-01**; nicht erst irgendwann in den ersten zwei Sekunden.
- Erst gesprochene Gedanken definieren, dann pro Gedanken einen sichtbaren Beat planen, danach Szenen gruppieren.
- Ein Satz darf ein eigenes Bild erhalten; zwei Aussagen/Aktionen/Beispiele in einem Satz dürfen in zwei Beats geteilt werden.
- Kompatibilitätsbasis älterer Reels: Bildbeats ideal 1,8–3,4 s und max. 4,5 s. **Neue Future-V3-Reels:** ideal 1,8–3,0 s; ab 3,6 s aktiv Split/zusätzliches Bild prüfen; ohne neue sichtbare Information hart maximal 4,0 s.
- Mehrere Bildszenen nacheinander sind erlaubt, wenn jede die Erklärung sichtbar fortsetzt.
- Animationen müssen während ihrer Laufzeit mehrere sichtbare Zustände durchlaufen; reine Kamera-Bewegung zählt nicht als neuer Beat.
- Finale Schnitte folgen den echten Wort-Zeitstempeln des Nutzer-Voiceovers.
- 60/40 Bild/Animation bleibt Richtwert, keine Quote.

## 5. Bilder / Google Flow

- exakt ein Bildjob gleichzeitig
- vollständig warten → exakt umbenennen → V9-QA → erst dann nächster Job
- keine Batch-/Parallelgenerierung
- scene-01 ist automatisch das Cover; kein Bild 00 und kein separater Cover-Bildjob
- das scene-01-Bild ist zugleich das **erste visuelle Erklärbild des Hooks**, keine neutrale Cover-Deko
- finale Bilder liegen in `03-szenen/00-ALLE-BILDER-HIER-REIN/`

Bildwelt: `finanzneo-stylized-3d-animated-black-v9`. Reale Alltagssituation und klare Ursache/Wirkung zuerst; glaubwürdige Objektkonstruktion und Proportionen; semi-realistische Materialdetails in klar stilisiertem 3D; niemals fotorealistisch. Deep Black bleibt Pflicht.

## 6. Layout V5

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

## 7. Animationen

Animationsszenen sind kleine visuelle Geschichten:

```text
START → TRIGGER → PHYSISCHE AKTION → REAKTION → ERGEBNIS → RESULT HOLD
```

Pflicht sind konkrete Realwelt-Objekte, sichtbare Ursache/Wirkung, mehrere koordinierte Motion-Channels und mindestens 15 Frames Ergebnis-Hold. Bei Future-V3-Reels muss die Hauptmechanik zusätzlich im echten Render ausreichend groß/füllend sein (Peak active-pixel ratio >= 0,15, Median >= 0,12). Remotion bleibt Timeline-/Render-Autorität. Three/R3F, Paths, Shapes, Motion Blur und Lottie sind Support-Werkzeuge, keine Ersatzmechanik. Kartenreihen, Flowcharts, Dashboard-UI, Fortschrittsbalken als Hauptgeschichte, Partikel/Aurora/Grid-Hintergründe und Debug-/Wackel-Hacks sind verboten.

Nach `reel:ready` ist die kanonische Animation per SHA-256 versiegelt.

## 8. SFX

SFX bestätigen sichtbare Ereignisse framegenau. Voiceover bleibt immer dominant. Keine Placeholder-Beeps, keine Remote-Sound-URLs, keine Casino-/Jackpot-Geldsounds. Fehlende freigegebene SFX dürfen mit dem konfigurierten Sound-Skill lokal erzeugt werden; das Haupt-Voiceover bleibt unverändert Nutzerasset.

## 9. Playwright Visual QA

Playwright CLI prüft die lokale Remotion-Preview. Jede Bildszene erhält mindestens einen stabilen Check; jede Animationsszene mindestens START, TRIGGER, MID, NEAR RESULT und FINAL HOLD. Geprüft werden insbesondere Header/Icon-Konsistenz, Y320–1400, Caption-Abstand, Clipping, Hero-Größe, Leerraum und sichtbare Start→Ergebnis-Veränderung. Sichtbare Fehler müssen an der kanonischen Quelle behoben werden, auch wenn TypeScript/Bundle bereits grün sind.

Bei Cover Hook V3 zusätzlich:

- Frame 0 muss als sauberes Cover funktionieren.
- Ein späterer Frame derselben scene-01 muss weiterhin denselben ersten Content-Hook zeigen.
- Voiceover darf nicht bis scene-02 verzögert sein.
- Ein 0,1-s-/3-Frame-Cover-only-Segment ist ein harter Fehler.

## 10. Phase 3 / Abschluss

Normale Kette:

```bash
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` erzeugt den Candidate, führt Post-Render-QA aus und startet nach PASS automatisch den kanonischen Export. Ein direkter `reel:export`-Aufruf ist nur ein kontrollierter Re-Export einer bereits geprüften finalen MP4.

FINAL_COMPLETE verlangt: alle Szenen belegt, exakter Animations-Seal, Audio vorhanden, 1080×1920, korrekte Timeline, Visual-QA bestanden und vollständiges `06-export/`. Bei Future-V3-Reels kommt vor der Freigabe verpflichtend Audio-Mastering auf -16 LUFS / -1 dBTP plus gemessene Audio-/Animationsbelegungs-QA hinzu.

## 11. Publishing

Finaler Standard:

- `04-caption/caption.txt` ist die einzige universelle Reel-Caption und damit die kanonische Quelle.
- Beim finalen Export wird genau diese Quelle als `06-export/caption-universal.txt` materialisiert.
- Keine separaten Plattform-Captiondateien.
- Keine YouTube Shorts; YouTube bleibt Longform unter `youtube/`.
