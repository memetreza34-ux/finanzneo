# FinanzNeo Creative Director V1

`CREATIVE_DIRECTION_STANDARD: finanzneo-creative-director-v1`

Diese Schicht gilt fuer alle neu erzeugten Reels. Sie kommt **vor** IMAGE/ANIMATION-Auswahl, Bildprompt, Motion Design und Style-Lock.

## 1. Ziel

FinanzNeo soll nicht nur korrekt und verstaendlich sein. Jede Szene soll als **interessanter sichtbarer Moment** funktionieren.

Prioritaet fuer neue Visual Beats:

```text
Verstaendlichkeit
+ visuelle Geschichte
+ sichtbare Handlung oder Konsequenz
+ Retention / Neugier
+ Markenwelt
+ technische Umsetzbarkeit
```

Technische Sauberkeit allein ist kein Qualitaetsbeweis. Ein Visual darf korrekt, lesbar und markenkonform sein und trotzdem wegen Langeweile durchfallen.

## 2. Reihenfolge pro Visual Beat

Fuer jeden gesprochenen Gedanken gilt ab jetzt verbindlich:

```text
Sprechpunkt
→ Zuschauerfrage
→ interessantester sichtbarer Moment
→ Handlung / Konsequenz / Kontrast
→ Shot Design
→ IMAGE oder ANIMATION
→ konkrete Hauptmechanik
→ Art Direction / Style Lock
→ Prompt bzw. animation.tsx
→ Boring-Scene-QA
```

Der Style-Lock darf niemals die kreative Idee ersetzen.

## 3. Pflichtfragen des Creative Directors

Bevor ein Bildprompt oder eine Animation geschrieben wird, muessen diese Fragen beantwortet werden:

1. Was ist der **interessanteste sichtbare Moment** dieser Aussage?
2. Was **passiert gerade aktiv** im Bild oder in der Animation?
3. Welche **Konsequenz** oder Veraenderung sieht der Zuschauer?
4. Wo befindet sich die **Kamera**?
5. Was liegt im **Vordergrund**, was ist Hauptmotiv, was liefert Kontext im Hintergrund?
6. Welche **Spannung, Emotion oder Neugier** traegt der Moment?
7. Wodurch unterscheidet sich dieser Shot klar von den letzten zwei Visual Beats?
8. Kann der Zuschauer die Aussage auch ohne Ton verstehen, ohne ein Symbolraetsel zu loesen?
9. Ist das eine **Szene / ein Moment** oder nur eine Sammlung erklaerender Objekte?
10. Wuerde dieses Visual auch ohne Voiceover fuer mindestens einen kurzen Moment interessant wirken?

Wenn Frage 2, 3, 7 oder 9 nicht gut beantwortet werden kann, muss die Visual-Idee neu entwickelt werden.

## 4. Story Moment statt Erklaerposter

Bevorzugt werden konkrete Situationen aus dem echten Leben:

- Gehalt kommt aufs Konto und sinkt spaeter sichtbar ab
- Karte wird am Terminal benutzt und die Folge wird direkt sichtbar
- Person oeffnet eine unerwartete Rechnung
- Handy zeigt einen Kontostand waehrend Einkaufstueten oder Lieferessen sichtbar werden
- zwei Bankkonten werden sichtbar getrennt statt nur als Symbole nebeneinander gestellt
- ein Notgroschen wird durch eine echte Reparatur belastet
- dieselbe Situation als Vorher/Nachher-Kontrast

Verboten als Standardloesung:

- Person + Geld + Kalender auf leerem Hintergrund
- Bank + Schild + Muenzen + Pfeil
- drei Icons nebeneinander mit Labels
- statische Objektkataloge
- reine Symbolmetapher ohne konkrete Situation
- dekorative 3D-Finanzobjekte, die nur den gesprochenen Satz illustrieren

Symbole duerfen unterstuetzen, aber nicht die Hauptgeschichte ersetzen.

## 5. Shot Design

Jeder Visual Beat bekommt eine bewusst gewaehlte Perspektive. Moegliche Shot-Typen:

- extreme close-up
- close-up
- over-the-shoulder
- medium shot
- wide shot
- top-down
- low-angle / high-angle, wenn inhaltlich sinnvoll
- foreground reveal
- before/after match cut
- object-centric macro shot

Die Wahl wird durch den Inhalt bestimmt, nicht durch Rotation einer festen Liste.

### Shot-Diversitaet

Direkt aufeinanderfolgende Visual Beats sollen nicht dieselbe Kombination wiederholen aus:

- gleicher Kameradistanz
- gleichem Hauptobjekt
- gleicher Bildmitte-Komposition
- gleicher Personenpose
- gleicher Ursache-Wirkungs-Anordnung

Wenn Wiederholung inhaltlich noetig ist, muss der zweite Beat eine klar neue sichtbare Information liefern.

## 6. Bildwelt bleibt FinanzNeo, aber nicht leer

Deep Black bleibt die verbindende Markenwelt. Er darf jedoch reale Szenenkontexte nicht verhindern.

Erlaubt, wenn inhaltlich hilfreich:

- Tischkante
- Schreibtisch
- Kuechenausschnitt
- Regal
- Bank-/Kassenumgebung
- Sofa-/Wohnungsausschnitt
- Einkaufstuete
- Rechnung
- Kalender
- Smartphone
- Kartenleser
- reale Haushaltsobjekte

