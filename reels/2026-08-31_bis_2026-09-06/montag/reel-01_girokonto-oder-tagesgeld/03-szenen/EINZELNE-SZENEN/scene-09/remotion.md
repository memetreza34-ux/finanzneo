# scene-09 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
Ein einfacher Start: Gehalt kommt aufs Girokonto. Ein fester Betrag geht automatisch aufs Tagesgeld.

## Motion-Director-Entscheidung
MECHANIC_ID: fn-account-transfer

FINANZ-AUSSAGE: Nach dem Gehaltseingang wird ein fester Teil automatisch vom Girokonto auf das Tagesgeld verschoben.

PHYSISCHE_URSACHE_WIRKUNG: Gehalt wird zuerst vom Girokonto aufgenommen; danach löst sich eine klar kleinere Einheit, bewegt sich auf einem eindeutigen Weg zum Tagesgeld und wird dort absorbiert, wodurch der Füllstand steigt.

HERO_OBJECT: Die feste Geld-Einheit auf dem Weg Girokonto → Tagesgeld.

SUPPORT_OBJECTS: Girokonto, Tagesgeld-Reservetank und Monatsmarker.

PRIMARY_ACTION: Monatsanfang erscheint → Gehalt landet im Girokonto → ein fester Teil löst sich → Geld bewegt sich sichtbar zum Tagesgeld → Ziel absorbiert die Einheit → Reservefüllstand steigt → Ergebnis AUTO GETRENNT.

MOTION_AXIS: links → rechts mit klarer Zielabsorption.

RESULT_TYPE: Zielreserve steigt nach abgeschlossenem Konto-zu-Konto-Transfer.

WARUM_NICHT_DOPPELT: Dies ist die einzige Animationsszene im Reel, deren Hauptmechanik ein echter Transfer zwischen zwei Geldorten ist.

## Pflicht
- Kanonische V1-Familie `fn-account-transfer` verwenden.
- `src/motion` ist die erste Implementierungsquelle.
- START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → RESULT HOLD muss ohne Ton verständlich sein.
- Die Geld-Einheit darf nach der Ankunft nicht zusätzlich vor dem Ziel liegen bleiben; sie wird sichtbar absorbiert.
- Höchstens zwei primäre Bewegungen gleichzeitig.
- Ergebnis mindestens 22 Frames stabil halten.
- Pure-black Canvas kommt zentral; `PremiumPhysicalStage` bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
