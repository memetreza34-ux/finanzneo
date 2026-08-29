# FinanzNeo — verbindliches Projekt-Gehirn

> Höchste interne Quelle für Reel-Produktion. Bei Widersprüchen mit älteren Dateien gilt immer diese Datei.

## 1. Kanal und Format

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Ziel: Finanzgrundlagen einfach, professionell und verständlich erklären
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat
- YouTube: ausschließlich Longform unter `youtube/`; **keine YouTube Shorts**
- Reel: 1080 × 1920, 9:16, 30 fps, typischerweise 60–90 Sekunden

## 2. Repository-Sicherheit

- nie direkt auf `main` arbeiten
- neuer Auftrag = eigener Branch
- bestehende Reels nur ändern, wenn ausdrücklich Ziel des Auftrags
- kein Merge, Force-Push, History-Rewrite oder Branch-/Reel-Löschen ohne ausdrückliche Freigabe
- Validatoren, Tests und Gates nie abschwächen, nur damit etwas grün wird
- technischer Erfolg darf niemals mit Platzhaltern oder visueller Minderqualität erkauft werden

## 3. Drei Phasen — harte Verantwortungsgrenze

### Phase 1 — ChatGPT

Phase 1 liefert vollständig:

- Recherche + Quellen
- geprüftes Voiceover-Skript
- Dramaturgie und Szenenplan
- Bild-/Animations-Zuordnung
- Google-Flow-Prompts
- natürliche Szenenüberschriften + passende Icons
- Remotion-Spezifikationen
- **produktionsreife `animation.tsx` für jede Animationsszene**
- Master-/Plattform-Captions

Phase 1 ist erst fertig, wenn keine Platzhalter mehr vorkommen und Phase 3 keine kreative Animation mehr erfinden muss.

### Phase 2 — Nutzer

- erzeugt die Szenenbilder mit Google Flow; **scene-01 ist automatisch das Cover**, kein separater Cover-Bildjob und kein Bild 00
- legt alle finalen Bilder exakt benannt in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
- legt genau ein finales Voiceover in `02-audio/`
- erzeugt echte Wort-Zeitstempel

### Phase 3 — Antigravity oder Claude Code

`scene-index.json -> phase3Executor` bestimmt den Executor.

Phase 3 darf ausschließlich:

- finale Nutzerbilder integrieren
- den **versiegelten Phase-1-Animationscode** verwenden
- Timeline, Header und Captions integrieren
- Preflight, Candidate-Render, Render-QA und Export ausführen

Phase 3 darf Animationen **nicht kreativ ersetzen, vereinfachen oder neu erfinden**.

## 4. Reel-Struktur

**Cover-Regel:** `scene-01` ist immer eine Bildszene und automatisch das Cover. Es wird kein separates Cover und kein `Bild 00` erzeugt. `03-szenen/00-cover/cover.txt` ist nur ein technischer Alias/Vertrag auf das Bild von `scene-01`.

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Animationsszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Bildszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
└── bildprompt.txt
```

## 5. Dramaturgie und Beat-Regeln

- Hook in den ersten 2 Sekunden
- ca. 14–16 Visual-Beats als Ziel, Qualität vor Quote
- ungefähr 60 % Bild / 40 % Animation als Richtwert, keine starre Quote
- nie mehr als zwei Bildszenen direkt hintereinander
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animation ideal 4,5–7 s
- kurze klare Sätze, kein unnötiger Fachjargon
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA
- Zahlen nur nach Prüfung; Beispielannahmen klar kennzeichnen

## 6. Bildwelt — Stylized 3D Animated Black V9

Verbindlich:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
```

### Kernziel

Die Bilder sind **visuelle Erklärszenen**, keine Dekoration und keine Sammlung hübscher Finanzsymbole.

- Inhalt und Situation **realitätsnah aus dem Alltag gedacht**
- Rendering klar **stylized 3D**, niemals fotorealistisch
- reale Gegenstände behalten glaubwürdige Proportionen, Konstruktion und erkennbare Details
- semi-realistische Objektstruktur und Materialwirkung, aber sichtbar stilisierte Darstellung
- hochwertig, sauber und professionell; nicht wie Spielzeug oder Icon-Pack
- der gesprochene Punkt muss im Bild direkt verständlich werden
- gleiche Welt über das gesamte Reel

### Erklärlogik — Pflicht

Jedes Bild beantwortet visuell:

```text
Was passiert?
→ Was ist betroffen?
→ Was löst oder verändert es?
```

