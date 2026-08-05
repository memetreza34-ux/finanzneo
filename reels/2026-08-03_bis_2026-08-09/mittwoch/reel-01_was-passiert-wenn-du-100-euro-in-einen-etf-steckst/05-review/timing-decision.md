# Laufzeitentscheidung

## Entscheidung

Die vorhandene KI-Stimme wird vollständig verwendet, aber **pitch-erhaltend auf 1,10× beschleunigt**.

- gemessene Originaldauer: **72,42 Sekunden**
- erwartete Laufzeit bei 1,10×: ungefähr **65,84 Sekunden**
- erwartete Composition: ungefähr **1.976 Frames bei 30 FPS**
- endgültige Laufzeit und Szenengrenzen werden lokal aus der verarbeiteten Datei und echten Whisper-Wortzeitstempeln erzeugt

## Verbindliche Regeln

- Kein Satz und kein Wort wird entfernt.
- Die Tonhöhe darf sich durch die Beschleunigung nicht verändern.
- Die Originaldatei in `02-audio/` bleibt unverändert.
- Das Render verwendet die erzeugte Datei unter `render/audio/voiceover-runtime-1-10x.wav`.
- Geplante Szenenzeiten sind nur Startwerte.
- Die endgültigen Szenenwechsel folgen den tatsächlich gesprochenen Abschnitten.
- Die fertigen Zeiten stehen nach der lokalen Verarbeitung in `timeline/scene-timing.json` und `timeline/transcript-timing.md`.

## Vorläufige Zeiten vor der Transkription

| Szene | Start | Ende | Dauer |
|---|---:|---:|---:|
| 1 | 0,00 s | 7,64 s | 7,64 s |
| 2 | 7,64 s | 20,01 s | 12,37 s |
| 3 | 20,01 s | 27,65 s | 7,64 s |
| 4 | 27,65 s | 36,74 s | 9,09 s |
| 5 | 36,74 s | 46,20 s | 9,46 s |
| 6 | 46,20 s | 56,02 s | 9,82 s |
| 7 | 56,02 s | 65,84 s | 9,82 s |

Diese Tabelle wird nach der Transkription durch die echten Satz- und Wortgrenzen ersetzt.

## Automatische Verarbeitung

Aus `alles/` ausführen:

```bash
npm run finance:codex-reel:captions -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Der Befehl:

1. erkennt die einzige Datei in `02-audio/`,
2. erzeugt eine 1,10×-Version mit erhaltener Tonhöhe,
3. transkribiert sie lokal mit Whisper.cpp auf Deutsch,
4. erzeugt echte Wort-Zeitstempel,
5. ordnet das Transkript dem freigegebenen Szenenskript zu,
6. aktualisiert die Szenendauern und die Composition,
7. schreibt Captions, Transkript, Szenenzeiten und einen Prüfbericht.

## Manuelle Prüfung bleibt erforderlich

- Stimme klingt bei 1,10× natürlich
- Szenenwechsel liegen an sinnvollen Satzgrenzen
- Captions stimmen sichtbar mit der Stimme überein
- längere Bildszenen wirken weder statisch noch hektisch
