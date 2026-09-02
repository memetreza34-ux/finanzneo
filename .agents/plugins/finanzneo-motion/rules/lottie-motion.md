# FinanzNeo — Lottie Motion Rules

These rules apply whenever Antigravity can access the `lottiefiles-creator` MCP inside this workspace.

## Core rule

Lottie is an **enhancement layer**, not the default animation engine.

The main explanatory mechanism of a FinanzNeo animation must remain the clearest medium for the beat. Real-world object interaction stays in Remotion/Three/HTML when that is more understandable.

## Hard boundaries

- Never replace a sealed `animation.tsx` with a new Lottie concept during Phase 3.
- Never create a second reel to test a Lottie variation when the task targets an existing reel.
- Never use a generic downloaded Lottie template as the main scene.
- Never introduce a white, colored or baked Lottie background; production background remains transparent over `#000000`.
- Never use Lottie to bypass animation validators or movement-quality gates.
- Never rely on remote Lottie URLs in the final render.
- Never let Lottie text replace the Reel header or captions.
- Never cover the header/caption safe zones.

## Preferred hybrid use

Good:

```text
real-world Remotion scene
+ one focused Lottie accent
+ synchronized SFX cue
+ result hold
```

Bad:

```text
three generic Lottie cards
+ arrow
+ progress bar
+ decorative loop
```

## Complexity limit

Use the minimum Lottie complexity needed to improve clarity.

As a default, prefer no more than two simultaneous Lottie support layers in one scene. Exceed this only when the scene remains visually simple and the extra layers clearly explain separate actions.

## Timing

- all Lottie timing must be deterministic from the Remotion frame timeline;
- no endless decorative looping;
- loop only when the loop itself communicates state;
- important actions get a visible start, action and result;
- final explanatory result must hold long enough to read.

## Sound cues

Lottie animation events should expose clear Remotion SFX moments rather than containing their own audio.

Recommended sound families:

- `paper`
- `money`
- `ui-soft`
- `movement`
- `mechanical`

Voiceover remains dominant. SFX must be subtle and purposeful.

## Acceptance test

Before keeping a Lottie asset, compare the scene with and without it.

Keep it only if at least one is true:

1. the financial mechanism becomes easier to understand;
2. the motion feels materially more polished;
3. the scene gains useful motion variety without losing the FinanzNeo visual language.

Otherwise remove the Lottie layer.
