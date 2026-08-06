# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen und 4 Remotion-Animationen
- [x] jede Szene besitzt exakt eine Produktionsquelle
- [x] jede Überschrift besitzt ein passendes zentriertes Icon
- [x] Icon und Schwerpunktzeile haben dieselbe visuelle Höhe
- [x] Visual endet oberhalb der Untertitelzone
- [x] Untertitel-Safe-Area beträgt 320 px
- [x] rechter Abstand zur Reels-Bedienleiste beträgt 150 px
- [x] genau ein vollständiger Satz gleichzeitig
- [x] aktuelles Wort wird grün verfolgt
- [x] Satz bleibt während kurzer Sprechpausen sichtbar
- [x] Untertitel werden auf höchstens zwei ausgewogene Zeilen verteilt
- [x] Vordergrundbilder bleiben `contain`
- [x] Scale ist auf maximal 1.06 begrenzt
- [x] Bildgröße wird über sichere obere und untere Source-Crops vereinheitlicht
- [x] Crop pro Seite maximal 0.22, insgesamt maximal 0.36

## Vor finalem Render

- [ ] `npm run assets:drei-konten` ausführen
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] neuen Preview-Render erzeugen
- [ ] alle sechs Bilder nebeneinander auf ähnliche Motivgröße prüfen
- [ ] nur tatsächlich leerer Quellraum wurde entfernt
- [ ] keine eingebaute Beschriftung, Zahl, Icon oder Motivkante angeschnitten
- [ ] Szene 03 = Kontostand, Szene 05 = Fixkosten, Szene 07 = Rücklage
- [ ] Untertitel liegen nicht in der unteren Reels-Totzone
- [ ] rechte Reels-Icons verdecken keinen Untertitel
- [ ] kein Untertitel umfasst mehr als zwei sichtbare Zeilen
- [ ] niemals zwei Sätze gleichzeitig sichtbar
- [ ] grüne Wortverfolgung vollständig mit Kopfhörern kontrollieren
- [ ] finalen Export vollständig ansehen
