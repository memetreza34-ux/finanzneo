---
name: sound-design
description: Plans, generates and integrates subtle frame-synchronized FinanzNeo sound effects for Remotion reels while keeping voiceover dominant and all production audio deterministic and local.
---

# FinanzNeo Sound Design

## Goal

Make motion feel physical and polished without turning the Reel into a soundboard.

Sound effects are small confirmations of visible events. They must never compete with the German voiceover.

## Source hierarchy

1. target animation code and its exact frame windows
2. target reel `05-projektdateien/sound-design.md`
3. this skill
4. `.agents/plugins/finanzneo-motion/rules/sound-design.md`

## Sound families

Use a small consistent library:

```text
paper/
  appear
  slide
  impact
  flip
money/
  release
  travel
  land
ui-soft/
  confirm
  warning
  select
movement/
  whoosh-small
  whoosh-medium
mechanical/
  open
  close
  lock
```

Do not add a new sound family when an existing one communicates the event.

## Generation

Preferred generation source when configured: the installed ElevenLabs `sound-effects` Agent Skill.

Requirements:

- `ELEVENLABS_API_KEY` must exist in the local environment;
- never put the API key in the repository;
- generate short isolated effects, not long soundscapes;
- generate only sounds listed in the approved reel cue plan;
- store final selected files locally in `public/sounds/`;
- final render must never depend on a remote URL or external API.

If ElevenLabs is unavailable, keep the cue plan but do not create fake/placeholder audio.

## Prompt style for generated SFX

Prompts should describe one clean event and explicitly avoid excessive cinematic bass or music.

Examples:

```text
Soft paper invoice sliding onto a desk, clean close-mic paper movement, 0.6 seconds, no music, no voice, no heavy impact.
```

```text
Subtle small stack of euro coins moving and settling, clean premium UI-adjacent financial sound, 0.5 seconds, no jackpot sound, no music.
```

```text
Quiet mechanical latch opening on a premium savings container, soft precise click, 0.4 seconds, no sci-fi sound, no music.
```

## Cue planning

Every cue must have:

- scene ID
- semantic event
- frame or narrow frame window
- filename
- family
- intended volume role
- whether it may be omitted if it hurts clarity

Prefer 2–4 meaningful SFX cues per animation scene. More is allowed only when the scene has separate clearly audible events.

## Mix priorities

Priority order:

```text
1. voiceover
2. comprehension
3. SFX
4. optional music
```

SFX should usually feel quiet under speech. Avoid repeated loud transients.

Do not put a sound on every movement. Silence between cues makes important actions feel stronger.

## Sync rules

Sound is attached to the visible event, not to the spoken word merely because it is nearby.

Examples:

- bill starts moving → paper movement cue
- bill lands → paper impact cue
- money starts traveling → money movement cue
- payment becomes visibly paid → confirmation cue
- countdown visibly stops → soft stop/click cue
- calendar visibly changes → page flip cue

## Asset rules

Final audio files:

```text
public/sounds/<family>/<descriptive-name>.<wav|mp3>
```

For reel-specific unique effects:

```text
public/sounds/reels/<reel-slug>/scene-XX-<event>.<wav|mp3>
```

- no secrets
- no remote dependencies
- no unused takes in production
- use descriptive filenames
- no copyrighted music or ripped platform sounds

## QA

Reject or remove a cue if:

- it masks speech;
- it is louder than the visual importance warrants;
- it sounds comedic when the scene is educational;
- it sounds like casino/jackpot audio for money;
- it fires before the visible action;
- it continues after the action has clearly ended;
- it makes repeated scenes sound identical despite different mechanics;
- it adds noise without making the motion feel more physical or clear.

## Completion

A sound-designed Reel is complete only when:

1. cue plan matches the current animation code;
2. every referenced audio file exists locally;
3. timing is frame-synchronized;
4. voiceover stays clearly dominant;
5. render QA is performed with audio enabled.
