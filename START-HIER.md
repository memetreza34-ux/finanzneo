# FinanzNeo — Start hier

## Verbindliche Reihenfolge

1. Lies `CLAUDE.md` vollständig.
2. Lies `reels/PRODUKTIONSSTANDARD.md`.
3. Lies für neue Reels `docs/REEL-QUALITY-CONTRACT-V2.md`.
4. Entscheide den Visualtyp mit `docs/BEAT-TO-IMAGE-RULES.md`.
5. Bei Bildaufgaben lies `docs/FINANZNEO-IMAGE-WORLD-V3.md`, `docs/IMAGE-SYSTEM.md`, `docs/IMAGE-PROMPT-LIBRARY.md` und `docs/IMAGE-QA-CHECKLIST.md`.
6. Für Veröffentlichung lies `docs/PLATFORM-PUBLISHING.md`.
7. Beim Ziel-Reel lies `03-szenen/scene-index.json`, `05-projektdateien/szenenplan.md` und `03-szenen/alle-bildprompts.txt`.

`CLAUDE.md` ist die höchste Regelquelle. Bei Widersprüchen gelten ältere Regeln nicht.

## Aktueller Reel-Standard

- 1080 × 1920, 30 fps, normalerweise 60–90 Sekunden
- **Ziel: 60 % native Remotion-Animation / 40 % Google-Flow-Bilder**
- neue V17-Reels final: **55–65 % Animationslaufzeit / 35–45 % Bildlaufzeit**
- bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder
- höchstens eine Bildszene direkt hintereinander
- statische Bildszene normalerweise maximal 8 Sekunden
- Vergleich, Rechnung, Timeline, Wachstum, Geldfluss, Mechanismus und sichtbare Veränderung sind animation-first
- Google-Flow-Bilder hauptsächlich für Hook, konkrete Situation, starke einzelne Metapher und Abschlussbild
- jedes Nutzerbild vor Einbau semantisch gegen den exakten Voice-Beat prüfen
- finale Timeline ausschließlich aus dem finalen Audio und echten Wortzeiten erzeugen
- keine finalen `durationFrames: 0`
- genau eine kurze Caption-Einheit gleichzeitig
- max. 12 Wörter / 68 Zeichen / 2 Zeilen / mindestens 42 px
- Caption ungefähr Bottom 320 / Left 72 / Right 180
- vollständige finale MP4-QA ist Pflicht
- für V17-Reels muss `05-projektdateien/final-qa.json` nach echter Prüfung `passed` sein

## Kanal-/Bildstandard

- deutsche Finanzgrundlagen für Anfänger
- Reel-Plattformen: Instagram Reels, TikTok, Facebook Reels und Snapchat
- dieselbe universelle Social-Caption auf allen vier Plattformen
- genau 5 relevante Hashtags
- YouTube ausschließlich eigenständige Longform-Videos unter `youtube/`; keine YouTube Shorts
- Premium Fintech Editorial 3D + Remotion
- eine starke visuelle Metapher pro Bild
- optional stilisierte 3D-Person; wenn Person, Gesicht klar sichtbar
- **Cover `Bild 00`: große klare deutsche Überschrift direkt aus Google Flow; keine Remotion-Ersatzheadline**
- **Szenenbilder `Bild 01+`: nur kurze deutsche Objektlabels; keine KI-Headline/Untertitel/Sätze**
- genau EIN nahtloser deep-charcoal-green-black Hintergrund von oben bis unten
- Antigravity erzeugt keine Bilder; Nutzer erstellt sie selbst mit Google Flow

## Einfache Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

`04-caption/` enthält nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird 1:1 für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet und enthält exakt 5 passende Hashtags.

Nicht mehr erstellen:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

## Neuer Reel-Start

```text
Neues FinanzNeo-Reel.
Thema: [THEMA]

Lies vollständig:
- CLAUDE.md
- reels/PRODUKTIONSSTANDARD.md
- docs/REEL-QUALITY-CONTRACT-V2.md
- docs/BEAT-TO-IMAGE-RULES.md
- docs/FINANZNEO-IMAGE-WORLD-V3.md
- docs/IMAGE-SYSTEM.md
- docs/IMAGE-PROMPT-LIBRARY.md
- docs/IMAGE-QA-CHECKLIST.md
- docs/PLATFORM-PUBLISHING.md

Erstelle selbstständig:
1. Recherche + Quellen
2. geprüftes Skript mit kurzen caption-tauglichen Aussagen
3. Szenen-/Beat-Plan
4. Bild-/Remotion-Zuordnung MIT Begründung je Szene
5. Ziel 60 % Animation / 40 % Bilder; bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder
6. dynamische Information animation-first
7. höchstens eine Bildszene direkt hintereinander; Bildszene normalerweise max. 8 Sekunden
8. für jede Bildszene ein konkretes expectedVisual
9. vollständige Google-Flow-Bildprompts mit echten Szenennummern
10. Cover Bild 00 mit konkreter Pflichtüberschrift unter COVER-ÜBERSCHRIFT – EXAKT SO:
11. Remotion-Spezifikationen
12. eine universelle Social-Caption mit exakt 5 relevanten Hashtags
13. Quality-Contract-Metadaten + pending final-qa.json

Bilder erzeugt ausschließlich der Nutzer.
Keine YouTube Shorts.
```

## Bildfreigabe

Cover `Bild 00` neu erzeugen, wenn:

- Pflichtüberschrift fehlt/falsch/abgeschnitten/unlesbar ist
- zusätzlicher Subtitle/CTA/erklärender Satz erscheint
- eigener Balken/Panel/zweiter Hintergrund entsteht

Szenenbild `Bild 01+` neu erzeugen, wenn:

- Motiv nicht exakt zum gesprochenen Beat passt
- Aussage nicht schnell verständlich ist
- zufällige/falsche Wörter oder unerlaubte Labels erscheinen
- Zahl/Fakt falsch ist
- widersprüchliche Zusatzinformation erscheint
- Hintergrund/Bildwelt/Person-Regeln verletzt sind

Remotion darf ein falsches Nutzerbild nicht kaschieren und eine fehlerhafte Cover-Überschrift niemals reparieren.

## Produktionsfreigabe

Ein neues V17-Reel ist erst final, wenn:

- alle erwarteten Nutzerbilder + genau ein finales Voiceover vorhanden sind
- jedes Bild semantisch gegen den Voice-Beat geprüft wurde
- echte Wort-Timings `final-audio-aligned` sind
- finale Timeline vollständig aufgelöst ist
- tatsächliche Animationslaufzeit 55–65 % beträgt
- Captions sicher und synchron sind
- Validator + Typecheck + Preview tatsächlich liefen
- vollständige finale MP4 tatsächlich geprüft wurde
- Audio-QA bestanden ist
- `05-projektdateien/final-qa.json` tatsächlich `passed` ist
- universelle Caption mit genau 5 Hashtags fertig ist

`PRODUCTION COMPLETE` erst danach.
