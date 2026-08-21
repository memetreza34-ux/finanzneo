# FinanzNeo Captions

Alle produktiv verwendeten Caption-Dateien liegen in diesem Ordner und werden mit Git versioniert.

## Verbindliches Format

```json
{
  "version": "finanzneo-caption-v1",
  "language": "de",
  "source": "public/audio/beispiel.mp3",
  "generatedAt": "2026-07-28T12:00:00Z",
  "duration": 61.25,
  "wordCount": 140,
  "words": [
    {"word": "Beispiel", "start": 0.12, "end": 0.48}
  ]
}
```

## Erzeugen

```bash
python3 scripts/captions.py public/audio/<name>.mp3 public/captions/<name>.json
```

## Alte Formate

`src/lib/captions.ts` kann vorübergehend auch diese früheren Formate lesen:

- flaches Wort-Array
- Whisper-Objekt mit `segments[].words[]`

Neue Dateien dürfen ausschließlich im Format `finanzneo-caption-v1` erzeugt werden.

Platzhalter-Captions werden nicht versioniert. Fehlen echte Wortzeiten, bleibt die Composition im Experiment-Bereich und darf nicht in Produktion verschoben werden.
