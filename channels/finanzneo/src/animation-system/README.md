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

## Enthaltene Grundlage

- Typen für Szenenmodi und Templates
- konservativer, deaktivierter Scene Classifier
- Finanzberechnungen für Zinseszins, Sparplan, Inflation, Kredit und Portfolio-Aufteilung
- Registry für zwölf geplante Finanzanimationstemplates
- zentrale Feature Flags
- wiederverwendbare visuelle Primitive:
  - animierte Zahlen
  - Fortschrittsbalken
  - Finanz-Flussknoten
- erste nicht angebundene Remotion-Templates:
  - `compound-growth`
  - `money-flow`
- einfache QA für Kernaussage, Voiceover, Daten, Labels und Template-Zuordnung

## Wichtig

Die neuen Templates sind nur Bausteine im Branch. Sie werden nirgends automatisch gerendert und sind nicht mit `FinanceProductionLayer` verbunden.

## Spätere Aktivierung

Vor einer Aktivierung müssen mindestens folgende Punkte abgeschlossen sein:

1. weitere visuelle Primitive im FinanzNeo-Stil,
2. mindestens sechs produktionsreife Templates,
3. eigene Galerie-Composition,
4. visuelle und fachliche QA,
5. Tests für Berechnungen, Router und Templates,
6. bewusste Integration in `FinanceProductionLayer`,
7. Feature Flags erst danach einzeln freischalten.

Bis dahin darf kein bestehendes Reel automatisch eine Animation verwenden.
