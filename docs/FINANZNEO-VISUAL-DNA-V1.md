# FinanzNeo Visual DNA V1

Contract: `finanzneo-visual-dna-v1`

## Ziel

FinanzNeo soll nicht wie eine Sammlung zufälliger KI-Bilder wirken. Jede Szene muss Teil derselben visuellen Sprache sein: klare Finanzlogik, starke statische Bilder, wenig unnötige Bewegung, wiederkehrende Formen und eine eindeutige Entscheidung zwischen Konzeptbild und präzisem Datenvisual.

FinanzNeo übernimmt **nicht** das konkrete Design anderer Finanzkanäle. Übernommen wird nur das allgemeine Prinzip: starke Erklärbilder, hohe Verständlichkeit, sparsame Animation. Formensprache, Farblogik, Visualtypen und Komponenten bleiben eigenständig.

## Grundprinzip

**Das richtige Visual für die Aussage gewinnt.**

Nicht jede Szene braucht eine Person. Nicht jede Szene braucht ein KI-Bild. Nicht jede Zahl braucht ein Diagramm.

Vor jeder Szene wird zuerst entschieden:

1. Muss eine exakte Entwicklung, Relation oder Verteilung gezeigt werden? → **Remotion Data Visual**.
2. Muss ein Finanzmechanismus intuitiv verstanden werden? → **Money Flow / Cause-Effect Image**.
3. Ist ein Vergleich ohne exakte Daten die Kernidee? → **Comparison Image**.
4. Reicht ein einziges starkes Objekt? → **Single Strong Object**.
5. Trägt eine Person wirklich Emotion, Entscheidung oder Alltagssituation? → **Human Context Scene**.

Menschen sind eine Option, niemals der Standard-Fallback.

## Eigene FinanzNeo-Formensprache

### Semantische Bausteine

- **Emerald Money Block / Envelope**: verfügbares, geschütztes oder bevorzugtes Geld.
- **Warm red-orange Cost Tag**: Kosten, Verlust, Druck oder wiederkehrende Belastung.
- **Muted Gold Value Marker**: Vermögenswert, Zielwert oder realer Geldwert.
- **Graphite Neutral Object**: neutrale Konten, Produkte, Verträge, Haushaltsobjekte.
- **Flow Band / Route**: sichtbarer Geldfluss oder Ursache-Wirkung. Physisch lesbar, keine zufälligen Neon-Laser.
- **Reserve Block**: wiederkehrende Form für Rücklage / Notgroschen.
- **Comparison Rail**: zwei Wege oder Zustände in einer gemeinsamen Welt, nicht als generisches Dashboard.

Diese Elemente dürfen in Bildern und Remotion-Visuals wiederkehren, damit FinanzNeo eine eigene erkennbare Grammatik entwickelt.

## Bildfamilien

### 1. Single Strong Object
Ein dominantes Objekt trägt die Aussage. Keine Person nötig. Beispiel: Wallet wird von fünf Monatsraten zusammengedrückt.

### 2. Money Flow / Cause Effect
Geld oder Wert bewegt sich sichtbar von A nach B. Beispiel: Einkommen → Fixkosten → Rücklage.

### 3. Comparison
Zwei Zustände oder Entscheidungen werden direkt vergleichbar. Beispiel: gleiches Einkommen, einmal zuerst sparen, einmal zuerst konsumieren.

### 4. Pressure / Problem
Kosten, Gebühren oder Risiken wirken sichtbar auf Budget/Vermögen. Keine künstliche Prop-Sammlung.

### 5. Protection / Buffer
Rücklage, Diversifikation oder Versicherung fängt einen sichtbaren finanziellen Stoß ab.

### 6. Human Context
Nur wenn Haltung, Entscheidung, Überraschung, Stress oder Alltag den Beat besser erklärt als ein Objekt. Eine Person darf nie nur eingesetzt werden, weil der Prompt sonst leer wirkt.

### 7. Data Visual
Exakte Zeitreihe, Rendite, Kurs, Sparplanentwicklung, Verteilung oder quantitativer Vergleich wird mit Remotion erzeugt. KI darf keine historischen Kurven oder exakten Zahlen erfinden.

## Human Presence Rule

Keine feste Personenquote. Stattdessen gilt:

- `human-context` muss einen konkreten narrativen Mehrwert haben.
- Wenn dieselbe Aussage mit Objekt, Flow, Vergleich oder Datenvisual klarer ist, gewinnt die menschenfreie Variante.
- Zwei aufeinanderfolgende Human-Context-Szenen brauchen eine ausdrückliche Begründung im Szenenplan.
- Hände/POV zählen nicht automatisch als Human-Context; sie dürfen als funktionale Perspektive eingesetzt werden.

## Remotion Data Visual Rule

Remotion ist Pflicht, wenn die Aussage von **exakten Daten** abhängt, insbesondere:

- ETF/Aktie/Index über Zeit
- 5/10/20-Jahres-Verläufe
- Rendite- oder Kostenvergleich
- Sparplan- und Zinseszinseffekt
- Portfolioaufteilung
- Balkenvergleich mehrerer Werte
- historische Drawdowns oder Meilensteine

Datenvisuals brauchen Quelle und Datenstand. Ein KI-Bild darf niemals eine exakte Marktkurve vortäuschen.

## Wenig Animation, aber sinnvoll

Standard ist ruhige Darstellung. Animation erklärt, nicht dekoriert.

Erlaubt und erwünscht:
- Chart-Linie zeichnet sich auf
- Balken wachsen
- Geldfluss bewegt sich einmal sichtbar
- Wert zählt hoch
- Vergleich wird nacheinander enthüllt
- leichter Push/Zoom für Fokus

Nicht als Standard:
- permanentes Wackeln
- Partikel nur für Bewegung
- dauernd rotierende Objekte
- unnötige Kamerafahrten
- Bewegung ohne Informationsgewinn

## Routing

Kanonische Routing-ID: `finanzneo-visual-routing-v1`.

Mögliche Routen:

- `concept-image`
- `money-flow-image`
- `comparison-image`
- `human-context-image`
- `data-line-remotion`
- `data-bar-remotion`
- `data-allocation-remotion`
- `timeline-remotion`

Aktuell bleibt die bestehende Produktionsregel **IMAGE xor ANIMATION** erhalten. Eine Szene wird also bewusst einem Hauptvisual zugeordnet und nicht heimlich als Bild+Animation-Hybrid gebaut.

## Qualitätsfrage vor Freigabe

Eine Szene ist erst stark genug, wenn mindestens diese Fragen klar mit Ja beantwortet werden können:

- Versteht man die Aussage in etwa 1–2 Sekunden?
- Ist das Visual spezifisch für genau diesen Sprechbeat?
- Könnte man die Person entfernen und das Bild würde besser werden? Falls ja: entfernen.
- Sind echte Daten im Spiel? Falls ja: Remotion statt erfundener KI-Kurve.
- Nutzt die Szene mindestens ein bewusstes FinanzNeo-Designprinzip statt generischem KI-Look?
- Passt die Szene zur restlichen Serie, ohne Motiv/Kamera stumpf zu kopieren?
