# Szenen

## Bildwelt zuerst

1. `bildwelt.txt` mit dem Bildgenerator ausführen.
2. Das echte Ergebnis als `bildwelt-referenz.png` in diesem Ordner speichern.
3. Bei jeder Bildszene dieselbe Referenz ausschließlich als Stil-, Kamera-, Licht-, Material- und Umgebungsreferenz verwenden.

World ID:

```text
finanzneo-connected-studio-v3
```

## Bildszene

```text
EINZELNE-SZENEN/scene-XX/
├── bildprompt.txt
├── szene.md
└── später genau ein finales Bild
```

Das Bild enthält keinen Text und zeigt eine zusammenhängende FinanzNeo-Studioumgebung statt eines isolierten Objekts vor leerem Hintergrund.

## Remotion-Szene

```text
EINZELNE-SZENEN/scene-XX/
├── remotion.md
└── szene.md
```

## Verboten

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in Szenenordnern
- Bildprompt und Remotion-Spezifikation in derselben Szene
- mehr als ein finales Bild pro Bildszene
- Text oder Zahlen im generierten Bild
- zufällige neue Bildwelt pro Szene

## Darstellung

- Vordergrundbild: `contain`
- zentrale FinanzNeo-Studiobühne als Hintergrund
- keine sichtbare unscharfe Bildkopie
- Source-Crop pro Seite maximal `0.20`
- Gesamt-Crop maximal `0.34`
- zusätzliche Skalierung maximal `1.04`
