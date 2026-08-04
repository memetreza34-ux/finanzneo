# FinanzNeo Animationsbibliothek · Batch 6

Dieser Batch ergänzt sechs wiederverwendbare Finanzanimationen. Die Compositions sind isoliert und nicht mit der produktiven FinanceNeo-Ausgabe verbunden.

| ID | Anzeigename | Kategorie |
|---|---|---|
| `subscription-creep` | Abo-Kosten wachsen leise | Konsum & Verträge |
| `currency-exchange-spread` | Wechselkurs und Gebühren | Kosten & Gebühren |
| `loan-refinance-break-even` | Umschuldungs-Schnittpunkt | Immobilien & Kredite |
| `dividend-yield-trap` | Dividendenrendite-Falle | Investieren |
| `savings-rate-freedom-timeline` | Sparquote gegen Zeit | Finanzielle Freiheit |
| `bnpl-installment-stack` | Ratenkauf-Stapel | Konsum & Verträge |

## Fachliche Grenzen

- Wechselkurswerte sind explizite Beispiele und keine aktuellen Marktkurse.
- Die Umschuldung nutzt eine vereinfachte Annuitätenrechnung und berücksichtigt nur übergebene Wechselkosten.
- Die Dividendenanimation addiert Ausschüttungsrendite und Kursänderung für eine transparente Einperioden-Beispielrechnung.
- Die Freiheits-Zeitleiste setzt konstantes Einkommen, konstante Rendite und konstante Sparquote voraus.
- BNPL-Verträge werden aus den explizit übergebenen Raten und Restmonaten berechnet.

## Lokale Prüfung

```bash
npm ci
npm run finance:animation-library-batch-six:structure
npm run finance:animation-library-batch-six:validate
npm run finance:animation-library-batch-six:render
```

Erwartete Dateien:

```text
/tmp/finanzneo-animation-library-batch-six-overview.png
/tmp/finanzneo-animation-library-batch-six.mp4
```

## Sicherheitszustand

- kein Import in `FinanceProductionLayer`
- keine Registrierung im produktiven `FinanzNeoRoot`
- kein automatisches Routing
- globale Animations-Feature-Flags bleiben deaktiviert
