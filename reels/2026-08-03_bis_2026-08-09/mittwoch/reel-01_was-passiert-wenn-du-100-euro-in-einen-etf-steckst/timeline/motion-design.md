# Motion Design — ETF-Kauf erklärt

## Globale Regeln

- 1080 × 1920, 30 FPS
- Original-Voiceover: 72,42 Sekunden
- Voiceover-Verarbeitung: pitch-erhaltend auf 1,10×
- erwartete Laufzeit vor Transkription: ungefähr 65,84 Sekunden
- erwartete Composition vor Transkription: ungefähr 1.976 Frames
- endgültige Grenzen kommen aus `timeline/scene-timing.json`
- echte Whisper-Wortzeitstempel bestimmen die Szenenwechsel
- Untertitelbereich: untere 330 Pixel dauerhaft freihalten
- Bilder bleiben Vollbild; keine kleinen Kartenrahmen
- Überschriften kurz, maximal zwei Zeilen
- keine dekorativen Zahlenzähler
- keine wiederholten Balken- oder Kurvenanimationen
- Bildszenen erhalten mindestens zwei sichtbare Bewegungsphasen
- Animationsszenen zeigen eine vollständige Handlung mit Start- und Endzustand
- Schnitte an gesprochenen Abschnittsgrenzen und Objektbewegungen ausrichten

## Timing-Regel

Die folgenden Zeiten und Frames sind **nur vorläufig**. Nach Ausführung von:

```bash
npm run finance:codex-reel:captions -- <projekt>
```

sind ausschließlich diese Dateien verbindlich:

```text
timeline/scene-timing.json
timeline/transcript-timing.md
```

Alle Bewegungsphasen werden relativ zur endgültigen Szenendauer skaliert. Dadurch bleiben Animation und Bildfahrten korrekt, auch wenn die Transkription die Grenze um einige Frames verschiebt.

## Vorläufige Szenengrenzen

| Szene | Zeit | ungefähre Frames |
|---|---:|---:|
| 1 | 0,00–7,64 s | 0–228 |
| 2 | 7,64–20,01 s | 229–599 |
| 3 | 20,01–27,65 s | 600–829 |
| 4 | 27,65–36,74 s | 830–1101 |
| 5 | 36,74–46,20 s | 1102–1385 |
| 6 | 46,20–56,02 s | 1386–1680 |
| 7 | 56,02–65,84 s | 1681–1975 |

## Szene 1 — Bild

### Phase A: Frage und Gesamtweg — 0 bis 48 Prozent

- Hauptmotiv steht bereits im ersten Frame vollständig.
- Kicker und Headline erscheinen in den ersten 12 Prozent.
- Bildscale bewegt sich von 1,000 auf 1,035.
- Kamera fährt leicht entlang des sichtbaren Geldwegs.

### Phase B: Fokus auf das Ziel — 48 bis 100 Prozent

- Bildscale bewegt sich von 1,035 auf 1,075.
- Fokus wandert vom 100-Euro-Motiv Richtung Börse und ETF-Anteil.
- Die letzten 8 Prozent stabilisieren das Motiv für den Übergang zur Order-Kapsel.

## Szene 2 — `EtfOrderMatchAnimation`

Die endgültigen Frames werden aus der Szenendauer berechnet. Relative Ablaufphasen:

1. **0–13 %:** Smartphone stößt eine grüne Kauforder-Kapsel aus.
2. **13–29 %:** Kapsel durchquert die Broker-Schleuse; Kamera folgt von schräg hinten.
3. **29–47 %:** Börsenhalle öffnet sich; physische Angebotsschienen werden sichtbar.
4. **47–67 %:** Kauforder fährt an unpassenden Angeboten vorbei.
5. **67–82 %:** passendes Verkaufsangebot oder Market-Maker-Quote fährt aus der Gegenschiene.
6. **82–92 %:** beide Kapseln rasten zusammen; kurzer mechanischer Impuls.
7. **92–100 %:** versiegeltes Tauschpaket verlässt die Halle Richtung Szene 3.

Bewegungsprinzipien:

- klare Beschleunigung und Abbremsung
- keine schwebenden UI-Karten
- Orderbuch als räumliche Sortiermaschine
- Preis- und Mengendaten nur als kurze physische Stecker oder Gravuren

## Szene 3 — Bild

### Phase A: vollständiger Tausch — 0 bis 48 Prozent

