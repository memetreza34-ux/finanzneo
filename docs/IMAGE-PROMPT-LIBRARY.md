# FinanzNeo — Bildprompt-Bibliothek V9

Bei Widerspruch gilt `CLAUDE.md`. Verbindliche Detailquelle: `docs/IMAGE-SYSTEM.md`.

## Grundaufbau

Jeder Prompt enthält in dieser Reihenfolge:

1. finalen Dateinamen
2. konkrete Bildidee/Hauptaktion
3. ausdrücklich erlaubte kurze deutsche Labels
4. V9-Style-Lock
5. deep-black Background-Lock
6. kurze Forbidden-Liste

Prompts bleiben mittel-lang. Die Bildidee darf nicht unter Regeln verschwinden.

## Kanonischer V9-Block

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1

STYLE:
Create a clearly non-realistic stylized 3D animated finance scene with soft rounded geometry, simplified recognizable details, clean materials and a premium but slightly playful animated-movie feel. Make the main idea understandable within 1–2 seconds.

COMPOSITION:
Use one clear main subject or main action. Supporting objects have no fixed count; add only what genuinely improves the explanation. Avoid clutter.

BACKGROUND:
Use one seamless deep black background. Keep it clean, minimal and uninterrupted. No bright studio background, floor-wall boundary, horizon, colored background zones, aurora, grid or particles.

COLORS + LIGHT:
Emerald green = positive/focus. Warm ivory and soft gray = neutral. Subtle gold = money/value. Warm red-orange = warning/cost/loss. Use clean soft studio lighting, clear highlights, readable shadows and soft contact shadows.

BRANDS + LOGOS:
If relevant, keep the brand recognizable but reinterpret it in the same stylized 3D animated world. Never paste a flat real-world logo, website screenshot, app screenshot or photorealistic branded UI.

TEXT:
Only the explicitly requested short German labels may appear. No headline, subtitle, CTA or explanatory sentence.

FORBIDDEN:
No realism or photorealism, no product-photo look, no dashboard, no app UI, no flowchart, no tiny boxes, no floating info cards, no microchip/circuit look, no miniature diorama and no clutter.
```

## Szenenblock

```text
FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

AKTUELLER EINZELSCHRITT:
Generate exactly this one image. Wait until it is complete. Rename it immediately to the exact filename above. Run V9 QA. If QA fails, regenerate the same image number. Only after PASS unlock the next image.

EXACT SHORT GERMAN OBJECT LABELS:
- [Label 1]
- [optional Label 2]

IMAGE PROMPT:
[Describe the one clear scene-specific financial idea or cause/effect action here.]

[Append the canonical V9 block above.]
```

## Cover

`Bild 00` bleibt ebenfalls `1:1` und folgt V9. Keine generierte klassische Headline nötig; das Thema soll über ein starkes, sofort lesbares Motiv verständlich werden.

## Muster: Problem

```text
Show the problem as one clear stylized 3D action or object state. Use red-orange only where actual cost/risk/loss is shown. Do not show the later solution yet.
```

## Muster: bevorzugter Weg

```text
Show the preferred option as a simple direct action. Use emerald green only for the positive/preferred path. Keep support objects to the minimum needed for clarity.
```

## Muster: Vergleich

```text
Show two clearly distinguishable outcomes with large readable objects, not UI cards. Use semantic colors only where they explain the difference.
```

## Muster: Ergebnis

```text
Show one calm, obvious final state. Do not recap every previous object or overload the scene.
```

## Sofort ablehnen

- Hintergrund nicht tiefschwarz
- Realismus/Produktfoto-Look
- feste Objektquote statt inhaltlicher Auswahl
- Dashboard/App-UI/Flowchart
- Miniatur-Diorama
- große Headline/ganzer Satz
- falsche oder zusätzliche Labels
- aufgeklebt wirkendes echtes Logo/Screenshot
- Clutter

## Google Flow

Immer Strict Single Job:

```text
1 Bild
→ warten
→ exakt umbenennen
→ QA
→ nächstes Bild
```

Nie Batch, Parallel-Queue, Galerie, Collage oder Nutzer-„weiter“.
