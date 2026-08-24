# Animationen

Alle sechs Animationen verwenden dieselbe Premium-Bühne und dieselbe Grammatik: STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS. Kein dekoratives UI, keine schwarzen Texte, keine reinen Zoom-/Fade-Szenen.

## Szene 02 — Euro startet die Sofortumrechnung
START: Lokaler Kaufbetrag liegt als physischer Preisblock neben einem Karten-Terminal. Zwei Wahlplaketten: EURO und LOKAL.  
MECHANISMUS: EURO wird gewählt; der lokale Betrag bewegt sich durch einen klar beschrifteten DCC-Umrechnungsblock.  
ERGEBNIS: Ein Euro-Beleg erscheint stabil mit Label `SOFORT IN EURO`. Aussage: Händler/ATM-Anbieter übernimmt die direkte Umrechnung.

## Szene 04 — DCC-Kurs kann Aufschläge enthalten
START: Lokaler Betrag + neutraler Wechselkursblock.  
MECHANISMUS: Ein rot-oranger Aufschlagskeil schiebt sich sichtbar in den DCC-Kurs; kein erfundener Prozentwert.  
ERGEBNIS: Euro-Endbetrag steht rechts, darunter `EIGENER DCC-KURS`; Aufschlag bleibt als Warnbestandteil sichtbar.

## Szene 06 — Landeswährung lässt deine Karte umrechnen
START: Lokaler Kaufbetrag und Bankkarte.  
MECHANISMUS: Betrag läuft nicht zum Händler-Umrechner, sondern sichtbar zur Bank/Kartenanbieter-Seite.  
ERGEBNIS: Euro-Buchung erscheint erst hinter dem Kartenanbieter-Block. Label `KARTENANBIETER RECHNET UM`.

## Szene 09 — Zwei Umrechner, zwei Wege
START: Ein identischer lokaler Betrag in der Mitte.  
MECHANISMUS: Zwei getrennte Pfade werden nacheinander sichtbar: DCC-Anbieter und Kartenanbieter. Keine Aussage, dass ein konkreter Pfad immer günstiger ist.  
ERGEBNIS: Beide enden bei Euro-Beträgen mit Label `KONDITIONEN VERGLEICHEN`; DCC-Pfad erhält einen dezenten Warnakzent.

## Szene 11 — Kurs und Gebühren getrennt prüfen
START: Lokaler Kaufbetrag.  
MECHANISMUS: Erst Wechselkurs-Schritt, danach separater Gebühren-Schritt mit optionalem Kartengebühr-Tag.  
ERGEBNIS: Zwei klar getrennte Prüfblöcke bleiben sichtbar: `WECHSELKURS` + `KARTENGEBÜHREN`.

## Szene 14 — Merksatz
START: Terminal mit zwei Wahlplaketten EURO und LANDESWÄHRUNG.  
MECHANISMUS: EURO führt sichtbar zu `DCC`; LANDESWÄHRUNG führt sichtbar zu `KARTENANBIETER`.  
ERGEBNIS: Beide Pfade bleiben stabil nebeneinander, mit Fokus auf `EURO = OFT DCC` und `LOKAL = KARTENANBIETER`.
