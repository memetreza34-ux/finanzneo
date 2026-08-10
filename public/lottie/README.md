# FinanzNeo · Lottie-Set (Profi-Animationen)

Professionelle Lottie-Animationen (`.json`), eingebunden via
`<LottieBox file="lottie/NAME.json" size={300} />`. **Profi-Qualität statt
selbstgemalter SVGs** — für Objekte/Effekte die echt aussehen müssen.
Alle auf **Brand-Farben** umgefärbt (Geld=Gold, Wachstum=Grün, Zeit=Blau).

## Das Set (14 Animationen) — semantisch nach Einsatz

| Datei | Farbe | Einsatz-Moment im Script |
|---|---|---|
| `muenzen.json` | gold | „100 € sparen" / Geld zur Seite legen |
| `muenze.json` | gold | einzelne Münze / „1 € am Tag" |
| `geldboerse.json` | gold | Konto / verfügbares Geld |
| `sparschwein.json` | gold | sparen / Sparplan |
| `wachstum.json` | grün | „dein Geld wächst" / Balkenchart hoch |
| `trend.json` | grün | Aufwärtstrend / Pfeil hoch (mit Decrease-Morph) |
| `trendauf.json` | grün | Rendite steigt |
| `ziel.json` | grün | Sparziel / „Ziel erreichen" |
| `sicherheit.json` | grün | „sicher / geschützt" / Wertpapier |
| `zeit.json` | blau | „du musst nur warten" / Zinseszins braucht Zeit |
| `konfetti.json` | — | „lass uns loslegen" / Erfolg / CTA |
| `lupe.json` | — | „schauen wir uns an" / analysieren |
| `warenkorb.json` | — | ausgeben / Konsum / „statt es auszugeben" |
| `warnung.json` | — | „Inflation frisst dein Geld" / Risiko / Achtung |

Übersicht ansehen: Composition **`LottieFinanzGrid`** in Remotion Studio.

## ⚖️ LIZENZ — wichtig (kostenlos, aber mit Bedingung)
Quelle: **Lordicon** (lordicon.com). Die Free-Lizenz erlaubt kommerzielle Nutzung
(auch YouTube) **kostenlos**, verlangt aber **Attribution**:
→ In jede **YouTube-Beschreibung** (am Ende, beim Disclaimer) diese Zeile:
**„Icons by Lordicon.com"**
Das ist alles. Kein Account, keine Zahlung. Wer das nicht will, kann Lordicons
Pro-Plan kaufen (dann ohne Attribution) — für uns reicht die Zeile.

## Neue Animation hinzufügen (2-Minuten-Rezept)
1. Auf **lottiefiles.com** oder **lordicon.com** die Animation suchen (Stil: outline/wired).
2. Als **Lottie JSON** herunterladen.
3. Hier ablegen, **nach Einsatz benennen** (z. B. `rakete.json`).
4. Falls Farbe nicht passt: Claude färbt auf Brand um (Recolor-Skript-Muster in der Git-History).
5. Im Code: `<LottieBox file="lottie/rakete.json" size={300} />`.

**Oder:** Arman schickt einen LottieFiles-Link → Claude bindet ihn ein.

## Stil-Regel
Outline/wired bevorzugt · Brand-Farben (Geld=Gold, Wachstum=Grün, Info=Blau) ·
keine grellen Mehrfarb-Animationen die mit der Marke brechen.
