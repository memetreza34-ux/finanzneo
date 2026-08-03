# FinanzNeo Animation System

> Vorbereitet, vollständig deaktiviert und vom produktiven `image-first-lite`-Workflow getrennt.

Dieses Verzeichnis enthält die technische Grundlage für spätere gezielte Remotion-Finanzanimationen. Es ersetzt den bestehenden Bild-Workflow nicht und ist aktuell weder im produktiven Root noch im produktiven Renderer registriert.

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
- ungültige oder mehrdeutige Daten bleiben im Bildmodus

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

Jedes Template besitzt einen exakten Datenvertrag, eine zentrale Pflichtfelddefinition, kanonische Beispieldaten, fachliche und visuelle Validierung, Renderer-Abbildung, Galerie-Abdeckung und Tests.

## Sichere Eingabegrenzen

Unbekannte KI-, API- oder JSON-Daten werden als `unknown` behandelt.

Sichere Einstiegspunkte:

```ts
parseFinanceAnimationRequest(input)
parseFinanceAnimationScene(input)
planFinanceAnimationInput(input)
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

Das rohe untrusted Eingabeobjekt wird absichtlich nicht an den Fallback weitergereicht. Dadurch kann eine Fallback-Komponente weder Getter lesen noch andere unbekannte Werte versehentlich ausführen.

## Strenge Datenverträge

`templateDataContracts.ts` verknüpft jede Template-ID mit der exakt passenden Datenstruktur.

Beispiele:

- `money-flow`: Betrag, Quelle und Ziel
- `compound-growth`: Startkapital, Monatsrate, Rendite und Jahre
- `portfolio-allocation`: Positionen und dargestellter Gesamtwert
- `debt-paydown`: ursprüngliche Schuld, Restschuld und vollständiger Ratenfortschritt
- `timeline-milestones`: strukturierte Meilensteine
- `tax-fee-flow`: Brutto, Steuern und Gebühren

Der Renderer erfindet keine sichtbaren Portfoliowerte oder Kreditraten.

Prozentfelder verwenden immer Prozentpunkte: `7` bedeutet 7 Prozent und `0.5` bedeutet 0,5 Prozent. Erst Finanzberechnungen wandeln diese Werte in Dezimalraten um.

## Routing und Mehrdeutigkeit

Router und Template-Selector verwenden dieselbe Kandidatenbewertung. Bewertet werden vollständige Finanzbegriffe mit Wortgrenzen, Abdeckung der benötigten Datenfelder und ein explizit bevorzugtes Template.

Ein echter Gleichstand wird nicht über die Registry-Reihenfolge entschieden. Das System fällt kontrolliert auf `image` zurück und dokumentiert die Mehrdeutigkeit.

Für Tests der späteren Aktivierung steht zusätzlich bereit:

```ts
planFinanceAnimationSceneWithFeatures(request, features)
```

Damit werden Hybrid- und Vollanimationspfad über den vollständigen Router-, Planner- und Validator-Ablauf simuliert, ohne die global deaktivierten Produktionsflags zu verändern. Die kanonischen Fixtures durchlaufen beide simulierten Aktivierungspfade in eigenen Tests.

## Validierung

Vor einem Render werden unter anderem geprüft:

- Pflichtfelder
- endliche und fachlich erlaubte Zahlen
- Prozentwerte und Laufzeiten
- Budgetsumme von ungefähr 100 Prozent
- explizite Portfolio-Prozentsumme von ungefähr 100 Prozent
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

`fixtures/financeAnimationFixtures.ts` enthält genau eine gültige Szene pro registriertem Template. Dieselben Fixtures werden von Galerie, Parser-, Renderer- und Validierungstests sowie vom vollständigen Test-Reel verwendet.

## Isolierte Galerie

```bash
npm run finance:animation-gallery
npm run finance:animation-gallery:still
npm run finance:animation-gallery:sequence-still
```

Ausgaben:

```text
/tmp/finance-animation-gallery.png
/tmp/finance-animation-gallery-sequence.png
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

Die eigene Composition `FinanceAnimationFallbackPreview` liefert einen stabilen Fallback-Still unabhängig von der Länge des vollständigen Reels.

## Prüfung

```bash
npm run finance:animation-structure
npm run finance:animation-isolation
npm run finance:animation-typecheck
npm run finance:animation-test
npm run finance:animation-validate
```

Die Gesamtprüfung umfasst Struktur, Isolation, Typecheck, Tests, beide Galerie-Stills und die sichere Fallback-Vorschau.

## Automatische Struktur- und Isolationsprüfung

`scripts/verify-finance-animation-foundation.mjs` prüft ohne installierte Abhängigkeiten unter anderem Pflichtdateien, zwölf Template-IDs, gemeinsames Routing, Parser-Härtung, sichere Fallbacks, Test-Reel-Abdeckung, Composition-IDs, npm-Skripte, Workflow-Schritte und TypeScript-Umfang.

`scripts/verify-finance-animation-isolation.mjs` stellt sicher, dass die produktiven Dateien keine Referenz auf Renderer, Parser, Planner, Galerie oder Test-Reel besitzen.

Geschützt werden insbesondere:

```text
channels/finanzneo/src/engine/FinanceProductionLayer.tsx
channels/finanzneo/src/engine/FinanceImageFirstReel.tsx
channels/finanzneo/src/FinanzNeoRoot.tsx
```

## GitHub Actions

Der Foundation-Workflow ist für Strukturcheck, Isolation, Installation, Typecheck, Tests, Galerie-Stills, Fallback-Vorschau, Artefakt-Upload und Produktionsschutz vorbereitet.

Ein separater minimaler Diagnose-Workflow besitzt nur einen Echo-Schritt. Auch dieser Lauf endet derzeit vor der Step-Ausführung: GitHub liefert für den Job weder Steps noch Logs. Damit liegt der aktuelle Blocker außerhalb der eigentlichen Animationsbefehle; ein erfolgreicher CI-Test- oder Renderlauf ist dennoch noch nicht bestätigt.

## Aktivierung

Die verbindlichen Gates stehen in `ACTIVATION_CHECKLIST.md`. Erst nach erfolgreichem Typecheck, Tests, visueller Prüfung und vollständigem Test-Reel darf eine separate Produktionsintegration beginnen.

Bis dahin verwendet jedes normale FinanzNeo-Reel ausschließlich den bestehenden `image-first-lite`-Workflow.
