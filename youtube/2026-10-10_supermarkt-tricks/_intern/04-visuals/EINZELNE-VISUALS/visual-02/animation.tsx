import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala, wertBeiStationen} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'receipt-print-growth-plan-vs-till';
export const VISUAL_TECHNIQUE_ID = 'growing-receipt-with-till-display-count';
export const COMPOSITION_FAMILY_ID = 'document-motion';

/**
 * ANIMATION_NARRATIVE
 * START: Kassenbon mit genau zwei Zeilen (Milch, Brot), Kassendisplay zeigt 3,68 €.
 * MECHANISM: Der Bon druckt Zeile für Zeile weiter und wird länger; Bon-Summe und
 *   Kassendisplay zählen synchron mit jeder gedruckten Zeile hoch.
 * CONSEQUENCE: Die zwei geplanten Zeilen werden grün markiert, die elf anderen rot als „ungeplant“.
 * RESULT: Plan (Milch + Brot, 3,68 €) gegen Kasse (13 Artikel, 40,00 €) als wertgenaue Balken.
 *
 * Alle Artikelpreise sind ein Beispiel-Einkauf (Summe exakt 40,00 €), siehe remotion.md.
 */
export const ANIMATION_NARRATIVE = {
  START: 'Bon mit Milch und Brot, Display 3,68 €',
  MECHANISM: 'Bon druckt Zeile für Zeile, Summe und Display zählen bis 40,00 €',
  RESULT: 'Geplant 3,68 € gegen 40,00 € an der Kasse',
};

type Artikel = {bezeichnung: string; cent: number; geplant: boolean};
const ARTIKEL: Artikel[] = [
  {bezeichnung: 'Milch', cent: 119, geplant: true},
  {bezeichnung: 'Brot', cent: 249, geplant: true},
  {bezeichnung: 'Schokolade', cent: 149, geplant: false},
  {bezeichnung: 'Chips', cent: 199, geplant: false},
  {bezeichnung: 'Erdbeeren', cent: 299, geplant: false},
  {bezeichnung: 'Käse', cent: 412, geplant: false},
  {bezeichnung: 'Kaffee', cent: 699, geplant: false},
  {bezeichnung: 'Kekse', cent: 179, geplant: false},
  {bezeichnung: 'Weißwein', cent: 499, geplant: false},
  {bezeichnung: 'Aufschnitt', cent: 323, geplant: false},
  {bezeichnung: 'Tiefkühlpizza', cent: 279, geplant: false},
  {bezeichnung: 'Blumen', cent: 399, geplant: false},
  {bezeichnung: 'Duschgel', cent: 195, geplant: false},
];
const SUMME_CENT = ARTIKEL.reduce((acc, a) => acc + a.cent, 0); // 4000
const PLAN_CENT = ARTIKEL.filter((a) => a.geplant).reduce((acc, a) => acc + a.cent, 0); // 368
const PLAN_ANZAHL = ARTIKEL.filter((a) => a.geplant).length;
if (SUMME_CENT !== 4000) throw new Error(`Beispiel-Einkauf muss exakt 40,00 € ergeben, ist ${SUMME_CENT} Cent.`);

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});
const euro = (cent: number) => euroText(cent / 100, 2);

// beats: [„Und an der Kasse“, „vierzig Euro“, „Das ist kein Zufall“, „Das ist geplant“]
const PREVIEW_BEATS = [0, 70, 138, 193];

// Bon: mittig links, wächst symmetrisch um DATEN.mitteY.
const BON = {links: 420, breite: 520, kopf: 92, zeile: 46, fuss: 118, zacke: 14};
const bonHoehe = (zeilen: number) => BON.kopf + zeilen * BON.zeile + BON.fuss;
// Rechte Spalte: Display + Plan/Kasse-Balken.
const SPALTE = {links: 1100, breite: 600};
const DISPLAY = {oben: 270, hoehe: 200};
const BALKEN_MAX = 440;

