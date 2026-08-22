# Remotion-Animationen

Alle Animationen sind **Erklärmechanismen**, keine dekorativen Zoom-/Fade-Szenen. Jede Szene braucht einen lesbaren Startzustand, eine sichtbare Ursache/Handlung und einen klaren Endzustand.

## Szene 03 — Preise laufen auseinander

**Komponente:** `CategoryPriceDivergence`

**Ziel:** Zeigen, dass die Gesamtinflation nicht bedeutet, dass alle Preise um denselben Prozentsatz steigen.

**Startzustand:**
- Drei gleich große physische Kategorie-Podeste auf einer gemeinsamen Null-Linie.
- Links `Kraftstoff`, Mitte `Lebensmittel`, rechts `Haushaltsenergie`.
- Werte starten visuell bei `0,0 %`; keine Balken sind bereits ausgefahren.

**Handlung:**
1. Kraftstoff-Säule fährt deutlich nach oben und zählt sauber bis `+23,0 %`; warmes Rot-Orange nur für den Preisdruck.
2. Lebensmittel-Säule bewegt sich nur minimal nach oben bis `+0,4 %`.
3. Haushaltsenergie-Säule fährt leicht unter die Null-Linie bis `−1,4 %`; smaragdgrün für den Rückgang.
4. Die gemeinsame Null-Linie bleibt fix, damit der Unterschied sofort erkennbar ist.

**Endzustand:**
- Alle drei Werte stehen gleichzeitig sichtbar.
- Kleine Klammer/Leitlinie gruppiert sie unter `JULI 2026 vs. JULI 2025`.
- Kein zusätzlicher Gesamtwert, damit die Szene nicht überladen wird.

**Synchronisation:** Jede Säule erreicht ihren Zielwert genau in der Reihenfolge, in der sie im Voiceover genannt wird.

**Verboten:** bloße Balken, die fertig eingeblendet werden; alle Werte auf einmal; springende Zahlen; Aktienchart-Optik.

---

## Szene 05 — Gleiches Einkommen, andere persönliche Teuerung

**Komponente:** `TwoHouseholdBudgetWeights`

**Ziel:** Mechanisch zeigen, warum zwei Personen mit gleichem Einkommen unterschiedlich betroffen sein können, ohne eine erfundene persönliche Inflationszahl zu behaupten.

**Startzustand:**
- Zwei identische goldene Budget-Stapel mit Label `2.000 €`.
- Links `HAUSHALT A`, rechts `HAUSHALT B`.
- Beide Stapel sind gleich hoch.

**Handlung:**
1. Beide Budgets zerlegen sich in dieselben vier Kategorien: Wohnen, Mobilität, Lebensmittel, Energie.
2. Bei Haushalt A wird der Mobilitätsblock sichtbar groß; bei Haushalt B sichtbar klein.
3. Ein roter `Preisdruck`-Impuls trifft nur den Mobilitätsblock stark.
4. Der große Mobilitätsblock von A erzeugt sichtbar mehr Ausschlag auf einer Belastungswaage als der kleine Block von B.

**Endzustand:**
- Gleiches Einkommen bleibt oben sichtbar.
- Darunter zwei unterschiedlich stark ausgeschlagene Belastungsanzeigen.
- Textschluss: `ANDERE GEWICHTE → ANDERE BELASTUNG`.
- Keine fiktiven Prozent-Endwerte.

**Synchronisation:** Aufteilung bei „Ihre Ausgaben“, Belastungsunterschied bei „anders verteilt“.

**Verboten:** zwei statische Tortendiagramme ohne Veränderung; reine Texttafel; erfundene persönliche Raten.

---

## Szene 07 — Gewicht × Preisänderung

**Komponente:** `WeightedInflationMechanism`

**Ziel:** Die Gewichtungslogik so einfach visualisieren, dass ein Anfänger sie ohne Formel versteht.

**Startzustand:**
- Ein horizontaler Budgetbalken `DEIN MONAT` ist leer.
- Darunter vier physische Kategorie-Blöcke in unterschiedlichen Breiten.

**Handlung:**
1. Die Blöcke rasten nacheinander in den Budgetbalken ein; ihre Breite repräsentiert den Ausgabenanteil.
2. Über jedem Block erscheint eine kleine Preisänderungs-Markierung.
3. Ein breiter Block mit starker Preisänderung drückt eine Ergebniswaage sichtbar stärker als ein schmaler Block mit derselben Änderung.
4. Zwei Pfeile verbinden `GEWICHT` und `PREISÄNDERUNG` mit dem Ergebnis.

**Endzustand:**
- Deutliche Ursache-Wirkungs-Kette: `GROSSER ANTEIL` + `PREISÄNDERUNG` → `STÄRKERER EINFLUSS`.
- Keine mathematische Formel notwendig.

**Synchronisation:** Breitenaufbau bei „Je größer der Anteil“, Preisimpuls bei „Preisveränderung“, Waagenausschlag bei „stärker wirkt“.

**Verboten:** nur Text `Gewicht × Preis`; bloße Icons; statische Infografik ohne Prozess.

---

## Szene 08 — 2,8 % ist der Vergleichswert

**Komponente:** `OfficialVsPersonalInflation`

**Ziel:** Amtliche Rate und persönliche Gewichtung klar trennen.

**Startzustand:**
- Oben eine fest verankerte amtliche Referenzmarke `2,8 %` mit kleinem Label `DEUTSCHLAND`.
- Unten vier neutrale persönliche Budgetgewichte auf Schienen: Wohnen, Mobilität, Lebensmittel, Energie.

**Handlung:**
1. Amtliche 2,8-%-Marke bleibt unbewegt.
2. Die vier persönlichen Gewichte verschieben sich nacheinander in ihrer Größe.
3. Ein separater Ergebniszeiger `DEINE BELASTUNG` reagiert sichtbar auf die neue Gewichtung.
4. Keine konkrete persönliche Zahl wird angezeigt; der Zeiger zeigt nur „anders als Referenz“.

**Endzustand:**
- Oben: `2,8 % = VERGLEICHSWERT`.
- Unten: `DEINE AUSGABEN = DEINE GEWICHTUNG`.
- Visuell getrennte Systeme, verbunden durch eine dünne erklärende Linie.

**Synchronisation:** Referenz bleibt bei „nicht deine Rechnung“, Gewichte bewegen sich bei „deinen eigenen Ausgaben“, Ergebnis reagiert bei „Preisentwicklung“.

**Verboten:** amtliche 2,8 % animiert verändern; fiktive persönliche Endrate; App-/Dashboard-Look; dekorativer Graph ohne Mechanismus.

## Gemeinsame technische Regeln

- Native Remotion-Elemente; keine Google-Flow-Bilder in diesen vier Szenen.
- Bewegungen mit klarer physischer Logik, keine zufälligen Partikel als Hauptaktion.
- Werte bleiben nach ihrer Einführung stabil lesbar.
- Headline und Captions liegen außerhalb des zentralen Erklärbereichs.
- Kein wichtiges Objekt unter Subtitle-Bereich oder Plattform-UI.
- Finale Dauer jeder Animation wird aus dem echten Voiceover abgeleitet, nicht vorab fest auf Sekunden gezwungen.
