# FinanzNeo Future Reel Quality Guards V1

`REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1`

Diese Schutzschicht gilt für neu mit `reel:create` erzeugte Reels. Für die kreative Vorstufe gilt zusätzlich `docs/CREATIVE-DIRECTOR-V1.md`.

## 0. Boring-Scene-Guard

Technische Korrektheit ist kein automatischer PASS.

Eine Szene ist vor dem Seal **FAIL**, wenn sie hauptsächlich:

- `Person + Finanzsymbol + leerer Hintergrund` zeigt,
- den gesprochenen Satz nur dekorativ illustriert,
- aus `Bank + Schild + Münzen + Pfeil` besteht,
- eine statische Icon-/Objekt-Reihe zeigt,
- ihre Aussage nur über Labels verständlich macht,
- keine sichtbare Handlung, Konsequenz oder klaren Kontrast besitzt,
- dieselbe Shot-Logik wie die letzten zwei Beats wiederholt, ohne neue sichtbare Information,
- Bewegung zeigt, ohne dass sich die inhaltliche Situation verändert,
- Ken-Burns/Zoom/Pan als einzige visuelle Entwicklung nutzt,
- bei Animationen primär Karten, Chips, Icons, Balken oder Rahmen bewegt.

Ein starker Visual Beat soll mindestens vier der folgenden Merkmale klar erfüllen:

- sofort erkennbare Handlung,
- sichtbare Konsequenz,
- interessante Kamera,
- konkreter Alltagsmoment,
- Ursache/Wirkung oder Vorher/Nachher,
- einzigartiges Story-Detail,
- klare Abwechslung zum vorherigen Beat,
- starke Hauptsilhouette / Tiefenstaffelung,
- ohne Voiceover verständlich,
- bei Animation mindestens zwei inhaltlich unterschiedliche Zustände.

Die kreative Reihenfolge kommt aus `finanzneo-creative-director-v1` und darf nicht durch einen Style-Lock oder eine technische Vorlage übersprungen werden.

## 1. IMAGE oder ANIMATION

Jede Szene besitzt genau eine Hauptform — gewählt **nach** Story Moment und Shot Design:

- **IMAGE:** Google-Flow-Bild + FinanzNeo-Titel/Header/Icon + Captions. Keine erklärende Remotion-Hauptanimation über dem Bild. Das Bild muss einen konkreten Moment, eine Handlung, Konsequenz oder klaren Kontrast zeigen.
- **ANIMATION:** individuell aus dem Sprechpunkt entwickelte Remotion-Hauptanimation + Header/Icon + Captions. Kein Google-Flow-Bild als Hauptvisual. Die Animation muss `START → Aktion/Ursache → Veränderung → RESULTAT` sichtbar zeigen.

Kleine Objektbeschriftungen im Bild und Icons im Header bleiben erlaubt. SVG, Icons und Lottie dürfen Animationsszenen unterstützen, zählen aber nicht automatisch als neue Hauptmechanik.

## 2. Cover und Captions

`finanzneo-cover-hook-v3` ersetzt V2 für neue Reels:

- Titel ab Frame 0,
- kein normaler SceneHeader und kein Header-Icon in scene-01,
- **Captions beginnen mit dem ersten gesprochenen Wort — auch in scene-01**,
- gesprochenes Voiceover ohne Untertitel ist ein harter Fehler,
- scene-01 muss als echter Story Moment funktionieren und darf kein generisches Finanzposter sein.

Eine mehrere Sekunden lange captionlose Cover-Szene bei laufendem Voiceover ist damit nicht mehr zulässig.

## 3. Echte Animations-Diversität

Motion-Metadaten allein reichen nicht. `validate-reel-quality-guards-v1.mjs` liest die echte `animation.tsx` und vergleicht die verwendeten physischen Hauptobjekte.

- dieselbe konkrete Hauptobjekt-Sprache darf nicht drei der letzten vier Animationen dominieren,
- stark überlappende direkt aufeinanderfolgende Hauptobjekt-Sets werden blockiert,
- Wiederholung ist nur mit konkreter `repetitionJustification` erlaubt,
- andere `MECHANIC_ID`, Icons, Lotties oder Labels allein machen keine sichtbar neue Animation,
- reine Flat-Infografik darf nicht automatisch als sichere Standardlösung gewählt werden,
- Kamera-, Kompositions- und Ursache/Wirkungs-Wiederholung muss ebenfalls begründet sein.

## 4. Shot-Diversität

Direkt aufeinanderfolgende Visual Beats dürfen nicht routinemäßig dieselbe Kombination verwenden aus:

- Kameradistanz,
- Hauptobjekt,
- Personenpose,
- zentraler Komposition,
- Vordergrund/Hintergrund-Verteilung,
- Ursache/Wirkungs-Anordnung.

Wiederholung ist nur zulässig, wenn der neue Beat eine klar neue sichtbare Information, Handlung oder Konsequenz zeigt.

Der Shot-Typ wird aus dem Inhalt gewählt. Er wird nicht mechanisch durch eine feste Liste rotiert.

## 5. Horizontale Animation-Safe-Zone

Die Animation lebt innerhalb:

```text
X = 72–1008
Y = 320–1400
```

Für statisch platzierte physische Objekte gilt zusätzlich ein perspektivischer Innenabstand von 24 px. Dadurch wird verhindert, dass 3D-/Perspective-Ränder, Schatten oder skalierte Objekte am Canvas abgeschnitten werden.

Die Source-Prüfung ist nur die erste Schicht. Im echten Candidate rendert die Phase-3-QA zusätzlich Sampleframes und prüft die äußeren horizontalen Randbänder. Sichtbarer Animationsinhalt dort kann den finalen Export blockieren.

## 6. Reihenfolge

```text
Sprechpunkt
→ Zuschauerfrage
→ Story Moment
→ Handlung / Konsequenz / Kontrast
→ Shot Design
→ IMAGE oder ANIMATION
→ individuelle Mechanik
→ Boring-Scene-QA
→ Source-Diversity prüfen
→ horizontale Safe-Zone prüfen
→ echter Render
→ Caption-/Header-QA
→ Edge-Band-QA
→ finaler Export
```