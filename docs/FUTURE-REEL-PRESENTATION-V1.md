# FinanzNeo Future Reel Presentation V1

`FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1`

Dieser Standard gilt nur für neu erzeugte Reels und wird durch `docs/FUTURE-REEL-QUALITY-GUARDS-V1.md` technisch verschärft.

## 1. Feste Reel-Hierarchie

### Szene 01 — Cover Hook V3

**Frame 0 ist bereits das fertige Cover.** Es gibt keinen vorgelagerten schwarzen Frame und keine nachträgliche Hero-Bild-Einblendung.

Pflicht ab dem allerersten Videoframe:

- vollständiges Hero-Bild bereits sichtbar, `opacity = 1`
- exakter Reel-Titel bereits sichtbar
- kein Bild-Fade-in
- keine Cover-Entrance-Transition
- kein schwarzer Lead-in
- kein normaler `SceneHeader`
- kein Standard-Icon
- audio-synchrone Captions ab dem ersten gesprochenen Wort
- kein gesprochenes Voiceover ohne Captions

Die generische kurze `imageEnterFrames`-Animation anderer Bildszenen darf **nicht** auf scene-01 angewendet werden. Für scene-01 gilt `scene01ImageEnterFrames = 0`.

Captions sind keine zweite Erklärungsschicht, sondern die normale Untertitelspur des Voiceovers. Eine mehrere Sekunden lange captionlose Cover-Szene bei laufendem Voiceover ist verboten.

### Ab Szene 02

Jede normale Szene braucht im echten Render:

- oben `SceneHeader` + passendes Icon
- Hauptvisual in der zentralen Visualzone
- unten echte audio-synchrone `Captions`

Metadaten reichen nicht. Die Render-QA prüft die tatsächlich sichtbaren Bereiche.

## 2. IMAGE oder ANIMATION

Für Reels gilt exklusiv:

- **IMAGE:** Flow-Bild als Hauptvisual. Keine erklärende Remotion-Hauptanimation darüber.
- **ANIMATION:** eigenständige Remotion-Hauptanimation. Kein Flow-Bild als Hauptvisual.

SVG, Icons und Lottie können Animationsszenen unterstützen. Sie verwandeln eine Bildszene nicht in einen Hybrid und zählen allein nicht als neue Haupttechnik.

## 3. Bildgröße

Flow-Bilder bleiben als Quelle 1:1, müssen im 9:16-Reel aber groß und klar wirken. `activePixelRatio >= 0.10` im visuellen Kern bleibt das Render-Ziel. Kleine Quadratkarten in viel schwarzem Leerraum sind verboten.

Für das Cover reicht eine spätere Belegungsprobe ausdrücklich nicht: `validate-cover-frame0-render-v1.mjs` misst den visuellen Kern **exakt bei Frame 0** und vergleicht ihn zusätzlich mit dem frühen stabilen Cover-Zustand. Titel auf Schwarz mit erst danach eingeblendetem Bild ist ein harter FAIL.

## 4. Content-first Motion

```text
Sprechpunkt
→ Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ passende Technik
→ motionDesign
→ animation.tsx
```

Keine feste Animationsbibliothek als kreatives Auswahlmenü. Wiederverwendung ist nur erlaubt, wenn sie für den konkreten Sprechpunkt der beste Fit ist und konkret begründet wird.

## 5. Motion-Diversität: Plan + echter Source

Planungsmetadaten bleiben Pflicht:

- `viewerChange`
- `visualMode`
- `visualTechniqueId`
- `compositionFamilyId`
- `heroObjectFamily`
- `primaryAction`
- `motionSignature.camera/layout/transformation`
- `supportTools`
- optional `repetitionJustification`

Zusätzlich liest `validate-reel-quality-guards-v1.mjs` die echte `animation.tsx`. Damit kann eine Szene nicht mehr nur durch andere IDs oder Labels als „neu“ erscheinen, obwohl dieselben Hauptobjekte und dieselbe sichtbare Sprache wiederverwendet wurden.

## 6. Horizontale Safe-Zone

Animationsobjekte bleiben innerhalb `X=72–1008`, zusätzlich mit perspektivischem Innenabstand. Die vertikale Visualzone bleibt `Y=320–1400`.

Phase 3 prüft den echten Candidate zusätzlich an den linken/rechten Außenbändern. Sichtbare Animationsobjekte dort gelten als möglicher Beschnitt und blockieren den Export.

## 7. Prüfzeitpunkte

### Phase 1
- Content-first Motion Direction
- Presentation-Metadaten
- Cover-Hero ab Frame 0 / kein Cover-Fade-in
- tatsächliche Source-Diversität
- IMAGE/ANIMATION-Exklusivität
- statisch prüfbare horizontale Safe-Zone

### Phase 3
- echtes Audio und echte Wort-Timings
- exakter Frame 0: Hero-Bild + Cover-Titel bereits vollständig sichtbar
- Captions ab erstem gesprochenen Wort
- Header/Icon ab Szene 02
- Bild-/Animationsbelegung
- horizontale Edge-Band-QA

## Kurzregel

> **Frame 0 ist bereits das fertige Cover: Hero-Bild + Titel sofort sichtbar, kein schwarzer Vorlauf und kein Bild-Fade-in. Captions starten mit dem ersten gesprochenen Wort. Jede Szene ist IMAGE oder ANIMATION. Animationen werden inhaltlich individuell entwickelt, anhand der echten TSX-Quelle auf Wiederholung geprüft und dürfen nicht an den Seiten abgeschnitten werden.**
