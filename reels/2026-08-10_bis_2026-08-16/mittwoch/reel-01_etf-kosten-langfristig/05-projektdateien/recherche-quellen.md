# Recherche & Quellen — ETF-Kosten langfristig

Stand: 12.08.2026

## Kernaussagen

- Verbraucherzentrale, Stand 12.03.2026: Bei der ETF-Auswahl soll unter anderem auf niedrige Kosten und ein hohes Fondsvolumen geachtet werden. Laufende ETF-Verwaltungsgebühren liegen laut Verbraucherzentrale häufig bei mehr als 0,2 % p.a.; aktiv gemanagte Aktienfonds liegen im Schnitt bei gut 1,5 % p.a.
- Verbraucherzentrale, Stand 21.07.2025: ETF-Gebühren liegen meist ungefähr zwischen 0,07 % und 0,3 % des Fondsvermögens; aktiv gemanagte Fonds häufig bei 1,5–2 %.
- Verbraucherzentrale-Finanzglossar: Verwaltungsgebühren werden direkt dem Fondsvermögen entnommen und sind deshalb nicht wie eine separate Rechnung auf dem Depotauszug sichtbar.
- BaFin: Kosten einer Geldanlage können die Rendite schmälern; Informationsdokumente und Kostenangaben sollen vor einer Anlage geprüft werden.

## Quellen

1. Verbraucherzentrale — ETF-Kauf: Auf diese Kriterien sollten Sie bei der Auswahl achten
   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/etfkauf-auf-diese-kriterien-sollten-sie-bei-der-auswahl-achten-16605
2. Verbraucherzentrale — Welche Vorteile und Nachteile haben ETFs?
   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/welche-vorteile-und-nachteile-haben-etfs-16603
3. Verbraucherzentrale — Finanzglossar
   https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/finanzglossar-durchblick-von-a-wie-aktien-bis-z-wie-zins-15907
4. BaFin — Geld anlegen im Ruhestand, Checkliste Kosten und Provisionen
   https://www.bafin.de/SharedDocs/Downloads/DE/Broschuere/dl_b_geldanlage_im_ruhestand.pdf?__blob=publicationFile&v=2

## Reproduzierbare Modellrechnung

Zweck: ausschließlich Illustration des langfristigen Kosteneffekts. Keine Renditeprognose und keine Anlageempfehlung.

Annahmen:
- monatliche Sparrate: 200 €
- Laufzeit: 30 Jahre = 360 Monate
- Einzahlungen: 200 € × 360 = 72.000 €
- angenommene Bruttorendite: konstant 6,0 % p.a.
- Szenario A: 0,2 % Kosten p.a. → vereinfachte Nettorendite 5,8 % p.a.
- Szenario B: 1,5 % Kosten p.a. → vereinfachte Nettorendite 4,5 % p.a.
- monatliche Einzahlung jeweils am Periodenende
- keine Steuern, Spreads, Orderkosten oder Tracking Difference in der Modellrechnung

Formel mit effektivem Monatszins:

r_m = (1 + r_p.a.)^(1/12) - 1
FV = Sparrate × ((1 + r_m)^n - 1) / r_m

Ergebnis gerundet:
- Szenario A, 5,8 %: ca. 188.012 € → im Reel rund 188.000 €
- Szenario B, 4,5 %: ca. 149.413 € → im Reel rund 149.000 €
- Differenz: ca. 38.599 € → im Reel rund 39.000 €

## Fachliche Grenzen

Die Rechnung behandelt die Kosten vereinfacht als direkte Reduktion einer konstanten Bruttorendite. Reale Kapitalmarktrenditen schwanken, tatsächliche Fondskosten und Tracking Difference können abweichen, und Steuern sowie Transaktionskosten verändern reale Ergebnisse. Die Zahlen sind deshalb ausschließlich ein transparentes Modellbeispiel.