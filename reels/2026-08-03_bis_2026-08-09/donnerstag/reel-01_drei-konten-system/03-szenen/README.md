# Szenen — Drei-Konten-System

## Exakte Verteilung

| Typ | Szenen | Anteil |
|---|---|---:|
| Bild | 01, 02, 03, 05, 07, 10 | 60 % |
| Remotion-Animation | 04, 06, 08, 09 | 40 % |

## Ein-Quellen-Vertrag

### Bildszene

```text
scene-01/
├── bildprompt.txt
├── finales-bild.png
└── szene.md
```

Vor dem Einfügen des finalen Bildes enthält der Ordner nur `bildprompt.txt` und `szene.md`.

### Remotion-Szene

```text
scene-04/
├── remotion.md
└── szene.md
```

## Verbindliches Layout

- Überschrift immer oben bei ungefähr `Y = 92`.
- Bild oder Animation ausschließlich im Bereich `Y = 300–1410`.
- Hauptmotiv leicht oberhalb der Bildschirmmitte.
- Untertitel separat darunter, mit 180 px freier Safe-Area am unteren Rand.
- Keine Kicker-Pille im Untertitelbereich.
- Zu jedem Zeitpunkt höchstens ein vollständiger Satz.
- Szene 02 und Szene 07 verwenden deshalb jeweils zwei getrennte Untertitel-Cues.

## Bildtexte

Die sechs Bildprompts verlangen kein Text-Rendering im KI-Bild. Überschriften, Untertitel, Beträge und Labels werden durch Remotion kontrolliert erzeugt.

## Bildzuordnung

Siehe `../05-review/BILD-ZUORDNUNG.md`. Insbesondere müssen die Motive für Szene 03, 05 und 07 vor jedem Render kontrolliert werden.

## Verbote

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` im Szenenordner
- `bildprompt.txt` und `remotion.md` in derselben Szene
- Bilddateien in Remotion-Szenen
