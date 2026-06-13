# FinanzNeo — Projekt-Gehirn (Auto-Kontext für jede Claude-Session)

> Diese Datei wird von Claude Code automatisch geladen, wenn du im `finanzneo`-
> Ordner arbeitest. Sie ersetzt den alten "Schritt 0"-Prompt: Du kennst damit
> sofort Person, Marke, Regeln, Workflow und Werkzeuge — ohne dass Arman etwas
> einfügen muss.

## ⚡ SCHNELLSTART (für jede neue Session)
- **Alles liegt hier:** `~/claude-code-video-toolkit/finanzneo/` (ein Ordner).
- **Baukasten:** `src/brand/` — ~65 Bausteine, importieren via `from './brand'`.
- **Demos zum Anschauen:** Compositions `Showcase`, `Showcase2`–`5`, `TemplateDemo`, `Overview`, `Thumbnail`, `MockMindmap`, `MockTest`.
- **Render:** `cd ~/claude-code-video-toolkit/finanzneo && ./node_modules/.bin/remotion render src/index.ts <Comp> out/<name>.mp4 --concurrency=4`
- **Still prüfen (immer vor Voll-Render):** `./node_modules/.bin/remotion still src/index.ts <Comp> frames/x.png --frame=<n>`
- **Zwei Stile verfügbar:** dunkelgrün-premium (FinanzNeo) **und** hell-clean (Tech-Demo, `WindowMock`).
- **Regeln:** Plan zeigen → JA abwarten → bauen → Stills selbst prüfen → 9/10. Bilder nie als Deko-Tapete. Farben = Bedeutung.

---

## 1 · WER & ZIEL

- **Arman**, 21, baut deutsche **faceless** YouTube-Kanäle.
- Aktiver Kanal: **FinanzNeo** — Finanzen für Anfänger (Gesetze, Steuern, Know-how).
- Ziel: **1 hochwertiges Video pro Woche** (~10–12 Min), daraus virale **Shorts**.
- Prinzip: **Qualität vor Quantität. Minimum 9/10. Unter 8/10 → neu machen, ohne zu fragen.**

**Kanal:** YouTube @Finanz_Neo · TikTok/IG/Snap @finanz.neo · finanz.neo@gmail.com
**Zielgruppe:** DE, 16–45, komplette Anfänger.
**Ton:** Professionell aber nahbar — wie ein guter Freund der erklärt. **Immer „du"**, nie „man"/„Sie". Kein Gesicht, kein Avatar, keine Musik, keine Soundeffekte.

---

## 2 · DIE PIPELINE (Armans tatsächlicher Workflow)

Qualität ist oberstes Ziel → Animation wird **von Hand** gebaut, nicht automatisch.

| Schritt | Wer/Was | Ergebnis |
|---|---|---|
| **1** | **OpenMontage** (`~/OpenMontage`) | Referenz-Video rein → Analyse + **eigener Script** |
| **2** | **Arman** | Script → Audio in **Google Vids** (echte/menschliche Stimme) |
| **3** | **Arman** | Bilder generieren (Google Flow / Nano Banana) → in `bilder/` |
| **4** | **Claude + Remotion** (`finanzneo`-Baukasten) | **Premium-Animation 9/10** aus Audio + Bildern |
| **5** | **Claude** | Zusammenfügen + QA → `final/` |
| **6** | **Claude** | YouTube-Metadaten (Titel/Thumbnail/Description/Tags) |
| **7** | **Claude** | Shorts (1080×1920, Untertitel) → `shorts/` |

**Wichtig:** OpenMontage macht nur Analyse + Script. **Die Animation = handgeschriebener Remotion-Code** (das ist der Qualitäts-Hebel). Remotion ist der Motor; Claude ist der Fahrer.

---

## 3 · MARKE (fest verdrahtet — nie abweichen)

