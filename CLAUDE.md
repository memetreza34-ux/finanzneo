# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion.
> Bei Widersprüchen mit älteren Dateien gilt immer `CLAUDE.md`.

## 1. Kanal und Ziel

- Kanalname: **FinanzNeo**
- Sprache: Deutsch
- Inhalt: Finanzgrundlagen für Menschen mit wenig oder keinem Vorwissen
- Hauptziel: Reichweite, Vertrauen und später Einnahmen
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels und Snapchat
- YouTube: ausschließlich eigenständige längere Videos unter `youtube/`; **keine YouTube Shorts** und keine automatische Spiegelung von Reels nach YouTube
- Primärformat der Reels: vertikale Videos von 60 bis 90 Sekunden
- Ansprache: direkt mit **du**, einfach, professionell und nahbar
- Kein fester Avatar und kein sichtbarer Moderator als Pflicht

## 2. Repository-Sicherheit

- Nie direkt auf `main` arbeiten.
- Neues Thema = neuer Branch + neuer Reel-Ordner.
- Bestehende Reels sind read-only, außer sie werden ausdrücklich als Ziel genannt.
- Nie mergen, force-pushen, Shared History umschreiben oder Branches/Reels löschen, außer ausdrücklich angefordert.
- Keine Regeln, Validatoren, Tests, Finance-Berechnungen oder Lockfiles schwächen, nur damit etwas „grün“ wird.
- Vor Änderungen Git-Status/Branch/HEAD prüfen; danach Safety-Review.

## 3. Einfache Reel-Struktur

Neue Reels verwenden diese einfache Hauptstruktur:

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

- `01-script/` = fertiger Fließtext für das Voiceover
- `02-audio/` = finale Audiodatei des Nutzers
- `03-szenen/` = Cover, alle Bildprompts, Szenen, gemeinsame Nutzerbilder
- `04-caption/` = Social Caption + echte Wort-Timings
- `05-projektdateien/` = Recherche, Quellen, Animationen, Szenenplan, technische Dateien

Keine doppelten Hauptordner für Script, Bilder, Caption, Review, Export oder Video anlegen, wenn sie nicht technisch zwingend erforderlich sind.

### 3.1 Verbindlicher 3-Phasen-Workflow

