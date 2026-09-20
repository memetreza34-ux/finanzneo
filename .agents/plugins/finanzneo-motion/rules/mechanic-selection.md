# FinanzNeo — Canonical Mechanic Selection

Diese Regel verhindert, dass FinanzNeo-Reels trotz unterschiedlicher Sprechertexte visuell dieselbe Animation wiederholen.

## Kanonische Quelle

Für neue oder bewusst überarbeitete Animationsszenen gilt `src/motion` als erste Implementierungsquelle:

1. `src/motion/README.md` — Motion-Grammatik, Importgrenzen und Primitive-Promotion
2. `src/motion/mechanics.ts` — maschinenlesbare Mechanik-Registry
3. `src/motion/FinanzNeoMotionReferenceV1.tsx` — visuelle Referenz der Mechanik-Familien
4. `src/motion/physical.tsx` / `objects.tsx` — bevorzugte physische Primitives
5. `src/motion/tokens.ts` — Timing, Springs und Motion-Dichte

`FinanceMotionLab*`, alte Reel-Animationen und andere Experimente dürfen technische Ideen liefern, sind aber keine Stilreferenz.

## Pflicht-Routing pro Animationsszene

Vor dem Schreiben von JSX muss der Agent in dieser Reihenfolge entscheiden:

```text
VOICEOVER-BEAT
→ FINANZ-AUSSAGE
→ SICHTBARE URSACHE/WIRKUNG
→ MECHANIC_ID
→ HERO + OPTIONALER SUPPORT
→ START / ACTION / REACTION / RESULT / HOLD
→ REMOTION-TIMELINE
→ MOTION ART DIRECTION
→ PLAYWRIGHT VISUAL QA
```

Erst danach wird die Szene produktiv freigegeben.

## MECHANIC_ID-Format

Der Repo-Validator akzeptiert Mechanik-IDs im Produktionscode als Kleinbuchstaben/Zahlen/Bindestriche. Deshalb gilt:

```text
fn-<mechanik-name>
```

Keine Unterstriche verwenden.

## Kanonische Mechanik-Familien V1

Die technische Quelle ist `src/motion/mechanics.ts`.

### fn-growth-build
Kapital oder Bestand wächst durch Einzahlung, Ertrag oder schrittweisen Aufbau.

### fn-cost-extraction
Gebühren, Kosten, Steuern oder Abzüge reduzieren einen vorhandenen Wert sichtbar.

### fn-rebalance-transfer
Bestehender Wert wird zwischen bereits vorhandenen Töpfen neu gewichtet.

### fn-result-lock
Ein bereits erklärter Vorgang endet in einem klar bestätigten stabilen Zielzustand.

### fn-allocation-split
Ein Betrag oder Bestand wird in mehrere klar definierte Anteile aufgeteilt.

### fn-account-transfer
Geld verlässt einen konkreten Ort und kommt an einem anderen Ort an.

### fn-shock-buffer
Reserve, Versicherung oder Puffer fängt einen negativen externen Schock ab.

### fn-comparison-mass
Zwei Optionen entwickeln sich sichtbar zu unterschiedlichen Endbeständen.

### fn-time-compounding
Zeit ist die zentrale Ursache für Wachstum bzw. Zinseszinseffekt.

### fn-positive-resolution
Eine konkrete Handlung überführt einen problematischen Ausgangszustand in einen stabilen Zielzustand.

Die Registry beschreibt Semantik, bevorzugte Primitives, Motion Pattern und Result Type. Diese Angaben sind keine Layout-Schablone.

## Hero vor Objektquote

Eine hochwertige Szene braucht ein klares physisches Hero-Objekt. **Ein starkes Hero darf allein reichen.**

Support-Objekte werden nur ergänzt, wenn sie Ursache/Wirkung verständlicher machen. Keine Mindestzahl von zwei oder drei `Physical*`-Instanzen erzwingen.

Die Qualitätsfrage lautet:

> Ist die Finanz-Aussage durch die sichtbare Zustandsänderung klar?

Nicht:

