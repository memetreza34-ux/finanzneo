# FinanzNeo — MASTER TEST: Google Flow + Remotion

Status: **Experiment / nicht Produktion**  
Contract: `finanzneo-visual-dna-v1` + `finanzneo-visual-routing-v1`

> **DIESE DATEI IST DER EINZIGE EINSTIEGSPUNKT FÜR DIESEN TEST.**
> Sie enthält den kompletten Ablauf, alle Google-Flow-Bildprompts und die Remotion-Spezifikation. Andere Dateien im Experiment sind nur technische Implementierung/Support.

---

# 1. Ziel

Thema des Tests:

**„Warum kleine Kosten langfristig groß werden können“**

Der Test soll zeigen, dass FinanzNeo nicht aus zufälligen KI-Bildern besteht, sondern eine eigene visuelle Grammatik besitzt:

- starke statische 3D-Erklärbilder
- nicht ständig Menschen
- wiederkehrende FinanzNeo-Formen
- wenig, aber sinnvolle Animation
- exakte Daten mit Remotion statt erfundener KI-Charts
- Google Flow für illustrative / konzeptionelle Bilder
- Remotion für exakte Zeitreihen und Zahlenvergleiche

Die 6 Szenen:

| Szene | Engine | Route | Hauptvisual | Mensch? |
|---|---|---|---|---|
| 01 | Google Flow | `pressure-problem-image` | Budgetblock wird von kleinen Kosten belastet | Nein |
| 02 | Google Flow | `money-flow-image` | Einkommen → Kosten → Rücklage | Nein |
| 03 | Remotion | `data-line-remotion` | S&P 500 über 10 Jahre | Nein |
| 04 | Remotion | `data-bar-remotion` | erster vs. letzter Datenpunkt | Nein |
| 05 | Google Flow | `human-context-image` | bewusste Finanzentscheidung | Ja |
| 06 | Google Flow | `protection-buffer-image` | Rücklage fängt Belastung ab | Nein |

Nur **1 von 6 Szenen** braucht bewusst eine Person.

---

# 2. FinanzNeo Visual DNA für diesen Test

## Wiederkehrende Markenelemente

Diese Elemente verbinden Google-Flow-Bilder und Remotion:

- **Emerald Money / Reserve** = verfügbares, geschütztes oder bevorzugtes Geld
- **Warm red-orange Cost Tag** = Kosten, Gebühren, Druck, Verlust
- **Muted Gold Value Marker / Flow Band** = Wert oder Geldbewegung
- **Graphite / Ivory / Soft Gray** = neutrale Gegenstände und Flächen
- **Deep Black** = dominanter ruhiger Hintergrund / negative space

## Eigene Formensprache

- hochwertige stilisierte **3D-Animationsfilm-Ästhetik**
- klar nicht fotorealistisch
- weich gerundete, aber bewusst designte Formen
- starke Silhouetten
- saubere mobile Lesbarkeit
- keine zufälligen generischen Finanzicons
- keine sterile Dashboard-Optik
- keine Spielzeug-Sammlung auf einem Tisch
- keine Person nur als Füllmotiv
- Figuren nur dort, wo Entscheidung oder Emotion wirklich gebraucht wird

## Bewegungsregel

Animation erklärt etwas und läuft nicht nur dekorativ:

- Chart-Linie zeichnet sich einmal auf
- Balken wachsen einmal
- Geldfluss darf einmal sichtbar werden
- leichter Push / Zoom erlaubt
- kein permanentes Wackeln
- keine Partikel nur für Bewegung
- keine unnötigen Kamerafahrten

---

# 3. Verbindlicher Produktionsablauf

## PHASE A — NUR BILD 01

1. Google Flow erzeugt **ausschließlich Bild 01**.
2. Es läuft immer nur **ein** Bildjob.
3. Ergebnis vollständig abwarten.
4. Datei exakt umbenennen.
5. Tatsächliche Pixel intern prüfen.
6. Danach **HARD STOP**.
7. **Kein Bild 02, 05 oder 06 erzeugen.**
8. Auf ausdrückliche Freigabe des Nutzers warten, z. B.:
   - „sieht gut aus“
   - „passt“
   - „ja weiter“
9. Interne QA allein ist keine Freigabe.
10. Bei Ablehnung nur Bild 01 erneut erzeugen und danach wieder stoppen.
11. Erst nach Nutzerfreigabe wird Bild 01 zu `APPROVED_MASTER_ANCHOR`.

## PHASE B — NACH FREIGABE AUTOMATISCH WEITER

