# FinanzNeo — Bild-QA-Checkliste V3

Diese Checkliste bewertet nicht nur einzelne Bilder, sondern immer den vollständigen Bildsatz eines Reels.

## 1. Satzgenauigkeit

- [ ] Jedes Bild erklärt exakt den zugehörigen gesprochenen Satz.
- [ ] Problem-, Mechanismus-, Lösungs- und Ergebnisszenen werden nicht verwechselt.
- [ ] Die Aussage ist innerhalb einer Sekunde auf einem Smartphone erkennbar.
- [ ] Ausgangspunkt, Handlung und Ergebnis sind sichtbar verbunden.
- [ ] Es gibt nur eine Hauptaussage pro Bild.

**Sofort neu erstellen:** Das Bild zeigt bereits die Lösung, obwohl der Sprecher noch das Problem erklärt, oder umgekehrt.

## 2. Set-Konsistenz

Alle Bildszenen werden als Kontaktbogen nebeneinander geprüft.

- [ ] Alle Bilder verwenden `finanzneo-connected-studio-v3`.
- [ ] Kameraangle und Brennweitenwirkung sind gleich.
- [ ] Kamerahöhe und Blickrichtung sind gleich.
- [ ] Rückwand, Boden und Lichtkanäle gehören sichtbar zur selben Studioarchitektur.
- [ ] Hauptlicht kommt in allen Bildern aus derselben Richtung.
- [ ] Materialien, Grün- und Goldtöne stimmen überein.
- [ ] Das wichtigste Motiv besitzt über alle Bilder eine ähnliche visuelle Größe.
- [ ] Kein Bild sieht aus, als stamme es aus einem anderen Generator oder Stilmodell.

**Sofort neu erstellen:** Ein Bild wirkt sichtbar wie eine andere Serie.

## 3. Raum statt leerem Hintergrund

- [ ] Der Hintergrund zeigt eine erkennbare, ruhige FinanzNeo-Studioumgebung.
- [ ] Rückwand und Boden sind sichtbar miteinander verbunden.
- [ ] Die oberen und unteren crop-sicheren Bereiche sind detailarm, aber nicht leer.
- [ ] Es gibt Vordergrund, Mittelgrund und Hintergrund.
- [ ] Das Motiv ist räumlich in die Umgebung eingebunden.

**Sofort neu erstellen:** isoliertes Objekt vor schwarzem Nichts, reiner Glow, leere Fläche oder schwebende Werbeplattform.

## 4. Motivgröße und Komposition

- [ ] Die zusammenhängende Hauptszene füllt ungefähr 68–78 % der nutzbaren Breite.
- [ ] Zwei bis vier große Hauptelemente reichen aus.
- [ ] Das wichtigste Objekt ist klar größer als Nebenelemente.
- [ ] Die Hauptaktion liegt im mittleren 64-%-Bereich der Quellhöhe.
- [ ] Oben und unten befinden sich nur ruhige, crop-sichere Umgebungsanteile.
- [ ] Kein wichtiges Objekt liegt ausschließlich am oberen oder unteren Rand.
- [ ] Keine Mini-Panels, Dashboard-Flächen oder zufälligen Icons.

## 5. Textfreiheit

- [ ] Kein Text im Bild.
- [ ] Keine Zahlen im Bild.
- [ ] Keine Labels, Konto-Namen oder Objektbeschriftungen.
- [ ] Keine Logos, Marken oder Wasserzeichen.
- [ ] Alle Texte und Rechenwerte kommen ausschließlich aus Remotion.

**Sofort neu erstellen:** generierter Text, falsche Wörter oder eingebettete Zahlen.

## 6. Remotion-Darstellung

- [ ] Vordergrundbild verwendet `contain`.
- [ ] Keine unscharfe Bildkopie erzeugt einen sichtbaren Streifen.
- [ ] Freie Fläche wird durch die einheitliche FinanzNeo-Studiobühne gefüllt.
- [ ] Source-Crop oben höchstens 0.20.
- [ ] Source-Crop unten höchstens 0.20.
- [ ] Gesamt-Crop höchstens 0.34.
- [ ] Zusätzliche Skalierung höchstens 1.04.
- [ ] Kein Motiv, Pfeil, Geldobjekt oder erklärendes Element wird abgeschnitten.
- [ ] Alle Bildszenen wirken im fertigen Render ähnlich groß und ähnlich hoch.

## 7. Timing und Untertitel

- [ ] Das Bild wechselt genau mit dem Beginn des zugehörigen Satzes.
- [ ] Kein neues Bild erscheint noch während des vorherigen Satzes.
- [ ] Ein vollständiger Satz ist sichtbar.
- [ ] Aktuelles Wort ist grün, übrige Wörter weiß.
- [ ] Höchstens zwei Untertitelzeilen.
- [ ] Keine leere Caption-Lücke zwischen Sätzen.
- [ ] Untertitel liegen außerhalb der unteren Plattform-Totzone.

## 8. Farb- und Materialregeln

- [ ] Anthrazit und tiefes Grün dominieren.
- [ ] Gold wird nur für Geld oder Wert verwendet.
- [ ] Rot wird nur für Risiko, Verlust oder Blockierung verwendet.
- [ ] Matte Materialien dominieren.
- [ ] Glas wird nur dezent eingesetzt.
- [ ] Keine zufälligen Neonfarben.
- [ ] Nicht fotorealistisch, nicht kindlich, nicht Pixar- oder Clay-artig.

## Freigabeablauf

1. Einzelbild gegen den gesprochenen Satz prüfen.
2. Alle Bilder als Kontaktbogen nebeneinander prüfen.
3. Drei Frames pro Bildszene im fertigen Render prüfen: Anfang, Mitte, Ende.
4. Komplette MP4 mit Ton ansehen.

## Entscheidung

- **Freigegeben:** alle Pflichtpunkte bestanden.
- **Überarbeiten:** nur Position, Crop oder kleine Größenabweichung fehlerhaft.
- **Neu erstellen:** Aussage, Welt, Kamera, Hintergrund oder Textregeln fehlerhaft.

Kurzes Protokoll:

```text
Bildsatz-QA: [FREIGEGEBEN / ÜBERARBEITEN / NEU ERSTELLEN]
Weltkonsistenz: [BESTANDEN / NICHT BESTANDEN]
Satzgenauigkeit: [BESTANDEN / NICHT BESTANDEN]
Render-Crops: [BESTANDEN / NICHT BESTANDEN]

Fehler:
- ...

Korrektur:
- ...
```
