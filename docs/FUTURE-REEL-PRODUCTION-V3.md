# FinanzNeo Future Reel Production V3

`FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3`

Dieser Standard gilt nur für neue Reels aus `npm run reel:create`. Zusätzliche harte Schutzregeln stehen in `docs/FUTURE-REEL-QUALITY-GUARDS-V1.md`.

## 1. Timing und Visual Beats

- statischer Bildbeat ideal: **1,8–3,0 s**
- ab ca. **3,6 s** aktiv prüfen, ob ein weiteres Bild/Visual Beat klarer wäre
- ohne neue sichtbare Information hart maximal **4,0 s**
- ein Satz darf mehrere Visual Beats bekommen
- echte Wort-Zeitstempel des finalen Voiceovers bleiben Timing-Autorität

## 2. Exklusive Visual Selection für Reels

Für jede Szene wird vor der Umsetzung genau eine Hauptform gewählt:

### IMAGE
- konkrete Flow-Bildszene
- Überschrift/Header/Icon entsprechend der Szenenposition
- audio-synchrone Captions
- kleine funktionale Objektlabels erlaubt
- **keine erklärende Remotion-Hauptanimation über dem Bild**

### ANIMATION
- eigenständige individuelle Remotion-Animation
- Header/Icon + Captions
- SVG, Icons, Lottie, Shapes und Charts als passende Werkzeuge/Support erlaubt
- **kein Flow-Bild als Hauptvisual**

`hybrid` ist für Reel-Hauptvisuals kein gültiger Szenentyp. Ein Inhalt wird nicht dadurch besser erklärt, dass Bild und Animation unnötig übereinandergelegt werden.

## 3. Animationsframing

Die Hauptmechanik muss groß genug wirken. Post-Render-QA misst:

- Peak active-pixel ratio >= **0,15**
- Median active-pixel ratio >= **0,12**

Zusätzlich gelten die Quality Guards:

```text
Animation X = 72–1008
Animation Y = 320–1400
```

Ein perspektivischer Innenabstand schützt vor abgeschnittenen 3D-Objekten. Im echten Candidate werden die Außenränder separat gesampelt.

## 4. Cover und Captions

Neue Reels verwenden `finanzneo-cover-hook-v3`:

- scene-01 bleibt Cover-Hook mit Hero-Bild + exaktem Reel-Titel ab Frame 0
- kein normaler SceneHeader/Icon in scene-01
- **Captions laufen bereits ab dem ersten gesprochenen Wort**
- gesprochenes Voiceover ohne Captions ist verboten

Ab scene-02 gelten normaler `SceneHeader` + Icon + Captions.

## 5. Motion Direction und echte Diversität

Für jede Animationsszene:

```text
Sprechpunkt
→ sichtbares Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ passende Technik
→ motionDesign
→ animation.tsx
```

Metadaten-Diversität allein reicht nicht. `validate-reel-quality-guards-v1.mjs` analysiert zusätzlich die tatsächlich verwendeten Physical-Primitives in `animation.tsx`. Wiederholte Hauptobjekt-Sprache und stark überlappende Nachbarszenen werden blockiert, sofern keine konkrete inhaltliche Begründung existiert.

## 6. Audio Mastering

- Integrated Loudness: **-16 LUFS**
- Ziel True Peak: **-1 dBTP**
- harter Maximalwert: **-0,8 dBTP**
- AAC **320k**, 48 kHz

## 7. Render-Reihenfolge

```text
Remotion Candidate
→ Audio Mastering
→ Phase-3 Render-QA
→ Future-V3 Presentation/Occupancy-QA
→ Animation Edge-Band-QA
→ Final MP4
→ automatischer Export
```

## 8. Schutzschichten

- Motion Direction V1: verhindert Template-first-Planung
- Presentation V1: prüft Zuschauer-Hierarchie und geplante Motion-Diversität
- Quality Guards V1: IMAGE/ANIMATION-Exklusivität, echte TSX-Diversität und horizontale Safe-Zone
- Phase 3: prüft den echten Render statt nur Metadaten
