import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, C, FONT, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: widening-return-gap
 * FOCAL_PATH: The eye starts where both return paths share the same origin, follows their curves upward, and ends on the red vertical distance that has opened between the two outcomes.
 * PRIMARY_ACTION: Two thick wealth trajectories draw from the same start and separate over time until the widening gap itself becomes the dominant explanatory object.
 * CAMERA_ROLE: still; the full trajectory field remains visible so the viewer can compare common start, development and final separation in one frame.
 * PAYOFF: A red distance marker appears only after the paths have developed and holds the final separation as the clear long-term result.
 *
 * ANIMATION_NARRATIVE
 * START: Emerald and gold trajectories begin together at one shared lower-left origin with no visible result gap.
 * MECHANISM: Both paths draw forward, but the emerald path curves higher while the gold path remains lower and the separation steadily increases.
 * RESULT: A red vertical distance marker and short label reveal the final widened gap only after the two paths are established.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Two substantial curved wealth trajectories form one clean physical motion comparison across the visual stage.
 * SUPPORT: One restrained red distance marker and one short label identify the final gap without creating a dashboard.
 * MATERIAL: Emerald represents the stronger return path, warm gold the slower path, and warm red-orange the consequence gap.
 * DEPTH: Thick rounded strokes, large scale and separated end positions make both paths feel substantial while preserving the transparent black-world stage.
 *
 * RESULT_HOLD_FRAMES = 30
 */
export const FeesScene15Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = pct(frame, 20, 130);
  const gap = 70 + progress * 320;

  return (
    <SceneShell
      title="Der Abstand beschleunigt"
      caption="Je länger die Laufzeit, desto stärker können beide Vermögenspfade auseinanderlaufen."
    >
      <svg
        style={{position: 'absolute', left: 80, top: 90, width: 920, height: 780, overflow: 'visible'}}
        viewBox="0 0 920 780"
      >
        <path
          d="M 90 650 C 260 620, 440 500, 820 110"
          fill="none"
          stroke={ANIMATION_COLORS.positive}
          strokeWidth="22"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        <path
          d={`M 90 650 C 260 635, 440 ${545 + gap * 0.08}, 820 ${250 + gap * 0.26}`}
          fill="none"
          stroke={C.gold}
          strokeWidth="22"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        <line
          x1="805"
          y1="135"
          x2="805"
          y2={250 + gap * 0.26}
          stroke={ANIMATION_COLORS.warning}
          strokeWidth="6"
          strokeDasharray="14 12"
          opacity={pct(frame, 100, 130)}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 560,
          fontFamily: FONT.title,
          fontSize: 50,
          fontWeight: 950,
          color: ANIMATION_COLORS.warning,
          opacity: pct(frame, 100, 130),
        }}
      >
        Abstand wächst
      </div>
    </SceneShell>
  );
};