**Farben — SEMANTISCH** (`src/brand/tokens.ts` → `C` / `MEANING`). Farbe = Bedeutung, nie zufällig. Grün bleibt Signatur, **Weiß dominiert Text**, andere Akzente nach Sinn:
- ⚪ Weiß `#FFFFFF` = neutral/Aussage (Haupt-Text) · 🟢 Grün `#00D26A` = Wachstum/Lösung
- 🔴 Rot `#FF3333` = Verlust/Problem · 🟡 Gold `#FFC83D` = Geld/Zahlen
- 🔵 Blau `#3D8BFF` = Vertrauen/Info · 🟣 Lila `#B98CFF` = premium/besonders
- Standard-BG dunkel; `C.bgLight` für seltene Hell-Szenen.

**Fonts** (lokal in `public/fonts/`, geladen via `src/brand/fonts.ts`):
- **Bebas Neue** → Titel & Zahlen (groß) · **Inter** → Fließtext & Labels

**Format:** Video **1920×1080**, Shorts **1080×1920**, beide **30fps**.

---

## 4 · ANIMATIONS-REGELN

- **Sync:** Jede Animation startet **exakt** beim gesprochenen Wort (Whisper-Timestamps). Pause im Audio → ruhige Animation.
- **Bildschirm:** immer ganz nutzen, nie in eine Ecke quetschen, klarer Fokus.
- **Lifecycle:** jedes Element **erscheint UND verschwindet** — nie hängen bleiben, Screen aufräumen.
- **Pacing:** max **1–2 Animationen pro Satz**. Ruhig↔dynamisch je nach Moment.
- **Übergänge:** abwechslungsreich, **nie 2× derselbe hintereinander** — Glitch (dramatisch) / Fade (ruhig) / Zoom (Enthüllung) / Slide (fließend).
- **Spring Physics** als Standard (`E.spring`). Nie billige/generische Effekte.
- **Partikel: nur gezielt** (Höhepunkt/CTA), **nie durchgehend**.

### 🔑 DIE EINE BILDER-REGEL (löst alle früheren Widersprüche)
> **Ein Bild kommt nur groß ins Bild, wenn die Stimme genau dieses Bild meint**
> (emotionaler/Storytelling-Moment). **Nie** als Deko-Tapete hinter unzusammenhängendem Inhalt.
> Geht es um eine Zahl/ein Konzept → **designte Motion-Graphics** (Kurve, Pfeil, Counter, Icons), **kein** Foto-Hintergrund.
- **Option A** (Bild klein 30–40%, Element): Erklär-Szenen mit Zahlen.
- **Option B** (Bild groß 70–75%): nur wenn die Narration das Bild behandelt.
- Bild-Stil: futuristisch/cinematic, dunkler BG + grüner Glow, **kein Text/Logo** auf Bildern.

---

## 5 · SCRIPT-REGELN

Kurze einfache Sätze · kein Fachjargon · konkrete Zahlen · emotional · keine Füllwörter · nie doppelte Info · **immer „du"** · `...` für natürliche KI-Pausen · **jeder Satz visualisierbar** (Zahl→Counter/Chart, Vergleich→Icons, Problem→Rot, Lösung→Akzent, Schritt→nummeriert, Wachstum→Kurve, Zeit→Timeline). Spannungsbogen: **Problem → Lösung → Motivation+CTA**. Hook max 60s, Outro+CTA max 30s.

---

## 6 · ARBEITSWEISE MIT ARMAN (Pflicht)

- **Immer erst Plan zeigen, dann bauen.** Beat-für-Beat → „Sieht der Plan gut aus?" → **auf JA warten**.
- Nach jedem Schritt auf Bestätigung warten. Nie Schritte überspringen.
- **Beim Bauen:** Key-Frame-Stills rendern und **selbst anschauen** vor dem Voll-Render.
- Bei Fehler → **stoppen und erklären**, nie still beheben.
- Selbst-Eval pro Szene 1–10. Unter 9/10 → neu.

