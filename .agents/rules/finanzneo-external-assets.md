# FinanzNeo — External Asset Sourcing Rules

These rules apply when an agent plans, searches, downloads or integrates third-party icons, B-roll, photos, SVGs or small support animations.

## Authority

`CLAUDE.md`, the active YouTube/Reel production standard and sealed Phase-1 motion remain authoritative. External assets may support the production but may not weaken gates, replace approved creative mechanisms or create a new visual language.

Detailed source/license notes: `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`.

## Phase ownership

### Phase 1 — plan slots, do not randomly decorate

Phase 1 may declare optional external-asset slots only after the script beat, viewer change and main visual mechanism are defined.

Each planned slot must state:

- `slotId`
- relevant `visualIds`
- purpose / viewer value
- allowed asset type (`broll`, `icon`, `photo`, `lottie`)
- preferred source(s)
- search terms or icon names
- maximum role/duration when relevant
- how the asset may be integrated without changing the main mechanism
- whether the slot is optional

Canonical project files:

```text
06-projektdateien/external-assets-plan.md
06-projektdateien/external-assets-manifest.json
04-visuals/external-assets/external-assets-ledger.json
```

A planned slot is permission to evaluate an asset, not a requirement to use one. If no asset passes quality/license QA, leave the slot empty.

Phase 1 must keep the primary visual understandable without relying on a specific stock asset that has not yet been selected.

### Phase 2 — no heavy external-asset work

Do not make Phase 2 slower by searching or downloading stock media. Phase 2 remains focused on user Flow images, one final voiceover and real word timings.

### Phase 3 — fill only approved slots

After `youtube:ready` succeeds and the Phase-1 seal is verified, Phase 3 may:

1. read `external-assets-manifest.json`,
2. consider only slots declared there,
3. check whether an already-local asset exists,
4. otherwise search only approved sources,
5. select at most one best asset per requested slot before QA,
6. download the chosen file locally,
7. write/update the ledger entry,
8. integrate it only within the declared purpose,
9. run visual/render QA.

Phase 3 must never create new asset slots merely to make the edit busier.

## Approved default sources

### B-roll / photos
1. Pexels
2. Pixabay
3. Coverr after manual license check
4. Mixkit only when the specific item uses the commercial Free License
5. Unsplash for still photos only

### Icons
1. Lucide
2. Phosphor
3. Heroicons
4. Tabler

### Small support animation
1. LottieFiles Free Animations after checking the individual license
2. Pixabay animation/video fallback

## Never auto-use these without per-item review

- SVG Repo
- Wikimedia Commons
- Openverse results
- Noun Project free assets
- Flaticon free assets
- Freepik free assets

Reason: per-item license or attribution requirements may vary.

## Search behavior

- Search only when a manifest slot explicitly benefits from a real clip/photo/icon.
- Prefer literal search terms describing the real event, not generic `finance` searches.
- Prefer landscape >=1080p for YouTube Longform.
- Reject clips with dominant logos, watermarks, brand UI, readable personal data or inappropriate identifiable-person context.
- Never imply endorsement by a depicted person or brand.
- Reject footage that introduces a generic corporate-stock look inconsistent with FinanzNeo.
- Never use search results directly as render URLs.

## Download behavior

- Remote URLs are discovery inputs only.
- Productive Remotion code must never fetch remote media at runtime.
- Download approved media locally before render.
- Store project media below `04-visuals/external-assets/`.
- Do not commit API keys, access tokens or credentials.
- Pexels/Pixabay API keys may only come from environment variables / secret storage.
- Do not scrape or bulk-download libraries.
- One selected asset per requested slot, then QA before more downloads.

## License record

Every selected external asset must be written to the project's `external-assets-ledger.json` with at least:

```text
assetId
slotId
visualIds
localFile
source
sourceUrl
assetPageUrl
creator
license
licenseUrl
retrievedAt
commercialUseChecked
attributionRequired
attributionText
qaStatus
notes
```

If the license cannot be confidently determined, do not use the asset.

If attribution is required, Phase 3 must ensure the required attribution is carried into the final description/source package before render completion.

## Sealed-motion boundary

External assets do not authorize creative changes to sealed `animation.tsx`.

Allowed technical integration when the creative contract remains identical:

- crop / scale / mask
- local color matching / darkening
- placement behind or beside already-planned elements
- replacing a generic icon placeholder with the planned local SVG icon
- inserting a planned short B-roll cutaway between existing beats
- timing a small planned support cue to the final voiceover

Not allowed after seal:

- changing viewerChange
- changing the main mechanism
- replacing a Flow/Remotion explanation with stock footage
- redesigning layout around a found clip
- changing a data explanation into B-roll
- adding a new explanatory path or new scene because stock media was found

If integrating a new asset requires changing the sealed Phase-1 motion mechanism:

```text
STOP
→ return to Phase 1
→ modify canonical source/plan
→ rerun YouTube motion validation
→ reseal
```

## Visual quality

### Icons
- normalize optical size and stroke weight
- keep one family per scene; prefer one family across the video
- semantic support only, not an icon wall
- local SVG only; no new dependency merely to obtain icons

### B-roll
- generally short cutaways / pattern interrupts
- real movement must explain something
- avoid generic money-counting, handshakes, crypto imagery, luxury props or fake trading screens
- if the clip visibly lowers the premium visual quality, leave the slot empty

### Lottie
- support cue only
- never the main explanation of a finance mechanism
- local file only after individual license check

## Fail-safe rule

External assets are **optional enhancement**. A missing, low-quality or unclear-license asset must never block the entire video if the primary planned visual works without it.

The safe fallback is always: keep the approved Phase-1 visual mechanism unchanged and leave the optional slot unused.
