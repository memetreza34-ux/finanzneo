# FinanzNeo — Canonical Mechanic Selection

Diese Regel verhindert, dass FinanzNeo-Reels trotz unterschiedlicher Sprechertexte visuell dieselbe Animation wiederholen.

## Kanonische Quelle

Für neue oder bewusst überarbeitete Animationsszenen gilt `src/motion` als erste Implementierungsquelle:

1. `src/motion/README.md` — Motion-Grammatik und Dichte
2. `src/motion/FinanzNeoMotionReferenceV1.tsx` — visuelle Referenz der Mechanik-Familien
3. `src/motion/physical.tsx` — bevorzugte physische Primitives
4. `src/motion/tokens.ts` — Timing, Springs und Motion-Dichte

`FinanceMotionLab*`, alte Reel-Animationen und andere Experimente dürfen technische Ideen liefern, sind aber keine Stilreferenz.

## Pflicht-Routing pro Animationsszene

Vor dem Schreiben von JSX muss der Agent in dieser Reihenfolge entscheiden:

```text
VOICEOVER-BEAT
→ FINANZ-AUSSAGE
→ SICHTBARE URSACHE/WIRKUNG
→ MECHANIC_ID
→ HERO + SUPPORT-OBJEKTE
→ START / ACTION / REACTION / RESULT / HOLD
→ REMOTION-TIMELINE
```

Erst danach wird implementiert.

## MECHANIC_ID-Format

Der bestehende Repo-Validator akzeptiert Mechanik-IDs im Produktionscode als Kleinbuchstaben/Zahlen/Bindestriche. Deshalb gilt verbindlich:

```text
fn-<mechanik-name>
```

Keine Unterstriche verwenden.

## Kanonische Mechanik-Familien V1

### fn-growth-build
Verwenden, wenn Kapital durch Einzahlungen, Erträge oder schrittweisen Aufbau sichtbar zunimmt.

Typische Physik: Bestand wächst, Stapel baut sich auf, Zielobjekt nimmt Wert auf.

### fn-cost-extraction
Verwenden, wenn Gebühren, Kosten, Steuern oder Abzüge einen vorhandenen Wert sichtbar reduzieren.

Typische Physik: Wert geht durch einen konkreten Kostenmechanismus; ein Teil wird entfernt; kleinerer Rest bleibt.

### fn-rebalance-transfer
Verwenden, wenn bestehendes Vermögen zwischen zwei bereits vorhandenen Töpfen neu gewichtet wird.

Typische Physik: ein Wert verlässt A, bewegt sich zu B, beide Zustände ändern sich gekoppelt.

### fn-result-lock
Verwenden, wenn die Hauptaussage ein stabiler Endwert oder bestätigter Zielzustand ist und die vorherige Aktion bereits erklärt wurde.

Typische Physik: Objekt setzt sich, Ergebnis wird bestätigt, anschließend ruhiger Result-Hold.

### fn-allocation-split
Verwenden, wenn ein Betrag, Einkommen oder Vermögen in mehrere klar definierte Anteile aufgeteilt wird.

Typische Physik: ein Ursprung wird durch einen physischen Splitter in getrennte Resultate zerlegt.

### fn-account-transfer
Verwenden, wenn Geld tatsächlich einen Ort verlässt und an einem anderen Ort ankommt, z. B. Girokonto → Depot oder Tagesgeld.

Typische Physik: transportierte Einheit bewegt sich auf einem klaren Weg und wird am Ziel absorbiert; Quelle und Ziel reagieren.

### fn-shock-buffer
Verwenden, wenn Reserve, Versicherung oder Puffer einen negativen externen Schock abfängt.

Typische Physik: Belastung trifft zuerst auf den Puffer; Pufferzustand sinkt; geschütztes Hauptobjekt bleibt stabil.

### fn-comparison-mass
Verwenden, wenn zwei Optionen mit gleichem oder vergleichbarem Start zu unterschiedlichen Endbeständen führen.

Typische Physik: zwei physische Massen/Bestände entwickeln sichtbar unterschiedliche Größen.

### fn-time-compounding
Verwenden, wenn Zeit selbst die entscheidende Ursache für Wachstum oder Zinseszinseffekt ist.

Typische Physik: Zeitmarker verändert sich; derselbe Bestand bleibt bestehen und wächst über mehrere Zeitpunkte.

### fn-positive-resolution
Verwenden, wenn eine konkrete Handlung einen problematischen Ausgangszustand in einen stabilen Zielzustand überführt.

Typische Physik: Ursache wird sichtbar ausgeführt; Zielobjekt verändert seinen Zustand; erst danach Bestätigung/positive Farbe.

## Mechanik-Ledger pro Reel

Vor Implementierung einer neuen Animationsszene muss der Agent alle bereits geplanten/implementierten Animationsszenen des Reels lesen und intern eine Tabelle führen:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

Beispiel:

```text
S03 | fn-account-transfer | Geldschein | Giro → Depot | links→rechts | Zielsaldo steigt
S06 | fn-cost-extraction | Rechnung | Betrag wird reduziert | horizontal+fall | Restbetrag
```

## Anti-Wiederholungs-Gate

Eine neue Szene wird abgelehnt oder neu entworfen, wenn mindestens drei der folgenden Merkmale mit einer bereits verwendeten Animationsszene übereinstimmen:

- gleiche `MECHANIC_ID`
- gleiches Hero-Objekt
- gleiche PRIMARY_ACTION
- gleiche dominante Bewegungsrichtung / `MOTION_AXIS`
- gleicher Result-Typ

Die harte Repo-Regel bleibt zusätzlich bestehen: dieselbe `MECHANIC_ID` darf innerhalb eines Reels nicht zweimal vorkommen.

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

Nicht automatisch eine neue Komponente erfinden.

Zuerst prüfen:

1. Kann eine bestehende Mechanik semantisch korrekt angepasst werden?
2. Kann ein anderes reales Objekt dieselbe Aussage klarer erklären?
3. Kann die Szene sinnvoll ein Flow-Bild statt Animation sein?

Nur wenn die Finanz-Aussage eine neue Ursache/Wirkung benötigt, darf eine neue Mechanik-Familie entstehen.

Dann sind Pflicht:

- neue eindeutige `MECHANIC_ID` mit Präfix `fn-`
- nur Kleinbuchstaben/Zahlen/Bindestriche
- Ein-Satz-Begründung, warum keine V1-Mechanik passt
- konkrete Realwelt-Objekte
- START → ACTION → REACTION → RESULT → HOLD
- keine reine Stilvariation einer vorhandenen Mechanik

## Implementierungsregel

Wenn passende Bausteine in `src/motion` existieren, werden sie importiert und wiederverwendet. Neue lokale Kopien von `PhysicalBill`, `PhysicalAccount`, `PhysicalReserveTank`, `PhysicalCoinStack`, `PhysicalCalendarPage`, `PhysicalWasher`, `PremiumPhysicalStage` oder äquivalenten Basisobjekten sind zu vermeiden.

Szenenspezifische Objekte dürfen lokal entstehen, wenn sie die konkrete Handlung benötigen; sie sollen auf `PhysicalObject` bzw. den bestehenden Core-Primitives aufbauen, statt ein zweites Motion-System einzuführen.

## Pflicht-Ausgabe vor Code

Vor der Implementierung muss der Agent für jede Animationsszene kurz festhalten:

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

Diese Entscheidung ist Teil der Motion-Direction und darf nicht durch dekorative Effekte ersetzt werden.
