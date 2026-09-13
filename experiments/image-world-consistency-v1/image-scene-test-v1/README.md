# FinanzNeo Pure Image Scene Test V1

## Ziel

Dieser Test prüft ausschließlich **reine Bildszenen** im fertigen Reel-Layout.

Eine Bildszene besteht aus:

- FinanzNeo-Überschrift oben
- passendem Icon im Header
- einem großen FinanzNeo-Bild als einzigem Hauptvisual
- FinanzNeo-Untertitel unten

## Harte Regel für diesen Test

Das Bild wird **nicht** mit einer zusätzlichen Erkläranimation überlagert.

Nicht erlaubt:

- Geldfluss-Overlays
- animierte Pfeile über dem Bild
- Parallax als Erklärmechanik
- zusätzliche Diagramme über dem Bild
- animierte Fokusmasken
- Lottie über dem Hauptbild
- Remotion-Objekte, die die Bildaussage noch einmal nachbauen

Erlaubt bleiben:

- Header + Icon
- Untertitel
- kurze funktionale Beschriftungen, die bereits Bestandteil des generierten Bildes sind
- normale Szenenwechsel zwischen zwei Szenen

## Test-Composition

`ReelsTestFinanceImageScenes`

## Enthaltene Szenen

1. Notgroschen / Waschmaschine
2. Wasserschaden / Versicherung
3. ETF / Diversifikation

Die drei vorhandenen Testbilder stammen aus dem vorherigen Bildwelt-Test und bleiben das alleinige Hauptvisual.

## Abgrenzung zur Animationsszene

Eine spätere Produktionsszene wird in Phase 1 eindeutig als **IMAGE** oder **ANIMATION** geplant.

- `IMAGE`: Bild + Header/Icon + Captions
- `ANIMATION`: individuelle Remotion-/SVG-/Lottie-/Icon-Animation + Header/Icon + Captions

Ein Bild soll nicht nachträglich mit einer zweiten großen Erkläranimation überladen werden.

## Bestehen

Der Test ist bestanden, wenn:

- die Bilder groß und klar lesbar wirken
- Header und Icon sauber über dem Bild sitzen
- Captions sauber darunter liegen
- das Bild die Szene alleine trägt
- keine unnötige Zusatzanimation vom Bild ablenkt
- alle drei Szenen weiterhin wie dieselbe FinanzNeo-Welt wirken
