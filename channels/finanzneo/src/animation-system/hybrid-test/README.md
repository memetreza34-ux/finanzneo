# FinanzNeo Hybrid-Sichtbarkeitstest

Dieser Test verbindet die vorbereitete Animations-Foundation erstmals mit dem bestehenden Reel-Aufbau, ohne die globalen Animationsflags zu aktivieren.

## Ziel

Die Animationen müssen im Reel tatsächlich sichtbar sein. Sie dürfen weder vom Bildlayer noch von alten Szenenüberschriften oder dem Untertitelbereich verdeckt werden.

## Ebenenreihenfolge

1. bestehendes Bild-Reel
2. ausgewählte Finanzanimation
3. normale Szenenüberschrift nur bei Bildszenen
4. CTA- und Caption-Ebenen

Animationsszenen unterdrücken deshalb die alte Szenenüberschrift. Der Modus `caption-safe` verkleinert und verschiebt die Animation leicht nach oben, sodass unten ein klarer Untertitelbereich frei bleibt.

## Testaufbau

Das 30-sekündige 9:16-Test-Reel enthält sechs Szenen:

1. Bild-Hook
2. Zinseszins-Animation
3. Bild-Brücke
4. Inflations-Animation
5. Portfolio-Animation
6. Bild-Payoff

Damit wird nicht jede Szene animiert. Drei unterschiedliche Animationstypen wechseln sich mit normalen Bildszenen ab.

## Befehle

```bash
npm run finance:hybrid-visibility:structure
npm run finance:hybrid-visibility:studio
npm run finance:hybrid-visibility:stills
npm run finance:hybrid-visibility:validate
npm run finance:hybrid-visibility:render
```

Ausgaben:

```text
/tmp/finance-hybrid-visible-compound.png
/tmp/finance-hybrid-visible-inflation.png
/tmp/finance-hybrid-visible-portfolio.png
/tmp/finance-hybrid-visibility-test.mp4
```

## Sicherheitszustand

- globales Animationssystem bleibt deaktiviert
- Test läuft auf dem separaten Branch `test/finanzneo-visible-hybrid-reel`
- Foundation-PR wird nicht verändert
- Animationen werden nur über explizite Scene-ID-Zuordnungen eingeblendet
- ungültige Animationsdaten zeigen weiterhin den sicheren Bildmodus
- keine automatische Template-Auswahl im Test-Reel
