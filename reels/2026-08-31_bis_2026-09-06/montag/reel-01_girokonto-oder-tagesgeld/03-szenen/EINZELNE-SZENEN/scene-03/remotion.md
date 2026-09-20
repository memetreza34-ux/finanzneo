# scene-03 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
Das Geld bewegt sich dort ständig: rein, raus, bezahlen. Genau dafür ist das Girokonto gemacht.

## Motion-Director-Entscheidung
MECHANIC_ID: fn-daily-cashflow

FINANZ-AUSSAGE: Das Girokonto ist der aktive Ort für wiederkehrenden Geldzufluss und mehrere Alltagsabflüsse.

PHYSISCHE_URSACHE_WIRKUNG: Ein Gehaltsstapel wird vom Girokonto aufgenommen; danach lösen sich zwei klar getrennte Zahlungen und erreichen Miete und Einkauf.

HERO_OBJECT: Girokonto als physischer Cashflow-Hub.

SUPPORT_OBJECTS: Gehaltsstapel, Mietrechnung, Einkaufsausgabe und zwei kurze Zahlungseinheiten.

PRIMARY_ACTION: Gehalt kommt sichtbar ins Girokonto → Miete und Einkauf erscheinen → zwei getrennte Teilbeträge verlassen nacheinander das Konto → beide Ausgaben werden bezahlt → das Girokonto bleibt als aktiver Alltagsort stehen.

MOTION_AXIS: links → Mitte → diagonal nach links/rechts unten.

RESULT_TYPE: Mehrfacher Geldfluss endet in zwei bezahlten Alltagsausgaben.

WARUM_NICHT_DOPPELT: Keine andere Animationsszene im Reel zeigt einen zyklischen Hub mit einem Eingang und mehreren getrennten Ausgängen.

WHY_NEW_MECHANIC: Die V1-Familien decken Einzeltransfer, Kostenabzug und Result-Lock ab, aber nicht den hier gesprochenen wiederkehrenden Ein-und-mehrere-Ausgänge-Cashflow.

## Pflicht
- `src/motion` ist die erste Implementierungsquelle.
- START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → RESULT HOLD muss ohne Ton verständlich sein.
- Girokonto bleibt das Hero-Objekt; die beiden Ausgaben sind eine Support-Gruppe.
- Höchstens zwei primäre Bewegungen gleichzeitig; Auszahlungen zeitlich staffeln.
- Ergebnis mindestens 20 Frames stabil halten.
- Pure-black Canvas kommt zentral; `PremiumPhysicalStage` bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Keine Wiederholung der Transferlogik aus scene-09.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
