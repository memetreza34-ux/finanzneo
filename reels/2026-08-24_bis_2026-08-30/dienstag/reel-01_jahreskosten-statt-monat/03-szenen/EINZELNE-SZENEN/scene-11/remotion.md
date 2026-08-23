# Remotion-Spezifikation – Szene 11

**Zwischenüberschrift:** `4 WOCHEN ≠ 1 MONAT`
**Icon:** `calendar`
**Header-Ton:** warning

## Mechanismus
`FourWeeksCreates13Payments`

## STARTZUSTAND
`<SceneHeader title="4 WOCHEN ≠ 1 MONAT" icon="calendar" tone="warning" />` bleibt sichtbar.
Zwei horizontale Jahres-Spuren beginnen gleichzeitig im Januar:
- oben `MONATLICH`
- unten `ALLE 4 WOCHEN`
Start-Cue: `<MechanismCue label="START" value="JANUAR" tone="neutral" />`.

## SICHTBARER MECHANISMUS
Die obere Spur setzt pro Kalendermonat genau einen weißen/grünen Zahlungsmarker und endet bei zwölf Markern.
Die untere Spur setzt alle 28 Tage einen Marker. Sie läuft sichtbar schneller durch das Kalenderjahr und erreicht vor Jahresende einen **13. Marker**.
Der gerade entstehende Marker ist grün; bereits gesetzte Marker bleiben weiß. Der zusätzliche 13. Marker wird am Ende rot/orange hervorgehoben, weil er die unerwartete Mehrzahlung erklärt.

## ERGEBNIS
Oben: `12 ZAHLUNGEN` in weiß/grün.
Unten: `13 ZAHLUNGEN` mit dem 13. Marker deutlich rot hervorgehoben.
Ergebnis-Cue: `<MechanismCue label="UNTERSCHIED" value="13. ZAHLUNG" tone="warning" />`.

## FARBEN / LESBARKEIT
- neutral: weiß
- laufender Fokus: grün
- zusätzlicher/problematischer 13. Marker: rot
- Geld wäre gold, hier nicht nötig
- **kein schwarzer Text auf dunklem Hintergrund**

## QA
- Kalenderbewegung muss den Unterschied beweisen
- nicht nur zwei Zahlen nebeneinander
- Zwischenüberschrift + Icon sichtbar
- ohne Ton verständlich
- keine erfundene Produktkondition
- Timing aus echtem Voiceover
