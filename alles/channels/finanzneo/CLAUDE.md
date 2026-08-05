# FinanzNeo — verbindliche Claude-Code-Regeln

## Arbeitsbereich

Das Repository besitzt am Root drei Benutzerbereiche:

- `reels/`
- `youtube/`
- `alles/`

Technische Befehle werden aus `alles/` ausgeführt. Aktive Reel-Projekte liegen unter:

```text
../reels/<woche>/<wochentag>/<reel-name>/
```

Nie erneut `channels/finanzneo/reels` als Produktionsablage erzeugen.

## Verbindliche Ordnerstruktur pro Reel

```text
00-cover/
01-voice-script/
  script.md
  script-fliesstext.txt
  voiceover-anweisung.txt
02-audio/
  <genau eine Audiodatei mit beliebigem Namen>
03-szenen/
  alle-bildprompts.txt
  EINZELNE-SZENEN/
    scene-01/
      bildprompt.txt
      szene.md
      <genau eine Bilddatei mit beliebigem Namen>
    scene-02/
      animation.md
  scene-index.json
04-caption/
05-review/
06-video/
render/
timeline/
```

Die Reihenfolge außerhalb des Reels ist immer:

```text
Woche → Wochentag → Reel-Thema
```

## Automatische Medienerkennung

### Audio

Der Nutzer legt genau eine unterstützte Datei in `02-audio/` ab. Der Dateiname ist egal.

Unterstützte Formate:

```text
.wav .mp3 .m4a .aac .flac .ogg .opus .mp4 .mov .m4v .webm
```

Auch eine Datei wie `F 1.mp4` ist gültig, sofern sie eine Audiospur enthält. Claude verwendet den Pfad, den `finance:codex-reel:check-ready` ausgibt.

### Bilder

Bei einer Bildszene liegt genau eine unterstützte Bilddatei im zugehörigen `scene-XX`-Ordner. Der Ordner bestimmt die Szenennummer, nicht der Dateiname.

Unterstützte Formate:

```text
.png .jpg .jpeg .webp .avif
```

Beispiele:

```text
scene-01/irgendein-name.jpeg → Szene 1
scene-03/bild-final.png       → Szene 3
scene-06/export.webp          → Szene 6
```

Bei null oder mehreren passenden Mediendateien in einem erwarteten Ordner stoppen und die gefundenen Kandidaten nennen. Niemals raten.

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

Jede Bildszene erhält einen vollständigen englischen Bildprompt. Zusätzlich stehen alle Bildprompts gemeinsam in `03-szenen/alle-bildprompts.txt`.

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
