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

`04-caption/` enthält nur `caption.txt` und `word-timings.json`. Es gibt keine separaten Plattform-Captiondateien.

## 2. Drei Phasen

### Phase 1 — ChatGPT / Motion Authoring
- Recherche + Quellen
- anfängerfreundliches Skript
- Szenenplan und V9-Flow-Prompts
- Header + Icons
- fertige kanonische `animation.tsx` je Animationsszene
- Sound-Cue-Plan
- Motion Art Direction + Playwright Visual QA für Motion-Core-Reels
- genau eine universelle Caption: `04-caption/caption.txt`

### Phase 2 — Nutzer
- finale Google-Flow-Bilder
- genau ein finales Haupt-Voiceover
- echte Wort-Timings aus diesem Voiceover

### Phase 3 — konfigurierter Executor
Phase 3 integriert Nutzerassets, versiegelten Animationscode und SFX. Kreative Änderungen nach dem Animation-Seal müssen zurück in Phase 1.

## 3. Harte Szenentyp-Regel

Für Reels ist jede Szene **exakt IMAGE oder ANIMATION**.

### IMAGE
- Flow-Bild als Hauptvisual
- Titel/Header/Icon gemäß Szenenposition
- audio-synchrone Captions
- kurze funktionale Objektlabels erlaubt
- **keine erklärende Remotion-Hauptanimation über dem Bild**

### ANIMATION
- eigenständige, individuell aus dem Sprechpunkt entwickelte Remotion-Hauptanimation
- Header/Icon + Captions
- SVG, Icons, Lottie, Shapes und Charts dürfen unterstützen
- **kein Flow-Bild als Hauptvisual**

Ein Bild+Animation-Hybrid als Reel-Hauptvisual ist verboten. Support-Werkzeuge machen aus einer wiederholten Hauptmechanik keine neue Animation.

## 4. Visual Beats und Timing

VISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

- Szenenzahl ist themenabhängig.
- Erst Sprechgedanke → sichtbares Verständnisziel → Visual Beat.
- Future-V3-Bildbeats ideal 1,8–3,0 s; ab 3,6 s Split prüfen; ohne neue Information max. 4,0 s.
- Mehrere Bildszenen nacheinander sind erlaubt.
- Finale Schnitte folgen echten Wort-Zeitstempeln.
- 60/40 Bild/Animation bleibt nur Richtwert.

## 5. Cover Hook V3 und Captions

Neue Reels verwenden `finanzneo-cover-hook-v3`:

- scene-01 = Hero-Bild + exakter Reel-Titel ab Frame 0
- kein normaler SceneHeader und kein Header-Icon in scene-01
- **Captions beginnen mit dem ersten gesprochenen Wort, auch in scene-01**
- gesprochenes Voiceover ohne Captions ist verboten
- eine mehrere Sekunden lange captionlose Cover-Szene bei laufendem Voiceover ist ein harter Fehler

Ab scene-02: normaler SceneHeader + Icon + Captions.

## 6. Bilder / Google Flow

- exakt ein Bildjob gleichzeitig
- warten → umbenennen → V9-QA → erst dann nächster Job
- keine Batch-/Parallelgenerierung
- scene-01 ist automatisch das Cover; kein Bild 00
- finale Bilder liegen in `03-szenen/00-ALLE-BILDER-HIER-REIN/`

Bildwelt: `finanzneo-stylized-3d-animated-black-v9`. Reale Alltagssituation und Ursache/Wirkung zuerst; klar stilisiertes 3D; niemals fotorealistisch; Deep Black Pflicht.

## 7. Layout und Safe-Zone

```text
Header Y154
Header 56 px, Minimum 50 px, max. 2 Zeilen
Icon 34 px
Visual Y320–1400
Caption bottom340, max. 2 Zeilen
Animation X72–1008
Transition 3 Frames
```

`AnimationStage` clippt vertikal auf Y320–1400. Quality Guards V1 schützen zusätzlich horizontal X72–1008 plus perspektivischen Innenabstand. Der produktive Hintergrund bleibt statisch `#000000`.

## 8. Animationen — Motion Core V1

MOTION_CORE: finanzneo-motion-core-v1
CANONICAL_MOTION_SOURCE: src/motion
MECHANIC_REGISTRY: src/motion/mechanics.ts
MOTION_DIRECTOR: .agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md
MOTION_ART_DIRECTOR: .agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md
MOTION_CORE_CURATOR: .agents/plugins/finanzneo-motion/skills/motion-core-curator/SKILL.md
MECHANIC_SELECTION: .agents/plugins/finanzneo-motion/rules/mechanic-selection.md

Animationsszenen folgen:

```text
Sprechpunkt
→ Verständnisziel
→ visuelle Frage
→ physische Ursache/Wirkung
→ eindeutige MECHANIC_ID
→ Hero + optionaler Support
→ individuell beste Hauptmechanik
→ Technik
→ START → AKTION → REAKTION → ERGEBNIS → RESULT HOLD
→ Motion Art Direction
→ Playwright Visual QA
```

`src/motion` ist für **neue oder bewusst überarbeitete Reel-Animationen** die kanonische technische Basis. Vor lokalen Neuentwicklungen werden `PremiumPhysicalStage`, die Physical-Primitives, `FN_MOTION` und die Mechanik-Registry geprüft und wiederverwendet, wenn sie semantisch passen.

