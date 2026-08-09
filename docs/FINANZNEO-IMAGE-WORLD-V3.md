# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Die technische World-ID bleibt bestehen. Der verbindliche Look ist ein **hochwertiger dunkler 3D-Finanzstil mit großen klaren Motiven und kurzen deutschen Objekt-Beschriftungen**.

## 1. Grundlook

- Premium stylized 3D CGI finance illustration
- dunkler Anthrazit-/Tiefgrün-Look
- kontrolliertes smaragdgrünes Kantenlicht
- weiche hochwertige Bodenschatten
- klare Materialqualität
- Gold nur für Geld/Wert
- Rot nur für Risiko/Schulden/Verlust
- Weiß/Hellgrau für kurze Objekt-Beschriftungen
- große Smartphone-lesbare Hauptmotive
- nicht photorealistisch
- nicht kindlich
- kein Pixar, kein Clay

## 2. Komposition

- vertical 9:16
- ein großes dominantes Hauptmotiv
- ungefähr 65–85 % der nutzbaren Breite
- maximal 3–5 verständliche Hauptelemente
- konkrete Alltagsobjekte bevorzugen
- Aussage innerhalb einer Sekunde verständlich
- ruhiger dunkler Hintergrund mit Tiefe

Nicht verwenden:

- winzige isometrische Dioramen
- lange Neon-Tunnel
- Sci-Fi-Korridore
- futuristische Game-Level
- kleine schwebende Plattformen
- komplizierte abstrakte Netzwerke ohne Nutzen
- winzige Motive in riesiger leerer Fläche

## 3. Beschriftungsregel

### Strikt verboten

- Überschrift im KI-Bild
- Untertitel im KI-Bild
- ganzer erklärender Satz
- Absatz
- CTA
- große Werbeheadline

### Erlaubt und gewünscht

Nur kurze deutsche Objekt-Beschriftungen:

- normalerweise 1–3 Wörter
- direkt am oder nahe beim passenden Objekt
- klein bis mittelgroß
- klare moderne Sans-Serif-Schrift
- wenige Labels pro Bild

Beispiele:

```text
Notgroschen
Reparatur
Dispo
Ratenzahlung
Tagesgeld
Notfall
Konsum
500 €
Auffüllen
Wartezeit
Verlorene Zinsen
```

Keine englischen Wörter, Fantasietexte, zusätzlichen zufälligen Labels, Logos, Wasserzeichen oder App-Oberflächen.

## 4. Cover

Auch das Cover enthält **keine klassische Headline**.

Das Thema muss über Motiv + Objekt-Beschriftungen klar werden.

Beispiel:

```text
zentrale Reserve → Notgroschen
Stufe 1 → Stufe 1
Stufe 2 → Stufe 2
Stufe 3 → Stufe 3
```

Damit enthält das Cover Text, ohne als Poster mit großer Überschrift gestaltet zu sein.

## 5. Motivwahl

Bevorzuge konkrete Objekte:

- Waschmaschine / Haushaltsgerät
- Reparaturrechnung
- Portemonnaie
- Geldreserve
- Schild
- Kreditkarte
- Reparaturwerkzeug
- Shoppingobjekte
- Tagesgeld-/Reserve-Metapher

Abstrakte Systeme nur, wenn sie verständlicher sind als reale Objekte.

## 6. Farbregeln

- Grün = Schutz, richtig, Fortschritt
- Gold = Geld, Wert
- Rot = Risiko, Schulden, Verlust
- Dunkles Anthrazit/Tiefgrün = Grundwelt
- Weiß/Hellgrau = Beschriftungen

## 7. Google-Flow-Promptaufbau

Jeder Bildprompt enthält:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
GOOGLE FLOW – FINALER DATEINAME:
BILDSTIL:
TEXTREGEL:
BESCHRIFTUNGEN:
SZENENINHALT:
BILDAUSSAGE:
KOMPOSITION:
```

Bildnummer = echte Szenennummer.

Animationsszenen bekommen kein Bild und ihre Nummer bleibt reserviert.

## 8. Google-Flow-Ablauf

```text
PROMPT LESEN
→ GENAU 1 BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Erst nach allen Bildern gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 9. Ablehnungskriterien

Ein Bild muss neu erzeugt werden, wenn:

- große Headline im Bild
- Untertitel oder ganzer Satz im Bild
- falsche/englische/zusätzliche Labels
- winziges Diorama statt großem Hauptmotiv
- Neon-Tunnel/Sci-Fi-Korridor
- Motiv erklärt den Satz nicht
- falsche Farbwelt
- Beschriftung gehört nicht eindeutig zum Objekt
- Text ist schlecht lesbar oder falsch geschrieben
