# FinanzNeo Animation System

> Vorbereitet, vollständig deaktiviert und vom produktiven `image-first-lite`-Workflow getrennt.

Dieses Verzeichnis enthält die technische Grundlage für spätere gezielte Remotion-Finanzanimationen. Es ersetzt den bestehenden Bild-Workflow nicht und ist aktuell weder im produktiven Root noch im produktiven Renderer registriert.

## Sicherheitszustand

Alle produktionsbezogenen Feature Flags bleiben deaktiviert:

```ts
{
  enabled: false,
  allowHybrid: false,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
}
```

Zusätzliche Schutzmaßnahmen:

- Feature-Flag-Objekt ist mit `Object.freeze` gesperrt
- keine Registrierung im produktiven `FinanzNeoRoot`
- keine Anbindung an `FinanceProductionLayer`
- keine Anbindung an `FinanceImageFirstReel`
- keine Änderung an produktiven Scene-Plan-Verträgen
- ungültige oder mehrdeutige Daten bleiben im Bildmodus
- Test-Reel und Galerie besitzen eigene isolierte Entry-Points

## Zielmodi

- `image`: bestehender Bild-Workflow
- `hybrid`: Bild plus gezielte erklärende Remotion-Elemente
- `full-animation`: vollständige Finanzszene als Remotion-Animation

Die Modi sind vorbereitet, aber nicht freigegeben.

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
- eine zentrale Pflichtfelddefinition
- kanonische Beispieldaten
- fachliche und visuelle Validierungsregeln
- Renderer-Abbildung
- Galerie-Abdeckung
- Testabdeckung

## Sichere Eingabegrenzen

Unbekannte KI-, API- oder JSON-Daten werden als `unknown` behandelt.

Verfügbare sichere Einstiegspunkte:

```ts
parseFinanceAnimationRequest(input)
parseFinanceAnimationScene(input)
planFinanceAnimationInput(input)
SafeFinanceAnimationRenderer
```

### Strukturelle Prüfung

Der Parser prüft unter anderem:

- Request und Daten müssen einfache Objekte sein
- Kernaussage und Voiceover müssen Texte sein
- Labels müssen eine Textliste sein
- Text-, Label-, Feld- und Listenlängen sind begrenzt
- verschachtelte Objekte werden abgelehnt
- verschachtelte Arrays werden abgelehnt
- Funktionen und andere ausführbare Werte werden abgelehnt
- Modus und Template-ID müssen bekannt sein
- nicht endliche Zahlen werden abgelehnt

### Schutz gegen aktive oder manipulierte Objekte

Zusätzlich werden unbekannte JavaScript-Werte defensiv behandelt:

- Getter und Setter werden erkannt und nicht ausgeführt
- Symbol-Schlüssel werden abgelehnt
- `__proto__`, `prototype` und `constructor` werden blockiert
- akzeptierte Daten werden in neue Null-Prototyp-Container kopiert
- strukturierte Array-Einträge werden ebenfalls kopiert
- nachträgliche Änderungen am ursprünglichen Eingabeobjekt verändern das geparste Ergebnis nicht
- hostile Proxies dürfen keine Ausnahme aus dem öffentlichen Parser entkommen lassen

Bei nicht sicher lesbaren Werten liefert der Parser ein kontrolliertes Fehlerergebnis statt eines ungefangenen Fehlers.

## Sicherer Renderer-Fallback

`SafeFinanceAnimationRenderer` führt vor jedem Render `parseFinanceAnimationScene` aus.

Ungültige Eingaben erreichen `FinanceAnimationRenderer` nicht. Der Aufrufer kann wählen zwischen:

- statischem `fallback`
- dynamischem `renderFallback(context)`

Der dynamische Kontext enthält ausschließlich:

```ts
{
  input,
  errors,
  warnings,
}
```

Damit können verständliche Bild-Fallbacks angezeigt werden, ohne interne Stacktraces oder unvalidierte Daten auszuführen.

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

Prozentfelder verwenden immer Prozentpunkte:

- `7` bedeutet 7 Prozent
- `0.5` bedeutet 0,5 Prozent

Erst Finanzberechnungen wandeln diese Werte in Dezimalraten um.

## Routing und Mehrdeutigkeit

Router und Template-Selector verwenden dieselbe Kandidatenbewertung.

Bewertet werden:

- vollständige Finanzbegriffe mit Wortgrenzen
- Abdeckung der benötigten Datenfelder
- explizit bevorzugtes Template

Ein echter Gleichstand wird nicht über die Reihenfolge der Registry entschieden. Das System fällt stattdessen kontrolliert auf `image` zurück und dokumentiert die Mehrdeutigkeit.

