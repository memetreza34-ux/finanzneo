# FinanzNeo · Lottie-Set (Profi-Animationen)

Hier liegen professionelle Lottie-Animationen (`.json`), die der Baukasten via
`<LottieBox file="lottie/NAME.json" />` einbindet. **Profi-Qualität statt
selbstgemalter SVGs** — für Objekte/Effekte die echt aussehen müssen.

## Namens-Konvention (semantisch, nach Einsatz)

| Datei | Einsatz-Moment im Script |
|---|---|
| `warnung.json` | „Inflation frisst dein Geld" / Gefahr / Achtung |
| `konfetti.json` | „lass uns loslegen" / Erfolg / CTA |
| `lupe.json` | „schauen wir uns an" / analysieren / prüfen |
| `warenkorb.json` | ausgeben / Konsum / „statt es auszugeben" |
| `rakete.json` | *(fehlt)* „starten" / „2026 anfangen" |
| `wachstum.json` | *(fehlt)* „dein Geld wächst" |
| `muenzen.json` | *(fehlt)* „100 € sparen" |
| `sanduhr.json` | *(fehlt)* „du musst nur warten" |
| `schild.json` | *(fehlt)* „sicher / geschützt" |
| `prozent.json` | *(fehlt)* „7 % Rendite" |
| `bank.json` | *(fehlt)* „Depot eröffnen" |

## Neue Animation hinzufügen (2-Minuten-Rezept)

1. Auf **lottiefiles.com** oder **lordicon.com** die gewünschte Animation suchen
   (Stil: outline / wired, passend zu Grün/dunkel).
2. Als **Lottie JSON** herunterladen (gratis Account reicht).
3. Datei hier ablegen und **nach Einsatz benennen** (z. B. `rakete.json`).
4. Fertig — im Code: `<LottieBox file="lottie/rakete.json" size={300} />`

**Oder:** Arman schickt einen LottieFiles-Link in den Chat → Claude bindet ihn ein.

## Stil-Regel
Outline/wired bevorzugt · passt zu `#00D26A` Grün auf dunklem BG · keine grellen
Mehrfarb-Animationen die mit der Marke brechen.
