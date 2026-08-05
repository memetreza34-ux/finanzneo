# Motion Design — ETF-Kauf erklärt

## Globale Regeln

- 1080 × 1920, 30 FPS
- gemessene Voiceover-Dauer: 72,42 Sekunden
- Composition: 2.173 Frames
- die automatisch erkannte Datei in `02-audio/` ist die zeitliche Quelle der Wahrheit
- Audio nicht beschleunigen, kürzen oder zeitlich strecken
- Untertitelbereich: untere 330 Pixel dauerhaft freihalten
- Bilder bleiben Vollbild; keine kleinen Kartenrahmen
- Überschriften kurz, maximal zwei Zeilen
- keine dekorativen Zahlenzähler
- keine wiederholten Balken- oder Kurvenanimationen
- längere Bildszenen erhalten mindestens zwei sichtbare Bewegungsphasen
- Animationsszenen zeigen eine vollständige Handlung mit Start- und Endzustand
- Schnitte möglichst an den tatsächlichen Satzgrenzen und Objektbewegungen ausrichten

## Szenen- und Framegrenzen

| Szene | Zeit | Frames | Frameanzahl |
|---|---:|---:|---:|
| 1 | 0,00–7,73 s | 0–231 | 232 |
| 2 | 7,73–18,97 s | 232–568 | 337 |
| 3 | 18,97–29,50 s | 569–884 | 316 |
| 4 | 29,50–40,03 s | 885–1200 | 316 |
| 5 | 40,03–52,03 s | 1201–1560 | 360 |
| 6 | 52,03–61,90 s | 1561–1856 | 296 |
| 7 | 61,90–72,42 s | 1857–2172 | 316 |

## Szene 1 — Frames 0–231

### Phase A: Frage und Gesamtweg

- Frame 0: Hauptmotiv vollständig sichtbar
- Frame 0–24: Kicker und Headline einblenden
- Frame 0–115: Bildscale 1,000 → 1,035
- Frame 0–115: leichte Fahrt entlang des sichtbaren Geldwegs

### Phase B: Fokus auf das Ziel

- Frame 116–210: Bildscale 1,035 → 1,075
- Frame 116–210: Fokus vom 100-Euro-Motiv Richtung Börse und ETF-Anteil verschieben
- Frame 211–231: Motiv für den Übergang zur Order-Kapsel stabilisieren

## Szene 2 — Frames 232–568

### `EtfOrderMatchAnimation`

- Frame 232–275: Smartphone stößt eine grüne Kauforder-Kapsel aus
- Frame 276–330: Kapsel durchquert die Broker-Schleuse; Kamera folgt von schräg hinten
- Frame 331–390: Börsenhalle öffnet sich; physische Angebotsschienen werden sichtbar
- Frame 391–455: Kauforder fährt an mehreren unpassenden Angeboten vorbei
- Frame 456–505: passendes Verkaufsangebot oder Market-Maker-Quote fährt aus der Gegenschiene
- Frame 506–540: beide Kapseln rasten zusammen; kurzer mechanischer Impuls
- Frame 541–568: versiegeltes Tauschpaket verlässt die Halle in Richtung Szene 3

Bewegungsprinzipien:

- klare Beschleunigung und Abbremsung
- keine schwebenden UI-Karten
- Orderbuch als räumliche Sortiermaschine
- Preis- und Mengendaten nur als kurze physische Stecker oder Gravuren

## Szene 3 — Frames 569–884

### Phase A: vollständiger Tausch

- Frame 569: beide gekreuzten Tauschwege vollständig erkennbar
- Frame 569–710: Bildscale 1,035 → 1,050
- Frame 590–625: Kicker und Headline einblenden
- Frame 569–710: leichte Fahrt vom Käufer zum Kreuzungspunkt

### Phase B: Ergebnis im Depot

- Frame 711–850: Fokus vom Geldweg zum ETF-Anteil im Depotfach verschieben
- Frame 711–850: Bildscale 1,050 → 1,075
- Frame 851–884: ETF-Anteil im Depot als Übergangsmotiv stabilisieren

## Szene 4 — Frames 885–1200

