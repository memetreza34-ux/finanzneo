# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument ist der verbindliche Stilanker für neue FinanzNeo-Bildszenen. Die technische World-ID bleibt bestehen, die visuelle Ausführung ist ab jetzt jedoch ein **heller Premium-3D/CGI-Editorial-Look**.

## 1. Serienprinzip

Alle Bilder eines Reels sollen sichtbar zusammengehören:

- hochwertiger moderner 3D/CGI-Editorial-Stil
- realistische Proportionen mit sauberer Premium-Stilisierung
- heller neutraler Hintergrund: warmes Off-White, helles Grau oder ähnlich
- FinanzNeo-Grün für Schutz, richtige Lösung und Fortschritt
- Gold nur für Geld und finanziellen Wert
- Rot nur für Risiko, Schulden, Verlust oder falsche Entscheidung
- große klare Smartphone-Motive
- wenige verständliche Hauptelemente
- professionelle Social-Media-/Editorial-Qualität

Nicht mehr gewünscht ist die frühere Auslegung als dunkle Neon-Studiowelt.

## 2. Verbotene Bildwelt

Nicht verwenden:

- schwarzer/dunkler Raum als Hauptlook
- grüne Neon-Tunnel
- Sci-Fi-Korridore
- futuristische Game-Level
- winzige isometrische Dioramen
- kleine schwebende Plattformen
- übermäßige Leuchtlinien
- komplizierte abstrakte Netzwerke ohne klare inhaltliche Funktion
- winzige Motive in großer leerer Fläche
- Pixar-, Clay- oder kindlicher Cartoon-Stil

## 3. Motivwahl

Jede Bildszene muss den gesprochenen Inhalt innerhalb ungefähr einer Sekunde verständlich machen.

Bevorzuge konkrete Alltagsobjekte, wenn sie die Aussage besser erklären:

- Waschmaschine / Haushaltsgerät
- Rechnung
- Portemonnaie
- Geld / Reserve / Sparkonto-Metapher
- Schild / Schutz
- Reparaturwerkzeug
- Einkaufsobjekte
- Haus / Strom / Versicherung

Abstrakte Finanzsysteme nur verwenden, wenn sie wirklich verständlicher sind als konkrete Gegenstände.

## 4. Komposition

- vertikale 9:16-Quelle
- ein dominantes Hauptmotiv
- Hauptmotiv ungefähr 70–85 % der nutzbaren Breite
- maximal ungefähr 3–5 klare Hauptelemente
- ausreichend große Motive für Smartphone-Anzeige
- ruhiger heller Hintergrund
- klare Leserichtung oder einfache Gegenüberstellung
- keine unnötigen Mini-Icons oder Dashboard-Kacheln

## 5. Deutscher Text im Bild

Jedes finale Bild enthält genau **eine kurze deutsche Kernaussage**, die im jeweiligen Szenenprompt exakt vorgegeben wird.

### Cover

Cover brauchen zwingend einen klaren deutschen Titel, der sofort sagt, worum es geht.

- groß
- fett
- moderne Sans-Serif-Typografie
- meist eine oder zwei kurze Zeilen
- im oberen Drittel oder einer anderen freien ruhigen Fläche

### Normale Bildszene

- möglichst 2–5 Wörter oder ein sehr kurzer Satz
- nur eine Kernaussage
- keine zusätzliche zweite Überschrift
- exakt deutsche Schreibweise
- sehr hoher Kontrast
- gut lesbar auf Smartphone-Größe

### Verboten

- englische Bildtexte
- Fantasiewörter
- zusätzliche zufällige Labels
- ungeprüfte Zahlen
- Logos
- Wasserzeichen
- App-UI

Wenn eine Zahl Teil der Aussage ist, wird sie vor der Bildgenerierung fachlich geprüft und im Prompt exakt festgelegt.

## 6. Farb- und Materiallogik

- Grün = Schutz, richtig, Fortschritt
- Gold = Geld und Wert
- Rot = Risiko, Schulden, Problem
- Off-White / helles Grau / Beige = Umgebung
- transparente Reservebehälter dürfen als Schutz-/Sparmetapher verwendet werden
- Schatten weich, hochwertig und realistisch
- Materialien klar und hochwertig, nicht spielzeughaft

## 7. Reel-spezifischer Weltprompt

Jedes Reel kann weiterhin besitzen:

```text
03-szenen/bildwelt.txt
03-szenen/bildwelt-referenz.png
```

Der Nutzer erstellt die tatsächlichen Bilder selbst. Antigravity generiert keine finalen Bilder.

Eine Referenz darf verwendet werden, um Helligkeit, Materialqualität, Farbwelt, Perspektivwirkung und Typografiestil konsistent zu halten.

## 8. Verbindlicher Promptaufbau

Jeder Bildprompt enthält mindestens:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
GOOGLE FLOW – FINALER DATEINAME:
BILDSTIL:
DEUTSCHER TEXT:
TEXTREGEL:
SZENENINHALT:
BILDAUSSAGE:
KOMPOSITION:
```

Bei einer Animationsszene gibt es keinen Bildprompt; die Szenennummer bleibt trotzdem reserviert.

## 9. Google-Flow-Ablauf

Für Nutzerbilder gilt:

```text
PROMPT LESEN
→ GENAU 1 BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + DEUTSCHEN TEXT + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Bildnummer = echte Szenennummer.

Beispiel:

```text
Szene 01 = Bild      → Bild 01
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03
```

Erst wenn alle benötigten Bilder fertig sind, kommen sie gemeinsam in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 10. Ablehnungskriterien

Ein Bild wird neu erzeugt, wenn mindestens einer dieser Punkte zutrifft:

- dunkle Neon-/Tunnel-/Sci-Fi-Welt
- Miniatur-Diorama statt großem verständlichem Hauptmotiv
- Motiv erklärt den gesprochenen Satz nicht sofort
- Motiv ist zu klein
- Bild wirkt billig oder spielzeughaft
- deutscher Bildtext fehlt
- deutscher Bildtext ist falsch geschrieben
- zusätzlicher englischer oder zufälliger Text erscheint
- Cover nennt das Thema nicht klar
- wichtige Bildteile oder der Bildtext würden beim Reel-Crop abgeschnitten
