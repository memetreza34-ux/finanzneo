# Remotion-Spezifikation – Szene 08

**Zwischenüberschrift:** `2 POSTEN WEG`
**Icon:** `cross`
**Header-Ton:** warning

## Mechanismus
`RemoveTwoCosts`

## STARTZUSTAND
`<SceneHeader title="2 POSTEN WEG" icon="cross" tone="warning" />` bleibt oben sichtbar.
Fünf laufende Kostenposten à `9,99 €` stehen klar aktiv.
Start-Cue: `<MechanismCue label="START" value="5 POSTEN" tone="neutral" />`.

## SICHTBARER MECHANISMUS
Zwei der fünf Posten werden zuerst warm-rot als `NICHT GENUTZT` markiert. Danach werden genau diese beiden sichtbar aus der laufenden Reihe herausgezogen und ausgeblendet. Die drei verbleibenden Posten bleiben stabil sichtbar.
Parallel entsteht auf der positiven Seite ein grüner Freiraum; ein goldener Jahreswert zählt nachvollziehbar hoch.

## ERGEBNIS
Die Reihe zeigt sichtbar nur noch drei laufende Posten. Daneben steht groß `239,76 € / JAHR FREI`.
Ergebnis-Cue: `<MechanismCue label="ERGEBNIS" value="239,76 € / JAHR FREI" tone="positive" />`.

## FARBEN / LESBARKEIT
- normale aktive Kosten: weiß
- nicht genutzte/zu entfernende Posten: rot
- frei werdender Bereich / Lösung: grün
- Geldwert: gold
- **kein schwarzer Text auf dunklem Hintergrund**

## QA
- fünf → zwei markieren → zwei entfernen → drei bleiben → Jahreswirkung
- echte Ursache-Wirkung, kein Zahlen-Popup
- Zwischenüberschrift + Icon sichtbar
- ohne Ton verständlich
- Beispiel bleibt ausdrücklich ein Beispiel
- Timing aus echtem Voiceover
