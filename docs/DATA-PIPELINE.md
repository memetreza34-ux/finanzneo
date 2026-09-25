# FinanzNeo — Data Pipeline

Ziel: echte Finanz-/Wirtschaftsdaten für Remotion verwenden, ohne den finalen Render vom Internet abhängig zu machen.

## Grundregel

```text
externe Quelle
→ Daten vor Produktion laden
→ Quelle/Serien-ID/Stand speichern
→ lokales JSON unter public/data/
→ validieren
→ Remotion rendert ausschließlich lokal
```

Remote Requests während eines produktiven Remotion-Renders sind verboten.

## Quellenpriorität

### 1. Offizielle Primärquellen

Für Aussagen über Deutschland/Euro-Raum bevorzugen:

- Deutsche Bundesbank SDMX REST API
- ECB Data Portal SDMX REST API
- Destatis GENESIS für amtliche deutsche Statistiken

### 2. DBnomics als Discovery-/Aggregator-Schicht

DBnomics ist eine freie Plattform, die viele öffentliche Wirtschafts-Datenanbieter in einem einheitlichen System bündelt. Gut zum Finden und Vereinheitlichen von Zeitreihen. Wenn möglich bleibt im Snapshot trotzdem der ursprüngliche Provider/Datensatz erkennbar.

### 3. Markt-/Asset-Daten

- Yahoo Finance: Aktien, ETFs, Indizes als praktische Marktquelle
- CoinGecko: Krypto
- ExchangeRate-API: einfache FX-Snapshots

Bei Veröffentlichungen immer klar kennzeichnen, ob etwas Index, ETF, Proxy oder berechneter Wert ist.

## Verfügbare API-Muster

### Deutsche Bundesbank

Basis:

```text
https://api.statistiken.bundesbank.de/rest/data/{flowRef}/{key}
```

Die Bundesbank unterstützt u. a. SDMX-JSON und CSV sowie `startPeriod`/`endPeriod`.

### ECB Data Portal

Basis:

```text
https://data-api.ecb.europa.eu/service/data/{flowRef}/{key}
```

Für CSV:

```text
?format=csvdata
```

Auch hier sind `startPeriod`/`endPeriod` möglich.

### Destatis GENESIS

GENESIS bietet RESTful/JSON-Webservices für Suche, Katalog, Daten und Metadaten. Viele produktive Endpunkte benötigen GENESIS-Zugangsdaten. Deshalb ist Destatis im Quellenregister vorhanden, aber nicht Teil des No-Key-Standard-Fetchs.

## Snapshot-Schema

Neue Zeitreihen sollen mindestens enthalten:

```json
{
  "schemaVersion": 2,
  "kind": "timeseries",
  "source": "European Central Bank",
  "provider": "ECB",
  "seriesId": "EXR/M.USD.EUR.SP00.A",
  "sourceUrl": "https://...",
  "fetchedAt": "YYYY-MM-DD",
  "frequency": "M",
  "unit": null,
  "instrumentType": null,
  "proxyFor": null,
  "chart": [
    {"x": "2026-01", "y": 1.23}
  ]
}
```

Für Snapshots ohne Zeitreihe, z. B. FX-Rates, darf `kind` abweichen. `source`, `sourceUrl` und `fetchedAt` bleiben Pflicht.

## Proxy-Regel

Ein ETF darf nicht stillschweigend als zugrunde liegender Index bezeichnet werden.

Beispiel:

```text
URTH = ETF/Marktproxy
nicht = originale MSCI-World-Indexreihe
```

Wenn ein Proxy genutzt wird, `instrumentType` und `proxyFor` im Snapshot setzen und die Videoformulierung entsprechend wählen.

## CLI

Standarddaten:

```bash
npm run data:fetch
```

Eigene Marktserie:

```bash
node scripts/fetch-data.mjs stock AAPL 5y apple-5y
node scripts/fetch-data.mjs crypto bitcoin 365 bitcoin-1y
node scripts/fetch-data.mjs fx EUR
```

Offizielle Zeitreihe:

```bash
node scripts/fetch-data.mjs ecb EXR M.USD.EUR.SP00.A eur-usd-monthly 2020-01
node scripts/fetch-data.mjs bundesbank BBEX3 D.USD.EUR.BB.AC.000 usd-eur-daily 2026-01-01
```

Validieren:

```bash
npm run data:validate
```

## Remotion-Nutzung

```ts
import series from '../public/data/example.json';
```

Danach nur `series.chart` bzw. den lokalen Snapshot verwenden. Niemals in einer Composition `fetch()` auf eine Remote-API ausführen.

## Quellenhinweis im Video

Bei datengetriebenen Visuals mindestens Quelle + Stand zeigen. Bei sensiblen Vergleichen zusätzlich Serienbezeichnung/Definition prüfen, damit z. B. Index, ETF, Preisindex und Veränderungsrate nicht verwechselt werden.
