# FinanzNeo — verbindliche Claude-Code-Regeln

## Worktree

FinanzNeo arbeitet ausschließlich im registrierten `main`-Worktree, normalerweise:

```text
/Users/arman/Studio-Clon
```

Vor jeder Aufgabe an der Repo-Wurzel:

```bash
npm run finance:update
```

Der Befehl schaltet keinen Branch um. In einer laufenden Kanal-Session sind `git switch`, `git checkout`, `git reset --hard`, `git clean -fd`, `git worktree remove` und `git worktree move` verboten.

## Automatischer Reel-Start

Bei „Mach ein Reel“, „Erstelle das nächste Finanz-Reel“ oder einer gleichwertigen Anweisung arbeitet Claude ohne unnötige Rückfrage weiter.

Claude liest:

- `skills/thema-auswaehlen.md`
- `skills/reel-starten.md`
- `skills/script-schreiben.md`
- `skills/reel-planen.md`
- `engine/topic-history.json`

Bereits verwendete, reservierte oder sehr ähnliche Themen werden ausgeschlossen. Genau ein Thema wird genau einem freien Wochentag zugeordnet.

```bash
npm run finance:new -- <slug> \
  --topic="Eindeutiges Thema" \
  --title="Kurzer Reel-Name" \
  --publish-date=YYYY-MM-DD \
  --selection-mode=trend|evergreen|user \
  --selection-reason="Konkreter Auswahlgrund" \
  --selected-by=assistant|user
```

## Produktionsmodus: `image-first-lite`

Die Bilder erklären den Inhalt. Remotion ergänzt nur wenige ruhige Standardbewegungen.

Erlaubt:

- 8–10 eigenständige Bilder,
- Voiceover,
- deutsche Zwischenüberschrift und passendes Icon,
- deutsche Wortuntertitel,
- statisches CTA-Keyword,
- harte Schnitte,
- langsamer Zoom bis höchstens 1,035,
- minimale horizontale oder vertikale Bildfahrt bis höchstens 12 Pixel,
- kurze lineare Einblendung von Überschrift und Icon,
- finaler Export und Video-QA.

Nicht verwenden:

- Motion Router als Produktionspflicht,
- Push, Wipe, Zoom-through oder Match-Move,
- 2,5D-Kamera oder Perspektivwechsel,
- Partikel, animierter Glow oder schwebende Dekoelemente,
- komplexe Diagramm-, Karten- oder Zahlenanimationen,
- mehrere inhaltliche Animationsphasen in einer Szene,
- SFX und Musikbett,
- hektische Bewegung.

Alle Szenen verwenden `transition: "cut"`. Jede Szene besitzt höchstens eine `visualPhase` bei `at: 0`. Zoom und minimale Bildfahrt erzeugt der Renderer automatisch.

## Skript

- 150–200 Wörter,
- 10–14 kurze Szenen,
- normalerweise ein Satz pro Szene,
- starke Hook mit sofortiger persönlicher Geldfolge,
- pro Szene genau eine neue Aussage,
- Payoff beantwortet die Hook,
- jede Aussage muss als einzelnes Bild verständlich sein.

## Bildanzahl

Für ein normales Reel werden **8–10 eigenständige Bilder** geplant. Zielwert: 8.

Payoff und CTA dürfen das unmittelbar vorherige Bild weiterverwenden. Ein Bild darf keine mehreren unverbundenen Aussagen tragen.

## Bildstil — aktuell nicht definiert

Das bisherige Bildpromptsystem (v6, inkl. `gehirn/BILDSTIL.md`) wurde am 2026-07-31 komplett entfernt, weil die erzeugten Bilder nicht dem gewünschten Look entsprachen. Es gibt aktuell **keine verbindlichen Stilregeln**.

Bis ein neuer Stil festgelegt ist:

- Das strukturierte `imageBrief`-Feld gibt es nicht mehr (aus dem Szenen-Schema entfernt). Jede Bildszene bekommt stattdessen direkt ein `imagePrompt` (freier englischer Text).
- Es gibt aktuell **kein automatisches Werkzeug**, das den Bildprompt baut — `imagePrompt` je Szene und `prompt-manifest.json` müssen manuell geschrieben werden, sobald der neue Stil steht.
- Vor dem nächsten Reel mit Arman gemeinsam einen neuen Bildstil definieren und dokumentieren, bevor wieder produktiv Bilder generiert werden.

## Pflichtablauf

Nach dem Scaffold vollständig schreiben:

1. `01-script-audio/script.md`
2. `01-script-audio/script-fliesstext.txt`
3. `01-script-audio/voiceover.txt`
4. `03-caption/social-caption.md`
5. `04-pdf/inhalt.md`
6. `06-projektdateien/sources.md`
7. `06-projektdateien/storyboard.md`
8. `06-projektdateien/motion-design.md` als einfacher Schnitt- und Bewegungsplan
9. `06-projektdateien/scene-plan.json`
10. `06-projektdateien/production-status.json`

Danach:

```bash
npm run finance:script-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:creative-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:content-ready -- <projektordner>
```

## Visuelle Prüfung nach der Bildgenerierung

Vor `assetsReviewed=true` jedes Bild prüfen:

1. Aussage ohne Prompt verständlich,
2. Hauptmotiv sofort erkennbar,
3. Handlung und Ergebnis sichtbar,
4. realer Ort und Gegenstände plausibel,
5. keine erfundene Maschine,
6. natürliche Farben,
7. kein unerwünschter Text, Logo oder Wasserzeichen,
8. genug Platz für Überschrift und Untertitel,
9. gleiche Bildwelt innerhalb des Reels.

Ein schönes, aber inhaltlich falsches Bild wird ersetzt.

## Medien und Render

```text
<projektordner>/01-script-audio/audio/voiceover-final.wav
<projektordner>/02-bilder/images/
```

Danach:

```bash
npm run finance:assets -- <projektordner>
npm run finance:align -- <projektordner>/06-projektdateien/scene-plan.json <projektordner>/03-caption/voiceover-final.captions.json <projektordner>/01-script-audio/audio/voiceover-final.wav
npm run finance:ready -- <projektordner>
npm run finance:render -- <projektordner>
```

Ein Reel gilt erst als fertig, wenn Inhaltspaket, READY, Render-QA und Exportprüfung bestanden sind.
