# FinanzNeo Animationsbibliothek · Batch 5

Dieser Batch ergänzt sechs wiederverwendbare Finanzanimationen, die in den bisherigen vier Bibliotheks-Batches noch fehlen.

## Animationen

| Kategorie | Name | ID |
|---|---|---|
| Anleihen & Zinsen | Zinswende bei Anleihen | `bond-rate-price-seesaw` |
| Steuern & Gehalt | Kapitalertragsteuer-Abzug | `capital-gains-tax-waterfall` |
| Business & Selbstständigkeit | Umsatz, Gewinn, Cashflow | `business-profit-cashflow` |
| Immobilien & Kredite | Mietrendite-Aufschlüsselung | `rental-yield-breakdown` |
| Investieren | Diversifikations-Puffer | `diversification-shock-absorber` |
| Einkommen & Kaufkraft | Lifestyle-Inflation | `lifestyle-inflation` |

## Fachliche Regeln

- Die Anleiheanimation nutzt die Duration-Näherung und kennzeichnet sie sichtbar als Näherungsrechnung.
- Die Steueranimation arbeitet nur mit explizit übergebenen Beispielwerten und ist kein Steuerrechner.
- Gewinn und operativer Cashflow werden getrennt berechnet.
- Brutto- und Nettomietrendite verwenden unterschiedliche Kostenbasen.
- Der Diversifikationsschock wird aus normalisierten Portfolio-Gewichten berechnet.
- Lifestyle-Inflation misst verlorenes zusätzliches Sparpotenzial nach einer Einkommenssteigerung.

## Lokale Befehle

```bash
npm ci
npm run finance:animation-library-batch-five:structure
npm run finance:animation-library-batch-five:validate
npm run finance:animation-library-batch-five:render
```

## Ausgaben

```text
/tmp/finanzneo-animation-library-batch-five-overview.png
/tmp/finanzneo-animation-library-batch-five.mp4
```

## Sicherheitszustand

- isolierte Remotion-Compositions
- keine Registrierung im produktiven `FinanzNeoRoot`
- kein Import in `FinanceProductionLayer`
- globale Animations-Feature-Flags bleiben deaktiviert
- kein automatisches Routing
- keine Produktionsfreigabe ohne lokale Tests und visuelle Prüfung
