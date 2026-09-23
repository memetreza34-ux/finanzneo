# Visual DNA + Remotion Demo V1

Status: **Plan für den ersten Integrations-Test, nicht Produktion.**

## Demo-Ziel

Prüfen, ob FinanzNeo mit einer Mischung aus starken statischen Konzeptbildern und wenigen präzisen Remotion-Datenvisuals eine eigene, wiedererkennbare Sprache bekommt — ohne in jeder Szene eine Person zu zeigen.

## Demo-Thema

**„Warum kleine Kosten langfristig groß werden können“**

## 6-Szenen-Mix

| Szene | Route | Hauptvisual | Person? | Zweck |
|---|---|---|---|---|
| 01 | `concept-image` | Ein starker FinanzNeo-Geldblock wird von mehreren kleinen Kosten-Tags sichtbar angeschnitten | Nein | Cover/Anchor, eigene Formensprache setzen |
| 02 | `money-flow-image` | Einkommen fließt auf Fixkosten, Gebühren und Rücklage; klare physische FinanzNeo-Flow-Bands | Nein | Mechanismus sofort verständlich machen |
| 03 | `data-line-remotion` | echter 10-Jahres-Verlauf eines Markt-/ETF-Beispiels | Nein | Exakte Entwicklung zeigen; Quelle + Stand Pflicht |
| 04 | `data-bar-remotion` | zwei Kosten-/Endwert-Szenarien direkt als Balken | Nein | Quantitativen Unterschied exakt vergleichen |
| 05 | `human-context-image` | eine einzige Alltagsszene, in der eine Person eine bewusste Finanzentscheidung trifft | Ja | Mensch nur dort, wo Entscheidung/Emotion wirklich hilft |
| 06 | `protection-buffer` / `concept-image` | Emerald-Rücklage bleibt nach Belastung sichtbar intakt | Nein | ruhiger Payoff und wiederkehrendes FinanzNeo-Motiv |

## Was dieser Test beweisen soll

1. Eine FinanzNeo-Serie funktioniert auch mit nur einer Human-Context-Szene.
2. Datencharts sehen wie Teil derselben Marke aus, obwohl sie in Remotion entstehen.
3. Wiederkehrende Elemente — Emerald Money/Reserve, Cost Tags, Flow Bands, muted Gold — verbinden Bild und Remotion.
4. Animation bleibt sparsam: Reveal/Grow/Flow, keine Dauerbewegung.
5. Google Flow erfindet keine historischen Datenkurven.

## Akzeptanzkriterien

- keine Szene wirkt wie generischer Dashboard-Screenshot
- keine Person wird als Füllmotiv eingesetzt
- exakte Datenvisuals enthalten Quelle + Stand
- Remotion-Visuals verwenden dieselbe semantische Farblogik wie Bilder
- Bild 01 definiert weiterhin den Cover-Anchor für die generierten Bildszenen
- Szene 03/04 werden nicht als KI-Bild erzeugt
- Serie bleibt auch bei unterschiedlichen Visualtypen klar als FinanzNeo erkennbar

## Nächster technischer Schritt

Nach grünem CI auf PR #100:

1. Routing-Metadaten in den Szenenplan integrieren.
2. eine echte Demo-Composition für `FinanceDataVisual` anlegen.
3. vorhandene reale Daten (`public/data/*.json`) für die Line-Demo nutzen.
4. Screenshot/Render der Demo gegen Visual DNA V1 prüfen.
