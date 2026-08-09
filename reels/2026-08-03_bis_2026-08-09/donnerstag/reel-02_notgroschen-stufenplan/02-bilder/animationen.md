# Notgroschen – verbindlicher Animationsplan

Die Animationen werden in Remotion umgesetzt. Google Flow erzeugt für diese Szenen KEINE Bilder.

## Szene 03 – TargetRangeAnimation

**Sprechtext:**
Als Daumenregel nennt die Verbraucherzentrale zwei bis drei Monatsgehälter. Die passende Höhe hängt aber von deiner persönlichen Situation ab.

**Ziel:**
Die Daumenregel als Orientierung zeigen, ohne sie als starres Pflichtziel darzustellen.

**Startzustand:**
Ein einzelnes Monatsgehalt erscheint als neutraler Referenzblock.

**Phase 1:**
Der Block dupliziert sich sichtbar auf zwei Monatsgehälter.

**Phase 2:**
Ein dritter Block ergänzt die obere Orientierung. Zwischen zwei und drei Monatsgehältern entsteht eine klare Zielspanne.

**Phase 3:**
Die starre Spanne löst sich leicht in einen variablen persönlichen Zielkorridor auf, um zu zeigen: individuelle Situation entscheidet.

**Endzustand:**
Zwei bis drei Monatsgehälter als Orientierung, daneben klar sichtbare individuelle Anpassung.

**Regeln:**
- keine extern generierten Bilder
- keine Dashboard-Karte
- Bewegung relativ zur echten Szenendauer
- Zahlen und Text ausschließlich durch Remotion

---

## Szene 05 – ThreeStageAnimation

**Sprechtext:**
Danach sicherst du einen Monat deiner notwendigen Ausgaben. Erst dann wächst der Puffer bis zu deinem persönlichen Ziel.

**Ziel:**
Den Aufbau des Notgroschens als drei aufeinanderfolgende Stufen verständlich machen.

**Startzustand:**
Leere dreistufige Schutztreppe.

**Phase 1:**
Stufe 1 wird mit dem Mini-Puffer aktiviert: 500 Euro.

**Phase 2:**
Stufe 2 wächst auf einen Monat notwendiger Ausgaben.

**Phase 3:**
Stufe 3 öffnet sich als persönlicher Zielbereich statt eines starren universellen Betrags.

**Endzustand:**
Klarer Weg: 500 Euro → 1 Monat notwendige Ausgaben → persönliches Ziel.

**Regeln:**
- drei eigenständige sichtbare Zustände
- keine gleichzeitige Komplettanzeige am Anfang
- Zahlen/Text in Remotion
- relative Timing-Phasen

---

## Szene 07 – ExampleTargetAnimation

**Sprechtext:**
Bei 1.800 Euro netto wären zwei bis drei Monatsgehälter 3.600 bis 5.400 Euro.

**Ziel:**
Die Beispielrechnung transparent und in einem Blick verständlich zeigen.

**Startzustand:**
1.800 Euro Monatsnetto als einzelner Wert.

**Phase 1:**
Multiplikation mit zwei Monaten: 1.800 × 2 → 3.600 Euro.

**Phase 2:**
Multiplikation mit drei Monaten: 1.800 × 3 → 5.400 Euro.

**Phase 3:**
Beide Ergebnisse bilden einen Beispiel-Zielkorridor.

**Endzustand:**
3.600–5.400 Euro als Beispielspanne; visuell als Beispiel kennzeichnen, nicht als individuelle Empfehlung.

**Regeln:**
- mathematisch exakt
- kein externer Bildtext
- keine unnötigen Charts
- relative Phasen zur echten Szenendauer

---

## Szene 08 – SavingsTimelineAnimation

**Sprechtext:**
Mit 150 Euro monatlich hast du den 500-Euro-Puffer im vierten Monat und 3.600 Euro nach 24 Monaten.

**Ziel:**
Zeigen, dass der erste Schutz schnell erreichbar ist und das größere Ziel schrittweise entsteht.

**Startzustand:**
Monat 0, Guthaben 0 Euro.

**Phase 1:**
Monatliche Beiträge von 150 Euro laufen nacheinander ein.

**Phase 2:**
Im vierten Monat wird erstmals die 500-Euro-Marke überschritten: 600 Euro Guthaben.

**Phase 3:**
Die Zeitachse beschleunigt kontrolliert bis Monat 24.

**Endzustand:**
24 × 150 Euro = 3.600 Euro.

**Regeln:**
- 500 Euro wird im 4. Monat erreicht/überschritten, nicht im 3. Monat
- 3.600 Euro nach 24 Monaten ohne Zinsen angenommen
- keine Rendite unterstellen
- Text/Zahlen ausschließlich durch Remotion
- Animation endet vollständig innerhalb der echten Szenendauer

## Bereits vorgesehene Remotion-Komponenten

- `TargetRangeAnimation`
- `ThreeStageAnimation`
- `ExampleTargetAnimation`
- `SavingsTimelineAnimation`

Die produktive Composition ist `NotgroschenStufenplan`. Diese Spezifikation ist die kreative Referenz; ein finaler Render gilt erst nach tatsächlichem Typecheck, Asset-Sync, Render und visueller Prüfung als bestätigt.
