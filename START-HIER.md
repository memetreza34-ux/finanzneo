# FinanzNeo — Start hier

## So funktioniert dieses Repo

Ein Reel entsteht in drei Phasen. Jede Phase hat **genau ein** Einstiegsdokument.

```text
PHASE 1 — ChatGPT               PHASE 2 — Du              PHASE 3 — Executor laut scene-index
Recherche, Skript,              Bilder in Google Flow,    Remotion bauen,
Szenenplan, Bildprompts,   →    Voiceover aufnehmen,  →   prüfen, Candidate rendern,
Captions                        Wortzeiten erzeugen       Render-QA + Export

docs/PHASE-1-BRIEFING.md        docs/3-PHASEN-           Antigravity: MASTER-PROMPTS.md
(komplett in ChatGPT              WORKFLOW.md            Claude Code: Reel-Auftrag
 kopieren)                                               docs/PHASE-3-COMPLETION-GATE.md
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

## Phase-3-Fertigkeitsgate

Eine erzeugte MP4 ist **kein** Fertigkeitsnachweis. Das verbindliche Verfahren
steht in `docs/PHASE-3-COMPLETION-GATE.md`.

Nach grünem `reel:ready`:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
# jede Bild-/Animationsszene wirklich implementieren und Manifest vervollständigen
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

`reel:render` erzeugt bei produktiven Reels zuerst nur eine
`*.phase3-candidate.mp4`. Die Candidate-Datei wird **erst nach bestandener
Post-Render-QA** zum finalen MP4 umbenannt.

Die QA prüft für jede Szene die mittlere Visualzone. Bildszenen müssen echten
sichtbaren Bildinhalt besitzen. Animationsszenen müssen sichtbaren Inhalt **und
messbare Veränderung** zwischen mehreren Frames zeigen. Eine Szene mit nur
Untertitel/Headline auf dunklem Hintergrund gilt als unvollständig.

Der Export prüft danach zusätzlich den exakten SHA-256-Hash des geprüften
Videos und blockiert, wenn `scene-index.json` oder das Produktionsmanifest nach
der QA verändert wurden.

## Was automatisch geprüft wird

```bash
npm run validate                           # Repo gesamt
npm run validate:image-world               # globaler Physical-Explainer-/1:1-Lock
npm run reel:validate -- <Reel-Pfad>       # Reel-Verträge inkl. Phase-3-Completion-Contract
npm run reel:ready -- <Reel-Pfad>          # Phase 1 + 2 + Medien lesbar
npm run reel:phase3:preflight -- <Reel>    # jede geplante Szene wirklich implementiert
npm run reel:phase3:qa -- <Reel> <Video>   # Post-Render-Sichtbarkeit + Animationsbewegung
```

Blockiert unter anderem: fehlende oder nichtssagende Zwischenüberschriften,
Überschriften aus reinen Zahlen, doppelte Überschriften, nicht existierende
Icons, Bildbeats über 6 Sekunden, Lücken in der Timeline, Text-Stroke auf
Untertiteln, fehlende Bildwelt-Locks, falsches Seitenverhältnis, fehlende
Plattformtexte, fehlendes Audio/Wortzeiten sowie in Phase 3 fehlende
Bild-/Animationsimplementierungen und visuell leere Caption-only-Szenen.

Das zentrale Scene-Schema liegt in `scripts/lib/reel-scene-schema.mjs`.
Redundante Angaben werden nicht künstlich doppelt erzwungen: der Szenenordner
kann aus `planFile` und die semantische Akzentrolle aus `headerTone` abgeleitet
werden. Der eigentliche Bildprompt bleibt die Wahrheit für Objektlabels.

## Vertiefende Dokumente

| Thema | Datei |
|---|---|
| Projekt-Gehirn (höchste Regelquelle) | `CLAUDE.md` |
| Phase-3-Fertigkeits-/Render-QA-Gate | `docs/PHASE-3-COMPLETION-GATE.md` |
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

In Phase 3 entstehen zusätzlich:

```text
05-projektdateien/phase3-production-manifest.json
05-projektdateien/phase3-render-qa.json
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
Geschmacksrückfragen weiter. Er darf aber erst `FINAL_COMPLETE` melden, wenn
Produktionsmanifest, Preflight, Candidate-Render, Post-Render-QA und Export
alle erfolgreich waren.

## Export-Sicherheit

Abschluss ist immer:

```bash
npm run reel:export -- <Reel-Pfad> <exakter-gerenderter-MP4-Pfad>
```

Ohne zweiten Parameter darf der Export nur dann automatisch auswählen, wenn
die MP4 eindeutig dem Reel zugeordnet werden kann oder `out/` genau eine
finale MP4 enthält. Candidate-Dateien werden ignoriert.

Zusätzlich muss die ausgewählte MP4 exakt den SHA-256-Hash aus dem bestandenen
`phase3-render-qa.json` besitzen. Damit kann weder ein fremdes noch ein alter
oder nachträglich veränderter Render in `06-export/` gelangen.

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

Ein Reel ist erst final, wenn die benötigten Nutzerbilder und das finale
Voiceover vorhanden sind, echte Wort-Timings erzeugt wurden, **jede**
`scene-index`-Szene wirklich als Bild oder Animation umgesetzt wurde,
`reel:phase3:preflight` erfolgreich war, der Candidate-Render die automatische
Post-Render-Visual-QA bestanden hat und `06-export/` vollständig ist.

**Eine vorhandene MP4 allein bedeutet niemals „fertig“.**
