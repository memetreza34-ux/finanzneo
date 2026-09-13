# FinanzNeo Image + Remotion Hybrid Test V1

`HYBRID_TEST_ID: finanzneo-image-remotion-hybrid-v1`

## Ziel

Dieser Test ist **Schritt 2** nach dem bestandenen Bildwelt-Test V1.

Wir prüfen jetzt nicht mehr, ob die Bildwelt zusammenpasst, sondern ob ein starkes FinanzNeo-Bild als Hauptszene bestehen bleibt und Remotion nur genau die Bewegung ergänzt, die den jeweiligen Finanzgedanken verständlicher macht.

Kanonische Bildwelt bleibt:

`config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt`

## Harte Regel

> **Bild = Hauptwelt. Remotion = Erklärung.**

Keine universelle Zoom-/Parallax-Schablone. Jede Szene bekommt eine eigene sichtbare Mechanik, die aus dem Inhalt abgeleitet ist.

## Die drei Test-Szenen

| Nr. | Bild | Header | individuelle Hauptmechanik |
| --- | --- | --- | --- |
| 01 | Notgroschen + Waschmaschine | `Notgroschen fängt Reparaturen ab` | gerichteter Reserve→Rechnung-Geldfluss |
| 02 | Wasserschaden + Hausrat | `Versicherung begrenzt den Schaden` | Fokusübergabe Schaden→Deckung |
| 03 | ETF + mehrere Bereiche | `Ein ETF verteilt dein Risiko` | Zentrum→Sektoren-Netzwerkaufbau |

Die Mechaniken dürfen nicht durch denselben Zoom ersetzt werden. Kamera darf unterstützen, aber nicht die eigentliche Erklärung sein.

## Remotion Composition

Exakt öffnen:

`ReelsTestFinanceImageHybridMotion`

Quellcode:

`src/reels-test/FinanceImageHybridMotion.tsx`

Dauer:

- 3 Szenen
- je 5 Sekunden
- insgesamt 15 Sekunden
- 1080 × 1920
- 30 fps
- kein Audio

## Sichtbare Hierarchie

Jede Szene zeigt:

1. oben FinanzNeo-`SceneHeader` + passendes Icon
2. mittig das Flow-Bild als dominantes Hauptvisual
3. darüber nur inhaltlich notwendige Remotion-Erklärung
4. unten FinanzNeo-`Captions` mit synthetischen Test-Zeitstempeln

Die Captions sind in diesem Experiment **nicht audio-synchron**, weil bewusst kein Audio enthalten ist. Sie dienen nur zur visuellen Prüfung von Position, Größe und Zusammenspiel.

## Temporäre Preview-Assets

Die Dateien unter:

`public/experiments/image-world-consistency-v1/hybrid-test-v1/`

sind komprimierte Ausschnitte aus dem vom Nutzer gezeigten Google-Flow-Screenshot. Sie existieren nur, damit die Composition sofort renderbar und visuell testbar ist.

`TEMP_PREVIEW_ASSETS_FROM_USER_SCREENSHOT: true`

Sie sind **keine Produktionsassets** und keine Qualitätsreferenz für Auflösung. Vor einem echten Reel müssen sie durch die originalen Flow-Exporte ersetzt werden.

## Erfolgskriterien

Der Test ist gut, wenn:

- die drei Bilder weiterhin wie dieselbe FinanzNeo-Welt wirken
- das Bild in jeder Szene klar Hauptdarsteller bleibt
- die Remotion-Bewegung einen konkreten Teil der Aussage erklärt
- alle drei Hauptmechaniken sichtbar verschieden sind
- Header + Icon + Caption ruhig und konsistent wirken
- keine Szene wie eine generische Motion-Template-Variante der vorherigen aussieht
- keine Animation nur aus einem Dauerzoom besteht

## Nicht Teil dieses Tests

- kein Voiceover
- keine Musik
- keine SFX
- kein echtes Reel
- keine Phase-3-Produktion
- keine Bewertung der Screenshot-Asset-Auflösung