1. **Phase 1 — normales ChatGPT:** erstellt Recherche, Quellen, geprüftes Skript, Dramaturgie, Szenenplan, Bild-/Remotion-Zuordnung, vollständige Google-Flow-Prompts mit exakten Dateinamen, Remotion-Spezifikationen sowie Master- und Plattform-Captions. In diesen Inhalten bleiben keine Platzhalter.
2. **Phase 2 — Nutzer:** erzeugt Cover und Szenenbilder einzeln mit Google Flow, benennt sie exakt, legt alle gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`, legt genau ein finales Voiceover in `02-audio/` und erzeugt daraus echte Wort-Zeitstempel.
3. **Phase 3 — Antigravity:** beginnt auf den Auftrag `Mach das Reel: <Reel-Pfad>` mit `npm run reel:ready -- <Reel-Pfad>`. Ist die Prüfung erfolgreich, baut, prüft und rendert Antigravity das Reel ohne Rückfragen und ohne Zwischenstopps.

Antigravity stoppt nur bei echten Blockern: fehlende/falsch benannte Nutzerbilder, fehlendes/mehrfaches/unlesbares finales Audio, fehlende oder nicht zum Audio passende Wortzeiten, widersprüchliche Pflichtdaten, Sicherheits-/Faktenkonflikte oder ein nicht selbst lösbarer Validator-/Build-/Renderfehler. Alle Blocker werden gesammelt mit exakten Pfaden gemeldet. Normale Detailentscheidungen trifft Antigravity selbst nach den Repo-Regeln.

Vollständige Übergabe: `docs/3-PHASEN-WORKFLOW.md`.

## 4. Reel-Standard

- 1080 × 1920
- Reel-Video: 9:16
- Google-Flow-Quellbilder: **immer quadratisch 1:1**
- 30 fps
- 60–90 Sekunden als Standard
- Hook innerhalb der ersten 2 Sekunden
- ungefähr 6–10 visuelle Beats
- bei 10 Szenen bevorzugt ungefähr 6 Bildszenen + 4 Remotion-Animationen
- Qualität wichtiger als starre Quote
- keine langen Intros
- Untertitel sind Pflicht
- ausführliche Quellen/Disclaimer gehören in Caption/Beschreibung, nicht vor die Hook

## 5. Skriptregeln

- kurze, verständliche deutsche Sätze
- kein unnötiger Fachjargon
- keine Füllsätze oder Wiederholungen
- klare Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA
- Zahlen nur nach Prüfung
- Beispielannahmen klar als Beispiele behandeln
- keine individuelle Anlageempfehlung
- Problem-Szenen dürfen die spätere Lösung nicht vorwegnehmen

## 6. Verbindliche Bildwelt — Premium Fintech Editorial 3D

Technische World-ID:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Technischer Serien-Lock:

```text
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
```

Der Serien-Lock hält Hintergrundmaterial, Farbrollen, Geometriesprache, Materialfinish, Kontrast und smaragdgrüne Lichtsignatur über den gesamten Bildsatz konstant. Motive dürfen wechseln, die visuelle Welt nicht.

Der verbindliche Stil entspricht diesem Prinzip:

> Eine stilisierte 3D-Person mit klar sichtbarem Gesicht steht neben EINER großen Finanzmetapher. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen; ein Teil der Münzen verschwindet in einem rot-orange leuchtenden Verlust-Riss. Kurze deutsche Labels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Objekte.

Nicht die konkrete Sanduhr ist verbindlich, sondern diese **Art der visuellen Erklärung**.

Verbindliche Bilddokumente:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

### 6.1 Serienmerkmale

- Premium fintech editorial 3D render style
- deep charcoal green-black Grundwelt
- vivid emerald und mint-green Akzente
- Gold nur für Geld, Euro-Münzen und finanziellen Wert
- warmes Rot-Orange nur für Verlust, Risiko, Schulden oder blockiertes Geld
- smooth rounded 3D geometry
- soft bevelled edges
- hochwertige matte und transparente Materialien
- confident high-contrast studio lighting
- kräftiges smaragdgrünes Rim Light
- ein großes dominantes Hauptmotiv / eine starke Finanzmetapher
- wenige unterstützende Elemente
- nicht fotorealistisch
- kein Pixar-, Clay- oder Kindercartoon-Look

### 6.2 Ein einziger nahtloser Hintergrund — höchste Bildregel

**Keine Prozent-Zonen mehr in Bildprompts verwenden.**

Jedes Bild verwendet **einen einzigen durchgehenden Hintergrund von der oberen bis zur unteren Bildkante**.

Verbindliche Promptlogik:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
The background must keep the same continuous material, tone and gradient from the very top edge to the very bottom edge.
NO horizontal divisions.
NO visible top section.
NO visible bottom section.
NO separate zones.
NO dark band at the top.
NO dark band at the bottom.
NO floor-wall boundary.
NO horizon line.
NO studio wall split.
NO panel background.
NO layered backdrop.
Use only one subtle continuous background gradient or vignette across the whole image.
Do not create a visible floor, visible wall or visible studio horizon.
Objects may cast soft contact shadows, but the background itself remains one uninterrupted surface.
Place the main subject around the visual center and leave generous natural empty space above and below WITHOUT changing the background there.
```

Verboten:

- `top 15% / middle 60% / bottom 25%` als harte Bildzonen
- jede andere Prozentaufteilung, die separate Bereiche erzeugen kann
- sichtbare horizontale Tonwertkante
- Boden-/Wand-Trennung
- obere oder untere Farbbänder
- mehrere Hintergrund-Panels

