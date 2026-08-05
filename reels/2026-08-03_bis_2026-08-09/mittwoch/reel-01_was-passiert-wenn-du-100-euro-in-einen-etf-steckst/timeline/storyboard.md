# Storyboard — Was passiert mit deinen 100 Euro beim ETF-Kauf?

## Format

- 1080 × 1920
- 30 FPS
- Original-Voiceover: 72,42 Sekunden
- Verarbeitung: pitch-erhaltend auf 1,10×
- erwartete Laufzeit vor Transkription: ungefähr 65,84 Sekunden
- erwartete Composition vor Transkription: ungefähr 1.976 Frames
- 7 Szenen
- 5 Bildszenen
- 2 Remotion-Animationsszenen
- keine zwei Animationen direkt hintereinander
- keine Dashboard-Szene

## Zeitliche Quelle der Wahrheit

Die Zeiten in diesem Dokument sind **vorläufige Startwerte**. Vor dem Build wird die Aufnahme auf 1,10× beschleunigt und lokal mit Whisper.cpp transkribiert. Danach bestimmen die echten Wort- und Satzzeitstempel die endgültigen Szenengrenzen.

Verbindliche Dateien nach der Verarbeitung:

```text
timeline/scene-timing.json
timeline/transcript-timing.md
04-caption/voiceover-final.captions.json
render/audio/voiceover-runtime-1-10x.wav
```

Geplante und echte Zeiten müssen nicht identisch sein. Inhalt, Szenenreihenfolge und Voiceover-Zuordnung bleiben unverändert.

## Szene 1 — Direkte Einstiegsfrage

**Vorläufige Zeit:** 0:00–0:07,64  
**Vorläufige Dauer:** 7,64 Sekunden  
**Typ:** Bild  
**Voiceover:** Was passiert eigentlich, wenn du 100 Euro in einen ETF steckst? Wohin geht das Geld – und was bekommst du dafür?

**Bildhandlung:** Eine große 100-Euro-Münze startet sichtbar ihren Weg über Broker und Börse bis zu einem ETF-Anteil. Schon im ersten Bild ist klar, dass das Reel den Weg des Geldes beim ETF-Kauf erklärt.

**Overlay:**

- Kicker: `ETF EINFACH ERKLÄRT`
- Headline: `Was passiert mit 100 € im ETF?`

**Bewegung in zwei Phasen:**

1. Gesamtansicht mit ruhigem Push-in.
2. Engerer Fokus auf den Weg der 100 Euro Richtung Börse und ETF-Anteil.

## Szene 2 — Aus dem Klick wird eine Order

**Vorläufige Zeit:** 0:07,64–0:20,01  
**Vorläufige Dauer:** 12,37 Sekunden  
**Typ:** Remotion-Animation  
**Komponente:** `EtfOrderMatchAnimation`

**Voiceover:** Zuerst wird aus deinem Klick eine Kauforder. Der Broker schickt sie an den gewählten Handelsplatz, wo sie im Orderbuch auf ein passendes Verkaufsangebot trifft – oft von einem anderen Anleger oder einem Market Maker.

**Startzustand:** Ein einzelner Kaufauftrag entsteht am Smartphone.

**Handlung:**

1. Der Auftrag wird als leuchtende Order-Kapsel aus dem Smartphone herausgeschoben.
2. Er passiert eine Broker-Schleuse.
3. Die Kamera folgt der Kapsel in eine räumliche Börsenhalle.
4. Dort stehen Verkaufsangebote als physische Preisstecker in einer geordneten Schiene.
5. Die Kauforder passiert unpassende Angebote.
6. Ein passendes Verkaufsangebot rast aus der Gegenschiene heran.
7. Beide Kapseln rasten hör- und sichtbar zusammen.
8. Die bestätigte Transaktion verlässt die Börsenhalle als versiegeltes Tauschpaket.

**Wichtig:** Kein Bildschirm-Orderbuch, keine Tabellen, keine Balken. Das Orderbuch wird als räumliches Sortier- und Matching-System dargestellt.

## Szene 3 — Geld gegen ETF-Anteil

**Vorläufige Zeit:** 0:20,01–0:27,65  
**Vorläufige Dauer:** 7,64 Sekunden  
**Typ:** Bild  
**Voiceover:** Sobald Preis und Menge zusammenpassen, wird der Handel ausgeführt: Der Verkäufer bekommt dein Geld, und der ETF-Anteil wird deinem Depot gutgeschrieben.

**Bildhandlung:** Auf einem soliden Börsentisch kreuzen sich zwei klare Wege. Die 100-Euro-Münze geht zum Verkäufer, der ETF-Anteil wandert in das Depotfach des Käufers.

**Overlay:**

- Kicker: `DER TAUSCH`
- Headline: `Geld raus – ETF-Anteil ins Depot`

**Bewegung in zwei Phasen:**

1. Gesamtansicht beider Tauschwege.
2. Fokusfahrt vom Geldweg zum ETF-Anteil im Depot.

## Szene 4 — Was ein ETF-Anteil bedeutet

