#!/usr/bin/env python3
"""
FinanzNeo · Caption-Generator

Erzeugt aus Audio oder Video das verbindliche Caption-Format:

{
  "version": "finanzneo-caption-v1",
  "language": "de",
  "source": "public/audio/beispiel.mp3",
  "generatedAt": "...",
  "duration": 12.34,
  "wordCount": 42,
  "subtitleMode": "sentence-with-audio-synced-active-word",
  "activeWordColor": "finance-green",
  "words": [{"word": "...", "start": 0.0, "end": 0.4}],
  "sentences": [{"text": "...", "start": 0.0, "end": 1.2, "words": [...]}]
}

Nutzung:
  python3 scripts/captions.py <audio_or_video> [output.json]
  python3 scripts/captions.py <audio_or_video> [output.json] --model small
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import tempfile
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Erzeuge FinanzNeo-Captions mit Wort-Timestamps.")
    parser.add_argument("source", help="Audio- oder Videodatei")
    parser.add_argument("output", nargs="?", help="Ziel-JSON")
    parser.add_argument("--model", default="small", help="Whisper-Modell, Standard: small")
    return parser.parse_args()


def extract_wav(source: Path) -> Path:
    handle = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    handle.close()
    wav = Path(handle.name)

    result = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-vn",
            "-ar",
            "16000",
            "-ac",
            "1",
            str(wav),
            "-y",
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        wav.unlink(missing_ok=True)
        detail = result.stderr.strip() or "Unbekannter ffmpeg-Fehler"
        raise RuntimeError(f"Audio konnte nicht extrahiert werden: {detail}")

    return wav


def normalize_word(entry: dict[str, Any]) -> dict[str, Any] | None:
    word = str(entry.get("word", "")).strip()

    try:
        start = round(float(entry.get("start")), 2)
        end = round(float(entry.get("end")), 2)
    except (TypeError, ValueError):
        return None

    if not word or start < 0 or end < start:
        return None

    return {"word": word, "start": start, "end": end}


def group_sentences(words: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sentences: list[dict[str, Any]] = []
    current: list[dict[str, Any]] = []

    def flush() -> None:
        if not current:
            return
        sentences.append(
            {
                "text": " ".join(word["word"] for word in current),
                "start": current[0]["start"],
                "end": current[-1]["end"],
                "words": list(current),
            }
        )
        current.clear()

    for word in words:
        current.append(word)
        if re.search(r"[.!?][\"'»”)]*$", word["word"]):
            flush()

    flush()
    return sentences


def main() -> None:
    args = parse_args()
    source = Path(args.source).expanduser().resolve()

    if not source.is_file():
        raise SystemExit(f"FEHLER: Quelldatei nicht gefunden: {source}")

    output = (
        Path(args.output).expanduser()
        if args.output
        else source.with_name(f"{source.stem}_captions.json")
    )
    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    wav: Path | None = None

    try:
        wav = extract_wav(source)

        import whisper

        model = whisper.load_model(args.model)
        result = model.transcribe(
            str(wav),
            language="de",
            word_timestamps=True,
            verbose=False,
        )

        words: list[dict[str, Any]] = []
        for segment in result.get("segments", []):
            for raw_word in segment.get("words", []):
                normalized = normalize_word(raw_word)
                if normalized is not None:
                    words.append(normalized)

        words.sort(key=lambda item: (item["start"], item["end"]))
        duration = round(max((word["end"] for word in words), default=0.0), 2)
        sentences = group_sentences(words)

        try:
            source_label = source.relative_to(Path.cwd().resolve()).as_posix()
        except ValueError:
            source_label = source.as_posix()

        payload = {
            "version": "finanzneo-caption-v1",
            "language": "de",
            "source": source_label,
            "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "duration": duration,
            "wordCount": len(words),
            "fps": 30,
            "subtitleMode": "sentence-with-audio-synced-active-word",
            "activeWordColor": "finance-green",
            "words": words,
            "sentences": sentences,
        }

        with output.open("w", encoding="utf-8") as file:
            json.dump(payload, file, ensure_ascii=False, indent=2)
            file.write("\n")

        print(f"✓ {len(words)} Wörter · {duration:.2f}s → {output}")

        if not words:
            print("WARNUNG: Whisper hat keine gültigen Wörter erkannt.")
    finally:
        if wav is not None:
            wav.unlink(missing_ok=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        raise SystemExit("Abgebrochen.")
    except Exception as error:
        raise SystemExit(f"FEHLER: {error}") from error
