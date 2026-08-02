# FinanzNeo Animation System (vorbereitet, deaktiviert)

Dieses Verzeichnis enthält die technische Grundlage für spätere Remotion-Finanzanimationen. Das System ist bewusst von der produktiven `image-first-lite`-Pipeline getrennt.

## Sicherheitszustand

Das System ist **nicht produktiv aktiv**:

- `enabled: false`
- `allowHybrid: false`
- `allowFullAnimation: false`
- `allowAutomaticRouting: false`
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
- zentral typisierte und standardmäßig deaktivierte Feature Flags
- gemeinsamer Begriffskatalog für Router und Template-Selector
- konservatives Routing mit vollständigen Begriffen statt unsicherer Teilworttreffer
- Template-Auswahl anhand von Inhalt, bevorzugtem Template und Datenabdeckung
- strukturierter Animationsplan mit sicherem Bild-Fallback
- generische Szenenprüfung und templatespezifische Datenvalidierung
- robuste Finanzberechnungen für Zinseszins, Sparplan, Inflation, Kredit und Portfolio-Aufteilung
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
- Tests für Berechnungen, Router, Begriffskatalog, Selector, Planung, Registry, Renderer, Galerie, Primitive, QA und Fallback
- isolierte TypeScript-Konfiguration für das Animationssystem

## Lokal prüfen

Nur TypeScript prüfen:

```bash
npm run finance:animation-typecheck
```

Nur die Animationstests ausführen:

```bash
npm run finance:animation-test
```

Typecheck, Tests und Galerie-Kontaktbogen gemeinsam ausführen:

```bash
npm run finance:animation-validate
```

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
- strukturierte Portfolio- und Timeline-Daten
- Budgetanteile und deren Summe
- Verhältnis von Ausgangs- und Restschuld
- bezahlte und gesamte Kreditraten
- Steuern und Gebühren im Verhältnis zum Bruttobetrag
- Kernaussage, Voiceover, leere oder doppelte Labels und Anzahl sichtbarer Labels

Bei einem Fehler erzeugt der Planner keine Animationsszene. Der bestehende Bildmodus bleibt der sichere Rückfall.

## Produktionsstatus

Nicht angebunden sind weiterhin:

- `FinanceProductionLayer`
- `FinanceImageFirstReel`
- produktive Scene-Plan-Verträge
- automatische Szenenauswahl für bestehende Reels

Die Grundlage ist technisch vorbereitet, aber erst nach einem bestätigten vollständigen Testlauf und einer visuellen Galerieprüfung aktivierbar.

## Spätere Aktivierung

1. Typecheck, Tests und Galerie-Render erfolgreich bestätigen.
2. Kontaktbogen und sequenzielle Galerie visuell prüfen.
3. Templates gestalterisch freigeben.
4. mindestens ein vollständiges Test-Reel rendern.
5. Animationsfelder kontrolliert in die produktiven Scene-Plan-Verträge aufnehmen.
6. `FinanceAnimationRenderer` hinter dem bestehenden Bild-Fallback anbinden.
7. Feature Flags einzeln aktivieren.
8. erst danach automatische Auswahl freigeben.

Bis dahin verwendet jedes normale FinanzNeo-Reel weiterhin ausschließlich den bestehenden Bild-Workflow.
