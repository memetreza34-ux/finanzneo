# FinanzNeo — Start hier

## So funktioniert dieses Repo

Ein Reel entsteht in drei Phasen. Jede Phase hat **genau ein** Einstiegsdokument.

```text
PHASE 1 — ChatGPT               PHASE 2 — Du              PHASE 3 — Executor laut scene-index
Recherche, Skript,              Bilder in Google Flow,    Remotion bauen,
Szenenplan, Bildprompts,   →    Voiceover aufnehmen,  →   prüfen, rendern,
Captions                        Wortzeiten erzeugen       QA + Export

docs/PHASE-1-BRIEFING.md        docs/3-PHASEN-           Antigravity: MASTER-PROMPTS.md
(komplett in ChatGPT              WORKFLOW.md            Claude Code: Reel-Auftrag
 kopieren)                                               npm run reel:ready -- <Reel-Pfad>
```

**Wichtig zu Phase 1:** ChatGPT hat keinen Zugriff auf dieses Repository. Ein
Prompt wie „halte dich an die Repo-Regeln" läuft ins Leere. Deshalb enthält
`docs/PHASE-1-BRIEFING.md` alle Regeln ausgeschrieben und wird vollständig
kopiert.

## Die eine Wahrheit

Layout-, Untertitel- und Übergangswerte stehen **im Code**:
`REEL_STYLE` in `src/brand/tokens.ts`.

Per-Reel-Felder wie alte `headlineColor`- oder `continuityFramesMax`-Werte sind
nur historische Metadaten und dürfen `REEL_STYLE` nicht überschreiben.
`npm run validate:consistency` prüft die zentralen Regeln automatisch.

Für neue Reel-Bilder gilt zusätzlich der globale Physical-Explainer-Lock:
`config/finanzneo-image-world-lock.json`. Er erweitert die bestehende V4-Welt,
ersetzt sie nicht. Details: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`.

## Phase-3-Executor

`03-szenen/scene-index.json` entscheidet mit `phase3Executor`, wer Phase 3 baut:

| Wert | Übergabe |
|---|---|
| `antigravity` | `MASTER-PROMPTS.md`, Abschnitt Phase 3 |
| `claude-code` | `05-projektdateien/CLAUDE-CODE-AUFTRAG.md` im Reel |

`npm run reel:ready -- <Reel-Pfad>` prüft den Wert und nennt nach erfolgreicher
Prüfung den tatsächlich vorgesehenen Executor. Bei `claude-code` muss der
Reel-spezifische Auftrag vorhanden und vollständig sein.

## Was automatisch geprüft wird

```bash
npm run validate                      # Repo gesamt: Lint, Tests, Konsistenz, Image-World, Typecheck
npm run validate:image-world          # globaler Physical-Explainer-/1:1-Lock
npm run reel:validate -- <Reel-Pfad>  # Reel: Schema, Bildwelt, Szenenqualität, Publishing
npm run reel:ready -- <Reel-Pfad>     # Phase-3-Freigabe: zusätzlich Assets prüfen
```

Blockiert unter anderem: fehlende oder nichtssagende Zwischenüberschriften,
Überschriften aus reinen Zahlen, doppelte Überschriften, nicht existierende
Icons, Bildbeats über 6 Sekunden, Lücken in der Timeline, Text-Stroke auf
Untertiteln, träge zentrale Übergänge, fehlende Bildwelt-Locks, falsches
Seitenverhältnis, fehlende Plattformtexte, fehlendes Audio oder Wortzeiten.

Das zentrale Scene-Schema liegt in `scripts/lib/reel-scene-schema.mjs`.
Redundante Angaben werden nicht künstlich doppelt erzwungen: der Szenenordner
kann aus `planFile` und die semantische Akzentrolle aus `headerTone` abgeleitet
werden. Der eigentliche Bildprompt bleibt die Wahrheit für Objektlabels.

## Vertiefende Dokumente

| Thema | Datei |
|---|---|
| Projekt-Gehirn (höchste Regelquelle) | `CLAUDE.md` |
| Globaler Physical-Explainer-/1:1-Bildwelt-Lock | `docs/GLOBAL-IMAGE-WORLD-LOCK.md` |
| Untertitel, Überschriften, Timing | `docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md` |
| Bildwelt | `docs/FINANZNEO-IMAGE-WORLD-V3.md`, `docs/IMAGE-SYSTEM.md` |
| Bildprompts | `docs/IMAGE-PROMPT-LIBRARY.md`, `docs/IMAGE-QA-CHECKLIST.md` |
| Bild oder Animation? | `docs/BEAT-TO-IMAGE-RULES.md` |
| Veröffentlichung | `docs/PLATFORM-PUBLISHING.md` |
| Produktionsstandard Reels | `reels/PRODUKTIONSSTANDARD.md` |
| YouTube-Longform (eigener Prozess) | `docs/YOUTUBE-LONGFORM-WORKFLOW.md` |

`CLAUDE.md` ist die höchste Regelquelle. Bei Widersprüchen gelten ältere Regeln nicht.

## Aktueller Kanalstandard

- deutsche Finanzgrundlagen für Anfänger
- 1080 × 1920, 30 fps
- 60–90 Sekunden als Reel-Standard
- Reel-Plattformen: Instagram Reels, TikTok, Facebook Reels und Snapchat
- YouTube: ausschließlich eigenständige längere Videos unter `youtube/`; keine YouTube Shorts
- YouTube-Video und -Quellbilder: horizontal 16:9; Reel-Quellbilder inklusive Cover bleiben 1:1
- Untertitel Pflicht
- Premium Stylized 3D V5 + Physical Explainer Editorial V7 + Remotion
- pro neuem Flow-Bild ein großes physisches Hero-Objekt + 3–6 konkrete themenspezifische Alltagsobjekte
- keine Dashboard/UI-, Microchip/Circuit-Board-, Gameboard-, Orbit- oder Vier-Ecken-Tile-Komposition
- optional stilisierte 3D-Person; wenn Person, Gesicht klar sichtbar
- kurze deutsche physische Objektlabels statt großer KI-Überschriften
- genau EIN nahtloser deep-charcoal-green-black Hintergrund von oben bis unten
- keine Prozent-Zonen, Hintergrundbänder, Floor-Wall-Grenze oder sichtbarer Horizont
- Gold nur für Geld/Wert, Rot-Orange nur für Risiko/Verlust/Schulden
- Antigravity/Claude Code erzeugen keine Bilder; der Nutzer erstellt sie selbst mit Google Flow

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

## Neuer Reel-Start

```text
Neues FinanzNeo-Reel.

