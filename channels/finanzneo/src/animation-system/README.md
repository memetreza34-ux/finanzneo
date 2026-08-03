# FinanzNeo Animation System

> Vorbereitet, vollständig deaktiviert und vom produktiven `image-first-lite`-Workflow getrennt.

Dieses Verzeichnis enthält die technische Grundlage für spätere gezielte Remotion-Finanzanimationen. Es ersetzt den bestehenden Bild-Workflow nicht und ist weder im produktiven Root noch im produktiven Renderer registriert.

## Sicherheitszustand

Alle produktionsbezogenen Feature Flags bleiben deaktiviert und das Flag-Objekt ist mit `Object.freeze` gesperrt:

```ts
{
  enabled: false,
  allowHybrid: false,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
}
```

Zusätzlich gilt:

- keine Registrierung im produktiven `FinanzNeoRoot`
- keine Anbindung an `FinanceProductionLayer`
- keine Anbindung an `FinanceImageFirstReel`
- keine Änderung an produktiven Scene-Plan-Verträgen
- Galerie und Test-Reel besitzen eigene isolierte Entry-Points
- ungültige, mehrdeutige oder nicht exakt passende Daten bleiben im Bildmodus

## Vorbereitete Modi

- `image`: bestehender Bild-Workflow
- `hybrid`: Bild plus gezielte erklärende Remotion-Elemente
- `full-animation`: vollständige Finanzszene als Remotion-Animation

Keiner dieser Animationsmodi ist produktiv freigegeben.

## Enthaltene Templates

1. `money-flow`
2. `budget-split`
3. `compound-growth`
4. `portfolio-allocation`
5. `inflation-erosion`
6. `debt-paydown`
7. `monthly-investment`
8. `before-after-comparison`
9. `risk-return-scale`
10. `timeline-milestones`
11. `income-expense-balance`
12. `tax-fee-flow`

Jedes Template besitzt:

- einen exakten statischen Datenvertrag
- eine vollständige Laufzeit-Allowlist
- eine zentrale Pflichtfelddefinition
- kanonische Beispieldaten
- fachliche und visuelle Validierung
- Renderer-Abbildung
- Galerie- und Test-Reel-Abdeckung
- Aktivierungs- und Fallback-Tests

## Sichere Eingabegrenzen

Unbekannte KI-, API- oder JSON-Daten werden als `unknown` behandelt.

Sichere Einstiegspunkte:

```ts
parseFinanceAnimationRequest(input)
parseFinanceAnimationScene(input)
planFinanceAnimationInput(input)
planFinanceAnimationInputForTemplate(input, template, features)
planFinanceAnimationInputWithFeatures(input, features)
SafeFinanceAnimationRenderer
```

Der Parser prüft unter anderem:

- einfache Request- und Datenobjekte
- Texttypen und begrenzte Textlängen
- Textlisten für Labels
- begrenzte Feld-, Label- und Listenzahlen
- bekannte Modi und Template-IDs
- endliche Zahlen
- keine verschachtelten Objekte oder Arrays
- keine Funktionen oder anderen ausführbaren Werte

### Schutz gegen aktive oder manipulierte Objekte

- Getter und Setter werden erkannt, ohne ausgeführt zu werden
- Symbol-Schlüssel werden abgelehnt
- `__proto__`, `prototype` und `constructor` werden blockiert
- akzeptierte Objekte werden in neue Null-Prototyp-Container kopiert
- strukturierte Array-Einträge werden ebenfalls kopiert
- Änderungen am ursprünglichen Objekt verändern das geparste Ergebnis nicht
- hostile Proxies dürfen keine Ausnahme aus der öffentlichen Parsergrenze entkommen lassen

Nicht sicher lesbare Werte liefern ein kontrolliertes Fehlerergebnis statt eines ungefangenen Fehlers.

## Exakte Laufzeit-Datenverträge

`templateDataContracts.ts` verknüpft jede Template-ID statisch mit der passenden Datenstruktur.

`templates/allowedTemplateData.ts` bildet dieselben Verträge als vollständige Laufzeit-Allowlist ab. Dadurch werden auch skalare Tippfehler oder ungenutzte Zusatzfelder abgelehnt, die der grundlegende Sicherheitsparser technisch lesen könnte.

Beispiele:

- `money-flow`: nur `amount`, `fromLabel`, `toLabel`
- `compound-growth`: nur `startCapital`, `monthlyRate`, `annualReturn`, `years`
- `monthly-investment`: `monthlyRate`, `months` und optional `annualReturn`
- `portfolio-allocation`: nur `allocations` und `total`
- `timeline-milestones`: nur `milestones`

Für strukturierte Einträge gelten ebenfalls exakte Schlüssel:

```ts
portfolio: ['label', 'percent', 'value']
timeline: ['label', 'value']
```

