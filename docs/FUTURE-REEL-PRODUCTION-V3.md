# FinanzNeo Future Reel Production V3

`FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3`

Dieser Standard gilt **nur für neue Reels**, die mit dem aktuellen `npm run reel:create` angelegt werden. Bestehende Reels werden nicht rückwirkend migriert oder strenger bewertet.

## 1. Timing und Visual Beats

Der bestehende Visual-Beat-V2-Vertrag bleibt die Basis. Future V3 verschärft nur den Rhythmus:

- statischer Bildbeat ideal: **1,8–3,0 s**
- ab ca. **3,6 s** aktiv prüfen, ob ein weiterer Visual Beat die Aussage klarer macht
- ohne neue sichtbare Information: **hart maximal 4,0 s**
- ein Satz darf mehrere Visual Beats bekommen
- ein neuer konkreter Gedanke soll eine neue sichtbare Information auslösen
- echte Wort-Zeitstempel des finalen Nutzer-Voiceovers bleiben die finale Timing-Autorität

Ziel: kein statisches Bild bleibt nur deshalb stehen, weil der gesprochene Satz noch nicht zu Ende ist.

## 2. Harte Szenentyp-Regel

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v2`

Jede neue Reel-Szene ist exakt einer von zwei Haupttypen:

```text
IMAGE
oder
ANIMATION
```

### IMAGE

- Google-Flow-Bild ist das einzige Hauptvisual
- ab scene-02: `SceneHeader` + Icon oben
- ab scene-02: echte audio-synchrone Captions unten
- scene-01 bleibt Cover-Sonderfall mit Hero-Bild + exaktem Reel-Titel
- kurze funktionale Objektlabels im generierten Bild sind erlaubt
- keine erklärenden Remotion-Overlays, Geldflüsse, Parallax, Lottie-, SVG- oder Chart-Hauptmechanik über dem Bild

### ANIMATION

- kein generiertes Bild als Hauptvisual
- individuelle, content-first hergeleitete Remotion-Mechanik
- SVG, Icons, Lottie, Charts, Zahlen und 3D-Objekte sind innerhalb der Animationsszene erlaubt
- Support-Assets bestimmen nie die Szenenidee

Es gibt bei Reels **keinen dritten Haupttyp `hybrid`**.

## 3. Animationsframing

Die physische Hauptmechanik muss im echten Render groß genug wirken. Schwarzer Leerraum ist nur dann sinnvoll, wenn er der Geschichte dient.

Post-Render-QA misst im visuellen Kern bei mehreren Zeitpunkten:

- **Peak active-pixel ratio >= 0,15**
- **Median active-pixel ratio >= 0,12**

Ein weiter Startzustand ist erlaubt, wenn die Animation anschließend sichtbar näher/größer zur eigentlichen Mechanik wechselt. Kamera-Zoom allein ersetzt keine echte Zustandsänderung.

## 4. Audio Mastering

Für Future-V3-Reels wird der Candidate **vor** der Render-QA automatisch gemastert:

- Integrated Loudness: **-16 LUFS**
- Ziel True Peak: **-1 dBTP**
- harter True-Peak-Maximalwert: **-0,8 dBTP**
- AAC **320k**
- **48 kHz**

## 5. Render-Reihenfolge

```text
Remotion Candidate
→ Future-V3 Audio Mastering
→ normale Phase-3 Render-QA
→ Future-V3 Audio-/Occupancy-QA
→ Final MP4
→ automatischer Export
```

Fehlt der V3-Marker im Reel, sind die neuen Mastering-/Occupancy-Schritte No-ops. Dadurch bleibt die bestehende Produktionshistorie unverändert.

## 6. Visual Selection — Planungsregel

Für neue Reels wird bereits in Phase 1 nach `docs/FINANZNEO-VISUAL-SELECTION-RULE.md` geplant:

- reale Situation als Standbild sofort verständlich → `IMAGE`
- Veränderung, Vergleich, Reihenfolge oder Ursache/Wirkung über Zeit → `ANIMATION`
- Bildszene bleibt visuell ruhig: Bild + Header/Icon + Captions
- Animationsszene wird individuell aus dem Sprechpunkt entwickelt
- SVG für präzise Vektor-/Pfadlogik innerhalb von Animationen
- Icons nur als semantischer Support
- Lottie nur als kleine Support-Bewegung

Diese Planungsregel **schwächt keine harten Reel-Verträge ab**. `CLAUDE.md`, V9-Bildwelt, Reel-Layout, Phase-1-Codevertrag und Phase-3-Gates bleiben verbindlich.

## 7. Future Reel Presentation V1

`FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1`

Für neue Reels gilt zusätzlich `docs/FUTURE-REEL-PRESENTATION-V1.md` als harter Zuschauer-Vertrag:

- scene-01 bleibt Cover-Sonderfall mit Hero-Bild + Reel-Titel
- ab scene-02 muss im **echten Render** oben `SceneHeader` + Icon sichtbar sein
- ab scene-02 müssen unten echte audio-synchrone Captions sichtbar sein
- Bildszenen dürfen nicht als kleine quadratische Karten in viel Schwarz erscheinen
- Motion-Diversität wird nur auf Animationsszenen über sichtbare Haupttechnik, Hero-Objektfamilie und camera+layout+transformation geprüft
- ein anderes Lottie/Icon/SVG-Support-Asset macht eine sonst gleiche Animation nicht zu einer neuen Haupttechnik

## 8. Phase 1 Individual Motion Direction V1

`PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1`

Kanonische Regel: `docs/FUTURE-REEL-PHASE1-MOTION-DIRECTION-V1.md`.

Für jede **Animationsszene** eines neuen Reels gilt vor `motionDesign` und vor `animation.tsx` diese Reihenfolge:

```text
Sprechpunkt analysieren
→ sichtbares Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ passende Technik
→ motionDesign
→ animation.tsx
```

Es gibt **keine feste Animationsbibliothek als kreatives Auswahlmenü**. Frühere Animationen, Komponenten, Lotties, Icons und SVGs sind Werkzeuge und Referenzen. Sie bestimmen nicht die Szenenidee.

Wiederverwendung bleibt erlaubt, wenn dieselbe Mechanik für den konkreten Inhalt wirklich der beste Fit ist. In diesem Fall muss Phase 1 die Wiederverwendung explizit dokumentieren und inhaltlich begründen.