- konkrete reale Situation zuerst
- Ursache und Wirkung möglichst im selben Frame sichtbar
- vollständige, zusammenhängende Szene statt isolierter Einzelobjekte
- vertraute reale Gegenstände verwenden, wenn sie passen: z. B. Waschmaschine, Rechnung, Konto-Unterlagen, Kalender, Smartphone, Einkaufsbeutel, Haushaltskosten
- Zuschauer soll die Aussage in ca. 1–2 Sekunden auch ohne Ton verstehen
- Zuschauer darf keine Metapher entschlüsseln müssen
- Schild, Pfeil, Münzen, Tresor usw. dürfen nur unterstützen; sie dürfen die reale Situation nie ersetzen

### Hintergrund

Jedes Flow-Bild nutzt einen **nahtlosen deep-black Hintergrund**.

Ein kleiner realitätsnaher Szenenkontext ist erlaubt, wenn er die Erklärung besser macht, z. B. ein Ausschnitt aus Waschecke, Küche, Schreibtisch oder Bankumgebung. Dieser Kontext muss optisch in die schwarze Welt übergehen und darf nicht vom Inhalt ablenken.

Verboten:

- helle Studiowelt
- störende farbige Hintergrundzonen
- dekorative Partikel-/Glow-Welt
- Hintergrund, der wichtiger wirkt als die Erklärung

### Komposition

Es gibt **keine feste Objektanzahl**.

- eine vollständige Hauptsituation oder Hauptaktion
- so viele reale Kontextobjekte wie nötig, so wenige wie möglich
- Support-Objekte nur, wenn sie erklären
- keine Props zum Auffüllen
- wichtige Gegenstände groß und sofort erkennbar
- keine winzige Miniaturdarstellung, in der Rechnung, Label oder Handlung nicht lesbar sind
- kein generisches Finance-Icon-Arrangement als Haupterklärung

### Deutsche Labels

Kurze deutsche Objektlabels sind **ausdrücklich erlaubt und erwünscht**, wenn sie Mehrdeutigkeit verhindern.

Beispiele:

- `Notgroschen`
- `Girokonto`
- `Tagesgeld`
- `Reparatur 280 €`
- `Dispo`
- `Dauerauftrag`
- `Urlaub`
- `Shopping`

Regeln:

- Label direkt am passenden Objekt oder Zustand
- kurz und gut lesbar
- keine Headline
- kein Untertitel
- kein CTA
- kein langer erklärender Satz

### Marken und Logos

Wenn inhaltlich nötig:

- Kernidentität erkennbar, aber in derselben stylized-3D-Welt neu interpretiert
- keine flach aufgeklebten echten Logos
- keine Website-/App-Screenshots
- keine fotorealistischen Markenprodukte

### Farbrollen

- Emerald Green = positiv / bevorzugt
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

### Prompt-Qualität — Pflicht

Jeder konkrete Bildprompt wird **individuell und vollständig für exakt den Sprechpunkt geschrieben**.

Verboten:

- nur Stichwörter
- ein kurzer Ein-Satz-Prompt
- generische Prompt-Vorlage als fertige Lieferung
- „Tresor + Schild + Münzen“ als Ersatz für die eigentliche Situation
- Google Flow die Bedeutung selbst interpretieren lassen

Reihenfolge jedes fertigen Prompts:

```text
konkrete reale Situation + sichtbare Ursache/Wirkung
→ exakte kurze deutsche Labels, wenn hilfreich
→ Style
→ Background
→ Composition
→ Brands/Logos falls relevant
→ Colors/Light
→ Text
→ Forbidden
```

Einzelprompts bleiben **mittel-lang**, aber vollständig genug, dass Situation, Gegenstände, Beziehung und Aussage eindeutig festgelegt sind.

### Streng verboten

- Fotorealismus / Stockfoto-Look
- generische Finance-Icon-Komposition als Haupterklärung
- nur Tresor + Schild + Münzen + Pfeil ohne reale Situation
- abstraktes Symbolrätsel, das Interpretation verlangt
- Produktfoto-Look ohne Erklärsituation
- Dashboard / App UI als Hauptkomposition
- Flowchart als Hauptkomposition
- kleine Kästen / Floating-Info-Cards
- Microchip-/Circuit-Look
- winzige Miniatur-Diorama-Darstellung mit schlechter Lesbarkeit
- unnötiger Clutter

### Bild-QA

Bild verwerfen und **dieselbe Bildnummer neu erzeugen**, wenn:

- es hübsch aussieht, aber den Sprechpunkt nicht direkt erklärt
- man erst interpretieren muss, was Symbole bedeuten
- die reale Alltagssituation nicht erkennbar ist
- Ursache und Wirkung unklar bleiben
- notwendige deutsche Labels fehlen oder falsch zugeordnet sind
- reale Gegenstände wie generische Icons/Spielzeug wirken
- es fotorealistisch wird
- der Hintergrund nicht deep black bleibt
- UI/Flowchart/Clutter die Erklärung verdrängen

