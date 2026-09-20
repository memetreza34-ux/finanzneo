# scene-06 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
Der Unterschied ist einfach: Girokonto bedeutet Alltag. Tagesgeld bedeutet Rücklage.

## Motion-Director-Entscheidung
MECHANIC_ID: fn-role-partition

FINANZ-AUSSAGE: Girokonto und Tagesgeld haben zwei getrennte Aufgaben, obwohl beides Geld ist.

PHYSISCHE_URSACHE_WIRKUNG: Eine physische Trennwand setzt sich zwischen Girokonto und Tagesgeld; eine Alltagsrechnung kann nur die Giro-Seite belasten, während die Rücklage sichtbar hinter der Trennung stabil bleibt.

HERO_OBJECT: Physische Rollen-Trennung zwischen Girokonto und Rücklage.

SUPPORT_OBJECTS: Girokonto, Tagesgeld-Reservetank und eine konkrete Alltagsrechnung.

PRIMARY_ACTION: Beide Geldorte erscheinen → eine massive Trennwand fährt zwischen die Rollen → Rechnung trifft nur die Giro-Seite und zieht dort Geld ab → Tagesgeld bleibt unberührt → Ergebnis zeigt ALLTAG und RÜCKLAGE als getrennte Aufgaben.

MOTION_AXIS: zentrale Vertikalbewegung der Trennung plus kurzer lokaler Abfluss links.

RESULT_TYPE: Zwei räumlich getrennte Rollen mit nur einer belasteten Seite.

WARUM_NICHT_DOPPELT: Anders als scene-03 steht nicht Geldfluss im Mittelpunkt; anders als scene-09 findet kein Konto-zu-Konto-Transfer statt; anders als scene-10 ist die Trennung selbst die erklärende Hauptaktion.

WHY_NEW_MECHANIC: Keine V1-Familie erklärt eine reine funktionale Rollen-Trennung ohne Transfer, Wachstum oder Verlust als Hauptaussage.

## Pflicht
- `src/motion` ist die erste Implementierungsquelle.
- START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → RESULT HOLD muss ohne Ton verständlich sein.
- Die Trennwand ist eine reale physische Aktion, kein dünner Flowchart-Strich.
- Girokonto und Tagesgeld bleiben große reale Objekte.
- Höchstens zwei primäre Bewegungen gleichzeitig.
- Ergebnis mindestens 20 Frames stabil halten.
- Pure-black Canvas kommt zentral; `PremiumPhysicalStage` bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Die Szene darf nicht erneut wie scene-03 oder scene-10 als simple Rechnung-zahlt-Geld-raus-Komposition wirken.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
