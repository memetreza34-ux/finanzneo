import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, C, FONT, GoldCoin, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: compounding-fee-siphon
 * FOCAL_PATH: The eye follows new return coins toward the central capital chamber, then notices a red fee branch divert value before it can rejoin the next growth cycle.
 * PRIMARY_ACTION: Returns visibly feed back into the capital while a separate fee siphon diverts part of the value before that value can compound again.
 * CAMERA_ROLE: still; the central capital chamber, incoming returns and fee outlet must remain visible at the same time.
 * PAYOFF: The viewer sees that every diverted fee fragment is value that no longer reaches the capital chamber for future compounding.
 *
 * ANIMATION_NARRATIVE
 * START: One central capital chamber sits ready to receive new return value for the next compounding cycle.
 * MECHANISM: Multiple gold return coins rise into the chamber while a red-orange fee fragment travels sideways into a separate fee outlet.
 * RESULT: The capital remains the focal object, but the visible diversion makes clear why removed value cannot generate future returns.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: A large rounded emerald capital chamber represents the invested base that receives and compounds new returns.
 * SUPPORT: Six gold return coins, one red-orange fee outlet and one moving fee fragment explain the lost-compounding mechanism.
 * MATERIAL: Emerald represents invested capital, gold represents returns and money, and red-orange is reserved for the fee diversion.
 * DEPTH: The chamber uses inset lighting and contact shadow; coins move through foreground depth while the fee outlet sits laterally as a separate destination.
 *
 * RESULT_HOLD_FRAMES = 30
 */
export const FeesScene11Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const diversion = pct(frame, 25, 130);

  return (
    <SceneShell
      title="Gebühren kosten auch Rendite"
      caption="Fehlendes Kapital kann später selbst keine Rendite mehr erzeugen. Das verstärkt den Effekt."
    >
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 245,
          width: 400,
          height: 300,
          borderRadius: 90,
          border: '3px solid rgba(95,255,165,.48)',
          backgroundColor: C.accentDk,
          boxShadow: 'inset 0 0 80px rgba(95,255,165,.18),0 35px 65px rgba(0,0,0,.5)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 102,
            textAlign: 'center',
            fontFamily: FONT.title,
            fontSize: 44,
            fontWeight: 950,
            color: C.white,
          }}
        >
          DEIN KAPITAL
        </div>
      </div>

      {Array.from({length: 6}, (_, index) => {
        const progress = pct(frame, 30 + index * 14, 45 + index * 14);
        const x = 470 + (index % 3) * 72;
        const y = 620 - (index % 2) * 55;
        return <GoldCoin key={index} x={x} y={y - progress * 245} size={62} opacity={progress} />;
      })}

      <div
        style={{
          position: 'absolute',
          left: 770,
          top: 315,
          width: 210,
          height: 150,
          borderRadius: 30,
          border: '3px solid rgba(255,80,80,.5)',
          background: 'linear-gradient(145deg,rgba(255,70,70,.26),rgba(35,10,10,.72))',
          opacity: pct(frame, 55, 80),
          boxShadow: '0 25px 45px rgba(0,0,0,.42)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.title,
            fontSize: 34,
            fontWeight: 950,
            color: ANIMATION_COLORS.warning,
          }}
        >
          GEBÜHR
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 735,
          top: 405,
          width: 46,
          height: 14,
          borderRadius: 8,
          backgroundColor: ANIMATION_COLORS.warning,
          translate: `${diversion * 85}px ${diversion * 20}px`,
          opacity: pct(frame, 65, 100),
          boxShadow: '0 10px 18px rgba(0,0,0,.35)',
        }}
      />
    </SceneShell>
  );
};
