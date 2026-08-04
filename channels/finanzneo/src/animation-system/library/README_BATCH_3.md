# FinanzNeo Animationsbibliothek · Batch 3

Dieser Batch ergänzt sechs wiederverwendbare Finanzanimationen. Er baut auf Batch 2 auf und bleibt vollständig vom produktiven FinanzNeo-Renderpfad getrennt.

## Neue Animationen

| Kategorie | ID | Anzeigename | Zweck |
|---|---|---|---|
| Steuern & Gehalt | `gross-net-waterfall` | Brutto-Netto-Wasserfall | Steuern und Sozialabgaben vom Brutto bis zum Netto zeigen |
| Steuern & Gehalt | `tax-class-comparison` | Steuerklassen-Vergleich | Beispielhafte Netto-Auszahlungen bei gleichem Brutto vergleichen |
| Investieren | `dca-vs-lump-sum` | Sparplan gegen Einmalanlage | Unterschiedliche Kaufzeitpunkte und Anteile darstellen |
| Börse & Märkte | `market-bubble-cycle` | Börsenblase und Absturz | Hoffnung, Euphorie und Panik als Marktzyklus zeigen |
| Versicherungen | `insurance-cost-stack` | Versicherungskosten-Stapel | Monatsbeiträge zu Jahreskosten zusammenführen |
| Vermögen | `wealth-distribution` | Vermögensverteilung | Bevölkerung und gehaltenen Vermögensanteil vergleichen |

## Composition-IDs

- `FinanzNeoAnimationLibraryBatchThree`
- `FinanzNeoAnimationLibraryBatchThreeOverview`

## Befehle

```bash
npm run finance:animation-library-batch-three:structure
npm run finance:animation-library-batch-three:validate
npm run finance:animation-library-batch-three:studio
npm run finance:animation-library-batch-three:overview
npm run finance:animation-library-batch-three:render
```

## Ausgaben

```text
/tmp/finanzneo-animation-library-batch-three-overview.png
/tmp/finanzneo-animation-library-batch-three.mp4
```

## Fachliche Hinweise

- Der Steuerklassen-Vergleich verwendet explizit übergebene Beispielwerte und ist kein Steuerrechner.
- DCA und Einmalanlage werden mit demselben Gesamtkapital und derselben Kursreihe verglichen.
- Beim Blasen-Zyklus wird der Absturz korrekt vom vorherigen Höchstwert berechnet.
- Versicherungskosten werden aus Monatsbeiträgen auf zwölf Monate hochgerechnet.
- Bevölkerungs- und Vermögensanteile werden unabhängig voneinander auf 100 Prozent normalisiert.

## Sicherheitszustand

- keine Registrierung im produktiven `FinanzNeoRoot`
- kein Import in `FinanceProductionLayer`
- globale Animationsflags bleiben deaktiviert
- kein automatisches Routing
- keine Freigabe ohne lokalen Typecheck, Tests und visuelle Prüfung
