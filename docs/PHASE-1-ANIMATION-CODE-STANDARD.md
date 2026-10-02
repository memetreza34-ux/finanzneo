# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist in Phase 1 kreativ und technisch fertig. Phase 3 integriert nur die versiegelte Quelle; sie erfindet keine Ersatzanimation.

Visuelles Ziel:

```text
finanzneo-stylized-3d-animated-black-v9
```

Story-Moment-Revision:

```text
finanzneo-readable-story-moment-v1
```

Technischer Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Finance Motion Library:

```text
finanzneo-finance-motion-library-v1
```

## 1. Content-first, nicht Library-first

Für jede Animationsszene gilt:

```text
SPRECHPUNKT
→ WAS MUSS DER ZUSCHAUER SICHTBAR VERSTEHEN?
→ WELCHE BEKANNTE FIGUR / WELCHE BEKANNTEN GEGENSTÄNDE TRAGEN DIE BEDEUTUNG?
→ WELCHER KLARE STORY-MOMENT ZEIGT DAS AM SCHNELLSTEN?
→ WELCHE HAUPTMECHANIK MACHT DIE VERÄNDERUNG SICHTBAR?
→ FINANCE MOTION LIBRARY AUF SEMANTISCHEN BEST-FIT PRÜFEN
→ SAME-WORLD-PASS PRÜFEN
→ PASS: PARAMETRISIEREN
→ FAIL: INDIVIDUELLE ANIMATION BAUEN
→ PRODUKTIONSREIFE animation.tsx
```

Die Finance Motion Library ist ein Mechanik-Werkzeugkasten, **keine Art-Direction**. Eine vorhandene Mechanik wird nicht benutzt, nur weil sie technisch passt.

Direkter Library-Einsatz braucht zwei Treffer:

1. **Semantischer Fit** — die Mechanik erklärt den gesprochenen Punkt.
2. **Same-World-Fit** — das gerenderte Ergebnis sieht wie dieselbe FinanzNeo-V9-Serie und dieselbe Story-Moment-Sprache aus.

Wenn die Library-Komponente wie Dashboard, Infografik, abstrakter Value-Block oder generische Geometrie wirkt, wird die Mechanik individuell in der V9-Welt umgesetzt.

## 2. Gleiche visuelle Sprache wie die Flow-Bilder

Animationen benutzen dieselbe Grundlogik wie die guten Flow-Bilder:

```text
bekannte Dinge
→ klare kleine Geschichte
→ intuitive Übertreibung/Metapher wenn sie schneller erklärt
→ hochwertige stylized-3D-Animationsfilm-Welt auf Schwarz
```

Geeignete Anker sind zum Beispiel:

- Person / Familie / Kunde / Arbeitnehmer
- Rechnung / Kassenzettel / Gebührenbeleg
- Konto / Geld / Portemonnaie / Sparrate
- Karte / Smartphone / Vertrag / Kalender
- Fernseher / Sofa / Laptop / Einkauf
- Waschmaschine / Reparatur / Haushaltskosten
- Überweisung / konkrete Finanzhandlung

Eine Animation darf bewusst übertreiben, wenn die Bedeutung sofort lesbar bleibt. Beispiele:

- ein realer Kassenzettel rollt immer weiter aus,
- mehrere bekannte Rechnungen greifen nacheinander auf dasselbe Budget zu,
- kleine wiederkehrende Gebühren sammeln sich sichtbar über Zeit,
- eine Figur wird von mehreren echten Verpflichtungen gleichzeitig beansprucht.

Intuitive Metaphern sind erlaubt und können eine trockene literal Darstellung schlagen. Sie dürfen aber kein Rätsel sein.

Abstrakte `capital body`, `wealth tower`, `value block`, `fee token`, Balken oder geometrische Wertkörper sind keine automatische Standardsprache. Sie dürfen bekannte Dinge nicht durch erfundene Finanzobjekte ersetzen.

Eine Figur ist keine Dekoration. Wenn sie vorkommt, muss Pose, Reaktion oder Handlung den Sprechpunkt sichtbar mittragen. Generische Corporate-3D-Stockfiguren, die nur neben einem Objekt stehen, sind kein Qualitätsziel.

## 3. Pflichtdateien

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält mindestens:

- `animationSourceFile`
- `animationExport`
- `animationIntent`
- `animationQualityLock`
- `animationPremiumVisualLock`

Der zentrale `phase1AnimationCode`-Vertrag trägt zusätzlich den Story-Moment-Revision-Lock.

## 4. Motion-Director-Pflicht

Jede fertige `animation.tsx` dokumentiert:

```text
MOTION_SOURCE: library-best-fit | custom-build
FINANCE_MOTION_ID: <library-slug> | none
MECHANIC_ID: semantische Mechanik
FOCAL_PATH: was das Auge verfolgt
PRIMARY_ACTION: Hauptbewegung, die die Aussage erklärt
CAMERA_ROLE: still | follow | push | reframe + konkrete Rolle
PAYOFF: klarer sichtbarer Endzustand

ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Ursache / Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: klares sichtbares Hauptmotiv
SUPPORT: nur sinnvolle unterstützende Elemente
MATERIAL: Material- und Farblogik
DEPTH: räumliche Staffelung, wenn sinnvoll
```

