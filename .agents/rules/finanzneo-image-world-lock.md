# FinanzNeo — GLOBAL IMAGE WORLD LOCK

This rule is global and mandatory for every NEW FinanzNeo Reel.

## Hard authority for image world

For image-world decisions only, this file plus `config/finanzneo-image-world-lock.json` is the hard technical authority and supersedes older image-world wording that may remain in historical docs or old Reels.

Locked world:

```text
finanzneo-central-object-editorial-v6
```

Never invent, rename, replace or silently drift to another image world per Reel.
A different world is allowed only if the user explicitly requests a GLOBAL image-world change and the lock file itself is intentionally updated.

## Required composition

Every normal Google-Flow scene image must use:

- ONE large central hero object
- 3–5 smaller supporting symbolic finance objects around it
- premium stylized 3D explainer composition
- strong central focus
- clear depth and hierarchy
- scene image aspect ratio 1:1, preferably 1080×1080

Cover Bild 00 remains 9:16 and contains the exact requested cover text directly from Google Flow.

## Forbidden drift

Reject/regenerate if the main visual becomes:

- realistic everyday / desk / room scene
- glowing finance-flow lines or line network
- tubes, rails, tracks or roads
- repeated contract-paper wall
- wealth tower or monolith
- sterile product advertisement
- almost-empty black studio shot
- dashboard/app UI
- sci-fi corridor / neon tunnel
- tiny subject in huge empty space

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

Never weaken, bypass or edit the image-world lock/validator merely to make a Reel pass.
