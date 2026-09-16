# FinanzNeo YouTube — Phase 3

Use this workflow when integrating a completed YouTube Longform Phase 2 and producing the final render.

## Start gate

Always begin with:

```bash
npm run youtube:ready -- youtube/<Woche>/<Thema>
```

If readiness fails, report the exact blockers and stop. Do not fabricate missing Flow images, voiceover, timings, seals or assets.

## Read order

1. `youtube/<Woche>/<Thema>/04-projekt/visual-index.json`
2. `youtube/<Woche>/<Thema>/04-projekt/animation-seal.json`
3. `youtube/<Woche>/<Thema>/04-projekt/external-assets-manifest.json` when present
4. `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`
5. `.agents/rules/finanzneo-external-assets.md`
6. final user images, final voiceover and real word timings

## External assets — safe integration sequence

For every manifest slot:

```text
read slot
→ decide whether support is still useful with final audio/images
→ check existing local asset
→ if missing, search only approved sources
→ inspect exact item/license
→ reject if quality/license/person/logo context is unsafe
→ download exactly the selected item locally
→ write ledger entry
→ integrate only in declared role
→ visual QA
```

Do not bulk-download alternatives. One candidate per slot at a time.

## Allowed Phase-3 adjustments

External support may receive technical treatment only:

- trim / retime
- crop / scale
- mask / corner radius when composition needs it
- controlled darkening/desaturation/color matching
- local blur/depth treatment
- safe audio removal from stock clips unless explicitly needed
- local SVG optical-size/stroke normalization
- small Lottie timing adjustments

These changes must not alter the sealed creative mechanism.

## Forbidden

- new unplanned asset slots
- replacing an approved Flow/Remotion main beat with stock footage
- changing sealed `animation.tsx` to accommodate a found asset
- runtime web requests
- remote media URLs inside productive Remotion
- committing API keys/tokens
- using unclear-license media
- using clips with watermarks or dominant unapproved branding
- using identifiable people in misleading negative financial contexts

## Fallback

If no candidate passes QA:

```text
leave optional slot empty
→ keep approved primary visual
→ continue production
```

A missing optional external asset is not a Phase-3 blocker.

## Attribution

Before final render/upload package completion:

- verify every used external file has a ledger entry,
- carry any mandatory attribution into the final YouTube description/source package,
- remove unused downloaded files or mark them `unused` in the ledger,
- confirm no attribution-required asset is omitted from credits.

## Finish

Integrate sealed motion, final images, audio, captions, approved SFX and approved external support. Then run the normal validators, typecheck, render QA and export.

The result must still look like one FinanzNeo production, not a stock-footage compilation.
