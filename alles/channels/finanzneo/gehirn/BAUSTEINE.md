# 🧰 FinanzNeo — Baukasten nach Satz-Kategorien (Intent-Routing)

> **So benutzen:** Du hast einen Satz aus dem Script → finde die passende **Kategorie** → nimm den/die
> **Baustein(e)** (+ ggf. **Metapher** aus `core/gehirn/METAPHORS.md`) → an FinanzNeo anpassen
> (🟢 grün=Wachstum, 🟡 gold=Geld-Zahl, 🔴 rot=Verlust; echte Zahl statt schwammig; Reduktion).
> Bausteine leben in `@studio/core` (Signaturen: `core/brand-kit/KATALOG.md`). **Erweiterbar** — neue Kategorie unten anhängen.
> Regel: **erst Metapher/Kategorie, dann animieren.** Jede Kategorie hat ≥1 Baustein.

---

## 1 · Zahl enthüllen (dramatischer Reveal)
**Sätze:** „Aus 100 € werden **122.000 €**." · „Das kostet dich **50.000 €**." · „Am Ende: **X €**."
**Bausteine:** `DramaticNumber` (Fake-Stopp — Spannung) · `DigitSlots` (Slot-Machine) · `SplitFlap` · `Counter` · `BigStat`
**Farbe:** gold. **Tipp:** die Zahl kommt SPÄT (Spannungsbogen), nicht am Anfang.

## 2 · Wachstum über Zeit
**Sätze:** „Dein Geld wächst **Jahr für Jahr**." · „Zinseszins lässt es explodieren."
**Bausteine:** `GrowthChart` (mit Callout-Marker) · `AreaPremium`
**Metapher:** 🔮 **Schneeball** (rollt & wächst) · Baum aus Samen. → oft stärker als das Diagramm.

## 3 · Zwei Dinge vergleichen
**Sätze:** „**Sparbuch vs. ETF**." · „Wer wartet, verliert." · „Person A vs. Person B."
**Bausteine:** `CompareSplit` (VS-Badge) · `Bars` (2 Balken) · `Table`
**Farbe:** eine Seite grau/rot (schlecht), andere grün (gut).

## 4 · Rangliste / mehrere Optionen
**Sätze:** „Die **besten** Anlageformen." · „Top 3 Fehler."
**Bausteine:** `Ranking` · `Bars` (mehrere) · `Table`

## 5 · Anteil / Verteilung
**Sätze:** „**70 %** davon sind geschenkte Zinsen." · „So teilt sich dein Depot auf."
**Bausteine:** `Donut` (Segmente) · `PercentRing`
**Metapher:** Kuchen/Pizza-Stück.

## 6 · Prozent / Quote
**Sätze:** „**73 %** sparen zu wenig." · „**7 %** Rendite pro Jahr."
**Bausteine:** `StatBar` (Balken) · `PercentRing` (Ring)

## 7 · Risiko / Abwägung
**Sätze:** „Mehr **Rendite** = mehr **Risiko**." · „Sicher oder chancenreich?"
**Bausteine:** `Gauge` (Risiko-Tacho) · `Balance` (Waage kippt)
**Metapher:** 🔮 **Waage** · Seiltanz · Gaspedal/Bremse.

## 8 · Ziel / Fortschritt
**Sätze:** „Dein Weg zu **10.000 €**." · „Sparziel erreicht."
**Bausteine:** `GoalTracker` (Thermometer)
**Metapher:** 🔮 Thermometer/Tank füllt sich.

## 9 · Zeitverlauf / Meilensteine
**Sätze:** „So entwickelt sich dein Depot über 30 Jahre." · „Jahr 1 … Jahr 30."
**Bausteine:** `MilestoneTimeline`

## 10 · Aufzählung / Schritte
**Sätze:** „In **3 Schritten** zum Sparplan." · „So geht's."
**Bausteine:** `NumberedSteps` · `Checklist` (Häkchen) · `CheckCards`

## 11 · Kernaussage betonen (Vollbild-Statement)
**Sätze:** „**Zeit schlägt Timing**." · „Nicht reich werden. Einfach anfangen."
**Bausteine:** `KineticCenterBuild` (Wörter bauen sich auf) · `BigStat` · `MaskReveal`

