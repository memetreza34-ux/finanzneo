# FinanzNeo YouTube Motion V3

MOTION_STANDARD: finanzneo-youtube-motion-v3
MOTION_WORLD: finanzneo-youtube-open-motion-v1

Dieser Standard gilt für YouTube-Longform-Motion in 16:9.

Die zentrale Regel lautet:

> Es gibt **keine feste Animationswelt**. Für jede Szene wird die beste visuelle Welt neu gewählt.

Kanonische Detailregel:

```text
docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md
```

## Fest bleibt nur

- 1920 × 1080
- 16:9
- deterministische Remotion-Animation
- klare inhaltliche Erklärung
- saubere technische Ausführung
- hochwertige visuelle Qualität

## Nicht festgelegt

Nicht festgelegt sind:

- Hintergrund
- Palette
- 2D / 2.5D / 3D
- Kamera
- Illustrationsstil
- Metapher
- Chart / Vergleich / Objektwelt
- hell / dunkel
- statische Bildwelt
- vorherige Animationswelt

Jede Szene darf eine komplett andere Art-Direction haben.

## Erlaubte Richtungen

Alles ist erlaubt, wenn es für den Sprechpunkt gut funktioniert:

- minimaler Zahlenvergleich
- Before / After
- Chart
- Timeline
- Dokument
- Split-Screen
- Editorial Illustration
- geometrische Abstraktion
- dunkle technische Welt
- helle minimalistische Welt
- Full 3D
- 2.5D
- physische Metapher
- Simulation
- Netzwerk
- Map
- Kamera-Reise
- kinetic typography
- Bild + Remotion
- komplett eigene Custom-Welt

Keine dieser Richtungen ist Standard oder Pflicht.

## Core rule

```text
SCRIPT BEAT
→ VIEWER CHANGE
→ 3 VERSCHIEDENE KONZEPTE / ART-DIRECTIONS
→ BESTE IDEE WÄHLEN
→ KEYFRAMES PLANEN
→ REMOTION BAUEN
→ PAYOFF
```

## Drei Konzepte

Vor dem Coding müssen drei wirklich unterschiedliche Ansätze entstehen.

Beispiel "Gebühren":

A — einfacher Vergleich:
zwei Linien wachsen, eine endet sichtbar niedriger.

B — physische Metapher:
ein Tank füllt sich, während Gebühren unten herauslaufen.

C — dunkle 3D-Welt:
Kapitalblöcke bewegen sich durch ein System und Gebühren werden herausgezogen.

Alle drei sind valide.

Gewählt wird die stärkste Lösung — nicht die, die am ähnlichsten zur Bildwelt aussieht.

## Keyframe QA

Pflicht:

- 10 % START
- 35 % MECHANISMUS
- 65 % KONSEQUENZ
- 90 % PAYOFF

Bewertet werden:

- Verständlichkeit
- Komposition
- visuelle Entwicklung
- Timing
- professioneller Eindruck
- Stärke des Ergebnisses

Nicht bewertet wird, ob die Szene wie Flow oder eine frühere Animation aussieht.

## Kamera

Es gibt keinen Kamera-Default.

Erlaubt:

- still
- push
- pull
- pan
- follow
- orbit
- track
- reframe
- zoom
- macro-to-micro

Kamera wird nur nach Story-Nutzen bewertet.

## Technik

Offen:

- React / DOM
- SVG
- Canvas
- @remotion/paths
- @remotion/shapes
- @remotion/transitions
- @remotion/layout-utils
- @remotion/effects
- @remotion/motion-blur
- Lottie
- Three.js / R3F
- Recharts
- Bildkomposition
- Custom-Techniken

Auch neue Libraries sind erlaubt, wenn sie eine echte Lücke schließen.

## Einfach und komplex sind beide erlaubt

Ein simpler Vergleich kann 10/10 sein.

Eine aufwendige 3D-Szene kann ebenfalls 10/10 sein.

Komplexität ist kein Qualitätsmerkmal.

Die Qualität hängt davon ab, wie gut der visuelle Mechanismus zum Inhalt passt.

## Source requirements

Produktive animation.tsx:

- nutzt useCurrentFrame()
- nutzt interpolate() und/oder spring()
- ist deterministisch
- enthält keine Platzhalter
- hat keinen Runtime-Fetch
- nutzt keine Timer/CSS-Animation als Render-Mechanik
- exportiert die vereinbarten Motion-Metadaten
- hat START und RESULT

## Was wirklich verboten ist

Nur echte Qualitätsprobleme:

- unlesbar
- irreführend
- faktisch falsch
- kaputt
- schlechte Hierarchie
- schlechtes Timing
- sinnlose Bewegung
- offensichtlicher Placeholder
- zufällige Überschneidungen
- visuelles Chaos, das die Erklärung zerstört

Eine komplette Stilfamilie wird **nicht** im Voraus verboten.

## Final rule

> There is no required animation style. There is only a required quality level.

Und:

> Jede Szene darf ihre eigene visuelle Welt bekommen.
