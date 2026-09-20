import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';
import {
  PhysicalAccount,
  PhysicalBill,
  PhysicalObject,
  PhysicalReserveTank,
  PremiumPhysicalStage,
} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: fn-role-partition
 * PRIMARY_ACTION: Eine massive Trennwand setzt sich zwischen Girokonto und Tagesgeld; eine Alltagsrechnung belastet ausschließlich die Giro-Seite, während die Rücklage stabil bleibt.
 * ANIMATION_NARRATIVE
 * START: Girokonto und Tagesgeld stehen als zwei große Geldorte noch ohne sichtbare funktionale Grenze nebeneinander.
 * MECHANISM: Eine physische Trennwand fährt zwischen beide Rollen; anschließend erscheint links eine Alltagsrechnung und eine Zahlung verlässt nur das Girokonto.
 * RESULT: Links ist ALLTAG sichtbar belastet, rechts bleibt die RÜCKLAGE unverändert hinter der stabilen Trennung stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die massive zentrale Rollen-Trennung ist die erklärende Hauptaktion und ersetzt eine weitere Transfergeschichte.
 * SUPPORT: Girokonto, Tagesgeld-Reservetank und eine konkrete Rechnung zeigen, welche Seite im Alltag tatsächlich arbeitet.
 * MATERIAL: Neutrale Geldorte, Gold für die einzelne Zahlung, Warnrot für die offene Rechnung und Grün nur für die geschützte Rücklage.
 * DEPTH: Giro und Rechnung liegen links im Vordergrund, Reserve rechts leicht zurückgesetzt, die Trennwand sitzt körperlich dazwischen.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 135}) => {
  const frame = useCurrentFrame();
  const objectsIn = interpolate(frame, [2, 20], [0, 1], clamp);
  const dividerDrop = interpolate(frame, [18, 48], [0, 1], clamp);
  const billIn = interpolate(frame, [42, 66], [0, 1], clamp);
  const payment = interpolate(frame, [62, 94], [0, 1], clamp);
  const reserveSettle = interpolate(frame, [80, 102], [0, 1], clamp);
  const result = interpolate(frame, [96, Math.max(104, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const dividerY = interpolate(dividerDrop, [0, 1], [-460, 150], clamp);
  const payX = interpolate(payment, [0, 1], [265, 145], clamp);
  const payY = interpolate(payment, [0, 1], [500, 650], clamp);
  const payOpacity = interpolate(payment, [0, 0.15, 0.82, 1], [0, 1, 1, 0], clamp);

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={75}
        y={275}
        balance={payment > 0.72 ? 'ALLTAG' : 'GIRO'}
        label="GIROKONTO"
        progress={objectsIn}
        role="neutral"
      />

      <PhysicalReserveTank
        x={745}
        y={235 - reserveSettle * 8}
        fill={0.72}
        label="TAGESGELD"
        role="positive"
      />

      <PhysicalObject
        x={500}
        y={dividerY}
        width={82}
        height={520}
        depth={24}
        radius={30}
        role="neutral"
        opacity={dividerDrop}
        grounding={dividerDrop}
      >
        <div style={{position: 'absolute', left: 22, right: 22, top: 52, bottom: 52, borderRadius: 999, background: 'rgba(0,0,0,0.18)'}} />
        <div style={{position: 'absolute', left: 17, right: 17, top: 230, height: 62, borderRadius: 22, border: '5px solid rgba(0,0,0,0.35)'}} />
      </PhysicalObject>

      <div style={{position: 'absolute', left: 96, top: 585, opacity: billIn, color: ANIMATION_COLORS.warning, fontSize: 24, fontWeight: 900}}>
        ALLTAGSAUSGABE
      </div>
      <PhysicalBill
        x={45}
        y={620}
        value="75 €"
        progress={billIn}
        role={payment > 0.78 ? 'positive' : 'warning'}
        scale={0.78}
      />

      <PhysicalObject
        x={payX}
        y={payY}
        width={126}
        height={76}
        depth={14}
        radius={22}
        role="money"
        opacity={payOpacity}
        rotate={interpolate(payment, [0, 1], [-3, 5], clamp)}
        grounding={0}
      >
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 950, color: '#4a2d00'}}>75 €</div>
      </PhysicalObject>

      <div style={{position: 'absolute', left: 120, top: 850, opacity: result, color: ANIMATION_COLORS.secondaryText, fontSize: 30, fontWeight: 950}}>
        ALLTAG
      </div>
      <div style={{position: 'absolute', right: 120, top: 850, opacity: result, color: ANIMATION_COLORS.positive, fontSize: 30, fontWeight: 950}}>
        RÜCKLAGE
      </div>
    </PremiumPhysicalStage>
  );
};
