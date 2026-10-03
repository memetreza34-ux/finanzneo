---
name: finanzneo-reel
description: Safely executes or reviews FinanzNeo Reel production while preserving the three-phase contract, V9 explanatory image world, Finance Motion Library (library-best-fit or custom-build), legacy Motion Core V1, Motion Art Direction, controlled Lottie/SFX enhancement, Playwright visual QA, sealed animations, pure-black canvas and completion gates.
---

# FinanzNeo Reel Skill

## Authority

Read in this order:

1. `CLAUDE.md`
2. target `03-szenen/scene-index.json`
3. `docs/3-PHASEN-WORKFLOW.md`
4. `docs/PHASE-3-COMPLETION-GATE.md`
5. `reels/PRODUKTIONSSTANDARD.md`
6. `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
7. `.agents/rules/finanzneo-reel-safety.md`
8. `src/finance-motion/index.tsx` (`FINANCE_MOTION_REGISTRY`)
9. `src/motion/README.md` + `src/motion/mechanics.ts` (Motion-Core-V1 Reels and shared primitives)
10. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
11. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
12. `.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md`
13. `.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md`
14. `.agents/plugins/finanzneo-motion/skills/motion-core-curator/SKILL.md`
15. `.agents/plugins/finanzneo-motion/rules/lottie-motion.md`
16. `.agents/plugins/finanzneo-motion/rules/sound-design.md`
17. `.agents/plugins/finanzneo-motion/rules/playwright-qa.md`

`CLAUDE.md` wins on conflicts.

## Three phases

### Phase 1 — ChatGPT / motion authoring

Owns research, beginner-friendly scene-by-scene script, Flow prompts, headers/icons, captions and the final production-ready `animation.tsx` for every animation scene.

For every animation scene, Phase 1 first derives the mechanism from the spoken point, then checks the Finance Motion Library (`src/finance-motion`) for a genuine best fit: if it fits, parametrize it (`library-best-fit`); if not, build a custom animation (`custom-build`). After implementation, the Motion Art Director checks staging before Playwright visual QA.

Phase 1 may use the FinanzNeo Motion Stack while authoring:

- Finance Motion Library mechanics from `src/finance-motion`
- `src/motion` Physical-Primitives + `FN_MOTION` where a scene needs concrete objects
- Remotion / HTML / CSS primitives
- React Three Fiber / Three.js where spatial depth genuinely helps
- Lottie Creator MCP for focused support motion
- frame-accurate SFX planning

All final animation choices and local support assets must be committed before the animation seal.

### Phase 2 — user

Owns final Flow images, final voiceover and real word timings.

### Phase 3 — configured executor

Integrates only. It must not invent missing Phase-1 animation or substitute missing Phase-2 assets.

If `phase3Executor` names another executor, do not take over Phase 3.

After the animation SHA is sealed, Phase 3 may not invent a new Lottie concept, alter the physical mechanism or generate replacement animation code. Creative redesign returns to Phase 1.

## Visual Beat timing

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

For new reels, do not choose a scene count first. Parse the voiceover into spoken thoughts, assign one visible beat per thought, then group beats into scenes. A sentence may receive its own Flow image. If one sentence contains two actions, examples, a comparison or a before/after change, split it into multiple visible beats when that improves comprehension.

Static image beats should normally last about 1.8–3.4 seconds and must not remain unchanged beyond 4.5 seconds once the message is already understood. Multiple consecutive image scenes are allowed when each one advances meaning. Camera push, zoom or parallax alone does not reset the beat.

Animation scenes may be longer only when the visible state keeps advancing with the voiceover. Final cuts follow real word timings from Phase 2, never equal-length scene padding. The 60/40 image-animation mix is guidance, not a quota.

## V9 image world

New Flow prompts use `finanzneo-stylized-3d-animated-black-v9`:

- real-life explanatory situations instead of abstract finance icon arrangements
- recognizable, believable object construction and proportions
- semi-realistic material/detail structure, but clearly stylized 3D and never photorealistic
- premium clean presentation
- deep black background mandatory
- content/clarity before object count; no fixed supporting-object quota
- short German labels when they materially improve instant understanding
- emerald positive, ivory/soft gray neutral, subtle gold money/value, red-orange warning/cost
- individually written complete prompts
- no stock-photo/product-photo look, dashboard/app UI, flowchart, tiny boxes, microchip language, unreadable minidiorama or clutter

If a brand/logo/app appears, keep it recognizable but stylized in the same animated world. Never paste a flat real-world logo, screenshot or photorealistic branded UI into the scene.

Antigravity does not generate the user's final Flow images. Missing exact image = stop and report filename.

## Pure-black Reel background

The Remotion canvas is always static `#000000` through central `FinanceBackground`.

