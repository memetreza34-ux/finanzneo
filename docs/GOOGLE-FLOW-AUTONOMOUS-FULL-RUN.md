# FinanzNeo — Google Flow Autonomous Full Run

Dieser Vertrag gilt für **alle neuen Reels** und für jede `03-szenen/alle-bildprompts.txt`.

## Grundregel

Der Google-Flow-KI-Agent arbeitet das **gesamte benötigte Bildset in einem einzigen autonomen Gesamtdurchlauf** ab. Es gibt keine Nutzer-Zwischenfreigabe zwischen Cover und Szenenbildern.

Verbindliche Marker:

```text
FLOW_EXECUTION_MODE: finanzneo-flow-autonomous-full-run-v2
FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v1
```

## Ausführung

1. Gesamte Masterdatei zuerst lesen.
2. Beim ersten benötigten Bild beginnen.
3. Immer nur **ein Bild gleichzeitig** erzeugen.
4. Intern warten, bis die aktuelle Bilderzeugung technisch vollständig abgeschlossen ist.
5. Bild sofort exakt umbenennen.
6. Motiv, Labels, Format, Bildwelt, Stil und Dateiname intern prüfen.
7. Bei Fehlern dieselbe Bildnummer neu erzeugen.
8. Nach bestandener QA **automatisch** mit dem nächsten benötigten Bild fortfahren.
9. Animations-/Remotion-Nummern automatisch überspringen.
10. Bis zum letzten benötigten Bild durchlaufen und erst dann den Gesamtdurchlauf beenden.

## Niemals auf den Nutzer warten

Zwischen Bildern ist ausdrücklich verboten:

- auf `weiter` zu warten
- auf `mach weiter` zu warten
- auf `okay` oder eine Bestätigung zu warten
- eine Nutzerfreigabe pro Bild einzufordern
- nach bestandener interner QA anzuhalten

Das Wort **warten** bedeutet im Flow-Kontext ausschließlich: auf die **technische Fertigstellung der aktuellen Bilderzeugung** warten. Es bedeutet niemals, auf eine Nutzernachricht zu warten.

## Struktur- und Stil-Lock bis zum Ende

Vom Cover bis zum letzten Bild bleiben unverändert:

- Reihenfolge und echte Szenennummern
- Dateinamenlogik
- 1:1-Quellformat
- FinanzNeo World-ID und Same-World-Lock
- Stylized-3D-Lock
- Materiallogik
- Farbrollen
- Lichtlogik
- nahtloser Hintergrund
- Text-/Label-Regeln
- QA-Reihenfolge

Jede Szene erhält eine **frische Komposition**, aber keine neue Bildwelt. Kein Stilwechsel, kein neues Layout-System und keine andere Prompt-Interpretation mitten im Durchlauf.

## Stop-Regel

Stoppen ist nur bei einem echten technischen Hard-Blocker zulässig, zum Beispiel wenn die Bilderzeugung technisch nicht fortgesetzt werden kann. Geschmacksfragen, normale QA, fehlendes `weiter` oder fehlende Nutzerbestätigung sind keine Stop-Gründe.

## Technische Absicherung

- `npm run reel:create` setzt diesen Vertrag automatisch über `scripts/create-finanzneo-reel.mjs` und `scripts/apply-flow-autonomous-contract.mjs`.
- `npm run reel:validate -- <Reel-Pfad>` prüft ihn über `scripts/validate-flow-autonomous-contract.mjs`.
- `npm run reel:ready -- <Reel-Pfad>` führt `reel:validate` mit aus und blockiert Phase 3, wenn der Vertrag fehlt.

Damit darf künftig kein neuer Reel mit einer `alle-bildprompts.txt` als produktionsbereit gelten, die zwischen Bildern auf eine Nutzernachricht wartet oder den Stil/Workflow unterwegs verändert.
