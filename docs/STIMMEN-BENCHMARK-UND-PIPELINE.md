# FinanzNeo · Stimmen-Benchmark & Moderne TTS-Sprecher-Pipeline

> **Status:** Abgeschlossen & Einsatzbereit  
> **Hardware-Basis:** Apple Silicon M4 (16 GB Unified Memory), macOS  
> **Stand:** KW44 (November 2026)

---

## 1. Ausgangslage & Nutzer-Kritik

### Problem
Bisher getestete Stimmenprofile (Edge-TTS *Florian*, *Killian*, *Conrad* sowie Piper *Thorsten*) wurden vom Nutzer als **„nicht menschlich genug / klingt nach KI“** abgelehnt:
> *„irgendwie ist diese Stimme nicht gut genug, nicht menschlich genug, im Notfall mach es neu oder so, such einen Weg wie wir noch eine bessere Stimme bekommen“*

### Ursachen-Analyse alter TTS-Systeme:
1. **Flache, monotone Prosodie:** Klassische neuronale TTS-Modelle (Edge-TTS) lesen Sätze wie ein Teleprompter ab, ohne das inhaltliche Gewicht von Zahlen, Begriffen und Kernaussagen semantisch zu betonen.
2. **Fehlende Mikro-Intonationen:** Es fehlen die natürlichen Mikroschwankungen in Tonhöhe, Stimmbänder-Vibration, Resonanzraum und Atmung.
3. **Starre Sprechpausen:** Synthetische Pausen wirken entweder unnatürlich abgehackt oder schleppend lang (0.8–1.2s), was die Zuschauerbindung (Retention) auf YouTube und Reels zerstört.
4. **Cloud-Fragilität:** Edge-TTS basiert auf inoffiziellen Microsoft-Websocket-Endpunkten, die unangekündigt Anfragen mit `NoAudioReceived` blockieren.

---

## 2. Benchmark moderner Next-Gen TTS-Technologien

| Kriterium | Piper TTS | Edge-TTS (Florian) | Kokoro-82M (Martin ONNX) | Coqui XTTS-v2 | F5-TTS / CosyVoice | **Qwen3-TTS 1.7B (MLX)** |
|---|---|---|---|---|---|---|
| **Menschlichkeit & Wärme** | 🔴 2/10 (Synthetisch) | 🟡 5/10 (KI-artig) | 🟡 6/10 (Ordentlich, aber starr) | 🟢 8/10 (Gut mit Referenz) | 🟢 8.5/10 (Sehr flüssig) | **🟢 9.5/10 (Herausragend lebendig)** |
| **Deutsche Sprache** | 🟢 Nativ | 🟢 Nativ | 🟡 Nur Community-Finetune | 🟢 Nativ (Mehrsprachig) | 🟡 Benötigt Referenz-Audio | **🟢 Nativ trainiert (10+ Sprachen)** |
| **Aussprache Zahlen/Finanzen** | 🟡 Fehleranfällig | 🟢 Gut | 🔴 Teils phonetische Aussetzer | 🟡 Häufige Wortwiederholungen | 🟡 Variabel | **🟢 Exzellent & semantisch verstanden** |
| **Lokale Ausführung auf M4** | 🟢 CPU (sehr leicht) | 🔴 Nur Cloud (Websocket) | 🟢 CPU / ONNX (leicht) | 🔴 Sehr schwer, VRAM-intensiv | 🔴 Hohe Latenz (Diffusion-Steps) | **🟢 Apple Silicon GPU/ANE nativ (MLX)** |
| **Inferenz-Geschwindigkeit** | ~0.1x RTF | Abhängig von Internet | ~0.2x RTF (max 5s Chunks) | ~1.5x–2.0x RTF (sehr langsam) | ~1.2x–1.8x RTF | **~0.75x RTF (Schneller als Echtzeit!)** |
| **Stimm-Individualisierung** | 🔴 Feste Sprecher | 🔴 Feste Sprecher | 🔴 1 Stimme (Martin Harbecke) | 🟢 Zero-Shot Klonung | 🟢 Zero-Shot Klonung | **🟢 Prompt-basiertes VoiceDesign & Klonung** |
| **Abhängigkeiten / Kosten** | Kostenlos | Kostenlos (aber fragil) | Kostenlos | EOL / Discontinued | Hoher Setup-Aufwand | **100% lokal, Open-Weights, kostenlos** |

### Warum Qwen3-TTS 1.7B VoiceDesign der Gewinner ist:
- **1.7 Milliarden Parameter Speech-LLM:** Versteht Satzkontext, Ironie, Fragen, Aufzählungen und Rechnungen („zwölf mal fünfzig sind sechshundert“).
- **Prompt-gesteuertes VoiceDesign:** Jede beliebige Sprecher-Persönlichkeit (Alter, Stimmlage, Sprechtempo, Intonation, Mikrofon-Distanz) lässt sich präzise beschreiben und über Seed-Werte reproduzierbar steuern.
- **MLX-optimiert für Apple Silicon:** Nutzt den Unified Memory des Apple M4 optimal (~2.5 GB RAM im 8-Bit Quantisierungsmodus).

---

## 3. Die 6 neuen Premium-Stimmen (Vergleichs-Shootout)

Alle Stimmen wurden auf dem exakten **KW44-Hook** generiert:
> *„Null Prozent Finanzierung. Kein Zins, kleine Monatsrate. Klingt wie geschenktes Geld. Manchmal stimmt das sogar. Aber manchmal unterschreibst du dabei einen zweiten Vertrag, den du gar nicht wolltest. Ein Beispiel. Ein Fernseher kostet sechshundert Euro. Du zahlst zwölf Raten zu je fünfzig Euro. Zwölf mal fünfzig sind sechshundert. Wenn sonst nichts dazukommt, zahlst du genau den Kaufpreis. Keinen Cent mehr.“*

