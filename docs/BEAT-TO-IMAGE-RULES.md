# FinanzNeo — Beat-zu-Bild-Regeln

Dieses Dokument entscheidet für jeden gesprochenen Beat, ob ein KI-Bild, Remotion oder eine Kombination verwendet wird. Bei Widerspruch gilt `CLAUDE.md`.

## 1. Grundentscheidung

Für jeden Beat eine Kategorie wählen:

### A. KI-Bild

Für konkrete räumliche oder gegenständliche Szenen:

- Alltagssituation
- Ursache-Wirkung
- visuelle Metapher
- Risiko/Schutz
- Konsumsituation
- unerwartete Ausgabe
- räumlicher Vergleich

Jedes KI-Bild folgt `docs/FINANZNEO-IMAGE-WORLD-V3.md`.

### B. Remotion

Für Information, Struktur und validierte Werte:

- **Szenenüberschriften ab Szene 01**
- Geldbeträge/Prozentwerte
- Diagramme/Tabellen
- Zeitachsen
- Checklisten
- Formeln
- Quellen
- CTA

**Cover-Ausnahme:** Die große Cover-Überschrift auf `Bild 00` wird direkt in Google Flow erzeugt und niemals durch Remotion ersetzt.

### C. Kombination

Bild erklärt die Situation, Remotion ergänzt präzise Werte, Pfeile, Hervorhebungen oder Quellen. Die Cover-Überschrift ist davon ausgenommen.

## 2. Entscheidungsfragen

1. Braucht der Satz eine konkrete räumliche Szene? → Bild/Kombination.
2. Ist die Hauptinformation Zahl/Tabelle/Kurve? → Remotion.
3. Erklärt eine starke Metapher die Aussage schneller? → Bild.
4. Muss ein geprüfter Wert/Quelle sichtbar sein? → Remotion/Kombination.
5. Wäre das Bild nur dekorativ? → Remotion.

## 3. Standardverteilung

Für ein typisches 60–90-Sekunden-Reel:

```text
55–65 % Bildszenen
35–45 % native Remotion-Animationen
```

Bei 10 Szenen bevorzugt ungefähr:

```text
6 Bildszenen
4 Remotion-Szenen
```

Das ist ein Zielwert, keine starre Quote. Eine schwache Bildszene/Animation wird nicht nur für die Quote verwendet.

## 4. Bild-Regel pro Beat

Ein Szenen-KI-Bild `Bild 01+` nutzt:

- eine dominante Finanzmetapher / ein großes Hauptobjekt
- wenige unterstützende Elemente
- optional eine Person mit klar sichtbarem Gesicht
- kurze deutsche Objektlabels
- **keine KI-Headline**
- einen einzigen nahtlosen deep-charcoal-green-black Hintergrund

Keine Prozent-Zonen, keine Hintergrundbänder, keine Miniatur-Dioramen.

Das Cover `Bild 00` folgt derselben Bildwelt, hat aber zusätzlich eine **verbindliche große deutsche Google-Flow-Cover-Überschrift**, exakt wie im Cover-Prompt vorgegeben. Keine Remotion-Reparatur bei falscher Typografie.

## 5. Mehrteilige Bilder

Einzelbild mit einer starken Metapher ist Standard.

Mehrteilige Komposition nur, wenn sie klarer ist als eine einzelne Metapher oder Remotion:

- 2-in-1: klare Gegenüberstellung
- 3-in-1: drei echte, gleichzeitig nötige Schritte
- 4-in-1: nur in Ausnahmefällen

Keine winzigen Panels.

## 6. Bildwechsel

Szenenwechsel folgen Satzanfängen aus dem finalen Audio, nicht einem starren Zeitraster.

Erlaubte dezente Bildbewegung in Remotion:

- langsamer Push-in
- Fokusfahrt
- Mask-Reveal
- dezenter Zoom
- Hervorhebung
- Pfeil/Outline

Keine zufällige Bewegung ohne Erklärfunktion.

## 7. Beat-Ausgabeformat

```text
Beat [Nummer]
Sprechtext: „...“
Hauptaussage: ...
Visualtyp: [KI-Bild / Remotion / Kombination]
Begründung: ...
Bildmetapher: ...
Erlaubte Labels: ...
Remotion-Inhalt: ...
Benötigte Daten: ...
```

Für Cover zusätzlich:

```text
COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE ÜBERSCHRIFT]
```

## 8. Ablehnung

- Bild wäre nur Dekoration
- Zahl wird besser durch Remotion erklärt
- Bild enthält mehrere konkurrierende Hauptaussagen
- Miniatur-/Dashboard-Logik statt einer starken Metapher
- Hintergrund enthält Bänder/Zonen
- Person ist gesichtslos oder nur von hinten
- Cover-Überschrift fehlt/falsch/abgeschnitten/unlesbar
- Remotion versucht eine fehlerhafte Cover-Überschrift zu ersetzen
