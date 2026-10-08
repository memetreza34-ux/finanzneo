# FinanzNeo YouTube Motion V3

MOTION_STANDARD: finanzneo-youtube-motion-v3
MOTION_WORLD: finanzneo-youtube-light-motion-v2

YouTube-Longform wird direkt für 1920 × 1080 / 16:9 gestaltet.

## Aktive Richtung

- hell
- sauber
- 2D / flache Grafik
- unterschiedliche Designs erlaubt
- kein Full-3D
- keine pseudo-3D-Blöcke
- keine dunklen oder schwarzen Szenen
- keine großen generischen Szenenüberschriften

Die statische Flow-Bildwelt muss nicht 1:1 kopiert werden. Die Motion-Welt darf eigene Designs entwickeln, solange sie hell, klar und hochwertig bleibt.

## Erlaubte Designfamilien

- minimaler Vergleich
- Tabelle
- KPI / Stats
- Balken-, Linien-, Donut-, Waterfall- und andere Diagramme
- Timeline
- Icons
- Flow-Diagramm
- Funnel
- Dokument
- Prozess
- Route / Journey
- Heatmap
- Scatterplot
- Progress / Gauge
- abstrakte 2D-Geometrie
- helle Custom-Illustration

## Text

Nur inhaltsbezogene Texte:

- Werte
- Kategorien
- Prozentwerte
- Tabellenköpfe
- Achsen
- kurze Callouts

Keine Präsentationsüberschriften wie:

- "BAR CHART"
- "STATS"
- "TIMELINE"
- "WATERFALL"

und keine großen erklärenden Headlines innerhalb der Animationsfläche.

## Planung

Vor dem Coding:

1. drei unterschiedliche helle 2D-Konzepte
2. stärkstes Konzept auswählen
3. 10 / 35 / 65 / 90 Prozent Keyframes planen
4. Remotion bauen
5. visuell prüfen

## Technik

Bevorzugt:

- React / SVG / CSS
- @remotion/paths
- @remotion/shapes
- Recharts wenn sinnvoll
- Masks / Clip Paths
- deterministische Frame-Animation

Three.js ist für normale YouTube-Szenen nicht der Standard und Full-3D ist in dieser Richtung nicht vorgesehen.

## Final rule

> Light, clean, 2D, content-first. Different designs are welcome. No decorative headline. No 3D.