### Phase A: einzelner Anteil

- Frame 885: einzelner ETF-Anteil groß im Vordergrund
- Frame 885–1015: Bildscale 1,090 → 1,060
- Frame 905–940: Kicker und Headline einblenden

### Phase B: gesamtes Fondsvermögen

- Frame 1016–1170: Pull-out von 1,060 → 1,015
- Frame 1016–1170: Kamera zeigt den vollständigen ETF-Tresor mit den verschiedenen Branchen
- Frame 1171–1200: Tresortür oder Fondsrahmen füllt den Bildmittelpunkt als Übergang

## Szene 5 — Frames 1201–1560

### `EtfCreationBasketExchangeAnimation`

- Frame 1201–1245: Wertpapierkorb links, Fonds-Tresor rechts; klare räumliche Totale
- Frame 1246–1305: Authorized-Participant-Transporter nimmt den Korb auf
- Frame 1306–1375: Transporter fährt in einer seitlichen Kamerafahrt zum Fonds
- Frame 1376–1435: Korb wird angehoben und in die Fonds-Schleuse eingesetzt
- Frame 1436–1485: Branchenbausteine verriegeln sich sichtbar im Fondsvermögen
- Frame 1486–1530: neue ETF-Anteilsscheiben werden auf der anderen Seite ausgegeben
- Frame 1531–1560: Transporter nimmt die ETF-Anteile auf und fährt in Richtung Börsenmarkt

Bewegungsprinzipien:

- andere Raumlogik als Szene 2
- seitliche Lager- und Tresorwelt statt Tunnel oder Orderbuch
- der Tausch Wertpapierkorb ↔ ETF-Anteile muss ohne langen Text verständlich sein
- kurzer Hinweis im Overlay: `Nur wenn neue Anteile benötigt werden`

## Szene 6 — Frames 1561–1856

### Phase A: enthaltene Wertpapiere

- Frame 1561: mechanische Verbindung zwischen Fonds und Anteil sichtbar
- Frame 1561–1685: Bildscale 1,000 → 1,035
- Frame 1580–1615: Kicker und Headline einblenden
- Frame 1561–1685: Fokus auf die verschiedenen Wertpapierbausteine

### Phase B: Anteil und Bruchteil

- Frame 1686–1815: Kamera fährt entlang des mechanischen Arms zum ETF-Anteil
- Frame 1686–1815: Bildscale 1,035 → 1,070
- Frame 1760–1815: der sichtbar abgetrennte Bruchteil wird fokussiert
- Frame 1816–1856: Bewegung ruhig auslaufen lassen

## Szene 7 — Frames 1857–2172

### Phase A: vollständige Antwort

- Frame 1857: Anleger, ETF-Anteil, Fonds-Tresor und abgeschlossener Geldweg vollständig sichtbar
- Frame 1857–1985: Bildscale 1,000 → 1,030
- Frame 1875–1910: Kicker einblenden
- Frame 1900–1945: Headline einblenden
- Frame 1930–1970: Body einblenden

### Phase B: finaler Besitzfokus

- Frame 1986–2125: Fokus auf ETF-Anteil und verbundenes Fondsvermögen
- Frame 1986–2125: Bildscale 1,030 → 1,060
- Frame 2126–2172: alle Bewegungen langsam auslaufen lassen; Endframe mindestens 0,5 Sekunden stabil halten

## Untertitel

- wort- oder kurzgruppenbasierte Captions
- höchstens zwei Zeilen
- zentrale Position innerhalb der unteren Safe Zone
- aktuell gesprochenes Wort deutlich hervorheben
- keine Untertitel über wichtige Bildmotive legen
- Caption-Zeitstempel aus der realen Audiodauer neu erzeugen
- automatische Zeitstempel bleiben provisorisch und müssen im vollständigen Render visuell geprüft werden

## Audio

- finales Voiceover ist Pflicht
- erkannte Voiceover-Datei vollständig und unverändert verwenden
- zunächst kein Musikbett
- keine SFX erfinden
- SFX nur ergänzen, wenn konkrete Audiodateien bereitgestellt werden
