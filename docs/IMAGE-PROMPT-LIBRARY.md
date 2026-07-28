# FinanzNeo — Bildprompt-Bibliothek

Diese Bibliothek enthält fertige Prompt-Grundlagen für den aktuellen FinanzNeo-Bildstil.

Verbindlich sind zusätzlich:

- `CLAUDE.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/BEAT-TO-IMAGE-RULES.md`

## Grundregel

Jedes Bild muss einen gesprochenen Satz **erklären**. Es darf nicht nur dekorativ aussehen.

Bevorzugte Bildlogik:

`Ausgangspunkt → sichtbare Entwicklung → verständliches Ergebnis`

## Fester Stilblock

Diesen Stilblock bei jedem Prompt beibehalten:

```text
VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent of the image clean and visually quiet for a Remotion headline.
Keep the lower 22 percent of the image clean and visually quiet for Remotion subtitles.
Do not place important objects, labels, arrows, charts or decorative elements inside these safe areas.
Place the complete explanatory scene in the central area of the vertical frame.

TEXT RULES:
Do not add a headline, subtitle, paragraph, explanatory sentence or large text card.
Use no text by default.
Only when absolutely necessary, include a maximum of three small German labels, each no longer than one to three words.
Place labels directly beside the object they describe and only inside the central illustration area.

BRAND RULES:
Do not use real brands, company logos, copyrighted interfaces or product packaging unless the specific topic requires them.
Otherwise use original generic financial objects belonging to one consistent FinanzNeo illustration world.

The image must feel like one frame from a consistent premium finance explainer series, not an advertisement, product render, presentation slide or crowded infographic poster.

Vertical 9:16 composition.
```

---

# 1. Inflation und Kaufkraftverlust

## Beispielsatz

> Inflation sorgt dafür, dass dein Geld jedes Jahr an Kaufkraft verliert.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Inflation sorgt dafür, dass dein Geld jedes Jahr an Kaufkraft verliert.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side of the central composition, show a premium dark wallet containing several clearly recognizable euro banknotes.

A glowing green path leads from the wallet toward two shopping baskets placed farther to the right.

Along the path, the euro banknotes gradually become smaller, thinner and slightly more transparent. This must visually represent the continuous loss of purchasing power.

The first shopping basket contains a normal amount of generic groceries.

The second shopping basket contains noticeably fewer groceries even though the same amount of money is being used.

Near the second basket, include a small clean upward-trending price chart to communicate rising prices.

The complete visual story must communicate:

same money → rising prices → fewer products.

COMPOSITION:
Use a clear left-to-right or diagonal flow.
Use only four large primary elements: wallet, shrinking euro banknotes, first basket, second basket.
Keep the price chart small and secondary.
The viewer must understand the concept instantly on a smartphone screen.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.
Place all important objects, arrows and charts inside the central area.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Kaufkraft”
“Preise steigen”
“Inflation”
Use a maximum of three labels.

Do not use real supermarkets, brands, product packaging or company logos.
Use only original generic objects from the established FinanzNeo illustration world.

Vertical 9:16 composition.
```

---

# 2. Notgroschen

## Beispielsatz

> Ein Notgroschen verhindert, dass eine unerwartete Rechnung dich direkt in Schulden bringt.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Ein Notgroschen verhindert, dass eine unerwartete Rechnung dich direkt in Schulden bringt.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side of the central composition, show a broken washing machine beside a clearly visible generic repair invoice.

In the center, show a transparent emergency-fund container filled with euro banknotes and coins. A subtle glowing green shield surrounds the container.

A clear green path leads from the emergency fund toward the repair invoice, showing that the saved money covers the unexpected cost.

On the right side, show a red credit-card debt symbol or a growing stack of unpaid bills being blocked by the green shield.

The complete visual story must communicate:

unexpected expense → emergency fund pays → debt is avoided.

COMPOSITION:
Use only four main visual elements:
1. broken washing machine
2. repair invoice
3. protected emergency fund
4. blocked debt symbol

Use strong scale hierarchy and clear spacing.
The emergency fund must be the visual center of the scene.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.
Do not place important objects, labels or arrows inside these safe areas.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Notgroschen”
“Rechnung”
“Schulden”
Use a maximum of three labels.

Do not use real banks, credit-card brands, appliance brands or copyrighted interfaces.

Vertical 9:16 composition.
```

