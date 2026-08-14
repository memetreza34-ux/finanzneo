# Layout Contract — Inflation/Kaufkraft V19

1080 × 1920, 30 fps.

## Neue verbindliche Positionierung
- Header: ungefähr Y=48–232
- Native Remotion-Visuals: ungefähr Y=242–1390
- Karaoke-Caption: deutlich höher als vorher; `bottom=430`
- Caption links: 72 px
- Caption rechts: 170 px
- untere Platform-UI-Safe-Area bleibt frei

## Bildszenen — Full Frame
Die vier finalen Google-Flow-Bilder werden **nicht mehr in einen kleinen mittleren Container gepackt**.

Verbindlich:
- Bild 01, 04, 07 und 10 füllen die komplette 1080×1920-Szene.
- `object-fit: contain` auf der kompletten 1080×1920-Fläche; bei korrekter 9:16-Quelle entsteht kein Crop.
- kein sichtbares Poster-im-Poster
- kein Inset-Rechteck
- keine unscharfe Kopie als Hintergrund
- Hero-Motiv im Flow-Prompt ungefähr 820–980 px breit anlegen
- oben ungefähr 250 px ruhiger Hintergrund für die Remotion-Headline
- unten ungefähr 500 px ruhiger Hintergrund für Karaoke-Caption und Plattform-UI
- Hintergrund bleibt eine einzige nahtlose deep-charcoal-green-black Bildwelt

## Cover — Ausnahme bei Text
`Bild 00 - Inflation Kaufkraft Cover.png` wird komplett von Google Flow gestaltet.

Google Flow rendert selbst exakt:
- `10.000 € AUF DEM KONTO`
- `WIE VIEL KAUFKRAFT BLEIBT?`

Für den Cover-Text ist **kein Remotion-Overlay** erlaubt. Falsche Typografie oder falsche Zeichen = Cover neu generieren.

## Untertitel
Die Karaoke-Caption liegt nicht mehr so tief wie im ersten Render.

Ziel:
- ungefähr im Bereich Y≈1430–1530 statt nahe der unteren Kante
- maximal zwei Zeilen
- eine semantische Einheit gleichzeitig
- aktives Wort grün
- rechte Plattform-Buttons bleiben frei

## Animationsgate V19
Eine Remotion-Szene gilt nur dann als gute Animation, wenn sie mindestens drei sichtbare Phasen besitzt:
1. Startzustand
2. physisch verständliche Handlung / Mechanismus
3. Ergebniszustand

Zusätzlich verboten:
- kleine Infografik-Karte als Hauptvisual
- einzelnes Icon mit Zoom
- statischer Balken mit Fade
- reine Zahlanimation ohne Mechanismus
- kleines Liniendiagramm, wenn ein physischer Vergleich besser erklärbar ist

Die sechs V19-Animationen verwenden deshalb große Warenkörbe, Preis-Tags, Kaufkraft-Elemente, Wertbehälter und wachsende Euro-Stapel als dominante Metaphern.
