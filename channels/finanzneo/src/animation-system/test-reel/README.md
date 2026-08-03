# Isoliertes Finanzanimations-Test-Reel

Diese Composition prüft alle zwölf registrierten Finanzanimationen und anschließend drei absichtlich ungültige Eingaben. Ungültige Fälle müssen durch `SafeFinanceAnimationRenderer` vor dem zentralen Renderer blockiert und als nachvollziehbarer Bild-Fallback dargestellt werden.

## Enthaltene gültige Szenen

1. Geldfluss
2. Budget-Aufteilung
3. Zinseszins
4. Portfolio-Aufteilung
5. Kaufkraftverlust
6. Schuldenabbau
7. Monatlicher Sparplan
8. Vorher-Nachher-Vergleich
9. Risiko und Rendite
10. Finanz-Zeitleiste
11. Einnahmen und Ausgaben
12. Steuern und Gebühren

Die Reihenfolge wird direkt aus `FINANCE_ANIMATION_TEMPLATES` abgeleitet. Dadurch kann ein registriertes Template nicht unbemerkt im Test-Reel fehlen.

## Enthaltene Fallback-Fälle

1. Pflichtdaten fehlen
2. unsichere verschachtelte Datenstruktur
3. ungültiger Szenenmodus

Die Fallback-Karte zeigt die normalisierten Parserfehler. Sie führt keinen unbekannten Inhalt aus und aktiviert niemals den produktiven Renderer.

## Studio öffnen

```bash
npm run finance:animation-test-reel:studio
```

## Stabile Fallback-Vorschau rendern

```bash
npm run finance:animation-test-reel:still
```

Ausgabe:

```text
/tmp/finance-animation-fallback-preview.png
```

Die eigene Composition `FinanceAnimationFallbackPreview` vermeidet einen fragilen, von der Szenenanzahl abhängigen Frame-Index.

## Vollständiges Testvideo rendern

```bash
npm run finance:animation-test-reel:render
```

Ausgabe:

```text
/tmp/finance-animation-test-reel.mp4
```

## Sicherheitsstatus

- nicht im produktiven `FinanzNeoRoot` registriert
- nicht mit `FinanceProductionLayer` verbunden
- nicht mit `FinanceImageFirstReel` verbunden
- alle Animations-Feature-Flags bleiben deaktiviert
- unbekannte Eingaben durchlaufen Parser und vollständige Template-Validierung
- Fallback-Gründe werden sichtbar und nachvollziehbar dargestellt