---

# 3. ETF-Sparplan

## Beispielsatz

> Mit einem ETF-Sparplan wird jeden Monat automatisch ein fester Betrag investiert.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Mit einem ETF-Sparplan wird jeden Monat automatisch ein fester Betrag investiert.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side of the central composition, show a calendar with several recurring monthly markers.

From each monthly marker, one equal stack of euro coins or euro banknotes moves automatically along a clean glowing green path.

The path leads into a central investment container representing a diversified ETF portfolio.

Inside or behind the investment container, show many small abstract company blocks distributed across different sectors and regions. They must feel diversified but remain simple and readable.

On the right side, show the portfolio gradually growing into a larger structured stack over time.

The complete visual story must communicate:

monthly schedule → equal automatic investment → diversified portfolio grows.

COMPOSITION:
Use only four main visual groups:
1. monthly calendar
2. equal recurring euro payments
3. diversified ETF container
4. growing portfolio result

Do not create a dashboard or many small panels.
Use one clear directional path across the central composition.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Monatlich”
“ETF”
“Automatisch”
Use a maximum of three labels.

Do not use real brokers, fund providers, index logos or app interfaces.

Vertical 9:16 composition.
```

---

# 4. Diversifikation

## Beispielsatz

> Diversifikation verteilt dein Geld auf viele Unternehmen, Länder und Branchen.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Diversifikation verteilt dein Geld auf viele Unternehmen, Länder und Branchen.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

In the center-left, show one stack of euro coins entering a clean distribution hub.

From the hub, several glowing green paths spread outward toward a small number of clearly separated destination groups.

The destination groups should represent:
- different industries through generic factory, technology, healthcare and consumer symbols
- different countries through abstract map regions or location markers
- many companies through multiple clean building blocks

On the right side, show the distributed portfolio protected inside a broad green shield.

Near the edge, show one small red falling company block while the rest of the diversified portfolio remains stable. This must communicate that one loss does not destroy the whole portfolio.

The complete visual story must communicate:

one amount of money → spread across many areas → lower concentration risk.

COMPOSITION:
Avoid a crowded network.
Use one central hub and only three or four destination groups.
Keep all icons large enough for smartphone viewing.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Länder”
“Branchen”
“Unternehmen”
Use a maximum of three labels.

Do not use real companies, country flags, index logos or financial brands.

Vertical 9:16 composition.
```

---

# 5. Zinseszins

## Beispielsatz

> Beim Zinseszins erwirtschaften nicht nur deine Einzahlungen, sondern später auch deine bisherigen Erträge neue Erträge.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Beim Zinseszins erwirtschaften nicht nur deine Einzahlungen, sondern später auch deine bisherigen Erträge neue Erträge.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side, show a small original stack of euro coins entering a circular growth system.

The first cycle generates a few additional gold coins.

Those new coins remain inside the system and join the next cycle instead of leaving it.

Each following cycle becomes visibly larger and produces more coins than the previous cycle.

On the right side, show the final result as a substantially larger but still clean and believable stack of euro coins.

The complete visual story must communicate:

initial money → first return → return stays invested → larger future returns.

COMPOSITION:
Use three clear growth stages, not many tiny steps.
The cycles must increase in size from left to right.
Use glowing green circular arrows to connect the stages.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Einzahlung”
“Ertrag”
“Zinseszins”
Use a maximum of three labels.

Do not show a specific promised return, percentage or future amount inside the image.
Remotion will add validated numbers separately.

