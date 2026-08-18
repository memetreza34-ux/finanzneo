# FinanzNeo — GLOBAL IMAGE WORLD LOCK

This rule is global and mandatory for every NEW FinanzNeo Reel.

## Hard authority for image world

For image-world decisions only, this file plus `config/finanzneo-image-world-lock.json` and the world file referenced there are the hard technical authority. They supersede older image-world wording in historical docs, old Reels or previous prompts.

Locked world:

```text
finanzneo-physical-explainer-editorial-v7
```

Never invent, rename, replace or silently drift to another image world per Reel.
A different world is allowed only if the user explicitly requests a GLOBAL image-world change and the lock file itself is intentionally updated.

## Required composition

Every normal Google-Flow scene image must use:

- ONE large PHYSICAL hero object, not a digital screen/tablet/app card/microchip/game tile
- 3–6 recognizable, topic-specific PHYSICAL objects around it
- concrete objects preferred over generic icons: products, euro coins, cash, groceries, envelopes, receipts, contracts, calendars, price tags, shopping objects etc.
- natural asymmetric arrangement with overlap and contact shadows
- short labels only as physical price tags, paper tags, stickers or attached plaques
- premium stylized 3D explainer composition
- scene image aspect ratio 1:1, preferably 1080×1080

Cover Bild 00 remains 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden screenshot failure mode

Reject/regenerate immediately if the main visual becomes anything like the failed UI/chip examples:

- central digital screen/device with mini modules around it
- microchip or circuit-board visual language
- floating cards, tiles, chips, buttons or app widgets
- four-corner mini-tile layout
- circular satellite-module orbit
- game-board / board-game composition
- dashboard / HUD / app UI
- generic icon buttons instead of concrete topic objects
- glowing connector loops or line networks
- abstract finance streams, tubes, rails, tracks or roads
- realistic everyday / desk / room scene
- repeated contract-paper wall
- wealth tower or monolith
- sterile product advertisement
- almost-empty black studio shot
- tiny subject in huge empty space

The target is a built PHYSICAL 3D finance explainer illustration: strong central object + concrete recognizable topic objects around it.

## Google Flow must not stop

The complete image set is generated in one continuous autonomous sequence.
Never ask `Weiter?`, `Continue?`, approval or confirmation between images.
Invalid images are regenerated internally before continuing.
Only after all required images pass may Flow return one final summary.

## Technical enforcement

New Reels must be created through:

```bash
npm run reel:create -- --target <TARGET> --title "..."
```

This command is locked to `scripts/scaffold-finanzneo-reel-locked.mjs`.

Validation must pass:

```bash
npm run validate:image-world
npm run reel:validate -- <TARGET>
```

Preview/render/QA also run through the locked render wrapper.

Never weaken, bypass or edit the image-world lock/validator merely to make a Reel pass.
