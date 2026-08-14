# Migration Notes

As part of standardizing the reel directories and ensuring all required files are present, the following missing files and discrepancies were found:

### 1. `reel-01_drei-konten-system`
- **Directories**: Uses non-standard names (`01-voice-script`, `00-cover`, `05-review`, `06-video`, etc.). **Symlinks have been created** (`01-script -> 01-voice-script` and `05-projektdateien -> 06-video`) to match standard pattern without breaking legacy workflows.
- **Missing**: `voiceover.txt` in `01-script/` (contains `script.txt` instead).
- **Missing**: Audio file in `02-audio/`.

### 2. `reel-02_notgroschen-stufenplan`
- **Missing**: `voiceover.txt` in `01-script/` (contains `script-fliess-text.txt` instead).

### 3. `reel-01_zinseszins-zeit`
- **Missing**: `voiceover.txt` in `01-script/` (contains `script-fliess-text.txt` instead).

### 4. `reel-01_etf-kosten-langfristig`
- **Note**: The audio file in `02-audio/` is `Finanzneo.mp4` (a video container), which may be used as the audio source but strictly speaking is not a standard audio format (.wav, .mp3, .m4a).

### 5. `reel-01_etf-vs-fonds-kosten-v2`
- **Missing**: Audio file in `02-audio/`.

### Required Files Standard
Every reel should ideally contain:
- `voiceover.txt` in `01-script/`
- Audio file (e.g. .mp3, .wav, .m4a) in `02-audio/`
- `scene-index.json` in `03-szenen/`
- `word-timings.json` in `04-caption/`
