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

Für neue FinanzNeo-Reels gilt pro Szene **genau eine Hauptform**:

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

Jeder Beat muss sichtbar mindestens eine konkrete Frage beantworten:
- Was verändert sich?
- Was wächst oder schrumpft?
- Was kostet Geld?
- Wo fließt Geld hin?
- Was bleibt übrig?
- Was wird verglichen?
- Was ist Ursache und Wirkung?

## Kurzregel

> **Reels: entweder IMAGE oder ANIMATION. Bilder bleiben ruhig und selbsterklärend; Animationen werden individuell aus dem Sprechpunkt entwickelt. SVG, Icons und Lottie sind Werkzeuge. YouTube Longform darf bei echtem Mehrwert weiterhin Hybrid nutzen.**
