# YouTube Motion-Baukasten

> Inventar für Phase 1. Was hier nicht steht, existiert nicht — keine Komponente und keinen Dateinamen erfinden.

Kanonische Quelle: `src/youtube/motion-kit.tsx`
Import in jeder `animation.tsx`: `from '../../motion-kit'`

Der Pfad ist in jedem Projekt gleich. `04-projekt/motion-kit.tsx` ist nur ein Weiterleiter auf den gemeinsamen Baukasten; Inhalt gehört nie dorthin.

## Warum es diesen Baukasten gibt

Vorher hatte jedes Projekt eine eigene kleine `motion-kit.tsx` mit genau drei Dingen: Bühne, Panel, Farben. Phase 1 hatte damit nichts als beschriftete Kästen zur Hand — und genau die verbietet `CLAUDE.md` Abschnitt 11 als Hauptsprache. Die Bibliothek mit 149 Komponenten, 27 Icons und 14 Lottie-Dateien lag ungenutzt daneben.

## Bühne und Timing

| | |
|---|---|
| `MotionStage` | schwarze Vollbild-Bühne, `transparent` für Overlays |
| `Panel` | Rahmen. **Keine Erklärung.** Eine Szene nur aus Panels ist keine Animation |
| `COLORS` | `black` `white` `gray` `green` `red` `gold` `panel` `line` |
| `progressBetween(frame, durationInFrames, 0.1, 0.3)` | Beat als Anteil der Szenendauer |
| `frameAt(durationInFrames, 0.4)` | Frame als Anteil, für `spring({frame: frame - frameAt(...)})` |
| `clamp01` | auf 0–1 begrenzen |
| `FinanceEyebrow` · `FinanceValue` | kleine Überschrift, große Zahl |

**Immer `progressBetween` statt fester Framezahlen.** Phase 3 retimed jede Szene auf das echte Voiceover; harte Frames erzeugen dabei einen eingefrorenen Schwanz.

## Physische Objekte

Alle nehmen `x`, `y` und meist `scale` — koordinatengesteuert und damit direkt 16:9-tauglich.

```text
PhysicalBill          x y amount label? rotate? scale? opacity? paid?
PhysicalAccount       x y ... scale?
PhysicalWasher        x y broken? scale? opacity?
PhysicalReserveTank   x y width? height? ...
PhysicalCalendarPage  x y ... scale? opacity?
PhysicalCoinStack     x y ...
PhysicalObject        x y width height ...
PhysicalTag           x y ...
PhysicalRail          x y width ...
PremiumPhysicalStage  Bühne für die Physical-Primitives
PremiumDepthGuide     Tiefenhilfe
```

`PhysicalObject`, `PhysicalTag` und `PhysicalRail` sind Support. `PhysicalRail` darf eine Szene nie allein tragen.

## Icons

`<Icon name="euro" size={96} color={COLORS.gold} />` — Props: `name` `size` `color` `stroke` `glow` `opticalNormalize` `style`.

27 verfügbar:

```text
arrowRight  bank      bulb      calendar  chart-bar  chart-up  check
clock       coins     cross     document  euro       flame     hourglass
list        lock      percent   phone     receipt    repeat    rocket
search      shield    target    trending  wallet     warning
```

Ein Icon ersetzt keinen Vorgang. Ein als Text gesetzter Pfeil (`↗︎`, `↻`) ist kein Icon und keine Animation.

## Lottie

`<LottieBox file={lottieFile('zeit')} size={300} />` — lokal aus `public/lottie/`, deterministisch gerendert, **kein Loop als Standard**.

14 verfügbar:

```text
geldboerse  konfetti  lupe     muenze   muenzen  sicherheit  sparschwein
trend       trendauf  wachstum warenkorb warnung  zeit        ziel
```

Lottie ist Supportbewegung — Check, Warnung, Uhr, Dokument. Niemals der Hauptstil.

## Was sonst verfügbar ist

Installiert und einsetzbar, bisher in keiner YouTube-Animation genutzt:

```text
three · @react-three/fiber · @remotion/three   echtes 3D
@remotion/motion-blur                          Bewegungsunschärfe
@remotion/effects · @remotion/transitions      Effekte, Übergänge
@remotion/paths · @remotion/shapes             SVG-Pfade und Formen
recharts                                       Charts
src/bausteine (149 Komponenten in 20 Modulen)  über src/design-system
```

Die Bausteine sind für das Reel-Format 1080 × 1920 gebaut. Vor dem Einsatz im 16:9-Frame prüfen, ob die Komponente koordinatengesteuert ist.

## Palette

YouTube hat bewusst eine eigene Palette. Die Reel-Tokens in `src/brand/tokens.ts` sind grünstichig dunkel (`bg:#0A1A0F`); die Bildwelt `finanzneo-youtube-cg-animated-black-v2` verlangt reines Schwarz, damit Flow-Bild und Remotion-Fläche nahtlos ineinander übergehen.

```text
black  #050505   die Welt
white  #F7F7F2   neutraler Text
gray   #A7ADB4   sekundär
green  #2DD881   Reserve, Lösung, positiver Wert
red    #FF6B4A   Kosten, Verlust, Warnung
gold   #D8B15A   Geld, Wert
panel  #111315   Panel-Fläche
line   #2A2F34   Kanten
```

## Verboten als Hauptsprache

Aus `CLAUDE.md` Abschnitt 11:

- drei beschriftete Kästen nach dem Muster A → B → C
- Lade- oder Fortschrittsbalken als Ersatz für die eigentliche Animation
- reine Texttafeln mit Fade oder Scale
- generische Shield-, Arrow- oder Coin-Symbolik, wenn eine Alltagssituation darstellbar ist
- dieselbe Mechanik mehrfach im selben Video
- `Math.random`, `Date.now`, `setTimeout`, CSS `animation:` oder `transition:`

Jede Szene braucht Startzustand, sichtbaren Mechanismus und eindeutiges Ergebnis, plus mindestens zwei unabhängige Motion Channels.