Nach Freigabe von Bild 01 werden die restlichen Assets ohne weitere Nutzerstopps fertiggestellt.

### Google Flow

Die restlichen Flow-Bilder werden **nacheinander**, niemals parallel, erzeugt:

`Bild 02 → warten → umbenennen → interne QA → Bild 05 → warten → umbenennen → QA → Bild 06 → warten → umbenennen → QA`

Da dieser Demo-Test nur drei weitere Flow-Bilder hat, ist das ein **Teil-5er-Block**.

Für jedes Folge-Bild gilt:

- ausschließlich das **echte freigegebene Bild 01** als persistente Stilreferenz verwenden
- Bild 02 niemals als Referenz für Bild 05 verwenden
- Bild 05 niemals als Referenz für Bild 06 verwenden
- Anchor überträgt Stil / Materialien / Licht / Formensprache / Finish
- Anchor kopiert nicht automatisch Motiv, Kamera, Pose oder Requisiten

Bei QA-Fail nur dieselbe Bildnummer neu erzeugen und danach automatisch fortfahren.

### Remotion

Szene 03 und 04 werden **nicht in Google Flow** generiert.

Sie werden mit Remotion aus exakten Daten gebaut.

Datenquelle im Repo:

`public/data/sp500-10y.json`

Pflicht:

- echte gespeicherte Datenwerte verwenden
- Quelle aus der JSON anzeigen
- Datenstand `fetchedAt` anzeigen
- keine erfundene Kurve
- keine KI-generierte Chart-Grafik

---

# 4. GOOGLE FLOW — BILD 01

## Route

`pressure-problem-image`

## Dateiname

`Bild 01 - Kleine Kosten druecken Budget.png`

## Viewer Thought

**„Viele kleine Beträge wirken einzeln harmlos, drücken zusammen aber deutlich auf mein verfügbares Budget.“**

## Funktion

Bild 01 ist:

- erste Szene
- Cover-/Anchor-Szene
- visuelle Master-Referenz für alle späteren Google-Flow-Bilder

## COPY-PASTE PROMPT

```text
Create one premium stylized 3D animated-feature finance illustration for the German brand FinanzNeo.

IMPORTANT: No person in this scene.

MAIN IDEA:
Show one large emerald-green FINANZNEO BUDGET BLOCK as the clear hero object. It should feel substantial, valuable and protected at first glance. Several small warm red-orange monthly cost tags physically press into, bite into or compress the outer edges of this one budget block from different directions.

Use exactly these small cost labels:
"9 €"
"19 €"
"29 €"
"39 €"
"49 €"

The viewer must understand within 1–2 seconds: every cost looks small alone, but together they visibly reduce the available budget.

FINANZNEO DESIGN LANGUAGE:
- premium stylized 3D animation-film look, clearly non-photorealistic
- expressive rounded geometry, but not a toy collection
- strong simple silhouette
- deep black negative-space background
- emerald green only for available/protected money
- warm red-orange only for cost/pressure
- tiny muted-gold accents only if they represent actual value
- graphite, ivory and soft gray for neutral support elements
- clean soft studio lighting
- soft grounded contact shadows
- polished, memorable and mobile-readable

COMPOSITION:
The green budget block dominates the frame. The red-orange cost tags should interact physically with it instead of floating like UI chips. Use asymmetry and clear depth. No room, no desk, no person, no generic finance icon cloud.

TEXT:
Only the exact short labels "9 €", "19 €", "29 €", "39 €", "49 €" may appear. No headline, no subtitle, no logo text, no CTA, no random typography.

FORBIDDEN:
photorealism, dashboard UI, app interface, flowchart, generic coins-and-arrows composition, product catalog layout, random props, miniature diorama, text-heavy infographic, person or human hands.

Generate exactly ONE image in 1:1.
Rename exactly:
Bild 01 - Kleine Kosten druecken Budget.png

Inspect the actual result. Then STOP completely and wait for explicit user approval. Do not create any later image yet.
```

---

# 5. GOOGLE FLOW — BILD 02

## Route

`money-flow-image`

## Dateiname

`Bild 02 - Geldfluss im Monat.png`

## Voraussetzung

Nur nach ausdrücklicher Freigabe von Bild 01.

## COPY-PASTE PROMPT

