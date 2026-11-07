# FinanzNeo-Kanalstimme

Seit 01.11.2026 entsteht das YouTube-Voiceover automatisch aus `1-script/script.txt` (Armans ausdrücklicher Wunsch). Das läuft lokal auf dem Mac und kostet nichts.

```bash
npm run youtube:stimme -- youtube/<Projekt>
```

Danach unverändert weiter:

```bash
npm run youtube:zusammenbau -- youtube/<Projekt> --whisper youtube/<Projekt>/_intern/03-audio/whisper.json
```

## Was der Befehl macht

1. liest `1-script/script.txt`, spricht **Zeile für Zeile** (lange Zeilen an Satzgrenzen geteilt)
2. schreibt Ziffern deutsch aus (`15,9 %` → „fünfzehn Komma neun Prozent“, `20. November 2026` → „zwanzigsten November zweitausendsechsundzwanzig“) und ersetzt Abkürzungen aus `aussprache.json`. Skript und Untertitel bleiben unverändert.
3. Pausen wie in den alten Aufnahmen: Zeile 0,5 s · Leerzeile (Absatz) 0,75 s · mehrere Leerzeilen (Kapitel) 1,0 s
4. prüft jede Zeile auf auffällige Länge (Verschlucker/Wiederholungen) und erzeugt sie bei Bedarf neu (max. 3 Versuche)
5. mastert auf **−16 LUFS / −1 dBTP**, 48 kHz mono → `4-audio-hier-rein/voiceover.wav`
6. erzeugt Whisper-Wortzeiten → `_intern/03-audio/whisper.json` und nennt den nächsten Befehl

Zwischenstände liegen in `_intern/03-audio/stimme/` (nicht im Git). Wird das Skript geändert, spricht ein neuer Lauf **nur die geänderten Zeilen** neu. Eine vorhandene Aufnahme wird nie gelöscht: Mit `--ueberschreiben` wandert sie nach `_intern/03-audio/ersetzt/`.

Optionen: `--ueberschreiben` · `--ohne-zeitstempel` · `--nur-zeilen N` (Probelauf) · `--whisper-modell large-v3-turbo` (Standard: `small`)

**Vor dem Zusammenbau einmal komplett reinhören.** Ist eine Zeile falsch betont: im Skript umformulieren oder in `aussprache.json` eintragen und den Befehl erneut starten. Nur diese Zeile wird neu gesprochen.

## Die Stimme

| | |
|---|---|
| Stimme | Nachbau der Google-KI-Stimme aus den bisherigen Videos (gewählt von Arman am 03.11.2026 per Hörvergleich) |
| Referenz | `referenz-alte-stimme.wav` (16,95 s aus `Finanzneo 1.mp4`, Video 0 % Finanzierung) + exakter Text in `stimme.json` |
| Engine | [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS), Apache 2.0 (kommerziell erlaubt), über [mlx-audio](https://github.com/Blaizzy/mlx-audio) (MIT) auf Apple Silicon |
| Modell | `mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16` (4,5 GB) |
| Tempo | ca. 0,5× Echtzeit auf M4 / 16 GB → 10 min Skript ≈ 20 min Rechenzeit |

Feste Stimme: Referenz, Modell und Einstellungen stehen im Repo, die Seeds werden aus dem Sprechtext abgeleitet. Unveränderte Zeilen kommen aus dem Zwischenspeicher und bleiben dadurch gleich. Ob ein Neulauf ohne Zwischenspeicher exakt gleich klingt, wurde nicht getestet.

**Nicht verwechseln:** Die neu entworfenen Stimmen vom 01./02.11. (VoiceDesign A–I) hat Arman verworfen („klingt komisch“). Ausgetauscht wird die Stimme nur bewusst: neue Referenz + neue `id` in `stimme.json` + Eintrag in `VERBESSERUNGEN.md`.

**Rechtlich offen (vor der Monetarisierung klären):** Die Referenz stammt aus einer Google-KI-Stimme. Googles [Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) nennt das Nachbauen ihrer Stimmen nicht ausdrücklich. Die Produktbedingungen des genutzten Google-Werkzeugs wurden aber nicht geprüft, und es ist unbekannt, ob der Stimme ein echter Sprecher zugrunde liegt. Die Apache-2.0-Lizenz deckt nur das Modell ab, nicht die Referenz. Sichere Alternative: Referenz durch Armans eigene Stimme ersetzen (10–20 s sauber eingesprochen, Text dazu).

## Einrichtung (einmalig, außerhalb des Repos)

```bash
mkdir -p ~/finanzneo-tts && cd ~/finanzneo-tts
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python mlx-audio==0.6.3 num2words
HF_HOME=~/finanzneo-tts/hf .venv/bin/python -c "from huggingface_hub import snapshot_download as s; s('mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16')"
```

Whisper für die Wortzeiten: `brew install openai-whisper` (Modell `small` lädt beim ersten Lauf).
Andere Orte: `FINANZNEO_TTS_HOME` bzw. `FINANZNEO_TTS_PYTHON` setzen.

**Speicher:** Das Modell braucht viel Arbeitsspeicher und freie Platte für den Auslagerungsspeicher. Ist die Platte fast voll, kann macOS den Prozess beenden (mehrfach gesehen: Exit 137). Dann Platz schaffen und neu starten: Fertige Zeilen bleiben im Zwischenspeicher.
