# FinanzNeo — Scene-Index-Schema V5

Technische Quelle ist `scripts/lib/reel-scene-schema.mjs`. Dieses Dokument erklärt die Felder nur; bei Widersprüchen gilt der Code.

## Globale Reel-Felder

Ein aktiver Reel enthält mindestens:

```json
{
  "title": "Reel-Titel",
  "phase3Executor": "antigravity",
  "scenes": []
}
```

Erlaubte `phase3Executor`-Werte:

- `antigravity`
- `claude-code`

Neue Reels erhalten zusätzlich die Verträge für Google Flow, Phase-1-Animationscode, Reel-V5-Layout und Phase-3-Completion.

## Pflichtfelder jeder Szene

```json
{
  "id": "scene-01",
  "type": "image",
  "headline": "Lokale Währung ist oft günstiger",
  "icon": "repeat",
  "planFile": "EINZELNE-SZENEN/scene-01/szene.md"
}
```

Pflicht:

- `id`
- `type`: `image` oder `animation`
- `headline`: natürliche Aussage oder Frage, keine reine Zahl/Stichwort
- `icon`: existierendes FinanzNeo-Icon
- `planFile`

`directory` ist optional und kann aus `planFile` abgeleitet werden.

`accent` ist optional. Wenn gesetzt, muss es einer erlaubten semantischen Rolle entsprechen. Primärquelle für die Bedeutung bleibt `headerTone`.

## Bildszene

Zusätzlich verpflichtend:

```json
{
  "googleFlowFileName": "Bild 01 - Beispiel.png",
  "expectedVisual": "Konkrete sichtbare Bildidee",
  "imagePresentation": "contain"
}
```

`objectLabels` dürfen als hilfreiche Metadaten vorkommen, sind aber keine zweite Wahrheit neben dem eigentlichen Bildprompt.

## Animationsszene — V5

Phase 1 ist für die kreative und technische Animation vollständig verantwortlich.

Zusätzlich verpflichtend:

```json
{
  "animationSourceFile": "EINZELNE-SZENEN/scene-02/animation.tsx",
  "animationExport": "Scene02Animation",
  "animationIntent": "Startzustand verändert sich sichtbar über den Mechanismus zum klaren Ergebnis.",
  "animationQualityLock": "finanzneo-phase1-animation-code-v1"
}
```

Dazu existieren im Szenenordner:

```text
szene.md
remotion.md
animation.tsx
```

`animation.tsx` ist die kanonische Produktionsquelle. Phase 3 darf sie nicht kreativ ersetzen oder nach `reel:ready` verändern.

## Phase-1-Animations-Seal

Bei erfolgreichem:

```bash
npm run reel:ready -- <Reel-Pfad>
```

werden alle kanonischen Animationsquellen per SHA-256 versiegelt in:

```text
05-projektdateien/phase1-animation-seal.json
```

Der Phase-3-Preflight verlangt danach:

- `componentPath` = exakt kanonische `animationSourceFile`
- `componentExport` = exakt `animationExport`
- unveränderter SHA-256-Hash

Eine Ersatzkomponente oder nachträglicher QA-Hack blockiert Phase 3.

## V5-Layoutvertrag

Neue aktive Reels erben zentral:

```text
Header:    Y = 154
Visual:    Y = 320–1480
Caption:   bottom = 340
Transition: 3 Frames
```

Die technische Wahrheit dafür ist `REEL_STYLE` in `src/brand/tokens.ts`; alte per-Reel-Layoutmetadaten dürfen diese Werte nicht überschreiben.

## Validierung

```bash
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```

Dabei prüfen unter anderem:

- `validateSceneShape()` das zentrale Szenenschema
- `validate-reel-layout-v5.mjs` den V5-Layoutvertrag
- `validate-animation-source-quality.mjs` den Phase-1-Animationscode
- `validate-phase3-contract.mjs` das Completion-Gate

Keine Validatorregel darf abgeschwächt werden, nur um einen fehlerhaften Reel grün zu bekommen.
