# FinanzNeo — Global Image World Lock

## Status

**LOCKED**

Global world ID:

```text
finanzneo-physical-explainer-editorial-v7
```

This is the single allowed image world for every NEW FinanzNeo Reel.

The purpose of the lock is to prevent accidental style drift. A Reel must not invent or silently replace the image world.

## Visual rule

Every normal Google-Flow scene image must use:

- one large PHYSICAL hero object, not a digital screen/tablet/app card/microchip/game tile
- 3–6 recognizable, topic-specific physical objects around it
- concrete recognizable objects preferred over generic symbols/icons
- natural asymmetric placement with slight overlap and local contact shadows
- short labels only as physical price tags, paper tags, stickers or attached plaques
- premium stylized adult 3D explainer composition
- strict square 1:1 source, preferably 1080×1080

Cover Bild 00 remains vertical 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden screenshot failure mode

The following may never become the image language:

- central digital screen/device with small modules around it
- microchip / circuit-board styling
- floating cards, tiles, chips, buttons or app widgets
- four-corner mini-tile layout
- circular satellite-module orbit
- game-board / board-game composition
- dashboard / HUD / app interface
- generic icon buttons replacing real topic objects
- glowing connector loops / line networks
- abstract finance streams, tubes, rails, tracks or roads
- realistic room/desk/everyday scene
- repeated contract-paper walls
- wealth towers or monoliths
- sterile product advertising
- almost-empty black studio shots
- tiny subject in huge empty space

The intended look is a built physical 3D finance explainer illustration: one strong main board/object with concrete recognizable objects such as products, euro coins, groceries, envelopes, contracts, receipts, calendars or price tags around it.

## Technical source of truth

```text
config/finanzneo-image-world-lock.json
config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt
```

## Enforcement

New Reel creation:

```bash
npm run reel:create -- --target <TARGET> --title "..."
```

This must use:

```text
scripts/scaffold-finanzneo-reel-locked.mjs
```

Validation:

```bash
npm run validate:image-world
npm run reel:validate -- <TARGET>
```

`reel:validate` first checks the global image-world lock and only then runs the normal Reel quality validator. Preview/render/QA also pass through the locked wrapper.

GitHub CI also runs `scripts/validate-global-image-world.mjs` on push and pull requests when Actions are available.

## Change policy

A Reel-specific request must never change this lock.

Changing the image world requires an explicit GLOBAL user decision and an intentional modification of `config/finanzneo-image-world-lock.json` plus the global world definition and validators. Validators must never be weakened simply to allow a different Reel to pass.
