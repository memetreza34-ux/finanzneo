# scene-10 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
So bleibt dein Alltagsgeld getrennt von deiner Rücklage. Merke dir: Giro für heute, Tagesgeld für später.

## Motion-Director-Entscheidung
MECHANIC_ID: fn-result-lock

FINANZ-AUSSAGE: Am Ende sollen die zwei Rollen als dauerhaft getrennte Merkhilfe stabil im Kopf bleiben: Giro heute, Tagesgeld später.

PHYSISCHE_URSACHE_WIRKUNG: Girokonto und Tagesgeld bewegen sich aus einer engeren Ausgangslage in zwei feste Endpositionen; ein massiver Mittelverschluss setzt sich dazwischen und bestätigt die bereits erklärte Trennung, ohne erneut eine Zahlung zu erzählen.

HERO_OBJECT: Der finale stabile Zwei-Rollen-Zustand.

SUPPORT_OBJECTS: Girokonto, Tagesgeld-Reservetank, HEUTE/SPÄTER-Zeitmarker und zentraler Verschluss.

PRIMARY_ACTION: Beide Geldorte stehen zunächst näher zusammen → Girokonto setzt sich links auf HEUTE → Tagesgeld setzt sich rechts auf SPÄTER → ein physischer Verschluss rastet zwischen beiden ein → beide Objekte beruhigen sich → Schlusszustand bleibt lange stabil.

MOTION_AXIS: Mitte → nach außen → zentraler Verschluss nach unten/Settle.

RESULT_TYPE: Statischer Merksatz als physisch verriegelter Endzustand.

WARUM_NICHT_DOPPELT: Keine Rechnung und kein Geldtransfer mehr; die Szene schließt das Reel durch räumliches Setzen und Verriegeln statt durch eine weitere Zahlungsbewegung.

## Pflicht
- Kanonische V1-Familie `fn-result-lock` verwenden.
- `src/motion` ist die erste Implementierungsquelle.
- START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → RESULT HOLD muss ohne Ton verständlich sein.
- Keine Wiederholung der Rechnung/Geld-raus-Bewegung aus scene-03 oder scene-06.
- Keine neue Transferbewegung aus scene-09.
- Der finale Zustand muss mindestens 24 Frames stabil und vollständig lesbar bleiben.
- Pure-black Canvas kommt zentral; `PremiumPhysicalStage` bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