Never use or import `FNBgAurora`, `FNBgParticles`, `FNBgGrid`, `FNBgRadial`, particle fields, moving grids, aurora, glow fields, decorative background gradients or animated background elements.

Do not use background motion to make an otherwise empty scene pass visual QA.

## Professional Motion Stack

The workspace plugin `.agents/plugins/finanzneo-motion/` extends Antigravity with:

- official Remotion Agent Skills bootstrapped locally at workspace start;
- `remotion-director` for content-first real-world motion choreography;
- `src/finance-motion` Finance Motion Library as the default mechanism source for new Reels;
- `src/motion/mechanics.ts` as mechanism registry for legacy Motion-Core-V1 Reels;
- `mechanic-selection` for semantic mechanism routing (anti-repetition applies to Motion-Core-V1 Reels);
- `src/motion` for Physical-Primitives, Stage, timing and springs;
- `motion-art-director` for composition, scale, material, depth, perspective, camera and result-state polish;
- `motion-core-curator` for controlled primitive/mechanic promotion and de-duplication across Reels;
- Lottie Creator MCP + `lottie-motion` for controlled vector support animation;
- ElevenLabs `sound-effects` Agent Skill bootstrap for optional SFX generation;
- `sound-design` for frame-synchronized sound planning;
- `playwright-visual-qa` for visual Remotion Studio inspection of representative frames, layout, icons and safe zones;
- repo validation through `npm run validate:antigravity-motion`.

Remotion remains the timeline/render authority.

### Finance Motion Library — mandatory routing for new animations

New Reels carry `finanzneo-phase1-hybrid-motion-v2` and `finanzneo-finance-motion-library-v1`. For every animation scene:

1. derive the finance statement and the visible understanding goal;
2. derive the best main mechanism from the content, before looking at any tool;
3. check `FINANCE_MOTION_REGISTRY` in `src/finance-motion/index.tsx` for a genuine semantic best fit — `tier: 'core'` first; a `tier: 'situational'` hit is a signal that a Flow image or data scene may explain better (see its `preferInstead`);
4. fit: set `implementationDecision: library-best-fit`, `financeMotionId`, `libraryFitReason` and a concrete `parameterPlan`; import from the `src/finance-motion` folder (never a `direction-v2*` file or a `…V1` export); pass amounts as numbers, every value comes from the spoken point;
5. no fit: set `implementationDecision: custom-build`, `financeMotionId: none` and a concrete `customReason`; build a full custom animation;
6. document `MOTION_SOURCE`, `FINANCE_MOTION_ID`, `MECHANIC_ID`, `FOCAL_PATH`, `PRIMARY_ACTION`, `CAMERA_ROLE`, `PAYOFF`, both narratives and `RESULT_HOLD_FRAMES >= 15` in `animation.tsx`;
7. run Motion Art Direction;
8. run Playwright Visual QA.

The library is a toolbox, **not a forced menu**. A library mechanic may repeat, even inside one Reel, when the finance logic is the same and real content parameters change. Never pick a library mechanic only because it exists. `PremiumPhysicalStage` and the Physical-Primitives are optional. Phase 3 never switches between library and custom on its own.

