# FinanzNeo — MASTER TEST: Google Flow + Remotion

Status: **Experiment / nicht Produktion**

Diese eine Datei enthält den Test. Wichtig: **Die Google-Flow-Codeblöcke enthalten ausschließlich die gewünschte Bildbeschreibung.** Produktionslogik, Dateinamen, QA, Anchor-Auswahl und Routing gehören nicht in den Prompt, den Google Flow erhält.

## Testthema

**Warum kleine Kosten langfristig groß werden können**

| Szene | Engine | Visual |
|---|---|---|
| 01 | Google Flow | Kleine Kosten drücken auf das Budget |
| 02 | Google Flow | Monatlicher Geldfluss |
| 03 | Remotion | S&P 500 über 10 Jahre |
| 04 | Remotion | Startwert vs. letzter Datenpunkt |
| 05 | Google Flow | Bewusste Finanzentscheidung |
| 06 | Google Flow | Rücklage fängt Belastung ab |

---

# GOOGLE FLOW — BILD 01

Dateiname: `Bild 01 - Kleine Kosten druecken Budget.png`

**Nur diesen Codeblock an Google Flow geben:**

```text
Create a premium stylized 3D animated-feature finance illustration with no person.

Show one large emerald-green budget block as the clear hero object. Several small warm red-orange monthly cost tags physically press into and compress the outer edges of the budget block from different directions.

Use exactly these labels on the cost tags:
"9 €"
"19 €"
"29 €"
"39 €"
"49 €"

The image must communicate instantly that every individual cost looks small, but together they noticeably reduce the available budget.

Use a polished non-photorealistic 3D animation-film aesthetic with expressive rounded geometry, strong silhouettes, deep black negative space, clean soft studio lighting and soft grounded shadows.

Emerald green represents available or protected money. Warm red-orange represents cost and pressure. Use graphite, ivory and soft gray only for neutral supporting forms.

The green budget block must dominate the composition. The cost tags must physically interact with it instead of floating like interface elements. Keep the composition simple, memorable and easy to read on a phone.

No room, no desk, no person, no human hands, no dashboard, no app interface, no flowchart, no generic finance-icon cloud, no product catalog layout, no miniature diorama and no additional text.

Square 1:1 image.
```

---

# GOOGLE FLOW — BILD 02

Dateiname: `Bild 02 - Geldfluss im Monat.png`

**Nur diesen Codeblock an Google Flow geben:**

```text
Create a premium stylized 3D animated-feature finance illustration with no person.

Show one emerald income block on the left labeled "2.400 €". A clear muted-gold physical flow band leaves the income block and divides into three visible destinations:

- a graphite neutral block labeled "Fixkosten"
- a warm red-orange block labeled "Gebühren"
- an emerald protected reserve block labeled "Rücklage"

The image must communicate instantly where monthly income goes. Make the money flow physical, spatial and visually elegant rather than a flat diagram.

Use the same premium non-photorealistic 3D animation-film language: expressive rounded geometry, strong silhouettes, deep black negative space, clean soft lighting and restrained materials.

Emerald green represents available or protected money. Warm red-orange represents costs. Muted gold represents actual money movement. Graphite, ivory and soft gray are neutral.

No person, no hands, no room, no dashboard, no app interface, no spreadsheet, no chart and no additional text.

Square 1:1 image.
```

---

# REMOTION — SZENE 03

Output: `Visual 03 - SP500 10 Jahre`

Use the existing component `FinanceDataVisual` with `kind="line"` and the exact data from:

`public/data/sp500-10y.json`

Use:
- series: `chart`
- source: `source`
- symbol: `symbol`
- data date: `fetchedAt`

Content:
- title: `S&P 500 · 10 Jahre`
- subtitle: `Echte Zeitreihe`
- emerald line
- graphite / soft-gray axes
- visible source and data date

Motion:
- line reveals once from left to right
- no decorative looping motion
- final state remains stable
- no fake or interpolated extra market series

---

# REMOTION — SZENE 04

Output: `Visual 04 - Start vs Heute`

Use `FinanceDataVisual` with `kind="bar"` and the same exact file:

`public/data/sp500-10y.json`

Compare:
- first entry of `chart`
- last entry of `chart`

Content:
- title: `Start vs. letzter Datenpunkt`
- subtitle: `Punktestand im Vergleich`
- first bar: graphite / gray
- last bar: emerald
- source and data date visible

Motion:
- both bars grow once
- then remain stable
- no decorative motion

---

# GOOGLE FLOW — BILD 05

Dateiname: `Bild 05 - Bewusste Entscheidung.png`

**Nur diesen Codeblock an Google Flow geben:**

```text
Create a premium stylized 3D animated-feature finance illustration showing one young adult making a clear everyday financial decision.

The person sees a warm red-orange financing offer labeled "29 € / Monat" beside one desirable everyday product, but deliberately chooses not to take the monthly payment.

Show the decision through a simple physical action: the person calmly pushes the financing offer away while an emerald reserve envelope labeled "Rücklage" remains protected on the other side.

The financial choice is the main idea, not the person. Keep the environment minimal and show only the person, one purchase object, one financing offer and one reserve envelope.

Use a polished non-photorealistic 3D animation-film aesthetic with expressive stylized character design, rounded forms, strong silhouettes, deep black integration, clean soft lighting and restrained materials.

Emerald green represents protected money. Warm red-orange represents cost or financial pressure. Neutral objects use graphite, ivory and soft gray.

Only the labels "29 € / Monat" and "Rücklage" may appear.

No dashboard, no app interface, no random posters, no decorative writing, no clutter and no additional text.

Square 1:1 image.
```

---

# GOOGLE FLOW — BILD 06

Dateiname: `Bild 06 - Ruecklage faengt Belastung ab.png`

**Nur diesen Codeblock an Google Flow geben:**

```text
Create a premium stylized 3D animated-feature finance illustration with no person.

Show one solid emerald reserve block labeled "Rücklage" acting as a visible financial buffer. A warm red-orange unexpected-cost object labeled "Reparatur 280 €" hits the reserve block from one side.

The reserve absorbs the impact and remains visibly strong enough to protect a neutral graphite budget object positioned behind it.

The meaning must be understandable instantly: the reserve prevents an unexpected cost from damaging the rest of the budget.

Use a clear cause-and-effect composition with strong silhouettes, premium non-photorealistic 3D animation-film styling, rounded designed geometry, deep black negative space, clean soft lighting and grounded shadows.

Emerald green represents protection and available reserves. Warm red-orange represents the unexpected cost. Graphite, ivory and soft gray are neutral.

Only the labels "Rücklage" and "Reparatur 280 €" may appear.

No person, no hands, no generic shield icon, no dashboard, no flowchart, no floating interface elements and no additional text.

Square 1:1 image.
```

---

# Pipeline-Regeln — NICHT an Google Flow senden

Diese Regeln steuert unsere Pipeline außerhalb der Bildprompts:

1. Bild 01 zuerst allein erzeugen und vom Nutzer freigeben lassen.
2. Nach Freigabe bleibt Bild 01 die visuelle Referenz für die weiteren Flow-Bilder.
3. Folge-Bilder einzeln erzeugen; keine parallelen Bildjobs.
4. Dateinamen nach der Generierung exakt setzen.
5. Bild-QA außerhalb des Flow-Prompts durchführen.
6. Szene 03 und 04 ausschließlich mit Remotion aus echten Daten erzeugen.
7. Die fertige Serie besteht aus vier Flow-Bildern und zwei Remotion-Datenvisuals.

Damit bleibt der Flow-Prompt selbst bewusst simpel: **nur das gewünschte Bild beschreiben.**
