---
name: remotion-director
description: Directs FinanzNeo animation scenes as cinematic, deterministic Remotion stories using real-world objects, multiple motion channels, 3D depth, Lottie only as support, and synchronized sound cues.
---

# FinanzNeo Remotion Director

## Goal

Build animation scenes that feel like short visual stories, not animated infographics.

Every animation must help a beginner understand the spoken sentence faster and more clearly.

## Authority

Read in this order:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target scene `szene.md`
4. target scene `remotion.md`
5. existing `animation.tsx`
6. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
7. this skill

Do not create a second reel when an existing reel is the target.

## Engine routing

Use the clearest medium for each part of a scene:

- **Remotion HTML/CSS primitives**: paper, accounts, labels, simple physical objects and layout.
- **React Three Fiber / Three.js**: perspective, depth, camera moves or genuinely spatial interactions.
- **Lottie**: small vector motion, icon acting, calendar flip, check/warning accents, chart strokes and micro-motion.
- **Flow image**: detailed static explanatory scene when animation adds little value.

Lottie and Three are tools inside the Remotion composition. Remotion remains the timeline and rendering authority.

## Required narrative

Every animation must have:

```text
START
→ TRIGGER
→ PHYSICAL ACTION
→ REACTION
→ RESULT
→ RESULT HOLD
```

Example:

```text
open repair bill appears
→ bill approaches account
→ reserve releases money
→ bill changes to paid
→ overdraft retreats and account stabilizes
→ result remains readable
```

A progress bar, three cards or text labels are never a substitute for this mechanism.

## Motion channels

Use several coordinated motion channels with different jobs. Aim for 4–8 meaningful channels where the scene supports it.

Possible channels:

- hero object translation
- secondary object reaction
- scale/weight reaction
- rotation or page flip
- reserve/fill-state change
- money path
- camera push / parallax
- Lottie accent
- result confirmation

Do not drive all objects with one identical progress value.

## Motion character

Objects must feel different:

- heavy appliance / large bill: slower and weighted
- money: quick controlled spring
- paper: light slide/fall with small settle
- account: restrained recoil/stabilization
- warning: short sharp emphasis, never flashing constantly
- calendar: crisp page turn
- confirmation: fast clean pop then hold

Use `useCurrentFrame()` with `interpolate()`, `spring()` and intentional easing. Do not use CSS keyframe animation or CSS transitions for rendered motion.

## Camera and depth

Use subtle camera motion only when it improves focus:

- small push-in toward the mechanism
- slight parallax between foreground and background
- tiny result settle

Do not use constant zooming. Camera motion never counts as the scene's main animation.

Organize depth deliberately:

```text
foreground = active item / payment / bill
midground = account / reserve / main mechanism
background = contextual appliance or environment
```

## Composition

- important action stays inside the visual safe zone;
- use large readable objects;
- no tiny diorama;
- labels are secondary and short;
- keep enough empty black space for clarity, but do not leave the main action visually weak or undersized;
- final result must be recognizable without reading a paragraph.

## Lottie hybrid rule

Use `lottie-motion` only when a vector layer materially improves the scene.

Good examples:

- calendar page flips
- checkmark after payment
- restrained warning pulse
- money-transfer accent
- chart stroke or target reveal

Never replace a strong real-world mechanism with a generic Lottie illustration.

## Sound relationship

Before finalizing an animation, identify the important audible events and write them to the reel sound plan.

Typical event mapping:

- paper appears / slides → paper-whoosh
- object lands → soft impact
- money releases / travels → subtle cash movement
- mechanical reserve opens → soft mechanism click
- warning begins → restrained warning tick
- payment succeeds → confirmation click/chime
- calendar changes → page flip

SFX timing follows visible motion frames. Voiceover remains dominant.

## Quality checklist

Reject and redesign the animation if any is true:

- it looks like PowerPoint, a dashboard or an app UI;
- the meaning depends mainly on labels;
- the action is too small to notice;
- only one object meaningfully moves;
- all objects move with the same timing;
- a progress bar carries the explanation;
- the viewer must interpret abstract finance symbols;
- Lottie becomes the entire scene without a concrete reason;
- sound cues cannot be attached to clear visible events;
- result state is not held long enough to understand.

## Final workflow

1. read voiceover beat;
2. write one-sentence physical mechanism;
3. choose hero/support objects;
4. define motion channels and approximate frame windows;
5. choose Remotion / Three / Lottie layers;
6. define sound cues;
7. implement deterministic code;
8. preview representative frames in Remotion Studio;
9. run animation validator;
10. only then seal Phase 1 animation code.
