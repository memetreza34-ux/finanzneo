# Remotion-Spezifikation scene-03

- **Komponente:** `CategoryPriceDivergence`
- **Headline:** `PREISE LAUFEN AUSEINANDER`
- **Datenquelle:** Destatis, VPI Juli 2026 gegenüber Juli 2025
- **Werte:** Kraftstoffe `+23,0 %`, Nahrungsmittel `+0,4 %`, Haushaltsenergie `−1,4 %`

## Startzustand

Drei gleich große physische Kategorie-Podeste stehen auf einer gemeinsamen Null-Linie. Links ein großer Kraftstoff-/Zapfsäulen-Körper, mittig ein Lebensmittelkorb, rechts ein Haushaltsenergie-Meter. Unter jedem Objekt steht nur das kurze Kategorienlabel. Alle numerischen Werte beginnen sichtbar bei `0,0 %`.

## Handlung

1. Beim gesprochenen Wort `Kraftstoffe` wird nur das linke Objekt aktiv. Eine vertikale Messsäule fährt physisch hoch; der Wert zählt gleichmäßig bis `+23,0 %`. Rot-Orange signalisiert Preisdruck, ohne Alarm-Look.
2. Bei `Nahrungsmittel` bewegt sich die mittlere Säule nur minimal bis `+0,4 %`. Die geringe Bewegung ist bewusst sichtbar, aber nicht übertrieben.
3. Bei `Haushaltsenergie` fährt die rechte Säule leicht unter die feste Null-Linie und endet bei `−1,4 %`; dafür Emerald/Mint statt Rot verwenden.
4. Bereits abgeschlossene Werte bleiben ruhig sichtbar, während die nächste Kategorie animiert.

## Endzustand

Alle drei Zielwerte stehen gleichzeitig auf derselben Null-Basis. Eine kleine, dezente Klammer darunter trägt `JULI 26 vs. JULI 25`. Der extreme Abstand zwischen +23,0 %, +0,4 % und −1,4 % ist das eigentliche Schlussbild.

## Mechanismus

`gleicher Start → drei reale Preisentwicklungen laufen in unterschiedliche Richtungen → klare Spannweite`

## Motion-Regeln

- Kein simples Einblenden fertiger Balken.
- Zahlen wachsen synchron zur physischen Säulenbewegung.
- Keine Bounce- oder Overshoot-Effekte an Datenwerten.
- Keine Aktienchart-Ästhetik.
- Keine Partikel als Hauptanimation.
- Keine Kamera-Zooms als Ersatz für den Mechanismus.
- Headline und Untertitel bleiben außerhalb des Datenbereichs.
- Finale Dauer erst aus echtem Voiceover ableiten.
