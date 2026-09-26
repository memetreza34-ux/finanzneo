---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform with content-first visual selection, balanced image/image+Remotion/Remotion use, safe full-frame Phase-B motion and the locked FinanzNeo 3D world.
---

# FinanzNeo YouTube Motion Director V5 Balanced Hybrid

## Goal

Make finance easy to understand and easy to remember. Choose the visual form from the spoken point, not from a preferred tool.

> **Clarity first. Memory aid second. Tool choice third.**

## Authority

Read in this order:
1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-PRODUCTION-MODES.md`
4. `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`
5. `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`
6. `docs/YOUTUBE-MOTION-V4-SIMPLE.md`
7. `config/finanzneo-youtube-visual-system.json`
8. target `04-visuals/visual-index.json`

Reel rules do not automatically apply to YouTube Longform.

## Scene granularity

One visual beat carries one dominant idea. A Flow image normally covers 1–2 short Voiceover sentences. Split multi-idea beats.

## Phase-B decision — mandatory

For every beat ask:

1. What must the viewer understand or remember?
2. Is a concrete 3D image the strongest memory aid?
3. Would image + Remotion explain it better than either alone?
4. Is pure Remotion clearer because the point is mainly number/process/change?
5. Is a real asset required?

Use:
- **image** for concrete situation, emotion, cause/effect or memorable everyday context;
- **hybrid** for concrete image + exact temporal explanation;
- **animation/data** for pure number/process/change when no image adds value;
- **real-asset** for real sources/documents/websites/products.

Do not default to Remotion just because it is available.

## Balanced Hybrid guidance

No hard quota, but typical Phase-B target:
- 25–40% image-only;
- 30–50% image + Remotion;
- 20–35% pure Remotion.

If pure Remotion starts dominating while strong images or hybrids would improve comprehension or memory, re-plan the storyboard.

## Humans

Human characters are optional, never default.

Use humans only when reaction, decision, attention or consequence materially improves the scene.

Avoid:
- decorative person beside a chart;
- repeated person + question mark staging;
- several similar human scenes in a row.

Soft guidance: roughly no more than 40% human scenes unless the story clearly needs more.

When used, characters must belong to the approved premium stylized animation-film world — no blank faceless mannequins, photoreal people or corporate 3D avatars.

## Abstraction guard

Blocks, paths, bars and schemas are allowed only when they explain quickly.

If an abstract scene would be confusing without Voiceover:
- add a concrete anchor;
- simplify it;
- or use image + Remotion.

Avoid chains of abstract-only scenes when a concrete or hybrid scene would improve recall.

## Full-frame Phase-B motion

Pure Remotion scenes may use the entire 1920×1080 canvas.

- do not force animation into the contained Flow window;
- place heading/icon within the full-frame composition/safe area;
- keep critical content at least about 64px from edges;
- no important element may be unintentionally cropped or clipped;
- use the available frame meaningfully.

For image + Remotion:
- Flow image itself stays contained and never fullscreen;
- Remotion overlays may extend beyond the image window and use the full scene;
- plan image and overlay as one composition.

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

Advanced motion only when a simpler pattern cannot communicate the idea equally well.

## QA

Before accepting each Phase-B scene:
1. Main idea readable in 1–2 seconds?
2. Is this the best of image / image+Remotion / pure Remotion / real asset?
3. Does a person genuinely add explanatory value?
4. Is the scene too abstract?
5. Does motion explain rather than decorate?
6. If pure Remotion: does it use full-frame space well?
7. Is any important element clipped/cropped?
8. If Flow: exact approved 3D world and contained image?
9. Are exact text/numbers handled by layout/Remotion?
10. Does the thumbnail have final readable text?

## Phase ownership

Phase 1 owns visual concept and production-ready motion source.

Run:
`npm run youtube:animation:validate -- youtube/<Projekt>`

then:
`npm run youtube:phase1:seal -- youtube/<Projekt>`

Phase 3 may retime sealed source to the real processed voiceover, but must not replace the approved explanatory idea without explicit re-planning.
