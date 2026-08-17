# FinanzNeo — Global Image World Lock

## Status

**LOCKED**

Global world ID:

```text
finanzneo-central-object-editorial-v6
```

This is the single allowed image world for every NEW FinanzNeo Reel.

The purpose of the lock is to prevent accidental style drift. A Reel must not invent or silently replace the image world.

## Visual rule

Every normal Google-Flow scene image must use:

- one large central hero object
- 3–5 smaller supporting symbolic finance objects around it
- premium stylized 3D explainer composition
- clear depth and hierarchy
- strict square 1:1 source, preferably 1080×1080

Cover Bild 00 remains vertical 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden drift

The following may not become the main image language:

- realistic room/desk/everyday scene
- photo-like realism
- glowing finance streams or line networks
- tubes, rails, tracks or roads
- repeated contract-paper walls
- wealth towers or monoliths
- sterile product advertising
- almost-empty black studio shots
- dashboard/app UI
- sci-fi corridor / neon tunnel
- tiny subject in huge empty space

## Technical source of truth

```text
config/finanzneo-image-world-lock.json
config/finanzneo-image-worlds/finanzneo-central-object-editorial-v6.txt
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

`reel:validate` first checks the global image-world lock and only then runs the normal Reel quality validator.

GitHub CI also runs `scripts/validate-global-image-world.mjs` on push and pull requests.

## Change policy

A Reel-specific request must never change this lock.

Changing the image world requires an explicit GLOBAL user decision and an intentional modification of `config/finanzneo-image-world-lock.json` plus the global world definition and validators. Validators must never be weakened simply to allow a different Reel to pass.