Unbekannte Felder blockieren die Animation mit einem konkreten Feldnamen.

## Portfolio-Garantien

Portfolio-Positionen verwenden entweder vollständig Prozentwerte oder vollständig absolute Werte.

Nicht zulässig:

- `percent` und `value` im selben Eintrag
- Mischung von Prozent- und Wertmodus zwischen Positionen
- Prozentwerte, die nicht ungefähr 100 Prozent ergeben
- absolute Werte, deren Summe nicht zum dargestellten Gesamtwert passt
- doppelte Labels
- mehr als sechs Positionen

Damit stimmen Prozentanzeige, Positionswert und dargestellter Gesamtwert immer überein. Der Renderer erfindet keinen Portfoliogesamtwert.

## Sicherer Renderer-Fallback

`SafeFinanceAnimationRenderer` führt vor jedem Render `parseFinanceAnimationScene` aus. Ungültige Eingaben erreichen `FinanceAnimationRenderer` nicht.

Der Aufrufer kann wählen zwischen:

- statischem `fallback`
- dynamischem `renderFallback(context)`

Der dynamische Kontext enthält ausschließlich eingefrorene Kopien der normalisierten Diagnosen:

```ts
{
  errors,
  warnings,
}
```

Das rohe untrusted Eingabeobjekt wird nicht an den Fallback weitergereicht.

## Routing und Mehrdeutigkeit

Router und Template-Selector verwenden dieselbe Kandidatenbewertung. Bewertet werden vollständige Finanzbegriffe mit Wortgrenzen, Abdeckung der benötigten Datenfelder und ein explizit bevorzugtes Template.

Ein echter Gleichstand wird nicht über die Registry-Reihenfolge entschieden. Das System fällt kontrolliert auf `image` zurück und dokumentiert die Mehrdeutigkeit.

Blockierte Routing-, Feature- und Daten-Gründe werden bis in den finalen `FinanceAnimationPlan` übernommen und dedupliziert.

## Stufenweise Aktivierung

Die sichere Reihenfolge wird durch `validateFinanceAnimationFeatureFlags()` geprüft:

1. alle Flags deaktiviert
2. `enabled` und `allowHybrid` aktivieren
3. ein Template manuell auswählen und reale Hybrid-Szenen prüfen
4. `allowFullAnimation` erst nach erfolgreichem Hybridtest aktivieren
5. `allowAutomaticRouting` zuletzt aktivieren

Ungültige Kombinationen werden blockiert:

- aktive Modi bei `enabled: false`
- Vollanimation ohne Hybridmodus
- automatisches Routing ohne freigegebenen Animationsmodus

### Manuelle erste Aktivierungsstufe

Die erste Hybridprüfung benötigt kein automatisches Routing:

```ts
planFinanceAnimationSceneForTemplate(request, template, features)
planFinanceAnimationInputForTemplate(input, template, features)
buildAnimationPlanForTemplate(request, template, features)
```

Der Aufrufer wählt das Template explizit. Trotzdem durchlaufen Daten Parser, exakte Verträge, Semantik, Präsentationsregeln und Fallback-Logik.

### Automatische Aktivierungssimulation

```ts
planFinanceAnimationSceneWithFeatures(request, features)
planFinanceAnimationInputWithFeatures(input, features)
buildAnimationPlanWithFeatures(request, features)
```

Damit werden Router, Planner, Validator und finaler Plan mit expliziten Testflags simuliert, ohne die global deaktivierten Produktionsflags zu verändern.

Alle zwölf kanonischen Fixtures werden geprüft für:

- manuelle Hybridauswahl bei deaktiviertem automatischem Routing
- automatischen Hybridpfad
- automatischen Vollanimationspfad
- sicheren Bildmodus bei deaktiviertem Routing
- unverändert deaktivierten globalen Produktionspfad

## Fachliche und visuelle Validierung

Vor einem Render werden unter anderem geprüft:

- Pflichtfelder und unbekannte Zusatzfelder
- endliche und fachlich erlaubte Zahlen
- Prozentwerte und Laufzeiten
- Budgetsumme von ungefähr 100 Prozent
- konsistente Portfolio-Gewichtungsart und Gesamtsumme
- eindeutige Portfolio- und Timeline-Labels
- maximale sichtbare Anzahl von Positionen und Meilensteinen
- Restschuld nicht über Ausgangsschuld
- bezahlte Raten nicht über Gesamtraten
- Steuern und Gebühren nicht über Brutto
- positive Inflation für Kaufkraftverlust
- sinnvolles Startkapital oder Einzahlung für Zinseszins
- sichtbare Unterschiede bei Vergleichsszenen
- Kernaussage, Voiceover und Labels

Fehler blockieren den Render. Warnungen bleiben als Diagnosen erhalten.

