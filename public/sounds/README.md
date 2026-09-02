# FinanzNeo Sound Library

This directory contains the **final local sound effects** used by Remotion Reels.

The final render must never depend on a remote SFX URL or runtime sound-generation API.

## Library structure

```text
public/sounds/
├── paper/
│   ├── appear-soft.wav
│   ├── impact-soft.wav
│   └── page-flip.wav
├── money/
│   ├── release-soft.wav
│   ├── travel-soft.wav
│   └── land-soft.wav
├── ui-soft/
│   ├── confirm.wav
│   ├── warning.wav
│   └── select.wav
├── movement/
│   ├── whoosh-small.wav
│   └── whoosh-medium.wav
├── mechanical/
│   ├── open-soft.wav
│   ├── close-soft.wav
│   └── lock-soft.wav
└── reels/
    └── <reel-slug>/
        └── scene-XX-<event>.wav
```

Directories are created naturally when the first approved final asset is added. Do not add fake silent files merely to create folders.

## Rules

- voiceover is always louder/more important than SFX;
- use only cues from the Reel's approved `05-projektdateien/sound-design.md`;
- prefer short isolated sounds;
- reuse shared library sounds only for genuinely identical physical events;
- use Reel-specific files when timing/character is unique;
- no copyrighted/ripped social-platform sounds;
- no remote production URLs;
- no placeholder beeps;
- no casino/jackpot-style money sounds;
- keep filenames semantic and stable.

## Generation

Preferred optional generator: ElevenLabs official `sound-effects` Agent Skill installed locally for Antigravity.

`ELEVENLABS_API_KEY` belongs only in the local environment. It must never be committed.

If the generator or key is unavailable, keep the sound cue plan and stop. Do not replace missing final sounds with low-quality placeholders.

## Integration

Every cue is synchronized to a visible Remotion frame event. Typical mappings:

```text
paper starts moving      -> paper/appear-soft
paper lands              -> paper/impact-soft
money starts traveling   -> money/travel-soft
calendar flips           -> paper/page-flip
payment completes        -> ui-soft/confirm
reserve latch opens      -> mechanical/open-soft
warning state appears    -> ui-soft/warning
```

Final audio QA must be performed with voiceover and SFX together.
