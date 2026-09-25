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
src/reels-test/
src/zins/
```
Historische/experimentelle Szenen. Sie dürfen als Lernmaterial existieren, sind aber keine Produktionsvorlage.

Root-Dateien wie `MockTest.tsx`, `Showcase*.tsx`, `Thumbnail*.tsx`, `RealDataDemo.tsx` und `LottieTest.tsx` sind derzeit noch historisch gewachsene Demo-/Showcase-Dateien. Sie bleiben vorerst bestehen, damit Imports und Regressionstests nicht riskant umgebaut werden. Neue Arbeit soll dort nicht weiter anwachsen.

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

Die größte noch offene Strukturarbeit ist eine risikoarme Migration der historischen Root-Demos nach `src/experiments/` und `src/showcases/`. Diese Migration soll separat erfolgen, mit Import-Updates und grüner CI in kleinen Schritten. Keine Massenverschiebung innerhalb eines Produktionsumbaus.
