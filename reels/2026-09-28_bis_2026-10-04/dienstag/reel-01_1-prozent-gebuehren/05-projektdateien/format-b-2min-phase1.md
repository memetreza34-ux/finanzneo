# FinanzNeo Format B · 2 Minuten · Phase 1

FORMAT_B_ID: finanzneo-format-b-2min-v1
DURATION: 120s / 3600 Frames / 30fps
MIX: 20 IMAGE + 6 ANIMATION
IMAGE_DURATION: 126 Frames / 4,2s
ANIMATION_DURATION: 180 Frames / 6,0s

## Verbindliche Regel

Format B ist bildgeführt. Bilder tragen Story, Alltagssituation, Zahlenanker und Kontext. Animationen werden nur eingesetzt, wenn Bewegung die Ursache-Wirkung klarer erklärt als ein einzelnes Bild. Jede der sechs Animationen wird individuell in Phase 1 entworfen und besitzt eine eigene `animation.tsx`. Die Finance Motion Library darf Ideen oder Primitives liefern, entscheidet aber nie die Szene.

## Rechenannahme

Illustratives Beispiel, keine Prognose: 10.000 € Startkapital + 300 € monatlich, 30 Jahre, monatliche Verzinsung. Vergleich 7 % p.a. zu 6 % p.a. Ergebnis gerundet: ca. 447.000 € vs. 362.000 €, Differenz ca. 85.600 €.

## V9 Image Lock für alle IMAGE-Szenen

FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
ASPECT_RATIO: 1:1

STYLE: clearly stylized 3D animated finance-explainer world, real-world-grounded, believable everyday construction, soft rounded geometry, premium clean materials, simplified details, never photorealistic. One seamless deep black background. Large readable main subject, clear cause-and-effect, soft contact shadows, strong subject separation. Emerald for positive/growth, warm gold for money, warm red-orange only for costs/warnings, ivory/soft gray for neutral objects. No dashboard, no app UI, no flowchart, no floating info cards, no tiny-box composition, no microchip language, no miniature diorama, no clutter. No headline/subtitle/sentence inside generated image. Only the exact short object labels listed below.

## Individuelle IMAGE-Prompts

### Scene 01 · Bild 01 - Ein Prozent wirkt klein.png
Labels: `1 %`
Prompt: Create one oversized premium 3D gold fee token marked “1 %” beside a much larger emerald investment-capital object. Make the fee token look visually tiny compared with the capital so the first impression is “that seems harmless”, while subtle red-orange cost lighting hints that this small percentage matters over time.

### Scene 02 · Bild 02 - Kosten wirken unsichtbar.png
Labels: `Gebühr`
Prompt: Create a believable stylized 3D investment scene where a small red-orange cost piece is quietly removed from a substantial investment container while the owner would not receive a separate physical bill. The missing piece must be visible in the capital itself, not as an app interface.

### Scene 04 · Bild 04 - Startkapital.png
Labels: `10.000 €`
Prompt: Show a substantial gold-and-emerald starting-capital stack with a clear object label “10.000 €”, prepared at the beginning of a long investment journey. Keep the composition simple, physical and immediately readable.

### Scene 05 · Bild 05 - Monatliche Sparrate.png
Labels: `300 €`, `Monat`
Prompt: Show a recurring monthly saving situation using a physical calendar object and one neat 300-euro coin bundle moving conceptually toward an investment container, frozen as a still moment. Make repetition obvious without using an interface.

### Scene 06 · Bild 06 - Sieben gegen sechs Prozent.png
Labels: `7 %`, `6 %`
Prompt: Show two identical investment containers at the same starting line, one marked “7 %” and one marked “6 %”. Everything except the rate label must be visually equal so the viewer understands that only one percentage point differs.

### Scene 08 · Bild 08 - Fuenf Jahre sieben Prozent.png
Labels: `5 Jahre`, `35.700 €`
Prompt: Show a five-year milestone pedestal with a strong emerald capital stack reaching “35.700 €”. Include a simple physical five-year marker; no charts or dashboards.

### Scene 09 · Bild 09 - Fuenf Jahre sechs Prozent.png
Labels: `5 Jahre`, `34.400 €`
Prompt: Show the matching five-year milestone in the exact same visual world, but with a slightly lower warm-gold capital stack marked “34.400 €”. The difference should feel small, not dramatic.

### Scene 10 · Bild 10 - Kleiner Abstand.png
Labels: `≈ 1.200 €`
Prompt: Show two nearly equal capital stacks with only a narrow physical gap between their tops. Place one small neutral bracket or distance object labelled “≈ 1.200 €” to make the early difference feel modest.

