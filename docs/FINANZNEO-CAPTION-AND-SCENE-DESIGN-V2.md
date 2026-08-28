# FinanzNeo — Caption, Scene Header, Timing & Motion V5/V9

Verbindlicher Qualitätsstandard für neue Reel-Produktionen. Layout = V5, visuelle Welt/Hintergrund = V9.

## 1. Untertitel

- aktives gesprochenes Wort: FinanzNeo-Grün
- restliche Wörter: Weiß
- max. zwei Zeilen
- keine Größenanimation / kein Scale-Pop
- kein Word-Jump
- kein `WebkitTextStroke`
- dunkle halbdeckende Backplate nur hinter den Captions
- Schriftstärke 800
- Standardgröße 50 px, Minimum 40 px
- Position aus `REEL_STYLE.caption`: `bottom = 340`, `left = 72`, `right = 140`
- kurze Pausen halten die vorherige Caption sichtbar
- pro Szene clippen; kein Wort der nächsten Szene darf vorgreifen

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 2. Zwischenüberschrift

```tsx
<SceneHeader title="Kontoauszug prüfen" icon="search" />
```

Verbindlich:

- `top = 154`
- mittig
- Sentence Case
- reines Weiß `#FFFFFF`
- Standardgröße 56 px
- Minimum 50 px
- maximal zwei Zeilen bei längeren Titeln
- semantische Farbe primär über das 34-px-Linien-Icon
- keine Capsule / Chip / Pill / Panel
- kein automatisches ALL CAPS
- meist 3–6 Wörter
- Aussage oder Frage, nicht nur Stichwort/Zahl

## 3. V5-Layout

Einzige technische Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header       Y = 154
Visual       Y = 320–1400
Untertitel   bottom = 340
Transition   3 Frames
```

Die visuelle Bühne endet bewusst bei Y1400, damit zweizeilige Captions nicht in Bilder oder Animationen hineinragen.

## 4. Animations-Safe-Zone

`AnimationStage` behält intern das volle 1080×1920-Koordinatensystem, clippt die sichtbare Ausgabe aber hart auf:

```text
Y = 320–1400
```

Damit kann auch fehlerhaft positionierter Phase-1-Code nicht sichtbar in Header- oder Caption-Zone hineinlaufen.

## 5. Quellenhinweis

`SourceNote` liegt zentral oberhalb der Caption-Zone. Die Position kommt aus `REEL_STYLE.sourceNote`; Caption und Quellenhinweis dürfen sich auch bei zwei Caption-Zeilen nicht überdecken.

## 6. V9-Reel-Hintergrund

Der einzige produktive Remotion-Reel-Hintergrund ist:

```text
#000000
statisch
```

Er kommt zentral aus `FinanceBackground`.

Verboten als Hintergrund:

- Partikel
- Aurora
- Grid
- Glow-Feld
- Vignette
- dekorative Gradient-Fläche
- Hintergrundbewegung

`PremiumPhysicalStage` bleibt transparent. Objektmaterialien dürfen lokale Highlights, Schatten und Oberflächenverläufe besitzen.

## 7. Szenenschnitt und Captions

Das finale Voiceover ist die Timing-Autorität:

```text
finales Voiceover
→ echte Wort-Timings
→ Satz-/sinnvolle Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauern
```

Kein starres Raster gleich langer Szenen.

## 8. Animationsfarben

Auf dem schwarzen Canvas gilt `ANIMATION_COLORS`:

- Weiß/Ivory/Soft Gray = neutral
- Grün = Fokus/Lösung
- Rot-Orange = Warnung/Problem/Verlust
- Gold = Geld/Wert

Schwarzer Inhalt darf nicht auf dem schwarzen Canvas verschwinden.

## 9. Gemeinsame Animationssprache

Alle nativen Animationen eines Reels:

- gleiche statische `#000000`-Bühne
- gleiche V5-Visualzone Y320–1400
- stylized 3D animated V9
- klare Hauptaktion
- keine feste Support-Objekt-Anzahl
- keine UI-/Dashboard-/Flowchart-Hauptsprache
- keine Hintergrundeffekte zum Erzeugen von Bewegung

## 10. Phase-1-Verantwortung

Für jede Animationsszene liefert Phase 1 bereits:

```text
scene-XX/
├── remotion.md
└── animation.tsx
```

Technischer Lock:

```text
finanzneo-phase1-animation-code-v1
```

Pflicht:

```text
STARTZUSTAND
→ SICHTBARER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ RESULT mindestens 15 Frames stabil
```

Phase 3 darf den Code nicht ersetzen, vereinfachen oder nach dem Seal verändern.

## 11. Fake-Animationen verboten

- Dummy-/Placeholder-Komponenten
- Debug-Flächen
- Wackelbewegung ohne Aussage
- `Math.sin()`/`Math.cos()` als Frame-Diff-Hack
- reine Zoom/Fade/Zahlen-Popups als gesamte Erklärung
- Partikel/Aurora/Grid/Background-Motion als Animationsnachweis

Bewegung muss den gesprochenen Inhalt erklären.

## 12. Phase-3-Schutz

`reel:ready` versiegelt jede kanonische Phase-1-Animation per SHA-256.

Preflight blockiert u. a.:

- fehlende Animationsquelle
- falschen `componentPath` / Export
- veränderten Hash
- fehlendes Binding
- unvollständige Timeline
- verletzten Pure-Black-Background-Vertrag

Post-Render-QA prüft danach den echten visuellen Kern. Header, Caption oder schwarzer Hintergrund allein zählen nicht als Szenenvisual.

## 13. Bilddauer und Übergänge

- Bildbeat ideal 3,5–5,5 s
- absolut max. 6 s
- länger = splitten oder animieren
- Continuity-Schnitt exakt 3 Frames
- kein Fade-to-black

## 14. Renderqualität und Mobil-QA

Finale Produktion ausschließlich über den validierten Phase-3-Pfad.

Prüfen:

1. Header Y154, 56 px, weiß, max. zwei Zeilen, keine Capsule.
2. Visual nutzt Y320–1400 sinnvoll.
3. Caption bottom340, aktives Wort grün.
4. Quellenhinweis überlappt die Caption nicht.
5. Animationen bleiben sichtbar innerhalb Y320–1400.
6. freier Hintergrund bleibt schwarz und statisch.
7. jede Bildszene zeigt das echte Nutzerbild.
8. jede Animation zeigt Start → Mechanismus → Ergebnis.
9. Animation bleibt auch ohne Ton grundsätzlich verständlich.
10. keine Background-Partikel/Aurora/Grid/Glow-Flächen.
11. komplette MP4 enthält Audio und korrekte Timeline.
12. `FINAL_COMPLETE` erst nach bestandener Render-QA und Export.
