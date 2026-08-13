# Layout Contract — strict-header-visual-caption-v1

1080 × 1920, 30 fps.

## 1. Header
- Y = 56–250
- Hauptüberschrift: 50–58 px, weiß, maximal 2 Zeilen
- Unterüberschrift: 28–34 px, Mint/Gold/Rot nur semantisch, maximal 2 Zeilen
- keine Icons als Ersatz für Aussage
- Header darf niemals in den Visualbereich hineinragen

## 2. Visualfenster
- harte technische Clip-Grenze: Y = 300–1320
- Höhe = 1020 px
- Bilder und Animationen werden ausschließlich innerhalb dieses Fensters sichtbar gerendert
- mindestens 50 px Abstand zwischen Headerende und Visual
- keine wichtigen Objekte außerhalb des Fensters
- Remotion-Animationen erhalten `overflow: hidden`
- Flow-Bilder werden bereits mit allen wichtigen Elementen im Quellbereich Y=300–1320 generiert
- bei Bildern wird exakt dieser Quellbereich in das Visualfenster gemappt; darüber/darunter bleibt der native FinanzNeo-Hintergrund

## 3. Caption
- Caption-Safe-Area: ungefähr Y = 1440–1665
- links 72 px
- rechts 180 px wegen Plattform-UI
- maximal 2 Zeilen
- pro Meaning Unit höchstens 12 Wörter und 68 Zeichen
- effektive Schriftgröße mindestens 42 px
- gesprochenes Wort grün, restliche Wörter weiß
- niemals über Visualinhalt legen

## 4. Unterer Plattformbereich
- unterhalb ca. Y = 1665 keine Pflichtinformation
- untere 255 px für Plattformbedienung/visuelle Luft reservieren

## 5. Animations-QA
Eine Animation ist nur freigegeben, wenn alle Punkte erfüllt sind:
1. eigener Startzustand
2. sichtbare Handlung/Transformation
3. klarer Endzustand
4. Mechanismus ohne Voiceover grob verständlich
5. nutzt den Mittelbereich sinnvoll
6. keine reine Zahl-/Icon-/Balkenkarte
7. mindestens drei zeitliche Phasen
8. keine Bewegung außerhalb Y=300–1320

## 6. Bild-QA
1. Bildaussage passt exakt zum Voice-Beat
2. Hauptmetapher in ca. 1 Sekunde erkennbar
3. alle relevanten Inhalte im Quellbereich Y=300–1320
4. keine Überschrift im Szenenbild
5. nur explizit erlaubte kurze Objektlabels
6. keine abgeschnittenen Motive/Labels/Gesichter
7. ein nahtloser Hintergrund ohne Bänder/Horizont
