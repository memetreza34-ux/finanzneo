# FinanzNeo Image Creative Concept V1

## Ziel

FinanzNeo-Bilder sollen nicht nur korrekt und sauber sein, sondern **passend, unterhaltsam und merkbar**.

Die V9-Bildwelt bleibt unverändert. Creative Concept V1 entscheidet ausschließlich, **welche Bildidee den jeweiligen Sprechbeat am stärksten trägt**.

Contract: `finanzneo-image-creative-concept-v1`

## Grundregel

**Die stärkste passende Bildidee gewinnt.**

Es gibt keine Pflichtquote für Personen, Cause/Effect, mehrere Objekte, Impact-Shots oder Fantasie.

Kanonische `CONCEPT_MODE`-Werte:

- `single-iconic-object` – ein einziges ikonisches Objekt
- `object-interaction` – eine Objektinteraktion
- `character-moment` – ein Charakter-Moment
- `pov-moment` – POV / Zuschauer mitten in der Situation
- `real-environment` – eine reale Umgebung trägt die Aussage
- `comparison` – ein direkter Vergleich
- `visual-metaphor` – eine sofort verständliche visuelle Metapher
- `controlled-fantasy` – kontrollierte Fantasie mit klarem Realitätsanker
- `thought-visualization` – Visualisierung eines Gedankens oder Gefühls
- `cause-effect` – sichtbare Ursache und Wirkung
- `reveal` – visuelle Enthüllung
- `payoff` – klarer visueller Abschluss

Minimalismus ist erlaubt. Komplexität ist erlaubt. Entscheidend ist, ob das Bild den exakten Beat besser macht.

## Pflichtfragen pro IMAGE-Szene

- `CONCEPT_MODE`: Welche Bildidee ist es?
- `VIEWER_THOUGHT`: Was soll der Zuschauer sofort denken oder fühlen?
- `ENTERTAINMENT_HOOK`: Was stoppt den Scroll?
- `MEMORABILITY_HOOK`: Welches konkrete Detail bleibt im Kopf?
- `REALITY_ANCHOR`: Welches reale Finanz-/Alltagsdetail macht die Bedeutung sofort klar?
- `FANTASY_LEVEL`: `0–3`
- `FANTASY_JUSTIFICATION`: `none` bei 0, sonst konkrete Begründung
- `WHY_THIS_CONCEPT`: Warum ist diese Idee stärker als eine generische Erklärszene?

## Fantasy

Fantasie ist ausdrücklich erlaubt, wenn sie die Aussage stärker macht.

- `0`: vollständig real / keine Fantasie
- `1`: leichte visuelle Überhöhung
- `2`: klare metaphorische oder gedachte Welt
- `3`: starke kontrollierte Fantasie

Bei `1–3` muss die Finanzbedeutung trotzdem in ungefähr 1–2 Sekunden verständlich bleiben. Der `REALITY_ANCHOR` verhindert abstrakte Rätsel.

## Was nicht mehr gilt

Die ersetzte V5.1-Dynamic-Staging-Schicht verlangte feste Quoten für Cause/Effect, Impact Composition und Staging Modes. Diese Quoten gelten **nicht mehr**.

Sie konnten formal abwechslungsreiche, aber trotzdem formelhafte Bilder erzeugen. Creative Concept V1 erzwingt deshalb keine bestimmte Bildform.

## Google Flow

Nach fertiger Planung:

```bash
npm run reel:image-prompts:compile -- <Reel-Pfad>
```

Der Compiler schreibt die Creative-Concept-Regie direkt in den echten `IMAGE PROMPT`.

Google Flow bleibt Strict-Single-Job:

`Bild 01 → QA → PASS → Bild 02 → ...`

## Post-Generation Vision-QA

Bei Creative-Concept-Reels werden zusätzlich bewertet:

- `conceptClarity`
- `entertainmentValue`
- `memorability`
- `viewerThoughtMatch`

Hard-Fail-Beispiele:

- `boringLiteral`
- `decorativeWithoutMeaning`
- `fantasyConfusing`
- `overexplainedPropLayout`

Ein starkes Einzelobjekt oder bewusstes Minimalbild darf nicht allein deshalb scheitern, weil keine sichtbare Handlung oder Person vorhanden ist.

## Unverändert

- `finanzneo-stylized-3d-animated-black-v9`
- Deep Black
- Farbrollen / Materialien
- non-photorealistic stylized 3D
- 1:1-Quellbilder
- V5 Sequence-first
- V5 Hardening / Prompt Compiler
- SHA-256-gebundene Pixel-/Vision-QA
- Google Flow Strict-Single-Job
