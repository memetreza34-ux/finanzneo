# FinanzNeo YouTube — Phase 1

Use this workflow when creating or revising the creative Phase 1 of a YouTube Longform project.

## Goal

Finish research, script, visual beats, image prompts, Motion V3 sources and optional external-support planning before Phase 2 begins.

## Required order

```text
Research
→ script
→ spoken thoughts
→ visual beats
→ viewer change
→ primary visual type
→ primary mechanism
→ optional external-support check
→ production-ready source
→ validation
→ seal
```

## External-support decision

Only after the primary visual is defined ask:

> Would a short real clip, precise icon, still photo or tiny support animation make this exact beat clearer without replacing the main mechanism?

If NO: do not add an external slot.

If YES:

1. add the slot to `06-projektdateien/external-assets-manifest.json`,
2. document the purpose in `06-projektdateien/external-assets-plan.md`,
3. define allowed type, source priority, search terms/icon names and integration boundary,
4. keep the primary visual fully understandable if the slot remains empty.

Phase 1 normally plans slots; it does not need to download stock libraries.

## Source priority

Read `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`.

- B-roll: Pexels → Pixabay → manually checked Coverr/Mixkit
- icons: Lucide → Phosphor → Heroicons/Tabler
- Lottie: only tiny support cues after item-level license check

## Motion boundary

Do not design the main animation around an unknown future stock clip.

External support must be subordinate to:

- `viewerChange`
- `animationIntent`
- `mechanicId`
- `visualTechniqueId`
- `motionSignature`
- `visualBeats`

The primary `animation.tsx` remains deterministic and remote-free.

## Finish Phase 1

Run:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Do not weaken validation to make an asset plan pass. External slots are optional enhancement and must never become a substitute for incomplete Phase-1 work.
