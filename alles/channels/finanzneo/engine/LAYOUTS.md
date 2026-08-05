# Finance V1 — Layout-System

## Prinzip

- acht wiederverwendbare Grundbausteine
- zwölf sichtbare Layoutmuster
- zwei bis drei ausführbare Phasen für längere Szenen
- neue Komponenten nur, wenn kein vorhandenes Muster die Aussage sauber erklärt

## Zwölf sichtbare Layoutmuster

| Muster | Technische Basis | Einsatz |
|---|---|---|
| Full Bleed Hero | `full-bleed` | starke Hook und Hauptmotiv ab Frame 0 |
| Detail Focus | `full-bleed` | aus Gesamtbild auf ein wichtiges Detail führen |
| Framed Editorial | `framed-image` | redaktionelles Bild mit Einordnung |
| Split Image/Text | `framed-image` | Motiv plus Zahl oder Erklärung |
| Multi Panel 2/3/4 | `framed-image` | Reihenfolge, Vergleich oder mehrere Ebenen |
| Big Number | `big-number` | zentrale Zahl oder Prozentwert |
| Calculation Build | `big-number` | Rechnung schrittweise aufbauen |
| Comparison / Before-After | `split-comparison` | zwei Zustände direkt gegenüberstellen |
| Process / Checklist | `process` | Ablauf oder konkrete Prüfpunkte |
| Chart / Timeline | `chart` | Entwicklung über Werte oder Zeit |
| Text Punch / Payoff | `text-punch` | Erkenntnis oder Schlussfolgerung |
| CTA | `cta` | Handlung und Nutzen ohne Nachlauf |

## Varianten

```text
default
detail-focus
split-left
split-right
multi-2
multi-3
multi-4
calculation
before-after
timeline
checklist
payoff
```

Varianten nutzen dieselben Grundkomponenten und verändern Anordnung, Assets und Choreografie.

## Ausführbare `visualPhases`

```json
[
  {"at": 0, "action": "Gesamtmotiv zeigen"},
  {
    "at": 0.45,
    "action": "relevantes Detail fokussieren",
    "focus": {"x": 0.68, "y": 0.42, "radius": 0.18, "scale": 1.2}
  },
  {
    "at": 0.74,
    "action": "Ergebnisbild einblenden",
    "assetId": "images-03-ergebnis"
  }
]
```

- `at` ist ein Anteil der Szenendauer von 0 bis 1.
- `focus` wird relativ zum Bild gespeichert und steuert Position, Radius und Zielskalierung.
- `assetId` blendet ein anderes vorhandenes Asset ein.
- Debug-Punkte sind nur mit `debug: true` sichtbar und erscheinen nie im normalen Produktionsrender.

## Regeln

- Zoom allein ist keine Phase.
- Jede Phase verändert das Verständnis.
- Szenen ab fünf Sekunden benötigen mindestens zwei Phasen.
- Szenen ab acht Sekunden benötigen normalerweise drei Phasen.
- `detail-focus` benötigt relative Fokuskoordinaten.
- Multi-Panel benötigt mindestens so viele Assets wie Panels.
- Multi-Panel nur bei echter Reihenfolge, Gegenüberstellung oder inhaltlichen Ebenen.
- höchstens zwei gleiche sichtbare Muster hintereinander.
- nicht alle zwölf Muster müssen in einem Reel vorkommen.
