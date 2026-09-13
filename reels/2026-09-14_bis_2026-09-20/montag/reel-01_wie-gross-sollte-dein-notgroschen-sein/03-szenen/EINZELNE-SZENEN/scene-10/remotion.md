# scene-10 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
So bleibt dein Alltagsgeld getrennt von deiner Rücklage. Merke dir: Giro für heute, Tagesgeld für später.

## Mechanik
MECHANIC_ID: today-bill-uses-giro-future-money-stays

PRIMARY_ACTION: HEUTE-Kalender und Einkauf erscheinen beim Girokonto → Giro-Geld bezahlt den Einkauf → SPÄTER-Kalender bleibt beim Tagesgeld → Rücklage bleibt unberührt → Schlussbild stellt HEUTE und SPÄTER klar gegenüber.

## Pflicht
- START → MECHANISMUS → RESULT muss ohne Ton verständlich sein.
- Reale physische Objekte tragen die Erklärung.
- Mehrere koordinierte Motion-Channels mit unterschiedlicher Bewegungsphysik.
- Ergebnis mindestens 15 Frames stabil halten.
- Pure-black Canvas kommt zentral; AnimationStage bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