Das bedeutet ausdrücklich **nicht**, dass Animationen aus einem festen Template-Menü ausgewählt werden. Die Mechanik wird weiterhin aus dem Sprechpunkt hergeleitet. Die Mechanik-Familien sind semantische Referenzen für Ursache/Wirkung; sie sind keine fertigen Layout-Schablonen. Neue lokale szenenspezifische Objekte bleiben erlaubt, wenn der Inhalt sie benötigt.

### Hero vor Objektquote

Pflicht ist ein **klares physisches Hero-Objekt**, nicht eine Mindestmenge an Objekten. Ein starkes Hero darf allein reichen. Support-Objekte werden nur ergänzt, wenn sie Ursache/Wirkung verständlicher machen.

Neue Motion-Core-Szenen bevorzugen semantisch eindeutige Namen:

- `PhysicalBanknote` = Geldschein/Werteinheit
- `PhysicalInvoice` = Rechnung/Dokument
- `PhysicalAccount`
- `PhysicalCoinStack`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`

`PhysicalBill` bleibt nur als kompatibler alter Motion-Core-Name erhalten. Alte Physical-Exports aus `src/brand`/`src/design-system` sind Legacy-Kompatibilität, keine Quelle für neue Motion-Core-Reels.

Pflicht: konkrete Ursache/Wirkung, mehrere koordinierte Motion-Channels, mindestens 15 Frames Ergebnis-Hold. Lottie, Three, Paths, Shapes und Motion Blur bleiben Support-Werkzeuge innerhalb der Remotion-Timeline und ersetzen keine schwache Hauptmechanik.

### Mechanik-Ledger und Anti-Wiederholung

Vor Code wird für alle Animationsszenen eines Reels ein Mechanik-Ledger geführt:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

- dieselbe `MECHANIC_ID` darf im selben Reel nicht doppelt vorkommen;
- stimmen mindestens drei Kerndimensionen mit einer früheren Szene überein, wird die physische Erklärung neu entworfen;
- andere Farbe, anderes Label/Icon, Mirroring, Timing oder Kamera machen aus derselben Mechanik keine neue Animation;
- alte `FinanceMotionLab*`-/Experiment-Kompositionen sind keine Produktions-Stilreferenz.

Quality Guards lesen zusätzlich die **echte `animation.tsx`**. Metadaten allein reichen nicht, wenn tatsächliche Hauptobjekte und Komposition sichtbar gleich bleiben. Wiederholung braucht eine konkrete inhaltliche Begründung.

### Primitive Promotion

Szenenspezifische Objekte dürfen lokal entstehen. Erst wenn dieselbe semantische Form in mindestens zwei unterschiedlichen Szenen/Reels wirklich wiederverwendet wird, prüft der `motion-core-curator` die Promotion nach `src/motion`. Der Core wird weder durch Copy-Paste fragmentiert noch mit Einmal-Komponenten aufgebläht.

## 9. SFX

SFX bestätigen sichtbare Ereignisse framegenau. Voiceover bleibt dominant. Keine Placeholder-Beeps, Remote-Sound-URLs oder Casino-/Jackpot-Geldsounds.

## 10. Motion Art Direction + Playwright Visual QA

Neue Motion-Core-Reels besitzen automatisch:

```text
05-projektdateien/visual-qa.md
```

Der Motion Art Director prüft insbesondere Hero-Größe, Proportionen, Materialität, Tiefe, Perspektive, optische Zentrierung, Blickführung, Kamera und einen sauberen RESULT HOLD.

Playwright Visual QA prüft Bild- und Animationsszenen. Geprüft werden Header/Icon, Y320–1400, Caption-Abstand, Hero-Größe, Leerraum, sichtbare Start→Ergebnis-Veränderung und Clipping.

Animationsszenen mindestens an:

```text
START
TRIGGER
MID-MECHANISM
NEAR RESULT
FINAL RESULT HOLD
```

Vor produktivem Phase-3-Render müssen in `visual-qa.md` stehen:

```text
MOTION_ART_DIRECTION=PASS
PLAYWRIGHT_VISUAL_QA=PASS
```

Außerdem darf keine Szenenzeile mehr `PENDING` oder `FAIL` sein. `reel:phase3:preflight` blockiert sonst. Marker dürfen nur nach echter Sichtprüfung geändert werden, niemals nur um den Gate-Check zu bestehen.

Zusätzlich prüft die finale Candidate-QA bei neuen Reels die horizontalen Außenbänder. Sichtbarer Animationsinhalt außerhalb der Safe-Zone kann den Export blockieren.

Ein Frame-0-Smoke-Test beweist nur Renderbarkeit. Neue Mechaniken, Core-Änderungen und repräsentative Pilotfälle werden zusätzlich an mehreren Frames oder per Vollrender visuell geprüft.

## 11. Phase 3 / Abschluss

```bash
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:phase3:preflight` verlangt bei Motion-Core-V1-Reels zusätzlich Art-Direction- und Playwright-PASS.

`reel:render` erzeugt Candidate → Audio-Mastering → Render-QA → Presentation/Occupancy-QA → Edge-Band-QA → finalen Export.

FINAL_COMPLETE verlangt: alle Szenen belegt, Animations-Seal korrekt, Audio vorhanden, 1080×1920, echte Timings, Art Direction + Visual-QA bestanden, keine abgeschnittenen Animationsobjekte und vollständiges `06-export/`.

## 12. Publishing

```text
06-export/<reel-name>.mp4
06-export/cover.<ext>
06-export/caption-universal.txt
06-export/untertitel.srt
06-export/bilder.zip
06-export/UPLOAD.md
```

`caption-universal.txt` ist die einzige Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat. Keine separaten Plattform-Captiondateien. YouTube bleibt eigenständiges Longform unter `youtube/`.
