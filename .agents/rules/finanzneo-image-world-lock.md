# FinanzNeo — GLOBAL IMAGE WORLD LOCK

This rule is global and mandatory for every NEW FinanzNeo Reel.

## Hard authority

For image-world decisions only, this file plus `config/finanzneo-image-world-lock.json` and the world file referenced there are the hard technical authority. They supersede older image-world wording in historical docs, old Reels or previous prompts.

Locked world:

```text
finanzneo-stylized-finance-explainer-v8
```

Never invent, rename, replace or silently drift to another image world per Reel.
A different world is allowed only if the user explicitly requests a GLOBAL image-world change and the lock file itself is intentionally updated.

## Required visual language

Every normal Google-Flow scene image must be a clean premium stylized 3D finance-infographic illustration:

- ONE large chunky central explanatory hero object
- 3–6 simplified recognizable topic objects around it
- smooth rounded geometry, soft bevels, clean matte surfaces, reduced realistic detail
- deep charcoal-green background with mint/emerald structure accents, cream and muted gold
- natural asymmetry, slight overlap and soft contact shadows
- short labels only as small physical price/paper tags or printed plaques
- scene image aspect ratio 1:1, preferably 1080×1080

Cover Bild 00 remains 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden realism drift

Reject/regenerate immediately if an image becomes:

- photorealistic or photographic
- realistic product photography / product advertising
- leather or stitched-leather texture
- wood grain / wooden sign / rustic wood
- realistic scratched, aged or brushed metal
- realistic pen/document/electronics photography
- realistic desk / office / shop / lifestyle scene
- luxury cinematic product shot

The target is a DESIGNED 3D INFOGRAPHIC, not a photographed physical scene.

## Forbidden UI/game/abstract drift

Reject/regenerate immediately if the visual becomes:

- central digital screen/tablet/app card
- microchip or circuit-board language
- floating UI cards, tiles, chips, buttons, widgets or HUD
- four-corner mini-tile layout
- circular satellite-module orbit
- game-board / board-game composition
- generic icon buttons instead of simplified recognizable objects
- glowing connector loops or line networks
- abstract finance streams, tubes, rails, tracks or roads
- wealth towers, monoliths or meaningless blocks

## Google Flow file workflow — hard order

Create ONE final output folder first.
Then process required images strictly ONE AT A TIME.

For EACH image:

1. Generate exactly ONE image only.
2. Wait until it is completely finished.
3. Inspect style, aspect ratio, spelling and composition.
4. If invalid, regenerate THIS SAME image until valid. Do not start the next image.
5. Rename the valid image immediately to the exact required final filename.
6. Move/save it into the single final output folder.
7. Verify that exact renamed file is present in the folder.
8. ONLY THEN generate the next required image.

Never batch-generate several required images before renaming the previous one.
Never ask `Weiter?`, `Continue?`, approval or confirmation between images.
Only after all required images are together in the one final folder may Flow return one final summary.

## Technical enforcement

New Reels must be created through:

```bash
npm run reel:create -- --target <TARGET> --title "..."
```

Validation must pass:

```bash
npm run validate:image-world
npm run reel:validate -- <TARGET>
```

Preview/render/QA also run through the locked render wrapper.
Never weaken or bypass the image-world validator merely to make a Reel pass.
