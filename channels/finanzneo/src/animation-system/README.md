# FinanzNeo Animation System (vorbereitet, deaktiviert)

Dieses Verzeichnis enthält die technische Grundlage für spätere Remotion-Finanzanimationen. Das System ist bewusst von der produktiven `image-first-lite`-Pipeline getrennt.

## Sicherheitszustand

Das System ist **nicht produktiv aktiv**:

- `enabled: false`
- `allowHybrid: false`
- `allowFullAnimation: false`
- `allowAutomaticRouting: false`
- Feature Flags sind zusätzlich mit `Object.freeze` zur Laufzeit gesperrt
- keine Registrierung im produktiven `FinanzNeoRoot`
- keine Änderung an bestehenden Scene-Plan-Verträgen
- keine Anbindung an `FinanceProductionLayer`
- ungültige Animationsdaten werden nicht gerendert

Der bestehende Bild-Workflow bleibt unverändert.

## Zielmodi

- `image`: bestehender Bild-Workflow
- `hybrid`: Bild plus gezielte Remotion-Erklärung
- `full-animation`: komplette Szene als Remotion-Animation

## Enthalten

- Typen für Szenenmodi, Entscheidungen, Requests und Template-Daten
- strenge Datenverträge für jedes der zwölf Templates
- zentral typisierte, eingefrorene und standardmäßig deaktivierte Feature Flags
- gemeinsamer Begriffskatalog für Router und Template-Selector
- konservatives Routing mit vollständigen Begriffen statt unsicherer Teilworttreffer
- Template-Auswahl anhand von Inhalt, bevorzugtem Template und Datenabdeckung
- strukturierter Animationsplan mit sicherem Bild-Fallback
- generische Szenenprüfung, Datenvalidierung und Präsentationsgrenzen
- robuste Finanzberechnungen für Zinseszins, Sparplan, Inflation, Kredit und Portfolio-Aufteilung
- kanonische, vollständig validierbare Beispielszenen für alle zwölf Templates
- wiederverwendbare visuelle Primitive:
  - animierte oder bereits framegenau berechnete Zahlen
  - animierte oder bereits framegenau berechnete Fortschrittsbalken
  - Finanz-Flussknoten
- zwölf getrennte Remotion-Finanztemplates:
  - `money-flow`
  - `budget-split`
  - `compound-growth`
  - `portfolio-allocation`
  - `inflation-erosion`
  - `debt-paydown`
  - `monthly-investment`
  - `before-after-comparison`
  - `risk-return-scale`
  - `timeline-milestones`
  - `income-expense-balance`
  - `tax-fee-flow`
- zentraler `FinanceAnimationRenderer`
- sequenzielle Galerie und Kontaktbogen mit allen zwölf Templates
- Galerie läuft durch denselben Renderer und dieselben Beispielszenen wie die Tests
- Tests für Berechnungen, Router, Begriffskatalog, Selector, Planung, Registry, Renderer, Datenverträge, Fixtures, Galerie, Primitive, QA und Fallback
- isolierte TypeScript-Konfiguration für das Animationssystem
- ausführbarer Produktions-Isolationscheck

## Lokal prüfen

Produktionsisolation und deaktivierte Feature Flags prüfen:

```bash
npm run finance:animation-isolation
```

Nur TypeScript prüfen:

```bash
npm run finance:animation-typecheck
```

Nur die Animationstests ausführen:

```bash
npm run finance:animation-test
```

Isolation, Typecheck, Tests und Galerie-Kontaktbogen gemeinsam ausführen:

```bash
npm run finance:animation-validate
```

## Strenge Template-Datenverträge

`templateDataContracts.ts` definiert für jede Template-ID den passenden Datenvertrag. Intern erzeugte Szenen können damit nicht mehr versehentlich Felder eines anderen Templates erhalten.

Beispiele:

- `money-flow` verlangt Betrag, Quelle und Ziel
- `compound-growth` verlangt Startkapital, Sparrate, Rendite und Jahre
- `portfolio-allocation` verlangt strukturierte Positionen
- `timeline-milestones` verlangt strukturierte Meilensteine
- `tax-fee-flow` verlangt Brutto, Steuern und Gebühren

