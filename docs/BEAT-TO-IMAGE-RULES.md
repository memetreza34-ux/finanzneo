# FinanzNeo — Beat-zu-Bild-Regeln

Dieses Dokument entscheidet für jeden gesprochenen Beat, ob ein KI-Bild, Remotion oder eine Kombination verwendet wird. Bei Widerspruch gilt `CLAUDE.md`. Für neue Reels zusätzlich verbindlich: `docs/REEL-QUALITY-CONTRACT-V2.md`.

## 1. Grundentscheidung

Für jeden Beat eine Kategorie wählen.

### A. Google-Flow-Bild

Für statisch stark verständliche Motive:

- Hook / starke Einstiegssituation
- konkrete Alltagssituation
- starke einzelne Metapher
- räumlich sofort erfassbares Problem
- Abschlussbild / Schlussmetapher

Ein Bild wird nur gewählt, wenn es die gesprochene Hauptaussage innerhalb ungefähr einer Sekunde unterstützt. Ein nur dekoratives oder semantisch schwaches Bild ist verboten.

### B. Native Remotion — Standard für dynamische Information

Remotion ist die bevorzugte Wahl für:

- Vergleiche
- Vorher/Nachher
- Geldbeträge und Prozentwerte
- Rechnungen
- Diagramme und Balken
- Zeitachsen
- Entwicklung über Zeit
- Wachstum und Zinseszins
- Geldflüsse
- Schrittfolgen
- Mechanismen
- Ursache → Wirkung mit sichtbarer Veränderung
- Risiko-/Realitätscheck
- Quellen / präzise Werte

Wenn die Aussage eine Veränderung, Bewegung, Rechnung, Zeitentwicklung oder einen Vergleich erklärt, darf sie nicht nur deshalb als statisches Bild gebaut werden, weil das einfacher ist.

### C. Kombination — nur wenn wirklich nötig

Ein Google-Flow-Bild darf mit kleinen Remotion-Hervorhebungen ergänzt werden, wenn das Bild die konkrete Situation trägt und Remotion nur präzise Werte/Pfeile/Fokus ergänzt.

Keine Kombination verwenden, wenn dadurch Bildtext, Szenenheadline, Untertitel und zusätzliche Overlays dieselbe Information mehrfach wiederholen.

**Cover-Ausnahme:** Die große Cover-Überschrift auf `Bild 00` wird direkt in Google Flow erzeugt und niemals durch Remotion ersetzt.

## 2. Entscheidungsfragen

1. Ändert sich etwas sichtbar über Zeit? → Remotion.
2. Ist die Hauptinformation Zahl, Rechnung, Vergleich, Kurve, Balken oder Zeitachse? → Remotion.
3. Erklärt der Beat einen Mechanismus oder Geldfluss? → Remotion.
4. Braucht der Satz eine konkrete Alltagssituation oder eine starke einzelne Metapher? → Bild.
5. Ist das Bild nur dekorativ oder könnte es missverstanden werden? → Remotion.
6. Muss ein geprüfter Wert exakt sichtbar sein? → Remotion.

## 3. Verbindliche Standardverteilung

Für normale 60–90-Sekunden-Reels gilt:

```text
55–65 % der tatsächlichen Laufzeit = native Remotion-Animation
35–45 % der tatsächlichen Laufzeit = Google-Flow-Bildszenen
```

Zielwert:

```text
60 % Animation
40 % Bilder
```

Bei 10 Szenen standardmäßig:

```text
6 Remotion-Szenen
4 Bildszenen
```

Zusätzlich:

- höchstens eine Bildszene direkt hintereinander
- einzelne statische Bildszene normalerweise maximal 8 Sekunden
- keine lange statische Schlussphase nur zum Auffüllen der Audio-/Videolänge

Die Laufzeitquote ist wichtiger als nur die Szenenanzahl.

## 4. Pflichtplanung pro Beat

Vor Bildgenerierung oder Remotion-Code muss jeder Beat dokumentieren:

```text
Beat [Nummer]
Sprechtext: „...“
Hauptaussage: ...
Visualtyp: [Google-Flow-Bild / Remotion / Kombination]
Begründung: Warum genau dieser Visualtyp?
Expected Visual: Was muss innerhalb ~1 Sekunde verständlich sein?
Erlaubte Labels: ...
Remotion-Inhalt: ...
Benötigte Daten: ...
```

Ein Visualtyp ohne konkrete Begründung ist nicht final.

## 5. Bild-Regel pro Beat

Ein Szenen-KI-Bild `Bild 01+` nutzt:

- eine dominante Finanzmetapher / ein großes Hauptobjekt
- wenige unterstützende Elemente
- optional eine Person mit klar sichtbarem Gesicht
- kurze deutsche Objektlabels
- **keine KI-Headline**
- einen einzigen nahtlosen deep-charcoal-green-black Hintergrund

Vor Remotion-Einbau Bild einzeln prüfen:

- Motiv entspricht exakt dem Sprechbeat
- keine zufälligen/falschen Wörter
- nur erlaubte Labels
- Zahlen stimmen
- keine widersprüchliche Zusatzinformation
- keine unnötige Dreifach-Wiederholung aus Bildlabel + Headline + Untertitel

Wenn das Bild nicht passt und neu generiert werden muss: `BLOCKED`; Antigravity ersetzt es nicht selbst.

Das Cover `Bild 00` folgt derselben Bildwelt, hat aber zusätzlich eine verbindliche große deutsche Google-Flow-Cover-Überschrift exakt wie im Cover-Prompt vorgegeben. Keine Remotion-Reparatur bei falscher Typografie.

## 6. Mehrteilige Bilder

Einzelbild mit einer starken Metapher ist Standard.

Mehrteilige Komposition nur, wenn sie klarer ist als Remotion:

- 2-in-1: klare statische Gegenüberstellung
- 3-in-1: nur wenn drei Aspekte gleichzeitig wirklich nötig sind
- 4-in-1: vermeiden

Sobald ein Vergleich zeitlich, rechnerisch oder schrittweise erklärt werden soll, Remotion bevorzugen.

## 7. Bildwechsel und Dauer

Szenenwechsel folgen echten Audio-/Caption-Einheiten, nicht einem starren Raster.

Für Bildszenen:

- normalerweise 4–8 Sekunden
- über 8 Sekunden nur mit dokumentierter sachlicher Begründung
- keine zwei Bildszenen direkt hintereinander bei neuen Standard-Reels

Erlaubte dezente Bewegung auf einem Bild:

- langsamer Push-in
- Fokusfahrt
- Mask-Reveal
- dezente Hervorhebung
- Pfeil/Outline

Diese Bewegung macht aus einer statischen Bildszene keine native Animation und wird bei der 60/40-Quote weiterhin als Bildlaufzeit gezählt.

## 8. Finale Prüfung

Vor `PRODUCTION COMPLETE` muss die vollständige MP4 geprüft werden:

- Visual passt zum gesprochenen Moment
- Visualwechsel stimmt mit Audio überein
- 55–65 % reale Animationslaufzeit
- keine Bildszene unnötig länger als 8 Sekunden
- keine zwei Bildszenen direkt hintereinander
- kein unpassender oder zufälliger KI-Text
- kein langer statischer Tail

Die Prüfung wird für V17-Reels in `05-projektdateien/final-qa.json` dokumentiert.

## 9. Ablehnung

- Bild wäre nur Dekoration
- dynamischer Mechanismus wurde unnötig statisch gemacht
- Zahl/Rechnung/Timeline wird besser durch Remotion erklärt
- Bild enthält mehrere konkurrierende Hauptaussagen
- Bild passt nicht exakt zum Voice-Beat
- falsche oder zufällige Labels
- zwei Bildszenen direkt hintereinander ohne begründete Ausnahme
- statische Bildszene unnötig länger als 8 Sekunden
- Miniatur-/Dashboard-Logik statt einer starken Metapher
- Hintergrund enthält Bänder/Zonen
- Person ist gesichtslos oder nur von hinten
- Cover-Überschrift fehlt/falsch/abgeschnitten/unlesbar
- Remotion versucht eine fehlerhafte Cover-Überschrift zu ersetzen
