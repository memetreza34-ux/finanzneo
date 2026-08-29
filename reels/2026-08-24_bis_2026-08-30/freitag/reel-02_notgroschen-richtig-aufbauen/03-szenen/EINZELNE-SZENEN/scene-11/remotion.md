# Trenne Puffer und Alltag

Voiceover: Auf einem separaten Konto bleibt der Notgroschen sichtbar getrennt von deinem täglichen Budget.

## Verbindliche visuelle Geschichte

`Girokonto` und `Tagesgeld` stehen als zwei echte getrennte Konten in der Szene. Ein Teil des Gehalts bewegt sich physisch vom Girokonto auf das Tagesgeld. Danach erscheinen `Miete` und `Einkauf` nur am Girokonto, während der Notgroschen rechts stabil und unangetastet bleibt.

**Mechanik:** `salary-splits-into-separate-reserve`

Keine abstrakten Behälter oder drei Textkarten. Die Kontentrennung und der tatsächliche Geldfluss müssen unmittelbar sichtbar sein.

Lock: finanzneo-phase1-animation-code-v1; Premium: finanzneo-premium-physical-animation-v2; START → physische Aktion → eindeutiges Ergebnis; Result-Hold >=20 Frames.

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
