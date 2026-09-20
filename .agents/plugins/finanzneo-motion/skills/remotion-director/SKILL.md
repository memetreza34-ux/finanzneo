---
name: remotion-director
description: Directs FinanzNeo animation scenes through the canonical src/motion core, choosing unique physical finance mechanisms before implementation and preventing repeated reel motion patterns.
---

# FinanzNeo Remotion Director V2

## Goal

Build animation scenes that feel like short visual stories, not animated infographics.

Every animation must help a beginner understand the spoken sentence faster and more clearly while remaining recognizably FinanzNeo.

Optimize for both:

1. semantic clarity — motion explains the finance statement;
2. controlled variety — scenes inside one reel do not repeat the same physical explanation.

## Authority

Read in this order:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target scene `szene.md`
4. target scene `remotion.md`
5. `src/motion/README.md`
6. `src/motion/mechanics.ts`
7. `src/motion/FinanzNeoMotionReferenceV1.tsx`
8. `src/motion/physical.tsx`, `src/motion/objects.tsx` and `src/motion/tokens.ts`
9. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
10. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
11. existing target `animation.tsx`
12. this skill

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

Then inspect all other animation scenes in the same reel and maintain the ledger:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

The same `MECHANIC_ID` must not appear twice in one reel under Motion Core V1.
If at least three of hero object, primary action, motion axis, result type and mechanic family match an earlier scene, redesign the physical mechanism before coding.

Changing color, text, icon, timing, camera zoom or mirroring does not create a new mechanism.

## MECHANIC_ID format

Use:

```text
fn-<mechanic-name>
```

Only lowercase letters, numbers and hyphens. No underscores.

## Canonical mechanic routing

Read the machine-readable registry in `src/motion/mechanics.ts` and the interpretation rule in `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`.

V1 families:

- `fn-growth-build`
- `fn-cost-extraction`
- `fn-rebalance-transfer`
- `fn-result-lock`
- `fn-allocation-split`
- `fn-account-transfer`
- `fn-shock-buffer`
- `fn-comparison-mass`
- `fn-time-compounding`
- `fn-positive-resolution`

A mechanic family is a semantic explanation, not a fixed template. Scene-specific content can adapt objects and choreography while preserving the cause/effect logic.

Create a new `fn-*` mechanic only when no V1 mechanism can explain the finance statement correctly. State why no existing mechanic fits before introducing it. A one-off new mechanic does not automatically enter the Core registry; Core promotion belongs to the `motion-core-curator`.

## Canonical implementation source

Use `src/motion` before creating local primitives.

Preferred building blocks:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBanknote`
- `PhysicalInvoice`
- `PhysicalCoinStack`
- `PhysicalAccount`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`
- `FN_MOTION`

`PhysicalBill` remains a compatibility alias for the old Motion-Core banknote naming. New code should prefer the semantic names `PhysicalBanknote` and `PhysicalInvoice`.

Do not copy these components into the reel merely to restyle them.
Local scene-specific objects are allowed when the real-world mechanism requires them. Build them from `PhysicalObject` or compatible canonical primitives where possible instead of starting a second design/motion system.

A strong single Hero may be enough. Do not add a second or third object merely to satisfy an object count.

## Engine routing

Use the clearest medium for each part of a scene:

- **Canonical `src/motion` DOM primitives**: default for paper, accounts, money, containers, bills/invoices, reserves, calendars and simple physical mechanisms.
- **React Three Fiber / Three.js + `@remotion/three`**: only for genuine spatial depth, perspective or object interaction.
- **`@remotion/paths`**: only when the visible route itself explains the mechanism.
- **`@remotion/shapes`**: deterministic vector primitives when simpler than custom DOM/SVG.
- **`@remotion/motion-blur`**: selective fast hero/support motion; never text/header.
- **`@remotion/transitions`**: respect the central transition contract.
- **Lottie**: small vector acting and micro-motion only.
- **Flow image**: detailed static explanation when animation adds little value.

Remotion remains the timeline and rendering authority.

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

A progress bar, three cards or text labels are never a substitute for the mechanism.

## Visual-beat synchronization

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

Every meaningful spoken thought gets a visible change in object, state, action, consequence or result. Camera movement alone is not a new beat. Result hold is for readability, not filler.

