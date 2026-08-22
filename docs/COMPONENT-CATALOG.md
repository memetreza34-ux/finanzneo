# FinanzNeo — verbindlicher Komponenten-Katalog

Dieser Katalog legt fest, welche Remotion-Komponenten für neue produktive Reels bevorzugt werden.

Grundregel:

> Erst eine empfohlene Standardkomponente verwenden. Eine Spezialkomponente nur wählen, wenn der konkrete Beat sie wirklich benötigt.

Alle neuen Produktionsdateien importieren aus `src/design-system`.

---

## 1. Hintergrund

### Standard

```tsx
<FinanceBackground variant="standard" />
```

Verwendung:

- normale Erklärung
- KI-Bild im Mittelpunkt
- Text- und Zahlenbeats
- ruhige Hooks

### Daten

```tsx
<FinanceBackground variant="data" />
```

Verwendung:

- Diagramme
- Tabellen
- Markt- und Statistikbeats

### Premium

```tsx
<FinanceBackground variant="premium" />
```

Nur für:

- starken Hook
- Payoff
- Kapitelhöhepunkt
- seltene emotionale Betonung

Nicht als Standard für jedes Bild verwenden.

### Safe-Area-Prüfung

```tsx
<VerticalSafeAreaGuide enabled />
```

Nur im Studio oder in QA-Keyframes verwenden. Vor dem finalen Render deaktivieren.

---

## 2. Überschrift und Fließtext

| Aufgabe | Standard | Spezialfall |
|---|---|---|
| Hauptüberschrift | `Title` | `KineticPunch` für ein einzelnes Hook-Wort |
| Erklärungstext | `Body` | `WordReveal` bei bewusstem Wort-für-Wort-Aufbau |
| kleines Themenlabel | `Kicker` | `Badge` für Status oder Kategorie |
| einzelnes markiertes Wort | `Emphasis` | `Shine` für seltenen Payoff |

Regeln:

- keine komplette Überschrift mit mehreren konkurrierenden Text-FX animieren
- maximal ein dominanter Texteffekt pro Beat
- `KineticPunch`, `Scramble`, `WaveText` und `FlipIn3D` nicht gleichzeitig kombinieren

---

## 3. Untertitel

### Standard

```tsx
<SentenceKaraokeCaptions sentences={sentences} />
```

### Spezialfall

```tsx
<CaptionsBoxed sentences={sentences} />
```

`CaptionsBoxed` nur bei unruhigem Bildmaterial oder zu geringem Kontrast.

Verbindlich:

- Datenformat `finanzneo-caption-v1`
- genau eine kurze vollständige Sinneinheit gleichzeitig
- höchstens 10 Wörter und 68 Zeichen
- ab 33 Zeichen zwei ausgewogene Zeilen, höchstens 40 Zeichen pro Zeile
- feste Schriftgröße 46 px ohne Auto-Fit
- maximal zwei Zeilen
- aktives Wort immer FinanzNeo-grün, übrige Wörter weiß
- keine Sprung-, Größen- oder Scale-Animation
- Position ausschließlich aus `src/brand/reel-contract.json`

---

## 4. Geldbeträge und Zahlen

| Aufgabe | Empfohlene Komponente | Einsatz |
|---|---|---|
| statische Hauptzahl | `BigStat` | schnelle, klare Kernaussage |
| normal hochzählender Wert | `Counter` | kontinuierliche Entwicklung |
| wichtiger Endwert | `DramaticNumber` | ein starker Payoff pro Reel |
| Ziffern rollen einzeln ein | `DigitSlots` | seltener dramatischer Reveal |
| Begriffe wechseln | `SlotRoller` | Auswahl oder Gegenüberstellung |
| Countdown | `CountdownRoller` | echte zeitliche Dramaturgie |

Nicht empfohlen:

- mehrere Roller gleichzeitig
- dramatische Zahleneffekte für nebensächliche Werte
- direkt eingetragene Endwerte ohne zentralen Rechner

Jeder finanzielle Endwert muss aus `src/finance/calculations.ts` oder einer validierten Datendatei kommen.

---

## 5. Charts

### Zeitreihe oder Sparplan

Standard:

```tsx
<PremiumCharts.PremiumChart ... />
```

oder eine validierte fertige Variante aus `PremiumCharts`.

Pflicht:

- beschriftete X- und Y-Achse
- sichtbare Einheit
- Annahmen oder Quelle
- passende Skalierung
- keine Fantasiekurve

### Einfacher Balkenvergleich

Standard:

