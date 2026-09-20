# Motion Mechanic Ledger — Girokonto oder Tagesgeld?

Pilot für FinanzNeo Motion Director V2.

| Scene | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE |
|---|---|---|---|---|---|
| scene-03 | `fn-daily-cashflow` | Girokonto als Cashflow-Hub | Gehalt wird aufgenommen, danach gehen zwei zeitlich getrennte Alltagszahlungen zu Miete und Einkauf | links → Mitte → diagonal links/rechts unten | zwei bezahlte Ausgaben, Giro bleibt aktiver Hub |
| scene-06 | `fn-role-partition` | physische Rollen-Trennung | Trennwand setzt sich zwischen Giro und Tagesgeld; nur die Giro-Seite wird durch eine Rechnung belastet | vertikal in der Mitte + kurzer lokaler Abfluss links | ALLTAG und RÜCKLAGE räumlich getrennt |
| scene-09 | `fn-account-transfer` | feste Geld-Einheit | fester Betrag löst sich vom Girokonto, wandert zum Tagesgeld und wird dort absorbiert | links → rechts | Tagesgeld-Füllstand steigt |
| scene-10 | `fn-result-lock` | verriegelter Zwei-Rollen-Endzustand | Giro und Tagesgeld setzen sich nach außen; Mittelverschluss rastet ein | Mitte → außen + Verschluss nach unten | GIRO HEUTE / TAGESGELD SPÄTER bleibt stabil |

## Anti-Wiederholungs-Check

- keine `MECHANIC_ID` doppelt
- scene-03 ist die einzige Mehrfach-Cashflow-Szene
- scene-06 erklärt Rollen durch eine physische Partition statt durch einen Konto-Transfer
- scene-09 ist die einzige Konto-zu-Konto-Transfer-Szene
- scene-10 enthält bewusst keine weitere Zahlung; sie schließt das Reel mit einem Result-Lock
- Farbwechsel, Labels oder Kamera werden nicht als eigenständige Variation gezählt

## Neue Pilot-Mechaniken

`fn-daily-cashflow` und `fn-role-partition` sind reel-spezifische Erweiterungen, weil keine V1-Familie die jeweilige Aussage semantisch sauber abdeckt. Sie werden erst nach erfolgreicher Pilot-QA als mögliche allgemeine Mechanik-Familien bewertet.
