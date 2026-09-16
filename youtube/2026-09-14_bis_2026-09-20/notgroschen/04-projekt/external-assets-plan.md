# External Asset Plan — Video 01 Notgroschen

Status: Phase 1 support plan
Datenstand: 15.09.2026

Ziel: Video 01 bekommt gezielt Icons und reale B-Roll, ohne die FinanzNeo-3D-/Remotion-Welt zu ersetzen.

## Priorität

- Icons: Lucide zuerst, Phosphor nur wenn Lucide keinen passenden Begriff hat.
- B-Roll: Pexels zuerst, Pixabay als Fallback.
- Coverr/Mixkit nur nach manueller Einzelprüfung.
- Keine Remote-Assets im Render. Alles lokal speichern.

## B-Roll-Slots

### BR-01 — Hook: Reparatur / Waschmaschine
- Visual: 01 oder kurzer Übergang zwischen 01 und 02
- Zweck: echte mechanische Bewegung als 1–2,5 s Pattern Interrupt
- Query Pexels/Pixabay: `washing machine repair close up`, `appliance repair washing machine`, `broken washing machine technician`
- bevorzugt: Hände/Werkzeug/Waschmaschinen-Trommel, keine Markenlogos, keine erkennbare Person nötig
- nicht verwenden, wenn der Clip deutlich stockiger wirkt als die freigegebene Flow-Szene

### BR-02 — Auto / Bremsen
- Visual: 02
- Query: `car brake repair close up`, `mechanic brake disc`, `auto workshop brakes`
- Zweck: kurzer realer Impact bevor Kostenblöcke in Remotion übernehmen
- Dauer: ca. 1,5–2,5 s

### BR-03 — unerwartete Rechnung
- Visual: 02/03
- Query: `opening utility bill`, `invoice letter close up`, `unexpected bill paperwork`
- Zweck: Rechnung als reale Alltagssituation etablieren
- Logos, Namen, Adressen und sensible Daten dürfen nicht lesbar sein

### BR-04 — notwendige Monatsausgaben
- Visual: 09
- mögliche kurze Cutaways: `grocery checkout`, `electricity meter`, `commute train`, `rent apartment keys`
- nur maximal 2–3 Cutaways; sonst wird die Szene unruhig
- Remotion-Gesamtrechnung bleibt die Haupterklärung

### BR-05 — langfristiger Horizont
- Visual: 15/17
- Query: `calendar years planning desk`, `long term financial planning`, `saving planning notebook`
- nur einsetzen, wenn kein generischer Trading-/Laptop-Stocklook entsteht

### BR-06 — echter Notfall bezahlt
- Visual: 25/26
- Query: `repair technician invoice`, `car repair payment`, `appliance technician repair`
- Zweck: zeigen, dass die Reserve benutzt werden SOLL
- keine Kreditkarte/Markenbank als dominantes Motiv

## Icon-Set für Remotion

Die Icons sollen als lokale SVGs eingebunden werden, nicht als neue npm-Abhängigkeit. Gleiche Stroke-Width und optische Größe normalisieren.

### Visual 02
- `washing-machine` / `wrench`
- `car`
- `receipt-text`

### Visual 03
- `badge-euro` oder `landmark`
- `credit-card`
- `chart-no-axes-combined` oder `chart-line`

### Visual 08
- `wallet-cards` oder `banknote`
- `calendar-range`

### Visual 09
- `house`
- `shopping-basket`
- `zap`
- `shield-check`
- `car`

### Visual 13
- `house`
- `car`
- `briefcase-business`
- `receipt-text`

### Visual 14
- `triangle-alert`
- `receipt-text`
- `briefcase-business`
- `sliders-horizontal`

### Visual 17
- `shield-check`
- `clock`
- `chart-line`

### Visual 19
- `landmark`
- `shield-check`

### Visual 21
- `target`
- `receipt-text`
- `check-circle`

### Visual 22
- `banknote-arrow-up` bzw. Kombination aus `banknote` + Pfeil
- `wallet`
- `piggy-bank` nur wenn es nicht wieder zum Defaultmotiv wird

### Visual 23
- `euro`
- `timer`
- `target`

### Visual 24
- `calendar-days`
- `repeat-2`
- `wallet`

### Visual 26
- `wrench`
- `wallet`
- `refresh-cw`

### Visual 27
- `wrench`
- `trending-down`
- `shield-check`
- `credit-card`

### Visual 28
- `shield-check`
- `lock-keyhole`
- `chart-no-axes-combined`

## Kleine Support-Animationen

LottieFiles nur prüfen für:
- Check / erfolgreich
- Warning / Risiko
- Search / Prüfung
- Clock / Zeit
- Document / Rechnung

Keine Lottie-Animation ersetzt Visual 02, 03, 08, 09, 10, 13, 16, 17, 19, 22, 23, 26, 27 oder 28 als Hauptmechanik.

## Stilregel für Stock-B-Roll

Wenn B-Roll verwendet wird:
- kurze Einsätze statt lange Stocksequenzen
- keine übertriebene Farbkorrektur
- optional sanft entsättigen/abdunkeln, damit Schwarz/Grün/Rot-Orange der FinanzNeo-Welt dominant bleiben
- keine harten weißen Stock-Hintergründe direkt neben deep-black Flow-Bildern ohne sauberen Übergang
- kein Stockclip darf Text/Branding enthalten, das wie FinanzNeo-eigene Information wirkt

## Was NICHT gesucht werden soll

- generische Hände, die Geld zählen, nur weil es Finanzcontent ist
- Business-Handschlag
- lächelnde Person vor Trading-Chart
- Krypto-/Bitcoin-B-Roll
- Luxusauto/Luxusuhr
- zufällige Münzregen
- Dashboard-/App-Screens als Hauptbild

## Nächster technischer Schritt

Wenn echte Assets ausgewählt wurden:
1. lokal nach `04-projekt/external-assets/` speichern
2. `external-assets-ledger.json` ergänzen
3. nur die betroffenen Visuals verbinden
4. `youtube:animation:validate` erneut ausführen, falls versiegelter Motion-Code verändert wurde
5. danach Phase-1-Seal neu erzeugen

Keine Änderung am Motion-Code nur zum Zweck, mehr Assets zu zeigen.