Diese Elemente muessen in die schwarze stilisierte 3D-Welt uebergehen. Der Hintergrund bleibt ruhig; er darf aber eine echte Situation glaubwuerdig verankern.

## 7. IMAGE-Regeln

Ein IMAGE soll einen **eingefrorenen interessanten Moment** zeigen, nicht nur ein Thema symbolisieren.

Pflicht:

- sichtbare Handlung, Konsequenz oder klarer Kontrast
- konkreter Hauptfokus
- definierte Kamera
- Vordergrund / Hauptmotiv / Kontext bewusst geplant
- reale Objektbeziehungen
- starke Silhouette und klare Tiefenstaffelung
- mindestens ein konkretes Story-Detail, das die Szene einzigartig macht

Beispiele fuer Story-Details:

- Kontostand `12,43 €`
- Kalender `27.`
- ungeoeffnete Rechnung im Vordergrund
- Einkaufsbeutel neben dem Handy
- Zahlungsterminal noch sichtbar

Kurze deutsche Objektlabels bleiben erlaubt, aber Labels duerfen die eigentliche Erklaerung nicht tragen.

## 8. ANIMATION-Regeln

Eine ANIMATION muss waehrend ihrer Laufzeit mehrere echte sichtbare Zustaende durchlaufen.

Pflichtstruktur:

```text
START
→ sichtbare Aktion / Ursache
→ physische oder logische Veraenderung
→ RESULTAT
```

Kamera-Push, Zoom, Glow, Icon-Wechsel oder schwebende Chips allein zaehlen nicht als neuer Zustand.

Bevorzugt:

- Geld fliesst sichtbar aus einer realen Situation heraus
- mehrere Konten werden physisch zu einer Bankgrenze zusammengefuehrt
- Kosten stapeln sich und verdraengen ein verfuegbares Budget
- Vorher/Nachher-Zustaende wechseln sichtbar
- ein Gegenstand wird durch einen anderen Zustand ersetzt oder veraendert

Die Animation soll dieselbe stilisierte 3D-Welt sprechen wie die Flow-Bilder. Reine Flat-Infografik ist nur erlaubt, wenn sie fuer genau diesen Sprechpunkt deutlich besser erklaert als eine physische 3D-Mechanik.

## 9. Visual-Beat-Dauer

Die bestehende Timing-Autoritaet bleibt bestehen. Zusaetzlich gilt:

- ein statisches Bild darf nicht durch Ken-Burns kuenstlich als neuer Beat behandelt werden
- Kamera-Zoom allein verlaengert keine visuelle Idee
- wenn die Aussage nach ca. 2–3 Sekunden verstanden ist, muss der naechste sichtbare Beat kommen
- ab ca. 3,6 Sekunden bei einem statischen Bild aktiv einen zweiten Shot oder neuen konkreten Zustand pruefen
- ohne neue sichtbare Information bleibt 4,0 Sekunden die harte Obergrenze fuer Future-V3-Bildbeats

## 10. Boring-Scene-QA

Jede Szene wird vor Seal mit PASS/FAIL geprueft.

### Harte FAIL-Kriterien

FAIL, wenn eines zutrifft:

- Visual besteht hauptsaechlich aus Person + Finanzsymbolen + leerem Hintergrund
- Visual ist nur eine huebsche 3D-Illustration des Satzes
- keine sichtbare Handlung, Konsequenz oder klarer Kontrast
- gleiche Shot-Logik wie die letzten zwei Beats ohne neue Information
- Hauptaussage wird nur durch Labels verstanden
- generische Bank/Schild/Muenzen-Komposition
- Animation besteht primaer aus Karten, Chips, Icons, Balken oder Rahmenbewegung
- Animation benutzt Bewegung, ohne dass sich die inhaltliche Situation veraendert
- statisches Bild wird nur durch Zoom/Pan als "lebendig" erklaert

### PASS-Kriterien

PASS nur, wenn mindestens vier dieser Punkte stark erfuellt sind:

- sofort erkennbare Handlung
- sichtbare Konsequenz
- interessante Kameraperspektive
- konkreter Alltagsmoment
- klarer Vorher/Nachher- oder Ursache/Wirkungs-Kontrast
- einzigartiges Story-Detail
- deutliche visuelle Abwechslung zum vorherigen Beat
- starke Hauptsilhouette / Tiefenstaffelung
- Bild funktioniert ohne Voiceover
- Animation zeigt mindestens zwei inhaltlich unterschiedliche Zustaende

## 11. Creative-Director-Ausgabe pro Szene

Vor Prompt oder Code wird intern mindestens festgelegt:

```text
VISUAL_GOAL:
VIEWER_QUESTION:
STORY_MOMENT:
PRIMARY_ACTION:
VISIBLE_CONSEQUENCE:
SHOT_TYPE:
CAMERA_POSITION:
FOREGROUND:
HERO:
CONTEXT:
UNIQUE_DETAIL:
DIFFERENCE_FROM_PREVIOUS_BEATS:
IMAGE_OR_ANIMATION:
BORING_SCENE_RISK:
```

Diese Angaben duerfen in `szene.md` oder einer spaeteren strukturierten Produktionsdatei gespeichert werden.

## 12. Oberste Regel

**FinanzNeo zeigt keine Folien. FinanzNeo zeigt Momente.**

Ein technisch korrektes Visual wird verworfen, wenn es keinen interessanten sichtbaren Moment erzeugt.