**Vorläufige Zeit:** 0:27,65–0:36,74  
**Vorläufige Dauer:** 9,09 Sekunden  
**Typ:** Bild  
**Voiceover:** Dieser Anteil gehört zu einem Fonds, der bereits viele Wertpapiere hält. Du kaufst also nicht selbst jede einzelne Aktie, sondern einen Anteil am gesamten Fondsvermögen.

**Bildhandlung:** Ein transparenter ETF-Tresor enthält verschiedene Branchen. Ein einzelner ETF-Anteil passt sichtbar als proportionaler Besitzbaustein an den gesamten Tresor.

**Overlay:**

- Kicker: `DEIN BESITZ`
- Headline: `Ein Anteil am ganzen Fonds`

**Bewegung in zwei Phasen:**

1. Enger Fokus auf den einzelnen ETF-Anteil.
2. Ruhiger Pull-out zum vollständigen Fondsvermögen.

## Szene 5 — Wie neue ETF-Anteile entstehen

**Vorläufige Zeit:** 0:36,74–0:46,20  
**Vorläufige Dauer:** 9,46 Sekunden  
**Typ:** Remotion-Animation  
**Komponente:** `EtfCreationBasketExchangeAnimation`

**Voiceover:** Steigt die Nachfrage so stark, dass neue Anteile gebraucht werden, kann ein Authorized Participant einen passenden Wertpapierkorb an den Fonds liefern und dafür neue ETF-Anteile erhalten.

**Startzustand:** Auf der linken Seite steht ein beladener Wertpapierkorb. Rechts ist ein geschlossener Fonds-Tresor mit einer leeren Ausgabeschleuse.

**Handlung:**

1. Ein neutraler Authorized-Participant-Transporter fährt den Wertpapierkorb zum Fonds.
2. Der Korb enthält sichtbar verschiedene Branchenbausteine in festen Gewichten.
3. Der Fonds-Tresor prüft und übernimmt den vollständigen Korb.
4. Im Inneren verriegeln sich die Wertpapierbausteine im Fondsvermögen.
5. Auf der anderen Seite werden neue ETF-Anteilsscheiben ausgegeben.
6. Der Transporter nimmt die neuen Anteile zurück zum Handelsmarkt.

**Endzustand:** Der Fonds besitzt den zusätzlichen Wertpapierkorb; der Authorized Participant besitzt neue ETF-Anteile.

**Wichtig:** Diese Szene wird ausdrücklich als möglicher Primärmarktprozess gezeigt, nicht als Ablauf jedes einzelnen Privatanlegerkaufs. Kein identisches Layout zu Szene 2.

## Szene 6 — Wovon der Anteilswert abhängt

**Vorläufige Zeit:** 0:46,20–0:56,02  
**Vorläufige Dauer:** 9,82 Sekunden  
**Typ:** Bild  
**Voiceover:** Ab dann bewegt sich der Wert deines Anteils mit den enthaltenen Wertpapieren. Bei einem Sparplan kannst du je nach Anbieter auch nur einen Bruchteil eines Anteils besitzen.

**Bildhandlung:** Ein mechanischer Verbund verbindet den Wertpapierkorb im Fonds mit dem ETF-Anteil im Depot. Mehrere enthaltene Werte bewegen sich unterschiedlich, der ETF-Anteil folgt dem gemeinsamen Ergebnis. Ein sauber abgetrennter Teil des Anteils verdeutlicht einen Bruchteil.

**Overlay:**

- Kicker: `DANACH`
- Headline: `Der Anteil folgt dem Fondsvermögen`

**Bewegung in zwei Phasen:**

1. Fokus auf die enthaltenen Wertpapiere.
2. Kamerafahrt entlang der Verbindung zum ETF-Anteil und zum Bruchteil.

## Szene 7 — Klare Antwort

**Vorläufige Zeit:** 0:56,02–1:05,84  
**Vorläufige Dauer:** 9,82 Sekunden  
**Typ:** Bild  
**Voiceover:** Der wichtigste Punkt: Deine 100 Euro gehen beim normalen Börsenkauf an die Gegenseite des Handels. Du erhältst dafür einen Fondsanteil, der wirtschaftlich an einem ganzen Wertpapierkorb hängt.

**Bildhandlung:** Der Anleger hält einen großen ETF-Anteil. Dahinter ist der vollständige Fonds-Tresor sichtbar. Ein abgeschlossener Geldweg endet klein bei der Gegenseite.

**Overlay:**

- Kicker: `KURZ GESAGT`
- Headline: `Du kaufst einen Fondsanteil`
- Body: `Nicht direkt jede einzelne Aktie`

**Bewegung in zwei Phasen:**

1. Gesamtansicht von Anleger, Anteil, Fonds und Geldweg.
2. Ruhiger finaler Fokus auf ETF-Anteil und Fondsvermögen.

## Cover

**Text:** `100 € IN EINEN ETF – WAS PASSIERT?`  
**Unterzeile:** `Der Weg deines Geldes`  
**Quelle:** Szene 1