export const YouTubeVisual02Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  // Zeilen 3–13 drucken zwischen Start und „vierzig Euro“.
  const druckStart = at(0) + 16;
  const druckTakt = Math.max(3, (at(1) - 2 - druckStart) / (ARTIKEL.length - PLAN_ANZAHL));
  const druckAb = (i: number) => (i < PLAN_ANZAHL ? at(0) - 100 : druckStart + (i - PLAN_ANZAHL) * druckTakt);
  const gedruckt = ARTIKEL.map((_, i) => p(frame, druckAb(i), druckAb(i) + Math.max(4, druckTakt)));
  const sichtbareZeilen = gedruckt.reduce((acc, g) => acc + g, 0);

  // Summe: springt pro gedruckter Zeile um genau deren Preis.
  let laufend = 0;
  const stationen = ARTIKEL.map((a, i) => {
    laufend += a.cent;
    return {ab: druckAb(i), wert: laufend / 100};
  }).filter((_, i) => i >= PLAN_ANZAHL);
  const summeEuro = wertBeiStationen(frame, stationen, PLAN_CENT / 100, Math.max(3, Math.round(druckTakt)));
  const summeCent = Math.round(summeEuro * 100);

  const h = bonHoehe(sichtbareZeilen);
  const oben = DATEN.mitteY - h / 2;
  const zeileY = (i: number) => oben + BON.kopf + i * BON.zeile + BON.zeile / 2;
  const summeY = oben + BON.kopf + sichtbareZeilen * BON.zeile + 62;

  // Beat 3: Markieren geplant / ungeplant.
  const markieren = p(frame, at(2), at(2) + 18);
  const klammer = p(frame, at(2) + 8, at(2) + 30);
  // Beat 4: Plan gegen Kasse.
  const vergleichAb = (k: number) => at(3) + k * 6;
  const vergleich = (k: number) => p(frame, vergleichAb(k), vergleichAb(k) + 16);
  const breite = skala(SUMME_CENT, BALKEN_MAX);

  const ungeplantOben = zeileY(PLAN_ANZAHL) - BON.zeile / 2 + 4;
  const ungeplantUnten = zeileY(ARTIKEL.length - 1) + BON.zeile / 2 - 4;

  return (
    <DatenBuehne>
      <Quelle>Beispiel-Einkauf</Quelle>

      {/* Bon-Papier mit gezackter Abrisskante */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 18px 36px rgba(32, 42, 37, 0.12))'}}>
        <path
          d={(() => {
            const l = BON.links;
            const r = BON.links + BON.breite;
            const u = oben + h;
            const zacken = 20;
            const w = BON.breite / zacken;
            let d = `M ${l} ${oben} L ${r} ${oben} L ${r} ${u}`;
            for (let k = zacken; k > 0; k -= 1) d += ` L ${r - (zacken - k) * w - w / 2} ${u + BON.zacke} L ${r - (zacken - k + 1) * w} ${u}`;
            return `${d} Z`;
          })()}
          fill={DATEN.papier}
        />
      </svg>
      <Text x={BON.links + BON.breite / 2} y={oben + 44} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte">
        Kassenbon
      </Text>
      <div style={{position: 'absolute', left: BON.links + 32, top: oben + BON.kopf - 12, width: BON.breite - 64, borderTop: `3px dashed ${DATEN.linie}`}} />

      {ARTIKEL.map((a, i) => {
        const g = gedruckt[i];
        if (g <= 0) return null;
        const y = zeileY(i);
        const farbe = !a.geplant && markieren > 0.5 ? DATEN.rot : DATEN.text;
        return (
          <div key={a.bezeichnung} style={{position: 'absolute', left: BON.links, top: y - BON.zeile / 2, width: BON.breite, height: BON.zeile, opacity: g, transform: `translateY(${((1 - g) * -10).toFixed(1)}px)`}}>
            <div style={{position: 'absolute', left: 36, top: 0, lineHeight: `${BON.zeile}px`, fontSize: 30, fontWeight: 600, color: farbe}}>{a.bezeichnung}</div>
            <div style={{position: 'absolute', right: 32, top: 0, lineHeight: `${BON.zeile}px`, fontSize: 30, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: farbe}}>{euro(a.cent)}</div>
          </div>
        );
      })}

      {/* Summe */}
      <div style={{position: 'absolute', left: BON.links + 32, top: summeY - 44, width: BON.breite - 64, borderTop: `3px solid ${DATEN.text}`}} />
      <div style={{position: 'absolute', left: BON.links + 36, top: summeY - 24, fontSize: 36, fontWeight: 800, lineHeight: '48px'}}>Summe</div>
      <div style={{position: 'absolute', left: BON.links, width: BON.breite - 32, top: summeY - 24, textAlign: 'right', fontSize: 36, fontWeight: 800, lineHeight: '48px', fontVariantNumeric: 'tabular-nums'}}>
        {euro(summeCent)}
      </div>

      {/* Klammern links vom Bon: geplant / ungeplant */}
      <div style={{position: 'absolute', left: BON.links - 34, top: zeileY(0) - BON.zeile / 2 + 4, width: 14, height: (zeileY(1) - zeileY(0)) + BON.zeile - 8, borderLeft: `4px solid ${DATEN.gruen}`, borderTop: `4px solid ${DATEN.gruen}`, borderBottom: `4px solid ${DATEN.gruen}`, borderRadius: '6px 0 0 6px', opacity: klammer}} />
      <Text x={BON.links - 52} y={(zeileY(0) + zeileY(1)) / 2} groesse={32} gewicht={800} farbe={DATEN.gruen} ausrichtung="rechts" ab={at(2) + 8}>
        geplant
      </Text>
      <div style={{position: 'absolute', left: BON.links - 34, top: ungeplantOben, width: 14, height: (ungeplantUnten - ungeplantOben) * klammer, borderLeft: `4px solid ${DATEN.rot}`, borderTop: `4px solid ${DATEN.rot}`, borderBottom: klammer > 0.98 ? `4px solid ${DATEN.rot}` : 'none', borderRadius: '6px 0 0 6px', opacity: klammer > 0 ? 1 : 0}} />
      <Text x={BON.links - 52} y={(ungeplantOben + ungeplantUnten) / 2} groesse={32} gewicht={800} farbe={DATEN.rot} ausrichtung="rechts" ab={at(2) + 16}>
        ungeplant
      </Text>
      <Text x={BON.links - 52} y={(ungeplantOben + ungeplantUnten) / 2 + 40} groesse={28} gewicht={600} farbe={DATEN.rot} ausrichtung="rechts" ab={at(2) + 20}>
        {ARTIKEL.length - PLAN_ANZAHL} Artikel
      </Text>

      {/* Kassendisplay */}
      <Text x={SPALTE.links} y={DISPLAY.oben - 34} groesse={28} gewicht={700} farbe={DATEN.leise}>
        Display an der Kasse
      </Text>
      <div style={{position: 'absolute', left: SPALTE.links, top: DISPLAY.oben, width: SPALTE.breite, height: DISPLAY.hoehe, borderRadius: 24, backgroundColor: '#E9EEEA', border: `3px solid ${DATEN.linie}`}} />
      <Zaehlwerk
        x={SPALTE.links + SPALTE.breite - 48}
        y={DISPLAY.oben + DISPLAY.hoehe / 2}
        stationen={stationen}
        start={PLAN_CENT / 100}
        dauer={Math.max(3, Math.round(druckTakt))}
        nachkomma={2}
        groesse={112}
        farbe={DATEN.text}
        ausrichtung="rechts"
      />

      {/* Plan gegen Kasse — Balkenlänge exakt aus dem Betrag */}
      {[
        {titel: `Plan: Milch + Brot`, cent: PLAN_CENT, farbe: DATEN.gruen, y: 600},
        {titel: `Kasse: ${ARTIKEL.length} Artikel`, cent: SUMME_CENT, farbe: DATEN.rot, y: 730},
      ].map((zeile, k) => {
        const v = vergleich(k);
        return (
          <React.Fragment key={zeile.titel}>
            <Text x={SPALTE.links} y={zeile.y - 34} groesse={30} gewicht={700} farbe={DATEN.text} ab={vergleichAb(k)}>
              {zeile.titel}
            </Text>
            <div style={{position: 'absolute', left: SPALTE.links, top: zeile.y, height: 44, width: breite(zeile.cent) * v, borderRadius: 10, backgroundColor: zeile.farbe}} />
            <Text x={SPALTE.links + breite(zeile.cent) + 18} y={zeile.y + 22} groesse={34} gewicht={800} farbe={zeile.farbe} ab={vergleichAb(k) + 10}>
              {euro(zeile.cent)}
            </Text>
          </React.Fragment>
        );
      })}
    </DatenBuehne>
  );
};
