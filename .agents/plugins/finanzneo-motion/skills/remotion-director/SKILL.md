---
name: remotion-director
description: Directs FinanzNeo animation scenes through the canonical src/motion core, choosing unique physical finance mechanisms before implementation and preventing repeated reel motion patterns.
---

# FinanzNeo Remotion Director V2

## Goal

Build animation scenes that feel like short visual stories, not animated infographics.

Every animation must help a beginner understand the spoken sentence faster and more clearly while remaining recognizably FinanzNeo.

The director must optimize for two things at the same time:

1. semantic clarity — the motion explains the finance statement;
2. controlled variety — scenes inside one reel do not repeat the same physical explanation.

## Authority

Read in this order:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target scene `szene.md`
4. target scene `remotion.md`
5. `src/motion/README.md`
6. `src/motion/FinanzNeoMotionReferenceV1.tsx`
7. `src/motion/physical.tsx` and `src/motion/tokens.ts`
8. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
9. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
10. existing target `animation.tsx`
11. this skill

Do not create a second reel when an existing reel is the target.

Old `FinanceMotionLab*` compositions, experiments and legacy reel animation styles are not house-style references.

## Required pre-code decision

Do not begin JSX immediately.

For each animation scene, first resolve and record:

```text
MECHANIC_ID:
FINANZ-AUSSAGE:
PHYSISCHE URSACHE/WIRKUNG:
HERO_OBJECT:
SUPPORT_OBJECTS:
PRIMARY_ACTION:
MOTION_AXIS:
RESULT_TYPE:
WARUM NICHT DOPPELT:
```

Then inspect all other animation scenes in the same reel.

Maintain an internal mechanic ledger:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

The same `MECHANIC_ID` must never appear twice in one reel.

If at least three of hero object, primary action, motion axis, result type and mechanic family match an earlier scene, redesign the physical mechanism before coding.

Changing color, text, icon, timing, camera zoom or mirroring does not create a new mechanism.

## Canonical mechanic routing

Choose from `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md` first.

V1 families:

- `FN_GROWTH_BUILD`
- `FN_COST_EXTRACTION`
- `FN_REBALANCE_TRANSFER`
- `FN_RESULT_LOCK`
- `FN_ALLOCATION_SPLIT`
- `FN_ACCOUNT_TRANSFER`
- `FN_SHOCK_BUFFER`
- `FN_COMPARISON_MASS`
- `FN_TIME_COMPOUNDING`
- `FN_POSITIVE_RESOLUTION`

A mechanic family is a semantic explanation, not a fixed template. Scene-specific content can adapt objects and choreography while preserving the cause/effect logic.

Create a new `FN_*` mechanic only when no V1 mechanism can explain the finance statement correctly. State why no existing mechanic fits before introducing it.

## Canonical implementation source

Use `src/motion` before creating local primitives.

Preferred building blocks:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBill`
- `PhysicalCoinStack`
- `PhysicalAccount`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`
- `FN_MOTION`

Do not copy these components into the reel merely to restyle them.

Local scene-specific objects are allowed when the real-world mechanism requires them. Build them from `PhysicalObject` or compatible canonical primitives where possible instead of starting a second design/motion system.

## Engine routing

Use the clearest medium for each part of a scene:

- **Canonical `src/motion` DOM primitives**: default for paper, accounts, money, containers, bills, reserves, calendars and simple physical mechanisms.
- **React Three Fiber / Three.js + `@remotion/three`**: perspective, depth, camera moves or genuinely spatial interactions that cannot be expressed cleanly with the core primitives.
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

## Visual-beat synchronization

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

Treat an animation scene as several visible sub-beats, not one long motion. Every time the spoken thought advances, the visual should reveal a new object, state, action, consequence or result. Camera movement alone is not a new beat.

Do not let a fully understood still state sit under new narration. Hold is reserved for a short readable result, not for filling time. Plan approximate beat windows first; Phase 3 retimes scene boundaries from the real voiceover without changing the sealed mechanism.

## Motion density

The scene must have one clear explanatory hierarchy:

- one hero object;
- at most one support group;
- at most two simultaneously important primary motions;
- at most one camera action;
- no decorative background animation.

Supporting reactions may add physical richness, for example:

- contact compression
- fill/balance state change
- paper settle
- small recoil
- absorption at destination
- result confirmation

Do not make every support reaction compete for attention.

## Motion character

Objects must feel different:

- heavy appliance / large container: slower and weighted
- invoice/paper: light slide/fall with a small settle
- money: quick controlled spring
- account: restrained recoil/stabilization
- warning: short sharp emphasis, never flashing constantly
- calendar: crisp page turn
- confirmation: fast clean pop then hold

Use `FN_MOTION` presets when suitable. Use `useCurrentFrame()` with `interpolate()`, `spring()` and intentional easing. Do not use CSS keyframe animation or CSS transitions for rendered motion.

## Motion blur

Use motion blur sparingly and semantically.

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

Do not use constant zooming. Camera motion never counts as the scene's main animation and never counts as sufficient variation from another scene.

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
A different Lottie file does not make a repeated physical mechanism unique.

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

For a new mechanism, a changed core primitive or a representative pilot reel, use a full render when practical. A frame-0 smoke render does not prove motion quality.

## Quality checklist

Reject and redesign the animation if any is true:

- it looks like PowerPoint, a dashboard or an app UI;
- the meaning depends mainly on labels;
- the action is too small to notice;
- the scene duplicates a mechanic already used in the reel;
- at least three ledger dimensions duplicate an earlier animation;
- a repeated scene is only recolored, mirrored, retimed or given another icon;
- a local duplicate of an existing `src/motion` primitive is introduced without need;
- all objects move with the same timing;
- a progress bar carries the explanation;
- the viewer must interpret abstract finance symbols;
- Lottie becomes the entire scene without a concrete reason;
- path/shape graphics turn the scene into a flowchart;
- motion blur hides readability;
- sound cues cannot be attached to clear visible events;
- result state is not held long enough to understand.

## Final workflow

1. read all animation scenes in the target reel;
2. build/update the mechanic ledger;
3. read current voiceover beat;
4. write one-sentence finance statement;
5. write one-sentence physical cause/effect;
6. select a unique `MECHANIC_ID`;
7. choose canonical hero/support objects from `src/motion` where possible;
8. define `PRIMARY_ACTION`, `MOTION_AXIS` and `RESULT_TYPE`;
9. pass the anti-repetition gate;
10. define START / TRIGGER / ACTION / REACTION / RESULT / HOLD windows;
11. choose Remotion / Three / Paths / Shapes / Lottie support layers;
12. decide whether selective motion blur adds real value;
13. define sound cues;
14. implement deterministic code;
15. preview representative frames and, when warranted, a full render;
16. run animation validator;
17. only then seal Phase 1 animation code.