---

## 7 · BAUKASTEN (das hier benutzen statt von null bauen)

Komponenten in **`src/brand/`** — importieren via `from './brand'`:
- `Background`, `Vignette`, `Progress` · `Title`, `Body`, `Kicker`, `WordReveal`
- **PREMIUM-Charts (Recharts, bevorzugt für Profi-Look):** `AreaPremium`, `BarsPremium`, `PiePremium`, `RadarPremium` — saubere Achsen/Gridlines, frame-gesteuert (Recharts-Eigenanimation aus). **Für ernste Charts diese nehmen**, die handgemalten (`GrowthChart`/`Bars`/`Donut`) nur für simple/stilisierte Fälle.
- `Card` · `Counter` · `GrowthChart`, `Bars` · `Donut`, `PercentRing` · `NumberedSteps`, `CheckCards`, `Timeline`
- `PhoneMockup` + `AppScreenDemo` (App-Szenen) · `Icon` (Flat-Set) · `Particles` (drift/burst)
- **Tech-Demo-Stil (hell, macOS):** `WindowMock` (Fenster mit Ampel-Punkten) + `IconTile` (farbige R/M/S/T-Kacheln). Für den hellen, cleanen Product-Demo-Look (wie Claude-Code-TikToks). → Zweiter Stil neben dem dunkelgrünen FinanzNeo-Look.
- **Text-FX:** `MaskReveal`, `Typewriter`, `WordStagger`, `Underline`, `WordReveal` + ⭐NEU (Juni 2026): `Scramble` (Zeichen-Wirrwarr löst sich auf), `KineticPunch` (Wörter knallen nacheinander rein), `FlipIn3D` (Zeichen klappen aus der Tiefe), `WaveText` (sanfte Welle, dezent)
- **⭐ ROLLERS (`components/Rollers.tsx`, NEU Juni 2026)** — Slot-Machine-Reveals für Geld-Zahlen (aus remotion-scenes MIT adaptiert, einbettbar, Brand-Tokens): `DigitSlots` (jede Ziffer rollt + rastet gestaffelt ein — DAS Geld-Reveal), `DramaticNumber` (Zähler mit Fake-Stopp → Re-Beschleunigung → Bounce, Spannung pur), `SlotRoller` (rollt durch Begriffe, stoppt auf letztem), `SplitFlap` (Flughafen-Klapptafel), `DrumRoller` (3D-Trommel), `CountdownRoller` (3·2·1 + Finalwort). Showcase: `UpgradeShowcase` Composition.
- **Daten/Finanz:** `Table`, `BigStat`, `Gauge` (Tacho), `StatBar`, `CompareSplit` (A vs B), `Checklist`, `FeatureGrid`, `Quote`, `Badge` + ⭐NEU: `MilestoneTimeline` (Meilensteine an wachsender Linie), `StatsCards` (Kennzahlen-Karten poppen versetzt)
- **Diagramme:** `Balance` (Waage), `GoalTracker` (Thermometer), `Ranking`, `Callout`, `Flowchart`.
  🚫 **KEIN 3D, KEIN Manim im aktiven Workflow.** Getestet & verworfen (Arman, Juni 2026): 3D-Münze/Balken/Kugel-Netzwerk passen NICHT zum Finanz-Look — wirken techy/wissenschaftlich (Kugel-Netzwerk = Chemie-Molekül), lenken vom Inhalt ab. Premium-Finanz = **clean 2D**: fette Typo, smoothe Counter, saubere Charts, viel dunkler Raum. Der `finanzneo_diagrams.py` (Manim) bleibt nur als Archiv liegen — **nicht verwenden**, außer Arman fragt explizit nach Punkt-auf-Zinseszins-Kurve oder Zahl-Morph (die 2 einzigen Manim-Ausnahmen).
