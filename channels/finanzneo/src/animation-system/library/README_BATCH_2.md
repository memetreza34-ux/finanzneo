# FinanzNeo Animationsbibliothek · Batch 2

Dieser zweite Bibliotheks-Batch ergänzt sechs wiederverwendbare Finanzanimationen. Er baut auf Batch 1 auf, bleibt aber weiterhin vollständig von der produktiven FinanzNeo-Composition getrennt.

## Neue Einträge

| ID | Anzeigename | Kategorie | Einsatz |
|---|---|---|---|
| `stock-vs-etf-race` | Einzelaktie gegen ETF | Börse & Märkte | Schwankung, Diversifikation und Endwert vergleichen |
| `salary-vs-inflation` | Gehalt gegen Inflation | Einkommen & Kaufkraft | Nominales Gehalt und reale Kaufkraft gegenüberstellen |
| `debt-snowball` | Schulden-Schneeball | Immobilien & Kredite | Mehrere Schulden nacheinander abbauen |
| `savings-goal-countdown` | Sparziel-Countdown | Sparen & Sicherheit | Zielbetrag, Monatsrate und verbleibende Monate zeigen |
| `retirement-gap` | Rentenlücke | Altersvorsorge | Ruhestandseinkommen und Versorgungslücke erklären |
| `etf-fee-drag` | ETF-Kosten-Effekt | Kosten & Gebühren | Langfristigen Vermögensverlust durch Gebühren zeigen |

## Bibliotheksregeln

Jeder Eintrag besitzt:

- eine eindeutige technische ID,
- einen deutschen Anzeigenamen,
- eine feste Fachkategorie,
- eine Zweckbeschreibung,
- mindestens fünf Such-Keywords,
- eine wiederverwendbare Remotion-Komponente,
- feste Demo-Daten,
- testbare Berechnungsfunktionen,
- 180 Frames Vorschauzeit.

## Befehle

```bash
npm run finance:animation-library-batch-two:structure
npm run finance:animation-library-batch-two:validate
npm run finance:animation-library-batch-two:studio
npm run finance:animation-library-batch-two:overview
npm run finance:animation-library-batch-two:render
```

## Ausgaben

```text
/tmp/finanzneo-animation-library-batch-two-overview.png
/tmp/finanzneo-animation-library-batch-two.mp4
```

## Sicherheitszustand

- keine Registrierung in `FinanzNeoRoot`,
- kein Import in `FinanceProductionLayer`,
- keine aktivierten globalen Feature-Flags,
- kein automatisches Routing,
- keine produktive Freigabe ohne lokale Tests und visuelle Prüfung.
