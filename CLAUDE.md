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

Die Abschnitte 3 bis 17 definieren den Reel-Prozess. Der davon getrennte YouTube-Longform-Prozess steht in Abschnitt 18.

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
- Ziel ungefähr 60 % Bildbeats / 40 % native Remotion-Animationen; Qualität und Verständlichkeit haben Vorrang vor starrer Quote
- Bildbeat ideal 3,5–5,5 Sekunden, absolut maximal 6 Sekunden
- braucht eine Bildidee mehr als 6 Sekunden: **splitten oder animieren**
- keine langen Intros
- Untertitel sind Pflicht
- **jede einzelne Szene braucht oben eine Zwischenüberschrift + passendes Icon**
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

## 6. Verbindliche Bildwelt — Stylized 3D Editorial Explainer

Technische World-ID:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Technischer Serien-Lock:

```text
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
```

Verbindlicher Stylized-3D-Lock:

```text
STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5
```

Der Serien-Lock hält Hintergrundmaterial, Farbrollen, Geometriesprache, Materialfinish, Kontrast und smaragdgrüne Lichtsignatur über den gesamten Bildsatz konstant. Motive dürfen wechseln, die visuelle Welt nicht.

Die Bildwelt muss **klar als hochwertige stylized 3D-CGI-Illustration** erkennbar sein. Erkennbare Alltagsgegenstände bleiben direkt verständlich, werden aber als chunky, volumetrische 3D-Objekte mit abgerundeten Formen, weichen Bevels, klarer Tiefenstaffelung und Premium-Materialien modelliert. Dünne fotorealistische Büro-/Papier-Stillleben sind ausdrücklich unerwünscht.

Eine stilisierte Person ist optional. Wenn sie vorkommt, bleibt ihr Gesicht klar sichtbar. Hauptziel ist immer eine sofort verständliche visuelle Erklärung durch große erkennbare 3D-Alltagsobjekte und eine eindeutige Ursache-Wirkungs-Beziehung.

Verbindliche Bilddokumente:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

### 6.1 Serienmerkmale

- premium stylized 3D CGI financial editorial explainer
- deep charcoal green-black Grundwelt
- vivid emerald und mint-green Akzente
- Gold nur für Geld, Euro-Münzen und finanziellen Wert
- warmes Rot-Orange nur für Verlust, Risiko, Schulden, Warnung oder unnötige Kosten
- chunky substantial 3D geometry
- smooth rounded forms und soft bevelled edges
- vereinfachte, leicht überzeichnete Proportionen statt Fotorealismus
- hochwertige Emerald-Polymer-, Metall-, Cream-Card- und Glasmaterialien
- klare Vordergrund-/Mittelgrund-/Hintergrundtiefe
- cinematic soft key light + kräftiges smaragdgrünes Rim Light
- ein großes dominantes Hauptmotiv / eine klare Alltagsmetapher
- wenige unterstützende Elemente
- **kein fotorealistisches Papier-/Büro-/Stockfoto-Stillleben**
- kein Pixar-, Clay-, Toy- oder Kindercartoon-Look

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

1. eine dominante, sofort verständliche Alltagsmetapher oder ein großes Hauptobjekt
2. optional eine stilisierte Person mit sichtbarem Gesicht
3. 2–5 unterstützende erkennbare Alltagsobjekte
4. klaren Ursache-Wirkungs-Zusammenhang
5. 1–3 kurze deutsche Labels
6. sichtbare 3D-Tiefe, Überlappung und aktive Objektbeziehung statt sterilem Stillleben

Das Bild soll wie **eine einzelne hochwertige stylized 3D Editorial-Illustration** wirken, nicht wie:

- Miniatur-Diorama
- Game-Level
- Neon-Tunnel
- Sci-Fi-Korridor
- Dashboard/App-UI
- mehrere kleine Räume/Plattformen
- überladene Icon-Sammlung
- realistisches Büro-/Papierfoto
- sterile Produktwerbung

