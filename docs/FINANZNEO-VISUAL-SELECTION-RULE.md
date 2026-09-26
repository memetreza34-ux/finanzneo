# FinanzNeo Visual Selection Rule V2

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v2`

## Kernprinzip

Nicht mit einem Tool beginnen. Immer zuerst:

```text
Sprechpunkt
→ was muss der Zuschauer verstehen oder erinnern?
→ welches Visual macht das am schnellsten klar?
→ erst dann Werkzeug wählen
```

**Komplexer Inhalt bedeutet nicht komplexes Visual.**

## YouTube Longform

`YOUTUBE_VISUAL_PROFILE: finanzneo-youtube-simple-finance-v2`

Für YouTube gibt es keinen pauschalen „Remotion zuerst“-Zwang mehr. Das letzte Hybrid-Video war dadurch zu Remotion-lastig. Ab jetzt gilt **content-first**.

### Vier mögliche Hauptformen

#### 1. Bild

Nutzen, wenn konkrete Situation, Emotion, Alltag oder räumliche Ursache/Wirkung die beste Denkstütze ist.

Beispiele:
- unerwartete Reparatur;
- Einkauf / Alltag;
- Entscheidung vor einem Kauf;
- Gehalt kommt an, aber Wallet bleibt dünn.

#### 2. Bild + Remotion

Nutzen, wenn das Bild den Kontext merkbar macht und Remotion zusätzlich exakt erklären soll.

Beispiele:
- Alltagsszene + Zahl;
- 3D-Bild + Geldfluss;
- Bild + Pfeil/Highlight;
- Bild + Vorher/Nachher-Wert;
- Bild + animierte Kostenaufschlüsselung.

Das ist in Phase B eine **vollwertige Hauptform**, kein Notbehelf.

#### 3. Reine Remotion

Nutzen, wenn Zahl, Vergleich, Prozess, Aufteilung oder Entwicklung ohne Bild schneller und klarer ist.

Beispiele:
- Gehalt 2.500 € → 3.000 €;
- Ausgaben steigen mit;
- Fixkostenbalken;
- Zeitverlauf;
- Spar-/Investitionsaufteilung.

Reine Remotion darf in Phase B die volle 1920×1080-Fläche nutzen.

#### 4. Echtes Asset

Nutzen für reale Website, App, Dokument, Factsheet, Quelle, Logo oder Produkt, wenn Realität wichtig ist.

## Phase-B-Balance

Keine harte Quote, aber als Schutz gegen monotone Videos:

- ungefähr 25–40 % Bild;
- ungefähr 30–50 % Bild + Remotion;
- ungefähr 20–35 % reine Remotion.

Diese Bereiche dürfen verlassen werden, wenn der Inhalt es klar verlangt. Sie sollen nur verhindern, dass ein Hybrid-Video fast nur aus Remotion oder fast nur aus Bildern besteht.

## Menschen-Regel

Menschen/Figuren sind **kein Default**.

Ein Mensch ist sinnvoll, wenn mindestens einer dieser Punkte erfüllt ist:
- Reaktion erklärt etwas;
- Entscheidung ist der Kern;
- Aufmerksamkeit/Fokus ist der Kern;
- Konsequenz wird durch die Person klarer.

Nicht sinnvoll:
- Mensch steht nur dekorativ neben einer Zahl;
- dieselbe Figur schaut immer wieder fragend auf Objekte;
- mehrere Szenen hintereinander nutzen dieselbe Menschen-Schablone.

Weiche Orientierung: ungefähr maximal 40 % Menschenszenen, außer die Story braucht bewusst mehr.

## Abstraktions-Guard

Abstrakte Balken, Blöcke, Wege, Karten oder 3D-Schemata nur nutzen, wenn sie den Gedanken wirklich schneller erklären.

Prüfung:

> Würde der Zuschauer das Schema ohne Voiceover in 1–2 Sekunden ungefähr verstehen?

Wenn nein:
- konkreten visuellen Anker ergänzen;
- oder Bild + Remotion wählen;
- oder das Schema vereinfachen.

Mehrere abstrakte Schemata direkt hintereinander vermeiden, wenn konkrete Bilder oder Hybride dazwischen die Erinnerung verbessern.

## Flow-Regel

Wenn Flow gewählt wird, bleibt die freigegebene Bildwelt verbindlich:

`config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt`

Referenz:

`youtube/warum-dein-geld-verschwindet-images-only`

Pflicht:
- premium stylized 3D animation-film look;
- deep-black FinanzNeo-Welt;
- hochwertige gerundete Geometrie;
- stilisierte, nicht photorealistische Figuren;
- kein blanker Faceless-Mannequin-Look;
- sichtbare Story/Beziehung statt Katalog-Inszenierung.

Flow-Bilder selbst bleiben niemals fullscreen.

## Text und Zahlen

Wichtige exakte Texte, Zahlen, Vergleiche und Labels gehören in Remotion bzw. das finale Video-Layout.

Ausnahme Thumbnail:
- finale Headline ist Pflicht;
- sie muss vor Export sichtbar sein;
- wenn Flow die kurze Headline erzeugt, muss sie exakt stimmen, sonst regenerieren;
- bevorzugt wird exakte Typografie im finalen Thumbnail-Layout.

## Full-Frame-Motion

In Phase B darf eine reine Remotion-Szene die komplette 1920×1080-Fläche nutzen.

- keine künstliche Beschränkung auf das Flow-Visualfenster;
- mindestens ca. 64 px Safe Area für kritische Inhalte;
- keine wichtigen Elemente außerhalb des Frames;
- kein unbeabsichtigtes Clipping/Cropping;
- Überschrift/Icon können als Teil der Full-Frame-Komposition integriert werden.

Bei Bild + Remotion bleibt das Flow-Bild contained; Motion darf darüber hinausgehen, wenn es die Erklärung verbessert.

## Qualitätsfragen

Vor jeder Szene:

1. Was soll der Zuschauer nach 1–2 Sekunden verstanden haben?
2. Braucht die Szene wirklich einen Menschen?
3. Ist ein konkretes Bild merkbarer als eine abstrakte Grafik?
4. Würde Bild + Remotion besser funktionieren als nur eines von beiden?
5. Wenn reine Remotion: nutzt sie die verfügbare Fläche sinnvoll und ohne Cropping?
6. Wenn Flow: passt das Bild exakt zur freigegebenen Bildwelt?
7. Ist wichtige Schrift/Zahl exakt und lesbar?
8. Wiederholt die Szene unnötig die Visual-Logik der letzten Szenen?
9. Kann etwas entfernt werden, ohne Verständnis zu verlieren?

## Reels

Die bestehenden Reel-Regeln bleiben unverändert. Für Reels gilt weiterhin das dort definierte IMAGE/ANIMATION-System; diese YouTube-Hybrid-Regeln werden nicht automatisch auf Reels übertragen.

## Kurzregel

> YouTube Phase B: content-first. Bild, Bild+Remotion und reine Remotion bewusst mischen. Menschen nur bei echtem Mehrwert. Abstraktion nur wenn sie erklärt. Reine Motion darf Full-Frame sein. Flow bleibt contained. Thumbnail immer mit finaler Schrift.