```tsx
<Bars ... />
```

Für komplexere horizontale Vergleiche darf `ChartBlocks.FNHBars` verwendet werden.

### Anteil oder Verteilung

- `Donut` für einen klaren Anteil
- `PiePremium` nur bei wenigen klar unterscheidbaren Kategorien
- `PercentRing` für genau einen Prozentwert

### Nicht für reale Finanzbehauptungen verwenden

- `LegacyKit.FNGrowthCurve`
- `ComplexBlocks.FNExponential`
- achsenlose dekorative Wachstumskurven
- `GrowthChart` ohne explizite, validierte `fn`-Berechnung

Diese Komponenten dürfen höchstens als klar gekennzeichnete schematische Illustration eingesetzt werden.

---

## 6. Vergleiche

| Situation | Standard |
|---|---|
| zwei Optionen | `CompareSplit` |
| mehrere Kriterien | `Table` |
| Vor- und Nachteile | `Checklist` oder `CheckCards` |
| Rangfolge | `Ranking` |
| zwei Entwicklungen über Zeit | `PremiumCharts.FNDualLinePro` oder eigener `PremiumChart` |

Keine zwei verschiedenen Vergleichskomponenten im selben Beat stapeln.

---

## 7. Abläufe und Erklärungen

| Aufgabe | Standard |
|---|---|
| nummerierte Handlung | `NumberedSteps` |
| zeitlicher Verlauf | `Timeline` oder `MilestoneTimeline` |
| Ursache und Wirkung | `Flowchart` |
| wiederholender Kreislauf | `Cycle` |
| Prioritätsebenen | `Pyramid` |
| kurzer Hinweis | `Callout` |

Für eine konkrete räumliche Geschichte kann stattdessen ein freigegebenes KI-Bild verwendet werden.

---

## 8. Finanzkonzepte

Empfohlene Spezialkomponenten:

- `FinanceConcepts.FNEmergencyFund`
- `FinanceConcepts.FNDiversification`
- `FinanceConcepts.FNCostAverage`
- `FinanceConcepts.FNRiskReturn`
- `FinanceConcepts.FNDrawdown`

Vor Verwendung prüfen:

1. passt die Komponente exakt zum gesprochenen Satz?
2. sind alle enthaltenen Zahlen korrekt oder nur schematisch?
3. ist sie auf 9:16 und Smartphone-Größe verständlich?
4. konkurriert sie nicht mit einem notwendigen KI-Bild?

---

## 9. CTA und Branding

| Aufgabe | Standard | Spezialfall |
|---|---|---|
| kurzer Follow-Hinweis | `SubscribeBar` | `UIBlocks.FNFollowBar` |
| finale Endcard | `EndCard` | `UIBlocks.FNNextVideo` |
| Logo-Intro | grundsätzlich vermeiden | `LogoIntro` nur nach der Hook oder als sehr kurzer Übergang |
| Rechtshinweis | `Disclaimer` | keine langen Intro-Disclaimer |

Der CTA darf nicht stärker animiert sein als der eigentliche Lerninhalt.

---

## 10. Übergänge

Standard:

- einfacher Cut
- kurzer Fade
- ruhiger Slide
- bestehende Exports aus `src/brand/transitions`

Premium-Übergänge wie `CircleReveal`, `ZoomBlur`, `PixelDissolve` oder `BarsWipe` nur bei einem echten Kapitelwechsel verwenden.

Maximal ein auffälliger Übergangstyp pro Reel.

---

## 11. Dekoration

Erlaubt:

- eine dezente Linie
- ein Pfeil zur Erklärung
- eine kleine Hervorhebung
- wenige Partikel bei einem Payoff

Nicht erlaubt:

- Deko ohne inhaltliche Funktion
- mehrere Glows, Partikel, Marquees und Pfeile gleichzeitig
- Bewegung in jeder Ecke
- Animation, die Untertitel oder KI-Bild überdeckt

---

## 12. Entscheidungsreihenfolge

Vor jeder neuen Komponente:

1. Reicht eine Kernkomponente aus `src/design-system`?
2. Gibt es eine empfohlene Premium-Komponente in diesem Katalog?
3. Ist die Spezialkomponente für diesen Satz wirklich verständlicher?
4. Sind Daten, Safe Areas und Smartphone-Lesbarkeit geprüft?
5. Erst wenn alle Antworten passen, wird die Komponente verwendet.

Eine neue Komponente wird nur gebaut, wenn keine vorhandene Variante denselben Zweck bereits gut erfüllt.