Thema: [THEMA]

Nutze vollständig `docs/PHASE-1-BRIEFING.md`.
Erstelle Recherche, geprüftes szenenweises Skript, Szenen-/Beat-Plan,
Bild-/Remotion-Zuordnung, vollständige Google-Flow-Prompts mit echten
Szenennummern, Remotion-Spezifikationen und Plattformtexte.

Bilder erzeugt ausschließlich der Nutzer. Keine YouTube Shorts.
```

## Übergabe an Phase 3

Nach Phase 2 reicht:

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>
```

Zuerst läuft:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Bei Erfolg baut der in `phase3Executor` festgelegte Executor ohne
Geschmacksrückfragen bis Render, QA und Export.

## Export-Sicherheit

Abschluss ist immer:

```bash
npm run reel:export -- <Reel-Pfad> <exakter-gerenderter-MP4-Pfad>
```

Ohne zweiten Parameter darf der Export nur dann automatisch auswählen, wenn
die MP4 eindeutig dem Reel zugeordnet werden kann oder `out/` genau eine MP4
enthält. Bei mehreren nicht eindeutig zuordenbaren MP4s bricht er ab. Dadurch
kann kein fremdes Reel versehentlich in ein anderes `06-export/` gelangen.

## Bildfreigabe

Bild neu erzeugen, wenn unter anderem:

- zwei sichtbare Hintergründe/Bänder entstehen
- eine horizontale Trennkante, Floor-Wall-Grenze oder ein Horizont sichtbar ist
- eine dargestellte Person kein klar sichtbares Gesicht hat
- eine große Headline, ein Untertitel oder ein erklärender Satz im KI-Bild erscheint
- Labels falsch oder zufällig sind
- das Bild wie Dashboard/UI, Microchip/Circuit-Board, Gameboard, Orbit-Modul,
  Vier-Ecken-Kachelsystem, Diorama, Neon-Tunnel oder sterile Produktwerbung wirkt

## Produktionsfreigabe

Ein Reel ist erst final, wenn die benötigten Nutzerbilder und das finale Voiceover
vorhanden sind, echte Wort-Timings erzeugt wurden, Validator/Typecheck/Preview
tatsächlich ausgeführt wurden, Bildsatz + komplette MP4 geprüft wurden und
`06-export/` vollständig ist.
