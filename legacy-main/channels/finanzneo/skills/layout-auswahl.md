# Skill: Layout, Motion und Übergang auswählen

## Eingang

Eine geplante Szene mit:

- Verständnisziel
- `voiceText`
- verfügbaren Assets
- ungefährer Dauer
- inhaltlicher Beziehung zur vorherigen Szene

## Layoutauswahl

| Aussage | Layout | Variante |
|---|---|---|
| starke Hook mit Motiv | `full-bleed` | `default` |
| wichtiges Detail im Motiv | `full-bleed` | `detail-focus` |
| einzelnes redaktionelles Bild | `framed-image` | `default` |
| Bild plus Zahl oder Erklärung | `framed-image` | `split-left` oder `split-right` |
| 2–4 zusammenhängende Teilbilder | `framed-image` | `multi-2`, `multi-3` oder `multi-4` |
| eine zentrale Zahl | `big-number` | `default` |
| nachvollziehbare Rechnung | `big-number` | `calculation` |
| zwei Optionen oder Zustände | `split-comparison` | `before-after` |
| Schritte oder Ablauf | `process` | `default` |
| konkrete Prüfpunkte | `process` | `checklist` |
| Werteentwicklung | `chart` | `default` |
| zeitliche Entwicklung | `chart` | `timeline` |
| Kernaussage | `text-punch` | `default` |
| abschließende Erkenntnis | `text-punch` | `payoff` |
| Kommentarhandlung | `cta` | `default` |

## Vorgehen

1. Verständnisziel bestimmen.
2. einfachstes passendes Muster wählen.
3. bei 5–8 Sekunden zwei bis drei inhaltliche Phasen festlegen.
4. `assetId` nur setzen, wenn tatsächlich ein anderes Bild eingeblendet wird.
5. bei `detail-focus` einen relativen Fokuspunkt festlegen.
6. Übergang nach der Beziehung zur vorherigen Szene wählen.
7. höchstens einen semantischen SFX-Cue ergänzen.
8. nur notwendige Assets anfordern.

## Übergangssprache

| Beziehung | `transition` | Verwendung |
|---|---|---|
| neuer klarer Fakt | `cut` | direkt, schnell, ohne künstliche Bewegung |
| Ursache führt zur Folge | `push` | Richtung der Erklärung fortsetzen |
| Gegenüberstellung oder Wechsel | `wipe` | zwei Zustände sauber trennen |
| Gesamtbild wird Detail oder Ergebnis | `zoom-through` | nur bei echter räumlicher beziehungsweise inhaltlicher Verbindung |
| gleiches Objekt verändert seine Bedeutung | `match-move` | Position oder Form zwischen Szenen beibehalten |

Regeln:

- Nicht mehr als zwei auffällige Übergänge hintereinander.
- `cut` ist der Standard und kein Qualitätsmangel.
- Kein Glitch, Lichtleck oder Kamerawackler ohne inhaltliche Bedeutung.
- Ein Übergang darf die erste wichtige Information der neuen Szene nicht verdecken.

## Motion-Sprache innerhalb einer Szene

Claude Code plant nur diese Bewegungsarten:

- **Reveal:** neues Element wird sichtbar.
- **Focus:** wichtiges Detail wird isoliert oder vergrößert.
- **Build:** Zahl, Rechnung, Prozess oder Chart entsteht schrittweise.
- **Compare:** zwei Zustände werden gleichzeitig lesbar und anschließend bewertet.
- **Payoff:** Kernaussage erhält eine einmalige stärkere Betonung.

Nicht als eigenständige Motion akzeptiert:

- langsamer Zoom ohne neue Information
- dauerhaftes Schweben aller Elemente
- zufällige Partikel
- wiederholtes Pulsieren
- Bewegung nur zum Füllen leerer Fläche

## Ausführbare Phasen

```json
{
  "layout": "full-bleed",
  "variant": "detail-focus",
  "transition": "match-move",
  "visualPhases": [
    {"at": 0, "action": "Gesamtmotiv zeigen"},
    {
      "at": 0.48,
      "action": "entscheidendes Detail fokussieren",
      "focus": {"x": 0.7, "y": 0.42, "radius": 0.18, "scale": 1.2}
    },
    {
      "at": 0.74,
      "action": "Ergebnisbild einblenden",
      "assetId": "images-03-ergebnis"
    }
  ]
}
```

`x` und `y` liegen zwischen 0 und 1. Sie beschreiben die Position relativ zum Bild, nicht feste Pixel.

## Effekte

Erlaubt sind nur Effekte mit Aussage:

- Count-up oder Ergebnislandung für Zahlen
- Fokusmaske für ein relevantes Detail
- gezeichneter Pfad für Chart oder Geldfluss
- roter Warnimpuls für Verlust oder Risiko
- grüner Bestätigungsimpuls für ein Ergebnis
- einmaliger Ergebnisstempel oder Unterstrich beim Payoff

Nicht automatisch einsetzen:

- Lottie, Rive, Three.js oder GSAP
- Partikelsysteme
- Light Leaks
- Glitch
- Motion Blur

Diese Bibliotheken werden nur verwendet, wenn eine vorhandene Finance-V1-Komponente die Aussage nachweislich nicht darstellen kann.

## Fehlerfälle

- Zoom allein ist keine Phase.
- `detail-focus` ohne Fokuspunkt ist ungültig.
- Phasen-Asset muss im Manifest existieren.
- Multi-Panel benötigt mindestens so viele Assets wie Panels.
- Multi-Panel ohne Reihenfolge oder Vergleich nicht verwenden.
- nicht mehr als zwei gleiche sichtbare Muster hintereinander.
- keine neue Layoutkomponente, solange eine vorhandene Variante die Aussage sauber darstellt.
- keine neue Animationsbibliothek für einen einmaligen Effekt einführen.
