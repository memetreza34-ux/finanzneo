# FinanzNeo · Lottie Motion Library

Dieser Ordner enthält wiederverwendbare Lottie-Animationen (`.json`) für FinanzNeo.
Lottie ist ab sofort eine **gezielte Ergänzung** zu den realitätsnahen Remotion-/Three-Animationen — kein automatischer Ersatz für die Hauptszene.

## Einsatzprinzip

**Remotion / Three / HTML-Primitives** bleiben die erste Wahl für:

- reale Alltagssituationen;
- physische Ursache → Wirkung;
- Waschmaschine, Rechnung, Konto, Kalender, Haushaltsobjekte usw.;
- räumliche Interaktion, Tiefe und Kameraarbeit.

**Lottie** ist besonders geeignet für:

- Icon-Motion;
- Money-/Transfer-Akzente;
- Kalender-/Page-Flips;
- Check-/Warning-Motion;
- Ziel-/Wachstums-Akzente;
- kurze 2D/2.5D-Erklärbewegungen;
- unterstützende Micro-Animations.

Eine Lottie-Datei darf niemals eine verständliche reale Hauptmechanik durch eine generische Icon-/Card-Animation ersetzen.

## Antigravity + Lottie Creator MCP

Das Workspace-Plugin liegt unter:

```text
.agents/plugins/finanzneo-motion/
```

Es verbindet Antigravity mit dem offiziellen `lottiefiles-creator` MCP.

Produktive neue Lottie-Assets werden **vor dem Phase-1-Animation-Seal** erstellt und anschließend im Repo gespeichert. Nach dem Seal darf Phase 3 keine neue kreative Lottie-Variante erfinden.

Neue reel-spezifische Assets bevorzugt so ablegen:

```text
public/lottie/<reel-slug>/scene-XX-<purpose>.json
```

Beispiel:

```text
public/lottie/reel-02_notgroschen-richtig-aufbauen/scene-09-calendar-flip.json
```

Keine Remote-URL als Produktionsabhängigkeit. Finale JSON-Datei committen.

## Bestehendes Set

| Datei | Rolle | Geeigneter Einsatz |
|---|---|---|
| `muenzen.json` | Geld | Sparen / Geldfluss-Akzent |
| `muenze.json` | Geld | einzelne Einzahlung |
| `geldboerse.json` | Geld/Konto | verfügbares Geld |
| `sparschwein.json` | Sparen | Sparziel / Rücklage |
| `wachstum.json` | Wachstum | Wachstum / Balkenanstieg |
| `trend.json` | Trend | Aufwärtstrend |
| `trendauf.json` | Trend | Rendite steigt |
| `ziel.json` | Ziel | Ziel erreicht |
| `sicherheit.json` | Sicherheit | Schutz / Sicherheit |
| `zeit.json` | Zeit | Warten / Zeitfaktor |
| `konfetti.json` | Erfolg | sehr sparsamer Erfolgsakzent |
| `lupe.json` | Analyse | prüfen / vergleichen |
| `warenkorb.json` | Konsum | Ausgeben / Shopping |
| `warnung.json` | Warnung | Risiko / Achtung |

Diese Assets sind **Support-Layer**. Bei einem konkreten Reel muss immer geprüft werden, ob eine individuelle Lottie-Creator-Animation oder eine native Remotion-Bewegung verständlicher ist.

## Stil-Regel

- FinanzNeo-Farbrollen einhalten: Gold = Geld/Wert, Emerald = positiv, Warm Red-Orange = Warnung/Kosten;
- transparent, kein eingebauter Hintergrund;
- keine grellen Mehrfarb-Loops;
- keine generischen Dashboard-/Card-Kompositionen;
- keine dekorative Endlosschleife ohne Erklärfunktion;
- Lottie-Text ersetzt niemals Header oder Captions;
- maximal so viel Motion wie die Erklärung wirklich braucht.

## Sound

Lottie besitzt in FinanzNeo **keinen eigenen eingebetteten Ton**.
Soundeffekte werden separat in Remotion an konkrete Frames gekoppelt, z. B. Paper, Money, UI-Soft, Movement oder Mechanical.

## Lizenz der bestehenden Lordicon-Dateien

Ein Teil des bestehenden Sets stammt aus der bisherigen Lordicon-Bibliothek. Laut bisheriger Repo-Dokumentation wurde dafür die kostenlose kommerzielle Nutzung mit Attribution vorgesehen.

Wenn diese bestehenden Lordicon-Assets veröffentlicht werden, die jeweils geltenden Lizenzbedingungen erneut prüfen und die erforderliche Attribution beibehalten. Neue selbst erstellte Lottie-Creator-Assets getrennt von Drittanbieter-Assets behandeln.
