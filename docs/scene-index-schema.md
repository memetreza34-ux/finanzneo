# scene-index.json Schema Reference

We currently have two legacy schemas in use across our reels:

1. **v12 / v16 (Detailed)**
   Used in `drei-konten-system`, `notgroschen-stufenplan`, and `zinseszins-zeit`. This schema is highly detailed, containing metadata like `imageSceneCount`, `targetImageShare`, detailed `layout` constraints, `timelineRules`, `subtitleDisplay` rules, and a highly descriptive `scenes` array with frame-level timing (`startFrame`, `endFrame`, `durationFrames`) and deeply nested `subtitles` arrays.
   - Version is an integer (`12` or `16`).
   - Relies heavily on implicit `planFile` or `directory` structures.

2. **v2.1 / quality-contract-v2 (Minimal)**
   Used in `etf-kosten-langfristig` and `etf-vs-fonds-kosten-v2`. This schema is more compact and declarative, leaving timeline construction to standard rules rather than hardcoding frames.
   - Version is a string (e.g., `"finanzneo-v2.1"`, `"quality-contract-v2"`).
   - Minimal `scenes` array defining basic properties (`id`/`scene`, `type`, `title`, `subtitle`, `googleFlowFileName`).

## Canonical Format

To standardize future reels, the canonical format for `scene-index.json` is defined below.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "description": "Schema version, ideally 'canonical-v1'"
    },
    "reelId": {
      "type": "string",
      "description": "Unique identifier for the reel"
    },
    "scenes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique scene identifier, e.g., 'scene-01'"
          },
          "type": {
            "type": "string",
            "enum": ["image", "animation", "remotion"],
            "description": "The type of scene"
          },
          "title": {
            "type": "string",
            "description": "Scene headline or title"
          },
          "description": {
            "type": "string",
            "description": "Scene description or subtitle text"
          }
        },
        "required": ["id", "type", "title", "description"]
      }
    }
  },
  "required": ["version", "reelId", "scenes"]
}
```
