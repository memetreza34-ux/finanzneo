# Skill: Neues FinanzNeo-Reel starten

## Auslöser

Diese Anweisung gilt automatisch bei „Mach ein Reel“, „Ich möchte ein Reel“ oder sinngleichen Formulierungen.

## Nicht nach dem Thema fragen

Claude wählt das Thema selbst. Nur wenn der Nutzer ausdrücklich ein Thema vorgibt, wird diese Vorgabe übernommen.

Vor jeder Wahl lesen:

- `skills/thema-auswaehlen.md`
- `engine/topic-history.json`
- `skills/script-schreiben.md`
- `skills/reel-planen.md`

Aktuelle Trends werden geprüft, aber nicht erzwungen. Ein Trendthema wird nur verwendet, wenn es aktuell, belastbar belegt, für Finanzanfänger relevant und klar visualisierbar ist. Sonst gewinnt ein starkes unbenutztes Evergreen-Thema.

## Automatischer Ablauf

1. Themenregister lesen und Wiederholungen ausschließen.
2. Trendkandidaten und Evergreen-Kandidaten bewerten.
3. genau ein Thema auswählen und den Auswahlgrund formulieren.
4. Wochenordner unter `channels/finanzneo/reels/` lesen.
5. ersten freien Tagesplatz der aktiven Woche wählen; pro Nummer genau ein Reel.
6. Veröffentlichungsdatum dieses einen Tages bestimmen.
7. genau einen Projektordner anlegen:

```bash
npm run finance:new -- <slug> \
  --topic="Eindeutiges neues Thema" \
  --title="Kurzer Reel-Name" \
  --publish-date=YYYY-MM-DD \
  --selection-mode=trend|evergreen|user \
  --selection-reason="Konkreter Auswahlgrund" \
  --selected-by=assistant|user
```

8. prüfen, dass exakt dieser eine Ordner entstanden ist:

```text
channels/finanzneo/reels/<YYYY-MM-DD_bis_YYYY-MM-DD>/<NN_Reel-Name>/
```

9. keine weiteren Tagesordner oder Themen derselben Woche vorsorglich anlegen.
10. den angelegten Ordner im selben Arbeitsdurchlauf vollständig ausarbeiten.

Beispiel:

```text
channels/finanzneo/reels/2026-07-27_bis_2026-08-02/03_Zinseszins-Fruehstart/
```

`01` bis `07` stehen für Montag bis Sonntag. Kein weiterer Slug-Unterordner.

## Verboten

- Nutzer nach einem Thema fragen, obwohl keine Vorgabe gemacht wurde.
- sieben Themen auf einmal auswählen.
- alle sieben Tagesordner vorsorglich anlegen.
- zwei Reel-Ordner mit derselben Tagesnummer anlegen.
- nach dem leeren Scaffold stoppen.
- nur `scene-plan.json` füllen und die nutzerfreundlichen Dateien leer lassen.
- dem Nutzer erst eine Themenliste zur Auswahl geben.

## Pflichtstruktur des einen Reel-Ordners

```text
<projektordner>/
├── README.md
├── 01-script-audio/
│   ├── script.md
│   ├── script-fliesstext.txt
│   ├── voiceover.txt
│   └── audio/
│       ├── voiceover-final.wav
│       └── sfx/
├── 02-bilder/
│   ├── bildprompts.md
│   ├── prompts/
│   │   └── <NN>-<szene>.txt
│   └── images/
├── 03-caption/
│   ├── voiceover-final.captions.json
│   └── social-caption.md
├── 04-pdf/
│   ├── inhalt.md
│   └── <lead-magnet>.pdf
├── 05-export/
└── 06-projektdateien/
    ├── storyboard.md
    ├── motion-design.md
    ├── scene-plan.json
    ├── production-status.json
    ├── sources.md
    ├── prompt-manifest.json
    ├── asset-manifest.json
    ├── ready-report.json
    ├── qa-report.json
    ├── content-package-report.json
    ├── data/
    └── render/
```

## Was im selben Durchlauf fertig sein muss

Nach `finance:new` darf Claude nicht antworten, bevor diese nutzerfreundlichen Inhalte vollständig geschrieben sind:

1. `01-script-audio/script.md`
2. `01-script-audio/script-fliesstext.txt`
3. `01-script-audio/voiceover.txt`
4. `02-bilder/bildprompts.md`
5. `02-bilder/prompts/*.txt`
6. `03-caption/social-caption.md`
7. `04-pdf/inhalt.md`
8. `06-projektdateien/sources.md`
9. `06-projektdateien/storyboard.md`
10. `06-projektdateien/motion-design.md`
11. `06-projektdateien/scene-plan.json`
12. `06-projektdateien/production-status.json`

Danach verpflichtend:

```bash
npm run finance:content-ready -- <projektordner>
```

Nur bei grünem Inhaltspaket-Bericht darf Claude mitteilen:

- welches Thema gewählt wurde,
- ob es Trend oder Evergreen ist,
- welcher einzelne Wochentag verwendet wurde,
- wo Audio eingefügt wird,
- wo Bilder eingefügt werden.

Audio, generierte Bilder und Wort-Zeitstempel können erst nach den externen Generierungsschritten ergänzt werden. Alle Texte, Briefs, Prompts und Produktionspläne müssen vorher fertig sein.

## Skript zuerst

1. klare zentrale Zuschauerfrage festlegen.
2. Hook als direkte Frage oder starke Aussage schreiben.
3. Thema oder Finanzobjekt sofort in der Hook nennen.
4. 150–200 Wörter auf 10–14 kurze Szenen verteilen.
5. normalerweise genau einen gesprochenen Satz pro Szene verwenden.
6. jede Szene auf genau eine neue Aussage begrenzen.
7. für jeden Satz ein konkretes Visual festlegen.
8. Meta-Sätze vollständig entfernen.
9. Payoff als direkte Antwort auf die Hook schreiben.
10. Skript-QA bestehen:

```bash
npm run finance:script-qa -- <projektordner>/06-projektdateien/scene-plan.json
```

Bei roter Skript-QA keine Skriptfreigabe und keine Bildprompt-Phase.

## Visualentscheidung pro Satz

Für jeden gesprochenen Satz neu wählen:

- neues Einzelbild,
- Vorher/Nachher oder 2-in-1,
- 3-in-1 für Ausgangslage → Mechanismus → Folge,
- 4-in-1 für genau vier kurze gleichwertige Punkte,
- Remotion für Zahlen, Formeln, Diagramme, Zeitachsen und Geldflüsse,
- bestehendes Bild nur bei echter Zustandsänderung.

Zoom, Glow, Schweben oder Text-Fade zählen nicht als neue Visualisierung. Unterschiedliche Aussagen dürfen nicht bequem dasselbe Bild teilen.

## Inhaltspaket fertigstellen

1. Skript, Quellen und Szenenplan finalisieren.
2. `script-fliesstext.txt` exakt mit `scene-plan.json.scriptText` synchronisieren.
3. `voiceover.txt` als reinen direkt kopierbaren Text ausfüllen.
4. Social Caption fertig schreiben.
5. 6–9 Bildbeats planen, Zielwert 7.
6. für jede Bildszene ein `imagePrompt` schreiben (kein automatisches Werkzeug aktuell — Bildstil wird gerade neu definiert).
7. Skript-QA ausführen und nur bei Grün `scriptApproved=true` setzen.
8. Designanker anhand einer repräsentativen Szene prüfen und dokumentieren.
9. `prompt-manifest.json` manuell anlegen (Szene, Promptdatei, erwarteter Bilddateiname).

10. Social-Caption-QA ausführen.
11. PDF-Inhalt, Storyboard und Motion-Plan vollständig schreiben.
12. alle TODO-, KEYWORD- und Platzhaltertexte entfernen.
13. `npm run finance:content-ready -- <projektordner>` erfolgreich ausführen.
14. erst dann das Inhaltspaket und die Ablageorte nennen.

## Danach: externe Medien

- Bilder exakt nach `prompt-manifest.json` benennen und in `02-bilder/images/` legen.
- finale Stimme als `01-script-audio/audio/voiceover-final.wav` ablegen.
- Wort-Captions als `03-caption/voiceover-final.captions.json` ablegen.
- bei PDF-CTA eine gültige PDF nach `04-pdf/` legen.

Anschließend:

```bash
npm run finance:assets -- <projektordner>
npm run finance:align -- <projektordner>/06-projektdateien/scene-plan.json <projektordner>/03-caption/voiceover-final.captions.json <projektordner>/01-script-audio/audio/voiceover-final.wav
npm run finance:ready -- <projektordner>
npm run finance:render -- <projektordner>
```

## Harte Abbruchregel

Fehlt Struktur, klares Skript, grüne Skript-QA, Voiceover-Text, Social Caption, Einzelprompt, Prompt-QA, PDF-Inhalt, Storyboard, Motion-Plan oder grüner Inhaltspaket-Bericht:

- den Nutzer noch nicht um Audio oder Bilder bitten,
- nicht behaupten, das Inhaltspaket sei fertig,
- keine Platzhalter akzeptieren,
- nur die fehlende Inhaltsstufe reparieren.

Fehlen später Audio, Wort-Captions, Bilder, gültige PDF, Manifest, Alignment oder Medienfreigabe:

- kein Remotion,
- kein Preview,
- kein Render,
- nur konkrete Fehlteilliste ausgeben.
