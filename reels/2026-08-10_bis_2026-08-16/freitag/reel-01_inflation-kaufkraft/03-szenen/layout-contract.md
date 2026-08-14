# Layout Contract — Inflation/Kaufkraft

1080 × 1920, 30 fps.

## Harte Bereiche
- Header: Y=56–250
- Sicherheitsabstand: Y=250–300
- VisualViewport: Y=300–1320, `overflow: hidden`
- Abstand: Y=1320–1440
- Karaoke-Caption: ungefähr Y=1440–1665
- Platform-UI-Safe-Area: ab ungefähr Y=1665

## Verbindlich
- kein Bild, Diagramm, Icon, Geldobjekt, Gesicht oder Animationspartikel außerhalb Y=300–1320
- Headline und Subheadline ausschließlich im Header
- Voice-Captions ausschließlich unterhalb des VisualViewport
- Flow-Bilder werden in Remotion mit `object-fit: contain` ausschließlich im VisualViewport gezeigt
- Hintergrund bleibt über 1080×1920 nahtlos und einheitlich
- keine sichtbaren Header-/Footer-Karten

## Animationsgate
Eine Remotion-Szene gilt nur dann als echte Animation, wenn sie mindestens drei Phasen besitzt:
1. Startzustand
2. sichtbare Handlung / Mechanismus
3. Ergebniszustand

Nicht ausreichend: einzelnes Icon, Emoji, Zahl, statischer Balken, Karte oder Text mit bloßem Fade/Zoom.
