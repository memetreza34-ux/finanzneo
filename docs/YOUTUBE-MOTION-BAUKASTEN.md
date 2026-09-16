# YouTube Motion-Baukasten

> Inventar für Phase 1. Was hier nicht steht, existiert nicht — keine Komponente und keinen Dateinamen erfinden.

Kanonische Quelle: `src/youtube/motion-kit.tsx`
Import in jeder `animation.tsx`: `from '../../motion-kit'`

Der Pfad ist in jedem Projekt gleich. `04-projekt/motion-kit.tsx` ist nur ein Weiterleiter auf den gemeinsamen Baukasten; Inhalt gehört nie dorthin.

## Warum es diesen Baukasten gibt

Vorher hatte jedes Projekt eine eigene kleine `motion-kit.tsx` mit genau drei Dingen: Bühne, Panel, Farben. Phase 1 hatte damit nichts als beschriftete Kästen zur Hand — und genau die verbietet `CLAUDE.md` Abschnitt 11 als Hauptsprache. Die Bibliothek mit 149 Komponenten, 27 Icons und 14 Lottie-Dateien lag ungenutzt daneben.

## Composition und Timeline

`src/youtube/timeline.ts` leitet die Szenen ab, `src/youtube/YouTubeVideo.tsx` rendert sie.

**Schnitte folgen den Satzgrenzen aus `word-timings.json`.** Eine Szene läuft von einem Satzanfang bis zum Ende ihres letzten Satzes. Dadurch werden Szenen automatisch unterschiedlich lang, und der Ton liegt nie mitten in einem Schnitt.

Jedes Visual bekommt dafür in `visual-index.json` eine `sentenceSpan`:

```json
{"id": "visual-01", "type": "image", "sentenceSpan": {"from": 1, "to": 3}}
```

Fehlt sie, teilt der Builder die Sätze der Reihe nach zu und schreibt für **jede** so erzeugte Szene einen Hinweis in `timeline.notes`. Diese Hinweise sind vor dem Render zu lesen — die Zuteilung kennt den Inhalt nicht.

`validateYouTubeTimeline` prüft:

- keine Lücke und keine Überlappung zwischen Szenen
- keine Szene kürzer als ein Szenenwechsel braucht
- **nicht alle Szenen exakt gleich lang** — dann folgte der Schnitt einem Raster statt dem Voiceover
- Timeline-Länge passt auf 1,5 s zur Audiolänge

**Bindung wie beim Reel.** Jede Animations-, Hybrid- und Data-Szene braucht einen Eintrag in `animations`. Fehlt einer, bricht der Render hart ab — kein Text-, CTA- oder Schwarzbild-Ersatz. `missingYouTubeBindings` und `missingYouTubeImages` melden alles gesammelt, bevor gebündelt wird.

**Assets** liegen unter `public/<assetBase>/images/` und `public/<assetBase>/audio/`, referenziert über `staticFile` — dasselbe Muster wie bei den Reels.

Szenenwechsel laufen über eine kurze Deckkraft- und Versatzüberlappung. **Schwarzblenden sind verboten**: auf einer schwarzen Welt wirken sie wie ein Aussetzer.

Zum Anschauen: `YouTubeVideoDemo` im Studio — Bildszene, Animationsszene und Hybrid aus einer echten Timeline.

## Layout V1 — 1920 × 1080

Kanonische Quelle: `src/youtube/layout.ts`. Projekte überschreiben diese Werte nicht.

```text
  0 – 180     Kopfbahn        YouTubeHeader — Zwischenüberschrift + Icon
180 – 990     Visualzone      Bild 1440 × 810 bei x = 240 (drei Viertel der Breite)
990 – 1080    Infobahn        YouTubeInfoText — optional, eine Zeile
```

