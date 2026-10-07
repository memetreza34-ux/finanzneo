# FinanzNeo — Remotion Production Rules

These rules apply whenever Antigravity authors, reviews or integrates FinanzNeo Remotion motion.

## Authority

1. `CLAUDE.md`
2. `docs/FINANZNEO-EDITORIAL-MOTION-V1.md`
3. target reel `03-szenen/scene-index.json`
4. target scene `szene.md` / `remotion.md`
5. canonical `animation.tsx`
6. FinanzNeo motion skills/rules

## Deterministic timeline

Use:

- `useCurrentFrame()`
- `interpolate()`
- `spring()`
- deliberate easing
- frame windows

Do not use CSS keyframes, CSS transitions, random runtime state or network-dependent motion.

## Scene language

```text
START
→ MEANINGFUL CHANGE
→ RESULT
→ RESULT HOLD
```

The spoken beat and visible change must describe the same idea.

## Motion density

Use the minimum amount of movement needed.

A single strong change is valid and often preferred.

Do not target a fixed number of motion channels.

Additional reactions are allowed only when they make the mechanism clearer.

## Editorial visual language

For new animations:

- 2D / subtle 2.5D preferred
- matte shapes
- few large elements
- light or muted editorial surfaces preferred
- dark surface allowed when justified
- simple 3D only when depth truly helps
- camera still by default

Do not use old `PremiumPhysicalStage` / `Physical*` primitives in new Editorial Motion scenes.

## Camera

Camera is optional support.

Default:

```text
still
```

Use a push, follow or reframe only when it helps the viewer understand a spatial relation or important change.

## Three.js / R3F

Use only when genuine spatial depth is important.

Do not turn simple finance explanations into 3D scenes for novelty.

## Lottie

Lottie is a support layer.

No generic downloaded Lottie should become the main visual.

## Background / surface

New motion may use `EditorialMotionStage` with a cream, off-white, light-gray, muted-green or justified dark surface.

No particle, aurora, grid, hologram or energy background.

## Representative-frame review

Inspect:

- start
- mid-change
- result
- final hold

## Hard rejection

Reject if the animation becomes:

- glossy black 3D by habit
- neon / hologram / coin-spectacle
- dashboard/app-UI-like
- progress-bar driven when a clearer mechanism exists
- text-led instead of visually explanatory
- overloaded with simultaneous movement
- dependent on constant camera movement
- dependent on old Physical primitives
- decorative rather than explanatory
- remote-service dependent at render time
