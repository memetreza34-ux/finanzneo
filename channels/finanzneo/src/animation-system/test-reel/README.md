# Isoliertes Finanzanimations-Test-Reel

Diese Composition testet fünf gültige Finanzanimationen und anschließend einen absichtlich ungültigen Fall. Der ungültige Fall muss durch `SafeFinanceAnimationRenderer` als Bild-Fallback dargestellt werden.

## Enthaltene Szenen

1. Geldfluss
2. Zinseszins
3. Inflation
4. Schuldenabbau
5. Steuern und Gebühren
6. absichtlich unvollständiger Geldfluss als Fallback-Test

## Studio öffnen

```bash
cd channels/finanzneo
npx remotion studio src/animation-system/test-reel/test-reel-index.ts
```

## Einzelbild rendern

```bash
cd channels/finanzneo
npx remotion still \
  src/animation-system/test-reel/test-reel-index.ts \
  FinanceAnimationTestReel \
  /tmp/finance-animation-test-reel.png \
  --frame=450
```

## Vollständiges Testvideo rendern

```bash
cd channels/finanzneo
npx remotion render \
  src/animation-system/test-reel/test-reel-index.ts \
  FinanceAnimationTestReel \
  /tmp/finance-animation-test-reel.mp4
```

Die Test-Reel-Composition ist nicht im produktiven `FinanzNeoRoot` registriert und aktiviert keine Feature Flags.
