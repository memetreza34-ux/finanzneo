# Cover Anchor Flow V1 — Praxistest 01

## Ziel

Dieser Test prüft den neuen Ablauf mit einer echten visuellen Master-Referenz und **genau einem manuellen Nutzer-Gate**:

1. Bild 01 wird zuerst als **Cover + Master Visual Anchor** erzeugt.
2. Bild 01 wird sofort exakt umbenannt und intern visuell geprüft.
3. Danach STOPPT der Ablauf vollständig.
4. Erst wenn der Nutzer das echte Bild ausdrücklich freigibt, z. B. mit **„sieht gut aus“**, **„passt“** oder einer gleichwertigen klaren Zustimmung, wird Bild 01 zu `APPROVED_MASTER_ANCHOR`.
5. Danach läuft der Rest **automatisch** in 5er-Arbeitsblöcken weiter.
6. Innerhalb eines 5er-Blocks werden die Bilder weiterhin technisch einzeln erzeugt: Ergebnis → warten → umbenennen → interne QA → nächstes Bild.
7. Zwischen den Folge-Bildern ist **keine weitere Nutzerbestätigung** nötig.
8. Nach einem fertigen 5er-Block startet bei längeren Produktionen automatisch der nächste 5er-Block.
9. Alle Folge-Bilder benutzen immer das ausdrücklich freigegebene Bild 01 als einzige persistente visuelle Referenz.
10. Alle finalen Dateien gehören zusammen in einen Ordner.

## Beispiel für längere Produktionen

```text
Bild 01 allein erzeugen
→ STOPP
→ Nutzer: „sieht gut aus“
→ Bild 02–06 automatisch
→ Bild 07–11 automatisch
→ Bild 12–16 automatisch
→ ... bis fertig
```

**5er-Block bedeutet nicht fünf parallele Generierungen.** Google Flow bleibt Strict Single Job: maximal ein laufender Bildjob gleichzeitig.

## Thema

**Warum kleine Monatsraten dein Budget auffressen können.**

## Was dieser Test absichtlich variiert

- Cover / Character + controlled visual tension
- POV Checkout
- starkes Einzelobjekt
- realer Character Moment
- kontrollierte visuelle Metapher
- realer Payoff

Die Folge-Bilder sollen **nicht dieselbe Komposition kopieren**. Sie sollen nur eindeutig dieselbe Art Direction, Material-/Figurensprache, Lichtwelt und Finish-Qualität wie Bild 01 besitzen.

## Google Flow — genau diese Datei verwenden

Für den Praxistest nur diese Datei komplett kopieren und einmal in Google Flow einfügen:

`TESTPROMPT-GOOGLE-FLOW.txt`

Sie ist die eindeutige Copy-Paste-Version des Tests und enthält:

- Bild 01 zuerst und allein,
- den manuellen STOPP bis zur ausdrücklichen Nutzerfreigabe,
- danach automatisches Abarbeiten in 5er-Blöcken,
- Strict-Single-Job innerhalb der Blöcke,
- alle sechs Bildjobs,
- exakte Dateinamen,
- die Pflicht, ausschließlich das vom Nutzer freigegebene Bild 01 als visuelle Referenz für Bild 02–06 zu verwenden.

`alle-bildprompts.txt` bleibt als ausführliche Referenzdatei im Experiment erhalten, ist aber **nicht mehr die empfohlene Copy-Paste-Datei für diesen Test**.

## Erwartete Dateien

- `Bild 01 - Cover - Kleine Raten.png`
- `Bild 02 - 29 Euro wirken klein.png`
- `Bild 03 - Viele kleine Raten.png`
- `Bild 04 - Monat wird eng.png`
- `Bild 05 - Jeden Monat ein Biss.png`
- `Bild 06 - Wieder Luft im Budget.png`
