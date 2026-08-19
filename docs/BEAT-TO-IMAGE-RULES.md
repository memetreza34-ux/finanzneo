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

Jedes KI-Bild folgt `docs/FINANZNEO-IMAGE-WORLD-V3.md` und trägt bereits Headline + Subline eingebrannt. Remotion zeigt bei Bild-Beats deshalb keine eigene Kicker-/Headline-Ebene mehr darüber — nur bei nativen Remotion-Beats (Kategorie B) rendert Remotion die Überschrift selbst.

### B. Remotion

Für Information, Struktur und validierte Werte:

- Überschriften
- Geldbeträge/Prozentwerte
- Diagramme/Tabellen
- Zeitachsen
- Checklisten
- Formeln
- Quellen
- CTA

### C. Kombination

Bild erklärt die Situation, Remotion ergänzt präzise Werte, Pfeile, Hervorhebungen oder Quellen.

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

Ein KI-Bild nutzt:

- eine eingebrannte Headline + Subline im oberen Sicherheitsdrittel
- eine dominante Finanzmetapher / ein großes Hauptobjekt
- wenige unterstützende Elemente
- optional eine Person mit klar sichtbarem Gesicht
- optionale kurze deutsche Objektlabels
- einen einzigen nahtlosen deep-charcoal-green-black Hintergrund

Keine Prozent-Zonen, keine Hintergrundbänder, keine Miniatur-Dioramen.

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

## 8. Ablehnung

- Bild wäre nur Dekoration
- Zahl wird besser durch Remotion erklärt
- Bild enthält mehrere konkurrierende Hauptaussagen
- Miniatur-/Dashboard-Logik statt einer starken Metapher
- Hintergrund enthält Bänder/Zonen
- Person ist gesichtslos oder nur von hinten
