# FinanzNeo Visual Selection Rule V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

## Kernprinzip

Nicht zuerst fragen, welches Tool verfügbar ist. Zuerst bestimmen:

```text
Sprechpunkt
→ was muss der Zuschauer sichtbar verstehen?
→ was ist die einfachste visuelle Darstellung dafür?
→ Metapher / Zahl+Objekt / Illustration / Diagramm / Prozess / Timeline / Text+Illustration
→ erst danach Werkzeug wählen
```

**Ein Gedanke = eine klare visuelle Idee.**

Der Zuschauer soll die Hauptaussage möglichst auf den ersten Blick verstehen. Komplexer Inhalt bedeutet nicht automatisch komplexes Bild oder komplexe Animation.


## Reels — harte exklusive Auswahl

Für neue FinanzNeo-Reels gilt pro Szene **genau eine Hauptform**:

### IMAGE

Nutzen, wenn der Sprechpunkt als starkes Standbild oder als klare Illustration besser funktioniert als als zeitliche Animation.

IMAGE bedeutet:
- Google-Flow-Bild ist das Hauptvisual
- Header/Icon und Captions werden von Remotion gerendert
- die konkrete Bildidee wird szenenspezifisch entwickelt
- diese Auswahlregel schreibt **keine** Literal-first-, Alltagsszenen-, Objekt-, Label- oder Metapher-Formel vor
- keine erklärende Remotion-Hauptanimation über dem Bild

Kreative Bildprompt-Regeln kommen ausschließlich aus `docs/IMAGE-PROMPT-BASELINE.md` und späteren ausdrücklich neuen Bildstandards.


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

## YouTube Longform

Für YouTube Longform darf weiterhin eine echte Bild+Remotion-Kombination gewählt werden, wenn zeitliche Information innerhalb einer komplexen Bildszene nachweislich besser verständlich wird. Diese Longform-Ausnahme gilt **nicht** für Reels.

## Qualitätsfragen

Jeder Beat muss mindestens diese Fragen bestehen:

- Versteht man die Hauptidee ohne langes Nachdenken?
- Ist die Darstellung einfacher als eine vollständige Szene?
- Gibt es unnötige Dekoration oder KI-typische Komplexität?
- Passt das Visual exakt zum gesprochenen Gedanken?
- Wäre eine einfache Metapher, Zahl, Illustration, Grafik, Prozessdarstellung oder Timeline klarer?


## Kurzregel

> **Ein Gedanke = eine einfache visuelle Idee. Erst die klarste Darstellung wählen, dann das Werkzeug. FinanzNeo-Bildwelt beibehalten, aber keine unnötige KI-Komplexität hinzufügen.**
