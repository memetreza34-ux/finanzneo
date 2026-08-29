# FinanzNeo — Playwright Visual QA Rules

## Purpose

Playwright is a visual inspection layer for Remotion Studio previews and rendered representative states.

It does not own reel content, animation concepts, image generation, voiceover or final rendering.

## Mandatory use

Before a production Reel is considered visually ready, Antigravity should use Playwright QA when local Studio access is available.

At minimum inspect:

- one stable frame from every image scene;
- five representative states from every animation scene: start, trigger, mid-mechanism, near-result, final result hold;
- every two-line headline at least once;
- at least one scene using each distinct header icon family present in the reel.

## Hard checks

Reject visual QA when any of the following is clearly visible:

- icon visibly larger/smaller than peer icons without semantic reason;
- icon vertical position shifts because a title wraps;
- wrapped title creates an excessive icon/text gap;
- header group is visibly off-center;
- text/icon/visual enters forbidden header or caption regions;
- main visual is too small compared with unused black space;
- important objects are clipped during motion;
- animation result cannot be distinguished from its start state;
- the animation regresses into cards, dashboard, flowchart or progress-bar language;
- Lottie/paths/motion blur becomes more noticeable than the financial mechanism;
- result hold is unreadable or cluttered.

## Safe zones

Use the central V5 contract as the source of truth:

- Header Y = 154
- Visual content = Y320–1400
- Captions = bottom 340

Do not invent local offsets to make one screenshot pass. Fix central layout or canonical scene source.

## Visual consistency

Compare scenes against each other, not only in isolation.

Pay special attention to:

- optical icon size
- icon-to-text distance
- title baseline
- vertical rhythm
- hero scale
- object spacing
- black-space balance
- caption distance from visual content

A technically valid scene can still fail when it is visibly inconsistent with adjacent scenes.

## Animation review

Representative screenshots must prove a real state change:

```text
START ≠ MID-MECHANISM ≠ RESULT
```

Camera movement alone is insufficient.

A result state should explain the spoken beat even when viewed as a still.

## Fix ownership

When Playwright finds a problem:

- global recurring defect → fix `src/design-system` / central brand tokens or components;
- one animation defect → fix the canonical scene `animation.tsx`;
- bad user image → report exact filename and reason; do not secretly replace it;
- caption timing/text defect → fix caption/timing source, not the screenshot;
- never modify a rendered artifact to hide a source problem.

## Temporary artifacts

Playwright screenshots, snapshots and traces are temporary QA material.

Do not commit `.playwright-cli/`, Playwright profiles, traces or bulk screenshots unless a specific regression fixture is intentionally approved.

## Failure behavior

A visible defect is a QA failure even if TypeScript, bundle and smoke render are green.

Do not weaken layout/animation validators to silence a Playwright finding.

Fix the visual source and rerun the affected representative frames.
