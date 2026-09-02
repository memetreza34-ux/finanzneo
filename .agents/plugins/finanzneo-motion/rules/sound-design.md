# FinanzNeo — Sound Design Rules

These rules apply to all Reel sound effects authored or integrated by Antigravity.

## Core rule

Voiceover is always dominant. SFX exists to make visible actions feel physical, understandable and polished.

## Approved workflow

```text
visible event in canonical animation
→ approved cue in reel sound plan
→ generate/select one short effect
→ save locally
→ integrate at exact frame
→ mix under voiceover
→ render QA with audio
```

Do not generate a pile of sounds first and then look for places to use them.

## Cue density

Prefer 2–4 meaningful effects per animation scene.

More is acceptable only when separate visible actions clearly need separate cues. Do not put a sound on every micro-movement.

## Mix hierarchy

```text
1. Voiceover
2. Clarity
3. SFX
4. Optional music
```

SFX must never mask consonants, words or sentence endings.

## Timing

Cues attach to the visible event:

- movement begins → movement/paper/cash cue
- object lands → soft impact
- payment visibly completes → confirmation
- countdown visibly stops → stop/click cue
- calendar visibly changes → page flip

Do not trigger a cue early just because the voiceover mentions the concept first.

## Asset policy

Final production audio must be local:

```text
public/sounds/<family>/<name>.<wav|mp3>
public/sounds/reels/<reel-slug>/scene-XX-<event>.<wav|mp3>
```

Remote URLs and runtime generation are forbidden in final renders.

## Generation policy

If the ElevenLabs `sound-effects` Agent Skill is installed and `ELEVENLABS_API_KEY` exists locally, Antigravity may generate only the effects explicitly listed in the approved sound plan.

Never:

- write an API key to repository files;
- commit `.env` secrets;
- invent extra effects outside the cue plan;
- generate music when only an SFX is requested;
- use ripped TikTok/Instagram/YouTube/platform audio;
- use copyrighted music as a sound effect.

If generation is unavailable, stop at the cue plan and report the missing asset. Never use fake placeholder beeps to make QA pass.

## Sound character

FinanzNeo SFX should be:

- subtle
- clean
- modern
- close and controlled
- educational/premium rather than cinematic-trailer heavy

Money must not sound like a casino, jackpot or arcade reward.

Warnings must not sound like emergency alarms unless the actual content warrants it.

## Reuse

Reuse a shared library sound when the physical event is genuinely the same, for example a light paper page flip.

Use a reel-specific effect when the event has a distinct character or needs custom timing.

## Result confirmation

A confirmation sound should usually be short and quiet. It may be omitted entirely if the visual already reads clearly or if it competes with speech.

## QA rejection

Remove or regenerate an effect if it:

- masks voiceover;
- fires visibly early or late;
- is too loud for the event;
- makes the Reel comedic unintentionally;
- repeats so often that it becomes distracting;
- sounds generic/cheap compared with the visual quality;
- continues after the visible action ends;
- creates a different emotional meaning than the scene.
