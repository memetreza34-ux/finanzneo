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
├── finales-bild.png   ← erst nach der Generierung
└── szene.md
```

Vor der Bildgenerierung enthält der Ordner absichtlich nur `bildprompt.txt` und `szene.md`. Es gibt dort kein Platzhalterbild.

Die Standbildbewegung wird zentral in `src/reels/drei-konten/shared.tsx` gesteuert. Es gibt keine zusätzliche Motionprompt-Datei.

### Remotion-Szene

```text
scene-04/
├── remotion.md
└── szene.md
```

Die Animation wird vollständig als React-/Remotion-Code umgesetzt. Es gibt weder Bildprompt, Bilddatei noch Motionprompt.

## Verbote

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem Szenenordner
- `bildprompt.txt` und `remotion.md` in derselben Szene
- Bilddateien in einer Remotion-Szene

## Bildablage

Das finale PNG, JPG, JPEG, WEBP, AVIF oder SVG wird direkt in den passenden Bildszenenordner gelegt. Pro Bildszene darf höchstens eine finale Bilddatei liegen.

Technische Vorschau-Fallbacks liegen ausschließlich zentral unter `public/reels/drei-konten-system/`. Dadurch bleiben die redaktionellen Szenenordner sauber und eindeutig.

## Sammeldatei

`alle-bildprompts.txt` enthält Cover zuerst und danach ausschließlich die sechs Bildprompts in chronologischer Reihenfolge.
