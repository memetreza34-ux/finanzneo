# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen und 4 Remotion-Animationen
- [x] jede Szene besitzt exakt eine Produktionsquelle
- [x] Überschrift ist als eigener oberer Bereich umgesetzt
- [x] jede Überschrift besitzt ein passendes zentriertes Icon
- [x] Icon und grüne beziehungsweise goldene Schwerpunktzeile haben ähnliche visuelle Größe
- [x] Bild-/Animationsbereich endet oberhalb der Untertitel
- [x] Untertitel-Safe-Area wurde auf 270 px angehoben
- [x] ein vollständiger Satz gleichzeitig
- [x] aktuelles Wort wird grün verfolgt
- [x] vorheriger Satz bleibt während kurzer Sprechpausen sichtbar
- [x] lange Untertitel werden auf höchstens zwei Zeilen komprimiert
- [x] Bildgrößen und vertikale Positionen sind pro Szene eingestellt
- [x] Scale über 1.05 ist nur mit cropSafe=true erlaubt

## Vor finalem Render

- [ ] `npm run assets:drei-konten` ausführen
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] neuen Preview-Render erzeugen
- [ ] alle sechs Bilder nebeneinander auf ähnliche Motivgröße prüfen
- [ ] keine eingebaute Bildbeschriftung, Zahl oder Motivkante abgeschnitten
- [ ] Szene 03 = Kontostand, Szene 05 = Fixkosten, Szene 07 = Rücklage
- [ ] Untertitel liegen nicht in der unteren Reels-Totzone
- [ ] zu keinem Zeitpunkt verschwinden die Untertitel zwischen zwei Sätzen
- [ ] kein Untertitel umfasst mehr als zwei sichtbare Zeilen
- [ ] grüne Wortverfolgung vollständig mit Kopfhörern kontrollieren
- [ ] finalen Export vollständig ansehen
