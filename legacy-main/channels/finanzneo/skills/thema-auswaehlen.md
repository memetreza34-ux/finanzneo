# Skill: FinanzNeo-Thema automatisch auswählen

## Verantwortung

Bei „Mach ein Reel“ wählt Claude das Thema selbst. Der Nutzer muss weder ein Thema vorschlagen noch zwischen mehreren Optionen entscheiden.

Nur wenn der Nutzer ausdrücklich ein Thema nennt, wird dieses Thema verwendet und als `selection-mode=user` dokumentiert.

## Reihenfolge der Themenwahl

1. `engine/topic-history.json` lesen.
2. bereits verwendete, reservierte oder stark ähnliche Themen ausschließen.
3. aktuelle Finanzentwicklungen der vergangenen 7–30 Tage prüfen.
4. aktuelle offizielle beziehungsweise primäre Quellen aus Deutschland und der Eurozone priorisieren.
5. gleichzeitig starke Evergreen-Themen für Finanzanfänger in Deutschland prüfen.
6. beide Gruppen nach Nutzen, Verständlichkeit, Quellenlage und Visualisierbarkeit bewerten.
7. genau ein Thema auswählen.
8. genau einen freien Wochentag zuordnen.
9. Auswahlgrund und Auswahlmodus im Projekt dokumentieren.
10. nur den Reel-Ordner dieses Tages anlegen.

## Wann ein Trendthema gewählt wird

Ein Trendthema wird nur gewählt, wenn alle Punkte erfüllt sind:

- die Entwicklung ist aktuell und für Menschen in Deutschland oder der Eurozone relevant,
- mindestens zwei belastbare und möglichst primäre beziehungsweise offizielle Quellen bestätigen die Kernaussage,
- das Thema betrifft eine konkrete Geldentscheidung, einen Preis, einen Zins, eine Steuer, einen ETF, ein Konto, einen Kredit oder die Kaufkraft,
- der Nutzen für Finanzanfänger ist innerhalb eines Satzes erklärbar,
- der Trend lässt sich ohne Spekulation und ohne reißerische Prognose erklären,
- das Thema ist nicht bereits im Themenregister verwendet oder reserviert,
- daraus entstehen eine klare Hook und mindestens sechs konkrete Visualisierungen.

Bevorzugte Quellen:

- Deutsche Bundesbank und Europäische Zentralbank,
- Statistisches Bundesamt,
- Bundesministerium der Finanzen,
- Bundesministerium für Wirtschaft,
- BaFin und andere zuständige offizielle Stellen,
- Originalmitteilungen ausdrücklich genannter Unternehmen oder Institutionen.

Dann verwenden:

```text
--selection-mode=trend
--selection-reason="Konkreter Grund mit Aktualität, Zielgruppenrelevanz und Visualisierbarkeit"
```

## Wann bewusst kein Trendthema gewählt wird

Kein Trendthema wählen bei:

- bloßem Social-Media-Hype ohne belastbare Quellen,
- kurzfristiger Kursbewegung ohne Lernwert,
- spekulativer Vorhersage,
- komplexer Nachricht ohne klare praktische Geldfolge,
- bereits behandeltem Thema,
- Trend, der nur mit langen Erklärungen verständlich wird,
- fehlenden oder widersprüchlichen Primärquellen.

Dann ein starkes Evergreen-Thema wählen:

```text
--selection-mode=evergreen
--selection-reason="Noch unbenutztes Grundlagenproblem mit hohem Alltagsnutzen und klarer Visualisierung"
```

## Bewertungssystem

Jeder Kandidat erhält intern 0–2 Punkte in diesen Bereichen:

1. Relevanz für Finanzanfänger in Deutschland
2. Aktualität oder dauerhafter Nutzen
3. Klarheit der Geldfolge
4. Quellenqualität
5. Hook-Potenzial
6. Visualisierbarkeit mit Bildern und Remotion
7. Abgrenzung zu bisherigen Themen
8. PDF- oder Checklisten-Nutzen

Nur Themen ab 12 von 16 Punkten dürfen gewählt werden.

Ein Trendthema erhält keinen Bonus nur für Aktualität. Ein gutes Evergreen-Thema darf gewinnen, wenn es nützlicher und klarer ist.

## Verbotene Themenwahl

- kein zweites Thema für denselben Wochentag,
- keine sieben Themen auf einmal,
- keine sieben leeren Tagesordner,
- keine Liste mit Themenvorschlägen an den Nutzer,
- keine Rückfrage „Welches Thema möchtest du?“,
- keine Themenwiederholung mit nur leicht verändertem Titel,
- keine reine Aktien- oder Kryptoprognose,
- keine persönliche Kauf- oder Verkaufsempfehlung.

## Dokumentation

Der `finance:new`-Befehl enthält immer:

```bash
npm run finance:new -- <slug> \
  --topic="Eindeutiges Thema" \
  --title="Kurzer Reel-Name" \
  --publish-date=YYYY-MM-DD \
  --selection-mode=trend|evergreen|user \
  --selection-reason="Konkreter Auswahlgrund" \
  --selected-by=assistant|user
```

`production-status.json` und `topic-history.json` speichern:

- wer das Thema gewählt hat,
- ob es Trend, Evergreen oder Nutzervorgabe war,
- warum es gewählt wurde,
- welchem einzigen Wochentag es zugeordnet ist.

## Ergebnis

Die Themenwahl endet immer mit genau einem Thema für genau einen freien Tag. Erst danach wird genau dieser eine Reel-Ordner angelegt und im selben Arbeitsdurchlauf vollständig inhaltlich ausgearbeitet. Alle anderen Tagesordner bleiben unangetastet, bis für sie später tatsächlich ein eigenes Reel gestartet wird.
