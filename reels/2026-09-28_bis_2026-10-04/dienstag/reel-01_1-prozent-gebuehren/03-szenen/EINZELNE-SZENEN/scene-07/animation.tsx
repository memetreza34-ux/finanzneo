import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, C, FONT, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: twin-capital-paths
 * FOCAL_PATH: The eye compares two equal starting towers, follows their simultaneous growth, notices repeated red shavings only on the six-percent side, and ends on the height gap.
 * PRIMARY_ACTION: Two equal capital paths grow together while only the slower path repeatedly loses small cost fragments and therefore finishes visibly lower.
 * CAMERA_ROLE: still; fixed left-right framing protects the equality of the start and makes the final divergence immediately comparable.
 * PAYOFF: The seven-percent tower settles higher than the six-percent tower after the slower side has visibly lost several small fragments.
 *
 * ANIMATION_NARRATIVE
 * START: Two capital towers begin at the same base height with equal visual weight and matching spatial scale.
 * MECHANISM: Both towers grow upward while five red-orange shavings leave only the slower six-percent path during the build.
 * RESULT: The two paths settle at different heights and remain side by side long enough for the viewer to compare them.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Two large rounded capital towers form one direct physical comparison rather than a dashboard or card row.
 * SUPPORT: Five compact red-orange cost shavings leave only the slower path and explain why the gap emerges.
 * MATERIAL: Emerald identifies the stronger growth path, warm gold identifies the slower path, and red-orange is reserved for value lost to costs.
 * DEPTH: Strong bottom anchoring, rounded edges, borders and contact shadows give the towers substantial physical presence on the transparent stage.
 *
 * RESULT_HOLD_FRAMES = 30
 */
export const FeesScene07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const growth = pct(frame, 20, 130);
  const fastHeight = 230 + growth * 470;
  const slowHeight = 230 + growth * 360;

  return (
    <SceneShell
      title="Am Anfang fast gleich"
      caption="Beide Wege starten identisch. Der langsamere verliert Jahr für Jahr Wachstum."
    >
      <div style={{position: 'absolute', left: 170, top: 130, width: 300, height: 760}}>
        <div
          style={{
            position: 'absolute',
            left: 55,
            bottom: 80,
            width: 190,
            height: fastHeight,
            borderRadius: '32px 32px 18px 18px',
            background: `linear-gradient(180deg,${ANIMATION_COLORS.positive},rgba(26,120,74,.32))`,
            border: '3px solid rgba(95,255,165,.52)',
            boxShadow: '0 30px 55px rgba(0,0,0,.45)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 18,
            textAlign: 'center',
            fontFamily: FONT.body,
            fontSize: 30,
            fontWeight: 900,
            color: C.white,
          }}
        >
          7 %
        </div>
      </div>

      <div style={{position: 'absolute', right: 170, top: 130, width: 300, height: 760}}>
        <div
          style={{
            position: 'absolute',
            left: 55,
            bottom: 80,
            width: 190,
            height: slowHeight,
            borderRadius: '32px 32px 18px 18px',
            background: `linear-gradient(180deg,${C.gold},rgba(129,92,13,.3))`,
            border: '3px solid rgba(255,205,75,.52)',
            boxShadow: '0 30px 55px rgba(0,0,0,.45)',
          }}
        />
        {Array.from({length: 5}, (_, index) => {
          const progress = pct(frame, 45 + index * 18, 58 + index * 18);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 245 + progress * 72,
                bottom: 230 + index * 76,
                width: 48,
                height: 18,
                borderRadius: 9,
                backgroundColor: ANIMATION_COLORS.warning,
                opacity: progress,
                boxShadow: '0 12px 22px rgba(0,0,0,.35)',
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 18,
            textAlign: 'center',
            fontFamily: FONT.body,
            fontSize: 30,
            fontWeight: 900,
            color: C.white,
          }}
        >
          6 %
        </div>
      </div>
    </SceneShell>
  );
};