```text
Use the actual user-approved Image 01 as the ONLY persistent visual style reference.

Create a new FinanzNeo scene in the same stylized 3D animated visual world, but with a completely different composition and no person.

MAIN IDEA:
Show one emerald income block labeled "2.400 €" on the left. A clear muted-gold physical flow band leaves this block and splits into three readable destinations:

1. one graphite neutral block labeled "Fixkosten"
2. one warm red-orange block labeled "Gebühren"
3. one protected emerald reserve block labeled "Rücklage"

The viewer should immediately understand where monthly money goes. Make the flow physical and spatial, not a flat diagram and not a dashboard.

VISUAL DNA:
Preserve the approved Image 01's abstraction level, rounded 3D geometry, material finish, lighting, black-space integration and overall premium animated-feature quality.

No person. No hands. No room. No app UI. No spreadsheet. No chart.

Only allowed text:
"2.400 €"
"Fixkosten"
"Gebühren"
"Rücklage"

Generate exactly one image in 1:1.
Rename exactly:
Bild 02 - Geldfluss im Monat.png

Wait for the result, rename, run internal QA, then automatically continue if PASS. Do not ask the user again.
```

---

# 6. REMOTION — SZENE 03

## Route

`data-line-remotion`

## Output

- Composition segment: Szene 03
- optional QA still: `Visual 03 - SP500 10 Jahre.png`
- final clip inside Mixed Demo: 4 seconds

## Daten

Use exactly:

`public/data/sp500-10y.json`

Fields:

- series = `chart`
- source = `source`
- symbol = `symbol`
- asOf = `fetchedAt`

## Remotion-Komponente

Use:

`FinanceDataVisual`

with:

`kind="line"`

## Inhalt

Titel:

`S&P 500 · 10 Jahre`

Untertitel:

`Echte Zeitreihe`

Quelle unten sichtbar:

`Quelle: {source} · {symbol} · Stand: {fetchedAt}`

## Animation

- ruhiger Start
- Linie zeichnet sich einmal von links nach rechts auf
- keine Daueranimation danach
- Ergebnis mindestens ca. 0,8 Sekunden stabil sichtbar
- kein Dashboard-Rahmen
- keine erfundene Zusatzkurve

## Styling

- gleicher FinanzNeo Deep-Black/Green/Gold/Graphite-Farbcode
- Linie Emerald
- neutrale Achsen Graphite / Soft Gray
- Quelle klein, aber lesbar
- Datenvisual soll Teil derselben Marke wirken wie Bild 01/02

---

# 7. REMOTION — SZENE 04

## Route

`data-bar-remotion`

## Output

- Composition segment: Szene 04
- optional QA still: `Visual 04 - Start vs Heute.png`
- final clip inside Mixed Demo: 4 seconds

## Daten

Use dieselbe Datei:

`public/data/sp500-10y.json`

Vergleiche exakt:

- ersten Eintrag aus `chart`
- letzten Eintrag aus `chart`

Keine erfundenen Werte.

## Remotion-Komponente

Use:

`FinanceDataVisual`

with:

`kind="bar"`

## Inhalt

Titel:

`Start vs. letzter Datenpunkt`

Untertitel:

`Punktestand im Vergleich`

Balken:

- erster Datenpunkt = neutral Graphite/Gray
- letzter Datenpunkt = Emerald

Quelle + Datenstand sichtbar.

## Animation

- beide Balken wachsen einmal kontrolliert
- kein Springen / Wackeln
- danach stabiler Hold

---

# 8. GOOGLE FLOW — BILD 05

## Route

`human-context-image`

## Dateiname

`Bild 05 - Bewusste Entscheidung.png`

## Warum hier eine Person erlaubt ist

Die Aussage lebt von einer bewussten Entscheidung. Deshalb hat die Person hier echten narrativen Mehrwert.

## COPY-PASTE PROMPT

```text
Use the actual user-approved Image 01 as the ONLY persistent visual style reference.

Create one mature but clearly stylized 3D animated-feature FinanzNeo scene.

This is the ONE human-context scene in the test. The person is here because the financial decision itself is the story.

MAIN IDEA:
Show one young adult in a simple everyday purchase moment. The person sees a warm red-orange financing offer labeled "29 € / Monat" next to a desirable everyday product, but deliberately chooses not to take the monthly payment.

The decision must be visible through posture and action: the hand calmly pushes the financing card away while an emerald reserve envelope remains protected on the other side.

Do not make the person the whole point. The financial choice is the hero action.

VISUAL DNA:
Match the approved Image 01's stylized 3D animated-feature quality, material finish, rounded shape language, lighting, emerald/red-orange semantics and deep-black integration.

Keep the environment minimal. One purchase object, one financing card, one reserve envelope. No clutter.

Allowed text only:
"29 € / Monat"
"Rücklage"

No headline, no app UI, no dashboard, no random posters or decorative writing.

Generate exactly one image in 1:1.
Rename exactly:
Bild 05 - Bewusste Entscheidung.png

Wait → rename → internal QA → automatically continue on PASS. Do not ask the user again.
```

