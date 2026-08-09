# Technische Hinweise

Dieser Ordner ist für die interne technische Umsetzung. Die normalen Produktionsdateien für dich liegen nur in `01-script`, `02-audio`, `03-szenen` und `04-caption`.

## Remotion
- Composition: `NotgroschenStufenplan`
- Source: `src/reels/notgroschen/NotgroschenStufenplan.tsx`
- 1080 × 1920, 30 fps
- 10 Szenen
- 6 Bildszenen, 4 Animationen

## Bildwelt dieses Reels
- World ID: `finanzneo-connected-studio-v3`
- reel-spezifischer Weltprompt: `03-szenen/bildwelt.txt`
- Premium Dark 3D Finance Look: Anthrazit/Tiefgrün, smaragdgrünes Licht, Gold für Geld, Rot für Risiko
- große konkrete Hauptobjekte, keine Miniatur-Dioramen, keine Neon-Tunnel, keine Sci-Fi-Korridore
- KEINE Überschrift im generierten Bild
- KEIN Untertitel im generierten Bild
- KEIN ganzer Satz im generierten Bild
- nur die direkt im Prompt erlaubten kurzen deutschen Objekt-Beschriftungen, meist 1–3 Wörter
- Beschriftungen direkt am passenden Objekt, klein bis mittelgroß
- keine zusätzlichen englischen Texte, Fantasielabels, Logos oder App-UI

## Bilder
Google Flow erzeugt immer genau ein Bild, benennt es sofort um und prüft Motiv, erlaubte Objekt-Beschriftungen und Dateiname vor dem nächsten Bild.

Nach vollständiger Einzelbild-Produktion legt Google Flow alle fertig benannten Bilder gemeinsam in:
`03-szenen/00-ALLE-BILDER-HIER-REIN/`

Animationsszenen erhalten kein Bild und behalten ihre echte Szenennummer.

Danach kann das Repo-Sortierskript die Bilder anhand ihrer echten Szenennummer technisch einsortieren.

## Audio und Captions
- finales Voiceover: genau eine Audiodatei in `02-audio/`
- echte Wortzeiten: `04-caption/word-timings.json`
- genau ein vollständiger Untertitelsatz gleichzeitig
- aktuelles Wort grün, Rest weiß
- maximal zwei Zeilen

## QA Bild
- keine Headline/Untertitel/Sätze im KI-Bild
- nur vorgegebene kurze deutsche Objekt-Labels
- Label korrekt geschrieben und am richtigen Objekt
- Motiv erklärt den Satz innerhalb einer Sekunde
- große hochwertige Hauptobjekte
- keine Miniatur-Dioramen/Tunnel
- konsistenter Premium-Dark-3D-Look

## QA Gesamt
Ein finaler Render ist erst bestätigt nach Asset-Sync, Validator, Typecheck, Preview, Kontaktbogen/visueller Prüfung und Audio-Lautheitsprüfung.
