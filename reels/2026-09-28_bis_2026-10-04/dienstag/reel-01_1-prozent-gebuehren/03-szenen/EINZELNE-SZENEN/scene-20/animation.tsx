import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, FONT, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: thirty-year-vault-result
 * FOCAL_PATH: The eye watches two wealth bodies build upward from the same baseline, compares their settled relative height, and only then reads the delayed final euro values.
 * PRIMARY_ACTION: Two final capital bodies build to their thirty-year relative heights before the numerical outcomes are revealed, preventing the payoff from being spoiled early.
 * CAMERA_ROLE: still; equal framing and one shared baseline keep the two outcomes directly comparable throughout the build.
 * PAYOFF: After both bodies settle, ≈447.000 € and ≈362.000 € fade in beneath them and remain visible as the final thirty-year comparison.
 *
 * ANIMATION_NARRATIVE
 * START: Two equal empty result zones sit on the same baseline with no final euro values visible.
 * MECHANISM: Emerald and gold wealth bodies grow from the bottom to different heights that encode the final outcome relationship.
 * RESULT: The growth settles first; only afterward do the two euro values appear and hold as the explicit thirty-year result.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Two large rounded wealth bodies make the thirty-year result feel physical and substantial rather than like a small chart.
 * SUPPORT: Two delayed euro labels clarify the exact final values only after the visual comparison is already understood.
 * MATERIAL: Emerald identifies the seven-percent outcome, warm gold identifies the six-percent outcome, and white is reserved for neutral supporting information.
 * DEPTH: Heavy bottom anchoring, rounded geometry, borders and contact shadows give both capital bodies weight while the stage itself remains transparent.
 *
 * RESULT_HOLD_FRAMES = 35
 */
export const FeesScene20Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const build = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: {damping: 24, stiffness: 95, mass: 1},
  });
  const reveal = pct(frame, 120, 145);

  return (
    <SceneShell
      title="Nach 30 Jahren wird es groß"
      caption="Gleiche Einzahlungen: ungefähr 447.000 Euro gegenüber 362.000 Euro."
    >
      <div style={{position: 'absolute', left: 125, top: 150, width: 360, height: 700}}>
        <div
          style={{
            position: 'absolute',
            left: 65,
            bottom: 85,
            width: 230,
            height: 540 * build,
            borderRadius: '38px 38px 18px 18px',
            background: `linear-gradient(180deg,${ANIMATION_COLORS.positive},rgba(18,90,58,.3))`,
            border: '3px solid rgba(95,255,165,.5)',
            boxShadow: '0 32px 58px rgba(0,0,0,.46)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 8,
            textAlign: 'center',
            fontFamily: FONT.title,
            fontSize: 42,
            fontWeight: 950,
            color: ANIMATION_COLORS.positive,
            opacity: reveal,
          }}
        >
          ≈ 447.000 €
        </div>
      </div>

      <div style={{position: 'absolute', right: 125, top: 150, width: 360, height: 700}}>
        <div
          style={{
            position: 'absolute',
            left: 65,
            bottom: 85,
            width: 230,
            height: 437 * build,
            borderRadius: '38px 38px 18px 18px',
            background: `linear-gradient(180deg,${C.gold},rgba(105,74,12,.3))`,
            border: '3px solid rgba(255,205,75,.5)',
            boxShadow: '0 32px 58px rgba(0,0,0,.46)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 8,
            textAlign: 'center',
            fontFamily: FONT.title,
            fontSize: 42,
            fontWeight: 950,
            color: C.gold,
            opacity: reveal,
          }}
        >
          ≈ 362.000 €
        </div>
      </div>
    </SceneShell>
  );
};
