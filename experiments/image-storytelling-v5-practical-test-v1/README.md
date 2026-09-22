# FinanzNeo Image Storytelling V5 — Praxistest V1

## Zweck

Dieser Test prüft die reale Bildwirkung der aktuellen FinanzNeo-Bildpipeline nach V5-Hardening und Vision-QA.

Er ist **kein Produktions-Reel** und wird nicht veröffentlicht.

Vergleichsbasis ist bewusst dasselbe Thema wie im früheren V4-Test:

> Warum trotz gutem Einkommen oft kein Vermögen übrig bleibt.

Dadurch lässt sich beurteilen, ob V5 tatsächlich abwechslungsreichere, stärkere und weniger katalogartige Bilder erzeugt.

## Testumfang

- 8 reine IMAGE-Szenen
- keine Animation
- kein Voiceover
- keine Captions
- keine Veröffentlichung
- Bildwelt unverändert: `finanzneo-stylized-3d-animated-black-v9`
- Ausgabe je Bild: 1:1
- Deep Black bleibt Pflicht
- Google Flow: strikt **ein Bildjob gleichzeitig**

## Bedienung

Für Google Flow wird **nur eine Datei** benötigt:

`alle-bildprompts.txt`

Die Datei komplett in Google Flow einfügen. Der Masterprompt enthält alle acht Bildaufträge, aber Flow muss sie strikt nacheinander abarbeiten:

```text
Bild 01 erzeugen
→ vollständig warten
→ Qualitätsprüfung
→ exakt umbenennen
→ erst dann Bild 02
→ ...
→ Bild 08
```

Kein Batch, keine parallelen Jobs, keine Collage und kein Kontaktbogen.

## Testfrage

Der Test ist bestanden, wenn die Folge nicht mehr wie acht Varianten derselben 3D-Erklärgrafik wirkt, sondern wie acht klar zusammengehörige, aber sichtbar verschieden inszenierte FinanzNeo-Szenen.

Besonders beobachten:

- Person + Tisch + Dokumente nicht dominierend
- sichtbare Unterschiede bei Kamera und Shot Scale
- unterschiedliche reale Umgebungen
- unterschiedliche Hauptmotive
- Handlung statt bloßer Objektanordnung
- klare Ursache/Wirkung
- wenig Text im Bild
- kein generischer Finance-Icon-Look
- kein photorealistischer Look
- V9-Welt bleibt trotzdem eindeutig konsistent

## A/B-Kriterium gegen V4

V5 gilt nur dann als sichtbare Verbesserung, wenn mindestens 6 von 8 Bildern folgende vier Bedingungen gleichzeitig erfüllen:

1. Finanzbotschaft innerhalb ca. 1–2 Sekunden verständlich.
2. Eigenständige, erkennbare Komposition gegenüber den Nachbarbildern.
3. Sichtbare Handlung, Spannung oder Konsequenz — keine statische Katalogszene.
4. Klar dieselbe FinanzNeo-V9-Welt.

## Nach der Generierung

Die acht finalen Dateien mit exakt den vorgesehenen Namen sichern. Danach können sie in den Repo-QA-Ablauf importiert werden:

```text
reel:image-vision:prepare -- ... --scene scene-XX
→ objektive Pixelprobe
→ multimodaler Pixel-Review
→ reel:image-vision:validate -- ... --scene scene-XX
```

Bei `REGENERATE` wird ausschließlich dieselbe Bildnummer neu erzeugt.
