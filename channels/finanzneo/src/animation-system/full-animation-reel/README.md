# FinanzNeo – erstes vollständig animiertes Reel

## Thema

**100 € ab 20 oder 200 € ab 30?**

Das Reel erklärt mit einer konsistenten Beispielrechnung, warum ein früherer Start trotz niedrigerer monatlicher Einzahlung zu einem höheren Endvermögen führen kann.

## Annahmen

- monatliche Einzahlung
- Sparen bis Alter 60
- angenommene Rendite: 7 % pro Jahr
- monatliche Verzinsung
- vor Kosten, Steuern und Inflation
- keine Renditegarantie

Ergebnisse der Beispielrechnung:

- 100 € monatlich ab 20: 48.000 € eingezahlt, rund 262.481 € Endvermögen
- 200 € monatlich ab 30: 72.000 € eingezahlt, rund 243.994 € Endvermögen

## Sieben neue Animationen

1. `EarlyVsLateRace` – zwei Sparrouten mit zehn Jahren Startunterschied
2. `DualContributionTimeline` – Einzahlungen auf zwei Lebenszeitachsen
3. `ContributionResultFlip` – Wende von Einzahlungen zu Endvermögen
4. `CompoundEngine` – Rendite erzeugt weitere Rendite
5. `DelayedGrowthRace` – korrekte Wachstumskurven von Alter 20 bis 60
6. `CapitalCompositionReveal` – Einzahlung und Wachstum werden getrennt
7. `TimeAdvantageFinale` – Uhr und Vermögenshebel als Schlussbild

Das Reel besteht ausschließlich aus programmierten Animationen. Es verwendet keine normalen Bildszenen und ist als isolierte Remotion-Composition umgesetzt.

## Dauer und Format

- 40 Sekunden
- 1.200 Frames
- 30 fps
- 1080 × 1920
- Composition-ID: `FinanzNeoFirstFullAnimationReel`

## Befehle

```bash
npm run finance:full-animation-reel:structure
npm run finance:full-animation-reel:validate
npm run finance:full-animation-reel:studio
npm run finance:full-animation-reel:stills
npm run finance:full-animation-reel:render
```

Ausgaben:

```text
/tmp/finanzneo-full-animation-hook.png
/tmp/finanzneo-full-animation-compound.png
/tmp/finanzneo-full-animation-growth.png
/tmp/finanzneo-full-animation-composition.png
/tmp/finanzneo-first-full-animation-reel.mp4
```

## Sicherheitszustand

- keine Registrierung im produktiven `FinanzNeoRoot`
- keine globalen Feature-Flags aktiviert
- kein automatisches Routing aktiviert
- keine Änderung an `main`
- ausschließlich Test- und Entwicklungsbranch

## Noch erforderlich

Vor einer Veröffentlichung müssen der vollständige MP4-Render und mehrere Frames pro Szene visuell geprüft werden. Für eine finale Veröffentlichung fehlt außerdem eine echte Voiceover-Audiodatei; der aktuelle Build enthält den synchronisierten Sprechertext als sichtbaren Caption-Bereich.
