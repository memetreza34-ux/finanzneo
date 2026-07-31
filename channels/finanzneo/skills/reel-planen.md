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

## Ablauf

1. Genau ein Thema für einen freien Wochentag verwenden.
2. Zentrale Frage, Hook und Payoff festlegen.
3. 150–200 Wörter in 10–14 kurze Szenen verteilen.
4. Pro Szene genau eine neue finanzielle Aussage schreiben.
5. `scriptText` exakt aus allen `voiceText`-Sätzen zusammensetzen.
6. Quellen und Claim-IDs dokumentieren.
7. Für jede Szene Kicker, Icon und kurze Headline festlegen.
8. Acht bis zehn Szenen als `full-bleed`-Bildszene planen.
9. Jede Bildszene erhält ein `imagePrompt` (freier englischer Text, kein festes Feldschema mehr). Es gibt aktuell **kein festes Bildstil-Regelwerk** — vor der nächsten Produktion mit Arman einen neuen Stil festlegen.
10. Jede Szene verwendet `transition: "cut"`.
11. Jede Szene besitzt höchstens eine `visualPhase` bei `at: 0`.
12. `soundCues` bleibt leer.
13. Storyboard, einfachen Schnitt- und Bewegungsplan, Caption und PDF-Inhalt schreiben.
14. Bildprompts manuell nach neuem Stil schreiben (kein automatisches Tool aktuell), dann Content-Gate (`finance:content-ready`) ausführen.

## Bildentscheidung pro Satz

Ein neues Bild ist nötig, wenn der Satz einen neuen Gegenstand, Ort, Vergleich, Zeitpunkt, Betrag oder eine neue Geldfolge einführt.

Ein bestehendes Bild darf nur weiterlaufen, wenn der folgende Satz dieselbe Aussage abschließt. Zoom oder minimale Bildfahrt gelten nicht als neues Bild.

## Bildstil — aktuell nicht definiert

Das bisherige Bildpromptsystem (v6) wurde entfernt, weil die erzeugten Bilder nicht dem gewünschten Look entsprachen. Es gibt aktuell **keine verbindliche Feldstruktur, Wortzahl- oder Stilvorgabe** — `imagePrompt` ist ein freier englischer Text pro Bildszene.

Bis ein neuer Stil mit Arman festgelegt ist: Prompt auf Englisch, sichtbarer Bildtext (falls nötig) nur kurze deutsche Labels, Überschrift/Icon/CTA/Untertitel entstehen später in Remotion.

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

Bildprompts (`imagePrompt` je Szene, `prompt-manifest.json`) müssen aktuell manuell nach dem neuen Stil geschrieben werden — es gibt kein automatisches Erzeugungs-/QA-Tool mehr, bis der neue Stil steht.

Nicht zur Medienphase wechseln, solange einer dieser Befehle rot ist.
