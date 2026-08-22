# FinanzNeo — Start hier

## Verbindliche Reihenfolge

1. Lies `CLAUDE.md` vollständig.
2. Für Reels lies `docs/3-PHASEN-WORKFLOW.md` und `reels/PRODUKTIONSSTANDARD.md`.
3. Für YouTube-Longform lies `docs/YOUTUBE-LONGFORM-WORKFLOW.md` und `youtube/PRODUKTIONSSTANDARD.md`.
4. Bei Bildaufgaben lies `docs/FINANZNEO-IMAGE-WORLD-V3.md`, `docs/IMAGE-SYSTEM.md`, `docs/IMAGE-PROMPT-LIBRARY.md` und `docs/IMAGE-QA-CHECKLIST.md`.
5. Entscheide den Visualtyp mit `docs/BEAT-TO-IMAGE-RULES.md`.
6. Für Reel-Veröffentlichung lies `docs/PLATFORM-PUBLISHING.md`.
7. Beim Zielprojekt lies den jeweiligen Index, Sammelprompt und Szenen-/Visual-Plan.

`CLAUDE.md` ist die höchste Regelquelle. Bei Widersprüchen gelten ältere Regeln nicht.

## Aktueller Kanalstandard

- deutsche Finanzgrundlagen für Anfänger
- 1080 × 1920, 30 fps
- 60–90 Sekunden als Reel-Standard
- Reel-Plattformen: Instagram Reels, TikTok, Facebook Reels und Snapchat
- YouTube: ausschließlich eigenständige längere Videos unter `youtube/`; keine YouTube Shorts
- YouTube-Video und -Quellbilder: horizontal 16:9; Reel-Quellbilder bleiben 1:1
- Untertitel Pflicht
- Satz-Karaoke direkt unter dem Visual: aktives Wort grün, maximal zwei Zeilen, keine Bewegung
- animation-first: ungefähr 60 % echte Remotion-Mechanismen
- Covertext immer in Remotion; das 1:1-Coverbild bleibt ohne große KI-Headline
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
06-export/
README.md
```

`04-caption/` enthält zusätzlich zur Master-Caption und den Wort-Timings die vier Reel-Plattformdateien:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
```

`youtube-shorts.txt` wird nicht erstellt. Longform-YouTube wird unabhängig davon unter `youtube/` produziert.

## Eigenständiges YouTube-Longform-Projekt

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Phase 1 erstellt Recherche, vollständiges Skript, Kapitel-/Retention-Plan, englische Google-Flow-Prompts, Thumbnail-Brief sowie Titel, Beschreibung, Kapitel, Keywords, Quellen, Kommentar, Community-Post, Upload-Checkliste und Promo-Texte für Instagram, TikTok, Facebook und Snapchat.

In Phase 2 erzeugt der Nutzer jedes 16:9-Bild einzeln, benennt es sofort exakt um und legt alles gemeinsam in `04-visuals/00-ALLE-BILDER-HIER-REIN/`. Dazu kommen genau ein finales Voiceover und echte Wort-Timings.

Phase 3 startet mit:

```text
Mach das YouTube-Video: youtube/<Projekt>
```

Antigravity prüft zuerst `npm run youtube:ready -- youtube/<Projekt>` und arbeitet bei Erfolg ohne Zwischenfragen bis zu Render und QA.

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
4. animation-first Bild-/Remotion-Zuordnung mit ungefähr sechs Mechanismen bei zehn Szenen
5. vollständige Google-Flow-Bildprompts mit echten Szenennummern
6. Remotion-Spezifikationen mit Startzustand, Handlung/Mechanismus und Endzustand sowie sichtbaren Covertext
7. Caption- und Reel-Plattformstruktur für Instagram, TikTok, Facebook und Snapchat

Bilder erzeugt ausschließlich der Nutzer. Antigravity erzeugt keine Bilder.
Keine YouTube Shorts erzeugen. YouTube ist ausschließlich Longform unter `youtube/`.
```

## Übergabe an Antigravity

Nach Phase 2 reicht dieser Auftrag:

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>
```

Antigravity prüft mit `npm run reel:ready -- <Reel-Pfad>`. Bei Erfolg baut und prüft es ohne Zwischenfragen bis zum Render. Es stoppt nur bei einem konkret benannten fehlenden oder widersprüchlichen Pflichtasset beziehungsweise einem nicht selbst lösbaren technischen Fehler.

Der Abschluss liegt immer direkt im Reel-Projekt:

```text
06-export/reel.mp4
06-export/cover.png
```

Antigravity beendet Phase 3 erst nach erfolgreichem `npm run reel:final -- <Reel-Pfad>`.

## Bildfreigabe

Bild neu erzeugen, wenn unter anderem:

- zwei sichtbare Hintergründe/Bänder entstehen
- eine horizontale Trennkante, Floor-Wall-Grenze oder ein Horizont sichtbar ist
- eine dargestellte Person kein klar sichtbares Gesicht hat
- eine große Headline, ein Untertitel oder ein erklärender Satz im KI-Bild erscheint
- Labels falsch oder zufällig sind
- das Bild wie Diorama, Game-Level, Neon-Tunnel, Sci-Fi-Korridor oder Dashboard wirkt

## Produktionsfreigabe

Ein Reel ist erst final, wenn die benötigten Nutzerbilder und das finale Voiceover vorhanden sind, echte Wort-Timings erzeugt wurden, Validator/Typecheck/Preview tatsächlich ausgeführt wurden, Bildsatz + komplette MP4 geprüft wurden und `06-export/reel.mp4` sowie `06-export/cover.png` die Abschlussprüfung bestehen.

Vor Cross-Platform-Reel-Publishing zusätzlich alle vier Reel-Plattformdateien in `04-caption/` fertigstellen und auf dasselbe finale Reel abstimmen.
