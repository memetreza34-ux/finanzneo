import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'locked-jar-opens-lump-sum-lifts-rest-streams-monthly';
export const VISUAL_TECHNIQUE_ID = 'depot-jar-unlock-30-percent-block-lift-240-month-coins-to-year-stacks-65-85';
export const COMPOSITION_FAMILY_ID = 'payout-timeline';

/**
 * ANIMATION_NARRATIVE
 * START: Das Depot-Glas aus Bild 29 („Altersvorsorgedepot“, voller Münzen, Vorhängeschloss „ab 65“)
 *   steht links am Anfang eines Zeitstrahls 65 → 85.
 * MECHANISM: Das Schloss springt auf, Schloss und Deckel gehen weg. Eine gestrichelte Linie teilt
 *   genau die oberen 30 % des Inhalts ab; dieser Block springt nach oben aus dem Glas
 *   („bis 30 % auf einmal“). Der Rest (70 %) fließt danach Münze für Münze aus dem Glas:
 *   240 gleich große Monatsportionen landen als 20 Jahresstapel à 12 Münzen zwischen 65 und 85.
 * CONSEQUENCE: Das Glas leert sich gleichmäßig, während der Zeitstrahl sich füllt.
 * RESULT: Leeres Glas, Block „bis 30 % auf einmal“, 20 gleich hohe Stapel 65 → 85 mit Klammer
 *   „Auszahlplan bis mind. 85“, gestrichelter Pfeil über 85 hinaus „oder lebenslange Rente“.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Depot-Glas, das sich in einen Block und einen gleichmäßigen Münzstrom teilt
 * SUPPORT: Zeitstrahl 65 → 85, Jahresstapel, Klammer, Hinweis-Pfeil
 * SURFACE: Flow-Creme DATEN.grund, Stift-Konturen wie in den Flow-Bildern
 * SHAPE_LANGUAGE: gezeichnetes Glas, flache Münzen, keine Eurobeträge
 */
export const ANIMATION_NARRATIVE = {
  START: 'Verschlossenes Depot-Glas „ab 65“ am Zeitstrahl 65 → 85',
  MECHANISM: 'Schloss auf, oberste 30 % springen als Block heraus, 70 % fließen in 240 Monatsportionen',
  RESULT: 'Glas leer: bis 30 % auf einmal, Auszahlplan bis mind. 85, oder lebenslange Rente',
};