## 12 · Zitat / Autorität
**Sätze:** „**Warren Buffett**: ‚…'." · „Eine alte Börsenweisheit sagt…"
**Bausteine:** `Quote`

## 13 · Label / Stempel
**Sätze:** „**GRATIS**." · „**-50 %**." · „**NEU**." · „ACHTUNG."
**Bausteine:** `Badge` (Stempel, gedreht)

## 14 · Gründe / Vorteile (Grid)
**Sätze:** „**3 Gründe** für ETFs." · „Das bringt dir das."
**Bausteine:** `FeatureGrid` (Icon-Karten) · `CheckCards`

## 15 · Abstraktes Konzept → Metapher (WICHTIG — der Premium-Hebel)
**Sätze:** „Dein Geld wächst wie ein **Schneeball**." · „**Inflation** frisst dein Geld." · „Diversifikation schützt dich."
**Bausteine (neu):** `Snowball` (Zinseszins/Wachstum, Wert läuft mit) · `LeakyBucket` (Inflation, Geld tropft, Füllstand sinkt).
**Sonst:** custom SVG oder **Bild-Prompt an Arman** (Flow) + Kamera/Reveal darauf.
**Weitere Metaphern:** 🔮 schmelzender Eiswürfel · **Eier in mehreren Körben** (Diversifikation) · Ball & Kette (Schulden). → `METAPHORS.md`
> Fehlt eine Metapher als Baustein? → in `core/brand-kit/components/metaphors.tsx` bauen (goldene Regel: geteilt → core).

## 16 · Hook / Frage (Reel-Start)
**Sätze:** „Was, wenn **100 €** dein Leben ändern?" · „Diesen Fehler machst du auch."
**Bausteine:** `KineticCaption` + `MaskReveal` + geteaste große Zahl (`BigStat`, noch ohne Auflösung)

## 17 · Gesprochener Satz (Untertitel)
**Jede Script-Zeile:** → `KineticCaption` (Wort für Wort, Keyword glüht gold/grün). Text jede Szene ANDERS animiert.

## 18 · Rechnung / Formel sichtbar
**Sätze:** „**100 € × 360 Monate** = 36.000 € eingezahlt." · „7 % auf 7 % …"
**Bausteine:** `Table` · Layout mit `Icon`-Pfeilen + `Counter`/`RollingNumber` fürs Ergebnis.

## 19 · Geld-Fluss / Ablauf
**Sätze:** „So **fließt** dein Geld." · „Vom Konto in den ETF."
**Bausteine:** `DataFlowPipes` · `Flowchart`
**Metapher:** 🔮 Röhren/Wasserfluss.

## 20 · Hintergrund & Stimmung (immer)
**Jede Szene:** `LivingBackground` (grün) oder `ShaderBG` — **dezent**, nicht überladen. `FilmGrain` leicht. Reduktion!

## 21 · Kamera & Übergänge (zwischen Szenen)
**Szenenwechsel:** `WhipIn` · `ZoomPunch` · `PushThrough` · `KenBurns` · `Dissolve`/`WaveWipe` — variieren, nie 2× gleich.

## 22 · Geld sinkt / Verlust / Crash
**Sätze:** „Der Kurs **stürzt**." · „Ein Crash **halbiert** dein Depot." · „Du **verlierst** Geld."
**Bausteine:** `CrashChart` (steigt → stürzt rot ab, Wert + ▼-% fallen mit)
**Farbe:** rot. **Metapher:** 🔮 fallender Stein · Luft raus (Ballon).

## 23 · Schock / Gefahr / Achtung
**Sätze:** „**STOPP**." · „**Achtung**: dieser Fehler kostet dich alles." · „Finger weg."
**Bausteine:** `AlertPulse` (Warn-Icon + Pulsringe + Rand-Vignette, Screen-Shake)
**Farbe:** rot. **Reduktion:** sparsam einsetzen (ein Schock-Moment, kein Dauerzustand).

---

## ➕ Erweitern
Neue Satz-Kategorie fällt auf? → hier als „## N · <Kategorie>" anhängen (Sätze + Baustein + ggf. Metapher).
Fehlt ein Baustein für eine Kategorie? → in `core/brand-kit` bauen (goldene Regel: geteilt → core) und in `KATALOG.md` eintragen.
