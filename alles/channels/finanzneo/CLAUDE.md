# FinanzNeo — verbindliche Claude-Code-Regeln

## Arbeitsbereich

Das Repository besitzt am Root nur drei Benutzerbereiche:

- `reels/`
- `youtube/`
- `alles/`

Technische Befehle werden aus `alles/` ausgeführt. Aktive Reel-Projekte liegen unter:

```text
../reels/<woche>/<wochentag>/<reel-name>/
```

Nie erneut `channels/finanzneo/reels` am Root oder innerhalb des Technikordners als Produktionsablage erzeugen.

## Automatischer Reel-Start

Bei „Mach ein Reel“, „Erstelle das nächste Finanz-Reel“ oder einer gleichwertigen Anweisung arbeitet Claude ohne unnötige Rückfrage weiter, sofern Thema und kreative Vorgaben eindeutig sind.

Vor der Planung lesen:

- `skills/thema-auswaehlen.md`
- `skills/reel-starten.md`
- `skills/script-schreiben.md`
- `skills/reel-planen.md`
- `gehirn/BILDSTIL.md`
- `gehirn/MASTER-STYLE-PROMPT.md`
- `gehirn/IMAGE-PROMPT-TEMPLATE.md`
- `engine/topic-history.json`

## Verbindliche Ordnerstruktur pro Reel

```text
00-cover/
01-voice-script/
  script.md
  script-fliesstext.txt
  voiceover-anweisung.txt
  voiceover-final.wav
03-szenen/
  alle-bildprompts.txt
  EINZELNE-SZENEN/
    scene-01/
      bildprompt.txt
      scene-01-<name>.png
      szene.md
  scene-index.json
04-caption/
05-review/
06-video/
render/
timeline/
```

Es gibt keinen getrennten `02-audio/`-Ordner. Es gibt keinen zentralen `BILDER-HIER-EINFUEGEN/`-Ordner. Jede Bilddatei liegt direkt neben dem zugehörigen `bildprompt.txt`.

Die Reihenfolge außerhalb des Reels ist immer:

```text
Woche → Wochentag → Reel-Thema
```

## Produktionsmodus: bildgeführtes Hybrid-Reel

Standardmäßig:

- 5 bis 9 Szenen,
- mehr Bildszenen als Animationsszenen,
- Zielwert 5 Bilder und 2 Remotion-Animationen,
- höchstens 40 Prozent Animationsszenen,
- keine zwei Animationen direkt hintereinander,
- keine Dashboard-Szene als Standardlösung.

Bilder tragen die Hauptästhetik. Remotion-Animationen erklären nur Abläufe, Transformationen, Ursache-Wirkung, Zeitverläufe oder Mechanismen, die als Standbild schlechter verständlich wären.

## Skript

- klare Anfängerfrage oder sofort verständlicher Erklär-Hook,
- pro Szene genau eine neue Aussage,
- keine künstliche Motivation oder unklare Metaphern,
- Payoff beantwortet die Hook,
- Finanzbehauptungen mit Quellen oder nachvollziehbarer Rechnung absichern.

## Bildstil

Verbindliche Dateien:

- `gehirn/BILDSTIL.md`
- `gehirn/MASTER-STYLE-PROMPT.md`
- `gehirn/IMAGE-PROMPT-TEMPLATE.md`

Jede Bildszene erhält einen vollständigen englischen Bildprompt. Zusätzlich müssen alle Bildprompts gemeinsam in `03-szenen/alle-bildprompts.txt` stehen.

Nicht verwenden:

- Fotorealismus,
- reale Menschen,
- Pixar-, Clay- oder Kinderfilmstil,
- UI-Dashboards,
- sterile Produkt-Renderings,
- flache 2D-Infografiken,
- überladene Miniaturstädte,
- unverbundene Icon-Sammlungen,
- unnötige Partikel oder Neon.

## Pflichtdateien

1. `01-voice-script/script.md`
2. `01-voice-script/script-fliesstext.txt`
3. `01-voice-script/voiceover-anweisung.txt`
4. `03-szenen/alle-bildprompts.txt`
5. `03-szenen/scene-index.json`
6. `04-caption/social-caption.md`
7. `05-review/quellen.md`
8. `05-review/production-status.json`
9. `timeline/storyboard.md`
10. `timeline/motion-design.md`
11. `timeline/codex-reel-package.json`

## Medien

```text
<projektordner>/01-voice-script/voiceover-final.wav
<projektordner>/03-szenen/EINZELNE-SZENEN/<scene>/<bilddatei>.png
<projektordner>/04-caption/voiceover-final.captions.json
```

Der Bildpfad und der Promptpfad jeder Bildszene müssen denselben Elternordner verwenden.

## Befehle

Aus `alles/`:

```bash
npm run finance:codex-reel:check -- <projektordner>
npm run finance:codex-reel:check-ready -- <projektordner>
npm run finance:codex-reel:captions -- <projektordner>
```

Ein Projektpfad beginnt normalerweise mit `../reels/`.

## Sicherheitsregeln

- Keine globalen Animations-Feature-Flags aktivieren.
- Kein automatisches Routing aktivieren.
- Keine produktive Composition ohne ausdrückliche Freigabe verändern.
- Draft-PRs nicht selbst auf „Ready for review“ setzen.
- Nichts nach `main` mergen.
- Technische Prüfung nicht als kreative oder menschliche Freigabe darstellen.
