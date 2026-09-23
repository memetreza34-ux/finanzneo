# FinanzNeo Remotion Data Visual Kit V1

Status: experimental on `improve/visual-dna-remotion-routing-v1`

## Zweck

Remotion übernimmt Visuals, bei denen **exakte Daten** Teil der Aussage sind. Google Flow bleibt für illustrative Konzeptbilder zuständig.

Das verhindert erfundene Marktkurven, falsche Proportionen und zufällige KI-Diagramme.

## Erste unterstützte Visualtypen

### 1. `data-line-remotion`
Für:
- Aktie / ETF / Index über Zeit
- Sparplan- oder Vermögensentwicklung
- Drawdown / Erholung
- 5-, 10- oder 20-Jahres-Verlauf

Komponente: `FinanceDataVisual kind="line"`

### 2. `data-bar-remotion`
Für:
- Kostenvergleich
- Renditevergleich
- Gebühren / TER
- mehrere eindeutige Zahlenwerte

Komponente: `FinanceDataVisual kind="bar"`

### 3. `data-allocation-remotion`
Für:
- Portfolioaufteilung
- Budgetanteile
- Asset Allocation

Komponente: `FinanceDataVisual kind="allocation"`

### 4. `timeline-remotion`
Für:
- Meilensteine
- Jahr-für-Jahr-Ereignisse
- Ablauf mit echten Zeitpunkten

Erste Version nutzt die bestehenden FinanzNeo-Timeline-Bausteine; eine eigene V1-Hülle folgt nach dem ersten Demo-Test.

## Datenregeln

Jedes echte Datenvisual braucht:

- `source`
- `asOf` / Datenstand
- tatsächliche Datenwerte
- eine klare Einheit / Bedeutung

Verboten:

- erfundene historische Kurve
- per Bild-KI generierter Chart als Faktenvisual
- Achsen oder Werte nur zur Dekoration
- Quelle weglassen, wenn reale Markt-/Produktdaten gezeigt werden

## Animation

Animation bleibt sparsam:

- Linie zeichnet sich einmal auf
- Balken wachsen einmal
- Donut/Allocation wird einmal aufgedeckt
- Wert kann einmal hochzählen
- danach stabiler Result-Hold

Keine dauernde Bewegung ohne Informationsgewinn.

## Layout

Datenvisuals werden innerhalb der bestehenden Reel-Safe-Zone gebaut. Header und Captions bleiben weiterhin Teil des zentralen Reel-Layouts; `FinanceDataVisual` ist die Hauptvisual-Komponente innerhalb des Visual-Bereichs.

## Bestehende Infrastruktur

Das Repo besitzt bereits:

- `AreaPremium`
- `BarsPremium`
- `PiePremium`
- `RadarPremium`
- echte Daten-Demo über `public/data/*.json`

V1 baut darauf auf, statt ein zweites Chart-System zu erfinden.

## Routing

Der Router `scripts/lib/visual-routing-v1.mjs` entscheidet bzw. empfiehlt die Route vor der eigentlichen Visualproduktion.

Beispiele:

- „S&P 500 über 10 Jahre“ → `data-line-remotion`
- „ETF A TER 0,20 % vs ETF B 0,45 %“ → `data-bar-remotion`
- „70/30 Portfolio“ → `data-allocation-remotion`
- „Viele kleine Monatsraten ziehen Geld aus dem Budget“ → `money-flow-image`
- „Person entscheidet sich im Supermarkt bewusst gegen einen Impulskauf“ → nur bei echtem narrativen Mehrwert `human-context-image`

## Nächster Ausbau

Nach dem ersten Demo-Test:

1. Timeline-Hülle vereinheitlichen.
2. Quellen-/Stand-Metadaten in Szenenvertrag aufnehmen.
3. Visual-Routing vor `reel:create` in die Planungsphase ziehen.
4. Demo mit Konzeptbild + Money Flow + Vergleich + realem 10-Jahres-Chart bauen.