### 6.3 Personenregel

Eine Person ist optional. Wenn eine Person vorkommt:

- stilisierte anonyme erwachsene 3D-Person
- Gesicht **immer klar sichtbar**
- Augen, Nase und Mund als stilisierte Gesichtszüge erkennbar
- bevorzugt frontal oder natürliche 3/4-Ansicht
- natürliche einfache Pose
- keine reale/identifizierbare Person
- kein Fotorealismus

Nicht erlaubt:

- gesichtslose Mannequin-Figur
- blankes/glattes Gesicht
- verstecktes Gesicht
- reine Rückenansicht
- komplett von der Kamera abgewandte Person

### 6.4 Textregel im generierten Bild

**NIEMALS:**

- große Überschrift
- Untertitel
- ganzer erklärender Satz
- CTA
- Absatz
- große Poster-Typografie

**ERLAUBT UND GEWÜNSCHT:**

- nur kurze deutsche Objekt-Beschriftungen
- normalerweise 1–3 Wörter
- direkt am oder nahe beim zugehörigen Objekt
- klein bis mittelgroß
- klare Sans-Serif-Schrift
- wenige Labels pro Bild

Beispiele:

```text
Wartezeit
Verlorene Zinsen
Notgroschen
Reparatur
Dispo
Ratenzahlung
Tagesgeld
Notfall
Konsum
500 €
Auffüllen
```

Keine zufälligen Zusatztexte, Fantasiewörter oder englischen Erklärtexte.

### 6.5 Marken und bekannte Namen

Reale bekannte Marken, Dienste oder Produktnamen dürfen in einer Bildszene verwendet werden, **wenn sie für die Aussage konkret relevant sind**.

Beispiele: Netflix, Spotify, Disney+, Amazon, Apple.

Regeln:

- Marken nicht zufällig als Deko verwenden
- keine erfundene Partnerschaft oder Empfehlung suggerieren
- Namen/Labels korrekt schreiben
- nur so viele Marken wie für die Erklärung nötig
- Markenbeispiel bleibt eine illustrative Alltagssituation, keine Werbeaussage

### 6.6 Bildlogik

Jede Bildszene verwendet möglichst:

1. eine dominante Finanzmetapher oder ein großes Hauptobjekt
2. optional eine stilisierte Person mit sichtbarem Gesicht
3. wenige unterstützende Objekte
4. klaren Ursache-Wirkungs-Zusammenhang
5. 1–3 kurze deutsche Labels

Das Bild soll wie **eine einzelne hochwertige Editorial-Illustration** wirken, nicht wie:

- Miniatur-Diorama
- Game-Level
- Neon-Tunnel
- Sci-Fi-Korridor
- Dashboard/App-UI
- mehrere kleine Räume/Plattformen
- überladene Icon-Sammlung

### 6.7 Prompt-Grundmuster

```text
A stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe one visible cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Premium fintech editorial 3D render style.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands, no top/bottom sections, no floor-wall boundary, no horizon line, no panels.
Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Use smooth rounded 3D geometry, soft bevelled edges and confident high-contrast studio lighting with bold emerald rim light.
Place the main subject around the visual center and leave generous natural empty space above and below without changing the background.
Square 1:1 source image. Width and height must be equal. No portrait or vertical format.
No photorealism, no real identifiable human, no faceless character, no UI dashboard, no headline, no subtitle, no explanatory sentence.
```

## 7. Bildproduktion — Nutzer + Google Flow

- **Antigravity erzeugt keine Bilder.**
- Der Nutzer erzeugt Cover und Szenenbilder selbst mit Google Flow.
- Antigravity/der Agent erstellt nur Bildprompts, Dateinamen, Szenenplanung und spätere technische Verarbeitung.
- Jedes erzeugte Cover- und Szenenbild ist immer quadratisch `1:1`; erst Remotion setzt es mit `contain` in das vertikale `9:16`-Reel.

