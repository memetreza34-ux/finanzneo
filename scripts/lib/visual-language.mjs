// Eine Quelle dafür, was in einer Animationsszene als echter Gegenstand zählt.
//
// Diese Liste stand vorher dreimal im Repo — im Reel-Validator, im YouTube-
// Motion-Vertrag und in den Reel-Quality-Guards. Jede Fassung kannte etwas
// anderes: der YouTube-Vertrag kannte `PhysicalPolicy` und `PhysicalPhone`, der
// Reel-Validator nicht, und die neuen gezeichneten Gegenstände aus
// `src/design-system/object-kit.tsx` kannte keine der drei. Eine Reel-Animation
// mit `ObjectSuitcase` wäre deshalb abgelehnt worden, obwohl der Baukasten sie
// ausdrücklich anbietet.
//
// CLAUDE.md §11 verbietet beschriftete Kästen als Hauptsprache. Geprüft wird
// deshalb nicht die Anwesenheit, sondern das Verhältnis: Kästen dürfen echte
// Gegenstände nicht überstimmen.

/**
 * Benannte Gegenstände aus dem Baukasten.
 *
 * `Physical*` sind die gewachsenen Realwelt-Primitives aus `src/brand`,
 * `Object*` die gezeichneten aus `src/design-system/object-kit.tsx`. Beide
 * zeigen eine Sache, die es gibt — Rechnung, Konto, Waschmaschine, Koffer,
 * Laufrad, Kalenderblatt.
 */
export const CONCRETE_OBJECT = /<Physical(?:Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack|Policy|Phone)\b|<Object[A-Z][A-Za-z]*/g;

/**
 * Selbst gezeichnete Formen.
 *
 * Ein sauber gebautes SVG ist genauso ein echter Gegenstand und darf nicht
 * bestraft werden, nur weil es kein Baukasten-Primitive benutzt. Sonst trifft
 * die Regel genau die gute Arbeit.
 */
export const DRAWN_GEOMETRY = /<(?:path|circle|polygon|ellipse|polyline)\b/g;

/** Karte, Schild, Balken. Beiwerk, niemals Hauptsprache. */
export const GENERIC_BOX = /<Physical(?:Object|Tag|Rail)\b/g;

/**
 * Ab so vielen Kästen wird das Verhältnis geprüft.
 *
 * Gezählt wird der Quelltext, nicht das Bild: ein `<PhysicalObject` in einer
 * `.map()` erzeugt sieben Kästen und zählt trotzdem als einer. Deshalb ist die
 * Schwelle niedrig und die eigentliche Regel ein Verhältnis.
 */
export const BOX_DOMINANCE = 2;

/** So viele gezeichnete Formen ersetzen zwei benannte Gegenstände. */
export const DRAWN_EQUIVALENT = 6;

/** Zählt die drei Bildsprachen einer Quelldatei. */
export const countVisualLanguage = (source = '') => ({
  concrete: (source.match(CONCRETE_OBJECT) ?? []).length,
  drawn: (source.match(DRAWN_GEOMETRY) ?? []).length,
  boxes: (source.match(GENERIC_BOX) ?? []).length,
});

/** Zeigt die Szene überhaupt etwas Gegenständliches? */
export const hasRealSubject = ({concrete, drawn}) => concrete >= 1 || drawn >= 2;

/** Tragen Kästen die Szene, statt sie nur zu ergänzen? */
export const boxesDominate = ({concrete, drawn, boxes}) => (
  boxes >= BOX_DOMINANCE && boxes > concrete && drawn < DRAWN_EQUIVALENT
);