### 6.7 Prompt-Grundmuster

```text
Create a CLEARLY STYLIZED premium 3D CGI financial editorial explainer using recognizable everyday objects.
Show [ONE LARGE EVERYDAY FINANCIAL METAPHOR] with chunky substantial geometry, smooth rounded forms, soft bevels and simplified slightly exaggerated proportions.
[Describe one visible cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Use premium dark-emerald polymer/brushed metal, warm cream card surfaces, chunky gold value details and restrained glass.
Use cinematic soft key light, controlled emerald rim light, strong contact shadows, clear foreground/midground/background depth and mild depth-of-field.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
Square 1:1 source image. Width and height must be equal.
NO photorealistic office/stationery/product photography. NO dashboard/UI/gameboard. NO headline, subtitle or explanatory sentence.
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
- Same-World-Lock und Stylized-3D-Lock bei jedem einzelnen Bild vollständig ausschreiben
- **keine Bild-zu-Bild-Referenz verwenden**: `Bild 00` oder andere Szenenbilder niemals als Referenzbild hochladen/anhängen
- Einheitlichkeit entsteht ausschließlich durch denselben ausgeschriebenen Stil-/Material-/Farb-/Licht-Lock in jedem Prompt

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

## 9. Zwischenüberschriften, Animationsfarben und Karaoke-Untertitel

Verbindliche Detailquelle: `docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md`.

### Remotion-Zwischenüberschrift — Pflicht in JEDER Szene

Jede Bild- **und** Animationsszene zeigt oben eine klare Zwischenüberschrift mit passendem Linien-Icon.

Standardkomponente:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

Regeln:

- Position ungefähr ab Y = 78
- Icon links, Headline rechts
- Standard-Iconfarbe FinanzNeo-grün
- Headline immer weiß
- gleiche Position und Grundgestaltung im ganzen Reel
- kurze direkte Zwischenüberschrift, kein langer Satz
- Rot nur bei echter Warnung/Problem
- Gold nur bei Geld/Wert, nicht als allgemeine Textfarbe

### Animationsfarben auf dunklem Hintergrund

Verbindlich `ANIMATION_COLORS` aus `src/brand/tokens.ts`:

- Weiß = neutrale Information
- Grün = Fokus, Lösung, zentrale Erklärung
- Rot = Warnung, Problem, unnötige Kosten, Verlust
- Gold = Geldbetrag, Summe, Wert
- **Schwarz = auf dunklen Reel-Flächen verboten**

`C.ink` ist ausschließlich für dunklen Text auf tatsächlich hellen Flächen erlaubt.

### Verständliche Animationen

Jede native Remotion-Erkläranimation braucht zwingend:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
```

- Bewegung muss die Aussage erklären, nicht nur dekorieren
- reine Zooms/Fades/Zahlen-Popups gelten nicht als ausreichende Erkläranimation
- Start und Ergebnis müssen visuell beschriftet/erkennbar sein
- bei komplexeren Mechanismen `MechanismCue` verwenden
- Animation muss grundsätzlich auch ohne Ton verständlich sein

### Karaoke-Untertitel

Standardkomponente: `src/brand/components/Captions.tsx`.

