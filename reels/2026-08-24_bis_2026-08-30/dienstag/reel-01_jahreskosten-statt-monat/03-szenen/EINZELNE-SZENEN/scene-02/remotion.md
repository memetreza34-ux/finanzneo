# Remotion-Spezifikation – Szene 02

**Zwischenüberschrift:** `JEDEN MONAT WIEDER`
**Icon:** `repeat`

## Mechanismus
`RecurringEveryMonth`

## STARTZUSTAND
Oben bleibt `<SceneHeader title="JEDEN MONAT WIEDER" icon="repeat" />` sichtbar.
Ein einzelner `9,99 €`-Kostenmarker steht bei `JAN`.
Mit `<MechanismCue label="START" value="9,99 €" tone="money" />` den Ausgangspunkt eindeutig markieren.

## SICHTBARER MECHANISMUS
Die Zeitachse läuft von Januar bis Dezember. Bei jedem neuen Monat wird derselbe Kostenmarker sichtbar erneut gesetzt.
Der aktive Monat leuchtet FinanzNeo-grün; bereits gesetzte Monatsmarker bleiben weiß/creme sichtbar. Der `9,99 €`-Geldwert bleibt gold.
Die Bewegung muss klar zeigen: Es ist nicht ein einmaliger Betrag, sondern derselbe Betrag kehrt Monat für Monat zurück.

## ERGEBNIS
Alle zwölf Monatsmarker sind sichtbar. Abschluss-Cue:
`<MechanismCue label="ERGEBNIS" value="JEDEN MONAT" tone="positive" />`.

## FARBEN / LESBARKEIT
- neutraler Text: weiß
- aktiver Monat / Fokus: grün
- Geldbetrag: gold
- Warnrot hier nicht nötig
- **kein schwarzer Text auf dunklem Hintergrund**

## QA
- Start → Wiederholung → Ergebnis ohne Voiceover verständlich
- keine bloße Zahlkopie oder Fade-Deko
- Zwischenüberschrift + Icon bleiben sichtbar
- Timing aus echtem Voiceover ableiten
