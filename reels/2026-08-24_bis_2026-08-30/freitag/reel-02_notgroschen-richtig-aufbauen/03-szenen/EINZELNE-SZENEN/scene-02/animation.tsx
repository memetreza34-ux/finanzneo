import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  PhysicalAccount,
  PhysicalBill,
  PhysicalReserveTank,
  PhysicalTag,
  PhysicalWasher,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: emergency-reserve-pays-real-bill
 * PRIMARY_ACTION: Eine echte Reparaturrechnung fällt sichtbar in die Alltagssituation, wird vom griffbereiten Notgroschen übernommen und als bezahlt markiert, während das Girokonto stabil bleibt.
 *
 * ANIMATION_NARRATIVE
 * START: Eine defekte Waschmaschine steht neben einem normalen Girokonto; die unerwartete Reparaturrechnung fällt von oben in die Szene.
 * MECHANISM: Der Notgroschen wird sichtbar verfügbar, die Rechnung bewegt sich vom Haushaltsproblem zur Reserve und der Reservestand sinkt kontrolliert um den bezahlten Betrag.
 * RESULT: Die Rechnung trägt klar den Status BEZAHLT, das Girokonto bleibt geschützt und der Zuschauer versteht ohne Ton, wofür der Notgroschen gedacht ist.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die defekte Waschmaschine und die konkrete Reparaturrechnung bilden eine glaubwürdige Alltagssituation statt eines abstrakten Finanzsymbols.
 * SUPPORT: Girokonto, gefüllter Notgroschen-Behälter und ein kurzes deutsches Label erklären nur die notwendige finanzielle Folge.
 * MATERIAL: Reale Weiß-/Grautöne für die Waschmaschine und Rechnung, Gold für die Reserve, Emerald für den geschützten Zustand und Rot nur für den Defekt.
 * DEPTH: Waschmaschine, Rechnung, Konto und Reserve stehen auf gestaffelten Z-Ebenen; Schatten, Materialkanten und leichte Perspektive halten die Szene räumlich.
 */
export const RESULT_HOLD_FRAMES = 20;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const resultStart = Math.max(105, durationFrames - RESULT_HOLD_FRAMES - 5);

  const billFall = interpolate(frame, [4, 38], [0, 1], clamp);
  const reserveReady = interpolate(frame, [24, 58], [0, 1], clamp);
  const payMove = interpolate(frame, [52, resultStart], [0, 1], clamp);
  const protectedSettle = interpolate(frame, [82, resultStart], [0, 1], clamp);
  const problemEmphasis = interpolate(frame, [0, 26, 58], [0.94, 1.04, 1], clamp);

  const billX = 335 + payMove * 285;
  const billY = 405 + billFall * 270 - payMove * 18;
  const billScale = 0.82 - payMove * 0.13;
  const reserveFill = 0.82 - payMove * 0.20;

  return (
    <PremiumPhysicalStage>
      <PhysicalWasher x={72} y={610} broken scale={problemEmphasis} />

      <PhysicalBill
        x={billX}
        y={billY}
        label="Reparatur"
        amount="280 €"
        rotate={-7 + payMove * 9}
        scale={billScale}
        paid={payMove > 0.78}
      />

      <PhysicalReserveTank
        x={710}
        y={590}
        width={250}
        height={365}
        fill={reserveFill}
        label="Notgroschen"
        scale={0.88 + reserveReady * 0.12}
        opacity={0.55 + reserveReady * 0.45}
      />

      <PhysicalAccount
        x={365}
        y={1010 - protectedSettle * 18}
        label="Girokonto"
        balance="geschützt"
        state={protectedSettle > 0.55 ? 'protected' : 'normal'}
        scale={0.94 + protectedSettle * 0.06}
      />

      <div style={{
        position: 'absolute',
        left: 710,
        top: 1010,
        opacity: protectedSettle,
        transform: `translateY(${(1 - protectedSettle) * 20}px)`,
        color: ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize: 25}}>GRIFFBEREIT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