- Beide gekreuzten Tauschwege sind vollständig erkennbar.
- Bildscale bewegt sich von 1,035 auf 1,050.
- Kicker und Headline erscheinen in den ersten 18 Prozent.
- Kamera fährt vom Käufer zum Kreuzungspunkt.

### Phase B: Ergebnis im Depot — 48 bis 100 Prozent

- Fokus wandert vom Geldweg zum ETF-Anteil im Depotfach.
- Bildscale bewegt sich von 1,050 auf 1,075.
- Die letzten 10 Prozent stabilisieren den ETF-Anteil als Übergangsmotiv.

## Szene 4 — Bild

### Phase A: einzelner Anteil — 0 bis 44 Prozent

- Einzelner ETF-Anteil groß im Vordergrund.
- Bildscale bewegt sich von 1,090 auf 1,060.
- Kicker und Headline erscheinen früh.

### Phase B: gesamtes Fondsvermögen — 44 bis 100 Prozent

- Pull-out von 1,060 auf 1,015.
- Kamera zeigt den vollständigen ETF-Tresor mit verschiedenen Branchen.
- Die letzten 10 Prozent nutzen Tresortür oder Fondsrahmen als Übergang.

## Szene 5 — `EtfCreationBasketExchangeAnimation`

Relative Ablaufphasen:

1. **0–12 %:** Wertpapierkorb links, Fonds-Tresor rechts; klare räumliche Totale.
2. **12–28 %:** Authorized-Participant-Transporter nimmt den Korb auf.
3. **28–47 %:** Transporter fährt seitlich zum Fonds.
4. **47–64 %:** Korb wird angehoben und in die Fonds-Schleuse eingesetzt.
5. **64–78 %:** Branchenbausteine verriegeln sich sichtbar im Fondsvermögen.
6. **78–91 %:** neue ETF-Anteilsscheiben werden auf der anderen Seite ausgegeben.
7. **91–100 %:** Transporter nimmt die ETF-Anteile auf und fährt Richtung Börsenmarkt.

Bewegungsprinzipien:

- andere Raumlogik als Szene 2
- seitliche Lager- und Tresorwelt statt Tunnel oder Orderbuch
- Tausch Wertpapierkorb ↔ ETF-Anteile muss ohne langen Text verständlich sein
- kurzer Hinweis im Overlay: `Nur wenn neue Anteile benötigt werden`

## Szene 6 — Bild

### Phase A: enthaltene Wertpapiere — 0 bis 48 Prozent

- Mechanische Verbindung zwischen Fonds und Anteil sichtbar.
- Bildscale bewegt sich von 1,000 auf 1,035.
- Fokus liegt auf den verschiedenen Wertpapierbausteinen.

### Phase B: Anteil und Bruchteil — 48 bis 100 Prozent

- Kamera fährt entlang des mechanischen Arms zum ETF-Anteil.
- Bildscale bewegt sich von 1,035 auf 1,070.
- Im letzten Drittel wird der sichtbar abgetrennte Bruchteil fokussiert.
- Die letzten 10 Prozent laufen ruhig aus.

## Szene 7 — Bild

### Phase A: vollständige Antwort — 0 bis 45 Prozent

- Anleger, ETF-Anteil, Fonds-Tresor und abgeschlossener Geldweg vollständig sichtbar.
- Bildscale bewegt sich von 1,000 auf 1,030.
- Kicker, Headline und Body erscheinen nacheinander.

### Phase B: finaler Besitzfokus — 45 bis 100 Prozent

- Fokus auf ETF-Anteil und verbundenes Fondsvermögen.
- Bildscale bewegt sich von 1,030 auf 1,060.
- Endframe mindestens 0,5 Sekunden stabil halten.

## Untertitel

- echte Wort-Zeitstempel aus Whisper.cpp
- höchstens zwei Zeilen
- zentrale Position innerhalb der unteren Safe Zone
- aktuell gesprochenes Wort deutlich hervorheben
- keine Untertitel über wichtige Bildmotive legen
- keine rechnerisch verteilten Pseudo-Zeitstempel verwenden
- Synchronität im vollständigen Render visuell prüfen

## Audio

- Originaldatei in `02-audio/` unverändert aufbewahren
- für das Render ausschließlich `render/audio/voiceover-runtime-1-10x.wav` verwenden
- Beschleunigung über FFmpeg `atempo=1.10`, damit die Tonhöhe erhalten bleibt
- zunächst kein Musikbett
- keine SFX erfinden
- SFX nur ergänzen, wenn konkrete Audiodateien bereitgestellt werden