Google Flow arbeitet pro Bild strikt:

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG AUF DIE ERZEUGUNG WARTEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Verbindliches Agent-Protokoll:

```text
FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
```

- einzige Übergabedatei an den Google-Flow-KI-Agenten: `03-szenen/alle-bildprompts.txt`
- niemals mehrere Bilder parallel oder als Batch erzeugen
- niemals das nächste Bild vorbereiten, bevor das aktuelle exakt umbenannt und geprüft ist
- fehlerhaftes Bild unter derselben Bildnummer neu erzeugen und ersetzen
- Animationsnummern ohne Bilderzeugung überspringen
- Same-World-Lock bei jedem einzelnen Bild anwenden
- das zuerst bestandene `Bild 00` als reine visuelle Stilreferenz für alle Folgebilder verwenden; Stil/Licht/Materialien übernehmen, niemals Cover-Motiv, Komposition oder Labels kopieren

### Nummerierung

- Cover = `Bild 00`
- Szene 01 = `Bild 01`
- Szene 02 = `Bild 02`
- usw.
- **Bildnummer = echte Szenennummer**, niemals Anzahl erzeugter Bilder
- Remotion-Animation = kein Bild, Nummer bleibt reserviert

Beispiel:

```text
Szene 01 = Bild      → Bild 01
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03
```

Direkt bei **jedem einzelnen Bildprompt** steht der endgültige Dateiname.

Erst wenn alle Bilder fertig, korrekt benannt und geprüft sind, kommen sie gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Google Flow verteilt sie nicht auf einzelne Szenenordner.

## 8. Bilddarstellung in Remotion

- Bilder mit `object-fit: contain`
- keine sichtbare unscharfe Kopie desselben Bildes als Hintergrund
- Source-Crop oben höchstens `0.20`
- Source-Crop unten höchstens `0.20`
- Source-Crop insgesamt höchstens `0.34`
- zusätzliche Skalierung höchstens `1.04`
- Motive, Geld und Labels nie abschneiden

## 9. Überschriften und Karaoke-Untertitel

### Remotion-Überschriften

- werden in Remotion gerendert, nicht als große KI-Bildheadline
- oben
- erste Zeile weiß
- Schwerpunktzeile grün oder bei Geldwerten gold
- passendes Linien-Icon

### Karaoke-Untertitel

- genau ein vollständiger Satz gleichzeitig
- aktuelles gesprochenes Wort FinanzNeo-grün
- restliche Wörter weiß
- maximal zwei ausgewogene Zeilen
- keine springenden Wörter
- keine Größenanimation
- keine Wort-für-Wort-Einblendung
- vorheriger Satz bleibt während kurzer Pausen sichtbar
- keine Caption-Lücken

Safe Area bei 1080 × 1920:

```text
Headline ungefähr ab Y = 78
Visual ungefähr Y = 270–1350
Untertitel 320 px über dem unteren Rand
links 62 px
rechts 150 px
```

## 10. Timing

Szenenschnitte folgen dem finalen Audio:

```text
finales Voiceover
→ echte Wort-Zeitstempel
→ Satzanfänge
→ Szenenstarts
→ relative Animationsdauern
```

Keine pauschal gleich langen Szenen als Standard.

## 11. Audio

Ziel im finalen Export:

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

- finale Werte am gerenderten MP4 messen
- keine Ersatz-Audiodatei erzeugen, wenn finales Voiceover fehlt
- nach Audioänderungen Wortzeiten/Timeline neu prüfen

## 12. Technisches Designsystem

- neue produktive Remotion-Dateien importieren aus `src/design-system`
- `src/bausteine` nur als bestehende Kompatibilitätsschicht
- Farben/Safe Areas aus `src/brand/tokens.ts`
- Fonts aus `src/brand/fonts.ts`
- Finanzrechner aus `src/finance/calculations.ts`
- keine frei erfundenen Finanzwerte direkt im JSX

