# FinanzNeo Animationsbibliothek · Batch 4

Batch 4 ergänzt sechs Animationen für Geldfluss, Kredite, Portfolio-Pflege, Wohnkosten, Drawdowns und Ruhestandsrisiken.

| Kategorie | Name | ID |
|---|---|---|
| Budget & Cashflow | Cashflow-Trichter | `cashflow-surplus-funnel` |
| Immobilien & Kredite | Mindestzahlungs-Falle | `credit-card-minimum-payment` |
| Investieren | Portfolio-Rebalancing | `portfolio-rebalancing` |
| Immobilien & Kredite | Mieten-gegen-Kaufen-Schnittpunkt | `rent-vs-buy-break-even` |
| Börse & Märkte | Verlust-und-Erholung | `drawdown-recovery-time` |
| Altersvorsorge | Reihenfolge-Risiko | `sequence-of-returns-risk` |

## Fachliche Grenzen

- Der Cashflow-Trichter bildet ein Monatsbudget ab und ersetzt keine vollständige Haushaltsplanung.
- Die Mindestzahlungs-Animation verwendet die übergebenen Zinssätze und Zahlungsregeln als Beispielrechnung.
- Rebalancing zeigt nur Zieltransaktionen innerhalb eines unveränderten Portfoliowerts.
- Mieten gegen Kaufen vergleicht vereinfachte kumulierte Kosten und ist keine Immobilienberatung.
- Die Drawdown-Erholung basiert auf korrekter Prozentrechnung vom reduzierten Ausgangswert.
- Das Reihenfolge-Risiko zeigt die Wirkung identischer Renditebausteine in unterschiedlicher Reihenfolge bei laufenden Entnahmen.

## Befehle

```bash
npm run finance:animation-library-batch-four:structure
npm run finance:animation-library-batch-four:validate
npm run finance:animation-library-batch-four:studio
npm run finance:animation-library-batch-four:render
```

## Ausgaben

```text
/tmp/finanzneo-animation-library-batch-four-overview.png
/tmp/finanzneo-animation-library-batch-four.mp4
```

Die Compositions sind isoliert. Sie werden nicht im produktiven `FinanzNeoRoot` registriert und aktivieren keine Feature-Flags.