// Regeln laut Altersvorsorgereformgesetz (Skript): höchstens 30 % zu Beginn, Rest als Auszahlplan
// bis mindestens 85 oder lebenslange Rente. Gleich große Portionen sind eine Vereinfachung, keine €-Beträge.
const ANTEIL_EINMAL = 0.3;
const START_ALTER = 65;
const END_ALTER = 85;
const JAHRE = END_ALTER - START_ALTER;
const MONATE = JAHRE * 12;
if (JAHRE !== 20 || MONATE !== 240) throw new Error('Auszahlplan 65 → 85 muss 20 Jahre / 240 Monate haben.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const springen = Easing.bezier(0.3, 1.35, 0.6, 1);
const p = (frame: number, von: number, bis: number, easing = weich) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// beats: [„Und nicht alles auf einmal“, „höchstens dreißig Prozent“, „auf einen Schlag“,
//         „Der Rest kommt“, „lebenslange Rente“, „Auszahlplan bis mindestens“]
const PREVIEW_BEATS = [0, 114, 152, 203, 254, 304];

// Glas (Bridge „Depot-Glas“ aus Bild 29)
const BODEN = 776;
const GLAS = {links: 140, rechts: 520, oben: 336};
const INNEN = {links: 162, rechts: 498, oben: 358, unten: 758};
const INHALT_H = INNEN.unten - INNEN.oben; // 400 px = 100 %
const SCHNITT = INNEN.oben + INHALT_H * ANTEIL_EINMAL; // 30 % → 120 px
const BLOCK_H = SCHNITT - INNEN.oben;
const BLOCK_ZIEL_Y = 96;
const GOLD = '#E2B65C';
const GOLD_HELL = '#EDC873';
const GOLD_DUNKEL = '#9C7428';

// Zeitstrahl 65 → 85: 20 Jahre à 37,5 px, je Jahr ein Stapel aus 12 Monatsmünzen.
// Die 20 Stapel bedecken zusammen genau die Fläche der 70 % im Glas (336 × 280 px) —
// Block und Stapel stehen also im Flächenverhältnis 30 : 70.
const X65 = 570;
const X85 = 1320;
const JAHR_PX = (X85 - X65) / JAHRE;
const MUENZE_B = 30;
const MUENZE_H = 10;
const REST_FLAECHE = (INNEN.rechts - INNEN.links) * INHALT_H * (1 - ANTEIL_EINMAL);
const MUENZE_TAKT = REST_FLAECHE / (JAHRE * MUENZE_B * 12);
// Münzen tauchen hinter dem Glasrand auf (Öffnung) und fliegen in einem Bogen zu ihrem Stapel.
const OEFFNUNG = {x: 430, y: 326};
const AUSGANG = {x: 470, y: 252};
const FLUG = 20;

// Münzmuster im Glas — fest im Glas-Koordinatensystem, damit Block und Rest nahtlos zusammenpassen.
const MUSTER: Array<{x: number; y: number}> = [];
for (let reihe = 0; INNEN.oben + reihe * 22 <= INNEN.unten + 10; reihe++) {
  for (let spalte = -1; spalte < 8; spalte++) {
    MUSTER.push({x: INNEN.links + spalte * 48 + (reihe % 2 ? 24 : 0) + 20, y: INNEN.oben + 8 + reihe * 22});
  }
}
const Muster: React.FC<{dx?: number; dy?: number}> = ({dx = 0, dy = 0}) => (
  <>
    {MUSTER.map((m, i) => (
      <ellipse key={i} cx={m.x + dx} cy={m.y + dy} rx={21} ry={9} fill={GOLD_HELL} stroke={GOLD_DUNKEL} strokeWidth={2.5} />
    ))}
  </>
);

const GLAS_PFAD = `M${GLAS.links + 26},${GLAS.oben} Q${GLAS.links},${GLAS.oben} ${GLAS.links},${GLAS.oben + 26} L${GLAS.links},${BODEN - 44} Q${GLAS.links},${BODEN} ${GLAS.links + 44},${BODEN} L${GLAS.rechts - 44},${BODEN} Q${GLAS.rechts},${BODEN} ${GLAS.rechts},${BODEN - 44} L${GLAS.rechts},${GLAS.oben + 26} Q${GLAS.rechts},${GLAS.oben} ${GLAS.rechts - 26},${GLAS.oben} Z`;
const INNEN_PFAD = `M${INNEN.links},${INNEN.oben - 40} L${INNEN.links},${INNEN.unten - 34} Q${INNEN.links},${INNEN.unten} ${INNEN.links + 34},${INNEN.unten} L${INNEN.rechts - 34},${INNEN.unten} Q${INNEN.rechts},${INNEN.unten} ${INNEN.rechts},${INNEN.unten - 34} L${INNEN.rechts},${INNEN.oben - 40} Z`;

type Ausrichtung = 'links' | 'mitte' | 'rechts';
const T: React.FC<{
  x: number;
  y: number;
  groesse: number;
  gewicht?: number;
  farbe?: string;
  ausrichtung?: Ausrichtung;
  sicht?: number;
  dx?: number;
  children: React.ReactNode;
}> = ({x, y, groesse, gewicht = 800, farbe = DATEN.text, ausrichtung = 'mitte', sicht = 1, dx = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${ausrichtung === 'mitte' ? '-50%' : ausrichtung === 'rechts' ? '-100%' : '0'}, -50%) translateX(${dx.toFixed(1)}px)`,
      opacity: sicht,
      fontSize: Math.max(DATEN.minText, groesse),
      fontWeight: gewicht,
      color: farbe,
      lineHeight: 1.1,
      whiteSpace: 'nowrap',
      letterSpacing: groesse >= 70 ? -1 : 0,
    }}
  >
    {children}
  </div>
);

export const YouTubeVisual30Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  // 1. Schloss auf, Deckel weg (ab 65).
  const auf = p(frame, at(0) + 6, at(0) + 22);
  const weg = p(frame, at(0) + 28, at(0) + 54);
  const alter65 = p(frame, at(0) + 14, at(0) + 26);
  // 2. Schnitt bei 30 %, dann springt der Block heraus.
  const schnitt = p(frame, at(1), at(1) + 16);
  const klammer = p(frame, at(1) + 6, at(1) + 18);
  const sprungAb = Math.max(at(2), at(1) + 18);
  const sprung = p(frame, sprungAb, sprungAb + 22, springen);
  const klammerWeg = p(frame, sprungAb, sprungAb + 8);
  const blockText = p(frame, sprungAb + 12, sprungAb + 24);
  // 3. Rest 70 % fließt in 240 gleich großen Monatsportionen.
  const flussAb = Math.max(at(3) + 14, sprungAb + 28);
  // Letzte Münze landet ca. 23 Frames nach „Auszahlplan“ — danach ruhiger Ergebnis-Hold.
  const flussBis = Math.max(flussAb + 90, at(5) + 4);
  const startVon = (i: number) => flussAb + (i / MONATE) * (flussBis - flussAb);
  const geleert = interpolate(frame, [flussAb, flussBis], [0, 1], CLAMP);
  const pegel = mix(SCHNITT, INNEN.unten, geleert);
  const rest70 = p(frame, at(3), at(3) + 10) * (1 - p(frame, mix(flussAb, flussBis, 0.03), mix(flussAb, flussBis, 0.12)));
  // 4. Hinweis lebenslange Rente, 5. Klammer Auszahlplan.
  const rente = p(frame, at(4), at(4) + 22);
  const renteText = p(frame, at(4) + 10, at(4) + 22);
  const plan = p(frame, at(5), at(5) + 18);
  const planText = p(frame, at(5) + 8, at(5) + 20);

  const blockY = mix(INNEN.oben, BLOCK_ZIEL_Y, sprung);
  const blockVorne = sprung > 0;

  const muenzen: React.ReactNode[] = [];
  for (let i = 0; i < MONATE; i++) {
    const ab = startVon(i);
    if (frame < ab) continue;
    const u = Math.min(1, (frame - ab) / FLUG);
    const stapel = Math.floor(i / 12);
    const platz = i % 12;
    const zielX = X65 + (stapel + 0.5) * JAHR_PX;
    const zielY = BODEN - 4 - MUENZE_H / 2 - platz * MUENZE_TAKT;
    let x = zielX;
    let y = zielY;
    if (u < 1) {
      const startX = OEFFNUNG.x + ((i * 37) % 41) - 20;
      const startY = OEFFNUNG.y;
      if (u < 0.3) {
        const s = Easing.out(Easing.quad)(u / 0.3);
        x = mix(startX, AUSGANG.x, s);
        y = mix(startY, AUSGANG.y, s);
      } else {
        const s = (u - 0.3) / 0.7;
        const kx = zielX;
        const ky = AUSGANG.y - 40;
        x = (1 - s) * (1 - s) * AUSGANG.x + 2 * (1 - s) * s * kx + s * s * zielX;
        y = (1 - s) * (1 - s) * AUSGANG.y + 2 * (1 - s) * s * ky + s * s * zielY;
      }
    }
    muenzen.push(
      <rect key={i} x={x - MUENZE_B / 2} y={y - MUENZE_H / 2} width={MUENZE_B} height={MUENZE_H} rx={4} fill={GOLD} stroke={GOLD_DUNKEL} strokeWidth={2} />,
    );
  }

  const block = (
    <g transform={`translate(0 ${(blockY - INNEN.oben).toFixed(1)})`}>
      <g clipPath="url(#v30-block)">
        <rect x={INNEN.links} y={INNEN.oben} width={INNEN.rechts - INNEN.links} height={BLOCK_H} fill={GOLD} />
        <Muster />
      </g>
      <rect x={INNEN.links} y={INNEN.oben} width={INNEN.rechts - INNEN.links} height={BLOCK_H} rx={10} fill="none" stroke={DATEN.text} strokeWidth={5} opacity={sprung > 0 ? 1 : schnitt} />
    </g>
  );

  const klammerPfad = `M${X65},${BODEN + 92} Q${X65},${BODEN + 110} ${X65 + 20},${BODEN + 110} L${(X65 + X85) / 2 - 20},${BODEN + 110} Q${(X65 + X85) / 2},${BODEN + 110} ${(X65 + X85) / 2},${BODEN + 126} Q${(X65 + X85) / 2},${BODEN + 110} ${(X65 + X85) / 2 + 20},${BODEN + 110} L${X85 - 20},${BODEN + 110} Q${X85},${BODEN + 110} ${X85},${BODEN + 92}`;

  return (
    <DatenBuehne>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <filter id="v30-stift" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={5} result="rauschen" />
            <feDisplacementMap in="SourceGraphic" in2="rauschen" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id="v30-innen">
            <path d={INNEN_PFAD} />
          </clipPath>
          <clipPath id="v30-rest">
            <rect x={INNEN.links - 4} y={pegel} width={INNEN.rechts - INNEN.links + 8} height={Math.max(0, INNEN.unten - pegel + 4)} />
          </clipPath>
          <clipPath id="v30-block">
            <rect x={INNEN.links} y={INNEN.oben} width={INNEN.rechts - INNEN.links} height={BLOCK_H} rx={10} />
          </clipPath>
        </defs>

        {/* Zeitstrahl 65 → 85 mit Jahresstrichen */}
        <g filter="url(#v30-stift)" fill="none" stroke={DATEN.text} strokeLinecap="round">
          <path d={`M${X65 - 20},${BODEN} L${X85 + 10},${BODEN}`} strokeWidth={6} />
          {Array.from({length: JAHRE + 1}, (_, k) => (
            <path key={k} d={`M${X65 + k * JAHR_PX},${BODEN} L${X65 + k * JAHR_PX},${BODEN + (k % 5 === 0 ? 20 : 10)}`} strokeWidth={k % 5 === 0 ? 5 : 3} />
          ))}
        </g>
        {/* Über 85 hinaus: lebenslange Rente */}
        {rente > 0 ? (
          <g fill="none" stroke={DATEN.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${X85 + 24},${BODEN} L${X85 + 24 + (1740 - X85 - 24) * rente},${BODEN}`} strokeDasharray="16 14" />
            {rente > 0.9 ? <path d={`M1716,${BODEN - 18} L1742,${BODEN} L1716,${BODEN + 18}`} /> : null}
          </g>
        ) : null}

        {/* Glas: Rückwand */}
        <path d={GLAS_PFAD} fill="#DCE8EA" fillOpacity={0.6} />
        {/* Rest-Inhalt (70 %), Pegel sinkt mit jeder Monatsportion */}
        <g clipPath="url(#v30-innen)">
          <g clipPath="url(#v30-rest)">
            <rect x={INNEN.links} y={SCHNITT} width={INNEN.rechts - INNEN.links} height={INNEN.unten - SCHNITT} fill={GOLD} />
            <Muster />
          </g>
        </g>
        {blockVorne ? null : block}

        {/* Münzstrom und Jahresstapel */}
        {muenzen}

        {/* Glas: Vorderseite */}
        <g filter="url(#v30-stift)" fill="none" stroke={DATEN.text} strokeWidth={5} strokeLinejoin="round">
          <path d={GLAS_PFAD} />
          <rect x={GLAS.links + 12} y={GLAS.oben - 24} width={GLAS.rechts - GLAS.links - 24} height={26} rx={8} fill="#CFDDE0" />
        </g>
        <path d={`M${GLAS.links + 22},${GLAS.oben + 70} L${GLAS.links + 22},${GLAS.oben + 300}`} stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={10} strokeLinecap="round" />
        <rect x={182} y={650} width={296} height={94} rx={8} fill="#FFF8EA" stroke={DATEN.text} strokeWidth={4} />

        {/* Schnittlinie bei 30 % */}
        {schnitt > 0 && sprung < 0.05 ? (
          <line x1={INNEN.links} y1={SCHNITT} x2={INNEN.links + (INNEN.rechts - INNEN.links) * schnitt} y2={SCHNITT} stroke={DATEN.text} strokeWidth={5} strokeDasharray="16 10" />
        ) : null}
        {/* Klammer „30 %“ am Glas */}
        {klammer > 0 && klammerWeg < 1 ? (
          <path
            d={`M${GLAS.rechts + 16},${INNEN.oben} L${GLAS.rechts + 30},${INNEN.oben} L${GLAS.rechts + 30},${SCHNITT} L${GLAS.rechts + 16},${SCHNITT}`}
            fill="none"
            stroke={DATEN.text}
            strokeWidth={5}
            strokeLinejoin="round"
            opacity={klammer * (1 - klammerWeg)}
          />
        ) : null}

        {/* Deckel, Schloss und Anhänger „ab 65“ */}
        {weg < 1 ? (
          <g opacity={1 - weg} transform={`translate(${(-30 * weg).toFixed(1)} ${(-130 * weg).toFixed(1)}) rotate(${(-10 * weg).toFixed(2)} 330 300)`}>
            <g filter="url(#v30-stift)" stroke={DATEN.text} strokeWidth={5} strokeLinejoin="round">
              <rect x={GLAS.links + 6} y={GLAS.oben - 54} width={GLAS.rechts - GLAS.links - 12} height={32} rx={10} fill="#7F9DB8" />
            </g>
            <path d="M306,314 L306,276 A24,24 0 0 1 354,276 L354,314" transform={`translate(0 ${(-18 * auf).toFixed(1)})`} fill="none" stroke={DATEN.text} strokeWidth={9} strokeLinecap="round" />
            <rect x={292} y={306} width={76} height={62} rx={10} fill="#C9A24B" stroke={DATEN.text} strokeWidth={5} />
            <circle cx={330} cy={330} r={7} fill={DATEN.text} />
            <rect x={327} y={333} width={6} height={16} rx={3} fill={DATEN.text} />
            <path d="M356,362 Q372,380 386,392" fill="none" stroke={DATEN.text} strokeWidth={3} />
            <g transform="rotate(-8 386 392)">
              <rect x={386} y={386} width={112} height={54} rx={8} fill="#FFF8EA" stroke={DATEN.text} strokeWidth={4} />
            </g>
          </g>
        ) : null}

        {blockVorne ? block : null}

        {/* Klammer „Auszahlplan“ unter dem Zeitstrahl */}
        {plan > 0 ? <path d={klammerPfad} fill="none" stroke={DATEN.text} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - plan} /> : null}
      </svg>

      {/* Etikett und Anhänger wie in Bild 29 */}
      <T x={330} y={677} groesse={32} gewicht={800}>
        Altersvorsorge-
      </T>
      <T x={330} y={717} groesse={32} gewicht={800}>
        depot
      </T>
      {weg < 1 ? (
        <div style={{position: 'absolute', left: 442, top: 413, transform: `translate(-50%, -50%) translate(${(-30 * weg).toFixed(1)}px, ${(-130 * weg).toFixed(1)}px) rotate(-8deg)`, opacity: 1 - weg, fontSize: 36, fontWeight: 800, whiteSpace: 'nowrap'}}>
          ab 65
        </div>
      ) : null}

      <T x={GLAS.rechts + 46} y={(INNEN.oben + SCHNITT) / 2} groesse={56} gewicht={900} ausrichtung="links" sicht={klammer * (1 - klammerWeg)}>
        30 %
      </T>
      <div style={{position: 'absolute', left: 330, top: 562, transform: 'translate(-50%, -50%)', opacity: rest70, padding: '2px 18px', borderRadius: 14, backgroundColor: '#FFF8EA', border: `4px solid ${DATEN.text}`, fontSize: 64, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, whiteSpace: 'nowrap', color: DATEN.text}}>
        70 %
      </div>

      {/* Block-Beschriftung */}
      <T x={GLAS.rechts + 14} y={BLOCK_ZIEL_Y + 40} groesse={72} gewicht={900} ausrichtung="links" sicht={blockText} dx={(1 - blockText) * -16}>
        bis 30 %
      </T>
      <T x={GLAS.rechts + 16} y={BLOCK_ZIEL_Y + 102} groesse={48} gewicht={800} ausrichtung="links" sicht={blockText} dx={(1 - blockText) * -16}>
        auf einmal
      </T>

      {/* Zeitstrahl-Beschriftung */}
      <T x={X65} y={BODEN + 56} groesse={60} gewicht={800} farbe={alter65 > 0.5 ? DATEN.gruen : DATEN.text}>
        {START_ALTER}
      </T>
      <T x={X85} y={BODEN + 56} groesse={60} gewicht={800}>
        {END_ALTER}
      </T>
      <T x={(X65 + X85) / 2} y={BODEN + 162} groesse={48} gewicht={800} sicht={planText}>
        Auszahlplan bis mind. {END_ALTER}
      </T>
      <T x={1545} y={BODEN - 160} groesse={40} gewicht={700} farbe={DATEN.leise} sicht={renteText}>
        oder
      </T>
      <T x={1545} y={BODEN - 112} groesse={40} gewicht={800} sicht={renteText}>
        lebenslange Rente
      </T>
    </DatenBuehne>
  );
};
