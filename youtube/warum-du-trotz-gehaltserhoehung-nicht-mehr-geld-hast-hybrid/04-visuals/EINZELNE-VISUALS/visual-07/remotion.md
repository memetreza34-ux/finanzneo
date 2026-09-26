# Remotion-Plan — Variante B

MOTION_STANDARD: `finanzneo-youtube-motion-v4-simple`

## Grundregel

Animation ist Erklärung, nicht Dekoration. Starke Flow-Szenen 01, 05, 08, 11, 12 und 18 bleiben bewusst statisch. Bewegung konzentriert sich auf die 12 Stellen, an denen Zeit, Geldfluss, Wachstum, Vergleich oder Aufteilung verständlicher werden.

| Szene | Preset | Sichtbare Änderung |
|---|---|---|
| 02 | LINE_DRAW | Einkommensstrom verliert nacheinander kleine Teile an Alltagsausgaben |
| 03 | BAR_GROW | freier Spielraum wächst nach Gehaltserhöhung |
| 04 | BAR_GROW | Gehalt steigt zuerst, Ausgaben folgen |
| 06 | SLIDE_UP | kleine Extras sammeln sich zu höherer Monatsbasis |
| 07 | LINE_DRAW | Lebensstandard-Basis steigt stufenweise |
| 09 | SLIDE_LEFT | drei Monate erscheinen, derselbe Fixkostenblock bleibt |
| 10 | BAR_GROW | Vorher/Nachher zeigt höheres Gehalt, aber fast gleichen Rest |
| 13 | BAR_GROW | Restbudget schrumpft über vier Wochen |
| 14 | LINE_DRAW | zusätzlicher Betrag teilt sich in drei Wege |
| 15 | COUNT_UP | +300 € baut sich auf und teilt sich in 150/100/50 |
| 16 | LINE_DRAW | zuerst Sicherung, danach Alltagsbudget |
| 17 | BAR_GROW | Puffer/Vermögen wächst über sechs Monate |

## Technik

- ausschließlich frame-getriebene Remotion-Motion
- `useCurrentFrame()` plus `interpolate()` / `spring()`
- keine CSS-Keyframes, Timer, Randomness oder Runtime-Netzwerkzugriffe
- ruhige Hold-Phase am Ende jeder Erklärung
- Überschrift + Icon bleiben außerhalb des Visualfensters
- Bildwelt bleibt unverändert; Remotion imitiert keine neue Bildwelt
