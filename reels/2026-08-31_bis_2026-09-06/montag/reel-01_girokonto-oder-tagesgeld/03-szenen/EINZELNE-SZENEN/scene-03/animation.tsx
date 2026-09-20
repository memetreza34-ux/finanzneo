import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';
import {
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalObject,
  PremiumPhysicalStage,
} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: fn-daily-cashflow
 * PRIMARY_ACTION: Gehalt wird vom Girokonto aufgenommen; danach verlassen zwei zeitlich getrennte Zahlungseinheiten das Konto und erreichen Miete und Einkauf.
 * ANIMATION_NARRATIVE
 * START: Das Girokonto steht als physischer Alltags-Hub bereit; der Gehaltsstapel nähert sich von links.
 * MECHANISM: Gehalt trifft das Konto, Miete und Einkauf erscheinen, danach gehen zwei getrennte Zahlungen nacheinander diagonal zu den Ausgaben.
 * RESULT: Beide Ausgaben sind sichtbar erledigt und das Girokonto bleibt als aktiver Ort für laufenden Geldverkehr stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das große Girokonto bildet den stabilen Mittelpunkt eines echten Ein-und-mehrere-Ausgänge-Cashflows.
 * SUPPORT: Ein Gehaltsstapel sowie Miete und Einkauf bilden eine einzige zusammengehörige Alltagsgruppe.
 * MATERIAL: Neutraler Kontokörper, Gold für bewegtes Geld, Warnmaterial für offene Ausgaben und Grün nur für erledigte Resultate.
 * DEPTH: Gehalt kommt links aus dem Vordergrund, Girokonto sitzt zentral, Ausgaben liegen tiefer links und rechts mit klaren kurzen Zahlungswegen.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const accountEnter = interpolate(frame, [2, 18], [0, 1], clamp);
  const salaryIn = interpolate(frame, [10, 42], [0, 1], clamp);
  const expensesIn = interpolate(frame, [34, 58], [0, 1], clamp);
  const rentPay = interpolate(frame, [58, 88], [0, 1], clamp);
  const shopPay = interpolate(frame, [76, 106], [0, 1], clamp);
  const result = interpolate(frame, [106, Math.max(112, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const salaryX = interpolate(salaryIn, [0, 1], [25, 250], clamp);
  const salaryY = interpolate(salaryIn, [0, 1], [360, 315], clamp);
  const salaryOpacity = interpolate(frame, [10, 38, 52, 66], [0, 1, 1, 0], clamp);

  const rentX = interpolate(rentPay, [0, 1], [455, 135], clamp);
  const rentY = interpolate(rentPay, [0, 1], [500, 650], clamp);
  const rentOpacity = interpolate(rentPay, [0, 0.18, 0.78, 1], [0, 1, 1, 0], clamp);

  const shopX = interpolate(shopPay, [0, 1], [500, 805], clamp);
  const shopY = interpolate(shopPay, [0, 1], [500, 650], clamp);
  const shopOpacity = interpolate(shopPay, [0, 0.18, 0.78, 1], [0, 1, 1, 0], clamp);

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={325}
        y={245}
        balance={result > 0.5 ? 'ALLTAG' : 'GEHALT'}
        label="GIROKONTO"
        progress={accountEnter}
        role={result > 0.65 ? 'positive' : 'neutral'}
      />

      <div style={{position: 'absolute', inset: 0, opacity: salaryOpacity}}>
        <PhysicalCoinStack x={salaryX} y={salaryY} coins={6} progress={salaryIn} role="money" />
      </div>

      <div style={{position: 'absolute', left: 72, top: 590, opacity: expensesIn, color: ANIMATION_COLORS.warning, fontSize: 24, fontWeight: 900}}>
        MIETE
      </div>
      <PhysicalBill x={45} y={625} value="900 €" progress={expensesIn} role={rentPay > 0.78 ? 'positive' : 'warning'} scale={0.78} />

      <div style={{position: 'absolute', left: 785, top: 590, opacity: expensesIn, color: ANIMATION_COLORS.warning, fontSize: 24, fontWeight: 900}}>
        EINKAUF
      </div>
      <PhysicalBill x={705} y={625} value="120 €" progress={expensesIn} role={shopPay > 0.78 ? 'positive' : 'warning'} rotate={4} scale={0.78} />

      <PhysicalObject
        x={rentX}
        y={rentY}
        width={132}
        height={76}
        depth={14}
        radius={22}
        role="money"
        opacity={rentOpacity}
        rotate={interpolate(rentPay, [0, 1], [-4, 5], clamp)}
        grounding={0}
      >
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 950, color: '#4a2d00'}}>900 €</div>
      </PhysicalObject>

      <PhysicalObject
        x={shopX}
        y={shopY}
        width={126}
        height={76}
        depth={14}
        radius={22}
        role="money"
        opacity={shopOpacity}
        rotate={interpolate(shopPay, [0, 1], [4, -5], clamp)}
        grounding={0}
      >
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 950, color: '#4a2d00'}}>120 €</div>
      </PhysicalObject>

      <div
        style={{
          position: 'absolute',
          left: 310,
          right: 310,
          top: 865,
          textAlign: 'center',
          color: ANIMATION_COLORS.positive,
          fontSize: 30,
          fontWeight: 950,
          opacity: result,
          transform: `translateY(${(1 - result) * 14}px)`,
        }}
      >
        REIN · RAUS · BEZAHLEN
      </div>
    </PremiumPhysicalStage>
  );
};