## 13. Finanzdaten und Faktenprüfung

- keine erfundenen Zahlen
- jede Rechnung reproduzierbar
- Annahmen nennen
- aktuelle Fakten zuerst recherchieren
- historische Daten mit Quelle und Stand
- Beispielrechnungen als Beispiel kennzeichnen
- Rendite nie als sicher darstellen
- Geldbeträge standardmäßig Euro

## 14. Produktionsablauf

1. Thema auswählen
2. bestehende Reels prüfen, damit Thema nicht unnötig doppelt ist
3. Fakten und Quellen recherchieren
4. Skript schreiben
5. Zahlen/Aussagen prüfen
6. visuelle Beats planen
7. Bild / Remotion / Kombination festlegen
8. finales Voiceover ablegen
9. echte Wort-Zeitstempel erzeugen
10. Szenenstarts aus Satzanfängen ableiten
11. `03-szenen/bildwelt.txt` nach der **seamless-background-Regel** erstellen
12. für jede Bildszene konkreten Premium-Fintech-Editorial-3D-Prompt erstellen
13. Dateiname + erlaubte Labels direkt am Prompt festlegen
14. Nutzer erzeugt jedes Bild einzeln und benennt es sofort um
15. Animationsszenen überspringen; Nummern bleiben reserviert
16. alle fertigen Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
17. Bild-QA: Metapher, Labels, Gesicht, **ein Hintergrund ohne Bänder**
18. Remotion-Animationen bauen
19. Überschriften/Karaoke-Captions einbinden
20. Asset-Sync, Validatoren, Typecheck
21. Preview rendern
22. Kontaktbogen/Frames prüfen
23. komplette MP4 mit Ton ansehen
24. Audio-Lautheit messen
25. Caption/Quellen/CTA finalisieren
26. erst nach menschlicher Sichtprüfung freigeben

## 15. Bild-QA — sofort neu erzeugen, wenn

- sichtbarer zweiter Hintergrund / oberes oder unteres Band
- horizontale Trennlinie oder Tonwertkante
- sichtbare Boden-/Wand-Grenze oder Studio-Horizont
- Hintergrund nicht von oben bis unten nahtlos wirkt
- Bild wie Diorama/Game-Level wirkt
- Metapher nicht sofort verständlich ist
- zu viele kleine Objekte vorkommen
- große Headline/Untertitel/ganzer Satz im Bild steht
- Labels falsch oder zusätzlich sind
- Person ohne klar sichtbares Gesicht vorkommt
- reine Rückenansicht verwendet wird
- Stil fotorealistisch/Pixar/Clay ist
- Bildaussage nicht zum gesprochenen Satz passt

## 16. Abschlussdefinition

Ein Reel ist erst fertig, wenn:

- erforderliche Nutzerbilder vorhanden oder exakt als fehlend gemeldet sind
- finales Audio vorhanden ist
- echte audio-basierte Wortzeiten vorliegen
- Validator/Typecheck/Preview tatsächlich ausgeführt und erfolgreich sind
- Bildsatz visuell geprüft wurde
- komplette MP4 geprüft wurde
- Audioziel geprüft wurde

Technischer Erfolg allein ist keine kreative Freigabe.

## 17. Aktive Prioritäten

1. Premium-Fintech-Editorial-3D-Bildwelt mit **einem nahtlosen Hintergrund** konsequent halten
2. einfache Reel-Ordnerstruktur beibehalten
3. Caption-, Safe-Area- und Satzschnittsystem stabil halten
4. produktive Reels, Experimente und Showcases trennen
5. Finanzberechnungen zentral und reproduzierbar halten
6. Typecheck, Tests und Render-Smoke-Tests ausbauen
7. erst danach größere Serienproduktion skalieren
