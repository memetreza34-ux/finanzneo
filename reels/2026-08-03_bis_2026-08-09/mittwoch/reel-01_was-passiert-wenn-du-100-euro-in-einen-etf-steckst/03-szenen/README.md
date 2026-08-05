# Szenen

- `alle-bildprompts.txt`: alle Bildprompts direkt hintereinander
- `EINZELNE-SZENEN`: jede Szene einzeln mit Prompt, Szenenbeschreibung und dem dazugehörigen Bild
- `scene-index.json`: Reihenfolge, Typ und genaue Pfade aller Szenen

## Verbindliche Ablage

Bei einer Bildszene kommen Prompt und Bild in denselben Ordner:

```text
EINZELNE-SZENEN/scene-01/
├── bildprompt.txt
├── scene-01-hook.png
└── szene.md
```

Entsprechend gilt dies auch für Szene 03, 04, 06 und 07. Die Animationsszenen enthalten stattdessen `animation.md`.

Es gibt keinen zusätzlichen Ordner `BILDER-HIER-EINFUEGEN` mehr.
