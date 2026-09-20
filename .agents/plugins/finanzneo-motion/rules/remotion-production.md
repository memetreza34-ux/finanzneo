# FinanzNeo — Remotion Production Rules

These rules apply whenever Antigravity authors, reviews or integrates FinanzNeo Remotion motion.

## Authority

The repository contract wins over generic agent advice:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target scene `szene.md` / `remotion.md`
4. `src/motion/README.md`, `src/motion/mechanics.ts` and `src/motion/*` as canonical motion implementation
5. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
6. target scene `animation.tsx` as the scene-specific implementation to improve, not as a competing style authority
7. FinanzNeo motion skills/rules
8. installed official Remotion Agent Skills

Official Remotion skills are best-practice guidance. They must never override FinanzNeo layout, visual-world, seal, safety or completion contracts.

`FinanceMotionLab*`, old experiment compositions and legacy reel animation styles are not production style references. They may supply isolated technical ideas only.

## Canonical Motion Core

For every new or intentionally redesigned animation scene, inspect `src/motion` before inventing local motion infrastructure.

Prefer semantic names:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBanknote`
- `PhysicalInvoice`
- `PhysicalCoinStack`
- `PhysicalAccount`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`
- `FN_MOTION` timing/spring presets

`PhysicalBill` remains compatibility naming for the old Motion-Core banknote. New code should use `PhysicalBanknote` or `PhysicalInvoice` according to meaning.

Do not create local duplicate versions of these primitives merely to change styling.

The production routing order is:

```text
VOICEOVER BEAT
→ FINANCE STATEMENT
→ PHYSICAL CAUSE / EFFECT
→ MECHANIC_ID
→ HERO + OPTIONAL SUPPORT OBJECTS
→ START / ACTION / REACTION / RESULT / HOLD
→ REMOTION TIMELINE
→ MOTION ART DIRECTION
→ PLAYWRIGHT VISUAL QA
```

The visible mechanism is chosen before decorative treatment.

## Mechanic selection and anti-repetition

Follow `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md` and inspect `src/motion/mechanics.ts` before authoring JSX.

Every animation scene must define a unique `MECHANIC_ID` under Motion Core V1.
The same mechanic must not be used twice within one reel.

Before implementing the current scene, inspect all animation scenes in the target reel and compare at least:

- `MECHANIC_ID`
- hero object
- `PRIMARY_ACTION`
- dominant motion axis
- result type

If three or more of those characteristics duplicate an earlier scene, redesign the physical explanation instead of disguising the repetition with color, text, camera or timing changes.

## Hero before object count

A production animation needs at least one clear physical Hero. **One strong Hero may be enough.**

Do not add a second or third object simply to satisfy a component count. Supporting objects are justified only when they improve cause/effect comprehension.

`singleHeroObjectAllowed=true`, `supportingObjectCountFlexible=true` and `clarityBeforeObjectCount=true` are the intended Motion-Core-V1 contract.

## Remotion is the timeline authority

All productive motion is deterministic from the Remotion frame timeline.

Use:

- `useCurrentFrame()`
- `interpolate()`
- `spring()`
- deliberate easing
- `Sequence`/frame windows where useful
- central `FN_MOTION` presets when they fit

Do not use CSS keyframe animations, CSS transitions, timers, random runtime state or network-dependent motion.

## Scene language

Every animation is a short explanatory story:

```text
START
→ TRIGGER
→ PHYSICAL ACTION
→ REACTION
→ RESULT
→ RESULT HOLD
```

The spoken beat and visible action must describe the same mechanism.

## Voice-to-visual pacing

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

The visible story must advance with the spoken story. Each meaningful spoken thought gets a visible change. An animation may contain multiple sub-beats inside one scene. Do not use camera drift, zoom or idle floating as a substitute for new information. Result holds are short readability windows, not filler.

## Motion density

Distinguish between primary explanatory motion and supporting motion.

The canonical density target from `src/motion` wins:

- one hero object
- zero or one support group according to clarity
- at most two simultaneously important primary motions
- at most one camera action
- no decorative background animation

A scene may still contain several coordinated support channels such as contact reactions, fill-state changes, paper settle or result confirmation, but they must remain subordinate to the one clear mechanism.

Do not create meaningless motion only to reach a channel count.

## Physics character

Different object types should not move identically.

- heavy appliance / container: slow, weighted, low overshoot
- invoice / paper: light movement with small settle
- money: quicker spring with controlled overshoot
- account: restrained recoil and stabilization
- warning: short emphasis, never constant flashing
- calendar/page: crisp flip/change
- confirmation: quick clean reveal then stable hold

## Camera

Camera/depth motion is support, never the explanation itself.

Allowed when helpful:

- subtle push-in toward the key action
- slight foreground/midground parallax
- tiny result settle

Avoid constant zooming, unnecessary rotations or motion sickness.

## Three.js / React Three Fiber

Use Three/R3F only when genuine spatial depth, perspective or object interaction benefits from it.

Do not turn simple scenes into expensive 3D merely for novelty.

Three layers remain synchronized to the Remotion frame timeline and must preserve the pure-black canvas/safe-zone contract.

## Lottie

Lottie is a support layer governed by `lottie-motion.md`.

Use it for compact vector acting and accents. Do not let it replace a stronger real-world Remotion mechanism.

Lottie does not count as a unique mechanic merely because the icon or animation file changes.

## Art Direction

After mechanism/code correctness, use `.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md`.

Art Direction may refine scale, proportions, material/depth, perspective, optical centering, negative space, camera and RESULT HOLD composition. It may not change the finance meaning merely for style.

## Representative-frame review

Before sealing an animation, inspect representative states rather than only the first frame:

- START
- TRIGGER
- MID-MECHANISM
- NEAR RESULT
- FINAL RESULT HOLD

The scene must remain readable and centered throughout the action.

For meaningful motion-system changes, prefer a complete reference or target-scene render when practical; frame-0 smoke tests prove renderability, not visual quality.

For Motion-Core-V1 future Reels, `05-projektdateien/visual-qa.md` must record real review results. `reel:phase3:preflight` requires:

```text
MOTION_ART_DIRECTION=PASS
PLAYWRIGHT_VISUAL_QA=PASS
```

and no open PENDING/FAIL scene rows.

## Audio relationship

Every important visible event should be evaluated for a possible subtle SFX cue. Follow `sound-design.md`.

Do not add sound merely because an object moves. Add it when the sound increases physicality, timing clarity or polish.

## No remote production dependencies

The final render must be reproducible from committed/local assets. No remote Lottie URLs, remote sound URLs, runtime APIs or network-only assets.

## Phase ownership

Before Phase-1 seal, motion may be improved intentionally.

After Phase-1 seal, Phase 3 integrates the exact sealed animation source and committed support assets. If the mechanism needs creative redesign, return to Phase 1 instead of silently editing Phase 3.

## Hard rejection

Reject a scene if it becomes:

- PowerPoint-like
- dashboard/app-UI-like
- three cards plus arrows
- progress-bar driven
- text-led instead of action-led
- abstract finance symbolism where a real situation is possible
- visually tiny inside excessive empty space
- overpacked with simultaneous accents
- padded with unnecessary objects only to satisfy a count
- dependent on background motion
- dependent on a remote service at render time
- a duplicate of an earlier reel mechanic disguised by different colors, labels, icons, mirroring or camera motion
- a second local motion system when the required physical primitives already exist in `src/motion`