### Scene 12 · Bild 12 - Zehn Jahre sieben Prozent.png
Labels: `10 Jahre`, `72.000 €`
Prompt: Show a ten-year milestone with a larger emerald capital structure marked “72.000 €”. Make it clearly more substantial than the five-year scene while preserving the same black V9 world.

### Scene 13 · Bild 13 - Zehn Jahre sechs Prozent.png
Labels: `10 Jahre`, `67.400 €`
Prompt: Show the corresponding ten-year warm-gold capital structure marked “67.400 €”, slightly but clearly lower than the seven-percent path.

### Scene 14 · Bild 14 - Abstand nach zehn Jahren.png
Labels: `≈ 4.700 €`
Prompt: Show two ten-year capital stacks with a visibly wider physical height difference than at year five. Add one restrained distance marker labelled “≈ 4.700 €”.

### Scene 16 · Bild 16 - Zwanzig Jahre sieben Prozent.png
Labels: `20 Jahre`, `196.700 €`
Prompt: Show a twenty-year milestone with a tall, premium emerald wealth structure marked “196.700 €”, emphasizing accumulated scale without becoming a bar-chart dashboard.

### Scene 17 · Bild 17 - Zwanzig Jahre sechs Prozent.png
Labels: `20 Jahre`, `171.700 €`
Prompt: Show the corresponding twenty-year warm-gold wealth structure marked “171.700 €”, clearly lower while using identical framing and object language.

### Scene 18 · Bild 18 - Abstand nach zwanzig Jahren.png
Labels: `≈ 25.000 €`
Prompt: Show the two twenty-year wealth structures together with a substantial physical gap object between their tops labelled “≈ 25.000 €”. The gap itself should now feel financially meaningful.

### Scene 19 · Bild 19 - Kostenquellen.png
Labels: `Fonds`, `Depot / Service`, `Transaktion`
Prompt: Create three believable physical cost sources arranged around one investment object: a fund document/object, a depot/service object and a transaction receipt/object. Use only the three exact short labels and make each source visibly remove a small cost piece from the same capital.

### Scene 21 · Bild 21 - Gleiche Einzahlungen.png
Labels: `gleich eingezahlt`
Prompt: Show two identical contribution piles feeding two separate investment paths. Both contribution piles must be exactly equal and labelled “gleich eingezahlt”, making clear that the later outcome difference is not caused by different savings amounts.

### Scene 22 · Bild 22 - Unterschied 85600 Euro.png
Labels: `≈ 85.600 €`
Prompt: Show one substantial standalone pile of gold value representing only the final difference, marked “≈ 85.600 €”. Keep the scene clean and physical so the number feels concrete rather than like a statistic card.

### Scene 23 · Bild 23 - Kosten nachsehen.png
Labels: `Produktunterlagen`, `Preis / Leistung`
Prompt: Show a person-free physical desk-like finance scene on seamless black with two substantial paper/document objects labelled “Produktunterlagen” and “Preis / Leistung”, plus a magnifying glass inspecting the cost section. No app or dashboard.

### Scene 25 · Bild 25 - Nicht nur billig.png
Labels: `Kosten`, `Risiko`, `Diversifikation`
Prompt: Show a premium physical balance mechanism with three substantial weighted objects labelled “Kosten”, “Risiko” and “Diversifikation”. The scene should communicate that cost is important but not the only decision factor.

### Scene 26 · Bild 26 - Fazit.png
Labels: `Kosten prüfen`
Prompt: Create a final clean V9 still with one investment container, a magnifying glass and a small cost token being inspected before investment. Label only “Kosten prüfen”. The visual should feel conclusive and practical, not promotional.

## Individuelle ANIMATION-Szenen

- Scene 03: repeated fee-chip removal from one capital body. Source: `scene-03/animation.tsx`.
- Scene 07: identical twin capital paths diverge because only one is repeatedly shaved. Source: `scene-07/animation.tsx`.
- Scene 11: returns feed back into capital while a fee siphon diverts part before compounding. Source: `scene-11/animation.tsx`.
- Scene 15: two return trajectories visibly separate until the gap becomes the hero. Source: `scene-15/animation.tsx`.
- Scene 20: final 30-year capital bodies build first; 447k and 362k appear only after the build. Source: `scene-20/animation.tsx`.
- Scene 24: all removed fee fragments converge into one final ≈85.600 € payoff. Source: `scene-24/animation.tsx`.

## Phase-1 Preview

Die Remotion-Testcomposition nutzt statische Storyboard-Stills für IMAGE-Szenen, bis die finalen V9-Flow-Bilder erzeugt und eingesetzt sind. ANIMATION-Szenen verwenden bereits ihren echten individuellen Phase-1-Code. Das Preview ist damit Timing-/Strukturtest, nicht finaler Bildexport.
