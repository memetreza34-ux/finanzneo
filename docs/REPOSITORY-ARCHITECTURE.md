# FinanzNeo — Repository Architecture

Dieses Dokument erklärt nur die Ordnerrollen. Produktionsregeln kommen aus den aktiven Standards, nicht aus dieser Übersicht.

## Autorität

```text
CLAUDE.md
→ aktiver Maschinenstandard in config/
→ Format-PRODUKTIONSSTANDARD
→ aktueller Workflow
→ übrige Dokumentation
```

Alte `V2`/`V3`/`FUTURE-*`-Dokumente sind nicht automatisch aktiv. Sie gelten nur, wenn eine aktuelle autoritative Quelle ausdrücklich auf sie verweist.

## Root

```text
config/       Maschinenlesbare Standards, Locks und Quellenregister
docs/         Workflows, Standards und technische Erklärungen
public/       lokale Render-Assets und eingefrorene Daten-Snapshots
reels/        konkrete 9:16-Reel-Projekte
youtube/      konkrete 16:9-YouTube-Longform-Projekte
scripts/      Scaffold, Fetcher, Validatoren, Gates und Render-Helfer
src/          Remotion-Code, Design-System, Experimente und Showcases
tests/        Vertrags- und Regressionstests
.agents/      Agent-Regeln, Skills und Motion-Plugin
```

## `src/` — Rollen

```text
src/root/
```
Zentrale Composition-Registries. Nur hier wird entschieden, ob etwas Production, Experiment oder Showcase ist.

```text
src/design-system/
src/brand/
src/bausteine/
```
Wiederverwendbare Produktionskomponenten, Tokens und Visual-Bausteine.

```text
src/production/
```
Technische Produktionsvorlagen. Keine beliebigen Experimente hier ablegen.

```text
src/experiments/
```
Expliziter Ablageort für isolierte Tests und Demos. Die erste risikoarme Migration ist abgeschlossen: `MockTest.tsx`, `MockMindmap.tsx`, `RealDataDemo.tsx` und `LottieTest.tsx` liegen hier und werden von `ExperimentCompositions.tsx` registriert.

```text
src/reels-test/
src/zins/
```
Historische/experimentelle Szenen. Sie dürfen als Lernmaterial existieren, sind aber keine Produktionsvorlage.

Einige weitere historisch gewachsene Root-Dateien wie `PassivTest.tsx`, `PremiumTest.tsx`, `Signature.tsx`, `Variants.tsx`, `Showcase*.tsx` und `Thumbnail*.tsx` sind noch nicht migriert. Neue Arbeit soll im Root nicht weiter anwachsen.

## Composition-Registries

- `ProductionCompositions.tsx`: nur vollständig freigegebene Produktionen.
- `ExperimentCompositions.tsx`: Tests, Prototypen, Legacy-/Lernmaterial.
- `ShowcaseCompositions.tsx`: Komponenten- und Design-System-Demos.

Eine technisch funktionierende Composition ist noch keine Production-Composition.

## Reels vs. YouTube

### Reels

9:16, eigener V9-Bildwelt-/Layout-/Caption-/Motion-Vertrag.

### YouTube

16:9, eigener Longform-Vertrag. Zwei Modi:

- `images-only`: statisches fertiges Layout mit Überschrift + Icon + eingebettetem Flow-Bild.
- `hybrid`: gleiches Layout + Animation/Remotion/Daten/echte Assets.

Regeln nie zwischen den Formaten übertragen, wenn der jeweilige Standard das nicht ausdrücklich erlaubt.

## Daten

Remote-Daten sind Build-Inputs, keine Render-Abhängigkeiten:

```text
API/Quelle
→ scripts/fetch-data.mjs
→ public/data/*.json
→ data:validate
→ Remotion importiert lokalen Snapshot
```

Details: `docs/DATA-PIPELINE.md`.

## Künftige Strukturverbesserung

Die verbleibenden historischen Root-Demos werden weiterhin in kleinen, überprüfbaren Tranchen nach `src/experiments/` beziehungsweise `src/showcases/` verschoben. Jede Tranche aktualisiert zuerst die Zielkopien und Registry-Imports, entfernt erst danach die alten Root-Kopien und muss anschließend die vollständige CI bestehen. Keine Massenverschiebung innerhalb eines Produktionsumbaus.
