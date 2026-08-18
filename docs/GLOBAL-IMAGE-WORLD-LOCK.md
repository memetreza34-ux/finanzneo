# FinanzNeo — Global Image World Lock

## Status

**LOCKED**

Global world ID:

```text
finanzneo-stylized-finance-explainer-v8
```

This is the single allowed image world for every NEW FinanzNeo Reel.

## Visual rule

Every normal Google-Flow scene image must look like a clean premium stylized 3D finance infographic, not a photograph:

- one large chunky central explanatory hero object
- 3–6 simplified recognizable topic objects around it
- rounded simplified geometry, matte surfaces and reduced realistic detail
- dark charcoal-green background with mint/emerald, cream and muted-gold accents
- natural asymmetric placement, slight overlap and soft contact shadows
- short labels only as physical paper/price tags or printed plaques
- strict square 1:1 source, preferably 1080×1080

Cover Bild 00 remains vertical 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden realism drift

- photorealism / realistic photography
- realistic product photography or advertising renders
- leather / stitched leather
- wood grain / wooden sign / rustic wood
- realistic scratched or aged metal
- realistic pen, paperwork or electronics photography
- realistic desk / office / shop / lifestyle scene
- luxury product-shot look

## Forbidden UI/game/abstract drift

- digital central screen/tablet/app card
- microchip / circuit-board styling
- floating UI cards, tiles, chips, buttons or widgets
- four-corner mini-tile layout
- circular satellite-module orbit
- game-board / board-game composition
- dashboard / HUD / app interface
- glowing connector loops / line networks
- abstract finance streams, tubes, rails, tracks or roads
- wealth towers, monoliths or meaningless blocks

## Google Flow file workflow

Flow must create one final output folder first.
Then every required image is processed strictly one at a time:

```text
generate exactly ONE image
→ wait until fully finished
→ inspect
→ regenerate same image if invalid
→ rename to exact final filename
→ move/save into the one final folder
→ verify exact filename is present
→ ONLY THEN generate the next image
```

Never batch-generate several required images before renaming the previous one.
Never ask `Weiter?` or for user confirmation between images.
Only after all final files are together in the one folder may Flow return the completion summary.

## Technical source of truth

```text
config/finanzneo-image-world-lock.json
config/finanzneo-image-worlds/finanzneo-stylized-finance-explainer-v8.txt
```

## Enforcement

```bash
npm run reel:create -- --target <TARGET> --title "..."
npm run validate:image-world
npm run reel:validate -- <TARGET>
```

New Reel creation must use `scripts/scaffold-finanzneo-reel-locked.mjs`.
Preview/render/QA pass through the locked wrapper.

## Change policy

A Reel-specific request must never change this lock.
Changing the image world requires an explicit GLOBAL user decision and an intentional modification of the central lock, world definition and validator. Validators must never be weakened simply to make a Reel pass.
