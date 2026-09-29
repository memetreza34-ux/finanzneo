import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: gross-return-passes-through-two-cost-gates
 * FOCAL_PATH: Der Blick beginnt am gemeinsamen 7-Prozent-Kern, folgt der Aufteilung in zwei Wege, trifft auf zwei unterschiedlich starke Kostentore und endet bei den beiden Nettorenditen.
 * PRIMARY_ACTION: Derselbe Renditeimpuls passiert zwei physische Kostentore; das stärkere Tor lässt sichtbar weniger Wachstum passieren.
 * CAMERA_ROLE: Statische Split-Komposition mit großem gemeinsamen Startkern; keine Kamerabewegung ersetzt die eigentliche Torwirkung.
 * PAYOFF: Erst nach dem Durchgang erscheinen 6,8 Prozent und 5,8 Prozent als zwei unterschiedlich starke verbleibende Renditen.
 * ANIMATION_NARRATIVE
 * START: Ein gemeinsamer 7-Prozent-Renditekern sitzt oben mittig und beide Wege beginnen identisch.
 * MECHANISM: Der Kern teilt sich; links passiert der Wert ein kleines 0,2-Prozent-Kostentor, rechts ein stärkeres 1,2-Prozent-Kostentor, das mehr vom Fluss zurückhält.
 * RESULT: Die linke Seite endet bei 6,8 Prozent, die rechte bei 5,8 Prozent und beide Resultate werden erst nach der Kostenwirkung sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei große physische Kostentore verändern denselben Ausgangsfluss und machen Brutto-zu-Netto unmittelbar sichtbar.
 * SUPPORT: Der gemeinsame 7-Prozent-Kern und zwei Wertbänder dienen nur als Ursache und Bewegungsrichtung.
 * MATERIAL: Gold markiert den gemeinsamen Ausgangswert, Emerald die verbleibende Rendite und warmes Rot das stärkere Kostentor.
 * DEPTH: Startkern liegt oben mittig, Tore groß links und rechts im Mittelgrund, Nettorenditen erscheinen tiefer im Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 24;
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene05Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceIn = spring({frame: Math.max(0, frame - 5), fps, config: {damping: 20, stiffness: 150}});
  const branch = interpolate(frame, [25, 62], [0, 1], CLAMP);
  const gateAction = interpolate(frame, [58, 101], [0, 1], CLAMP);
  const payoff = interpolate(frame, [108, Math.max(120, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], CLAMP);

  return (
    <PremiumPhysicalStage>
      <div
        style={{
          position: 'absolute', left: 427, top: 360, width: 226, height: 170, borderRadius: 42,
          border: `4px solid ${ANIMATION_COLORS.money}`,
          background: `linear-gradient(145deg,#FFF0AF,${ANIMATION_COLORS.money} 38%,rgba(90,62,10,.72))`,
          boxShadow: '0 30px 52px rgba(0,0,0,.44)',
          opacity: sourceIn, scale: 0.84 + sourceIn * 0.16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#241A08', fontSize: 58, fontWeight: 950,
        }}
      >7 %</div>

      <div style={{position: 'absolute', left: 280, top: 525, width: 12, height: 110, background: ANIMATION_COLORS.positive, opacity: branch, rotate: '34deg', transformOrigin: '50% 0%'}} />
      <div style={{position: 'absolute', left: 788, top: 525, width: 12, height: 110, background: ANIMATION_COLORS.positive, opacity: branch, rotate: '-34deg', transformOrigin: '50% 0%'}} />

      <PhysicalObject x={110} y={600} width={330} height={250} material="money" scale={0.9 + gateAction * 0.1} opacity={interpolate(branch, [0.3, 1], [0, 1], CLAMP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 25, fontWeight: 900}}>LAUFENDE KOSTEN</div>
          <div style={{fontSize: 48, fontWeight: 950, marginTop: 12}}>0,2 %</div>
        </div>
      </PhysicalObject>

      <PhysicalObject x={640} y={600} width={330} height={250} material="warning" scale={0.9 + gateAction * 0.1} opacity={interpolate(branch, [0.3, 1], [0, 1], CLAMP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 25, fontWeight: 900}}>LAUFENDE KOSTEN</div>
          <div style={{fontSize: 48, fontWeight: 950, marginTop: 12}}>1,2 %</div>
        </div>
      </PhysicalObject>

      <div style={{position: 'absolute', left: 174, top: 930, width: 210, height: 24, borderRadius: 12, background: ANIMATION_COLORS.positive, opacity: gateAction, scale: `${interpolate(gateAction, [0, 1], [0.15, 1], CLAMP)} 1`, transformOrigin: '0 50%'}} />
      <div style={{position: 'absolute', left: 707, top: 930, width: 136, height: 24, borderRadius: 12, background: ANIMATION_COLORS.positive, opacity: gateAction, scale: `${interpolate(gateAction, [0, 1], [0.15, 1], CLAMP)} 1`, transformOrigin: '0 50%'}} />

      <div style={{position: 'absolute', left: 160, top: 1005, opacity: payoff}}><PhysicalTag material="positive" style={{fontSize: 40}}>6,8 %</PhysicalTag></div>
      <div style={{position: 'absolute', left: 694, top: 1005, opacity: payoff}}><PhysicalTag material="warning" style={{fontSize: 40}}>5,8 %</PhysicalTag></div>
    </PremiumPhysicalStage>
  );
};
