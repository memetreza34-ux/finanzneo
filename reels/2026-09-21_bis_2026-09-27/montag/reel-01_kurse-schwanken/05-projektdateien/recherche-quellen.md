# Recherche und Quellen

## Gemessene Reihe

- **Quelle:** Yahoo Finance, Symbol URTH (iShares MSCI World ETF), 10 Jahre Monatswerte
- **Abruf:** `node scripts/fetch-data.mjs stock URTH 10y msci-world`
- **Datei:** `public/data/msci-world.json`, Feld `fetchedAt` = 2026-09-20
- **Abgeleitete Kennzahlen:** Faktor 2,91x von 2016-10 bis 2026-09; tiefster Rueckgang 24 % gegenueber dem bis dahin hoechsten Stand, vom Hoch 2021-11 bis 2022-09
- **Berechnung:** `kursreiheFuerAnimation` in `src/design-system/market-data.ts`; der Rueckgang ist der maximale Drawdown, nicht der Abstand zum Startwert

Die Reihe ist ein Stand und kein Live-Wert. Sie wurde einmal in Phase 1 geholt und wird
in Phase 3 nicht erneut abgerufen, weil sonst die Zahlen im Voiceover nicht mehr zum
Bild passen.

## Gerechnete Annahme

- **Funktion:** `sparplanFuerAnimation` in `src/design-system/finance-motion.ts`
- **Annahme:** 200 EUR monatlich, 6 % p. a., 30 Jahre, monatliche Verzinsung
- **Ergebnis:** 72.000 EUR eingezahlt, rund 128.903 EUR Zinsen, rund 200.903 EUR Endwert
- Das ist eine Beispielrechnung und keine Zusage einer Rendite.

## Inhaltliche Einordnung

Der Reel behauptet nicht, dass Kurse immer zurueckkommen. Er zeigt an einer gemessenen
Reihe, dass ein Zeitraum mit starkem Gesamtergebnis trotzdem einen tiefen Einbruch
enthalten kann, und dass ein Verkauf an diesem Tiefpunkt den Buchverlust realisiert.
Die Betraege in scene-05 sind zur Veranschaulichung gewaehlt und als solche im Bild
gekennzeichnet.

## Keine Anlageberatung

Der Reel enthaelt keine Empfehlung fuer ein bestimmtes Produkt.
