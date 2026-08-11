# FinanzNeo — verbindliches Bildsystem

> Bei Widerspruch gilt `CLAUDE.md`.

## Bildwelt

- World ID: `finanzneo-connected-studio-v3`
- Premium fintech editorial 3D
- eine dominante Finanzmetapher / Hero-Objekt
- optional stilisierte erwachsene Person; Gesicht klar sichtbar
- deep charcoal green-black
- emerald/mint Akzente
- Gold für Geld/Wert
- Rot-Orange für Verlust/Risiko/Schulden
- smooth rounded geometry, soft bevelled edges
- kein Fotorealismus, Pixar oder Clay

## Hintergrund

Jedes 9:16-Nutzerbild verwendet genau einen nahtlosen Hintergrund von oben bis unten.

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions.
No visible top/bottom sections.
No separate zones or panels.
No bands.
No floor-wall boundary.
No horizon line.
Do not create a visible floor, wall or studio horizon.
```

Keine Prozent-Zonen. Auch hinter der Cover-Überschrift kein separater Header-Balken oder Panel-Hintergrund.

## Personen

Wenn eine Person vorkommt:

- Gesicht klar sichtbar
- Augen/Nase/Mund erkennbar
- frontal oder natürliche 3/4-Ansicht
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

## Text im KI-Bild

### Cover `Bild 00`

Pflicht:

- eine große deutsche Cover-Überschrift direkt im Google-Flow-Bild
- exakter Text steht im Cover-Prompt unter `COVER-ÜBERSCHRIFT – EXAKT SO:`
- ungefähr 3–8 Wörter, maximal zwei Zeilen
- nennt konkret das Reel-Thema
- auf Smartphone gut lesbar
- keine separate Textbox/kein Header-Balken/kein zweiter Hintergrund
- kein zusätzlicher Subtitle, CTA oder erklärender Satz
- fehlt/falsch/abgeschnitten/unlesbar → Cover in Google Flow neu erzeugen
- niemals in Remotion ergänzen oder reparieren

### Szenenbilder `Bild 01+`

Erlaubt: explizit vorgegebene kurze deutsche Objektlabels, normalerweise 1–3 Wörter.

Verboten: Headline, Untertitel, erklärender Satz, CTA, zufällige Zusatztexte.

## Marken

Reale Marken/Dienste sind erlaubt, wenn sie für die konkrete Aussage relevant sind, korrekt geschrieben werden und keine Partnerschaft suggeriert wird.

## Google-Flow-Komposition

- vertical 9:16
- Hauptmotiv groß und smartphone-lesbar
- wenige große Hauptelemente
- klare Ursache-Wirkung
- wichtige Motive/Texte bequem innerhalb des 9:16-Bildes halten
- keine Dioramen, Dashboards, Game-Level, Neon-Tunnel oder Sci-Fi-Korridore

## Darstellung in Remotion — full-frame-no-crop

Das vertikale 9:16-Nutzerbild wird **vollständig über die gesamte 1080×1920-Szene** gelegt.

Verbindlich:

- kein kleiner mittlerer Bildcontainer
- kein `VisualStage` um Nutzerbilder
- kein absichtlicher Crop
- kein Zoom-/Focal-Point-Vertrag
- kein sichtbarer Bildrand/Inlay
- keine unscharfe Kopie als Hintergrund
- Szenenheadline 01+ und Untertitel liegen als Overlay über demselben Bild
- Cover behält seine Google-Flow-Überschrift und bekommt keine Remotion-Ersatzheadline
- nur weicher kontinuierlicher transparenter Lesbarkeits-Scrim, keine harten Header-/Footer-Flächen

Verbindliche Komponente:

```text
src/design-system/FullFrameImage.tsx
```

`object-fit: contain` ist ausschließlich auf der kompletten 1080×1920-Szenenfläche für eine vertikale 9:16-Quelle zulässig. Ein kleines `contain`-Poster in einer Teilfläche bleibt verboten.

`AdaptiveSafeFillImage`, `focalX/focalY`, alte Scale-/Crop-Grenzen und absichtliches Wegcroppen des Nutzerbildes sind nicht mehr Teil des aktiven Systems.

## Native Remotion-Szenen

- Hintergrund immer über komplette 1080×1920-Fläche
- ein durchgehender deep-charcoal-green-black Verlauf
- kein Boden
- kein Horizont
- kein Wand-/Studio-Split
- keine sichtbaren oberen/unteren Hintergrundzonen
- Animationsinhalt darf ungefähr Y 220–1490 nutzen

## Timing und Untertitel

- Szenenwechsel an echten Satzanfängen des finalen Audios
- Wortmarkierung ausschließlich über echte `start/end`-Zeitstempel
- keine gleichmäßig geschätzten Wortzeiten
- **genau ein vollständiger Satz sichtbar**
- niemals zwei Sätze gleichzeitig
- hart maximal zwei Zeilen
- ausreichend große Smartphone-Schrift
- zu langen Satz sinnvoll teilen statt winzige Schrift verwenden
- Satzwechsel beim ersten Wort des nächsten Satzes
- kurze Pausen ohne Caption-Lücke
- keine undurchsichtige/schwarze Caption-Karte

## Pflichtinhalt eines Szenenbildprompts `Bild 01+`

1. finaler Google-Flow-Dateiname
2. erlaubte kurze deutsche Labels
3. dominante Metapher / Hero-Objekt
4. sichtbare Ursache-Wirkung
5. Premium-Fintech-Editorial-3D-Stil
6. nahtlose Hintergrundregel
7. Personenregel, falls nötig
8. Negativregeln
9. vertikales 9:16 mit wichtigen Motiven sicher innerhalb des Frames
10. explizit: `No headline. No subtitle. No explanatory sentence.`

## Pflichtinhalt des Cover-Prompts `Bild 00`

1. finaler Cover-Dateiname
2. `COVER-ÜBERSCHRIFT – EXAKT SO:` + konkreter deutscher Text
3. klare Hero-Metapher für das Reel-Thema
4. maximale Zwei-Zeilen-Typografie
5. keine zweite Textzeile als Subtitle/CTA
6. derselbe nahtlose Hintergrund ohne Headline-Panel
7. explizite QA: falsche/fehlende Überschrift → neu erzeugen, nicht Remotion-Reparatur

## Sofort neu erzeugen

Cover:

- Pflichtüberschrift fehlt/falsch/abgeschnitten/unlesbar
- separater Textbalken/Panel oder zweiter Hintergrund
- zusätzlicher Subtitle/CTA/Satz

Szenenbild:

- zwei sichtbare Hintergründe/Bänder
- horizontale Trennlinie
- Floor-Wall-Grenze/Horizont
- gesichtslose/abgewandte Person
- falsche/zusätzliche Labels
- große KI-Headline/Satz
- Diorama/Game-Level
- Aussage passt nicht zum Voiceover

## Render-QA

Reparieren, wenn im Reel:

- Remotion-Ersatzheadline über dem Cover liegt
- Nutzerbild nicht bis Y=0 und Y=1920 durchläuft
- Bild unten sichtbar abgeschnitten/abgesetzt wirkt
- ein anderer Header-/Footer-Hintergrund sichtbar ist
- ein sichtbarer Bildpanel-Rand entsteht
- Caption-Karte wie ein dritter Hintergrund wirkt
- zwei Untertitelsätze gleichzeitig erscheinen
- Untertitel zu klein oder in Plattform-UI liegen
