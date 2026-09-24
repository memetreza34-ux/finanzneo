# FinanzNeo Visual Selection Rule

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

## Kernprinzip

Nicht zuerst fragen, welches Tool verfügbar ist. Zuerst bestimmen:

```text
Sprechpunkt
→ was muss der Zuschauer sichtbar verstehen?
→ welches EINFACHSTE Visual erklärt genau das?
→ erst danach Werkzeug wählen
```

**Komplexer Inhalt bedeutet nicht komplexes Visual.**

Die beste Szene ist die einfachste Szene, die den Gedanken korrekt und sofort verständlich macht.

---

## YouTube Longform — Simple Finance Explainer V1

`YOUTUBE_VISUAL_PROFILE: finanzneo-youtube-simple-finance-v1`

Für YouTube Longform gilt: **Remotion ist das Standardwerkzeug. Google Flow ist eine begründete Ausnahme. Echte Assets werden niemals unnötig durch KI imitiert.**

Wichtig: **Simple-first bedeutet einfache Komposition und klare Erklärlogik. Es bedeutet nicht 2D- oder Flat-Illustration.** Sobald Google Flow gewählt wird, bleibt die freigegebene premium stylized 3D FinanzNeo-Bildwelt verbindlich.

### Entscheidungsbaum

```text
Was muss verstanden werden?
│
├─ Zahl / Prozent / Vergleich / Entwicklung / Verteilung?
│  → REMOTION
│
├─ Ablauf / Ursache-Wirkung / Reihenfolge?
│  → REMOTION + bei Bedarf SVG/Icon
│
├─ echte Website / App / Dokument / Factsheet / Logo / Produkt / Quelle?
│  → ECHTES ASSET / SCREENSHOT
│
└─ konkrete Alltagssituation, die als Bild deutlich schneller verstanden wird?
   → GOOGLE FLOW in der freigegebenen stylized-3D-Bildwelt
```

### Flow-Gate — Pflicht

Vor jedem Google-Flow-Bild muss beantwortet werden:

> Kann Text, Zahl, Icon, Chart, Diagramm, Screenshot oder ein echtes Asset diesen Sprechpunkt gleich gut oder besser erklären?

- **JA → Flow verboten.**
- **NEIN → Flow erlaubt, aber `flowReason` muss konkret erklären, warum ein Bild besser ist.**

Beispiele:

- „ETF A kostet 0,2 %, ETF B 1,5 %“ → Remotion-Vergleich, **kein Flow**.
- „100 € monatlich wachsen über 30 Jahre“ → Remotion-Chart, **kein Flow**.
- „Die Miete steigt und der Haushaltsplan wird enger“ → Flow-Alltagsszene möglich.
- „Der Wagen muss unerwartet in die Werkstatt“ → Flow-Alltagsszene möglich.
- „Das steht im ETF-Factsheet“ → echtes Factsheet/Screenshot, **kein Flow-Nachbau**.

### Remotion — Standard

Remotion ist bevorzugt für:

- große Zahl
- Prozentwert
- Vorher/Nachher-Vergleich
- zwei oder drei Optionen
- Balken
- Linie / Chart
- Zeitstrahl
- Sparrate
- Kostenentwicklung
- Geldfluss
- Prozessschritte
- einfache Diagramme
- Allokation
- Formel / Rechenbeispiel
- kurze Text-Hervorhebung

Wiederverwendbare Erklärmuster sind ausdrücklich erwünscht. Wenn derselbe Balken- oder Vergleichstyp erneut die beste Erklärung ist, darf er ohne künstliche Neu-Erfindung wiederverwendet werden.

### Einfache Standard-Motion

Bevorzugte Bewegungen:

- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM` für ein ruhiges Bild

Andere Techniken sind erlaubt, aber nur wenn eine dieser einfachen Bewegungen den Inhalt nicht gleich gut erklärt.

### Echte Assets

Nutze reale Assets für:

- Websites
- App-Oberflächen
- offizielle Dokumente
- ETF-Factsheets
- Tabellen/Quellen
- Firmen-/Produktlogos
- reale Produkte

Kein KI-Bild soll eine existierende Website, App, Quelle oder ein Dokument erfinden oder nachbauen.

### Google Flow

Google Flow ist für wenige konkrete Situationen gedacht, z. B.:

- Einkauf / Inflation
- Miete / Nebenkosten
- Autoreparatur / unerwartete Ausgabe
- Arbeitsplatz / Gehalt / finanzielle Entscheidung
- Versicherung / Vertrag / Kündigung
- konkrete Alltagssituation, die mit Zahlen oder Diagrammen nicht gleich schnell verstanden wird

Kanonische YouTube-Bildwelt:

```text
config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt
```

Wenn Flow eingesetzt wird, gilt:

- premium stylized 3D animation-film look
- klar erkennbare stilisierte 3D-Figuren und -Objekte
- glaubwürdige Alltagsproportionen
- semi-realistische Materialien mit sichtbar stilisiertem Rendering
- tiefe schwarze FinanzNeo-Welt als dominanter Hintergrund
- nur wenig lokaler Kontext
- wenige große Objekte
- keine flache Corporate-/Editorial-Vektorillustration
- kein Canva-/Stock-Look
- nicht fotorealistisch
- keine generische Münz-/Tresor-/Sparschwein-Komposition

**Wichtige Regel:** Text, Zahlen und Erklärlabels gehören grundsätzlich in Remotion, nicht in das KI-Bild.

### YouTube-Visual-Metadaten

Jedes geplante Visual soll mindestens enthalten:

```json
{
  "message": "Was soll der Zuschauer verstehen?",
  "type": "animation | data | image | hybrid | real-asset",
  "assetSource": "remotion | google-flow | real-asset",
  "reason": "Warum ist diese Form die einfachste klare Erklärung?",
  "overlayText": [],
  "motionPreset": "FADE_IN",
  "flowAllowed": false,
  "flowReason": ""
}
```

Für Motion kommen technische Felder nur hinzu, wenn sie wirklich gebraucht werden. Metadaten dürfen niemals dazu führen, dass eine simple Szene künstlich komplex gebaut wird.

### YouTube-Qualitätsfragen

Vor Freigabe jedes Visuals:

1. Ist die Hauptaussage in ungefähr 1–2 Sekunden erkennbar?
2. Gibt es genau einen dominanten Gedanken?
3. Kann etwas entfernt werden, ohne Information zu verlieren? Dann entfernen.
4. Ist Flow wirklich nötig?
5. Wenn Flow genutzt wird: ist die freigegebene stylized-3D-Bildwelt eindeutig erkennbar?
6. Kommen wichtige Texte und Zahlen aus Remotion?
7. Hat die Bewegung einen Erklärzweck?
8. Würde eine einfachere Komposition gleich gut funktionieren? Dann vereinfachen — nicht den Bildstil auf 2D reduzieren.

---

## Reels — harte exklusive Auswahl

Die bestehenden Reel-Regeln bleiben unverändert. Für neue FinanzNeo-Reels gilt pro Szene **genau eine Hauptform**:

### IMAGE

Nutzen, wenn eine konkrete Alltagssituation oder ein klarer Zustand als starkes Standbild schneller verständlich ist, z. B.:

- kaputte Waschmaschine + Reparaturrechnung + Notgroschen
- Einkauf / Inflation
- Rechnung / Versicherung / Vertrag
- klarer realer Vorher-/Nachher-Zustand

IMAGE bedeutet:
- Google-Flow-Bild ist das Hauptvisual
- Header/Icon und Captions werden von Remotion gerendert
- kurze funktionale Objektlabels sind erlaubt
- keine erklärende Remotion-Hauptanimation, Pfeilmechanik, Geldfluss-Animation oder Parallax-Erklärung über dem Bild

### ANIMATION

Nutzen, wenn der Zuschauer eine **Veränderung, Entwicklung, Aufteilung, Reihenfolge oder Ursache/Wirkung über Zeit** sehen muss, z. B.:

- Zins/Tilgung teilt sich
- Gebühren wirken über Jahre
- regelmäßige Sparrate baut etwas auf
- Risiko wird verteilt
- Reihenfolge Sicherheit → Investieren

ANIMATION bedeutet:
- eigenständige Remotion-Hauptanimation
- kein generiertes Flow-Bild als Hauptvisual
- SVG, Icons, Lottie, Charts, Zahlen, Shapes und 3D-/Physical-Primitives sind Werkzeuge
- Technik wird individuell nach dem Sprechpunkt gewählt

### Für Reels verboten

`Bild + Remotion Hybrid` ist **keine dritte Hauptform**. Ein starkes Bild wird nicht unnötig mit Erkläranimation überladen. Wenn zeitliche Erklärung nötig ist, wird daraus eine ANIMATION-Szene; wenn das Bild allein die Aussage trägt, bleibt es IMAGE.

## Support-Werkzeuge

- **Icons:** schnelle semantische Erkennung
- **SVG:** präzise Pfade, Linien, Charts, Verbindungen
- **Lottie:** kleine Status-/Fokusbewegung
- **Charts/Zahlen:** messbare Entwicklung
- **Physical-Primitives:** nur wenn konkrete physische Mechanik wirklich hilft

## Kurzregel

> **YouTube: Remotion zuerst, echte Assets wenn real vorhanden, Flow nur mit Begründung und dann immer in der freigegebenen stylized-3D-FinanzNeo-Welt. Reels behalten ihr bestehendes IMAGE/ANIMATION-System. Immer die einfachste verständliche Darstellung wählen.**