Zusätzlich:

```text
RESULT_HOLD_FRAMES >= 15
```

## 5. Technischer Code-Vertrag

### `library-best-fit`

- `FINANCE_MOTION_ID` existiert in `FINANCE_MOTION_REGISTRY`.
- Parameter kommen aus dem Sprechpunkt, nicht aus Template-Füllmaterial.
- Direkter Einsatz nur bei Same-World-Pass.
- Ein Wrapper darf die Mechanik in die konkrete Szene einbetten.
- Wenn der direkte Library-Look visuell abweicht, wird stattdessen `custom-build` verwendet.

### `custom-build`

- `FINANCE_MOTION_ID: none`
- `useCurrentFrame`
- zentrale `ANIMATION_COLORS`
- `interpolate`, `spring` oder vergleichbare framebasierte Remotion-Logik
- vollständige individuelle visuelle Geschichte

CSS-Keyframe-Animationen, zufällige Dauerbewegung und zeitunabhängige Fake-Motion sind keine Produktionslösung.

## 6. animation.tsx besitzt NICHT das Reel-Layout

Die Szenenanimation liefert nur transparenten visuellen Inhalt für die zentrale `AnimationStage`.

Verboten in `animation.tsx`:

- eigener schwarzer Vollbild-Canvas
- lokale `SceneShell`
- eigener globaler Header
- eigene globale Caption
- eigener dekorativer Hintergrund

Header, Captions, Reel-Canvas und Safe-Zone-Clipping werden genau einmal vom globalen Reel-Layout gerendert.

Bühne:

```text
Header: Y154
Visual: Y320–1400
Caption: bottom340
Canvas: #000000
```

## 7. Visuelle Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE URSACHE / HAUPTAKTION
→ REAKTION / VERÄNDERUNG
→ EINDEUTIGER PAYOFF
→ ERGEBNIS MINDESTENS 15 FRAMES STABIL
```

Die Bewegung erklärt die Aussage. Dekorative Bewegung zählt nicht als Mechanik.

Priorität:

1. Story-Moment und sofortige Verständlichkeit
2. Primary Action
3. Secondary Reaction
4. Camera Role
5. Payoff Hold

Eine einzige starke Bewegung ist besser als mehrere unabhängige Effekte.

## 8. Weiterhin verboten

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- Dummy-/Placeholder-Komponenten
- Debug-Flächen
- Dashboard-/Control-Panel-Komposition als Hauptsprache
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- generische Info-Cards als Hauptsprache
- reine Texttafel
- reine Zoom-/Fade-/Popup-Bewegung als komplette Erklärung
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- Bewegung nur für Frame-Diff
- eigener Partikel-/Aurora-/Grid-/Gradient-Hintergrund
- schwarzer Szenenhintergrund innerhalb der Animation
- lokale SceneShell mit dupliziertem Header oder Caption
- abstrakter `capital body`, `fee token`, `value block` oder `wealth tower` als selbsterklärter Ersatz für die eigentliche Geschichte
- Corporate-3D-Figur als statische Dekoration
- eine Library-Animation zu benutzen, nur weil sie existiert

## 9. Phase-3-Sperre

Bei erfolgreichem `reel:ready` entsteht:

```text
05-projektdateien/phase1-animation-seal.json
```

Danach:

- Phase 3 verwendet exakt die versiegelte Quelle.
- `componentPath` und `componentExport` müssen stimmen.
- SHA-256 bleibt unverändert.
- Fehlendes Binding blockiert den Render.
- Phase 3 wechselt nicht eigenmächtig zwischen Library und Custom.

## 10. Fertig bedeutet

Eine Animationsszene ist erst fertig, wenn:

- Sprechpunkt und Mechanik 1:1 zusammenpassen
- bekannte Figuren/Gegenstände oder eine sofort verständliche visuelle Situation die Bedeutung tragen
- Start, Aktion, Reaktion und Ergebnis sichtbar sind
- eine Metapher/Übertreibung ohne Erklärung intuitiv bleibt
- Focal Path und Primary Action eindeutig sind
- Library-Best-Fit und Same-World-Pass geprüft wurden
- Code ohne Platzhalter vorliegt
- die Szene auch ohne Ton grundsätzlich verständlich ist
- sie optisch zu den Flow-Bildern desselben Reels passt
- sie keinen eigenen Reel-Shell rendert
- die Visualzone sinnvoll gefüllt ist
- Phase 3 keinen kreativen Umbau mehr vornehmen muss

## 11. Visuelle Abnahme

Technische Tests sind Pflicht, aber nicht ausreichend.

Vor einer globalen Stil-Promotion muss mindestens ein echter Test-Render mit finaler Bild-/Animationssprache visuell geprüft werden. Platzhalterbilder, Textboxen oder reine Smoke-Frames beweisen keine visuelle Qualität.