## Validierungsregeln

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

Fehler blockieren den Render. Warnungen bleiben sichtbar, verhindern aber nur dann den Render, wenn die fachliche Darstellung unsicher wäre.

## Visuelle Konsistenz

Die Template-Logik hält Daten und sichtbare Animation synchron:

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

`fixtures/financeAnimationFixtures.ts` enthält genau eine gültige Szene pro registriertem Template.

Die Fixtures werden gemeinsam verwendet von:

- Galerie
- Kontaktbogen
- Parser-Tests
- Renderer-Tests
- Validierungstests
- vollständigem Test-Reel

Dadurch können Beispielansicht und Tests nicht unbemerkt auseinanderlaufen.

## Isolierte Galerie

Studio öffnen:

```bash
npm run finance:animation-gallery
```

Kontaktbogen rendern:

```bash
npm run finance:animation-gallery:still
```

Sequenzielle Galerie rendern:

```bash
npm run finance:animation-gallery:sequence-still
```

Ausgaben:

```text
/tmp/finance-animation-gallery.png
/tmp/finance-animation-gallery-sequence.png
```

## Vollständiges Test-Reel

Das isolierte Test-Reel enthält:

- alle zwölf registrierten Templates genau einmal
- Fallback wegen fehlender Pflichtdaten
- Fallback wegen unsicherer Datenstruktur
- Fallback wegen ungültigem Modus

Studio öffnen:

```bash
npm run finance:animation-test-reel:studio
```

Stabile Fallback-Vorschau rendern:

```bash
npm run finance:animation-test-reel:still
```

Vollständiges Testvideo rendern:

```bash
npm run finance:animation-test-reel:render
```

Ausgaben:

```text
/tmp/finance-animation-fallback-preview.png
/tmp/finance-animation-test-reel.mp4
```

## Lokale Prüfung

Dependency-freier Strukturcheck:

```bash
npm run finance:animation-structure
```

Produktionsisolation:

```bash
npm run finance:animation-isolation
```

TypeScript:

```bash
npm run finance:animation-typecheck
```

Tests:

```bash
npm run finance:animation-test
```

Gesamtprüfung:

```bash
npm run finance:animation-validate
```

Die Gesamtprüfung umfasst Struktur, Isolation, Typecheck, Tests, beide Galerie-Stills und die sichere Fallback-Vorschau.

## Automatische Strukturprüfung

`scripts/verify-finance-animation-foundation.mjs` prüft ohne installierte Abhängigkeiten:

- alle Pflichtdateien
- alle zwölf Template-IDs
- gemeinsame Routing-Bewertung
- sicheren Mehrdeutigkeits-Fallback
- sichere Parser-, Planner- und Renderer-Grenzen
- Parser-Härtung gegen aktive Objekte
- vollständige Test-Reel-Abdeckung
- Test-Reel-Fallback-Kategorien
- Composition-IDs
- lokale npm-Skripte
- Workflow-Schritte und Artefaktpfade
- isolierten TypeScript-Umfang

## Produktionsisolation

`scripts/verify-finance-animation-isolation.mjs` stellt sicher, dass die produktiven Dateien keine Referenz auf Renderer, Parser, Planner, Galerie oder Test-Reel besitzen.

Geschützt werden insbesondere:

```text
channels/finanzneo/src/engine/FinanceProductionLayer.tsx
channels/finanzneo/src/engine/FinanceImageFirstReel.tsx
channels/finanzneo/src/FinanzNeoRoot.tsx
```

## GitHub Actions

Der Foundation-Workflow ist vorbereitet für:

1. Strukturcheck
2. Isolationscheck
3. Installation
4. Typecheck
5. Tests
6. Galerie-Kontaktbogen
7. sequenziellen Galerie-Still
8. sichere Fallback-Vorschau
9. Artefakt-Upload
10. Schutz der produktiven Dateien im PR-Diff

Ein separater minimaler Diagnose-Workflow prüft ausschließlich, ob ein GitHub-hosted Runner überhaupt startet.

Aktuell beenden die Runner die Jobs weiterhin vor der normalen Step-Ausführung. Solange keine echten Steps und Logs vorliegen, gilt kein CI-Lauf als bestätigt.

## Aktivierung

Die verbindlichen Gates stehen in:

```text
ACTIVATION_CHECKLIST.md
```

Erst nach erfolgreichem Typecheck, Tests, visueller Prüfung und vollständigem Test-Reel darf eine separate Produktionsintegration beginnen.

Bis dahin verwendet jedes normale FinanzNeo-Reel ausschließlich den bestehenden `image-first-lite`-Workflow.
