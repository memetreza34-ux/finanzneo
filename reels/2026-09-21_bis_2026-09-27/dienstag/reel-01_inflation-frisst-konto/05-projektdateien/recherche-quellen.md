# Recherche und Quellen

## Gerechnete Annahme — Kaufkraft

- **Funktion:** `kaufkraftFuerAnimation` in `src/design-system/finance-motion.ts`
- **Annahme:** 10.000 EUR, konstant 2,5 % Inflation pro Jahr, 10 Jahre
- **Ergebnis:** 7.811,98 EUR verbleibende Kaufkraft, Verlust 21,88 %
- Die tatsaechliche Inflation schwankt; 2,5 % ist eine Rechenannahme und keine Prognose.

## Gemessene Reihe — Weltmarkt

- **Quelle:** Yahoo Finance, Symbol URTH (iShares MSCI World ETF), 10 Jahre Monatswerte
- **Abruf:** `node scripts/fetch-data.mjs stock URTH 10y msci-world`
- **Datei:** `public/data/msci-world.json`, `fetchedAt` = 2026-09-21
- **Kennzahlen:** Faktor 2,93x von 2016-10 bis 2026-09; tiefster Rueckgang 24 % gegenueber dem bis dahin hoechsten Stand, vom Hoch 2021-11 bis 2022-09
- Die Reihe wurde in Phase 1 einmal geholt und wird in Phase 3 nicht erneut abgerufen.

## Inhaltliche Einordnung

Der Reel behauptet nicht, dass Sparen falsch ist. Er trennt zwei Dinge: den
Notgroschen, der verfuegbar bleiben muss, und den Teil, der jahrelang nur liegt.
Nur fuer den zweiten Teil stellt sich die Frage ueberhaupt.

Die Gegenueberstellung mit dem Weltmarkt zeigt bewusst auch den Einbruch von 24 %,
damit der Reel nicht den Eindruck erweckt, die Alternative verlaufe ruhig.

## Keine Anlageberatung

Der Reel enthaelt keine Empfehlung fuer ein bestimmtes Produkt.