Eingehende KI-Daten bleiben zunächst flexibel und werden weiterhin zur Laufzeit geprüft. Interne Fixtures und spätere kontrollierte Aufrufer nutzen dagegen die strengeren Typen.

## Kanonische Beispielszenen

Die Datei `fixtures/financeAnimationFixtures.ts` enthält genau eine gültige Beispielszene pro registriertem Template.

Diese Szenen werden gemeinsam verwendet von:

- Galerie
- Kontaktbogen
- Datenvalidierungstests
- Registry-Abgleich
- zentralem Renderer
- späteren Smoke- und Integrationstests

Dadurch können Galerie und Tests nicht mehr unbemerkt mit voneinander abweichenden Daten arbeiten.

## Galerie prüfen

Die Galerie ist vom normalen FinanzNeo-Root getrennt:

```bash
npm run finance:animation-gallery
```

Der Standard-Still zeigt alle zwölf Templates gleichzeitig als Kontaktbogen bei einem mittleren Animationsframe:

```bash
npm run finance:animation-gallery:still
```

Ein Still aus der sequenziellen 9:16-Galerie kann separat erzeugt werden:

```bash
npm run finance:animation-gallery:sequence-still
```

Diese Befehle verwenden ausschließlich den isolierten Galerie-Entry-Point und aktivieren keine Animation im produktiven Reel-Workflow.

## Validierungsregeln

Vor einem Render werden unter anderem geprüft:

- vorhandene Pflichtfelder des ausgewählten Templates
- endliche, nichtnegative oder fachlich zulässige Zahlenwerte
- gültige Prozentwerte und Laufzeiten
- negative Renditen nur bei Templates, die sie sinnvoll darstellen können
- strukturierte Portfolio- und Timeline-Daten
- maximale Anzahl sichtbarer Portfolio-Positionen und Meilensteine
- doppelte Portfolio- und Timeline-Labels
- Budgetanteile und deren Summe
- Portfolio-Prozentwerte und deren Summe
- Verhältnis von Ausgangs- und Restschuld
- bezahlte und gesamte Kreditraten
- Steuern und Gebühren im Verhältnis zum Bruttobetrag
- Vorher-Nachher-Vergleiche ohne sichtbaren Unterschied
- Kernaussage, Voiceover, leere oder doppelte Labels und Anzahl sichtbarer Labels

Bei einem Fehler erzeugt der Planner keine Animationsszene. Der bestehende Bildmodus bleibt der sichere Rückfall.

## Produktionsisolation

`scripts/verify-finance-animation-isolation.mjs` prüft unabhängig von TypeScript und Remotion:

- alle vier Feature Flags bleiben deaktiviert
- das Flag-Objekt bleibt zur Laufzeit eingefroren
- `FinanceProductionLayer.tsx` importiert das Animationssystem nicht
- `FinanceImageFirstReel.tsx` importiert das Animationssystem nicht
- `FinanzNeoRoot.tsx` registriert weder Renderer noch Galerie

Der GitHub-Actions-Workflow führt diesen Check vor Typecheck, Tests und Rendering aus.

## Produktionsstatus

Nicht angebunden sind weiterhin:

- `FinanceProductionLayer`
- `FinanceImageFirstReel`
- produktive Scene-Plan-Verträge
- automatische Szenenauswahl für bestehende Reels

Die Grundlage ist technisch vorbereitet, aber erst nach einem bestätigten vollständigen Testlauf und einer visuellen Galerieprüfung aktivierbar.

## Spätere Aktivierung

1. Isolationscheck, Typecheck, Tests und Galerie-Render erfolgreich bestätigen.
2. Kontaktbogen und sequenzielle Galerie visuell prüfen.
3. Templates gestalterisch freigeben.
4. mindestens ein vollständiges Test-Reel rendern.
5. Animationsfelder kontrolliert in die produktiven Scene-Plan-Verträge aufnehmen.
6. `FinanceAnimationRenderer` hinter dem bestehenden Bild-Fallback anbinden.
7. Feature Flags einzeln aktivieren.
8. erst danach automatische Auswahl freigeben.

Bis dahin verwendet jedes normale FinanzNeo-Reel weiterhin ausschließlich den bestehenden Bild-Workflow.