A promising custom mechanic may be marked `libraryPromotionCandidate: true`.

### Legacy: Motion Core V1 routing

Reels already created with `finanzneo-motion-core-v1` keep this route and are not migrated:

1. read all animation scenes in the target Reel;
2. read `src/motion/mechanics.ts`;
3. derive the finance statement and visible understanding goal;
4. derive the physical cause/effect before choosing tools;
5. assign one validator-compatible lower-kebab-case `MECHANIC_ID`;
6. record `HERO_OBJECT`, `PRIMARY_ACTION`, `MOTION_AXIS` and `RESULT_TYPE`;
7. compare against the Reel mechanic ledger;
8. pass the anti-repetition gate;
9. check `src/motion` for suitable canonical primitives and timing;
10. implement the scene;
11. run Motion Art Direction;
12. run Playwright Visual QA.

The ledger shape is:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

The same `MECHANIC_ID` must not occur twice inside one Motion-Core-V1 Reel. If at least three central ledger dimensions match another animation, redesign the physical explanation before coding.

Inside a Motion-Core-V1 Reel, a different color, label, icon, Lottie, camera move, mirroring or speed is **not** a new mechanism.

`src/motion` is a technical house-style core, **not a fixed creative template menu**. The content still decides the mechanism.

A single strong physical Hero may be enough. Do not add support objects merely to satisfy an object count. Support exists only when it makes cause/effect clearer.

When a scene uses concrete objects, prefer semantic primitive names:

- `PhysicalBanknote` for banknote/value unit
- `PhysicalInvoice` for invoice/document
- `PhysicalAccount`
- `PhysicalCoinStack`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`

`PhysicalBill` remains compatibility-only naming inside Motion Core V1. Old Physical exports through `src/brand` / `src/design-system` are Legacy compatibility and must not be used as the canonical source in new Motion-Core Reels.

Scene-specific physical objects are allowed when genuinely needed. If the same semantic local object proves reusable across at least two different scenes/Reels, route a curation pass through `motion-core-curator` rather than copy-pasting it.

Old `FinanceMotionLab*`, experiment compositions and legacy Reel animation styles may provide technical reference only; they are not production house-style authority.

### Animation language

Every animation should read as:

```text
START
→ TRIGGER
→ PHYSICAL ACTION
→ REACTION
→ RESULT
→ RESULT HOLD
```

Prefer concrete cause/effect and a clear focal path. Aim for coordinated motion with different character rather than one global progress value controlling everything identically — but never add channels only to reach a count.

Camera movement, Three.js and Lottie are support tools. None of them may replace the explanatory mechanism.

### Motion Art Direction

After code/mechanism correctness, use `motion-art-director` to review:

- hero scale and visual dominance
- object proportions
- material readability
- contact shadows / grounding
- depth and perspective consistency
- optical centering and negative space
- camera support
- RESULT HOLD as the cleanest state

For new Reels and Motion-Core-V1 Reels, record the real pass in:

```text
05-projektdateien/visual-qa.md
MOTION_ART_DIRECTION=PASS
```

Do not set PASS before actual representative-frame review.

### Lottie

Use Lottie only when it materially improves compact vector motion such as calendar/page flip, confirmation/check, restrained warning accent, money-transfer accent, chart stroke/target reveal or semantic icon acting.

Never use generic Lottie cards/templates as the full scene when a real-world Remotion mechanism is clearer.

### Sound

Every animation is evaluated for a small number of purposeful SFX cues tied to visible frame events.

Voiceover remains dominant. Final sound files are local under `public/sounds/`; remote/runtime sound dependencies are forbidden.

If ElevenLabs generation is unavailable, preserve the cue plan and report missing final sound assets. Never use placeholder beeps.

### Playwright visual QA

Use the FinanzNeo `playwright-visual-qa` skill with the official Playwright CLI for the local Remotion Studio.

Default tool path:

```bash
npx -y @playwright/cli@latest
```

For each production Reel:

- inspect at least one stable frame from every image scene;
- inspect START, TRIGGER, MID-MECHANISM, NEAR RESULT and FINAL RESULT HOLD for every animation scene;
- compare one-line and two-line headers across scenes;
- compare optical icon size, icon-to-text gap and vertical alignment;
- inspect safe-zone boundaries, clipping, centering, hero scale and dead space;
- for a new mechanism, changed library mechanic, changed Motion Core or representative pilot, prefer a full render when practical;
- treat visible inconsistency as QA failure even if TypeScript/bundle/smoke are green.

Playwright screenshots and traces are temporary QA artifacts, not production assets.

New Reels scaffold `05-projektdateien/visual-qa.md`. After the real review, every scene row must be PASS and the file must contain exactly:

```text
PLAYWRIGHT_VISUAL_QA=PASS
```

`reel:phase3:preflight` blocks the production render unless both Motion Art Direction and Playwright Visual QA are PASS. Never edit these markers only to satisfy the gate.

## Animation ownership

For every animation scene:

- use exact `animationSourceFile`
- use exact `animationExport`
- preserve SHA-256 seal from `reel:ready`
- bind through the production composition/customAnimations mapping
- missing binding = hard failure
- Phase 3 may not replace or simplify the source

A `library-best-fit` scene must use a mechanic registered in `FINANCE_MOTION_REGISTRY` and import it from `src/finance-motion`. For a Reel carrying `finanzneo-motion-core-v1`, canonical Physical-/Motion-Primitives come from `src/motion`; importing the old core primitives from `src/design-system` fails the Motion-Direction gate.

No placeholders, debug rectangles, `Math.sin`/`Math.cos` QA-wiggle or motion whose only purpose is frame difference.

## Layout V5

Central `REEL_STYLE` only:

- Header Y154
- Header 56 px, minimum 50 px, max 2 lines
- Icon 34 px with optical normalization
- two-line title keeps icon anchored to the first line
- Visual Y320–1400
- captions bottom340, max 2 lines
- transition 3 frames
- header plain #FFFFFF text + simple semantic line icon
- no capsule/chip/pill/panel/forced uppercase
- `AnimationStage` hard-clips visible animation content to Y320–1400
- SourceNote must not overlap a two-line caption

## Completion sequence

```bash
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
# integrate every sealed scene + final Phase-2 assets
# run Motion Art Direction + Playwright Visual QA and write PASS markers
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
```

`reel:phase3:preflight` blocks new Reels and Motion-Core-V1 Reels when `MOTION_ART_DIRECTION=PASS`, `PLAYWRIGHT_VISUAL_QA=PASS` or scene-level QA PASS rows are missing.

`reel:render` creates the candidate, runs post-render QA and only after PASS releases the final MP4 and triggers the final export workflow. A direct `reel:export` call is reserved for a controlled re-export of an already validated final MP4.

Final `06-export/` uses exactly one social caption: `caption-universal.txt`.

QA must reject:

- black/empty visual core
- caption-only/header-only scene
- missing image
- missing animation binding
- animation with no real motion
- animation that does not explain its beat
- a library mechanic used although it does not explain the spoken point
- library parameters that are template filler instead of the scene's real values
- repeated physical mechanism disguised by color/text/camera changes inside a Motion-Core-V1 Reel
- support objects added only to satisfy a quota
- Motion-Core-V1 Reel animation that bypasses `src/motion`
- missing Motion Art Direction PASS on a new Reel
- missing Playwright Visual QA PASS on a new Reel
- visible header/icon inconsistency found by Playwright QA
- safe-zone/clipping/centering defects found by Playwright QA
- non-black/decorative background
- missing required voiceover/audio
- missing referenced SFX asset when the approved plan marks it required
- wrong dimensions/timeline

An MP4 file by itself is never proof of completion.

## Repository safety

- never work on `main`
- never merge/force-push/delete previous work without explicit instruction
- never weaken tests/validators/locks to make a reel pass
- fix actual content/integration errors instead