## 7. Google Flow — Strict Single Job V3

```text
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
```

Zu jedem Zeitpunkt maximal **ein** Bildjob:

```text
aktuellen Prompt lesen
→ GENAU EIN Bild starten
→ intern vollständig warten
→ sofort exakt umbenennen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu erzeugen
→ erst nach PASS nächsten Bildblock freischalten
```

Verboten: Batch, parallele Jobs, Queue späterer Bilder, Kontaktbogen/Galerie als Ersatz, Nutzer-„weiter“ zwischen Bildern und Bild-zu-Bild-Referenzen.

## 8. Finales Reel-Layout V5

**Einzige technische Wahrheit:** `src/brand/tokens.ts -> REEL_STYLE`.

```text
Header               Y = 154
Header Text          56 px, Minimum 50 px
Header Icon          34 px
Header Zeilen        maximal 2
Visualzone           Y = 320–1400
Untertitel           bottom = 340
Caption Font         50 px, Minimum 40 px
Caption Zeilen       maximal 2
Szenenübergang       3 Frames
```

Reels dürfen diese Werte nicht lokal überschreiben.

### Header

- reines Weiß `#FFFFFF`
- Sentence Case / natürliche Schreibweise
- passendes Linien-Icon daneben
- semantische Farbe primär im Icon
- keine Capsule / Chip / Pill / Box
- kein automatisches ALL CAPS
- lange Titel umbrechen auf maximal zwei Zeilen statt auf kleine Label-Größe zu schrumpfen
- Icon immer in festem Slot und optisch normalisiert; unterschiedliche SVG-ViewBox-Füllungen dürfen nicht wie verschiedene Größen wirken
- bei zweizeiligen Titeln bleibt das Icon an der **ersten Textzeile** verankert und springt nicht vertikal
- die gesamte Header-Gruppe bleibt zentriert, der Text innerhalb der Gruppe ist linksbündig, damit der Abstand Icon → erste Textzeile konstant bleibt

### Visual-Safe-Zone

`AnimationStage` clippt produktive Animationen **hart auf Y320–1400**, während ihr internes 1080×1920-Koordinatensystem erhalten bleibt.

Damit gilt:

- kein Animationsinhalt sichtbar im Headerbereich
- kein Animationsinhalt sichtbar in der Caption-Zone
- Bilder und Animationen benutzen dieselbe visuelle Hauptzone

### SourceNote

Quellenhinweise liegen zentral oberhalb der Caption-Zone und dürfen zweizeilige Captions nicht überdecken.

## 9. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- aktuelles Wort grün, Rest weiß
- max. zwei Zeilen
- Standard 50 px, Minimum 40 px
- Weight 800
- kein Stroke, Jump oder Scale-Pop
- `bottom = 340`
- pro Szene clippen; kein Wort der nächsten Szene darf vorgreifen

## 10. Remotion-Hintergrund — Pure Black V1

Der einzige produktive Reel-Hintergrund ist:

```text
#000000
statisch
```

`FinanceBackground` darf keine optische Variante erzeugen. `PremiumPhysicalStage` bleibt transparent.

Streng verboten als Reel-Hintergrund:

- Partikel
- Aurora
- Grid
- Glow-Feld
- Vignette
- dekorative Gradient-Fläche
- Hintergrundbewegung

Hintergrundbewegung zählt niemals als Szenenanimation oder QA-Nachweis.

## 11. Phase-1-Animationscode

Basis-Lock:

```text
finanzneo-phase1-animation-code-v1
```

Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Visuelles Ziel bleibt **V9**.

Pflichtlogik:

```text
STARTZUSTAND
→ SICHTBARER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ Ergebnis mindestens 15 Frames stabil
```

Pflicht:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `PremiumPhysicalStage`
- mindestens **ein echtes sichtbares Hauptobjekt**
- semantische Materialrolle
- korrekter Exportname
- `RESULT_HOLD_FRAMES >= 15`
- `ANIMATION_NARRATIVE` START / MECHANISM / RESULT
- `PREMIUM_VISUAL_NARRATIVE` HERO / SUPPORT / MATERIAL / DEPTH

**Keine feste Support-Objekt-Anzahl.** Klarheit entscheidet.

Animationen müssen Inhalt **erklären und unterhaltsam visualisieren**, nicht nur Pixel bewegen.


### Cinematic Real-World Animation — Pflicht

Eine Animationsszene ist eine **kleine visuelle Geschichte**, keine bewegte Infografik.

Für jede Animationsszene verbindlich:

