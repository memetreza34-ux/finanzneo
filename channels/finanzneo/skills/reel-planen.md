# Skill: FinanzNeo-Reel planen

## Ziel

Ein veröffentlichbares Finanz-Reel aus starken Einzelbildern bauen. Jedes Bild erklärt genau eine Aussage. Remotion ergänzt nur Voiceover, deutsche Untertitel, kurze Überschrift, Icon, sanften Zoom und minimale Bildfahrt.

## Produktionsmodus

Verbindlich ist `image-first-lite`.

Erlaubt:

- 8–10 eigenständige Bilder,
- ein Bild pro klarer Aussage,
- Payoff und CTA dürfen das vorherige Bild weiterverwenden,
- harte Schnitte,
- kurze lineare Einblendung von Überschrift und Icon,
- deutsche Wortuntertitel,
- langsamer Zoom bis maximal 1,035,
- minimale Bildfahrt bis maximal 12 Pixel.

Nicht planen:

- Motion Router,
- mehrere inhaltliche Animationsphasen,
- Push, Wipe, Zoom-through oder Match-Move,
- 2,5D-Kameras oder Perspektivwechsel,
- komplexe Diagramme, Karten oder Zahlenanimationen,
- Partikel, animierter Glow oder schwebende Dekoration,
- SFX oder Musik,
- starke oder hektische Bewegung.

## Verbindliche Bildstil-Dateien

Vor der Bildplanung lesen:

- `../gehirn/BILDSTIL.md`
- `../gehirn/MASTER-STYLE-PROMPT.md`
- `../gehirn/IMAGE-PROMPT-TEMPLATE.md`

Der Stil bleibt über alle Reels gleich. Nur Aussage, Szene, Figuren, Objekte und kurze deutsche Labels dürfen sich ändern.

## Ablauf

1. Genau ein Thema für einen freien Wochentag verwenden.
2. Zentrale Frage, Hook und Payoff festlegen.
3. 150–200 Wörter in 10–14 kurze Szenen verteilen.
4. Pro Szene genau eine neue finanzielle Aussage schreiben.
5. `scriptText` exakt aus allen `voiceText`-Sätzen zusammensetzen.
6. Quellen und Claim-IDs dokumentieren.
7. Für jede Szene Kicker, Icon und kurze Headline festlegen.
8. Acht bis zehn Szenen als `full-bleed`-Bildszene planen.
9. Jede Bildszene erhält ein englisches `imagePrompt` nach `IMAGE-PROMPT-TEMPLATE.md`.
10. An jeden Szenenprompt wird der vollständige, unveränderte Block aus `MASTER-STYLE-PROMPT.md` angehängt.
11. Jede Szene verwendet `transition: "cut"`.
12. Jede Szene besitzt höchstens eine `visualPhase` bei `at: 0`.
13. `soundCues` bleibt leer.
14. Storyboard, einfachen Schnitt- und Bewegungsplan, Caption und PDF-Inhalt schreiben.
15. `02-bilder/prompt-manifest.json` mit Satz, Bildaussage, Prompt und Zieldatei schreiben.
16. `02-bilder/alle-bildprompts.txt` als komplett kopierbare Prompt-Sammlung für Google Flow schreiben.
17. Danach Content-Gate (`finance:content-ready`) ausführen.

## PDF bleibt Pflicht

Der Ordner `04-pdf/` und die Datei `04-pdf/inhalt.md` gehören weiterhin zu jedem Reel-Projekt. Sie dürfen nicht entfernt, ausgelassen oder durch die Bildprompt-Dateien ersetzt werden.

## Alle Bildprompts für Google Flow

Zusätzlich zum JSON-Manifest muss immer diese Datei entstehen:

```text
02-bilder/alle-bildprompts.txt
```

Sie enthält alle vollständigen Bildprompts in der Reihenfolge des Reels. Arman soll den kompletten Text markieren, kopieren und direkt in Google Flow einfügen können.

Exaktes Format:

```text
SZENE 1 – BILDPROMPT
<vollständiger englischer Prompt inklusive Master-Style-Prompt>

SZENE 2 – BILDPROMPT
<vollständiger englischer Prompt inklusive Master-Style-Prompt>
```

Verbindliche Regeln:

- chronologische Reihenfolge,
- jede Überschrift exakt `SZENE X – BILDPROMPT`,
- immer der komplette Prompt,
- keine Codeblöcke, Tabellen oder JSON-Zeichen,
- keine Kommentare oder Erklärungen zwischen den Prompts,
- genau eine Leerzeile zwischen zwei Szenen,
- Bildwiederverwendungen nur markieren, nicht als neuen Prompt doppeln.

## Bildentscheidung pro Satz

Ein neues Bild ist nötig, wenn der Satz einen neuen Gegenstand, Ort, Vergleich, Zeitpunkt, Betrag oder eine neue Geldfolge einführt.

Ein bestehendes Bild darf nur weiterlaufen, wenn der folgende Satz dieselbe Aussage abschließt. Zoom oder minimale Bildfahrt gelten nicht als neues Bild.

## Szenenlogik

Jeder Prompt muss enthalten:

1. `MESSAGE TO COMMUNICATE` — die sichtbare Kernaussage,
2. `SCENE` — eine zusammenhängende Szene oder Metapher,
3. `GERMAN LABELS` — optional null bis fünf kurze Begriffe,
4. `COMPOSITION` — Hauptmotiv und Freiraum,
5. den unveränderten Master-Stilblock.

Regeln:

- Illustration statt Dashboard.
- Eine starke Metapher statt vieler kleiner Symbole.
- Figuren nur verwenden, wenn sie eine Handlung klarer machen.
- Höchstens drei bis fünf unterstützende Elemente.
- Ein Bild darf keine mehreren unverbundenen Aussagen tragen.
- Sichtbarer Text nur als kurze deutsche Labels.
- Überschrift, Untertitel und CTA werden nicht ins Bild generiert.

## Schnitt- und Bewegungsplan

`06-projektdateien/motion-design.md` bleibt aus Kompatibilitätsgründen bestehen. Pro Szene dokumentieren:

- Bilddatei,
- Startzeit und Dauer,
- `cut`,
- Kicker,
- Icon,
- Headline,
- Untertitelbereich,
- automatische sanfte Zoom- und Bildfahrt,
- bei Payoff oder CTA: welches vorherige Bild weiterläuft.

Keine individuelle komplexe Animation oder SFX planen.

## Pflichtbefehle

```bash
npm run finance:script-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:creative-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:content-ready -- <projektordner>
```

Nicht zur Medienphase wechseln, solange einer dieser Befehle rot ist.