| Komponente | Aufgabe |
|---|---|
| `YouTubeStage` | schwarzer Vollframe |
| `YouTubeHeader` | Zwischenüberschrift mit Icon, nutzt denselben `SceneHeader` wie die Reels |
| `YouTubeImage` | Flow-Bild in der Visualzone, `object-fit: contain` |
| `YouTubeAnimationFrame` | Bühne für native Motion |
| `YouTubePhysicalStage` | Perspektive für die Physical-Primitives |
| `YouTubeInfoText` | optionale einzeilige Notiz unten |

**Keine Untertitel.** Reels laufen stumm im Feed und brauchen Karaoke-Captions. Longform wird mit Ton geschaut. Unten steht höchstens kurzer Infotext — dieselbe Rolle wie ein Label in einer Animation, kein mitlaufender Sprechtext.

**Das Bild steht bewusst kleiner als der Frame.** Es ist 16:9 wie das Video, also entstehen links und rechts schwarze Ränder. Weil die Bildwelt reines Schwarz vorschreibt, gehen die Kanten in die Videofläche über — es ist kein Kasten sichtbar, nur ein Bild mit Luft darüber für die Überschrift.

**Animationen bekommen die volle Breite**, aber `YouTubeAnimationFrame` schneidet die Kopf- und Infobahn hart ab. Das Koordinatensystem bleibt volle 1920 × 1080, damit Phase-1-Code in echten Framekoordinaten schreiben kann. Was in die Bahnen hineingezeichnet wird, ist einfach nicht sichtbar, statt mit der Überschrift zu kollidieren.

**`PremiumPhysicalStage` aus dem Reel-Baukasten nicht verwenden.** Sie clippt über `AnimationStage` mit `inset(320px 0 520px 0)` aus den Reel-Tokens; in einem 1080 hohen Frame schneidet das bei y = 560 ab. `YouTubePhysicalStage` gibt dieselbe Perspektive ohne Reel-Clipping.

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

## Was der Validator prüft

`npm run youtube:animation:validate -- <Projekt>` prüft seit der Bildsprachen-Erweiterung nicht mehr nur den Vertrag in `visual-index.json`, sondern auch den Code:

| Regel | gilt für | warum |
|---|---|---|
| keine Pfeile oder Haken als Textzeichen (`↗︎` `↻` `✓`) | alle Motion-Visuals | Typografie ist kein Visual. Es gibt `Icon` mit `arrowRight`, `check`, `cross`, `trending` |
| mindestens zwei unabhängige Motion-Treiber | alle Motion-Visuals | codeseitiges Gegenstück zu den zwei Motion Channels, die der Vertrag ohnehin verlangt |
| sichtbare Transformation, nicht nur Fade und Zoom | nur `type: animation` | bei `hybrid` trägt das Flow-Bild und bei `data` der Chart einen Teil der Aussage; bei einer reinen Animation trägt die Bewegung sie allein |

Als sichtbare Transformation zählt: `translate`, `rotate`, `clipPath`, `strokeDash`, `skew`, `perspective`, ein interpoliertes SVG-`d`, oder eine frameabhängige Ausdehnung über `width`, `height`, `top`, `left`, `bottom`.

Die Regeln liegen in `scripts/lib/youtube-motion-contract.mjs` als `validateYouTubeMotionSource` und sind in `tests/youtube-motion-v3.test.ts` abgedeckt.

## Verboten als Hauptsprache

Aus `CLAUDE.md` Abschnitt 11:

- drei beschriftete Kästen nach dem Muster A → B → C
- Lade- oder Fortschrittsbalken als Ersatz für die eigentliche Animation
- reine Texttafeln mit Fade oder Scale
- generische Shield-, Arrow- oder Coin-Symbolik, wenn eine Alltagssituation darstellbar ist
- dieselbe Mechanik mehrfach im selben Video
- `Math.random`, `Date.now`, `setTimeout`, CSS `animation:` oder `transition:`

Jede Szene braucht Startzustand, sichtbaren Mechanismus und eindeutiges Ergebnis, plus mindestens zwei unabhängige Motion Channels.
