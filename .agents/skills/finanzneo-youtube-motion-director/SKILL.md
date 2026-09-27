---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform with script-first visual planning, earned motion, non-overlapping hybrid layers, strong static alternatives, safe full-frame Phase-B motion and the locked FinanzNeo 3D world.
---

# FinanzNeo YouTube Motion Director V6 Earned Motion

## Goal

Make finance easy to understand and easy to remember. Script and visual are designed together. Choose the strongest visual form from the spoken point, not from a preferred tool.

> **Clarity first. Strong static idea second. Motion only when it earns its place.**

## Authority

Read in this order:
1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`
4. `docs/YOUTUBE-PRODUCTION-MODES.md`
5. `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`
6. `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`
7. `docs/YOUTUBE-MOTION-V4-SIMPLE.md`
8. `docs/YOUTUBE-MOTION-QUALITY-V1.md`
9. `config/finanzneo-youtube-visual-system.json`
10. target `04-visuals/visual-index.json`

Reel rules do not automatically apply to YouTube Longform.

## Script-first visual planning — mandatory

Do not finish the Voiceover first and invent visuals afterward.

For every beat before Script Lock define:
- `CORE_MESSAGE`
- `VOICEOVER`
- `VISUAL_FORM`
- `VISUAL_IDEA`
- `WHY_THIS_FORM`
- `STATIC_ALTERNATIVE`
- `MOTION_VALUE` when motion is considered
- `IMAGE_JOB` and `MOTION_JOB` when hybrid is considered
- `OVERLAP_CHECK`
- `VARIETY_CHECK`

If a beat has no strong visual path, rewrite or split the beat before finalizing the script. Never distort facts for visual convenience.

## Scene granularity

One visual beat carries one dominant idea. A Flow image normally covers 1–2 short Voiceover sentences. Split multi-idea beats.

## Phase-B decision — mandatory

For every beat ask:

1. What must the viewer understand or remember?
2. What is the strongest static solution: story image, example, comparison, diagram, chart, calculation or real asset?
3. Does movement communicate something the static solution cannot communicate as clearly?
4. If hybrid: do image and motion have different jobs?
5. Does this repeat the visual logic of recent scenes?

Use:
- **image** for concrete situation, emotion, cause/effect or memorable everyday context;
- **static explainer** for diagram, comparison, worked example, chart, calculation or before/after when motion adds no value;
- **hybrid** only for concrete image + non-redundant temporal/exact explanation;
- **animation/data** only when process/change over time is genuinely clearer in motion;
- **real-asset** for real sources/documents/websites/products.

Do not default to Remotion just because it is available.

## No visual quotas

There is no target percentage for image, hybrid or animation.

Never add motion or hybrid layers merely to create a balanced-looking mix. A video with many strong images and only a few strong animations is valid.

## Earned-motion gate

Before keeping an animation, name the static alternative.

Animation is justified when motion materially explains:
- change over time;
- sequence/process;
- build-up or breakdown;
- money flow;
- transition between meaningful states;
- guided attention across several states.

If a strong still image, diagram, example, comparison or static chart is equally clear or better looking, use the static solution.

Weak motion must be downgraded instead of polished indefinitely.

## Hybrid overlap guard

Image + Remotion is allowed only when the layers have **different semantic jobs**.

Good:
- `IMAGE_JOB`: real grocery context;
- `MOTION_JOB`: exact price increase over time.

Bad:
- image already shows a shrinking grocery basket;
- motion repeats the same shrinking grocery basket.

If `IMAGE_JOB` and `MOTION_JOB` overlap, keep only the stronger medium or redesign the scene.

No double explanation. No overlay just to make the scene move.

## Visual variety

Use different visual families when they improve clarity or rhythm:
- 3D story image;
- concrete example;
- before/after;
- side-by-side comparison;
- diagram;
- chart;
- worked calculation;
- timeline;
- static info card;
- cause/effect map;
- real asset;
- motion process.

Avoid repeating the same visual template in adjacent scenes unless the repetition itself is meaningful.

## Humans

Human characters are optional, never default.

Use humans only when reaction, decision, attention or consequence materially improves the scene.

Avoid:
- decorative person beside a chart;
- repeated person + question mark staging;
- several similar human scenes in a row.

When used, characters must belong to the approved premium stylized animation-film world — no blank faceless mannequins, photoreal people or corporate 3D avatars.

## Abstraction guard

Blocks, paths, bars and schemas are allowed only when they explain quickly.

If an abstract scene would be confusing without Voiceover:
- add a concrete anchor;
- simplify it;
- or replace it with a static example/diagram.

Avoid chains of abstract-only scenes when concrete images or examples improve recall.

## Full-frame Phase-B motion

Pure Remotion scenes may use the entire 1920×1080 canvas.

- do not force animation into the contained Flow window;
- place heading/icon within the full-frame composition/safe area;
- keep critical content at least about 64px from edges;
- no important element may be unintentionally cropped or clipped;
- use the available frame meaningfully.

For image + Remotion:
- Flow image itself stays contained and never fullscreen;
- Remotion overlays may extend beyond the image window only when they add a different explanatory job;
- remove overlays that merely restate the image.

## Flow image world

Use exactly:
`config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt`

Reference project:
`youtube/warum-dein-geld-verschwindet-images-only`

Do not redesign the image world for a new topic.

Flow images need visible storytelling/relationship, not catalog staging. They do not need to literally reenact every noun in the Voiceover; they should work as a visual memory aid.

## Thumbnail

Final YouTube cover must contain a short strong readable headline before export.

- normally 2–6 words;
- exact text must be readable;
- preferred: final layout owns typography;
- Flow may generate a very short headline only if exact;
- missing/wrong/unreadable headline = reject thumbnail.

## Motion source rules

Every animated production visual must:
- use `useCurrentFrame()`;
- use `interpolate()` and/or `spring()` for visible frame-driven motion;
- be deterministic;
- contain no TODO/placeholder;
- contain no `Math.random()`, `Date.now()`, timer, runtime fetch or remote runtime dependency;
- avoid CSS animation/transition as render motion;
- export the component named in `visual-index.json`.

## Existing motion stack routing — use before inventing new primitives

For YouTube finance motion, inspect the existing repository stack before writing a custom one-off animation.

Preferred order:
1. `src/design-system/YouTubeMotionExplainers.tsx` for reusable finance motion:
   - `MotionNumber`
   - `MotionComparisonBars`
   - `MotionLineChart`
   - `MotionMoneyFlow`
   - `MotionBeforeAfter`
2. central finance calculations from `src/finance/` when numbers are derived;
3. existing chart, diagram and finance namespaces from `src/design-system/index.ts`;
4. native Remotion HTML/SVG with `useCurrentFrame()`, `interpolate()`, `spring()` and deliberate easing;
5. `@remotion/paths` / `@remotion/shapes` when a route, curve or vector geometry itself carries meaning;
6. Recharts / existing PremiumCharts for real data-series visualization;
7. Three.js / React Three Fiber only when perspective, depth or spatial interaction materially improves understanding;
8. Lottie only as a supporting micro-animation;
9. motion blur, effects and transitions only as restrained polish after the core mechanism already works.

Do not use more tools just because they exist. Route to the simplest tool that creates the strongest explanatory result.

For any real animation, prefer a visible mechanism with distinguishable states:

`START → TRIGGER → ACTION → CHANGE/REACTION → RESULT → SHORT HOLD`

A fade-only text stack, three appearing cards or a progress bar is not a sufficient default animation concept.

## Standard patterns

Prefer reusable patterns when clear:
- BigNumber
- Comparison
- Percentage
- BarChart
- LineChart
- Timeline
- MoneyFlow
- ProcessSteps
- SimpleDiagram
- HighlightText
- Allocation
- Formula

These patterns may remain static if animation adds no explanatory value.

Standard motion presets:
- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Advanced motion only when a simpler static or animated pattern cannot communicate the idea equally well.

## QA

Before accepting each Phase-B scene:
1. Main idea readable in 1–2 seconds?
2. Was the visual planned together with the script beat?
3. What is the strongest static alternative?
4. Does motion add information, not decoration?
5. If hybrid: are image and motion jobs different and non-overlapping?
6. Would a diagram/example/comparison be stronger than this animation?
7. Does a person genuinely add explanatory value?
8. Does the scene repeat recent visual logic?
9. If pure Remotion: does it use full-frame space well?
10. Is any important element clipped/cropped?
11. If Flow: exact approved 3D world and contained image?
12. Are exact text/numbers handled by layout/Remotion?
13. Does the thumbnail have final readable text?
14. Are START, middle mechanism and RESULT visibly different?
15. Did the implementation reuse the existing motion/finance stack where appropriate before inventing a one-off primitive?

## Phase ownership

Phase 1 owns visual concept and production-ready motion source.

Run:
`npm run youtube:animation:validate -- youtube/<Projekt>`

then:
`npm run youtube:phase1:seal -- youtube/<Projekt>`

Phase 3 may retime sealed source to the real processed voiceover, but must not replace the approved explanatory idea without explicit re-planning.