- genau eine satzbasierte Caption-Einheit gleichzeitig
- aktuelles gesprochenes Wort **immer FinanzNeo-grün**
- restliche Wörter **immer weiß**
- **kein gelbes/goldenes Active-Word**
- **kein schwarzer Untertiteltext**
- maximal zwei ausgewogene Zeilen
- keine springenden Wörter
- keine Größenanimation / kein Scale-Pop
- vorherige Caption bleibt während kurzer Pausen sichtbar
- keine Caption-Lücken
- mobiler Shadow/Stroke bzw. subtiler dunkler Caption-Hintergrund erlaubt

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
→ Satz- und sinnvolle Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauern
```

- keine pauschal gleich langen Szenen als Standard
- Bildbeat ideal 3,5–5,5 Sekunden
- Bildbeat absolut maximal 6,0 Sekunden
- Animationsbeat ideal 4,5–7 Sekunden
- wenn ein Bild länger als 6 Sekunden stehen müsste: splitten oder als Animation lösen

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
- jede Szene nutzt `SceneHeader` oder eine ausdrücklich gleichwertige Design-System-Komponente
- Captions nutzen die zentrale `Captions`-Komponente; Active-Word-Farbe nicht lokal überschreiben
- Animationen nutzen `ANIMATION_COLORS`; schwarzer Text auf dunklem Hintergrund ist verboten
- `MechanismCue` steht für klare Start-/Ergebnis-Markierungen in komplexen Animationen bereit

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
6. visuelle Beats planen; 60/40 als Ziel, aber nie ein Bild künstlich länger als 6 Sekunden halten
7. Bild / Remotion / Kombination festlegen
8. für **jede** Szene eine kurze Zwischenüberschrift + passendes Icon festlegen
9. finales Voiceover ablegen
10. echte Wort-Zeitstempel erzeugen
11. Szenenstarts aus Satz-/sinnvollen Phrasenanfängen ableiten
12. `03-szenen/bildwelt.txt` nach Seamless-Background- und Stylized-3D-Regel erstellen
13. für jede Bildszene vollständigen Stylized-3D-Prompt erstellen
14. Dateiname + erlaubte Labels direkt am Prompt festlegen
15. Nutzer erzeugt jedes Bild einzeln und benennt es sofort um
16. Animationsszenen überspringen; Nummern bleiben reserviert
17. alle fertigen Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
18. Bild-QA: Alltagsklarheit, Stylized-3D-Look, Labels, Gesicht, ein Hintergrund ohne Bänder
19. Remotion-Animationen als Start → Mechanismus → Ergebnis bauen
20. `SceneHeader` + Icon in jede Szene einbinden
21. Karaoke-Captions einbinden: Active grün, Rest weiß
22. Animationsfarben prüfen: kein Schwarz auf dunkler Fläche
23. Asset-Sync, Validatoren, Typecheck
24. Preview rendern
25. Kontaktbogen/Frames prüfen
26. komplette MP4 mit Ton ansehen
27. Animationen zusätzlich ohne Ton auf Verständlichkeit prüfen
28. Audio-Lautheit messen
29. Caption/Quellen/CTA finalisieren
30. erst nach menschlicher Sichtprüfung freigeben

## 15. Bild-/Reel-QA — sofort korrigieren, wenn

- sichtbarer zweiter Hintergrund / oberes oder unteres Band
- horizontale Trennlinie oder Tonwertkante
- sichtbare Boden-/Wand-Grenze oder Studio-Horizont
- Hintergrund nicht von oben bis unten nahtlos wirkt
- Bild wie Diorama/Game-Level wirkt
- Metapher nicht sofort verständlich ist
- zu viele kleine Objekte vorkommen
- große Headline/Untertitel/ganzer Satz im KI-Bild steht
- Labels falsch oder zusätzlich sind
- Person ohne klar sichtbares Gesicht vorkommt
- reine Rückenansicht verwendet wird
- Stil fotorealistisch/Pixar/Clay/Toy ist
- Bildaussage nicht zum gesprochenen Satz passt
- irgendein Bildbeat länger als 6 Sekunden stehen müsste
- eine Szene keine Zwischenüberschrift oder kein passendes Icon hat
- Untertitel-Active-Word gelb/gold statt grün ist
- schwarzer Text auf dunklem Reel-Hintergrund vorkommt
- eine Animation keinen klaren Start, Mechanismus und Ergebnis besitzt
- eine Animation ohne Ton nicht grundlegend nachvollziehbar ist

## 16. Abschlussdefinition

Ein Reel ist erst fertig, wenn:

- erforderliche Nutzerbilder vorhanden oder exakt als fehlend gemeldet sind
- finales Audio vorhanden ist
- echte audio-basierte Wortzeiten vorliegen
- Validator/Typecheck/Preview tatsächlich ausgeführt und erfolgreich sind
- Bildsatz visuell geprüft wurde
- komplette MP4 geprüft wurde
- Untertitel-Farben und mobile Lesbarkeit geprüft wurden
- jede Szene Headline + Icon besitzt
- Animationsfarben und Animationsverständlichkeit geprüft wurden
- Audioziel geprüft wurde

Technischer Erfolg allein ist keine kreative Freigabe.

## 17. Aktive Prioritäten

1. Stylized-3D-Editorial-Bildwelt mit **einem nahtlosen Hintergrund** konsequent halten
2. Caption-System: aktives Wort grün, Rest weiß, stabil und mobil lesbar
3. jede Szene mit klarer Zwischenüberschrift + Icon strukturieren
4. Animationen als verständliche Ursache-Wirkungs-Mechanismen bauen; kein Schwarz auf dunklem Hintergrund
5. einfache Reel-Ordnerstruktur beibehalten
6. produktive Reels, Experimente und Showcases trennen
7. Finanzberechnungen zentral und reproduzierbar halten
8. Typecheck, Tests und Render-Smoke-Tests ausbauen
9. erst danach größere Serienproduktion skalieren

## 18. Eigenständiger YouTube-Longform-Workflow

YouTube-Projekte liegen ausschließlich unter `youtube/`. Sie sind keine verlängerten Reels und erzeugen keine YouTube Shorts.

Verbindliche Quellen:

- `youtube/PRODUKTIONSSTANDARD.md`
- `docs/YOUTUBE-LONGFORM-WORKFLOW.md`

Projektstruktur:

```text
01-recherche/
02-script/
03-audio/
04-visuals/
05-publishing/
06-projektdateien/
README.md
```

Format und Bilder:

- fertiges Video: 1920 × 1080, horizontal 16:9, 30 fps
- YouTube-Quellbilder und Thumbnail: horizontal 16:9
- Reel-Quellbilder bleiben davon unabhängig immer 1:1
- dieselbe FinanzNeo World ID und derselbe Serien-Lock wie bei Reels
- Bildprompts immer auf Englisch; nur kurze ausdrücklich gewünschte Objektlabels im Bild auf Deutsch
- Nutzer erzeugt alle Bilder selbst mit Google Flow
- Thumbnail zuerst; danach reine Stilreferenz für alle Folgebilder
- genau ein Bild erzeugen, vollständig warten, sofort exakt umbenennen, prüfen, erst dann fortfahren
- alle fertigen Bilder gemeinsam in `04-visuals/00-ALLE-BILDER-HIER-REIN/`

Drei Phasen:

1. ChatGPT erstellt Recherche, Quellen, vollständiges Skript, Kapitel-/Retention-Plan, Visual-Zuordnung, englische Flow-Prompts, Remotion-Spezifikationen, Thumbnail-Brief und das gesamte Publishing-Paket ohne Platzhalter.
2. Nutzer erstellt und benennt die Bilder sequenziell, legt genau ein finales Voiceover ab und erzeugt echte Wort-Zeitstempel daraus.
3. Antigravity beginnt mit `npm run youtube:ready -- youtube/<Projekt>` und baut bei Erfolg ohne Rückfragen bis zu Render und QA.

`05-publishing/` enthält Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords/Tags, Hashtags, Thumbnail-Brief, Quellen/Disclaimer, angehefteten Kommentar, Community-Post, Upload-Checkliste sowie Promo-Texte für Instagram, TikTok, Facebook und Snapchat.

Die Videolänge folgt der nötigen inhaltlichen Tiefe. Keine künstliche Mindestlänge und keine Füllpassagen. Antigravity stoppt nur bei denselben Arten echter Pflichtasset-, Fakten-, Sicherheits- oder Technikblocker wie im Reel-Prozess und meldet sie gesammelt mit exakten Pfaden.