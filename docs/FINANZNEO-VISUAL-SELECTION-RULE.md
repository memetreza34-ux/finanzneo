# FinanzNeo Visual Selection Rule V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

## Kernprinzip

Nicht zuerst fragen, welches Tool verfügbar ist. Zuerst bestimmen:

```text
Sprechpunkt
→ was muss der Zuschauer sichtbar verstehen?
→ welche einfachste visuelle Form erklärt genau das?
→ erst danach Werkzeug wählen
```

Komplexer Inhalt bedeutet nicht automatisch komplexe Animation.

## Reels — harte exklusive Auswahl

Für neue FinanzNeo-Reels gilt pro Szene **genau eine Hauptform**. Es gibt drei, und die Entscheidung läuft in dieser Reihenfolge:

```text
Kann ein Bild die Aussage tragen?                  → IMAGE
Nein, es braucht eine echte Zahl?                  → DATA
Nein, die Veränderung selbst IST die Aussage?      → ANIMATION
```

Die Reihenfolge ist Absicht: IMAGE ist der Standardfall, nicht die Restkategorie.
Eine Szene verlässt ihn nur, wenn ein Bild die Aussage wirklich nicht tragen kann.

Keine Quote zwischen den dreien, aber eine klare Erwartung: so viele Flow-Bilder wie
möglich, so wenige Animationen wie nötig, und lieber gar keine Animation als eine
mittelmäßige.

**Animation kann Mengen über Zeit, keine Situationen.** Eine Kurve, die sich zeichnet,
zwei Flächen, die auseinanderlaufen, ein Puffer, der sich füllt — das trägt. Eine
Alltagssituation mit Personen, Gegenständen und Haltung wird in Code zu beschrifteten
Karten mit wechselnden Zahlen. Das ist eine bewegte Tabelle, keine Erklärung, und
gehört zu Google Flow.

**Eine Remotion-Standbildszene ersetzt kein Flow-Bild.** Code zeichnet geometrisch,
Flow zeichnet die Welt; nebeneinander bricht das den FINANZNEO_SERIES_LOCK.
Remotion-Statik ist nur als DATA-Szene erlaubt, also mit belegter Zahl im Bild.

### IMAGE

Nutzen, wenn eine konkrete Alltagssituation oder ein klarer Zustand als starkes Standbild schneller verständlich ist, z. B.:

- kaputte Waschmaschine + Reparaturrechnung + Notgroschen
- Einkauf / Inflation
- Rechnung / Versicherung / Vertrag
- klarer realer Vorher-/Nachher-Zustand

IMAGE bedeutet:
- Google-Flow-Bild ist das Hauptvisual
- Header/Icon und Captions werden von Remotion gerendert
- kurze funktionale Objektlabels sind erlaubt
- keine erklärende Remotion-Hauptanimation, Pfeilmechanik, Geldfluss-Animation oder Parallax-Erklärung über dem Bild

### ANIMATION

Nutzen, wenn der Zuschauer eine **Veränderung, Entwicklung, Aufteilung, Reihenfolge oder Ursache/Wirkung über Zeit** sehen muss, z. B.:

- Zins/Tilgung teilt sich
- Gebühren wirken über Jahre
- regelmäßige Sparrate baut etwas auf
- Risiko wird verteilt
- Reihenfolge Sicherheit → Investieren

ANIMATION bedeutet:
- eigenständige Remotion-Hauptanimation
- kein generiertes Flow-Bild als Hauptvisual
- SVG, Icons, Lottie, Charts, Zahlen, Shapes und 3D-/Physical-Primitives sind Werkzeuge
- Technik wird individuell nach dem Sprechpunkt gewählt

### DATA

Nutzen, wenn eine **echte Zahl** die Aussage trägt und weder ein Bild noch eine erfundene Bewegung sie zeigen könnte, z. B.:

- wie unruhig zehn Jahre Weltmarkt wirklich waren
- wie viel von einem Endwert nie eingezahlt wurde
- wie weit ein Puffer noch vom Ziel entfernt ist
- wie zwei Anlagen über denselben Zeitraum auseinanderlaufen