Vertical 9:16 composition.
```

---

# 6. Schuldenfalle

## Beispielsatz

> Hohe Zinsen können aus einer kleinen offenen Rechnung schnell eine deutlich größere Schuld machen.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Hohe Zinsen können aus einer kleinen offenen Rechnung schnell eine deutlich größere Schuld machen.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side, show one small unpaid invoice with a modest euro amount represented visually by a small stack of red-marked debt tokens.

A red spiral path moves from the invoice through several interest cycles.

With each cycle, the stack of debt tokens becomes visibly larger.

On the right side, show a much larger debt stack partially blocking a person's generic monthly budget container. Do not show a human figure; use a clean budget box or wallet instead.

Add one small warning symbol near the growing debt, but keep it secondary.

The complete visual story must communicate:

small unpaid amount → interest cycles → much larger debt burden.

COMPOSITION:
Use three visible stages only.
Keep the original invoice clearly smaller than the final debt stack.
The red growth path must be obvious and easy to follow.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Rechnung”
“Zinsen”
“Schulden”
Use a maximum of three labels.

Do not use real banks, debt-collection brands, credit-card brands or app interfaces.

Vertical 9:16 composition.
```

---

# 7. Konsum und unnötige Ausgaben

## Beispielsatz

> Viele kleine spontane Käufe können am Monatsende einen überraschend großen Betrag ergeben.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Viele kleine spontane Käufe können am Monatsende einen überraschend großen Betrag ergeben.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

On the left side, show several small generic purchases represented by a takeaway drink, delivery box, small shopping bag and digital entertainment token.

Each purchase removes a small euro coin from a wallet.

The small coins travel along separate short paths and combine in the center into one unexpectedly large total stack.

On the right side, show the wallet noticeably emptier at the end of the month beside a calendar page.

The complete visual story must communicate:

many small purchases → combined total grows → less money remains at month-end.

COMPOSITION:
Use only four purchase categories.
Do not create a cluttered shopping scene.
The combined total stack must be the visual turning point in the center.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Kleine Käufe”
“Monatsende”
“Gesamtsumme”
Use a maximum of three labels.

Do not use real stores, delivery brands, streaming logos or recognizable packaging.

Vertical 9:16 composition.
```

---

# 8. Risiko und Sicherheit

## Beispielsatz

> Mehr Renditechance bedeutet meistens auch stärkere Schwankungen und ein höheres Verlustrisiko.

## Bildprompt

```text
Create a premium isometric editorial finance illustration explaining the sentence:

“Mehr Renditechance bedeutet meistens auch stärkere Schwankungen und ein höheres Verlustrisiko.”

VISUAL STYLE:
Premium isometric editorial finance illustration, dark charcoal background, deep green accent color, restrained gold details for money and financial value, clean modern 3D illustration style, soft volumetric lighting, premium matte materials, subtle glass details, strong depth, polished editorial design, not photorealistic, not cartoonish, not childish.

CREATE ONE CONNECTED EXPLANATORY SCENE:

Create a clean central balance scale.

On the left side of the scale, show a calm blue-green investment path with smaller upward movement and a protected savings container.

On the right side, show a steeper green growth path with much larger upward potential, but also a visible red downward drop and stronger movement.

The balance scale should visually connect opportunity and risk without declaring one side universally better.

The complete visual story must communicate:

higher possible return ↔ stronger fluctuations and higher loss risk.

COMPOSITION:
Use one large balance scale as the main object.
Use only two clear sides: calmer/lower fluctuation and stronger/higher fluctuation.
Do not create a complex dashboard.

SAFE AREAS FOR REMOTION:
Keep the upper 18 percent clean and visually quiet.
Keep the lower 22 percent clean and visually quiet.

TEXT RULES:
Do not add a headline, subtitle, paragraph or explanatory sentence.
Optional small German labels only:
“Chance”
“Schwankung”
“Risiko”
Use a maximum of three labels.

Do not include specific percentages, product names or investment recommendations.

Vertical 9:16 composition.
```

---

# So wird die Bibliothek erweitert

Für neue Themen immer diese Reihenfolge verwenden:

1. den exakten gesprochenen Satz nennen
2. eine vollständige Ursache-Wirkungs-Szene entwerfen
3. nur 2 bis 4 große Hauptobjekte einsetzen
4. oben 18 % und unten 22 % freihalten
5. standardmäßig keinen Text verwenden
6. Zahlen, Quellen und Erklärtext Remotion überlassen
7. das Ergebnis mit `docs/IMAGE-QA-CHECKLIST.md` prüfen

Neue Prompts dürfen nur aufgenommen werden, wenn sie den FinanzNeo-Stil klar verbessern oder einen häufig wiederkehrenden Finanzbegriff abdecken.
