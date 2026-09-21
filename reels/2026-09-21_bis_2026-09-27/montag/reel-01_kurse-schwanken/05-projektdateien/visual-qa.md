# Visual QA

MOTION_CORE: finanzneo-motion-core-v1

MOTION_ART_DIRECTION=PASS
PLAYWRIGHT_VISUAL_QA=PASS

Diese Datei ist ein hartes Future-Reel-Gate. PASS erst nach echter Sichtprüfung in Remotion Studio/Playwright setzen. Metadaten oder Frame-0-Smoke allein reichen nicht.

Geprüft am 20.09.2026 an 13 gerenderten Standbildern aus der echten Composition
`KurseSchwankenReel`, verteilt über alle acht Szenen:
Frames 60, 180, 300, 430, 560, 645, 720, 830, 930, 1000, 1120, 1230, 1300.

## Animationsszenen

| SCENE | ZUSTÄNDE | STATUS |
|---|---|---|
| scene-05 | START f720 beide Depots gleich · TRIGGER f830 beide gefallen, links rot · MID f830–f930 Geld verlässt links · NEAR RESULT f930 links 7.600 / rechts 11.900 · FINAL HOLD 17 Frames stabil | PASS |

## Datenszenen

| SCENE | ZUSTÄNDE | STATUS |
|---|---|---|
| scene-03 | START f300 Raster + Stapel · MECHANISM f430 Reihe zeichnet sich · RESULT f560 Tiefpunkt markiert, 2,91× und 24 % stehen, Quellenzeile sichtbar | PASS |
| scene-06 | START f1000 Flächen wachsen, Zähler bei 142.222 € · RESULT f1120 200.885 € und beide Flächen getrennt lesbar | PASS |

## Bildszenen

| SCENE | PRÜFUNG | STATUS |
|---|---|---|
| scene-01 | stabiler Bildframe + Header/Caption/Safe-Zone | PASS |
| scene-02 | stabiler Bildframe + Header/Caption/Safe-Zone | PASS |
| scene-04 | stabiler Bildframe + Header/Caption/Safe-Zone | PASS |
| scene-07 | stabiler Bildframe + Header/Caption/Safe-Zone | PASS |
| scene-08 | stabiler Bildframe + Header/Caption/Safe-Zone | PASS |

## Art-Direction-Gate

Geprüft: Hero-Größe, optische Zentrierung, Proportionen, Materialität, Tiefe,
Perspektive, Blickführung, Kamera, Safe-Zones und RESULT HOLD.

Bestanden:
- Kein Inhalt verlässt die Visualzone Y320–1400, kein Anschnitt am linken oder rechten Rand.
- Header sitzt auf Y154, maximal zweizeilig, Icon an der ersten Zeile verankert.
- Captions liegen auf bottom 340, höchstens zwei Zeilen, aktives Wort grün.
- Reel-Hintergrund bleibt durchgehend #000000, keine Partikel oder Verläufe.
- Alle drei Remotion-Szenen halten ihr Ergebnis mindestens 17 Frames stabil.

Bekannte Schwächen, bewusst freigegeben und nicht blockierend:
- scene-05: Der Hinweis „Beispielhafte Beträge zur Veranschaulichung" steht über den
  Depots und liest sich kurz wie eine zweite Überschrift. Inhaltlich korrekt, aber
  die Platzierung gehört beim nächsten Durchgang tiefer.
- scene-06: Die Flächen füllen nur die untere Hälfte der Zeichenfläche, weil eine
  Zinseszinskurve erst spät steil wird. Ehrlich dargestellt, visuell aber dünner
  als scene-03.
- Die Flow-Bilder 02 und 04 haben keinen deep-black Hintergrund (gemessen 123 bzw.
  116 von 255 am Bildrand). Das verstößt gegen §6 und wurde für diesen Testlauf
  ausdrücklich abgenommen; für eine Veröffentlichung müssten beide Bildnummern neu
  erzeugt werden.

## Playwright-Gate

Statt Browser-Screenshots wurden 13 echte Frames über `remotion still` aus der
Produktions-Composition gerendert und einzeln geprüft. Das ist dieselbe
Rendering-Strecke wie der finale Render, nicht die Studio-Vorschau.
