import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Punkteraster, Quelle, Text, Zaehlwerk, rasterGroesse} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'hundred-households-recolor-share';
export const VISUAL_TECHNIQUE_ID = 'unit-grid-recolor';
export const COMPOSITION_FAMILY_ID = 'proportion-grid';

/**
 * ANIMATION_NARRATIVE
 * START: 100 gleiche Punkte = 100 Haushalte mit Digital-Abos.
 * MECHANISM: 19 Punkte färben sich nacheinander rot, der Zähler zählt mit.
 * RESULT: 19 von 100 Haushalten zahlen mehr als 100 € im Monat — fast jeder fünfte.
 * Quelle: BearingPoint, Submix-Studie 2026 (19 %, Vorjahr 15 %).
 */
export const ANIMATION_NARRATIVE = {
  START: '100 Punkte stehen für 100 Haushalte',
  MECHANISM: '19 Punkte werden rot, Zähler läuft bis 19',
  RESULT: '19 von 100 Haushalten zahlen mehr als 100 € im Monat',
};

const GESAMT = 100;
const ANTEIL = 19;
const SPALTEN = 10;
const PUNKT = 46;
const ABSTAND = 16;

// beats: [„fast jeder fünfte Haushalt“ → Raster, „mehr als hundert Euro“ → 19 Punkte rot]
const PREVIEW_BEATS = [0, 40];

export const YouTubeVisual04Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const groesse = rasterGroesse(GESAMT, SPALTEN, PUNKT, ABSTAND);
  const x = 300;
  const y = 150;
  const fuenftel = interpolate(frame, [at(1) + 30, at(1) + 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <DatenBuehne>
      <Punkteraster
        x={x}
        y={y}
        spalten={SPALTEN}
        punkt={PUNKT}
        abstand={ABSTAND}
        gruppen={[
          {anzahl: GESAMT - ANTEIL, farbe: DATEN.neutral, ab: at(0), dauer: 20},
          {anzahl: ANTEIL, farbe: DATEN.neutral, ab: at(0) + 22, dauer: 6, wechsel: {ab: at(1), farbe: DATEN.rot, dauer: 24}},
        ]}
      />
      <Text x={x} y={y + groesse.hoehe + 50} groesse={30} gewicht={700} farbe={DATEN.leise} ab={at(0)}>
        1 Punkt = 1 Haushalt mit Digital-Abos
      </Text>
      {frame >= at(1) ? (
        <Zaehlwerk x={1060} y={430} groesse={170} einheit="" ausrichtung="links" start={0} dauer={24} stationen={[{ab: at(1), wert: ANTEIL}]} ab={at(1)} farbe={DATEN.rot} />
      ) : null}
      <Text x={1340} y={430} groesse={60} gewicht={800} ab={at(1) + 6}>
        von 100
      </Text>
      <Text x={1064} y={560} groesse={42} gewicht={700} ab={at(1) + 16}>
        zahlen mehr als 100 € im Monat
      </Text>
      <div style={{opacity: fuenftel}}>
        <Text x={1064} y={640} groesse={36} gewicht={700} farbe={DATEN.leise} ab={at(1) + 30}>
          fast jeder fünfte Haushalt
        </Text>
      </div>
      <Quelle ab={at(0)}>Quelle: BearingPoint, Submix-Studie 2026 · Vorjahr: 15 von 100</Quelle>
    </DatenBuehne>
  );
};
