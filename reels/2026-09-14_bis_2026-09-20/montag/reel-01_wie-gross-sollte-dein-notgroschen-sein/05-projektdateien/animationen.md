# Animationen — Phase 1 Korrektur V3

PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1
FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1

Die erste Renderfassung war sichtbar zu ähnlich: mehrere Szenen bestanden im Kern aus Konto/Reserve/Münzen nebeneinander. Die korrigierten Quellen trennen deshalb nicht nur IDs, sondern die tatsächliche Hauptsprache.

## scene-03 — three-salary-blocks-fill-one-reserve
**Verständnisziel:** Die Faustregel meint ungefähr zwei bis drei vollständige Monatsgehälter.

**Sichtbare Mechanik:** Drei gleichartige Monatsgehalt-Stapel erscheinen nacheinander; ein einziger großer Reservebehälter steigt exakt in drei klaren Stufen.

**Hauptobjektfamilie:** `PhysicalReserveTank` + Goldstapel. Keine Konten, Kalender oder ETF-Karte.

## scene-06 — liquid-cash-chooses-stable-access
**Verständnisziel:** Notfallgeld braucht stabilen, kurzfristigen Zugriff; ein Marktwert kann gerade dann schwanken.

**Sichtbare Mechanik:** Ein einziges Tagesgeldkonto bleibt stabil. Rechts schwankt ein eigenständiger roter ETF-Marktpfad. Danach bewegt sich der Goldstapel klar zum Tagesgeld.

**Hauptobjektfamilie:** `PhysicalAccount` + eigenständiger SVG-Marktpfad. Kein zweites Konto, kein Reservetank.

## scene-09 — three-calendar-auto-save-rhythm
**Verständnisziel:** Ein kleiner fester Betrag wird automatisch jeden Monat wiederholt.

**Sichtbare Mechanik:** SEP, OKT und NOV werden nacheinander aktiv; unter jedem Kalender erscheint derselbe kleine Betrag und bleibt sichtbar stehen.

**Hauptobjektfamilie:** `PhysicalCalendarPage` + kleine Goldstapel. Kein Konto, kein Reservetank.

## scene-10 — safety-vault-unlocks-investment-step
**Verständnisziel:** Erst Sicherheitsstufe abschließen, danach langfristig investieren.

**Sichtbare Mechanik:** Zwei kleine Beträge schließen zuerst einen großen grünen Sicherheitstresor. Erst nach dessen sichtbarem Abschluss richtet sich rechts der goldene Investment-Baustein auf.

**Hauptobjektfamilie:** eigenständige `PhysicalObject`-Tresor-/Investmentkörper + Goldstapel. Kein Account und kein ReserveTank aus scene-03.

## Harte Renderregeln

- Die vier `animation.tsx` sind die kanonischen Quellen und dürfen in Phase 3 nicht durch eine „ähnliche“ gemeinsame Vorlage ersetzt werden.
- X-Safe-Zone: Hauptobjekte innerhalb `72–1008`, statische Perspektivobjekte zusätzlich im Innenbereich `96–984`.
- Keine abgeschnittenen Karten/Objekte an den Seiten.
- Unterschiede müssen im Video sofort sichtbar sein, nicht nur in `MECHANIC_ID` oder Metadaten.
- Header/Captions sind gemeinsame UI-Schichten; die zentrale Hauptanimation selbst bleibt pro Szene individuell.
