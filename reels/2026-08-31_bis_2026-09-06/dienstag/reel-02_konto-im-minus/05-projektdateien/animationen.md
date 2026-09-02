# ANIMATIONEN

Phase 1 besitzt die kreative und technische Verantwortung. Pro Animationsszene: remotion.md + produktionsreife animation.tsx. Lock: finanzneo-phase1-animation-code-v1.

Visuell: V9 stylized 3D animated auf transparentem Stage über zentralem pure-black Canvas. AnimationStage clippt sichtbar hart auf Y320–1400. Keine Partikel/Aurora/Grid/Glow-Hintergründe.

Pflicht: STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS → Ergebnis mindestens 15 Frames stabil. Keine Dummy-/Debug-/Wackel-/Math.sin-/Math.cos-Bewegung zum Bestehen von QA.

[REMOTION-ANIMATIONEN EINFÜGEN]

## CINEMATIC REAL-WORLD ANIMATIONSVERTRAG
Premium Visual Lock: finanzneo-premium-physical-animation-v2
Visual Target World: finanzneo-stylized-3d-animated-black-v9

Pflicht:
- dieselbe realitätsnahe stylized-3D-Welt wie die Flow-Bilder; klar nicht fotorealistisch
- echte Alltagssituation bzw. konkrete Finanzhandlung zuerst, abstrakte Symbole nur unterstützend
- STARTZUSTAND → konkrete physische Hauptaktion → sichtbare Ursache/Wirkung → eindeutiges Ergebnis
- mindestens zwei konkrete Realwelt-Objekte/-Instanzen in der visuellen Handlung
- eindeutige MECHANIC_ID je Animationsszene; keine Mechanik im selben Reel doppelt verwenden
- PRIMARY_ACTION benennt die tatsächliche physische Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- kurze deutsche Labels dürfen helfen, tragen aber niemals allein die Erklärung
- sichtbare Materialität, Dicke, Tiefe und Kontakt-Schatten
- PremiumPhysicalStage bleibt transparent; der zentrale Reel-Canvas darunter ist statisch #000000
- Ergebnis mindestens 15 Frames stabil halten

Bevorzugte konkrete Primitives, wenn passend:
- PhysicalBill
- PhysicalAccount
- PhysicalWasher
- PhysicalReserveTank
- PhysicalCalendarPage
- PhysicalCoinStack

Streng verboten als Hauptsprache:
- drei oder mehr generische beschriftete Kästen/Karten, die nur A → B → C darstellen
- Lade-/Fortschrittsbalken als Ersatz für die eigentliche Handlung
- Dashboard-/Control-Panel-/App-UI-Look
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- reine Texttafel mit Fade/Scale
- abstrakte Schild-/Pfeil-/Münz-Metapher, wenn eine reale Situation darstellbar ist
- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund
- dekorative Bewegung ohne erklärenden Mechanismus
