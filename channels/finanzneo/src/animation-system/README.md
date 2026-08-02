# FinanzNeo Animation System (vorbereitet, deaktiviert)

Dieses Verzeichnis enthält die Grundlage für spätere vollständige Remotion-Finanzanimationen.

## Sicherheitszustand

Das System ist absichtlich **nicht produktiv aktiv**.

- `enabled: false`
- keine automatische Szenenklassifikation
- keine Änderung am bestehenden `image-first-lite`-Renderer
- keine Änderung an bestehenden Scene-Plan-Verträgen
- keine produktive Composition registriert

Der aktuelle Bild-Workflow bleibt vollständig unverändert.

## Zielmodi

- `image`: bestehender Bild-Workflow
- `hybrid`: Bild plus gezielte Remotion-Erklärung
- `full-animation`: komplette Szene als Remotion-Animation

## Enthalten

- Typen für Szenenmodi, Entscheidungen, Requests und Template-Daten
- zentrale Feature Flags, standardmäßig vollständig deaktiviert
- konservativer Scene Classifier
- Template-Selector und strukturierter Animationsplan
- sicherer Bild-Fallback mit dokumentierten Gründen
- Datenvalidierung und fachliche QA
- Finanzberechnungen für Zinseszins, Sparplan, Inflation, Kredit und Portfolio-Aufteilung
- wiederverwendbare visuelle Primitive:
  - animierte Zahlen
  - Fortschrittsbalken
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
- isolierte Galerie-Composition
- Tests für Berechnungen, Router, Selector, Planung, Registry, Renderer, QA und Fallback

## Galerie lokal prüfen

Die Galerie ist vom normalen FinanzNeo-Root getrennt:

```bash
npm run finance:animation-gallery
```

Ein einzelnes Vorschaubild kann separat erzeugt werden:

```bash
npm run finance:animation-gallery:still
```

Diese Befehle starten ausschließlich den isolierten Galerie-Entry-Point. Sie aktivieren keine Animationen im produktiven Reel-Workflow.

## Produktionsstatus

Die vorbereitete Grundlage ist vollständig vorhanden. Sie wird dennoch absichtlich nicht benutzt.

Nicht angebunden sind weiterhin:

- `FinanceProductionLayer`
- `FinanceImageFirstReel`
- produktive Scene-Plan-Verträge
- automatische Szenenauswahl für bestehende Reels

## Spätere Aktivierung

Eine spätere Aktivierung erfolgt bewusst in einem separaten Schritt:

1. Galerie visuell prüfen und Templates bei Bedarf gestalterisch verfeinern.
2. Feature Flags einzeln aktivieren.
3. Animationsfelder kontrolliert in die produktiven Scene-Plan-Verträge aufnehmen.
4. `FinanceAnimationRenderer` hinter einem sicheren Fallback an `FinanceProductionLayer` anbinden.
5. mindestens ein vollständiges Test-Reel rendern und prüfen.
6. erst danach automatische Auswahl freigeben.

Bis zu diesem Aktivierungsschritt verwendet jedes normale FinanzNeo-Reel weiterhin den bestehenden Bild-Workflow.
