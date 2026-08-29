---
name: remotion-director
description: Directs FinanzNeo animation scenes as cinematic, deterministic Remotion stories using real-world objects, multiple motion channels, 3D depth, paths/shapes, controlled motion blur, Lottie only as support, and synchronized sound cues.
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
- **React Three Fiber / Three.js + `@remotion/three`**: perspective, depth, camera moves or genuinely spatial interactions.
- **`@remotion/paths`**: animated paths only when a visible route/connection itself explains the mechanism.
- **`@remotion/shapes`**: clean deterministic vector primitives where custom DOM/SVG would be noisier.
- **`@remotion/motion-blur`**: selective blur for genuinely fast hero/support movement; never blur captions/header or use it to hide weak motion.
- **`@remotion/transitions`**: respect the central Reel transition contract; do not invent scene-local transition styles that break consistency.
- **Lottie**: small vector motion, icon acting, calendar flip, check/warning accents, chart strokes and micro-motion.
- **Flow image**: detailed static explanatory scene when animation adds little value.

Lottie, Three, paths, shapes and motion blur are tools inside the Remotion composition. Remotion remains the timeline and rendering authority.

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

- heavy appliance / large container: slower and weighted
- invoice/paper: light slide/fall with a small settle
- money: quick controlled spring
- account: restrained recoil/stabilization
- warning: short sharp emphasis, never flashing constantly
- calendar: crisp page turn
- confirmation: fast clean pop then hold

Use `useCurrentFrame()` with `interpolate()`, `spring()` and intentional easing. Do not use CSS keyframe animation or CSS transitions for rendered motion.

## Motion blur

Use motion blur sparingly and semantically:

Good:

- fast money transfer
- short paper whip/slide
- quick foreground object movement

Bad:

- permanent blur
- blurred text/labels
- blur on slow objects
- blur used to make a weak animation look more active

The unblurred result state must always hold clearly.

## Paths and shapes

Animated lines/paths are allowed only when they communicate a real path, e.g. money moving from Girokonto to Tagesgeld.

Do not regress into abstract flowcharts. A path supports concrete objects; it does not replace them.

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

## Representative-frame review

Inspect at least:

- start
- trigger
- mid-mechanism
- near-result
- final result hold

For spatial scenes, also verify that no hero/support object crosses header/caption safe zones during its path.

## Quality checklist

Reject and redesign the animation if any is true:

- it looks like PowerPoint, a dashboard or an app UI;
- the meaning depends mainly on labels;
- the action is too small to notice;
- only one object meaningfully moves when the idea naturally supports richer cause/effect;
- all objects move with the same timing;
- a progress bar carries the explanation;
- the viewer must interpret abstract finance symbols;
- Lottie becomes the entire scene without a concrete reason;
- path/shape graphics turn the scene into a flowchart;
- motion blur hides readability;
- sound cues cannot be attached to clear visible events;
- result state is not held long enough to understand.

## Final workflow

1. read voiceover beat;
2. write one-sentence physical mechanism;
3. choose hero/support objects;
4. define motion channels and approximate frame windows;
5. choose Remotion / Three / Paths / Shapes / Lottie layers;
6. decide whether selective motion blur adds real value;
7. define sound cues;
8. implement deterministic code;
9. preview representative frames in Remotion Studio;
10. run animation validator;
11. only then seal Phase 1 animation code.
