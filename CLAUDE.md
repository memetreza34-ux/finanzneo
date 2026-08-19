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

## 4. Reel-Standard

- 1080 × 1920
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

Der verbindliche Stil entspricht diesem Prinzip:

> EINE große Finanzmetapher steht im Mittelpunkt und erklärt die Aussage. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen; ein Teil der Münzen verschwindet in einem rot-orange leuchtenden Verlust-Riss. Darüber im oberen Drittel eine kurze eingebrannte Headline mit Subline. Kurze deutsche Labels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Objekte. Eine Person ist möglich, aber nicht der Normalfall.

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
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
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

**Standard ist ohne Person** — Objekte und Metaphern tragen die Erklärung. Eine einzelne stilisierte Hand, die mit einem Objekt interagiert, gilt nicht als Person und ist erlaubt.

Nur wenn eine Person die Erklärung wirklich verbessert:

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

Cover und Szenenbild folgen unterschiedlichen Textregeln.

**Cover (`Bild 00`) — Text ist Pflicht:**

- genau **eine Headline**: kurz, fett, 3–7 Wörter, helle/weiße Schrift
- genau **eine Subline** direkt darunter: ein kurzer Satz, leichter, gedämpfte helle Farbe
- die Headline sagt direkt, worum es im Reel geht — in einer Sekunde erfassbar, keine vage Andeutung
- Position: oberes Sicherheitsdrittel, damit sie nicht mit dem Remotion-Untertitel kollidiert (`SAFE_AREA.topRatio` / `bottomRatio` in `src/brand/tokens.ts`)

**Szenenbilder (`Bild 01` und folgende) — kein Satz im Bild:**

- keine Headline, keine Subline, kein ganzer Satz, kein CTA, kein Absatz
- erlaubt sind ausschließlich kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- Labels stehen klein, klar lesbar und direkt neben dem Objekt, das sie benennen — nie darüber
- die Aussage der Szene kommt aus dem Voiceover und den Remotion-Untertiteln; ein Satz im Bild würde mit beidem konkurrieren

**Nicht erlaubt:**

- Satz oder Headline in einem Szenenbild
- mehr als eine Headline oder Subline im Cover
- Text im unteren Bilddrittel (kollidiert mit dem Remotion-Untertitel)
- CTA-Text im Bild
- erfundene Wörter, Zahlen oder Datumsangaben, die nicht ausdrücklich verlangt wurden
- englische Erklärtexte anstelle der deutschen Labels

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

Für **Szenenbilder** (kein Satz im Bild):

```text
GESPROCHENER SATZ DIESER SZENE:
[Der Voiceover-Satz — das Bild muss ihn vollständig erzählen.]

HERO — [welcher Satzteil]:
[ONE LARGE FINANCIAL METAPHOR], described with believable material detail, large and slightly angled in the center.

[ZWEITER BLOCK] — [welcher Satzteil]:
[Supporting object that carries this part of the sentence, with its visible cause-and-effect.]

[DRITTER BLOCK] — [welcher Satzteil]:
[Supporting object that carries this part of the sentence.]

Everything is grouped tightly around the hero as one connected still life. Every object serves the same sentence.

TEXT RULE – SEHR WICHTIG:
No headline. No subtitle. No sentence. No paragraph. No CTA. No title text of any kind anywhere in the image.
The ONLY text allowed are the short German object labels listed below, placed small, clearly legible, in a clean sans-serif, directly next to the object they describe and never overlapping it.

BESCHRIFTUNGEN – EXAKT DIESE, SONST KEIN TEXT:
- '[Label 1]' [wo genau im Bild]
- '[Label 2]' [wo genau im Bild]

Premium fintech editorial 3D render style with rich material detail. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Objects are believable and detailed in construction, but the image stays a premium 3D illustration and never a photograph.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge. No bands, no floor-wall boundary, no horizon line, no room, no table, no panels. Objects cast soft contact shadows directly onto the background. Fill the usable frame generously so it never looks empty.
Default is objects and metaphors only, no person. A single stylized hand is allowed.
Vertical 9:16.
No photorealism, no UI dashboard, no isometric diorama, no neon tunnel, no Pixar, no clay, no cartoon simplification.
```

Für das **Cover** gilt dasselbe Muster, zusätzlich mit eingebrannter Headline und Subline im oberen Drittel.

## 7. Bildproduktion — Nutzer + Google Flow

- **Antigravity erzeugt keine Bilder.**
- Der Nutzer erzeugt Cover und Szenenbilder selbst mit Google Flow.
- Antigravity/der Agent erstellt nur Bildprompts, Dateinamen, Szenenplanung und spätere technische Verarbeitung.

Google Flow arbeitet pro Bild strikt:

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

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