#!/usr/bin/env python3
"""
FinanzNeo · Caption-Generator (lokal, gratis).
Erzeugt aus einer Audio/Video-Datei wortgenaue Untertitel-Daten für Remotion.

Nutzung:
  source ~/manim-env/bin/activate
  python scripts/captions.py <audio_or_video> [output.json]

Ausgabe: JSON-Array [{ "word": "...", "start": 0.0, "end": 0.4 }, ...]
→ in der Szene: import words from '../public/captions/<name>.json'
   <Captions words={words} />
"""
import sys, json, subprocess, os, tempfile

def extract_wav(src: str) -> str:
    wav = tempfile.mktemp(suffix=".wav")
    subprocess.run(
        ["ffmpeg", "-i", src, "-vn", "-ar", "16000", "-ac", "1", wav, "-y"],
        capture_output=True, check=True,
    )
    return wav

def main():
    if len(sys.argv) < 2:
        print("Usage: python captions.py <audio_or_video> [out.json]")
        sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + "_captions.json"

    import whisper
    wav = extract_wav(src)
    model = whisper.load_model("small")
    r = model.transcribe(wav, language="de", word_timestamps=True, verbose=False)

    words = []
    for seg in r["segments"]:
        for w in seg.get("words", []):
            words.append({
                "word": w["word"].strip(),
                "start": round(w["start"], 2),
                "end": round(w["end"], 2),
            })
    json.dump(words, open(out, "w"), ensure_ascii=False, indent=2)
    os.remove(wav)
    print(f"✓ {len(words)} Wörter → {out}")

if __name__ == "__main__":
    main()