```text
REALE AUSGANGSSITUATION
→ KONKRETE PHYSISCHE HAUPTAKTION
→ SICHTBARE URSACHE / WIRKUNG
→ EINDEUTIGES ERGEBNIS
```

- reale bzw. unmittelbar erkennbare Gegenstände verwenden, wenn der Inhalt sie hergibt: Rechnung, Konto, Waschmaschine, Kalender, Geldstapel, Reservebehälter usw.
- mindestens zwei konkrete Realwelt-Objekte/-Instanzen tragen die Handlung
- jede Szene erhält eine eindeutige `MECHANIC_ID`; dieselbe Mechanik nicht mehrfach im Reel wiederholen
- `PRIMARY_ACTION` beschreibt die wirkliche physische Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- deutsche Labels nur unterstützend; die Handlung muss auch ohne Text verständlich sein
- Animationen müssen visuell dieselbe Qualität und Welt wie die Flow-Bilder erreichen

Als Hauptsprache **verboten**:

- drei beschriftete Kästen/Karten nach dem Muster `A → B → C`
- Lade- oder Fortschrittsbalken als Ersatz für die eigentliche Animation
- reine Texttafeln mit Fade/Scale
- generische Shield-/Arrow-/Coin-Symbolik, wenn eine konkrete Alltagssituation darstellbar ist
- wiederholte identische Mechanik über mehrere Animationsszenen

Zentrale konkrete Primitives stehen über `src/design-system` bereit: `PhysicalBill`, `PhysicalAccount`, `PhysicalWasher`, `PhysicalReserveTank`, `PhysicalCalendarPage`, `PhysicalCoinStack`. Generische `PhysicalObject`, `PhysicalTag` und `PhysicalRail` sind nur Support; insbesondere `PhysicalRail` darf niemals die Geschichte allein tragen.

Streng verboten:

- Dummy-/Placeholder-Komponenten
- Debug-Flächen
- wackelnde Rechtecke
- `Math.sin` / `Math.cos` als Frame-Diff-Hack
- reine Zoom/Fade/Popup-Bewegung als komplette Erklärung
- Dashboard-/Control-Panel-Hauptkomposition
- Flowchart-Hauptkomposition
- kleine Boxen mit dünnen Linien
- generische Info-Cards als Hauptsprache
- reine Texttafel
- Hintergrundbewegung als Animationsnachweis

## 12. Phase-3-Seal und Dispatch

`npm run reel:ready -- <Reel-Pfad>` versiegelt jede kanonische `animation.tsx` per SHA-256.

Phase 3 verlangt danach:

- exakten `componentPath`
- exakten Export
- unveränderten Hash
- echtes `customAnimations[animationId]`-Binding

Fehlt ein Binding: **Render hart abbrechen.** Kein CTA-/Text-/Black-Screen-Fallback.

## 13. Phase-3-Completion-Gate

Eine vorhandene MP4 bedeutet **nicht fertig**.

Pflichtkette:

```text
reel:ready
→ Phase-1-Animation-Seal
→ Phase-3-Preflight
→ Candidate Render
→ Post-Render-QA
→ Final MP4
→ automatischer reel:export nach 06-export/
→ FINAL_COMPLETE
```

Post-Render-QA muss mindestens prüfen:

- jede Szene hat echten visuellen Inhalt
- Header + Caption + Schwarz allein zählen nicht als Szenenvisual
- Bildszene zeigt wirklich das Nutzerbild
- Animationsszene zeigt echte Mechanik und sichtbare Veränderung
- Hintergrundbewegung zählt nicht
- freier Reel-Hintergrund bleibt schwarz
- Audio, Auflösung und Timeline stimmen

Ein schwarzes/leeres oder Caption-only Reel darf niemals als fertig gelten.

## 14. Publishing

Standard für alle Reel-Plattformen ist die **universelle Caption**: `04-caption/caption.txt` wird beim finalen Export automatisch als `06-export/caption-universal.txt` ausgegeben. Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden standardmäßig diese Datei; Plattformvarianten bleiben optionale Zusatzdateien.

Reel-Plattformdateien:

```text
04-caption/caption.txt
04-caption/instagram-reels.txt
04-caption/tiktok.txt
04-caption/facebook-reels.txt
04-caption/snapchat.txt
```

Keine `youtube-shorts.txt`.

## 15. Produktionsbefehle

Im normalen Phase-3-Lauf wird `reel:export` nach bestandener Render-QA automatisch von `render-validated.mjs` gestartet. Der direkte Befehl bleibt nur für einen kontrollierten erneuten Export vorhanden.

```bash
npm run reel:create -- --target <Reel-Pfad> --title "Titel"
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:export -- <Reel-Pfad>
```

Kein Agent darf einen fehlgeschlagenen Gate umgehen.
