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
- `gehirn/BILDSTIL.md`
- `gehirn/MASTER-STYLE-PROMPT.md`
- `gehirn/IMAGE-PROMPT-TEMPLATE.md`
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
- 9–13 kurze Szenen,
- normalerweise ein Satz pro Szene,
- starke Hook mit sofortiger persönlicher Geldfolge,
- pro Szene genau eine neue Aussage,
- Payoff beantwortet die Hook,
- jede Aussage muss als einzelnes Bild verständlich sein.

Kein CTA-Baustein ("Kommentiere X …") am Ende — der Payoff ist die letzte Szene. Nur auf ausdrücklichen Wunsch des Nutzers wieder eine CTA-Szene (`layout: "cta"`) ergänzen.

## Bildanzahl

Für ein normales Reel werden **8–12 eigenständige Bilder** geplant. Zielwert: 8, aber bei Bedarf (z.B. mehr Zwischenschritte oder Vergleiche) dürfen es mehr sein.

Der Payoff darf das unmittelbar vorherige Bild weiterverwenden. Ein Bild darf keine mehreren unverbundenen Aussagen tragen.

## Bildstil — verbindlich

FinanzNeo verwendet ab jetzt ein festes stilisiertes 3D-Illustrationssystem.

Verbindliche Dateien:

- `gehirn/BILDSTIL.md` — Regeln, Figuren, Farben, Komposition und Verbote
- `gehirn/MASTER-STYLE-PROMPT.md` — unveränderter Master-Stilblock für jeden Bildprompt
- `gehirn/IMAGE-PROMPT-TEMPLATE.md` — Aufbau, Szenenlogik und Beispiele

Jede Bildszene bekommt weiterhin direkt ein freies englisches `imagePrompt`-Feld. Der Prompt muss jedoch immer aus folgenden Teilen bestehen:

1. finanzielle Kernaussage,
2. eine konkrete zusammenhängende Szene oder visuelle Metapher,
3. optionale kurze deutsche Labels,
4. Komposition und Negativraum,
5. vollständiger unveränderter Master-Stilblock.

Der Agent darf Szene, Figuren, Objekte und Labels verändern. Er darf den Master-Stil nicht umformulieren, verkürzen oder durch andere Stilrichtungen ersetzen.

Nicht verwenden:

- Fotorealismus,
- reale Menschen,
- Pixar-, Clay- oder Kinderfilmstil,
- UI-Dashboards als Bild,
- sterile Produkt-Renderings,
- flache 2D-Infografiken,
- überladene Miniaturstädte,
- viele unverbundene Icons,
- übermäßige Lichtleitungen, Partikel oder Neon.

`prompt-manifest.json` wird weiterhin pro Projekt geschrieben. Jeder Eintrag muss erkennen lassen, welcher gesprochene Satz, welche Bildaussage und welche Bilddatei zusammengehören.

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
11. `02-bilder/prompt-manifest.json`

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
4. eine klare finanzielle Aussage statt mehrerer unverbundener Ideen,
5. stilisierte 3D-Illustration statt Fotorealismus oder Dashboard,
6. Figuren und Objekte entsprechen `gehirn/BILDSTIL.md`,
7. natürliche Farben mit gezielten grünen Akzenten,
8. kein unerwünschter Text, Logo oder Wasserzeichen,
9. kurze deutsche Labels korrekt geschrieben,
10. genug Platz für Überschrift und Untertitel,
11. gleiche Bildwelt innerhalb des Reels und zwischen verschiedenen Reels.

Ein schönes, aber inhaltlich oder stilistisch falsches Bild wird ersetzt.

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
