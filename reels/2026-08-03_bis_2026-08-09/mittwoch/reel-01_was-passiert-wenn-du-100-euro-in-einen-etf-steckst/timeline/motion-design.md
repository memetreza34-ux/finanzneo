# Motion Design — ETF-Kauf erklärt

## Globale Regeln

- 1080 × 1920, 30 FPS
- Untertitelbereich: untere 330 Pixel dauerhaft freihalten
- Bilder bleiben Vollbild; keine kleinen Kartenrahmen
- Überschriften kurz, maximal zwei Zeilen
- keine dekorativen Zahlenzähler
- keine wiederholten Balken- oder Kurvenanimationen
- Bildszenen: ruhige Kamerabewegung
- Animationsszenen: sichtbare Handlung mit Start- und Endzustand
- Schnitte aus Objektbewegungen ableiten

## Szene 1 — Frames 0–164

- Frame 0: Hauptmotiv vollständig sichtbar
- Frame 0–18: Headline und Kicker linear einblenden
- Frame 0–164: Bildscale 1,000 → 1,055
- Frame 0–164: translateY 0 → -10 px
- Frame 150–164: 100-Euro-Motiv als Match-Cut-Zentrum stabilisieren

## Szene 2 — Frames 165–404

### `EtfOrderMatchAnimation`

- Frame 165–195: Smartphone stößt eine grüne Kauforder-Kapsel aus
- Frame 195–235: Kapsel durchquert Broker-Schleuse; Kamera verfolgt sie von schräg hinten
- Frame 235–275: Börsenhalle öffnet sich; physische Angebotsschienen werden sichtbar
- Frame 275–325: Kauforder fährt entlang der Kaufseite; mehrere zu teure Angebote passieren ohne Verbindung
- Frame 325–360: passendes Verkaufsangebot oder Market-Maker-Quote fährt aus der Gegenschiene
- Frame 360–385: beide Kapseln rasten zusammen; kurzer mechanischer Impuls
- Frame 385–404: versiegeltes Tauschpaket verlässt die Halle in Richtung Szene 3

Bewegungsprinzipien:

- klare Beschleunigung und Abbremsung
- keine schwebenden UI-Karten
- Orderbuch als räumliche Sortiermaschine
- Preis- und Mengendaten nur als kurze physische Stecker oder Gravuren

## Szene 3 — Frames 405–629

- Frame 405: gekreuzte Tauschwege bereits erkennbar
- Frame 405–629: Bildscale konstant 1,04
- Frame 405–629: translateX -12 → +12 px
- Frame 420–450: Headline einblenden
- Frame 610–629: Kamera auf ETF-Anteil im Depotfach zentrieren

## Szene 4 — Frames 630–854

- Frame 630: einzelner ETF-Anteil groß im Vordergrund
- Frame 630–854: Bildscale 1,07 → 1,01
- Frame 630–854: translateY 6 → 0 px
- Frame 680–760: Fonds-Tresor wird durch den Pull-out vollständig sichtbar
- Frame 830–854: transparente Tresortür füllt den Bildmittelpunkt als Übergang

## Szene 5 — Frames 855–1124

### `EtfCreationBasketExchangeAnimation`

- Frame 855–885: Wertpapierkorb steht links, Fonds-Tresor rechts; klare räumliche Totale
- Frame 885–930: Authorized-Participant-Transporter nimmt den Korb auf
- Frame 930–985: Transporter fährt in einer seitlichen Kamerafahrt zum Fonds
- Frame 985–1030: Korb wird angehoben und in die Fonds-Schleuse eingesetzt
- Frame 1030–1065: verschiedene Branchenbausteine verriegeln sich sichtbar im Fondsvermögen
- Frame 1065–1100: auf der gegenüberliegenden Seite werden neue ETF-Anteilsscheiben geprägt
- Frame 1100–1124: Transporter nimmt die ETF-Anteile auf und fährt in Richtung Börsenmarkt

Bewegungsprinzipien:

- andere Raumlogik als Szene 2
- seitliche Lager-/Tresorwelt statt Tunnel oder Orderbuch
- der Tausch Wertpapierkorb ↔ ETF-Anteile muss ohne Text verständlich sein
- kurzer Hinweis im Overlay: `Nur wenn neue Anteile benötigt werden`

## Szene 6 — Frames 1125–1334

- Frame 1125: mechanische Verbindung zwischen Fonds und Anteil sichtbar
- Frame 1125–1334: Bildscale 1,00 → 1,045
- Frame 1125–1334: translateX 8 → -4 px
- Frame 1160–1220: Fokus auf mehrere unterschiedliche Wertpapierbausteine
- Frame 1220–1280: Fokus entlang des mechanischen Arms zum ETF-Anteil
- Frame 1280–1334: Fokus auf den sichtbar abgetrennten Bruchteil

## Szene 7 — Frames 1335–1544

- Frame 1335: Anleger, ETF-Anteil und Fonds-Tresor vollständig sichtbar
- Frame 1335–1544: Bildscale 1,00 → 1,035
- Frame 1350–1380: Kicker einblenden
- Frame 1370–1410: Headline einblenden
- Frame 1400–1440: Body einblenden
- Frame 1490–1544: alle Bewegungen sehr langsam auslaufen lassen

## Untertitel

- wort- oder kurzgruppenbasierte Captions
- höchstens zwei Zeilen
- zentrale Position innerhalb der unteren Safe Zone
- aktuell gesprochenes Wort deutlich hervorheben
- keine Untertitel über wichtige Bildmotive legen

## Audio

- finales Voiceover ist Pflicht
- zunächst kein Musikbett
- keine SFX erfinden
- SFX nur später ergänzen, wenn konkrete Audiodateien bereitgestellt werden
