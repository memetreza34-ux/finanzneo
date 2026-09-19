// Echte Kursreihen als Animationsdaten.
//
// `scripts/fetch-data.mjs` holt Monatsreihen von Yahoo Finance, CoinGecko und
// einem Wechselkursdienst nach `public/data/`. Jede Datei trägt Quelle, Symbol,
// Währung und Abrufdatum. Benutzt wurden sie bisher von zwei Experimentdateien.
//
// Der Unterschied zu einer gerechneten Annahme ist nicht die Genauigkeit,
// sondern die Ehrlichkeit: eine Sparplankurve aus `finance-motion.ts` steigt
// glatt, eine echte Reihe hat 2020 und 2022 sichtbare Einbrüche. Wer „langfristig
// steigt es" zeigen will, sollte zeigen, wie unruhig dieses Steigen ist.
//
// Die Reihe ist ein Stand, kein Live-Wert. `abgerufenAm` gehört deshalb ins
// Bild, und `quellenzeile` liefert den fertigen Satz dafür.

/** Ein Monatspunkt, so wie ihn fetch-data.mjs ablegt. */
export type KursPunkt = {x: string; y: number};

export type KursDatei = {
  source: string;
  symbol?: string;
  range?: string;
  fetchedAt: string;
  currency?: string;
  chart: KursPunkt[];
};

export type KursreiheFuerAnimation = {
  punkte: KursPunkt[];
  minimum: number;
  maximum: number;
  start: number;
  ende: number;
  /** Faktor vom ersten zum letzten Punkt, etwa 2,77 für „aus 1 € wurden 2,77 €". */
  faktor: number;
  /** Tiefster Einbruch gegenüber dem bis dahin höchsten Stand, in Prozent. */
  groessterRueckgangProzent: number;
  /** Fertige Quellenzeile für die Einblendung. */
  quellenzeile: string;
  /** Punkt auf 0…1 in beide Richtungen, für Kurven und Balken. */
  anteil: (punkt: KursPunkt) => number;
};

/**
 * Bereitet eine geladene Kursdatei für eine Animation auf.
 *
 * `groessterRueckgangProzent` ist der maximale Drawdown: der tiefste Fall vom
 * jeweils bis dahin erreichten Höchststand. Das ist die Zahl, die eine
 * Aufwärtskurve ehrlich macht.
 */
export const kursreiheFuerAnimation = (datei: KursDatei): KursreiheFuerAnimation => {
  const punkte = datei.chart.filter((p) => Number.isFinite(p.y));
  if (punkte.length === 0) {
    throw new Error('Die Kursdatei enthält keine verwertbaren Punkte.');
  }

  const werte = punkte.map((p) => p.y);
  const minimum = Math.min(...werte);
  const maximum = Math.max(...werte);
  const start = punkte[0].y;
  const ende = punkte[punkte.length - 1].y;

  let hoechststand = start;
  let groessterRueckgang = 0;
  for (const p of punkte) {
    hoechststand = Math.max(hoechststand, p.y);
    groessterRueckgang = Math.min(groessterRueckgang, (p.y - hoechststand) / hoechststand);
  }

  const teile = [datei.source, datei.symbol, datei.range].filter(Boolean);
  const abgerufen = new Date(datei.fetchedAt).toLocaleDateString('de-DE');

  return {
    punkte,
    minimum,
    maximum,
    start,
    ende,
    faktor: ende / start,
    groessterRueckgangProzent: Math.abs(groessterRueckgang) * 100,
    quellenzeile: `Quelle: ${teile.join(' · ')}, Stand ${abgerufen}. Historische Entwicklung, keine Aussage über die Zukunft.`,
    anteil: (punkt) => (maximum === minimum ? 0.5 : (punkt.y - minimum) / (maximum - minimum)),
  };
};

/**
 * Die Reihe als SVG-Pfad.
 *
 * `hoehe` ist der Zeichenbereich; der höchste Punkt liegt oben, der tiefste
 * unten. Der Pfad passt direkt in `DrawnLine`, damit die echte Kurve sich
 * genauso zeichnet wie eine erfundene.
 */
export const kursPfad = (
  reihe: KursreiheFuerAnimation,
  {breite, hoehe, rand = 0}: {breite: number; hoehe: number; rand?: number},
) => {
  const nutzbareBreite = breite - rand * 2;
  const nutzbareHoehe = hoehe - rand * 2;
  return reihe.punkte
    .map((p, i) => {
      const x = rand + (i / Math.max(1, reihe.punkte.length - 1)) * nutzbareBreite;
      const y = rand + (1 - reihe.anteil(p)) * nutzbareHoehe;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};

/** Jahreszahl aus einem `2016-07`-Punkt. */
export const jahrVon = (punkt: KursPunkt) => punkt.x.slice(0, 4);