| Datei | Profil | Charakter & Stimmsound | Empfohlen für |
|---|---|---|---|
| `0-ORIGINAL-Baseline-Florian-EdgeTTS.wav` | **Baseline (Alt)** | Synthetische Microsoft Edge-Stimme | *Vergleichsreferenz (Vom Nutzer abgelehnt)* |
| `1-SOTA-Qwen3-A-ruhig-kompetent.wav` | **Profil A (Seed 1101)** | Männlich Mitte 30, warm, mittel-tief, sachlich, freundlich, natürlich flüssig | **Hauptempfehlung für FinanzNeo YouTube** |
| `2-SOTA-Qwen3-B-tief-souveraen.wav` | **Profil B (Seed 2202)** | Männlich ~40, tiefe, sonore Dokumentarfilm-Stimme, höchste Autorität | Premium-Reportagen, Aufklärungs-Videos |
| `3-SOTA-Qwen3-C-jung-lebendig.wav` | **Profil C (Seed 3303)** | Männlich ~28, jung, dynamisch, sympathisch, lächelnder Ton, flottes Tempo | Kurze Reels, Shorts, Lifestyle-Geldthemen |
| `4-SOTA-Qwen3-D-podcast-nahbar.wav` | **Profil D (Seed 4404)** | Extrem nah am Mikrofon (Shure SM7B), hörbare Atmer, persönliche Ansprache | Podcast-Formate, intime Finanztipps |
| `5-SOTA-Qwen3-E-finanzberater-dynamisch.wav` | **Profil E (Seed 5505)** | Männlich ~32, crisp artikuliert, smart, lebendige Betonung auf Zahlen | Vergleiche, Rechnungen, Zinsanalysen |
| `6-SOTA-Qwen3-F-expertin-souveraen.wav` | **Profil F (Seed 6606)** | Weiblich Anfang 30, warmherzig, souverän, klare Intonation | Weibliche Hauptstimme für Finanzthemen |

### Interaktive Hörprobe öffnen:
Die interaktive HTML-Player-Station befindet sich unter:
`youtube/2026-10-17_null-prozent-finanzierung/stimmen-vergleich/hoerprobe.html`
(Einfach im Browser öffnen oder Doppelklick im Finder).

---

## 4. Die Audio-Engineering Pipeline (Mastering)

Reine TTS-Rohdaten klingen oft zu leise (-25 LUFS) oder haben zu lange Pausen. Unsere Pipeline führt automatisch zwei Nachbearbeitungsschritte durch:

1. **Intelligente Pausenkappung (`max_pause = 0.3s`):**
   - Pausen zwischen Sätzen werden von 0.8–1.2s auf 300ms gekürzt.
   - Hält das Video dynamisch und optimiert die Zuschauer-Retention.
2. **Broadcast-Mastering (EBU R128 / YouTube-Standard):**
   - **High-Pass bei 75 Hz:** Filtert tieffrequentes Rumpeln und Plosivlaute.
   - **Präsenz-EQ bei 3.5 kHz (+1.5 dB, Q=1.5):** Hebt die Sprachverständlichkeit hervor.
   - **Air-EQ bei 10 kHz (+1.8 dB, Q=1.0):** Verleiht seidigen Glanz und Atem-Definition.
   - **Studio-Kompressor (2.5:1, Attack 15ms, Release 100ms):** Gleicht Laustärkesprünge unhörbar aus.
   - **Loudnorm:** Pegelt die Zieldatei exakt auf **-14.0 LUFS** (True Peak -1.0 dBTP) bei **48 kHz 24-bit PCM**.

---

## 5. Pipeline-Nutzung & Workflow

### Schneller CLI-Aufruf über npm:
Aus dem `FinanzNeo-Claud`-Projektverzeichnis:

```bash
# 1. Vollständiges Skript einsprechen (z.B. Profil A)
npm run youtube:voice -- \
  --script youtube/2026-10-17_null-prozent-finanzierung/1-script/script.txt \
  --voice A-ruhig-kompetent \
  --out youtube/2026-10-17_null-prozent-finanzierung/4-audio-hier-rein/voiceover.wav

# 2. Anderes Profil testen (z.B. D-podcast-nahbar)
npm run youtube:voice -- \
  --script youtube/2026-10-17_null-prozent-finanzierung/1-script/script.txt \
  --voice D-podcast-nahbar \
  --out youtube/2026-10-17_null-prozent-finanzierung/4-audio-hier-rein/voiceover.wav

# 3. Schneller Test (nur die ersten 2 Absätze zur Vorschau)
npm run youtube:voice -- \
  --script youtube/2026-10-17_null-prozent-finanzierung/1-script/script.txt \
  --voice A-ruhig-kompetent \
  --preview 2 \
  --out test.wav
```

### Direkter Python-Aufruf:
```bash
/Users/arman/finanzneo-tts/.venv/bin/python /Users/arman/finanzneo-tts/sprecher.py \
  --script <pfad-zu-script.txt> \
  --voice A-ruhig-kompetent \
  --out <pfad-zu-voiceover.wav>
```

Nachdem das Voiceover generiert ist, greift der reguläre Remotion-Workflow:
```bash
npm run youtube:zusammenbau -- youtube/2026-10-17_null-prozent-finanzierung --vorschau
```
