# ANTIGRAVITY — PHASE 3 KORREKTURRENDER

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
LITERAL_FIRST_POLICY: Literal first, creative second.
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1
PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1
COVER_HOOK_CONTRACT: finanzneo-cover-hook-v3
REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1

Diese Fassung ersetzt den fehlerhaften Render, in dem Frame 0 nur Titel auf Schwarz zeigte, die ersten gesprochenen Sekunden keine Captions hatten und mehrere Animationen sichtbar aus denselben Konto/Reserve/Münzen-Bausteinen bestanden.

## 0. Vor jedem neuen Phase-3-Build — Pflichtmigration

Der Projektordner stammt ursprünglich aus Cover Hook V2. Deshalb vor Preflight/Composition-Build exakt diese aktuellen Verträge erneut anwenden:

```bash
REEL="reels/2026-09-14_bis_2026-09-20/montag/reel-01_wie-gross-sollte-dein-notgroschen-sein"
node scripts/apply-future-cover-hook-v3.mjs "$REEL"
node scripts/apply-future-reel-presentation-v1.mjs "$REEL"
node scripts/apply-reel-quality-guards-v1.mjs "$REEL"
npm run reel:validate -- "$REEL"
```

Wenn einer dieser Schritte fehlschlägt: **nicht rendern**, sondern Ursache beheben.

## 1. Szene 01 — Frame 0 ist bereits das fertige Cover

Harter Vertrag:

- Das Waschmaschinen-Hero-Bild ist **ab Frame 0 vollständig sichtbar**, normale Helligkeit, `opacity = 1`.
- Der exakte Reel-Titel ist ebenfalls ab Frame 0 sichtbar.
- **Kein schwarzer Vorlauf.**
- **Kein Hero-Bild-Fade-in.**
- **Keine generische `imageEnterFrames`-Animation auf scene-01.** Für scene-01 = 0 Frames.
- Kein Standard-SceneHeader und kein Header-Icon auf dem Cover.
- Das bereits sichtbare Flow-Bild bleibt Hauptvisual; keine erklärende Motion darüber.
- Sobald das Voiceover spricht, beginnen die normalen audio-synchronen Captions **mit dem ersten gesprochenen Wort**, auch während scene-01.
- Der Coverexport kommt aus dem finalen Frame 0.

Ein Frame mit **Titel auf Schwarz und erst danach einblendendem Bild** ist ausdrücklich FAIL.

## 2. Szenentypen

- IMAGE: Flow-Bild ist einziges Hauptvisual. Keine erklärenden Remotion-Overlays über dem Bild.
- ANIMATION: exakt die korrigierte kanonische `animation.tsx` verwenden. Kein generiertes Bild als Hauptvisual.
- Keine IMAGE+ANIMATION-Hybride als Reel-Hauptszene.

## 3. Vier korrigierte Animationsszenen — NICHT vereinheitlichen

Phase 3 darf diese Quellen nicht wieder in denselben visuellen Baukasten zurückübersetzen:

- `scene-03`: **drei Monatsgehalt-Stapel → ein Reservebehälter**. Mengenrelation.
- `scene-06`: **ein Tagesgeldkonto + eigenständiger schwankender ETF-Marktpfad → Geld entscheidet sich für Tagesgeld**. Keine zweite Account-Karte.
- `scene-09`: **drei Kalenderblätter + drei identische Monatsbeträge**. Kein Konto und kein Reservebehälter.
- `scene-10`: **grüner Sicherheitstresor schließt zuerst → goldener Investment-Baustein aktiviert sich danach**. Kein Account und kein ReserveTank.

Die Unterschiede müssen im echten Render sichtbar bleiben. `animation.tsx` ist Autorität.

## 4. Clipping / Safe-Zone

- vertikale Visualzone: Y320–1400
- horizontale Animations-Safe-Zone: X72–1008
- statische 3D-Hauptobjekte wegen Perspektive möglichst X96–984
- kein Text, Konto, Tank, Kalender oder anderes Hauptobjekt darf links/rechts angeschnitten wirken
- besonders scene-06 und scene-10 im echten Preview an mehreren Frames prüfen

## 5. Untertitel / Header

- Captions ab **erstem Voiceover-Wort**, nicht erst ab scene-02.
- scene-01: Cover-Titel + Hero-Bild + normale Voiceover-Captions; kein Standard-Header/Icon.
- ab scene-02: SceneHeader + Icon + Captions.
- echte `word-timings.json`; keine geschätzten Gleichlängen.

## 6. Finalisierung

1. Originale Flow-Bilder und finales Voiceover exakt zuordnen.
2. Pflichtmigration aus Abschnitt 0 ausführen.
3. Composition aus den aktuellen kanonischen Dateien neu bauen; alten fehlerhaften Phase-3-Code nicht blind wiederverwenden.
4. Echte Wort-Timings übernehmen.
5. Vier korrigierte Animationen unverändert integrieren.
6. Candidate auf -16 LUFS / -1 dBTP mastern.
7. Playwright/Render-QA durchführen.
8. `validate-cover-frame0-render-v1.mjs` muss PASS liefern.
9. Edge-Band-/Clipping-QA muss PASS liefern.
10. Erst danach final exportieren.

Der bisherige MP4-Render ist **keine Referenz für die Composition**, sondern nur ein Fehlerbeispiel. Bilder/Voiceover dürfen wiederverwendet werden; die fehlerhafte Composition nicht.
