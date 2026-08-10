# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen und 4 Remotion-Animationen
- [x] jede Szene besitzt exakt eine Produktionsquelle
- [x] Überschrift oben mit passendem Icon
- [x] Untertitel außerhalb der Plattform-Totzone
- [x] genau ein Satz sichtbar; aktuelles Wort grün
- [x] höchstens zwei ausgewogene Untertitelzeilen
- [x] Szenenstarts folgen den Satzanfängen des finalen Voiceovers
- [x] Image World V3 im Repo hinterlegt
- [x] alle Bildprompts verwenden denselben Kamera-, Licht-, Material- und Umgebungsvertrag
- [x] Bildtexte und Zahlen in generierten Bildern vollständig verboten
- [x] Remotion verwendet eine einheitliche Studiofläche statt einer unscharfen Bildkopie
- [x] Vordergrundbilder verwenden contain
- [x] Scale maximal 1.04
- [x] Source-Crop je Seite maximal 0.20 und insgesamt maximal 0.34

## Vor erneuter Bildgenerierung

- [ ] `03-szenen/bildwelt.txt` zuerst generieren
- [ ] reales Referenzbild als `03-szenen/bildwelt-referenz.png` speichern
- [ ] jede Bildszene mit genau dieser Referenz als Stilreferenz erzeugen
- [ ] Szene 02 zwingend neu erzeugen: ein ungeteilter Behälter, keine Drei-Wege-Lösung
- [ ] keine Szene vor leerem schwarzem Hintergrund akzeptieren
- [ ] alle sechs Bilder als Kontaktbogen auf gleiche Kamera, Architektur, Licht und Motivgröße prüfen

## Vor finalem Render

- [ ] `npm run assets:drei-konten` ausführen
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] neuen Preview-Render erzeugen
- [ ] Bildwechsel beginnen exakt mit dem zugehörigen neuen Satz
- [ ] Szene 05 besitzt keinen unscharfen Streifen am oberen Bildrand
- [ ] kein Motiv, Pfeil, Geldobjekt oder erklärendes Element ist abgeschnitten
- [ ] Szene 03 = Kontostand, Szene 05 = Fixkosten, Szene 07 = Rücklage
- [ ] alle Bildmotive wirken ähnlich groß und ähnlich hoch
- [ ] Untertitel liegen nicht in der unteren Reels-Totzone
- [ ] zu keinem Zeitpunkt sind zwei oder drei Sätze gleichzeitig sichtbar
- [ ] grüne Wortverfolgung vollständig mit Kopfhörern kontrollieren
- [ ] Voiceover ungefähr auf -16 LUFS Integrated und höchstens -1 dBTP prüfen
- [ ] finalen Export vollständig ansehen
