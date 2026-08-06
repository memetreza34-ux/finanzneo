# FinanzNeo — Bildprompt-Bibliothek V3

Diese Datei ersetzt die bisherigen voneinander unabhängigen Stilblöcke.

Verbindlich:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- World ID: `finanzneo-connected-studio-v3`

## Grundregel

Ein Prompt besteht aus zwei Teilen:

1. unveränderlicher Weltblock
2. individuelle Aussage und Handlung

Der Weltblock wird niemals pro Szene neu erfunden.

## Unveränderlicher Weltblock

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3

USE STYLE REFERENCE:
Use the supplied bildwelt-referenz.png only as a style and environment reference.
Match its camera angle, 35mm-equivalent perspective, camera height, curved charcoal studio architecture,
matte floor, emerald architectural light channels, lighting, materials, depth and subject scale.
Do not redesign the world.

SERIES CONTINUITY LOCK:
The image must look like another frame from exactly the same FinanzNeo studio as every other image in this reel.

ENVIRONMENT:
Create one connected premium finance-explainer environment with a visible matte floor,
a curved charcoal back wall, integrated emerald light channels and subtle architectural depth.
The scene must not look like an isolated object in an empty black void.
Use three depth layers: supporting foreground, explanatory midground action and quiet architectural background.

COMPOSITION LOCK:
Vertical 9:16 source image.
The complete main action sits inside the central 64 percent of the image height
and fills approximately 68 to 78 percent of the usable width.
Keep the upper 18 percent and lower 18 percent crop-safe and low-detail,
but continue the same studio wall, floor and lighting there instead of leaving blank black space.

TEXT:
No headline, subtitle, sentence, number, label, logo, watermark or interface text inside the image.
Remotion renders all typography and validated values.

CONSISTENCY NEGATIVES:
No empty black background, no isolated floating product, no floating platform,
no different camera angle, no different color palette, no blue or purple neon world,
no photorealism, no cartoon, no Pixar, no clay style, no dashboard, no app UI,
no advertising layout, no random particles and no decorative filler.
```

## Szenenblock

```text
SCENE MESSAGE:
[genau ein gesprochener Satz]

CONNECTED VISUAL STORY:
[Ausgangspunkt] → [sichtbare Handlung] → [verständliches Ergebnis]

PRIMARY OBJECTS:
1. [großes Hauptobjekt]
2. [zweites verbundenes Objekt]
3. [Ergebnis oder Schutzmechanismus]

READABILITY:
The concept must be understandable within one second on a smartphone.
The scene must not show the solution before the voiceover reaches the solution.
```

## Muster: Problem

```text
SCENE MESSAGE:
[Problem-Satz]

CONNECTED VISUAL STORY:
Show one visually healthy starting amount entering a structurally wrong system.
Keep all purposes mixed and unrestricted.
Make the hidden conflict visible through connected obligations,
but do not show the later solution, splitter or protected account system.
```

## Muster: Mechanismus

```text
SCENE MESSAGE:
[Mechanismus-Satz]

CONNECTED VISUAL STORY:
Show the starting financial object, one visible transformation or path,
and the direct consequence inside the same connected studio environment.
Use physical movement, separation, blocking, shrinking, growing or protection.
```

## Muster: Schutz

```text
SCENE MESSAGE:
[Schutz-Satz]

CONNECTED VISUAL STORY:
Integrate one protected financial container into the studio floor.
Show the relevant money entering it and one external risk being blocked.
Keep optional spending visibly outside the protection boundary.
```

## Muster: Ergebnis

```text
SCENE MESSAGE:
[Ergebnis-Satz]

CONNECTED VISUAL STORY:
Show the completed connected system in one calm balanced composition.
Use clean paths and protected zones.
The final scene may show the full solution because the voiceover has reached the payoff.
```

## Ablehnung

Prompt oder Bild wird abgelehnt, wenn:

- der Weltblock fehlt oder verändert wurde
- keine Bildwelt-Referenz verwendet wurde
- ein leerer schwarzer Hintergrund gefordert wird
- ein Objekt isoliert oder auf einer Werbeplattform schwebt
- Text oder Zahlen im Bild erlaubt werden
- das Problem-Bild bereits die spätere Lösung zeigt
- Kamera, Licht, Architektur oder Motivgröße zwischen Szenen wechseln