- **Premium-Effekte** (`components/Effects.tsx`): `RollingNumber` (Odometer), `MoneyRain`, `Confetti`, `Sparkles`, `AuroraBG` (lebendiger Hintergrund), `PulseGrid`, `Shine` (Glanz-Sweep), `SpotlightReveal` (Iris), `Emphasis` (Pop+Wackeln), `PushIn` (Kamerafahrt)
- **Übergänge** (`transitions.ts`): `slideIn`, `zoomIn`, `wipeIn`, `blurIn`, `popIn`, `fadeIn`, `glitchStyle`, `sceneTransition` + ⭐NEU: `irisIn` (Kreis öffnet sich), `diagonalWipe` (schräge Kante, passt zum Diagonal-Look), `splitReveal` (Vorhang aus der Mitte), `skewSlide` (cinematisch schräg), `liquidIn` (organischer Blob) — alle auch in `sceneTransition(type: 'iris'|'diagonal'|'split'|'skew'|'liquid')`. Offizielles `@remotion/transitions` ebenfalls verfügbar — nie 2× derselbe hintereinander
- ⚠️ Render-Tipp: KEINE großen `filter: blur()`-Flächen (langsam → Font-Timeout). Weiche Looks via Radial-Gradienten.
- `LottieBox` (`components/Lottie.tsx`) — **Profi-Animationen** (After-Effects-Qualität) aus `public/lottie/*.json`. Für Objekte/Effekte die echt aussehen müssen statt selbstgemalter SVGs. **⭐ 14er Finanz-Set (Juni 2026, Brand-gefärbt):** muenzen/muenze/geldboerse/sparschwein (gold), wachstum/trend/trendauf/ziel/sicherheit (grün), zeit (blau), konfetti/lupe/warenkorb/warnung. Übersicht: Composition `LottieFinanzGrid`. Mehr holen: Lordicon-CDN `https://cdn.lordicon.com/<id>.json` (IDs via GitHub-Code-Suche, dann auf Brand umfärben).
  ⚖️ **LIZENZ:** Lordicon-Free = kostenlos auch kommerziell, **aber Attribution-Pflicht**. PFLICHT: Zeile **„Icons by Lordicon.com"** in jede YouTube-Beschreibung (beim Disclaimer am Ende).
- Tokens: `C` (Farben), `E` (Easing), `sec()`, `prog()`, `lerpF()`, `life()`, `euro()`, `num()`

### Arbeitsteilung „selbst bauen vs. premium holen"
- **DER FinanzNeo-Look = Remotion Clean-Bold** (siehe `Signature.tsx`): klare Flächen, große Typo, mutiger diagonaler Grün-Akzent, RollingNumber, smooth. Das ist der Standard-Stil für alles. Kein 3D, keine Spielereien.
- **Selbst (Remotion, meine Stärke):** Texte, Counter, Charts, Balken, Daten, Übergänge, Captions, Layout, Sync → 9/10.
- **Lottie:** professionelle Objekt-/Effekt-Animationen (statt billig/komisch selbstgemalt).
- **Bilder selbst generieren (GRATIS, lokal!):** FLUX läuft lokal auf dem M4 via mflux.
  Befehl: `source ~/mflux-env/bin/activate && mflux-generate -m ~/mflux-models/schnell-4bit --base-model schnell --prompt "..." --steps 2 --seed 42 --height 1216 --width 832 --output <pfad>`
  → ~1,5 Min/Bild, kostenlos, unbegrenzt. Claude generiert Bilder direkt in `szene-N/bilder/`.
  Stil-Prompt für FinanzNeo: "cinematic 3D render, ... dark futuristic circuit board, dark background, green neon glow, depth of field, ultra detailed, premium". Alternativ Google Flow / Nano Banana / ImageFX (Browser, Arman).
- **KI-Video (LTX-2 / Veo / Kling):** echtes Bewegtbild / B-Roll, wenn eine Szene das braucht.
- Regel: **Wo eine Profi-Quelle besser ist als meine Handarbeit → von dort holen, nicht billig nachbauen.**

