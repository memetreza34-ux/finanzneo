---
name: lottie-motion
description: Uses Lottie Creator MCP only where it materially improves FinanzNeo motion design, then integrates deterministic Lottie assets into the existing Remotion reel without weakening the three-phase contract.
---

# FinanzNeo Lottie Motion Skill

## Purpose

Use Lottie as a **supporting motion-design tool**, not as a replacement for the real-world Remotion scene language.

The goal is higher-quality motion, cleaner micro-animations, more varied mechanics and stronger visual polish while preserving:

- `finanzneo-stylized-3d-animated-black-v9`
- the existing reel path and scene order
- the canonical Phase-1 animation ownership
- pure black background
- exact captions/voiceover timing
- deterministic Remotion rendering

## Authority

Read before acting:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target scene `remotion.md`
4. target scene `animation.tsx`
5. `05-projektdateien/animationen.md`
6. this skill
7. `rules/lottie-motion.md`

Higher sources win on conflict.

## When Lottie is a good fit

Prefer Lottie for compact, graphic motion where vector animation adds quality without replacing the real scene:

- animated semantic icons
- money-flow accents
- calendar/page flips
- checkmarks / warning states
- number or percentage reveals
- chart strokes and simple financial diagrams
- short highlight strokes / callouts
- clean 2D or 2.5D transition accents
- controlled micro-motion around real-world Remotion objects

## When Lottie is NOT the right fit

Do not use Lottie as the main scene for:

- a washing machine, room, desk, bank environment or other real-world hero scene
- physical bill interception / object collision
- perspective-heavy 3D motion
- complex camera/parallax scene acting
- anything that would turn the scene back into generic UI, cards or icon packs

For those, keep Remotion/Three/HTML primitives as the main mechanism.

## Phase ownership

### Before animation seal

Lottie assets may be authored or refined only while the animation scene is still in Phase 1 motion authoring.

Workflow:

1. read the spoken beat and existing animation contract;
2. decide whether Lottie adds real explanatory value;
3. use `lottiefiles-creator` MCP only for the supporting motion asset;
4. export the final deterministic Lottie JSON;
5. store it locally in the repo;
6. integrate it into the canonical `animation.tsx`;
7. validate the scene and only then seal Phase-1 animations.

### After animation seal / Phase 3

Once the Phase-1 animation SHA is sealed:

- do **not** generate a new Lottie concept;
- do **not** replace the animation with a Lottie template;
- do **not** change the meaning or mechanism;
- only integrate already committed/sealed assets exactly as specified.

If a new Lottie idea is required after seal, stop and return the reel to Phase 1 motion authoring instead of silently changing Phase 3.

## Asset storage

Final Lottie assets belong under:

```text
public/lottie/<reel-slug>/scene-XX-<purpose>.json
```

Examples:

```text
public/lottie/reel-02_notgroschen-richtig-aufbauen/scene-09-calendar-flip.json
public/lottie/reel-02_notgroschen-richtig-aufbauen/scene-11-money-transfer-accent.json
```

Rules:

- commit final JSON; do not depend on remote URLs at render time;
- one asset = one clear purpose;
- descriptive lowercase filenames;
- no unused variants in production;
- no embedded background; transparency is required;
- avoid raster-heavy Lotties when a native Remotion object is clearer.

## Remotion integration

Use the repo's installed `@remotion/lottie` package.

The Lottie layer must be:

- frame-deterministic;
- synchronized to the scene timeline;
- clipped inside the visual safe zone;
- transparent over the central `#000000` canvas;
- subordinate to the real-world scene mechanism;
- disabled outside its intended frame window.

Do not use CSS keyframe animations as a substitute for Remotion timing.

## Motion quality

A good hybrid scene should have several coordinated motion channels, for example:

```text
main physical object movement
+ secondary object reaction
+ Lottie accent / icon motion
+ subtle camera push
+ result hold
```

Avoid one global progress variable controlling every object identically.

Use different motion character for different object types:

- heavy bill / appliance: slower, weighted easing
- money: quick spring with controlled overshoot
- calendar: crisp page-flip timing
- confirmation mark: short clean pop
- warning: brief, restrained emphasis

## Sound relationship

Lottie itself does not own audio.

For any meaningful animated event, create a sound cue in Remotion rather than baking audio into the Lottie asset.

Typical cue mapping:

- paper enters → soft paper/whoosh
- bill impacts → muted impact
- money moves → subtle cash/coin movement
- calendar flips → paper flip
- warning appears → short restrained alert
- result confirmed → soft success click/chime

Sound must support motion, never overpower voiceover.

## Quality gate

Reject the Lottie enhancement if it:

- makes the scene more abstract instead of clearer;
- looks like generic stock motion graphics;
- introduces a dashboard/UI aesthetic;
- creates visual clutter;
- uses a non-black or baked background;
- duplicates a motion already handled better by Remotion;
- distracts from captions or voiceover;
- changes the sealed scene meaning;
- requires a network connection during render.

The final test is simple: the scene must be easier to understand and feel more polished with the Lottie layer than without it.