## Visuelle Konsistenz

- Budgetbalken starten bei null
- Portfolio-Prozente und Geldwerte verwenden dieselbe Normalisierung
- Geldfluss-Prozentanzeigen ergeben als ganze Zahlen exakt 100 Prozent
- Restschuld und Ratenfortschritt laufen gemeinsam
- Inflation, Kaufkraft und vergangene Jahre laufen gemeinsam
- Sparplanwert und Einzahlungen laufen gemeinsam
- Steuern, Gebühren und Netto ergeben gemeinsam 100 Prozent
- positive, negative und neutrale Vergleiche verwenden passende Zustände
- Überschuss und Defizit werden unterschiedlich dargestellt
- Timeline-Karten werden bei fünf Einträgen verkleinert
- Zinseszinsbalken werden aus den tatsächlichen Werten abgeleitet
- sichtbares `-0` wird verhindert

## Kanonische Fixtures

`fixtures/financeAnimationFixtures.ts` enthält genau eine gültige Szene pro registriertem Template. Dieselben Fixtures werden von Galerie, Parser-, Renderer-, Planungs- und Validierungstests sowie vom vollständigen Test-Reel verwendet.

## Isolierte Galerie und Frame-Matrix

```bash
npm run finance:animation-gallery
npm run finance:animation-gallery:still
npm run finance:animation-gallery:sequence-still
npm run finance:animation-gallery:matrix-still
```

Ausgaben:

```text
/tmp/finance-animation-gallery.png
/tmp/finance-animation-gallery-sequence.png
/tmp/finance-animation-frame-matrix.png
```

`FinanceAnimationFrameMatrix` zeigt für jedes Template Startframe `0`, Mittelframe `90` und Endframe `179`. Das ergibt 36 reproduzierbare Zustände. Jede Vorschau erhält eine eigene 180-Frame-Sequence in 1080 × 1920 Pixeln.

Der manuelle Freigabebericht liegt unter:

```text
gallery/VISUAL_QA_REPORT.md
```

## Vollständiges Test-Reel

Das isolierte Test-Reel enthält alle zwölf registrierten Templates genau einmal sowie drei kontrollierte Fallback-Fälle:

1. fehlende Pflichtdaten
2. unsichere verschachtelte Datenstruktur
3. ungültiger Szenenmodus

```bash
npm run finance:animation-test-reel:studio
npm run finance:animation-test-reel:still
npm run finance:animation-test-reel:render
```

Ausgaben:

```text
/tmp/finance-animation-fallback-preview.png
/tmp/finance-animation-test-reel.mp4
```

## Prüfung

```bash
npm run finance:animation-structure
npm run finance:animation-isolation
npm run finance:animation-typecheck
npm run finance:animation-test
npm run finance:animation-validate
```

`finance:animation-structure` führt vier dependency-freie Prüfungen aus:

1. Foundation-Struktur
2. exakte Datenverträge
3. Aktivierungsreihenfolge und manuelle Vorstufe
4. visuelle Frame-Matrix-Struktur

Die Gesamtprüfung ergänzt Isolation, Typecheck, Tests, drei Galerie-Stills und die sichere Fallback-Vorschau.

## Produktionsisolation

`scripts/verify-finance-animation-isolation.mjs` stellt sicher, dass die produktiven Dateien keine Referenz auf Renderer, Parser, Planner, Galerie, Frame-Matrix oder Test-Reel besitzen.

Geschützt werden insbesondere:

```text
channels/finanzneo/src/engine/FinanceProductionLayer.tsx
channels/finanzneo/src/engine/FinanceImageFirstReel.tsx
channels/finanzneo/src/FinanzNeoRoot.tsx
```

## GitHub Actions

Der Foundation-Workflow ist für Struktur- und Vertragschecks, Aktivierungspolicy, Isolation, Installation, Typecheck, Tests, Galerie-Stills, Frame-Matrix, Fallback-Vorschau, Artefakt-Upload und Produktionsschutz vorbereitet.

Ein separater minimaler Diagnose-Workflow besitzt nur einen Echo-Schritt. Dieser endet derzeit vor der Step-Ausführung: GitHub liefert für den Job weder Steps noch Logs. Der Blocker wird in Issue #3 dokumentiert. Ein erfolgreicher CI-Typecheck, Test- oder Renderlauf ist daher noch nicht bestätigt.

## Aktivierung

Die verbindlichen Gates stehen in `ACTIVATION_CHECKLIST.md`. Erst nach erfolgreichem Typecheck, Tests, visueller Prüfung und vollständigem Test-Reel darf eine separate Produktionsintegration beginnen.

Bis dahin verwendet jedes normale FinanzNeo-Reel ausschließlich den bestehenden `image-first-lite`-Workflow.