**Szenen-Vorlagen** (`templates.tsx`, 10 Stück): `IntroScene`, `HookScene`, `StatScene`, `CompareScene`, `ExplainScene`, `StepsScene`, `ListScene`, `QuoteScene`, `SectionDivider`, `CTAScene` — fertige Layouts, nur Props + `inF`/`outF` setzen. Komplettes Szenen-Menü für ein ganzes Video.
**Branding** (`components/Branding.tsx`): `LogoIntro`, `SubscribeBar`, `EndCard`.
**Untertitel** (`components/Captions.tsx`): `<Captions words={...} />` mit Word-Timing. Daten erzeugen: `source ~/manim-env/bin/activate && python scripts/captions.py <audio> out.json` (lokales Whisper, gratis) → JSON nach `public/captions/` → importieren.

**Authoring-Muster:** Szene = **eine durchgehende Timeline mit absoluten Frames**.
Beats per `style={{opacity: life(f, inFrame, outFrame)}}` ein-/ausblenden.
**Kein `<Sequence>` fürs Beat-Timing innerhalb einer Szene** (sonst sehen Bausteine lokale statt absolute Frames). `<Sequence>` nur beim Stitchen mehrerer Szenen (jede dann 0-basiert).
Demo aller Bausteine: `src/Showcase.tsx` (Composition `Showcase`).

### ⚖️ HAFTUNGSAUSSCHLUSS — am ENDE (Retention!), nicht am Anfang
**HOOK kommt IMMER zuerst** (erste 3-5s entscheiden über Retention — nie mit Rechtstext öffnen).
`<Disclaimer durationInSeconds={10} />` (aus `./brand`) läuft **am ENDE des Hauptvideos**, NICHT gesprochen, ~10s. Schützt rechtlich (keine Anlageberatung, § 85 WpHG). **Plus IMMER der Disclaimer-Text in der YouTube-Beschreibung** (rechtlich wichtigster Ort). Format-agnostisch. Text in der Komponente nicht kürzen.
**Shorts (9:16):** KEIN Intro-Disclaimer (killt Hook) — nur kleiner Text „Keine Anlageberatung" + in der Beschreibung.

### ⭐ AUDIO-SYNC WORKFLOW (das Herzstück — `src/FullVideoSynced.tsx` ist die Referenz)
🚫 **REGEL: Claude erstellt NIEMALS Audio.** Kein `say`, kein TTS, keine KI-Stimme. Die Stimme kommt **immer fertig von Arman als Datei** (Google Vids, menschlich). Wenn keine Audiodatei da ist → Arman danach fragen, NICHT selbst generieren. (Die eine `say`-Demo war ein einmaliger Sync-Test, kein Workflow-Teil.)

So entsteht jedes echte Video — Animation läuft synchron zur Stimme:
1. **Stimme (von Arman)**: Arman legt seine fertige VO ab → `public/audio/<name>.mp3`. Claude wartet darauf, erstellt sie nie.
2. **Wort-Timing (Claude)**: `source ~/manim-env/bin/activate && python scripts/captions.py public/audio/<name>.mp3 public/captions/<name>.json` (lokales Whisper, gratis) → `[{word,start,end}]`.
3. **Synchron animieren**: JSON importieren, Helfer `wIn(i)=sec(words[i].start)` / `wOut(i)`. Text-Reveal & Effekte an `wIn(i)` triggern → erscheint exakt wenn das Wort gesprochen wird. Szenengrenzen an Sprech-Pausen. `<Audio src={staticFile('audio/<name>.mp3')} />` einmal oben.
4. Komposition-Länge = `wOut(letztes) + sec(0.8)`.

