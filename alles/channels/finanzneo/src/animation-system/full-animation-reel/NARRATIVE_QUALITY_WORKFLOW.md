# FinanzNeo Narrative-Motion-Workflow

Dieser Workflow ist für vollständig animierte Reels verbindlich. Technisch unterschiedliche React-Komponenten gelten nicht automatisch als visuell oder inhaltlich unterschiedliche Szenen.

## Grundregel

Ein Full-Animation-Reel muss den Inhalt **handeln lassen**. Zahlen dürfen den Beweis liefern, aber nicht das gesamte Reel ersetzen.

Mindestens 60 % der Szenen müssen eine der folgenden Formen verwenden:

- Objektgeschichte
- räumliche Miniwelt
- Prozessmaschine
- sichtbare Transformation
- Zeitreise oder Ursache-Wirkung-Kette

Reine Diagramme, Balken, Karten und Zahlenanzeigen dürfen zusammen höchstens 40 % des Reels ausmachen. Dashboard-Framing ist auf eine Szene begrenzt.

## Phase 0 – Skriptprüfung

Vor Storyboard oder Code müssen 5 bis 9 unterschiedliche Inhaltsbeats vorliegen.

Nicht zulässig:

- eine einzige Rechnung auf sieben Formulierungen verteilen
- denselben A-gegen-B-Vergleich mehrfach als Linie, Balken, Kurve und Tabelle zeigen
- Hook, Beweis, Erklärung und Fazit nur durch andere Überschriften unterscheiden

Jeder Beat muss eine eigene Frage beantworten oder eine neue Ursache, Folge, Handlung oder Lösung zeigen.

## Phase 1 – Storyboard vor Code

Jede Szene muss in `narrative-plan.current.json` mindestens enthalten:

- eigener Inhaltsbeat
- Hauptobjekt
- sichtbare Handlung
- visuelle Metapher
- Startzustand
- Endzustand
- visuelle Form
- Layoutfamilie
- Kamerabewegung
- handlungsbasierter Übergang
- Kennzeichnung, ob es reine Datenvisualisierung ist

Danach muss ausgeführt werden:

```bash
npm run finance:full-animation-reel:storyboard-quality
```

Solange dieser Befehl fehlschlägt, darf keine neue Szene programmiert werden.

## Phase 2 – Benötigte Fähigkeiten

Für ein Full-Animation-Reel werden diese Fähigkeiten kombiniert:

1. **Visual Storytelling** – Sätze in Handlung, Ursache und sichtbare Konsequenz übersetzen.
2. **Motion Design** – Anticipation, Gewicht, Beschleunigung, Überschwingen und Blickführung.
3. **Illustratives Szenendesign** – Objekte, Räume, Maschinen und Miniwelten statt nur UI-Karten.
4. **Remotion und SVG** – Pfade, Masken, Morphing, Parallax, Kamera und gestaffelte Animation.
5. **Sounddesign** – Voiceover, Impacts, Whooshes, Objektgeräusche und Übergänge framegenau synchronisieren.
6. **Mobile Readability** – große Hauptaussagen, klare Hierarchie und kein kleinteiliges Dashboard.

## Phase 3 – Baugrenzen

- Eine Layoutfamilie maximal zweimal.
- Keine zwei reinen Datenvisualisierungen direkt hintereinander.
- Derselbe Kernvergleich maximal zweimal im gesamten Reel.
- Mindestens 72 % unterschiedliche Handlungen.
- Mindestens 72 % unterschiedliche visuelle Metaphern.
- Überwiegend aktive Kameraführung.
- Jede Szene muss ihren Zustand sichtbar verändern.
- Übergänge entstehen möglichst aus dem Objekt oder der Handlung der vorherigen Szene.

## Phase 4 – Technische Prüfung

```bash
npm run finance:full-animation-reel:technical-validate
```

Dieser Befehl prüft ausschließlich:

- Timing
- TypeScript
- Tests
- Finanzberechnungen
- Renderbarkeit
- Standbilder

Ein technischer Erfolg ist keine kreative Freigabe.

## Phase 5 – Visuelle und akustische Prüfung

Vor einer Freigabe müssen geprüft werden:

- vollständiges MP4
- mindestens drei Frames pro Szene
- alle Szenenübergänge
- Smartphone-Lesbarkeit
- Voiceover-Synchronität
- Sounddesign
- erkennbare Unterschiede zwischen Handlungen und Layouts
- keine Wiederholung derselben Aussage in anderer Diagrammform

Die Ergebnisse werden in `full-animation-reel-quality.json` dokumentiert.

## Phase 6 – Freigabe

```bash
npm run finance:full-animation-reel:validate
```

Der finale Befehl besteht zwingend aus:

1. Prüfung des Quality-Gate-Systems
2. Storyboard-Prüfung
3. technischer Prüfung
4. manueller Freigabeprüfung

Eine KI oder ein Test darf `approvedByHuman` nicht selbst auf `true` setzen. Der aktuelle erste Full-Animation-Versuch bleibt ausdrücklich als abgelehntes Referenzbeispiel erhalten.
