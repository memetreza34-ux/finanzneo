import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalReserveTank,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: buffer-intercepts-before-overdraft
 * PRIMARY_ACTION: Eine unerwartete Rechnung bewegt sich physisch auf das belastete Girokonto und den roten Dispo-Bereich zu, bis der Notgroschen in die Flugbahn fährt und die Rechnung übernimmt.
 *
 * ANIMATION_NARRATIVE
 * START: Eine konkrete Rechnung nähert sich einem Girokonto, unter dem ein klarer roter Dispo-Bereich bereits als nächste schlechte Option sichtbar wird.
 * MECHANISM: Der Notgroschen fährt aus der unteren Mitte in den Weg, fängt die Rechnung vor dem Girokonto ab und bezahlt sie, bevor die Belastung den Dispo erreicht.
 * RESULT: Die Rechnung bleibt bezahlt am Puffer, das Girokonto wechselt in den geschützten Zustand und der rote Dispo-Hinweis verschwindet nach unten.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die sich bewegende Rechnung und ihr physisches Abfangen durch den Notgroschen bilden die eigentliche Handlung; keine Kartenreihe erklärt den Vorgang stellvertretend.
 * SUPPORT: Ein realistisches Girokonto und ein kleiner DISPO-Hinweis zeigen die vermiedene Konsequenz, ohne zur UI oder zum Diagramm zu werden.
 * MATERIAL: Elfenbein für Rechnung und Konto, Gold für den Puffer, Emerald für Schutz und Rot ausschließlich für Dispo/Schuldenrisiko.
 * DEPTH: Rechnung, Reserve und Konto kreuzen sich auf unterschiedlichen Z-Ebenen; das Abfangen ist räumlich sichtbar und endet in einer stabilen klaren Komposition.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene04Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(104, durationFrames - RESULT_HOLD_FRAMES - 5);

  const billApproach = interpolate(frame, [5, 60], [0, 1], clamp);
  const bufferIntercept = interpolate(frame, [42, 82], [0, 1], clamp);
  const billCaptured = interpolate(frame, [72, resultStart], [0, 1], clamp);
  const debtRetreat = interpolate(frame, [78, resultStart], [0, 1], clamp);
  const accountRecover = interpolate(frame, [82, resultStart], [0, 1], clamp);

  const billX = 70 + billApproach * 380 + billCaptured * 55;
  const billY = 590 + billApproach * 82 - billCaptured * 22;
  const reserveY = 910 - bufferIntercept * 255;
  const reserveFill = 0.76 - billCaptured * 0.18;

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={billX}
        y={billY}
        label="Rechnung"
        amount="420 €"
        rotate={-8 + billApproach * 7}
        scale={0.78 - billCaptured * 0.08}
        paid={billCaptured > 0.7}
      />

      <PhysicalReserveTank
        x={470}
        y={reserveY}
        width={250}
        height={350}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.9 + bufferIntercept * 0.1}
      />

      <PhysicalAccount
        x={750}
        y={650 - accountRecover * 12}
        label="Girokonto"
        balance={accountRecover > 0.55 ? 'geschützt' : 'knapp'}
        state={accountRecover > 0.55 ? 'protected' : 'danger'}
        scale={0.95 + accountRecover * 0.05}
        tilt={accountRecover > 0.55 ? 0 : 4}
      />

      <div style={{
        position: 'absolute',
        left: 805,
        top: 935 + debtRetreat * 150,
        opacity: 1 - debtRetreat,
        transform: `scale(${1 - debtRetreat * 0.16})`,
        color: ANIMATION_COLORS.warning,
      }}>
        <PhysicalTag material="warning" style={{fontSize: 28}}>DISPO</PhysicalTag>
      </div>

      <div style={{
        position: 'absolute',
        left: 760,
        top: 965,
        opacity: accountRecover,
        transform: `translateY(${(1 - accountRecover) * 18}px)`,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 25}}>KEINE SCHULDEN</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