---

# 9. GOOGLE FLOW — BILD 06

## Route

`protection-buffer-image`

## Dateiname

`Bild 06 - Ruecklage faengt Belastung ab.png`

## COPY-PASTE PROMPT

```text
Use the actual user-approved Image 01 as the ONLY persistent visual style reference.

Create a strong person-free FinanzNeo payoff image in the same stylized 3D animated-feature world.

MAIN IDEA:
Show one solid emerald reserve block labeled "Rücklage" acting as a visible financial buffer. A warm red-orange unexpected-cost object labeled "Reparatur 280 €" hits the buffer from one side. The reserve block absorbs the impact and remains visibly intact enough to show protection.

The meaning must be obvious within 1–2 seconds: the reserve prevents the unexpected cost from destroying the rest of the budget.

Use a clear cause-and-effect composition. The red-orange cost comes in, the emerald reserve absorbs it, and a graphite neutral budget object behind the reserve remains protected.

VISUAL DNA:
Same approved Image 01 abstraction level, rounded 3D geometry, material finish, black negative space, soft premium lighting and semantic color language.

No person. No hands. No generic shield icon. No floating dashboard. Do not turn it into a flowchart.

Allowed text only:
"Rücklage"
"Reparatur 280 €"

Generate exactly one image in 1:1.
Rename exactly:
Bild 06 - Ruecklage faengt Belastung ab.png

Wait → rename → internal QA.
```

---

# 10. Gemeinsame QA

## Google-Flow-Bilder

Jedes Bild muss bestehen:

- Aussage in ca. 1–2 Sekunden verständlich
- kein generischer KI-Finanzlook
- FinanzNeo-Farblogik korrekt
- starke klare Hauptidee
- Folge-Bilder passen stilistisch zu freigegebenem Bild 01
- Folge-Bilder kopieren Bild 01 nicht stumpf
- Person nur in Bild 05
- keine unnötigen Props
- keine unerlaubte Schrift
- kein Dashboard / App-UI als Hauptbild

Hard-Fail:

- `boringLiteral`
- `decorativeWithoutMeaning`
- `overexplainedPropLayout`
- `genericFinanceIconMain`
- `anchorDrift`
- `anchorContentCopy`
- `sceneMismatch`

## Remotion

Jedes Datenvisual muss bestehen:

- exakte Daten aus definierter Quelle
- Quelle sichtbar
- Datenstand sichtbar
- kein erfundener Verlauf
- klare mobile Lesbarkeit
- gleiche Markenfarben wie die Bildwelt
- Animation erklärt den Aufbau
- kein generischer Dashboard-Screenshot-Look

---

# 11. Finaler Asset-Satz

Nach erfolgreichem Test soll der Satz logisch so aussehen:

```text
Bild 01 - Kleine Kosten druecken Budget.png       [Google Flow / Anchor]
Bild 02 - Geldfluss im Monat.png                  [Google Flow]
Visual 03 - SP500 10 Jahre                        [Remotion]
Visual 04 - Start vs Heute                        [Remotion]
Bild 05 - Bewusste Entscheidung.png               [Google Flow]
Bild 06 - Ruecklage faengt Belastung ab.png       [Google Flow]
```

Die Reihenfolge des finalen Videos bleibt exakt 01 → 02 → 03 → 04 → 05 → 06.

---

# 12. Wichtig für den Agenten

- Nicht alle sechs Szenen an Google Flow schicken.
- Szene 03 und 04 sind ausschließlich Remotion.
- Nur Bild 01 braucht manuelle Nutzerfreigabe.
- Nach Bild-01-Freigabe keine weiteren Nutzerstopps.
- Google Flow weiterhin Strict Single Job.
- Bild 01 bleibt einzige persistente Bildreferenz für Bild 02/05/06.
- Remotion übernimmt die Bilddatei nicht als Chart-Hintergrund; es übernimmt die **FinanzNeo Visual DNA** über Farben, Typografie, Formen und ruhige Bewegung.
- Keine bestehende Produktion überschreiben.
- Dieser Test ist nicht publishable, solange der Nutzer die Bildwelt und den Mixed-Render nicht freigegeben hat.
