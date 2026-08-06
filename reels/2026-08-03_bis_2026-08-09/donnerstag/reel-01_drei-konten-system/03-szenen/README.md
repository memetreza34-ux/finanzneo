# Szenen — Drei-Konten-System

## Exakte Verteilung

| Typ | Szenen | Anteil |
|---|---|---:|
| Bild | 01, 02, 03, 05, 07, 10 | 60 % |
| Remotion-Animation | 04, 06, 08, 09 | 40 % |

## Bildablage

Bei einer Bildszene liegt das fertige Bild direkt im passenden Ordner:

```text
EINZELNE-SZENEN/scene-01/
├── bildprompt.txt
├── motionprompt.txt
├── placeholder.svg
├── szene.md
└── DEIN-FERTIGES-BILD.png
```

Sobald ein finales PNG, JPG, JPEG, WEBP oder AVIF vorhanden ist, ignoriert der Asset-Sync automatisch `placeholder.svg`. Pro Bildszene darf höchstens ein finales Bild liegen.

## Animationen

Die Szenen 04, 06, 08 und 09 benötigen kein generiertes Bild. Ihre Umsetzung steht in `remotion.md`; der Code liegt in `src/reels/drei-konten/DreiKontenSystem.tsx`.

## Sammeldateien

- `alle-bildprompts.txt`: Cover + sechs Bildprompts
- `alle-motionprompts.txt`: Motion-Anweisung für alle zehn Szenen
- `scene-index.json`: eindeutige Zuordnung von Typ, Dauer, Prompt, Bild oder Remotion-Komponente
