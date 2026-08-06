# Szenen — Drei-Konten-System

## Exakte Verteilung

| Typ | Szenen | Anteil |
|---|---|---:|
| Bild | 01, 02, 03, 05, 07, 10 | 60 % |
| Remotion-Animation | 04, 06, 08, 09 | 40 % |

## Verbindlicher Ein-Quellen-Vertrag

### Bildszene

```text
scene-01/
├── bildprompt.txt
├── placeholder.svg oder finales-bild.png
└── szene.md
```

Die Standbildbewegung wird zentral in `src/reels/drei-konten/shared.tsx` gesteuert. Es gibt keine zusätzliche Motionprompt-Datei.

### Remotion-Szene

```text
scene-04/
├── remotion.md
└── szene.md
```

Die Animation wird vollständig als React-/Remotion-Code umgesetzt. Es gibt weder Bildprompt noch Motionprompt.

## Verbote

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `bildprompt.txt` und `remotion.md` in derselben Szene
- Bildplatzhalter in einer Remotion-Szene

## Bildablage

Sobald in einer Bildszene ein finales PNG, JPG, JPEG, WEBP oder AVIF liegt, ignoriert der Asset-Sync automatisch `placeholder.svg`. Pro Bildszene darf höchstens ein finales Bild liegen.

## Sammeldatei

`alle-bildprompts.txt` enthält Cover zuerst und danach ausschließlich die sechs Bildprompts in chronologischer Reihenfolge.
