# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument ist der verbindliche Stilanker für alle zukünftigen FinanzNeo-Bildszenen. Einzelne Bilder dürfen unterschiedliche Inhalte zeigen, müssen aber sichtbar aus derselben Welt stammen.

## 1. Serienprinzip

Alle Bilder eines Reels verwenden dieselben unveränderlichen Eigenschaften:

- gleiche leicht isometrische Drei-Viertel-Kamera
- gleiche Brennweitenwirkung, ungefähr 35-mm-Äquivalent
- gleiche Kamerahöhe und gleiche Blickrichtung
- gleiche dunkel-anthrazitfarbene Studioarchitektur
- gleicher nahtloser Übergang von Rückwand zu Boden
- gleiche smaragdgrünen Lichtkanäle
- gleiche matte Materialien und zurückhaltenden Glasflächen
- gleiche Lichtführung: weiches Hauptlicht links oben, grünes Kantenlicht rechts
- Gold ausschließlich für Geld und finanzielle Werte
- Rot ausschließlich für Risiko, Verlust oder blockierte Ausgaben

Das Ergebnis soll wie eine fortlaufende Serie wirken, nicht wie Bilder aus verschiedenen Generatoren.

## 2. Keine leeren Hintergründe

Die Welt ist niemals ein leerer schwarzer Raum und niemals nur ein freigestelltes Objekt.

Jede Szene enthält:

1. **Vordergrund:** ein kleines unterstützendes Element oder ein einlaufender Weg
2. **Mittelgrund:** die eigentliche finanzielle Handlung
3. **Hintergrund:** ruhige, aber sichtbare Studioarchitektur mit Boden, Rückwand, Lichtkanal oder eingelassener Nische

Die oberen und unteren crop-sicheren Bereiche bleiben detailarm, zeigen aber weiterhin die gleiche Architektur. Sie dürfen nicht wie leere schwarze Balken wirken.

## 3. Einheitliche Motivgröße

- Die zusammenhängende Hauptszene füllt ungefähr 68–78 % der nutzbaren Breite.
- Das wichtigste Objekt ist in allen Bildern ähnlich groß.
- Die Hauptaktion liegt im mittleren 64-%-Bereich des 9:16-Quellbildes.
- Oben und unten bleiben jeweils ungefähr 18 % als ruhige, aber nicht leere Fortsetzung der Umgebung.
- Keine winzigen Motive in einer großen leeren Fläche.
- Keine extremen Nahaufnahmen, sofern der Satz sie nicht ausdrücklich benötigt.

## 4. Referenzbild-Workflow

Vor den eigentlichen Szenenbildern wird pro Reel zuerst eine Bildwelt-Referenz erzeugt:

```text
03-szenen/bildwelt.txt
03-szenen/bildwelt-referenz.png
```

Bei jeder weiteren Bildgenerierung wird `bildwelt-referenz.png` ausschließlich als Stil- und Weltreferenz verwendet. Inhalt und Objekte stammen weiterhin aus dem jeweiligen Szenenprompt.

Verbindliche Anweisung für jedes Bild:

```text
Use the supplied FinanzNeo world reference image for camera, environment architecture,
lighting, materials, palette, depth and object scale. Do not redesign the world.
```

## 5. Verbindlicher Promptblock

Jeder Bildprompt muss diesen Block unverändert enthalten:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3

SERIES CONTINUITY LOCK:
Use the supplied FinanzNeo world reference image only as a style and environment reference.
Match its camera angle, 35mm-equivalent perspective, camera height, curved charcoal studio architecture,
matte floor, emerald architectural light channels, soft upper-left key light, green right-side rim light,
restrained gold money accents, material quality, depth and main-subject scale.
Do not redesign the environment between scenes.

ENVIRONMENT:
Create one connected premium finance-explainer environment with a visible matte floor,
a curved charcoal back wall, integrated emerald light channels and subtle architectural depth.
The scene must not look like an isolated object in an empty black void.
Use three depth layers: supporting foreground, explanatory midground action and quiet architectural background.

COMPOSITION LOCK:
Vertical 9:16 source image.
The complete main action must sit inside the central 64 percent of the image height.
The connected main scene must fill approximately 68 to 78 percent of the usable width.
Keep the upper 18 percent and lower 18 percent crop-safe and low-detail,
but continue the same studio floor, wall and lighting there instead of leaving empty black space.
Use two to four large connected objects with one obvious visual path.

TEXT:
No headline, subtitle, sentence, number, label, logo, watermark or interface text inside the image.
Remotion renders all typography and validated numbers.

CONSISTENCY NEGATIVES:
No empty black background, no isolated floating product, no floating platform,
no different camera angle, no different color palette, no blue or purple neon world,
no photorealism, no cartoon, no Pixar, no clay style, no dashboard, no app UI,
no advertising layout, no random particles and no decorative filler.
```

## 6. Szenenspezifischer Teil

Nach dem unveränderten Weltblock folgt nur der konkrete Inhalt:

```text
SCENE MESSAGE:
[ein gesprochener Satz]

CONNECTED VISUAL STORY:
[Ausgangspunkt] → [sichtbare Handlung] → [verständliches Ergebnis]

PRIMARY OBJECTS:
1. ...
2. ...
3. ...

READABILITY:
The concept must be understandable within one second on a smartphone.
```

## 7. Ablehnungskriterien

Ein Bild wird neu generiert, wenn mindestens einer dieser Punkte zutrifft:

- es wirkt wie eine andere Bildwelt als die übrigen Szenen
- Kamera, Licht oder Materialien wechseln sichtbar
- das Motiv ist deutlich kleiner oder größer als in den übrigen Bildern
- der Hintergrund ist leer, schwarz oder nur ein Glow
- das Motiv schwebt isoliert ohne Boden und Raumbezug
- die Umgebung ist zufällig oder szenenweise komplett verschieden
- Text oder Zahlen wurden ins Bild generiert
- die Aussage widerspricht dem gesprochenen Satz
- wichtige Motivteile liegen ausschließlich in den crop-sicheren Randzonen
