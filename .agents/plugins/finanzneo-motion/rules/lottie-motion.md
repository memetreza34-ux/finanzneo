# FinanzNeo — Lottie Motion Rules

Lottie is a support layer inside FinanzNeo Editorial Motion.

## Core rule

Use Lottie only when it makes the spoken idea clearer or gives a small useful motion accent.

It is not the default animation engine.

## Hard boundaries

- never replace a sealed `animation.tsx` in Phase 3
- never use a generic downloaded Lottie as the main scene
- never bake an unrelated background into the Lottie
- never use Lottie to bypass animation validators
- never rely on remote Lottie URLs in the final render
- no endless decorative looping
- no generic finance-icon rain

Lottie should visually sit inside the active Editorial Motion surface.

## Good uses

- calendar page flip
- small checkmark
- restrained warning accent
- simple chart stroke
- small object state change

## Bad uses

- full generic finance illustration
- looping coin animation
- neon dashboard motion
- decorative particles
- visual filler

## Timing

All Lottie timing must be deterministic from the Remotion frame timeline.

The final explanatory result must hold long enough to read.

## Acceptance test

Keep a Lottie layer only if removing it would make the scene less clear or materially less polished.
