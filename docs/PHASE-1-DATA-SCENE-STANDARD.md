# FinanzNeo — Datenszenen-Standard für Phase 1

Datenstand: 20.09.2026

Technische Quelle ist `scripts/validate-data-scene-contract.mjs`. Dieses Dokument erklärt die Absicht; bei Widersprüchen gilt der Code.

## Wofür eine Datenszene da ist

Ein Reel hat drei Bildsprachen, und sie beantworten verschiedene Fragen:

```text
Zeigt die Szene eine Situation?     → Flow-Bild
Zeigt die Szene eine Veränderung?   → Animation
Zeigt die Szene ein Verhältnis?     → Datenszene
```

Ein Foto kann nicht zeigen, wie unruhig zehn Jahre Weltmarkt waren. Eine Animation kann es auch nicht — sie müsste eine Bewegung erfinden, die der Inhalt nicht hat. Ein gezeichnetes Verhältnis kann es.

Deshalb ist die Datenszene keine dritte Dekoration, sondern der Fall, in dem eine **echte Zahl** die Aussage trägt. Ohne Zahl ist es keine Datenszene, sondern ein Flow-Bild.

## Schritt 1 — die Zahl holen, bevor sie behauptet wird

```bash
node scripts/fetch-data.mjs stock URTH 10y msci-world
node scripts/fetch-data.mjs crypto bitcoin 365 btc
node scripts/fetch-data.mjs fx EUR
```

Kostenlos, ohne API-Key. Quellen sind Yahoo Finance für Aktien und ETFs, CoinGecko für Krypto und ein Wechselkursdienst für Währungen. Die Datei landet unter `public/data/` und trägt `source`, `symbol`, `range` und `fetchedAt`.

**Erst wenn die Datei liegt, dürfen Zahlen ins Skript.** Eine Reihe ist ein Stand, kein Live-Wert. Wer „2,91×" schreibt und später neu abruft, hat ein Voiceover, das nicht mehr zum Bild passt.

Für öffentliche Statistik ohne Skript — Destatis, Bundesbank, EZB — gilt dasselbe: Wert und Stand gehören festgehalten, bevor sie behauptet werden.

## Schritt 2 — die Szene anmelden

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" --types image,data,image,animation,image
```

Der Szenenordner bekommt `daten.md` statt `bildprompt.txt` oder `remotion.md`, dazu einen `animation.tsx`-Stub. Im `scene-index.json` stehen zusätzlich vier Felder:

```json
{
  "dataOrigin": "measured",
  "dataSource": "public/data/msci-world-10y.json",
  "dataClaim": "Zehn Jahre Weltmarkt steigen fast aufs Dreifache und fallen zwischendurch deutlich.",
  "sourceNote": "Quelle: Yahoo Finance · URTH · 10y, Stand 7.6.2026"
}
```

| Feld | Bedeutung |
|---|---|
| `dataOrigin` | `measured` = abgerufene Reihe · `calculated` = Rechnung aus `finance-motion.ts` |
| `dataSource` | bei `measured` die Datei unter `public/data/`, bei `calculated` die Rechenfunktion |
| `dataClaim` | der Satz, den die Zahlen belegen sollen — als Satz, nicht als Stichwort |
| `sourceNote` | genau der Satz, der im Bild erscheint |

Eine Datenszene hat **kein** `googleFlowFileName`. Die Bildnummer bleibt reserviert.

## Schritt 3 — die Komponente bauen

Die `animation.tsx` liest ihre Zahlen aus der Quelle, statt sie einzutippen. Vorhandene Helfer:

| Helfer | Wofür |
|---|---|
| `kursreiheFuerAnimation` | macht aus einer Datei Faktor, Minimum, Maximum und den tiefsten Einbruch |
| `kursPfad` | schreibt die Reihe als SVG-Pfad, den `DrawnLine` zeichnet |
| `sparplanFuerAnimation` | Sparplan mit Einzahlungen und Zinsen getrennt |
| `kaufkraftFuerAnimation` | Kaufkraftverlust über Zeit |
| `kreditFuerAnimation` | Kredit mit Zins- und Tilgungsanteil |
| `euroText` | einheitliche Euro-Formatierung |

Alles aus `../design-system`. Die Physical-Primitives für Gegenstände kommen aus `../motion`.

**Die Quellenzeile muss in der Komponente stehen**, wortgleich zu `sourceNote`. Der Validator prüft das, weil eine Quellenzeile, die nur im `scene-index.json` steht, im Video niemand sieht.

## Was geprüft wird

`npm run reel:data:validate -- <Reel-Pfad>` — läuft auch automatisch in `reel:validate` und damit in `reel:ready`.

- `dataOrigin` ist `measured` oder `calculated`
- bei `measured`: die Datei existiert, hat `fetchedAt` und eine verwertbare Reihe
- bei `measured`: `sourceNote` nennt den Stand
- bei `calculated`: `sourceNote` kennzeichnet die Annahme als Annahme
- `sourceNote` steht wortgleich in der Komponente
- die Komponente liest wirklich die Datei aus `dataSource`

## Referenz

`src/reels-test/DatenSzenen.tsx` zeigt vier gebaute und gerenderte Datenszenen: gemessene Reihe mit markiertem Tiefpunkt, zwei gestapelte Flächen, Füllstand mit Ziellinie, Rechnung gegen Wirklichkeit.

**Eine Warnung dazu.** Die dortige Visualbelegung liegt im Median bei 7,9 % und damit unter der Future-V3-Grenze von 12 %. Eine gezeichnete Kurve allein füllt den Frame nicht. Wo ein Gegenstand aus `../motion` neben der Reihe steht, steigt die Belegung deutlich — ein gemessener Vergleich derselben Szene kam von 11,5 % auf 25,1 %.

Datenszene heißt also nicht „nur Diagramm". Die Zahl trägt die Aussage, der Gegenstand trägt das Bild.

## Verboten

- Zahlen ohne Quelle
- Quellenzeile nur im Index statt im Bild
- gerundete Werte, die nicht aus der Quelle stammen
- „ungefähr" statt eines belegten Werts
- frische Daten in Phase 3 nachholen
- eine Datenszene ohne Zahl — das ist ein Flow-Bild
