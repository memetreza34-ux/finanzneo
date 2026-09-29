import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: annual-fee-cuts-growing-capital
 * FOCAL_PATH: Der Blick startet am großen Kapitalreservoir, folgt drei herausgelösten Kostenstücken nach rechts unten und endet wieder beim sichtbar niedrigeren Füllstand.
 * PRIMARY_ACTION: Ein wachsendes Depot verliert bei mehreren Jahresimpulsen nacheinander reale Wertstücke an laufende Kosten.
 * CAMERA_ROLE: Die Bühne bleibt nah und ruhig; die große Reservoirform füllt den Kern der Visualzone, damit Entnahme und verbleibendes Kapital ohne Kameratrick lesbar bleiben.
 * PAYOFF: Drei entfernte Wertstücke liegen getrennt als Kosten, während im Depot sichtbar weniger Kapital verbleibt.
 * ANIMATION_NARRATIVE
 * START: Ein großes Depotreservoir ist fast vollständig mit grünem Kapital gefüllt.
 * MECHANISM: Drei Jahresimpulse lösen nacheinander kleine Wertstücke aus dem Kapital; jedes Stück fällt separat aus dem Depot heraus.
 * RESULT: Das Depotreservoir bleibt sichtbar niedriger gefüllt zurück und die gesammelten Kosten liegen getrennt daneben.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das große physische Kapitalreservoir trägt die Ursache-Wirkung und bleibt während der ganzen Szene fokal.
 * SUPPORT: Drei herausgelöste Kostenstücke und kurze Jahresmarker zeigen die wiederkehrende Belastung.
 * MATERIAL: Emerald steht für investiertes Kapital, warmes Rot nur für entfernte Kosten und Ivory für neutrale Jahresmarker.
 * DEPTH: Das Reservoir steht groß links-mittig; Kostenstücke lösen sich von seiner rechten Seite und fallen in den rechten Vordergrund.
 */
export const RESULT_HOLD_FRAMES = 24;
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const CUT_STARTS = [34, 67, 100];

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 165}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame: Math.max(0, frame - 4), fps, config: {damping: 22, stiffness: 140, mass: 0.9}});
  const cutProgress = CUT_STARTS.map((start) => interpolate(frame, [start, start + 21], [0, 1], CLAMP));
  const removed = cutProgress.reduce((sum, value) => sum + value, 0);
  const fill = interpolate(removed, [0, 3], [0.92, 0.68], CLAMP);
  const payoff = interpolate(frame, [122, Math.max(134, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], CLAMP);

  return (
    <PremiumPhysicalStage>
      <PhysicalReserveTank
        x={170}
        y={500}
        width={600}
        height={390}
        fill={fill}
        label="Depotwert"
        scale={0.9 + intro * 0.1}
        opacity={intro}
      />

      {cutProgress.map((cut, index) => {
        const x = interpolate(cut, [0, 1], [690 - index * 12, 820 + index * 24], CLAMP);
        const y = interpolate(cut, [0, 1], [600 + index * 55, 865 + index * 45], CLAMP);
        const turn = interpolate(cut, [0, 1], [0, 13 + index * 8], CLAMP);
        const labelIn = interpolate(frame, [CUT_STARTS[index] - 10, CUT_STARTS[index] + 2], [0, 1], CLAMP);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: 178 + index * 130, top: 438, opacity: labelIn}}>
              <PhysicalTag material="neutral" style={{fontSize: 21}}>JAHR {index + 1}</PhysicalTag>
            </div>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 78,
                height: 90,
                borderRadius: 18,
                border: `3px solid ${ANIMATION_COLORS.warning}`,
                background: `linear-gradient(145deg,${ANIMATION_COLORS.warning},rgba(90,24,20,.38))`,
                boxShadow: '0 20px 34px rgba(0,0,0,.44)',
                opacity: cut,
                rotate: `${turn}deg`,
                scale: 0.78 + cut * 0.22,
              }}
            />
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 728, top: 1040, opacity: payoff, translate: `0 ${18 - payoff * 18}px`}}>
        <PhysicalTag material="warning" style={{fontSize: 27}}>KOSTEN · JEDES JAHR</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
