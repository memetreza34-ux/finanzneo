# Remotion-Spezifikation – Szene 13

**Zwischenüberschrift:** `ECHTE FIXKOSTENLAST`
**Icon:** `wallet`

## Mechanismus
`FixedCostLoad`

## STARTZUSTAND
`<SceneHeader title="ECHTE FIXKOSTENLAST" icon="wallet" />` bleibt oben sichtbar.
Ein großer Budgetbehälter ist vollständig frei und trägt das weiße Label `BUDGET`.
Start-Cue: `<MechanismCue label="START" value="BUDGET FREI" tone="neutral" />`.

## SICHTBARER MECHANISMUS
Nacheinander erscheinen klar beschriftete Fixkosten-Gewichte: `STREAMING`, `APPS`, `MITGLIEDSCHAFT`, `MOBILFUNK` und `WEITERE FIXKOSTEN`.
Jedes Gewicht dockt sichtbar am Budget an und färbt einen weiteren Bereich als gebunden. Der noch freie Bereich wird Schritt für Schritt kleiner.
Der gerade andockende Kostenblock ist grün hervorgehoben; bereits gebundene neutrale Bereiche bleiben gut lesbar weiß/cream. Wenn ein Kostenblock als problematisch dargestellt wird, darf er rot erscheinen. Keine schwarzen Labels verwenden.

## ERGEBNIS
Der gebundene Bereich trägt klar `FIXKOSTEN`; der verbleibende freie Bereich `VARIABEL`.
Ergebnis-Cue: `<MechanismCue label="ÜBRIG" value="VARIABLE AUSGABEN" tone="positive" />`.
Keine erfundene Prozentzahl und kein angenommenes Einkommen.

## FARBEN / LESBARKEIT
- neutral: weiß
- aktueller Mechanismus/Fokus: grün
- Problem nur bei Bedarf: rot
- Geldwerte, falls eingeblendet: gold
- **kein schwarzer Text auf dunklem Hintergrund**

## QA
- Ursache: regelmäßige Kosten → sichtbare Budgetbindung → kleinerer variabler Rest
- kein statisches Balkendiagramm ohne Prozess
- Zwischenüberschrift + Icon sichtbar
- ohne Ton grundlegend verständlich
- keine erfundenen Prozentwerte
- Timing aus echtem Voiceover