## Motion density

Keep one clear explanatory hierarchy:

- one hero object;
- zero or one support group depending on clarity;
- at most two simultaneously important primary motions;
- at most one camera action;
- no decorative background animation.

Supporting reactions may include contact compression, fill-state change, paper settle, small recoil, destination absorption and result confirmation. They stay subordinate to the main mechanism.

## Motion character

Objects must feel different:

- heavy appliance/container: slow, weighted, low overshoot
- invoice/paper: light slide/fall with small settle
- money: quick controlled spring
- account: restrained recoil/stabilization
- warning: short sharp emphasis, never constant flashing
- calendar: crisp change
- confirmation: fast clean reveal then hold

Use `FN_MOTION` presets when suitable. Use `useCurrentFrame()`, `interpolate()`, `spring()` and intentional easing. Never use CSS keyframe animation or CSS transitions for rendered motion.

## Paths, camera and depth

Animated paths support concrete objects; they never replace them with a flowchart.
Camera/depth motion supports focus but never becomes the explanation or a fake source of variation.

Organize depth deliberately:

```text
foreground = active item / payment / bill / banknote
midground = account / reserve / main mechanism
background = contextual object/environment
```

## Composition

- important action stays inside the visual safe zone;
- use large readable objects;
- no tiny diorama;
- labels are secondary and short;
- final result must be recognizable without reading a paragraph.

## Lottie hybrid rule

Use `lottie-motion` only when a vector layer materially improves the scene. A different Lottie file does not make a repeated physical mechanism unique.

## Sound relationship

Map important visible events to optional subtle SFX cues. Voiceover remains dominant. Sound timing follows visible motion frames.

## Art-direction handoff

After the mechanism and deterministic code are correct, invoke the `motion-art-director` skill before final visual QA.

The Art Director may refine:

- object scale and proportions;
- material/depth consistency;
- perspective;
- optical centering;
- negative space;
- camera support;
- result-state composition.

It may not replace the finance explanation, `MECHANIC_ID` or PRIMARY_ACTION merely for style.

## Representative-frame review

Inspect at least:

- START
- TRIGGER
- MID-MECHANISM
- NEAR RESULT
- FINAL RESULT HOLD

For spatial scenes verify that hero/support objects never enter header/caption safe zones. For new mechanisms, changed core primitives or representative pilot reels, use a full render when practical. Frame-0 smoke proves renderability, not motion quality.

After Art Direction, hand off to `playwright-visual-qa`. For Motion-Core future reels, the production preflight requires documented `MOTION_ART_DIRECTION=PASS` and `PLAYWRIGHT_VISUAL_QA=PASS` in `05-projektdateien/visual-qa.md`.

## Quality checklist

Reject and redesign if any is true:

- PowerPoint/dashboard/app-UI look;
- meaning depends mainly on labels;
- action is too small;
- mechanic duplicates another reel scene;
- at least three ledger dimensions duplicate another animation;
- repeated scene is only recolored, mirrored, retimed or given another icon;
- local duplicate of an existing `src/motion` primitive is introduced without need;
- support objects were added only to satisfy a count;
- all objects move with identical timing;
- progress bar carries the explanation;
- abstract finance symbols replace a real situation;
- Lottie becomes the whole scene without a concrete reason;
- path/shape graphics become a flowchart;
- result state is not held long enough.

## Final workflow

1. read all animation scenes in the target reel;
2. read `src/motion/mechanics.ts` and build/update the mechanic ledger;
3. read the current voiceover beat;
4. write the one-sentence finance statement;
5. write the one-sentence physical cause/effect;
6. select a unique validator-compatible `MECHANIC_ID`;
7. choose one clear Hero and only necessary support from `src/motion`;
8. define `PRIMARY_ACTION`, `MOTION_AXIS` and `RESULT_TYPE`;
9. pass the anti-repetition gate;
10. define START / TRIGGER / ACTION / REACTION / RESULT / HOLD windows;
11. choose any necessary Three / Paths / Shapes / Lottie support;
12. define optional sound cues;
13. implement deterministic code;
14. run Motion Art Director review;
15. preview representative frames and, when warranted, a full render;
16. run Playwright Visual QA and record PASS/FAIL;
17. run the animation validator;
18. only then seal Phase 1 animation code.