### 📈 ECHTE FINANZDATEN (gratis, kein API-Key) — `scripts/fetch-data.mjs`, Demo `src/RealDataDemo.tsx`
Statt erfundener Zahlen → **echte, nachprüfbare Daten** (Glaubwürdigkeit, anti-AI-slop).
- **Holen:** `node scripts/fetch-data.mjs` (Standard-Sets) oder gezielt: `node scripts/fetch-data.mjs stock URTH 10y msci-world` · `... crypto bitcoin 365 btc` · `... fx EUR`.
- **Quellen:** Yahoo Finance (Aktien/ETF/Indizes, z.B. `^GSPC`, `URTH`, `^GDAXI`, `AAPL`), CoinGecko (Crypto), ExchangeRate (Währungen). Kein Key.
- **Ausgabe:** `public/data/<name>.json` mit `{ source, fetchedAt, currency, chart:[{x,y}] }` — `chart` ist **direkt** für `<AreaPremium data={...}>` / `<BarsPremium>` nutzbar (auf ~60 Punkte downgesampelt).
- **In Szene:** `import series from '../public/data/sp500-10y.json'` → `<AreaPremium data={series.chart} ... />`.
- 🚫 **PFLICHT: Quelle + Datum im Video zeigen** (`Quelle: {series.source} · Stand: {series.fetchedAt}`). Für Evergreen-Videos historische Daten nehmen (altern nicht), keine Live-Snapshots.
- ❌ Unsplash nicht nötig (FLUX lokal ist besser/on-brand). Pexels nur sparsam für echtes B-Roll. YouTube Data API nur für Themen-Recherche (braucht Key).

### Motion-Blur (Premium-Feel) — `components/Effects.tsx`
- `<CameraBlur samples={6}>` um eine **AbsoluteFill** → Bewegungsunschärfe auf bewegten Elementen (rollende Zahlen, Slides), **Layout bleibt** (sampelt ganze Frames). ✅ Für RollingNumber so nutzen.
- `<MotionBlur strength="subtle|medium|strong">` (Trail) nur für Elemente, die selbst absolut/frei positioniert sind — **bricht zentriertes Flow-Layout** (Trail positioniert absolut), nicht um zentrierte Inline-Inhalte legen.

### Remotion 4.0.473 (aktuell) — neue Effekte verfügbar
`linearProgressiveBlur()`, `colorKey()`, Transform-Strings in `interpolate()`. Pakete in package.json gepinnt (recharts, lottie-web, @remotion/motion-blur etc. — **immer mit `--save` installieren**, sonst prunt npm sie weg).

Erweitern erwünscht: neue Icons in `Icon.tsx`, neue Bausteine in `src/brand/components/` + Export in `src/brand/index.ts`. **Baukasten = konsistente Qualität, aber jede Szene frisch kombiniert (Abwechslung Pflicht).**

---

## 8 · ORDNER & TOOLS

```
~/Videos/Finanz-Kanal/[Videoname]/
  szene-[nr]-[name]/ { audio/  bilder/ }
  final/   shorts/
```
Video-Ordner automatisch anlegen sobald ein neues Video startet.

**Repos:** `~/OpenMontage` (Analyse+Script) · `~/claude-code-video-toolkit` (Remotion + `finanzneo`-Baukasten). **Video-Use wird nicht benutzt.** Repos nie vermischen.
**System:** ffmpeg · yt-dlp · Whisper (`~/manim-env`) · Node · Python.
**Render:** `./node_modules/.bin/remotion render src/index.ts <Comp> out/<name>.mp4 --concurrency=4`

---

## 9 · SHORTS

Stärkste Momente (Hook in 2s, überraschende Zahl, emotionaler Peak). 60–75s, 1080×1920, **Untertitel Pflicht** (groß, mittig-unten, max 3–4 Wörter, synchron, Keywords hervorgehoben). Pro Short: `short-[nr].mp4` + `short-[nr]-info.txt` (Timestamp, Titel, Caption, 5 Hashtags DE, Thumbnail-Beschreibung, Warum-viral, Hook/Viral-Score).
