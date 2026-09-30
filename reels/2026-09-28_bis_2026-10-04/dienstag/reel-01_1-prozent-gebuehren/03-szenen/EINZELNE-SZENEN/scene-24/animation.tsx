import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: aggregate-fee-payoff
 * FOCAL_PATH: The eye scans many small red cost fragments across the field, follows them converging into one pile, and finally lands on the delayed ≈85.600 € payoff.
 * PRIMARY_ACTION: Fourteen separate fee fragments physically converge into one accumulated value pile so many small long-term cost effects become one concrete difference.
 * CAMERA_ROLE: still; the fixed frame lets the viewer perceive the full spread first and the later convergence without losing spatial orientation.
 * PAYOFF: The final ≈85.600 € difference appears only after the fragments have gathered and then remains held as the cumulative result.
 *
 * ANIMATION_NARRATIVE
 * START: Many small red-orange cost fragments are distributed across the visual field as separate, individually modest effects.
 * MECHANISM: Every fragment travels toward a common central-lower destination and stacks into one concentrated cluster.
 * RESULT: Once the gathering action is complete, the ≈85.600 € long-term difference appears as the explicit cumulative payoff.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: The converging field of substantial red-orange fragments becomes one accumulated cost mass rather than a list of statistics.
 * SUPPORT: A delayed euro value and one short explanatory line clarify what the gathered mass represents after the physical action finishes.
 * MATERIAL: Warm red-orange is reserved for accumulated cost effects; white-soft is reserved for the neutral explanatory line.
 * DEPTH: Fragments begin across two depth rows with individual contact shadows and converge into an overlapping central cluster on the transparent stage.
 *
 * RESULT_HOLD_FRAMES = 40
 */
export const FeesScene24Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const gather = pct(frame, 20, 110);
  const payoff = pct(frame, 110, 140);

  return (
    <SceneShell
      title="Viele kleine Kosten werden groß"
      caption="Über Jahrzehnte sammeln sich kleine Kostenwirkungen zu einem großen Vermögensunterschied."
    >
      {Array.from({length: 14}, (_, index) => {
        const startX = 80 + (index % 7) * 145;
        const startY = 90 + Math.floor(index / 7) * 150;
        const targetX = 390 + (index % 5) * 62;
        const targetY = 520 - Math.floor(index / 5) * 48;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: interpolate(gather, [0, 1], [startX, targetX], CLAMP),
              top: interpolate(gather, [0, 1], [startY, targetY], CLAMP),
              width: 56,
              height: 34,
              borderRadius: 10,
              backgroundColor: ANIMATION_COLORS.warning,
              border: '2px solid rgba(255,255,255,.2)',
              rotate: `${(index % 4) * 9 - 12}deg`,
              boxShadow: '0 16px 26px rgba(0,0,0,.4)',
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 210,
          right: 210,
          top: 690,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 80,
          fontWeight: 950,
          color: ANIMATION_COLORS.warning,
          opacity: payoff,
          scale: 0.82 + payoff * 0.18,
        }}
      >
        ≈ 85.600 €
      </div>
      <div
        style={{
          position: 'absolute',
          left: 210,
          right: 210,
          top: 795,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 32,
          fontWeight: 900,
          color: C.whiteSoft,
          opacity: payoff,
        }}
      >
        Unterschied im Rechenbeispiel
      </div>
    </SceneShell>
  );
};
