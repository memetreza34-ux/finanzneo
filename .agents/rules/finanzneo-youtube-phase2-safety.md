# FinanzNeo — YouTube Phase 2 Safety and Performance

These rules apply when Antigravity is asked to open, refresh, inspect or prepare Phase 2 of a YouTube Longform project.

`CLAUDE.md` remains the highest project authority. This file only narrows Phase-2 scope; it does not weaken any validator, seal or Phase-3 requirement.

## Fast-path principle

Phase 2 is an asset handoff, not a code-analysis phase.

When the user asks to enter/open/update Phase 2, start with:

```text
youtube/<Projekt>/PHASE-2-START-HERE.md
youtube/<Projekt>/phase2-manifest.json
```

Then access only the exact prompt/inbox/audio paths listed there.

## Do not recursively inspect Phase-1 motion during Phase 2

Unless the user explicitly requests a Phase-1 correction or a concrete blocker points there, do not recursively read or analyze:

- `04-visuals/EINZELNE-VISUALS/`
- `animation.tsx`
- `remotion.md`
- `06-projektdateien/visual-plan.md`
- `06-projektdateien/remotion-plan.md`
- `src/`
- unrelated Reel or YouTube project folders

## Do not run heavy setup just to open Phase 2

Do not run these merely to enter or refresh Phase 2:

- `npm install`
- full `npm run validate`
- Remotion bundle
- smoke render
- production render

These commands remain available when a later gate actually requires them.

## Never optimize by deleting production material

Performance improvements must not delete, merge away, rewrite or bypass:

- Phase-1 `animation.tsx`
- Motion-V3 metadata
- image prompts
- research/script files
- validators or gates

The Phase-2 fast path is achieved by reading less, not by removing production truth.
