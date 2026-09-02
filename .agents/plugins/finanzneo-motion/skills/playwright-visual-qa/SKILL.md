---
name: playwright-visual-qa
description: Uses the official Playwright CLI as a token-efficient browser QA layer for FinanzNeo Remotion Studio previews, representative scene frames, layout consistency, safe zones, header/icon alignment and visible animation quality.
---

# FinanzNeo Playwright Visual QA Skill

## Goal

Catch visual defects that code validators cannot reliably see.

This skill is for **visual verification**, not for replacing Remotion render QA and not for changing the reel concept.

The main targets are:

- header/icon alignment and optical consistency
- one-line vs two-line headline positioning
- visual safe-zone compliance
- caption overlap
- object centering and spacing
- hero-object scale
- excessive empty space
- visible start / action / result states
- animation readability at representative frames
- accidental UI/card/flowchart regressions
- clipping, off-screen objects and weak result holds

## Tool choice

Use the official Playwright CLI, not Playwright MCP, for normal FinanzNeo QA.

Reason: this is a coding-agent workflow with a large repository and short browser inspection loops. CLI output is more token-efficient and does not load a large MCP tool schema.

Preferred invocation:

```bash
npx -y @playwright/cli@latest --help
```

For the local Studio, prefer the installed Chrome browser when available:

```bash
npx -y @playwright/cli@latest open http://127.0.0.1:3000 --browser=chrome
```

Do not run `playwright-cli install --skills` as the Antigravity integration mechanism. FinanzNeo already provides this Antigravity-specific skill under `.agents/plugins/`.

## Authority

Read in this order:

1. `CLAUDE.md`
2. target reel `03-szenen/scene-index.json`
3. target reel `05-projektdateien/visual-qa.md`
4. `.agents/plugins/finanzneo-motion/rules/playwright-qa.md`
5. this skill

Higher sources win on conflict.

## Standard workflow

### 1. Start Remotion Studio

Run the project Studio on a known local port, normally:

```bash
npm run studio -- --port=3000
```

Keep the Studio process alive while QA runs.

### 2. Open with Playwright CLI

Use a named QA session where supported and open the local Studio.

```bash
npx -y @playwright/cli@latest open http://127.0.0.1:3000 --browser=chrome
```

Use `snapshot` to understand the current UI state and `screenshot` for the actual visual review.

### 3. Select the exact production composition

Do not inspect a template/demo composition when the task targets a real reel.

Verify the composition ID/path against the reel's current Phase-3 manifest or production composition.

### 4. Inspect representative states

For **every image scene**, inspect at least one stable frame.

For **every animation scene**, inspect at least:

```text
START
TRIGGER / early action
MID-MECHANISM
NEAR RESULT
FINAL RESULT HOLD
```

Use the frame checklist in the target reel's `visual-qa.md` when present.

### 5. Capture screenshots

Take screenshots of the requested states.

Screenshots are QA artifacts only. Do not use them as final reel assets.

### 6. Review visually

Check the rendered pixels, not only DOM/accessibility state.

A screenshot review must answer:

- Is the header group visually centered?
- Is the icon optically the same size as other scene icons?
- Is icon-to-first-line spacing consistent?
- On two-line headlines, is the icon anchored to the first line rather than the whole text block?
- Is the main action large enough to notice immediately?
- Is the visual content inside Y320–1400?
- Is the caption area clear?
- Are important objects accidentally clipped?
- Does the scene use the black background correctly?
- Is the composition balanced, or is there avoidable empty space?
- For animation: can the mechanism be understood from the screenshots without relying on long labels?
- Is the final result held in a readable, uncluttered state?

### 7. Fix source, then repeat

When a defect is found, fix the canonical source:

- central design system for global header/icon/layout issues;
- target `animation.tsx` for scene motion/composition issues;
- Flow source/prompt only when the user-provided image itself is wrong;
- never patch a rendered screenshot.

Repeat the representative-frame review after every meaningful visual fix.

## Header / icon acceptance

Across scenes, reject when:

- visible icon sizes noticeably differ despite the same semantic role;
- icon baseline/vertical center jumps between comparable one-line scenes;
- a two-line title pulls the icon downward;
- icon-to-text gap becomes much larger on wrapped titles;
- header group is visibly off-center;
- text gets shrunk unnecessarily instead of using the allowed second line.

## Animation acceptance

Reject when:

- hero motion is too small to perceive;
- the main explanation looks like three cards, UI panels or a progress bar;
- only camera movement makes the frame different;
- start and result screenshots look nearly identical despite an explanatory animation beat;
- motion paths make objects collide unintentionally or cross safe zones;
- supporting Lottie/paths/blur dominate the real mechanism;
- objects appear visually mis-scaled relative to each other;
- the result state is visually busier than the mechanism.

## Screenshot discipline

Use screenshots at meaningful checkpoints rather than capturing every frame.

For a normal 6-animation Reel, around 25–35 representative screenshots is enough for a thorough pass.

Do not flood the repository with QA screenshots. Store temporary screenshots outside production asset folders and remove them after review unless a specific regression fixture is intentionally retained.

## Browser safety

- local Studio only by default;
- do not log into unrelated websites;
- do not upload user assets to external sites;
- do not use Playwright to bypass repo/Phase gates;
- no Playwright browser state is part of the final production output.

## Completion gate

Playwright QA is PASS only when:

1. all required representative states were inspected;
2. header/icon consistency passes;
3. no important visual crosses safe zones;
4. every animation clearly changes from start to mechanism to result;
5. no major spacing/centering/clipping defect remains;
6. any discovered source defects were fixed and rechecked.

This PASS complements, but never replaces, `reel:validate`, Phase-3 preflight and post-render QA.
