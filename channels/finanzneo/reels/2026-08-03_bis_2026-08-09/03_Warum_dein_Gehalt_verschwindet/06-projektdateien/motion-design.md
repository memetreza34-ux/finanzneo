# Motion Design – Warum dein Gehalt sofort kleiner wird

## Allgemein

- 1080 × 1920, 30 FPS.
- Untere 330 Pixel dauerhaft als Caption-Safe-Zone behandeln.
- Bildszenen als Full-Bleed verwenden, nicht in Karten einrahmen.
- Bildbewegungen langsam und linear; keine hektischen Zooms.
- Überschrift innerhalb der ersten 10–14 Frames weich einblenden.
- Wortuntertitel maximal zwei kurze Zeilen, große Schrift, hoher Kontrast.
- Keine Musik und keine externen SFX erfinden. Voiceover ist Pflicht. Vorhandene freigegebene SFX dürfen später ergänzt werden.

## Bildszenen

### Szene 1

- Scale 1,000 → 1,055.
- Y-Pan 0 → -10 Pixel.
- Reservoir bleibt zentral.
- Covertext zusätzlich als separate Cover-Composition aus demselben Bild erzeugen.

### Szene 2

- Scale konstant 1,040.
- X-Pan -7 → +7 Pixel.
- Match-Cut: Ein Rohr aus Szene 1 endet an derselben Bildschirmposition wie der erste Greifarm in Szene 2.

### Szene 4

- Scale 1,070 → 1,010.
- Y-Pan -4 → +4 Pixel.
- Pull-out offenbart die lange Quittung erst vollständig gegen Ende der Szene.

### Szene 5

- Scale 1,000 → 1,050.
- X-Pan +5 → -5 Pixel.
- Smartphone und Bankkarte bleiben scharf; Figur im Hintergrund bleibt sekundär.

### Szene 7

- Scale 1,000 → 1,035 in den ersten sieben Sekunden.
- Letzte 1,5 Sekunden ohne weitere Kamerabewegung.
- Payoff-Headline darf etwas länger stehen als alle vorherigen Headlines.

## Remotion-Animation 1 – `SalaryCostGatesAnimation`

### Raum und Stil

Ein perspektivischer physischer Tunnel, kein Dashboard. Der Geldblock bewegt sich von unten/vorne nach oben/hinten. Drei Tore stehen hintereinander und besitzen jeweils eine andere Form, damit sie sofort unterscheidbar sind.

### Ablauf in Frames bei 8,5 Sekunden / 255 Frames

- Frames 0–24: Vollständiger Geldblock mit `3.000 €` fährt in den Tunnel. Kamera nimmt Geschwindigkeit auf.
- Frames 25–79: Tor `WOHNEN` schließt seitlich, trennt 1.200 Einheiten ab und schiebt sie in einen linken Seitenschacht. Block wird sichtbar kleiner.
- Frames 80–134: Tor `ALLTAG` senkt sich von oben, trennt 600 Einheiten ab und leitet sie nach rechts.
- Frames 135–189: Tor `VERTRÄGE` dreht sich wie ein Drehkreuz, trennt 300 Einheiten ab und leitet sie in einen schmalen hinteren Schacht.
- Frames 190–224: Der verbliebene 900-Euro-Stapel fährt ungeschützt zum Ausgang. Die drei gefüllten Seitenschächte bleiben im Hintergrund sichtbar.
- Frames 225–254: Kamera zieht zurück; Label `REST 900 €` erscheint. Keine neue Zahl hinzufügen.

### Bewegung

- `spring()` nur für die kurzen Tor-Impacts, ohne starkes Überschwingen.
- Geldblock besitzt Gewicht: kurze Verzögerung vor jedem Tor und leichte Kompression beim Abtrennen.
- Keine Partikelwolken. Höchstens wenige kleine Münzen beim Trennmoment.
- Labels in Remotion setzen, niemals als Bestandteil eines generierten Bildes.

## Remotion-Animation 2 – `FourEnvelopeLockAnimation`

### Raum und Stil

Top-down-Ansicht eines runden mechanischen Verteilertisches. Keine Tunnelperspektive und keine Wiederholung der ersten Animation. Vier Behälter unterscheiden sich durch Form und Symbol, nicht durch vier identische Karten.

### Ablauf in Frames bei 10 Sekunden / 300 Frames

- Frames 0–39: Gehaltsmünzen fallen ungeordnet in die offene Mitte. Einzelne Münzen rollen sichtbar weg.
- Frames 40–84: Der zentrale Drehverteiler rastet ein. Eine erste Bahn öffnet sich zur Rücklage.
- Frames 85–124: Rücklage wird gefüllt; ein transparenter Schutzdeckel schließt und ein physisches Schloss rastet ein.
- Frames 125–169: Zweite Bahn öffnet sich zu Fixkosten; der Behälter mit Wohnungsschlüssel wird gefüllt.
- Frames 170–214: Dritte Bahn öffnet sich zum Alltag; der Behälter mit Einkaufskorb wird gefüllt.
- Frames 215–254: Vierte Bahn öffnet sich zum frei verfügbaren Geld; die flexible Geldbörse wird gefüllt.
- Frames 255–284: Alle Bahnen schließen sauber. Keine Münze rollt mehr weg.
- Frames 285–299: Kamera zieht zurück und zeigt das vollständige stabile System.

### Bewegung

- Kamera rotiert über die gesamte Szene maximal 15 Grad.
- Behälter füllen sich über echte Münzbewegung, nicht über Balken.
- Rücklage zuerst und sichtbar stärker schützen.
- Labels `RÜCKLAGE`, `FIXKOSTEN`, `ALLTAG`, `FREI` groß und smartphone-lesbar setzen.
- Keine vier UI-Karten, kein Kreisdiagramm und keine Prozentanzeige.

## Übergänge

- 1 → 2: Match-Cut über Rohr/Greifarm.
- 2 → 3: Greifarm fährt groß durch das Bild und wird zum ersten Tunnelportal.
- 3 → 4: Harter Schnitt, sobald der Reststapel den Tunnelausgang erreicht; Position entspricht der Geldbörse an der Kasse.
- 4 → 5: Harter Schnitt über die Form der Quittung zur Form eines Abo-Kabels.
- 5 → 6: Kabel zieht sich zur Bildmitte und wird zur ersten Bahn des Drehverteilers.
- 6 → 7: Schutzdeckel der Rücklage füllt das Bild und öffnet sich als Reveal auf das finale Bild.

## QA

Codex muss nach dem Render prüfen:

- erste Frame der Hook,
- mindestens Mitte und Ende jeder Szene,
- alle sechs Szenenübergänge,
- Lesbarkeit der Beträge und Labels,
- freie Untertitelzone,
- identische Figuren- und Farbwelt der fünf Bilder,
- keine sichtbare Wiederholung zwischen beiden Animationsszenen,
- exaktes Videoende mit dem Voiceover.
