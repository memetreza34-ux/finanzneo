import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: final-capital-gap-becomes-missing-55k-block
 * FOCAL_PATH: Der Blick verfolgt zwei Kapitaltürme von derselben Basis nach oben, springt auf die sichtbare Höhenlücke und folgt anschließend dem herausgezogenen 55.000-Euro-Block in die Mitte.
 * PRIMARY_ACTION: Zwei Vermögen bauen sich aus denselben Startbedingungen auf; die langfristige Differenz wird am Ende als physisch fehlender Kapitalblock nach vorn gezogen.
 * CAMERA_ROLE: Statische frontale Vergleichsbühne; der nach vorn kommende Differenzblock erzeugt den einzigen Tiefenimpuls und macht den Payoff dominant.
 * PAYOFF: Zwischen ungefähr 297.000 Euro und 242.000 Euro wird ein eigener fehlender Block mit ungefähr 55.000 Euro sichtbar.
 * ANIMATION_NARRATIVE
 * START: Zwei gleich breite Kapitalbasen beginnen auf derselben unteren Höhe.
 * MECHANISM: Beide Türme wachsen gestaffelt nach oben, der günstigere baut mehr Kapitalhöhe auf und der teurere bleibt sichtbar darunter.
 * RESULT: Ein roter Differenzblock löst sich aus der Höhenlücke nach vorn; erst danach erscheinen 297.000 Euro, 242.000 Euro und ungefähr 55.000 Euro Differenz.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei massive physische Kapitaltürme und der nach vorn gezogene Differenzblock tragen den gesamten Endvergleich.
 * SUPPORT: Endwerte und Kostenfarben erscheinen erst spät als Orientierung und ersetzen nicht die Größenwirkung.
 * MATERIAL: Emerald für das günstigere Endvermögen, Gold für das teurere und warmes Rot ausschließlich für die fehlende Differenz.
 * DEPTH: Türme stehen links und rechts im Mittelgrund; der Differenzblock löst sich aus der rechten Höhenlücke und fährt zentral in den Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 24;
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene12Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 165}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cheapBuild = spring({frame: Math.max(0, frame - 14), fps, config: {damping: 24, stiffness: 92, mass: 1}});
  const expensiveBuild = spring({frame: Math.max(0, frame - 22), fps, config: {damping: 24, stiffness: 86, mass: 1.02}});
  const diffMove = spring({frame: Math.max(0, frame - 104), fps, config: {damping: 19, stiffness: 150, mass: 0.82}});
  const payoff = interpolate(frame, [124, Math.max(136, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], CLAMP);
  const cheapHeight = interpolate(cheapBuild, [0, 1], [120, 590], CLAMP);
  const expensiveHeight = interpolate(expensiveBuild, [0, 1], [120, 470], CLAMP);

  return (
    <PremiumPhysicalStage>
      <PhysicalObject x={100} y={1030 - cheapHeight} width={310} height={cheapHeight} material="positive" radius={30}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontSize: 27, fontWeight: 900}}>0,2 % Kosten</div>
      </PhysicalObject>
      <PhysicalObject x={670} y={1030 - expensiveHeight} width={310} height={expensiveHeight} material="money" radius={30}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontSize: 27, fontWeight: 900}}>1,2 % Kosten</div>
      </PhysicalObject>

      <div
        style={{
          position: 'absolute',
          left: interpolate(diffMove, [0, 1], [720, 430], CLAMP),
          top: interpolate(diffMove, [0, 1], [505, 735], CLAMP),
          width: 224, height: 112, borderRadius: 26,
          border: `4px solid ${ANIMATION_COLORS.warning}`,
          background: `linear-gradient(145deg,${ANIMATION_COLORS.warning},rgba(82,23,20,.48))`,
          boxShadow: '0 28px 50px rgba(0,0,0,.48)',
          opacity: diffMove, scale: 0.82 + diffMove * 0.18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 34, fontWeight: 950,
        }}
      >≈ 55.000 €</div>

      <div style={{position: 'absolute', left: 112, top: 1070, opacity: payoff}}><PhysicalTag material="positive" style={{fontSize: 31}}>≈ 297.000 €</PhysicalTag></div>
      <div style={{position: 'absolute', left: 682, top: 1070, opacity: payoff}}><PhysicalTag material="warning" style={{fontSize: 31}}>≈ 242.000 €</PhysicalTag></div>
    </PremiumPhysicalStage>
  );
};