> Wie viele Objekte sind im Frame?

## Semantische Primitive-Namen

Für neue Motion-Core-Szenen bevorzugen:

- `PhysicalBanknote` für Geldschein/Werteinheit
- `PhysicalInvoice` für Rechnung/Dokument
- `PhysicalAccount`
- `PhysicalCoinStack`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`
- `PhysicalObject` für echte szenenspezifische Objekte

`PhysicalBill` bleibt nur als kompatibler alter Motion-Core-Name für die Banknote bestehen. Wegen der Doppeldeutigkeit von "bill" soll neuer Code `PhysicalBanknote` bzw. `PhysicalInvoice` verwenden.

## Mechanik-Ledger pro Reel

Vor Implementierung einer neuen Animationsszene muss der Agent alle geplanten/implementierten Animationsszenen des Reels lesen:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

## Anti-Wiederholungs-Gate

Eine neue Szene wird neu geprüft, wenn mindestens drei der folgenden Merkmale mit einer bereits verwendeten Animationsszene übereinstimmen:

- gleiche Mechanik-Familie / `MECHANIC_ID`
- gleiches Hero-Objekt
- gleiche PRIMARY_ACTION
- gleiche dominante Bewegungsrichtung / `MOTION_AXIS`
- gleicher Result-Typ

Für V1 bleibt dieselbe `MECHANIC_ID` innerhalb eines Reels standardmäßig gesperrt. Begründete Wiederverwendung von **Techniken** ist über `reuse-best-fit` erlaubt; sie hebt nicht automatisch die Mechanik-ID-Sperre auf.

## Variation ist nicht Dekoration

Eine Wiederholung gilt NICHT als gelöst durch:

- andere Farbe
- anderer Text
- anderes Icon
- zusätzliche Partikel/Glow
- Kamera-Zoom
- Spiegeln derselben Szene
- schnelleres/langsameres Timing bei identischer Mechanik

Echte Variation verändert die physische Erklärung.

## Wenn keine V1-Mechanik exakt passt

Zuerst prüfen:

1. Kann eine bestehende Mechanik semantisch korrekt angepasst werden?
2. Kann ein anderes reales Objekt dieselbe Aussage klarer erklären?
3. Kann die Szene sinnvoll ein Flow-Bild statt Animation sein?

Nur wenn die Finanz-Aussage eine neue Ursache/Wirkung benötigt, darf eine neue Mechanik-Familie entstehen.

Dann sind Pflicht:

- neue eindeutige `MECHANIC_ID` mit Präfix `fn-`
- Ein-Satz-Begründung, warum keine V1-Mechanik passt
- konkretes physisches Hero-Objekt
- START → ACTION → REACTION → RESULT → HOLD
- keine reine Stilvariation einer vorhandenen Mechanik

Eine neue Mechanik wird nicht automatisch sofort in `src/motion/mechanics.ts` aufgenommen. Erst der `motion-core-curator` entscheidet nach echter Wiederverwendung, ob sie Core-würdig ist.

## Primitive Promotion

Wenn ein benötigtes Objekt nicht im Core existiert, darf es lokal aus `PhysicalObject` gebaut werden.

- einmalige Spezialform → lokal lassen
- echte Wiederverwendung in mindestens zwei unterschiedlichen Szenen/Reels → Core-Kandidat
- gleiche Semantik + stabile Props + gleiche Materiallogik → durch `motion-core-curator` prüfen
- niemals wegen einer einzigen Szene den Core aufblähen

## Pflicht-Ausgabe vor Code

```text
MECHANIC_ID:
FINANZ-AUSSAGE:
PHYSISCHE URSACHE/WIRKUNG:
HERO_OBJECT:
SUPPORT_OBJECTS:
PRIMARY_ACTION:
MOTION_AXIS:
RESULT_TYPE:
WARUM NICHT DOPPELT:
```

Nach der Implementierung folgt Motion Art Direction und anschließend Playwright Visual QA. Beide müssen vor produktivem Phase-3-Render dokumentiert PASS sein.