DATA bedeutet:
- eigenständige Remotion-Hauptszene aus belegten Zahlen
- kein generiertes Flow-Bild als Hauptvisual
- `dataOrigin`, `dataSource`, `dataClaim` und `sourceNote` stehen im `scene-index.json`
- die Quellenzeile ist im Bild sichtbar, nicht nur im Index
- die Reihe wird in Phase 1 geholt und eingefroren; Phase 3 holt nichts nach

Ohne echte Zahl ist es keine DATA-Szene, sondern ein Bild.

Eine gezeichnete Kurve allein füllt den Frame nicht. Wo ein Gegenstand aus `src/motion` neben der Reihe steht, steigt die gemessene Visualbelegung deutlich — bei einer geprüften Szene von 11,5 % auf 25,1 %. Die Zahl trägt die Aussage, der Gegenstand trägt das Bild.

Details: `docs/PHASE-1-DATA-SCENE-STANDARD.md`

### Für Reels verboten

`Bild + Remotion Hybrid` ist **keine dritte Hauptform**. Ein starkes Bild wird nicht unnötig mit Erkläranimation überladen. Wenn zeitliche Erklärung nötig ist, wird daraus eine ANIMATION-Szene; wenn das Bild allein die Aussage trägt, bleibt es IMAGE.

## Support-Werkzeuge

- **Icons:** schnelle semantische Erkennung
- **SVG:** präzise Pfade, Linien, Charts, Verbindungen
- **Lottie:** kleine Status-/Fokusbewegung
- **Charts/Zahlen:** messbare Entwicklung
- **Physical-Primitives:** konkrete physische Mechanik in ANIMATION-Szenen

Support ersetzt nie die inhaltlich passende Hauptmechanik.

## Motion-Diversität

Technisch verschieden zählt nur dann als neu, wenn die sichtbare Erklärung tatsächlich anders ist.

Nicht ausreichend:
- neue `MECHANIC_ID`, aber dieselben Hauptobjekte
- anderes Lottie, aber gleiche Hauptaktion
- anderes Icon, aber gleiches Layout
- wieder Konto + Münzen + Behälter mit nur leicht anderer Bewegung

Neue Reels nutzen deshalb zusätzlich `finanzneo-reel-quality-guards-v1`, das die echte `animation.tsx` analysiert.

## Wiederverwendung

Wiederholung ist erlaubt, wenn sie für Vergleich/Kontinuität wirklich der beste Fit ist. Sie muss konkret inhaltlich begründet werden.

## YouTube Longform — drei Typen

Auch YouTube hat ein hartes Entweder-oder: eine Szene ist ein Bild **oder** Bewegung, nie beides.

`hybrid` gab es kurzzeitig als Longform-Ausnahme. Im fertigen Video wurde daraus weder ein ruhiges Bild noch eine klare Mechanik: Animationen lagen über randlosen Bildern, Text überlappte Text. Der Typ ist abgeschafft.

```text
image      eine konkrete reale Situation, als Standbild sofort verständlich
animation  eine Veränderung über Zeit; die Bewegung trägt die Erklärung allein
data       geprüfte Zahlen, Beträge, Kurven, Zeitachsen, Vergleiche
```

### Die Entscheidung in einer Reihenfolge

```text
Sprechpunkt
→ Steckt eine Zahl darin, die stimmen muss?           → data
→ Passiert wirklich etwas über Zeit?                  → animation
→ Sonst                                               → image
```

Im Zweifel Bild. Eine Alltagssituation als ruhiges Standbild ist fast immer verständlicher als eine Animation, die dieselbe Aussage in Bewegung übersetzt.

### IMAGE

Wenn ein starkes Standbild schneller verständlich ist als jede Bewegung: kaputte Waschmaschine mit Reparaturrechnung, Einkauf im Supermarkt, Mietschreiben, Kontoauszug.

- das Flow-Bild ist das Hauptvisual
- Zwischenüberschrift, Icon und optionaler Infotext kommen von Remotion
- kurze deutsche Objektlabels im Bild sind erlaubt
- keine Erkläranimation darüber. Braucht der Beat Bewegung, ist er eine `animation` ohne Bild

