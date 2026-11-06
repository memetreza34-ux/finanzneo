#!/usr/bin/env python3
"""
FinanzNeo · Kanalstimme: 1-script/script.txt → 4-audio-hier-rein/voiceover.wav

Läuft in der lokalen TTS-Umgebung (~/finanzneo-tts/.venv, siehe youtube/_kanal/stimme/README.md).
Aufruf normalerweise über:  npm run youtube:stimme -- youtube/<Projekt>

- jede Skriptzeile = ein Durchgang (lange Zeilen an Satzgrenzen geteilt)
- Zahlen/Ziffern werden deutsch ausgeschrieben, Abkürzungen über aussprache.json
- Pausen: Zeilenumbruch / Leerzeile (Absatz) / mehrere Leerzeilen (Kapitel)
- Stücke werden unter _intern/03-audio/stimme/ zwischengespeichert: nach Skriptänderungen
  werden nur geänderte Zeilen neu gesprochen
- Mastering auf -16 LUFS / -1 dBTP, danach optional Whisper-Wortzeiten für youtube:zusammenbau
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import wave
import zlib
from pathlib import Path

import numpy as np

REPO = Path(__file__).resolve().parent.parent
STIMME_DIR = REPO / "youtube/_kanal/stimme"
AUDIO_ENDUNGEN = (".wav", ".mp3", ".m4a", ".aiff", ".aif", ".mp4", ".mov", ".webm")
ZEICHEN_PRO_SEKUNDE = 16  # gemessen an der geklonten Kanalstimme, ohne Pausen zwischen Zeilen

MONATE = "Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember"


# ─── Text → Sprechtext ───────────────────────────────────────────────────────

def _zahl(n: int) -> str:
    from num2words import num2words
    return num2words(n, lang="de")


def sprechtext(text: str, ersetzungen: dict[str, str]) -> str:
    from num2words import num2words

    for alt, neu in sorted(ersetzungen.items(), key=lambda kv: -len(kv[0])):
        text = re.sub(rf"(?<![\wÄÖÜäöüß]){re.escape(alt)}(?![\wÄÖÜäöüß])", neu, text)

    # Tausenderpunkte: 1.000.000 → 1000000
    text = re.sub(r"\b\d{1,3}(?:\.\d{3})+\b", lambda m: m.group().replace(".", ""), text)
    # Datum: 20. November → zwanzigsten November
    text = re.sub(rf"\b(\d{{1,2}})\.\s?(?=({MONATE})\b)",
                  lambda m: num2words(int(m.group(1)), lang="de", to="ordinal") + "n ", text)
    # Geldbeträge mit Cent: 2,50 € → zwei Euro fünfzig
    text = re.sub(r"\b(\d+),(\d{2})\s?(?:€|Euro)",
                  lambda m: f"{_zahl(int(m.group(1)))} Euro {_zahl(int(m.group(2)))}", text)
    # Dezimalzahlen: 15,9 → fünfzehn Komma neun
    text = re.sub(r"\b(\d+),(\d+)\b",
                  lambda m: f"{_zahl(int(m.group(1)))} Komma {' '.join(_zahl(int(z)) for z in m.group(2))}"
                  if len(m.group(2)) > 2 else f"{_zahl(int(m.group(1)))} Komma {_zahl(int(m.group(2)))}", text)
    text = re.sub(r"\s?%", " Prozent", text)
    text = re.sub(r"(?<=\d)\s?€|€\s?(?=\d)", " Euro ", text)
    # Jahreszahlen 1900–2099 als Jahr lesen
    text = re.sub(r"\b(19|20)\d{2}\b", lambda m: num2words(int(m.group()), lang="de", to="year"), text)
    # „1 Euro“ → „ein Euro“, sonst Grundzahl
    text = re.sub(r"\b1(?= [A-Za-zÄÖÜäöü])", "ein", text)
    text = re.sub(r"\b\d+\b", lambda m: _zahl(int(m.group())), text)
    return re.sub(r"\s{2,}", " ", text).strip()


def stuecke(skript: str, max_zeichen: int) -> list[tuple[str, str]]:
    """Liefert (Text, Pause davor) für jede Zeile. Pause: '' | 'zeile' | 'absatz' | 'kapitel'."""
    ergebnis: list[tuple[str, str]] = []
    leer = 0
    for zeile in skript.splitlines():
        zeile = zeile.strip()
        if not zeile:
            leer += 1
            continue
        pause = "" if not ergebnis else ("kapitel" if leer >= 2 else "absatz" if leer == 1 else "zeile")
        leer = 0
        saetze = re.split(r"(?<=[.!?])\s+", zeile)
        teil = ""
        for satz in saetze:
            if teil and len(teil) + 1 + len(satz) > max_zeichen:
                ergebnis.append((teil, pause))
                pause, teil = "zeile", satz
            else:
                teil = f"{teil} {satz}".strip()
        if teil:
            ergebnis.append((teil, pause))
    return ergebnis


# ─── Audio-Helfer ────────────────────────────────────────────────────────────

def lies_wav(pfad: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(pfad)) as w:
        sr = w.getframerate()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
    return a, sr


def schreib_wav(pfad: Path, a: np.ndarray, sr: int) -> None:
    pfad.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(pfad), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())


def beschneide(a: np.ndarray, sr: int, schwelle_db: float = -40, rand: float = 0.04) -> np.ndarray:
    f = int(sr * 0.01)
    n = len(a) // f
    if n == 0:
        return a
    rms = np.sqrt(np.mean(a[: n * f].reshape(n, f) ** 2, axis=1) + 1e-12)
    laut = np.where(20 * np.log10(rms) > schwelle_db)[0]
    if len(laut) == 0:
        return a[:0]
    start = max(0, laut[0] * f - int(sr * rand))
    ende = min(len(a), (laut[-1] + 1) * f + int(sr * rand))
    return a[start:ende]


def ffmpeg(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", *args], capture_output=True, text=True)


def mastern(roh: Path, ziel: Path, lufs: float, tp: float, sr: int) -> dict:
    erste = ffmpeg("-i", str(roh), "-af", f"loudnorm=I={lufs}:TP={tp}:LRA=11:print_format=json", "-f", "null", "-")
    m = json.loads(re.findall(r"\{[^{}]*\}", erste.stderr)[-1])
    filt = (f"loudnorm=I={lufs}:TP={tp}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
            f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    r = ffmpeg("-i", str(roh), "-af", filt, "-ar", str(sr), "-ac", "1", "-c:a", "pcm_s16le", str(ziel))
    if r.returncode != 0:
        raise RuntimeError(f"Mastering fehlgeschlagen: {r.stderr[-400:]}")
    pruef = ffmpeg("-i", str(ziel), "-af", "ebur128=peak=true", "-f", "null", "-").stderr
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", pruef)[-1])
    peak = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", pruef)[-1])
    return {"lufs": i, "truePeak": peak}


# ─── Hauptablauf ─────────────────────────────────────────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser(description="Skript → Voiceover mit der FinanzNeo-Kanalstimme")
    ap.add_argument("projekt", help="youtube/<Projekt>")
    ap.add_argument("--ueberschreiben", action="store_true", help="vorhandene Aufnahme in 4-audio-hier-rein/ ersetzen")
    ap.add_argument("--ohne-zeitstempel", action="store_true", help="kein Whisper-Lauf am Ende")
    ap.add_argument("--whisper-modell", default="small")  # large-v3-turbo wurde auf dem 16-GB-Mac beendet
    ap.add_argument("--nur-zeilen", type=int, default=0, help="Test: nur die ersten N Stücke")
    args = ap.parse_args()

    projekt = Path(args.projekt).resolve()
    skript_pfad = projekt / "1-script/script.txt"
    inbox = projekt / "4-audio-hier-rein"
    intern = projekt / "_intern/03-audio"
    cache = intern / "stimme"
    if not skript_pfad.exists():
        print(f"✗ Kein Skript: {skript_pfad}", file=sys.stderr)
        return 1

    stimme = json.loads((STIMME_DIR / "stimme.json").read_text())
    ersetzungen = json.loads((STIMME_DIR / "aussprache.json").read_text())["ersetzungen"]
    ziel = inbox / "voiceover.wav"
    vorhanden = [p for p in inbox.glob("*") if p.suffix.lower() in AUDIO_ENDUNGEN] if inbox.exists() else []
    if vorhanden and not args.ueberschreiben:
        print(f"✗ 4-audio-hier-rein/ enthält schon Audio ({', '.join(p.name for p in vorhanden)}). "
              "Mit --ueberschreiben ersetzen.", file=sys.stderr)
        return 1

    teile = stuecke(skript_pfad.read_text(encoding="utf-8"), stimme["erzeugung"]["maxZeichenProStueck"])
    if args.nur_zeilen:
        teile = teile[: args.nur_zeilen]
    print(f"Kanalstimme {stimme['id']} · {len(teile)} Stücke aus {skript_pfad.relative_to(REPO)}")

    import mlx.core as mx
    from mlx_audio.tts.utils import load_model

    mx.set_cache_limit(128 * 1024 * 1024)  # 16-GB-Mac: sonst beendet macOS den Prozess
    modell = None
    ref = str(STIMME_DIR / stimme["referenz"]["datei"])
    ref_text = stimme["referenz"]["text"]
    temp = stimme["erzeugung"]["temperature"]
    sprache = stimme["erzeugung"]["sprache"]
    sr = 24000
    pausen = stimme["pausenSekunden"]
    audio: list[np.ndarray] = []
    protokoll = []

    for nr, (text, pause) in enumerate(teile, 1):
        gesprochen = sprechtext(text, ersetzungen)
        basis = zlib.crc32(f"{stimme['id']}|{temp}|{gesprochen}".encode())
        datei = cache / f"{basis:08x}.wav"
        erwartet = len(gesprochen) / ZEICHEN_PRO_SEKUNDE
        if datei.exists():
            stueck, sr = lies_wav(datei)
            quelle = "Cache"
        else:
            if modell is None:
                modell = load_model(stimme["engine"]["modell"])
                sr = modell.sample_rate
            bestes, abweichung = None, None
            for versuch in range(3):
                mx.random.seed(basis + versuch)
                res = list(modell.generate(text=gesprochen, ref_audio=ref, ref_text=ref_text,
                                           language=sprache, temperature=temp))
                kandidat = beschneide(np.concatenate([np.array(r.audio) for r in res]), sr)
                dauer = len(kandidat) / sr
                faktor = dauer / erwartet if erwartet else 1
                if bestes is None or abs(np.log(max(faktor, 1e-3))) < abweichung:
                    bestes, abweichung = kandidat, abs(np.log(max(faktor, 1e-3)))
                if 0.6 <= faktor <= 1.6:
                    break
                print(f"  ↻ Stück {nr}: {dauer:.1f} s statt ca. {erwartet:.1f} s, neuer Versuch")
            stueck = bestes
            schreib_wav(datei, stueck, sr)
            quelle = "neu"
            mx.clear_cache()
        if pause and audio:
            audio.append(np.zeros(int(sr * pausen[pause]), np.float32))
        audio.append(stueck)
        dauer = len(stueck) / sr
        warnung = "" if 0.6 <= dauer / max(erwartet, 0.1) <= 1.6 else "  ⚠ Länge auffällig, bitte reinhören"
        protokoll.append({"nr": nr, "text": text, "gesprochen": gesprochen, "pause": pause,
                          "sekunden": round(dauer, 2), "datei": datei.name})
        print(f"  {nr:3d}/{len(teile)} {quelle:5s} {dauer:5.1f} s  {text[:60]}{warnung}", flush=True)

    roh = intern / "voiceover-roh.wav"
    schreib_wav(roh, np.concatenate(audio), sr)
    for p in vorhanden:
        ablage = intern / "ersetzt"
        ablage.mkdir(parents=True, exist_ok=True)
        shutil.move(str(p), ablage / p.name)
        print(f"  alte Aufnahme verschoben: _intern/03-audio/ersetzt/{p.name}")
    inbox.mkdir(parents=True, exist_ok=True)
    m = stimme["mastering"]
    pegel = mastern(roh, ziel, m["lufs"], m["truePeakDb"], m["sampleRate"])
    roh.unlink()
    gesamt = sum(len(a) for a in audio) / sr
    woerter = sum(len(t.split()) for t, _ in teile)
    print(f"✓ {ziel.relative_to(REPO)} · {gesamt / 60:.1f} min · {woerter / gesamt * 60:.0f} Wörter/Min "
          f"· {pegel['lufs']:.1f} LUFS · Peak {pegel['truePeak']:.1f} dBFS")
    if abs(pegel["lufs"] - m["lufs"]) > 0.5 or pegel["truePeak"] > m["truePeakDb"] + 0.1:
        print("✗ Zielpegel verfehlt", file=sys.stderr)
        return 1
    (intern / "stimme-protokoll.json").write_text(json.dumps(
        {"stimme": stimme["id"], "modell": stimme["engine"]["modell"], "sekunden": round(gesamt, 2),
         "pegel": pegel, "stuecke": protokoll}, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.ohne_zeitstempel:
        return 0
    whisper = shutil.which("whisper")
    if not whisper:
        print("⚠ whisper nicht gefunden: Wortzeiten bitte wie gewohnt selbst erzeugen.")
        return 0
    print(f"Wortzeiten mit Whisper ({args.whisper_modell}) …", flush=True)
    r = subprocess.run([whisper, str(ziel), "--model", args.whisper_modell, "--language", "de",
                        "--word_timestamps", "True", "--output_format", "json", "--fp16", "False",
                        "--output_dir", str(intern)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(f"✗ Whisper fehlgeschlagen: {r.stderr[-400:]}", file=sys.stderr)
        return 1
    whisper_json = intern / "whisper.json"
    (intern / "voiceover.json").replace(whisper_json)
    rel = lambda p: os.path.relpath(p, REPO)
    print(f"✓ {rel(whisper_json)}")
    print(f"Weiter: npm run youtube:zusammenbau -- {rel(projekt)} --whisper {rel(whisper_json)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
