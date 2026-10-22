# Externe Support-Assets — Video 01

Dieser Ordner ist ausschließlich für lokal gespeicherte, lizenzgeprüfte Support-Assets aus den in Phase 1 freigegebenen Slots.

## Quelle der Wahrheit

- Slot-Plan: `../../06-projektdateien/external-assets-manifest.json`
- Lizenz-/Quellenregeln: `../../../../docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`
- Asset-Ledger: `external-assets-ledger.json`

## Erlaubte Dateitypen

- B-Roll: `.mp4`, `.mov`, `.webm`
- Icons: `.svg`
- Fotos: `.png`, `.jpg`, `.jpeg`, `.webp`
- Lottie: `.json`

## Dateinamen

Dateien beginnen immer mit der Slot-ID, zum Beispiel:

```text
BR-01_washing-machine-repair.mp4
BR-02_brake-disc-repair.mp4
IC-09_house.svg
IC-09_shopping-basket.svg
LO-SUPPORT_check.json
```

## Harte Regeln

- Kein Asset ohne passenden Slot im Manifest.
- Kein Asset ohne Ledger-Eintrag produktiv verwenden.
- Keine Remote-URL im Render.
- Keine API-Keys oder Tokens in Dateien/Code.
- Keine Assets mit unklarer kommerzieller Lizenz.
- Keine Logos/Wasserzeichen oder lesbare persönliche Daten.
- Ein optionaler Slot darf leer bleiben, wenn kein guter Treffer existiert.
- Externe Assets dürfen die versiegelte Hauptmechanik einer Motion-Szene nicht verändern.

## Phase 3

Phase 3 darf einen geplanten Slot füllen, lokal speichern und technisch integrieren. Crop, Scale, Mask, Farbangleichung und Timing sind erlaubt, solange der kreative Motion-Vertrag unverändert bleibt.

Wenn ein Asset eine kreative Änderung des versiegelten `animation.tsx` erfordern würde: nicht integrieren; zurück zu Phase 1.