### ANIMATION

Wenn der Zuschauer eine Veränderung, Aufteilung, Reihenfolge oder Ursache/Wirkung über Zeit sehen muss — und ein Standbild sie nicht tragen kann.

- eigenständige Remotion-Mechanik, kein Flow-Bild
- Startzustand → sichtbarer Mechanismus → eindeutiges Ergebnis
- mindestens zwei unabhängige Motion-Treiber
- sichtbare Transformation, nicht nur Ein-/Ausblenden und Zoom

Das prüft `youtube:animation:validate` am Code, nicht nur an den Metadaten.

### DATA

Sobald eine geprüfte Zahl im Spiel ist, gehört der Beat nach Remotion — nie in ein Flow-Bild.

Grund: die Bildwelt verbietet erfundene Zahlen, und ein Bildmodell kann eine Zahl weder rechnen noch zuverlässig schreiben. In Remotion ist sie reproduzierbar aus `src/finance/calculations.ts` und beim nächsten Datenstand änderbar.

- Beträge, Vergleiche, Kurven, Zeitachsen, Anteile
- Annahmen gehören sichtbar dazu, in die Infozeile
- `data-notes.md` dokumentiert Quelle, Stand und Rechenweg

### Für YouTube gilt zusätzlich

**Jede Szene bekommt eine Zwischenüberschrift mit Icon.** Das Layout reserviert die Kopfbahn dafür; eine Szene ohne Überschrift lässt sie leer stehen. Die Überschrift ist kurz und direkt, kein Satz.

**Das Icon kommt aus dem vorhandenen Satz.** 27 Stück, Liste in `docs/YOUTUBE-MOTION-BAUKASTEN.md`. Keine erfundenen Namen. Die Tonalität färbt es semantisch: `warning` rot, `money` gold, `positive` grün.

**Bilder werden für die Kopfbahn komponiert.** Das Hauptmotiv sitzt im mittleren und unteren Drittel des Bildes, oben bleibt ruhiges Schwarz. Sonst kollidiert das Motiv mit der Überschrift.

**Lottie bleibt Support.** 14 lokale Dateien, kleine Status- oder Fokusbewegung — Check, Warnung, Uhr. Nie der Hauptstil und nie die Hauptmechanik einer Szene.

**Externe B-Roll ist optional und geplant.** Ein Slot entsteht in Phase 1 mit Zweck und erlaubtem Typ; die Hauptmechanik bleibt ohne den Treffer verständlich. Details in `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`.

### Vielfalt über die Serie

Nicht Szene für Szene dieselbe Objektfamilie. Drei `image` hintereinander mit derselben Papierkarte sind eine Wiederholung, auch wenn die Motive verschieden heißen. Mehrere Bildszenen nacheinander sind dagegen ausdrücklich in Ordnung, solange jede die Aussage sichtbar weiterführt. `youtube:animation:validate` prüft Kamera, Layout und Transformation gegen die letzten vier Motion-Visuals.

## Qualitätsfragen

Jeder Beat muss sichtbar mindestens eine konkrete Frage beantworten:
- Was verändert sich?
- Was wächst oder schrumpft?
- Was kostet Geld?
- Wo fließt Geld hin?
- Was bleibt übrig?
- Was wird verglichen?
- Was ist Ursache und Wirkung?

## Kurzregel

> **Reels: IMAGE, ANIMATION oder DATA — genau eine Hauptform pro Szene.** Bild zuerst; nur wenn es die Aussage nicht tragen kann, Zahl → DATA oder Veränderung → ANIMATION. Bilder bleiben ruhig und selbsterklärend; Animationen werden individuell aus dem Sprechpunkt entwickelt; Datenszenen zeigen ihre Quelle. SVG, Icons und Lottie sind Werkzeuge.
>
> **YouTube: image, animation oder data — nie Bild und Animation zusammen.** Zahlen gehören nach Remotion, nie in ein Flow-Bild. Im Zweifel Bild. Jede Szene bekommt eine Zwischenüberschrift mit Icon, und Bilder werden so komponiert, dass die Kopfbahn frei bleibt.
