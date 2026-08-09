# Technische Hinweise

Dieser Ordner ist für die interne technische Umsetzung. Die normalen Produktionsdateien für dich liegen nur in `01-script`, `02-audio`, `03-szenen` und `04-caption`.

## Remotion
- Composition: `NotgroschenStufenplan`
- Source: `src/reels/notgroschen/NotgroschenStufenplan.tsx`
- 1080 × 1920, 30 fps
- 10 Szenen
- 6 Bildszenen, 4 Animationen

## Bildwelt dieses Reels
- World ID bleibt technisch: `finanzneo-connected-studio-v3`
- reel-spezifischer Weltprompt: `03-szenen/bildwelt.txt`
- heller Premium-3D/CGI-Editorial-Look statt dunkler Neon-/Tunnelwelt
- große konkrete Alltagsmotive statt Miniatur-Dioramen
- jedes finale Bild enthält genau den kurzen deutschen Bildtext, der direkt im jeweiligen Prompt vorgeschrieben ist
- Cover enthält zwingend `NOTGROSCHEN` / `IN 3 STUFEN`
- keine zusätzlichen englischen Texte, Fantasielabels, Logos oder App-UI

## Bilder
Google Flow erzeugt immer genau ein Bild, benennt es sofort um und prüft Motiv, deutschen Text und Dateiname vor dem nächsten Bild.

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

## QA
Ein finaler Render ist erst bestätigt nach Asset-Sync, Validator, Typecheck, Preview, Kontaktbogen/visueller Prüfung und Audio-Lautheitsprüfung.

Bei der Bild-QA zusätzlich prüfen:
- deutscher Bildtext exakt geschrieben
- kein zusätzlicher Text
- Motiv erklärt den Satz innerhalb einer Sekunde
- keine dunkle Neon-/Tunnel-/Miniaturwelt
- Hauptmotiv groß und hochwertig
