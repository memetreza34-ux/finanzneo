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

## YouTube Longform — vier Typen statt zwei

Reels haben ein hartes Entweder-oder. YouTube nicht: der Zuschauer sitzt länger, schaut mit Ton und verträgt aufeinander aufbauende Formen. `YOUTUBE_VISUAL_TYPES` kennt deshalb vier Werte.

```text
image      eine konkrete reale Situation, als Standbild sofort verständlich
animation  eine Veränderung über Zeit; die Bewegung trägt die Erklärung allein
hybrid     eine reale Situation, die zusätzlich eine Zeitebene braucht
data       geprüfte Zahlen, Beträge, Kurven, Zeitachsen, Vergleiche
```

### Die Entscheidung in einer Reihenfolge

```text
Sprechpunkt
→ Steckt eine Zahl darin, die stimmen muss?           → data
→ Braucht der Zuschauer eine Veränderung über Zeit?
    → trägt eine reale Situation sie mit?             → hybrid
    → sonst                                           → animation
→ Sonst: gibt es eine konkrete Alltagssituation?      → image
```

### IMAGE

Wenn ein starkes Standbild schneller verständlich ist als jede Bewegung: kaputte Waschmaschine mit Reparaturrechnung, Einkauf im Supermarkt, Mietschreiben, Kontoauszug.

- das Flow-Bild ist das Hauptvisual
- Zwischenüberschrift, Icon und optionaler Infotext kommen von Remotion
- kurze deutsche Objektlabels im Bild sind erlaubt
- keine Erkläranimation darüber — sonst ist es ein `hybrid`

### ANIMATION

Wenn der Zuschauer eine Veränderung, Aufteilung, Reihenfolge oder Ursache/Wirkung über Zeit sehen muss und keine reale Szene sie trägt.

- eigenständige Remotion-Mechanik, kein Flow-Bild
- Startzustand → sichtbarer Mechanismus → eindeutiges Ergebnis
- mindestens zwei unabhängige Motion-Treiber
- sichtbare Transformation, nicht nur Ein-/Ausblenden und Zoom

Das prüft `youtube:animation:validate` am Code, nicht nur an den Metadaten.

### HYBRID

Die Longform-Ausnahme, die es für Reels nicht gibt. Nur wählen, wenn **beides** zutrifft: eine reale Situation trägt die Szene, **und** eine Zeitebene darüber macht sie nachweislich klarer.

Beispiel: ein Auto mit abmontiertem Rad als Flow-Bild, darüber die fallende Depotkurve, die den Konflikt im Timing zeigt.

- das Bild wird für die Animation komponiert: der Prompt lässt die nötige Fläche frei
- die Animation ergänzt das Bild, sie wiederholt es nicht
- ohne die Animation muss das Bild noch immer eine gültige Aussage haben

Kein `hybrid`, nur weil ein Bild vorhanden ist. Dann ist es `image`.

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

Nicht Szene für Szene derselbe Typ und nicht dieselbe Objektfamilie. Drei `image` hintereinander mit derselben Papierkarte sind eine Wiederholung, auch wenn die Motive verschieden heißen. `youtube:animation:validate` prüft Kamera, Layout und Transformation gegen die letzten vier Motion-Visuals.

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

> **Reels: entweder IMAGE oder ANIMATION.** Bilder bleiben ruhig und selbsterklärend; Animationen werden individuell aus dem Sprechpunkt entwickelt. SVG, Icons und Lottie sind Werkzeuge.
>
> **YouTube: image, animation, hybrid oder data.** Zahlen gehören nach Remotion, nie in ein Flow-Bild. Hybrid nur, wenn Bild und Zeitebene beide gebraucht werden. Jede Szene bekommt eine Zwischenüberschrift mit Icon, und Bilder werden so komponiert, dass die Kopfbahn frei bleibt.
