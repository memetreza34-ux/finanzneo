# Visual QA

MOTION_CORE: finanzneo-motion-core-v1

MOTION_ART_DIRECTION=PENDING
PLAYWRIGHT_VISUAL_QA=PENDING

Diese Datei ist ein hartes Future-Reel-Gate. PASS erst nach echter Sichtprüfung in Remotion Studio/Playwright setzen. Metadaten oder Frame-0-Smoke allein reichen nicht.

## Animationsszenen

| SCENE | ZUSTÄNDE | STATUS |
|---|---|---|
| scene-06 | START / TRIGGER / MID / NEAR RESULT / FINAL HOLD | PENDING |

## Bildszenen

| SCENE | PRÜFUNG | STATUS |
|---|---|---|
| scene-01 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-02 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-04 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-05 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-07 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-09 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-10 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |
| scene-11 | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |

## Art-Direction-Gate

Prüfen: Hero-Größe, optische Zentrierung, Proportionen, Materialität, Tiefe, Perspektive, Blickführung, Kamera, Safe-Zones und sauberer RESULT HOLD. Nach echter Prüfung auf `MOTION_ART_DIRECTION=PASS` setzen.

## Playwright-Gate

Animationsszenen mindestens an START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD prüfen. Bildszenen an stabilem Frame prüfen. Nach echter Screenshot-/Pixelprüfung auf `PLAYWRIGHT_VISUAL_QA=PASS` setzen.

Bei einem Defekt bleibt der jeweilige Marker PENDING/FAIL und die Quelle wird korrigiert.
