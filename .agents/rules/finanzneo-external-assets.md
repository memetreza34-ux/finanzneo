# FinanzNeo — External Asset Sourcing Rules

These rules apply when an agent searches, downloads or integrates third-party icons, B-roll, photos, SVGs or small support animations.

## Authority

`CLAUDE.md`, the active YouTube/Reel production standard and sealed Phase-1 motion remain authoritative. External assets may support the production but may not weaken gates or replace approved creative mechanisms.

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

Detailed source/license notes: `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`.

## Never auto-use these without per-item review

- SVG Repo
- Wikimedia Commons
- Openverse results
- Noun Project free assets
- Flaticon free assets
- Freepik free assets

Reason: per-item license or attribution requirements may vary.

## Search behavior

- Search only when a visual beat explicitly benefits from a real clip/photo/icon.
- Prefer literal search terms describing the real event, not generic `finance` searches.
- Prefer landscape >=1080p for YouTube Longform.
- Reject clips with dominant logos, watermarks, brand UI, readable personal data or inappropriate identifiable-person context.
- Never imply endorsement by a depicted person or brand.
- Reject footage that introduces a generic corporate-stock look inconsistent with FinanzNeo.

## Download behavior

- Remote URLs are discovery inputs only.
- Productive Remotion code must never fetch remote media at runtime.
- Download approved media locally before render.
- Do not commit API keys, access tokens or credentials.
- Pexels/Pixabay API keys may only come from environment variables / secret storage.
- Do not scrape or bulk-download libraries.
- One selected asset per requested slot, then QA before more downloads.

## License record

Every selected external asset must be written to the project's `external-assets-ledger.json` with source URL, asset page URL, creator when applicable, exact license, license URL, retrieval date, attribution requirement and local file path.

If the license cannot be confidently determined, do not use the asset.

## Motion boundary

External assets do not authorize creative changes to sealed `animation.tsx`.

If integrating a new asset requires changing the sealed Phase-1 motion mechanism:
- stop
- return to Phase 1
- modify the canonical source
- rerun YouTube motion validation
- reseal

Phase 3 may only integrate an approved external asset into the already-approved mechanism when the creative contract remains unchanged.

## Visual quality

Icons:
- normalize optical size and stroke weight
- keep one family per scene; prefer one family across the video
- semantic support only, not an icon wall

B-roll:
- generally short cutaways / pattern interrupts
- real movement must explain something
- avoid generic money-counting, handshakes, crypto imagery, luxury props or fake trading screens

Lottie:
- support cue only
- never the main explanation of a finance mechanism