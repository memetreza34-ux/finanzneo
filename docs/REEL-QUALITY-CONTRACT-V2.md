# FinanzNeo — Reel Quality Contract V2

> Ergänzt `CLAUDE.md` und `reels/PRODUKTIONSSTANDARD.md`. Bei Widerspruch gilt `CLAUDE.md`. Dieser Vertrag ist für neu gescaffoldete Reels ab `scene-index` Version 17 technisch prüfbar.

## 1. Verbindlicher Visual-Mix

Ziel für normale 60–90-Sekunden-Reels:

```text
Animation / native Remotion: 60 %
Google-Flow-Bildszenen:      40 %
```

Final zulässiger Laufzeitbereich:

```text
Animation: 55–65 %
Bilder:    35–45 %
```

Bei 10 Szenen gilt als Standard:

```text
6 Remotion-Animationen
4 Google-Flow-Bildszenen
```

Mehr als eine Bildszene direkt hintereinander ist bei neuen Reels standardmäßig verboten. Eine einzelne statische Bildszene soll normalerweise höchstens 8 Sekunden dauern.

Die Quote ist kein Grund für schwache Visuals: Wenn ein Beat dynamische Information trägt, gewinnt Remotion. Wenn ein Bild nur dekorativ wäre, wird kein Bild erzwungen.

## 2. Animation-first

Native Remotion ist die Standardwahl für:

- Vergleich und Vorher/Nachher
- Zahlen, Prozentwerte und Rechnungen
- Zeitachsen und Entwicklung über Zeit
- Wachstum und Zinseszins
- Geldflüsse
- Schrittfolgen
- Ursache → Wirkung, wenn sich etwas sichtbar verändern soll
- Mechanismen
- Risiko-/Realitätscheck
- Diagramme, Balken, Kurven und Zielwerte

Ein dynamischer Beat darf nicht als statisches KI-Bild umgesetzt werden, nur weil bereits ein Bildprompt leichter zu schreiben ist.

## 3. Wofür Google-Flow-Bilder gedacht sind

Bildszenen sind bevorzugt für:

- Hook / starke Einstiegssituation
- konkrete Alltagssituation
- eine sofort verständliche starke Metapher
- ein emotional oder räumlich klar erfassbares Problem
- Abschlussbild / Schlussmetapher

Jede Bildszene braucht vor der Bildgenerierung:

```text
Sprechbeat
Hauptaussage
Visualtyp
Begründung für genau diesen Visualtyp
Expected Visual
Erlaubte Labels
```

Wenn das fertige Bild die gesprochene Aussage nicht innerhalb ungefähr einer Sekunde unterstützt, ist es ungeeignet und muss vor dem Render ersetzt werden.

## 4. Bild-QA vor Remotion

Jedes Nutzerbild wird vor dem Einbau einzeln gegen seinen Szenenvertrag geprüft:

- Motiv passt exakt zum Sprechbeat
- Hauptaussage ist sofort verständlich
- keine zufälligen oder falschen Wörter
- nur erlaubte Labels
- Zahlen stimmen mit Skript/Recherche überein
- keine widersprüchlichen Zusatzinformationen
- keine redundante Textwiederholung, wenn Headline und Voiceover dieselbe Information bereits tragen
- Gesicht/Background/Cover-Regeln eingehalten

Fehler, die nur durch eine neue Google-Flow-Generierung lösbar sind, sind `BLOCKED`. Antigravity ersetzt das Bild nicht selbst.

## 5. Audio ist die einzige Zeitquelle

Die Produktionsreihenfolge ist verbindlich:

```text
finales Audio
→ echte Wort-start/end-Zeiten
→ kurze Caption-Einheiten
→ Szenenstarts/-enden
→ Animationsdauer
→ finaler Render
```

Ein finaler Render ist verboten, wenn:

- `word-timings.json` nicht `final-audio-aligned` ist
- finale Wortzeiten fehlen oder geschätzt wurden
- `timeline.json` noch `startFrame: 0` / `durationFrames: 0` als ungelöste Platzhalter enthält
- Szenen nicht aus den echten Audiozeiten abgeleitet wurden

Die finale Timeline muss lückenlos und chronologisch sein. Das Reel-Ende soll dem Ende des finalen gesprochenen Inhalts entsprechen; unbegründete lange Standbild-Tails sind verboten.

## 6. Untertitel — eine kurze Einheit, maximal zwei Zeilen

Zu jedem Zeitpunkt ist genau **eine** Caption-Einheit sichtbar. Niemals zwei Einheiten gleichzeitig.

Eine Caption-Einheit ist bevorzugt ein kurzer vollständiger gesprochener Satz. Ist ein gesprochener Satz zu lang, wird er an einer natürlichen Bedeutungs-/Pausengrenze in mehrere **nacheinander** angezeigte Einheiten geteilt. Das Audio wird dadurch nicht verändert.

Harte Regeln für neue Reels:

```text
max. 12 Wörter pro Caption-Einheit
max. 68 Zeichen pro Caption-Einheit
max. 2 sichtbare Zeilen
min. 42 px effektive Schriftgröße
```

Layout-Ziel 1080×1920:

```text
subtitleBottom: ca. 320 px
subtitleLeft:   ca. 72 px
subtitleRight:  ca. 180 px
```

- kein horizontaler Überlauf
- kein Abschneiden am Rand
- kein `nowrap`-Überlauf über die Safe-Area
- keine Mini-Schrift als Rettung
- aktuelles Wort nur während seiner echten Audio-start/end-Zeit grün
- kurze Pause: aktuelle Caption-Einheit halten
- Wechsel exakt beim ersten gesprochenen Wort der nächsten Einheit

## 7. Finale MP4-QA ist Pflicht

Ein erfolgreicher Typecheck oder Render reicht nicht.

Vor `PRODUCTION COMPLETE` muss die vollständige finale MP4 wirklich geprüft werden. Zusätzlich werden mindestens Anfang/Mitte/Ende jeder Szene oder ein äquivalenter Frame-/Contact-Sheet-Check geprüft.

Pflichtprüfungen:

- Bild passt zum gesprochenen Moment
- keine falschen/unpassenden Google-Flow-Texte
- Visualwechsel synchron mit Audio
- 55–65 % der tatsächlichen Reel-Laufzeit sind Animation
- keine Bildszene länger als 8 Sekunden ohne ausdrücklich dokumentierte Ausnahme
- keine zwei Bildszenen direkt hintereinander
- Untertitel laufen nie aus dem Safe-Bereich
- Untertitel sind ausreichend groß
- aktive Wortmarkierung folgt dem echten Audio
- kein langer toter Standbild-Tail
- Audio ungefähr bei -16 LUFS; True Peak höchstens -1 dBTP

Die Prüfung wird in `05-projektdateien/final-qa.json` dokumentiert. Dieser Nachweis darf erst auf `passed` gesetzt werden, nachdem die finale MP4 tatsächlich geprüft wurde.

## 8. Final-Blocker

Der Final-Validator blockiert neue V17-Reels, wenn unter anderem:

- Visual-Mix falsch ist
- zwei Bildszenen direkt hintereinander geplant sind
- finale Timeline ungelöst ist
- Bildlaufzeit zu lang ist
- Caption-Einheit zu lang ist
- echte Audio-Ausrichtung fehlt
- finale MP4-QA nicht dokumentiert wurde
- Audio-QA nicht bestanden wurde

Validatoren niemals schwächen, um einen fehlerhaften Reel-Build durchzulassen.
