# Technische Hinweise

Dieser Ordner ist für die interne technische Umsetzung. Die normalen Produktionsdateien für dich liegen nur in `01-script`, `02-audio`, `03-szenen` und `04-caption`.

## Remotion
- Composition: `NotgroschenStufenplan`
- Source: `src/reels/notgroschen/NotgroschenStufenplan.tsx`
- 1080 × 1920, 30 fps
- 10 Szenen
- 6 Bildszenen, 4 Animationen

## Bildwelt
- World ID: `finanzneo-connected-studio-v3`
- Weltprompt: `03-szenen/bildwelt.txt`
- Weltreferenz: `03-szenen/bildwelt-referenz.png`
- Bilder ohne eingebauten Text, Zahlen, Labels, Logos oder App-UI

## Bilder
Google Flow legt nach vollständiger Einzelbild-Produktion alle fertig benannten Bilder gemeinsam in:
`03-szenen/00-ALLE-BILDER-HIER-REIN/`

Danach kann das Repo-Sortierskript die Bilder anhand ihrer echten Szenennummer technisch einsortieren.

## Audio und Captions
- finales Voiceover: genau eine Audiodatei in `02-audio/`
- echte Wortzeiten: `04-caption/word-timings.json`
- genau ein vollständiger Untertitelsatz gleichzeitig
- aktuelles Wort grün, Rest weiß
- maximal zwei Zeilen

## QA
Ein finaler Render ist erst bestätigt nach Asset-Sync, Validator, Typecheck, Preview, Kontaktbogen/visueller Prüfung und Audio-Lautheitsprüfung.
