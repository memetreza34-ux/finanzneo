# Visual DNA + Remotion Demo V1

Status: **ausführbarer Integrations-Test, nicht Produktion.**

## EINZIGER TEST-EINSTIEG

Für den eigentlichen Praxistest wird nur diese Datei benutzt:

`MASTER-TEST-FLOW-REMOTION.md`

Dort stehen in **einer einzigen Datei**:

- kompletter Ablauf
- Bild-01-Freigabe
- alle Google-Flow-Prompts
- alle Remotion-Spezifikationen
- Dateinamen
- Datenquelle
- QA-Regeln
- finale Szenenreihenfolge

Die übrigen Dateien in diesem Ordner sind nur technische Implementierung / Routing-Support und müssen für den manuellen Test nicht einzeln geöffnet werden.

## Demo-Ziel

Prüfen, ob FinanzNeo mit einer Mischung aus starken statischen Konzeptbildern und wenigen präzisen Remotion-Datenvisuals eine eigene, wiedererkennbare Sprache bekommt — ohne in jeder Szene eine Person zu zeigen.

## Demo-Thema

**„Warum kleine Kosten langfristig groß werden können“**

## 6-Szenen-Mix

| Szene | Route | Engine | Hauptvisual | Person? |
|---|---|---|---|---|
| 01 | `pressure-problem-image` | Google Flow | Budgetblock wird von kleinen Kosten-Tags sichtbar belastet | Nein |
| 02 | `money-flow-image` | Google Flow | Einkommen → Fixkosten/Gebühren → Rücklage | Nein |
| 03 | `data-line-remotion` | Remotion | echter S&P-500-Verlauf aus `public/data/sp500-10y.json` | Nein |
| 04 | `data-bar-remotion` | Remotion | erster vs. letzter Punktestand derselben Datenreihe | Nein |
| 05 | `human-context-image` | Google Flow | eine begründete Alltagentscheidung | Ja |
| 06 | `protection-buffer-image` | Google Flow | Rücklage bleibt nach Belastung sichtbar intakt | Nein |

## Routing-Dateien

- `routing-input.json` = inhaltliche Planung + explizite Hinweise
- `VISUAL-ROUTING-PLAN.json` = festgelegte Engine/Route pro Szene

Routing neu erzeugen:

```bash
node scripts/plan-visual-routing-v1.mjs \
  experiments/visual-dna-remotion-demo-v1/routing-input.json \
  --output experiments/visual-dna-remotion-demo-v1/VISUAL-ROUTING-PLAN.json
```

Der Router blockiert präzise Datenvisuals, wenn Quelle oder Datenstand fehlen.

## Echte Remotion-Demo

Composition:

`VisualDnaRemotionDemo`

Quelle:

`src/reels-test/VisualDnaRemotionDemo.tsx`

Render:

```bash
npx remotion render src/index.ts VisualDnaRemotionDemo out/visual-dna-remotion-demo-v1.mp4 --scale=0.5
```

Wichtig: Die vier Google-Flow-Routen werden in dieser Composition bewusst nur als **klar markierte Routing-/Design-Platzhalter** gezeigt. Sie sind keine behaupteten Flow-Ergebnisse. Szene 03 und 04 sind dagegen echte Remotion-Datenvisuals mit Daten aus `public/data/sp500-10y.json`.

## Was dieser Test beweisen soll

1. Eine FinanzNeo-Serie funktioniert mit nur einer begründeten Human-Context-Szene.
2. Datencharts können Teil derselben visuellen Marke sein, obwohl sie in Remotion entstehen.
3. Wiederkehrende Elemente — Emerald Money/Reserve, Cost Tags, Flow Bands, muted Gold — verbinden Bild und Remotion.
4. Animation bleibt sparsam: Reveal/Grow/Flow, keine Dauerbewegung.
5. Google Flow wird nicht für historische Datenkurven missbraucht.
6. Der Router entscheidet sichtbar zwischen `google-flow` und `remotion`.

## Akzeptanzkriterien

- keine Person als Standard-Füllmotiv
- keine exakte historische Kurve als KI-Bild
- exakte Datenvisuals enthalten Quelle + Datenstand
- Remotion-Visuals verwenden dieselbe semantische Farblogik wie die Bildwelt
- Bild 01 bleibt für spätere echte Flow-Produktionen Cover-/Visual-Anchor
- Szene 03/04 sind `animation` / Remotion, nicht `image`
- Serie bleibt bei unterschiedlichen Visualtypen als FinanzNeo erkennbar

## Noch offen

1. `MASTER-TEST-FLOW-REMOTION.md` praktisch ausführen
2. echte Flow-Bilder für Szene 01/02/05/06 erzeugen
3. diese vier Assets anstelle der Platzhalter einsetzen
4. vollständigen gemischten Render mit echten Flow-Bildern + Remotion-Datenvisuals prüfen
5. erst danach Routing V1 in die allgemeine Reel-Erstellung integrieren
