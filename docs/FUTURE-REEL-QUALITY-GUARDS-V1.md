# FinanzNeo Future Reel Quality Guards V1

`REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1`

Diese Schutzschicht gilt für neu mit `reel:create` erzeugte Reels.

## 1. IMAGE oder ANIMATION

Jede Szene besitzt genau eine Hauptform:

- **IMAGE:** Google-Flow-Bild + FinanzNeo-Titel/Header/Icon + Captions. Keine erklärende Remotion-Hauptanimation über dem Bild.
- **ANIMATION:** individuell aus dem Sprechpunkt entwickelte Remotion-Hauptanimation + Header/Icon + Captions. Kein Google-Flow-Bild als Hauptvisual.

Kleine Objektbeschriftungen im Bild und Icons im Header bleiben erlaubt. SVG, Icons und Lottie dürfen Animationsszenen unterstützen, zählen aber nicht automatisch als neue Hauptmechanik.

## 2. Cover und Captions

`finanzneo-cover-hook-v3` ersetzt V2 für neue Reels:

- Titel ab Frame 0,
- kein normaler SceneHeader und kein Header-Icon in scene-01,
- **Captions beginnen mit dem ersten gesprochenen Wort — auch in scene-01**,
- gesprochenes Voiceover ohne Untertitel ist ein harter Fehler.

Eine mehrere Sekunden lange captionlose Cover-Szene bei laufendem Voiceover ist damit nicht mehr zulässig.

## 3. Echte Animations-Diversität

Motion-Metadaten allein reichen nicht. `validate-reel-quality-guards-v1.mjs` liest die echte `animation.tsx` und vergleicht die verwendeten physischen Hauptobjekte.

- dieselbe konkrete Hauptobjekt-Sprache darf nicht drei der letzten vier Animationen dominieren,
- stark überlappende direkt aufeinanderfolgende Hauptobjekt-Sets werden blockiert,
- Wiederholung ist nur mit konkreter `repetitionJustification` erlaubt,
- andere `MECHANIC_ID`, Icons, Lotties oder Labels allein machen keine sichtbar neue Animation.

## 4. Horizontale Animation-Safe-Zone

Die Animation lebt innerhalb:

```text
X = 72–1008
Y = 320–1400
```

Für statisch platzierte physische Objekte gilt zusätzlich ein perspektivischer Innenabstand von 24 px. Dadurch wird verhindert, dass 3D-/Perspective-Ränder, Schatten oder skalierte Objekte am Canvas abgeschnitten werden.

Die Source-Prüfung ist nur die erste Schicht. Im echten Candidate rendert die Phase-3-QA zusätzlich Sampleframes und prüft die äußeren horizontalen Randbänder. Sichtbarer Animationsinhalt dort kann den finalen Export blockieren.

## 5. Reihenfolge

```text
Sprechpunkt
→ IMAGE oder ANIMATION
→ bei ANIMATION individuelle Mechanik entwickeln
→ Source-Diversity prüfen
→ horizontale Safe-Zone prüfen
→ echter Render
→ Caption-/Header-QA
→ Edge-Band-QA
→ finaler Export
```
