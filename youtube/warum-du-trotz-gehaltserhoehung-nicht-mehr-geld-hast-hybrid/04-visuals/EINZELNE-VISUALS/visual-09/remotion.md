# Remotion-Plan — Variante B / Full-Frame V2

MOTION_STANDARD: `finanzneo-youtube-motion-v4-simple`
MOTION_QUALITY_STANDARD: `finanzneo-youtube-motion-quality-v1`
YOUTUBE_VISUAL_QA_STANDARD: `finanzneo-youtube-visual-qa-16x9-v1`
LAYOUT_CONTRACT: `finanzneo-youtube-framed-scene-v2`

## Grundregel

Animation ist Erklärung, nicht Dekoration. Starke Flow-Szenen 01, 05, 08, 11, 12 und 18 bleiben bewusst statisch. Bewegung konzentriert sich auf die 12 Stellen, an denen Zeit, Geldfluss, Wachstum, Vergleich oder Aufteilung verständlicher werden.

## Full-Frame-Regel

- reine Remotion-Animationen und Datenszenen dürfen die komplette 1920×1080-Fläche als Motion-Canvas nutzen
- Animation wird nicht künstlich in das kleine Flow-Bildfenster gezwängt
- kritische Texte, Zahlen und Hauptobjekte bleiben mindestens 64 px von allen Außenkanten entfernt
- keine wichtige Bewegung darf unbeabsichtigt abgeschnitten oder geclippt werden
- Überschrift und Icon dürfen in die obere Safe Area integriert werden; sie dürfen die eigentliche Motion-Fläche nicht unnötig verkleinern
- Flow-Bilder selbst bleiben contained und niemals fullscreen
- bei Bild + Remotion darf nur die Remotion-Ebene über das Flow-Fenster hinausgehen, wenn das die Erklärung verbessert

## Szenen

| Szene | Preset | Sichtbare Änderung |
|---|---|---|
| 02 | LINE_DRAW | Einkommensstrom verliert nacheinander kleine Teile an Alltagsausgaben |
| 03 | BAR_GROW | freier Spielraum wächst nach Gehaltserhöhung |
| 04 | BAR_GROW | Gehalt steigt zuerst, Ausgaben folgen zeitversetzt |
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
- ruhige RESULT-HOLD-Phase am Ende jeder Erklärung
- vorhandenen FinanzNeo-Motion-Stack zuerst prüfen
- START → TRIGGER → ACTION → REACTION/CHANGE → RESULT → HOLD
- jede Motion muss stärker sein als ihre beste statische Alternative
- Bildwelt bleibt unverändert; Remotion imitiert keine neue Bildwelt

## 16:9 QA

Für jede der 12 Motion-Szenen werden START, 25 %, 50 %, 75 % und RESULT HOLD geprüft. PASS nur wenn Mechanik, Zahlen, Lesbarkeit, Safe Area und Clipping stimmen und die Motion die statische Alternative wirklich schlägt.
