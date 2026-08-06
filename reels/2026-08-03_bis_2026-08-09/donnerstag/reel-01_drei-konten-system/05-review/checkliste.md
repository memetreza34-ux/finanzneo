# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen und 4 Remotion-Animationen
- [x] Verhältnis exakt 60 % / 40 %
- [x] Überschrift oben und Visual oberhalb der Untertitelzone
- [x] immer nur ein vollständiger Satz gleichzeitig
- [x] aktuelles gesprochenes Wort wird FinanzNeo-grün hervorgehoben
- [x] globale Wortzeiten aus dem 60,05-Sekunden-Referenzvideo abgeleitet
- [x] Vordergrundbilder verwenden `contain`
- [x] bewusste Bildvergrößerung ist auf maximal `1.05` begrenzt
- [x] unscharfe Hintergrundkopie darf freie Seitenflächen füllen
- [x] lokale doppelte Untertitel aus allen Szenen entfernt
- [x] Bildzuordnung für Szene 03, 05 und 07 im aktuellen Render-Code korrigiert
- [x] Scaffolder, Produktionsstandard und Validatoren für zukünftige Reels aktualisiert

## Vor finaler Veröffentlichung

- [ ] lokalen Branch aktualisieren
- [ ] `npm run assets:drei-konten` ausführen
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] neuen Preview-Render erzeugen
- [ ] grüne Wortverfolgung mit Kopfhörern vollständig gegen das finale Audio prüfen
- [ ] Wortzeiten bei erkennbaren Abweichungen framegenau nachjustieren
- [ ] kontrollieren, dass alle sechs Vordergrundbilder vollständig sichtbar bleiben
- [ ] kontrollieren, dass Szene 03 Kontostand, Szene 05 Fixkosten und Szene 07 Rücklage zeigt
- [ ] kontrollieren, dass kein Motiv, Betrag oder Kartenblock hinter dem Untertitel liegt
- [ ] finalen Export vollständig ansehen und nach `06-video/` kopieren
