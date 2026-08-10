# FinanzNeo — Start hier

## Verbindliche Reihenfolge

1. Lies `CLAUDE.md` vollständig.
2. Lies `reels/PRODUKTIONSSTANDARD.md`.
3. Bei Bildaufgaben lies `docs/FINANZNEO-IMAGE-WORLD-V3.md`, `docs/IMAGE-SYSTEM.md`, `docs/IMAGE-PROMPT-LIBRARY.md` und `docs/IMAGE-QA-CHECKLIST.md`.
4. Entscheide den Visualtyp mit `docs/BEAT-TO-IMAGE-RULES.md`.
5. Für Veröffentlichung lies `docs/PLATFORM-PUBLISHING.md`.
6. Beim Ziel-Reel lies `03-szenen/alle-bildprompts.txt`, `03-szenen/scene-index.json` und `05-projektdateien/szenenplan.md`.

`CLAUDE.md` ist die höchste Regelquelle. Bei Widersprüchen gelten ältere Regeln nicht.

## Aktueller Kanalstandard

- deutsche Finanzgrundlagen für Anfänger
- 1080 × 1920, 30 fps
- 60–90 Sekunden als Reel-Standard
- Reel-Plattformen: Instagram Reels, TikTok, Facebook Reels und Snapchat
- dieselbe universelle Social-Caption auf allen vier Reel-Plattformen
- genau 5 relevante Hashtags pro Caption
- YouTube: ausschließlich eigenständige längere Videos unter `youtube/`; keine YouTube Shorts
- Untertitel Pflicht
- Premium Fintech Editorial 3D + Remotion
- eine starke visuelle Metapher pro Bild
- optional stilisierte 3D-Person; wenn Person, Gesicht klar sichtbar
- kurze deutsche Objektlabels statt großer KI-Überschriften
- genau EIN nahtloser deep-charcoal-green-black Hintergrund von oben bis unten
- keine Prozent-Zonen, Hintergrundbänder, Floor-Wall-Grenze oder sichtbarer Horizont
- Gold nur für Geld/Wert, Rot-Orange nur für Risiko/Verlust/Schulden
- Antigravity erzeugt keine Bilder; der Nutzer erstellt sie selbst mit Google Flow

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

`caption.txt` ist direkt kopierfertig und wird 1:1 für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet. Sie enthält eine starke erste Zeile, kurzen Nutzen/Aha, optional einen natürlichen CTA und exakt 5 passende Hashtags.

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

Lies zuerst vollständig:
- CLAUDE.md
- reels/PRODUKTIONSSTANDARD.md
- docs/FINANZNEO-IMAGE-WORLD-V3.md
- docs/IMAGE-SYSTEM.md
- docs/BEAT-TO-IMAGE-RULES.md
- docs/IMAGE-PROMPT-LIBRARY.md
- docs/IMAGE-QA-CHECKLIST.md
- docs/PLATFORM-PUBLISHING.md

Erstelle selbstständig:
1. Recherche + Quellen
2. geprüftes Skript
3. Szenen-/Beat-Plan
4. Bild-/Remotion-Zuordnung
5. vollständige Google-Flow-Bildprompts mit echten Szenennummern
6. Remotion-Spezifikationen
7. genau eine universelle Social-Caption für alle vier Reel-Plattformen mit exakt 5 relevanten Hashtags

Bilder erzeugt ausschließlich der Nutzer. Antigravity erzeugt keine Bilder.
Keine YouTube Shorts erzeugen. YouTube ist ausschließlich Longform unter `youtube/`.
```

## Bildfreigabe

Bild neu erzeugen, wenn unter anderem:

- zwei sichtbare Hintergründe/Bänder entstehen
- eine horizontale Trennkante, Floor-Wall-Grenze oder ein Horizont sichtbar ist
- eine dargestellte Person kein klar sichtbares Gesicht hat
- eine große Headline, ein Untertitel oder ein erklärender Satz im KI-Bild erscheint
- Labels falsch oder zufällig sind
- das Bild wie Diorama, Game-Level, Neon-Tunnel, Sci-Fi-Korridor oder Dashboard wirkt

## Produktionsfreigabe

Ein Reel ist erst final, wenn die benötigten Nutzerbilder und das finale Voiceover vorhanden sind, echte Wort-Timings erzeugt wurden, Validator/Typecheck/Preview tatsächlich ausgeführt wurden, Bildsatz + komplette MP4 geprüft wurden und die universelle Caption mit genau 5 relevanten Hashtags fertig ist.
