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
- Premium Fintech Editorial 3D
- eine starke Metapher / ein großes Hauptobjekt
- optional stilisierte erwachsene 3D-Person
- wenn Person: Gesicht klar sichtbar, frontal oder 3/4
- deep charcoal green-black Grundwelt
- emerald/mint Akzente
- Gold = Geld/Wert
- warmes Rot-Orange = Risiko/Verlust/Schulden
- kurze deutsche Objektlabels, keine Headline/Untertitel/Sätze

## Hintergrund — kritisch
- genau EIN nahtloser Hintergrund von oben bis unten
- keine Prozent-Zonen
- keine horizontalen Bänder
- keine obere/untere Hintergrundsektion
- keine Boden-Wand-Grenze
- kein Horizont
- keine Panels
- nur natürlicher freier Raum oberhalb/unterhalb des zentralen Motivs

## Bilder
Google Flow erzeugt immer genau ein Bild, benennt es sofort um und prüft Motiv, Labels, Gesicht, nahtlosen Hintergrund und Dateiname vor dem nächsten Bild.

Nach vollständiger Einzelbild-Produktion legt Google Flow alle fertig benannten Bilder gemeinsam in:
`03-szenen/00-ALLE-BILDER-HIER-REIN/`

Animationsszenen erhalten kein Bild und behalten ihre echte Szenennummer.

## Audio und Captions
- finales Voiceover: genau eine Audiodatei in `02-audio/`
- echte Wortzeiten: `04-caption/word-timings.json`
- genau ein vollständiger Untertitelsatz gleichzeitig
- aktuelles Wort grün, Rest weiß
- maximal zwei Zeilen

## QA Bild
- kein zweiter Hintergrund / kein Band
- keine horizontale Trennkante
- kein Floor/Wall-Split oder Horizont
- Person mit sichtbarem Gesicht, falls vorhanden
- nur erlaubte kurze deutsche Labels
- keine Headline/Untertitel/Sätze im KI-Bild
- Motiv erklärt den Satz innerhalb einer Sekunde
- keine Dioramen/Tunnel/Game-Level

## QA Gesamt
Ein finaler Render ist erst bestätigt nach Asset-Sync, Validator, Typecheck, Preview, Kontaktbogen/visueller Prüfung und Audio-Lautheitsprüfung.
