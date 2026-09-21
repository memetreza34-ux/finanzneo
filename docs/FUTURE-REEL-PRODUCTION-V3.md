# FinanzNeo Future Reel Production V3

`FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3`

Dieser Standard gilt nur für neue Reels aus `npm run reel:create`. Zusätzliche harte Schutzregeln stehen in `docs/FUTURE-REEL-QUALITY-GUARDS-V1.md`.

## 0. Creative Director V1 — vor jeder Visual-Auswahl

Für jedes neue Reel gilt zusätzlich verbindlich:

```text
CREATIVE_DIRECTION_STANDARD: finanzneo-creative-director-v1
```

Kanonische Regelquelle: `docs/CREATIVE-DIRECTOR-V1.md`.

Die kreative Reihenfolge ist ab jetzt:

```text
Sprechpunkt
→ Zuschauerfrage
→ interessantester sichtbarer Moment
→ Handlung / Konsequenz / Kontrast
→ Shot Design
→ IMAGE oder ANIMATION
→ individuelle Hauptmechanik
→ Art Direction / V9 Style Lock
→ Flow-Prompt oder animation.tsx
→ Boring-Scene-QA
→ Seal
```

**Nicht mehr zulässig:** zuerst ein Finanzsymbol, eine Standardkomposition oder eine bekannte Animation auswählen und danach den Inhalt hineinpressen.

Vor jedem Prompt oder Animationscode werden mindestens festgelegt:

```text
VISUAL_GOAL
VIEWER_QUESTION
STORY_MOMENT
PRIMARY_ACTION
VISIBLE_CONSEQUENCE
SHOT_TYPE
CAMERA_POSITION
FOREGROUND
HERO
CONTEXT
UNIQUE_DETAIL
DIFFERENCE_FROM_PREVIOUS_BEATS
IMAGE_OR_ANIMATION
BORING_SCENE_RISK
```

Technische Korrektheit, Markenstil und Lesbarkeit reichen nicht für PASS. Ein visuell langweiliges oder folienartiges Ergebnis muss vor dem Seal neu entwickelt werden.

## 1. Timing und Visual Beats

- statischer Bildbeat ideal: **1,8–3,0 s**
- ab ca. **3,6 s** aktiv prüfen, ob ein weiteres Bild/Visual Beat klarer wäre
- ohne neue sichtbare Information hart maximal **4,0 s**
- ein Satz darf mehrere Visual Beats bekommen
- echte Wort-Zeitstempel des finalen Voiceovers bleiben Timing-Autorität
- Ken-Burns, Zoom oder Pan allein zählen **nicht** als neuer Visual Beat und rechtfertigen keine längere Standzeit
- wenn eine Aussage sichtbar bereits verstanden ist, folgt der nächste Shot statt künstlicher Kamerabewegung

## 2. Exklusive Visual Selection für Reels

Für jede Szene wird erst **nach Creative Direction und Shot Design** genau eine Hauptform gewählt:

### IMAGE
- konkrete Flow-Bildszene
- muss einen interessanten eingefrorenen Moment, eine Handlung, Konsequenz oder einen klaren Kontrast zeigen
- Überschrift/Header/Icon entsprechend der Szenenposition
- audio-synchrone Captions
- kleine funktionale Objektlabels erlaubt
- **keine erklärende Remotion-Hauptanimation über dem Bild**
- reine Objektkataloge oder `Person + Geld + Symbol + leerer Hintergrund` sind keine ausreichende Bildidee

### ANIMATION
- eigenständige individuelle Remotion-Animation
- muss `START → AKTION/URSACHE → VERÄNDERUNG → RESULTAT` sichtbar durchlaufen
- Header/Icon + Captions
- SVG, Icons, Lottie, Shapes und Charts als passende Werkzeuge/Support erlaubt
- **kein Flow-Bild als Hauptvisual**
- reine Flat-Infografik aus Chips, Karten, Icons, Balken oder Rahmen ist als Standardlösung verboten

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
- auch der Cover-Hook muss ein konkreter Story-Moment sein und darf kein generisches Finanzposter sein
- kein normaler SceneHeader/Icon in scene-01
- **Captions laufen bereits ab dem ersten gesprochenen Wort**
- gesprochenes Voiceover ohne Captions ist verboten

Ab scene-02 gelten normaler `SceneHeader` + Icon + Captions.

## 5. Motion Direction und echte Diversität

Für jede Animationsszene:

```text
Sprechpunkt
→ Zuschauerfrage
→ Story Moment
→ sichtbares Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ passende Technik
→ motionDesign
→ animation.tsx
→ Boring-Scene-QA
```

Metadaten-Diversität allein reicht nicht. `validate-reel-quality-guards-v1.mjs` analysiert zusätzlich die tatsächlich verwendeten Physical-Primitives in `animation.tsx`. Wiederholte Hauptobjekt-Sprache und stark überlappende Nachbarszenen werden blockiert, sofern keine konkrete inhaltliche Begründung existiert.

Zusätzlich gilt Shot-Diversität: direkt aufeinanderfolgende Beats sollen nicht dieselbe Kombination aus Kameradistanz, Hauptobjekt, Personenpose, Bildmitte-Komposition und Ursache-Wirkungs-Anordnung wiederholen, außer der Folgebeat liefert klar neue sichtbare Information.

## 6. Audio Mastering

- Integrated Loudness: **-16 LUFS**
- Ziel True Peak: **-1 dBTP**
- harter Maximalwert: **-0,8 dBTP**
- AAC **320k**, 48 kHz

## 7. Render-Reihenfolge

```text
Creative-Director-Plan + Boring-Scene-QA
→ Remotion Candidate
→ Audio Mastering
→ Phase-3 Render-QA
→ Future-V3 Presentation/Occupancy-QA
→ Animation Edge-Band-QA
→ Final MP4
→ automatischer Export
```

## 8. Schutzschichten

- Creative Director V1: verhindert korrekte, aber langweilige Erklärfolien und erzwingt Story Moment + Shot Design
- Motion Direction V1: verhindert Template-first-Planung
- Presentation V1: prüft Zuschauer-Hierarchie und geplante Motion-Diversität
- Quality Guards V1: IMAGE/ANIMATION-Exklusivität, echte TSX-Diversität und horizontale Safe-Zone
- Phase 3: prüft den echten Render statt nur Metadaten

## 9. Boring-Scene-Gate vor Seal

Eine Szene ist trotz technischer Korrektheit **FAIL**, wenn beispielsweise:

- sie hauptsächlich aus Person + Finanzsymbolen + leerem Hintergrund besteht
- sie den gesprochenen Satz nur dekorativ illustriert
- keine sichtbare Handlung, Konsequenz oder klarer Kontrast vorhanden ist
- die Hauptaussage nur über Labels verständlich wird
- Bank + Schild + Münzen + Pfeil als generische Standardkomposition dienen
- die Animation primär Karten, Chips, Icons, Balken oder Rahmen bewegt
- Bewegung vorhanden ist, aber die inhaltliche Situation unverändert bleibt
- Zoom/Pan/Ken-Burns die einzige Form von visueller Entwicklung ist

Vor Seal muss die Szene nach `docs/CREATIVE-DIRECTOR-V1.md` bestehen.