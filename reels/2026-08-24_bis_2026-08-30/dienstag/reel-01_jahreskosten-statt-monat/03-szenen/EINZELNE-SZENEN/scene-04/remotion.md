# Remotion-Spezifikation – Szene 04

**Zwischenüberschrift:** `MONAT WIRD JAHR`
**Icon:** `euro`

## Mechanismus
`FiveCostsToAnnual`

## STARTZUSTAND
`<SceneHeader title="MONAT WIRD JAHR" icon="euro" />` bleibt oben sichtbar.
Fünf klar getrennte `9,99 €`-Kostenmarker stehen nebeneinander.
Start-Cue: `<MechanismCue label="START" value="5 × 9,99 €" tone="money" />`.

## SICHTBARER MECHANISMUS
1. Die fünf Marker bewegen sich sichtbar zusammen und ergeben `49,95 € / MONAT`.
2. Danach erscheint ein großer grüner `× 12`-Schritt zwischen Monatswert und einer Reihe aus zwölf Monatsmarkern.
3. Die zwölf Monatsmarker füllen sich nacheinander; gleichzeitig wächst der Jahreswert nachvollziehbar.

Die Animation soll die Rechnung visuell beweisen und nicht nur das Ergebnis einblenden.

## ERGEBNIS
`599,40 € / JAHR` steht groß und deutlich als goldener Endwert.
Ergebnis-Cue: `<MechanismCue label="ERGEBNIS" value="599,40 € / JAHR" tone="money" />`.

## FARBEN / LESBARKEIT
- neutraler Text/Labels: weiß
- Rechenweg / Fokus / ×12: grün
- Geldbeträge: gold
- Rot nur bei tatsächlicher Warnung, hier nicht nötig
- **kein schwarzer Text oder schwarze Zahl auf dunklem Hintergrund**

## QA
- Start → Addition → ×12 → Jahresergebnis sofort nachvollziehbar
- keine reine Textzählung, kein Zoom-/Fade-Alibi
- Werte exakt halten
- Zwischenüberschrift + Icon bleiben sichtbar
- ohne Ton grundlegend verständlich
- Timing aus echtem Voiceover
