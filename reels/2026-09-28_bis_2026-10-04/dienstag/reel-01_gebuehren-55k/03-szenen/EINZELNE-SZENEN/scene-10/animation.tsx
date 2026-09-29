import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: repeated-fee-brakes-compounding-momentum
 * FOCAL_PATH: Der Blick startet bei zwei gleich großen Depotkörpern auf gleicher Höhe, folgt beiden aufwärts und bleibt an den drei Kostenschwellen der teuren rechten Spur hängen, bevor er die unterschiedlichen Endhöhen vergleicht.
 * PRIMARY_ACTION: Zwei gleich gestartete Depots wachsen parallel; nur das teurere wird wiederholt durch sichtbare Kostenschwellen gebremst und bleibt dadurch niedriger.
 * CAMERA_ROLE: Die Kamera bleibt statisch und zeigt beide Wachstumsspuren gleichzeitig, damit gleiche Startbedingungen und unterschiedliche Dynamik ohne Schnitt vergleichbar bleiben.
 * PAYOFF: Das günstige Depot endet deutlich höher und größer, obwohl beide Depots am selben Punkt begonnen haben.
 * ANIMATION_NARRATIVE
 * START: Zwei identische Depotkörper stehen nebeneinander auf derselben unteren Ausgangshöhe.
 * MECHANISM: Beide Depots steigen und wachsen; die rechte Spur trifft nacheinander drei Kostenschwellen, nach denen ihr Wachstum jeweils sichtbar zurückfällt.
 * RESULT: Das Depot mit 0,2 Prozent Kosten erreicht eine höhere Position und größere Größe als das Depot mit 1,2 Prozent Kosten.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei große physische Depotkörper tragen den Vergleich und verändern gleichzeitig Höhe und Größe.
 * SUPPORT: Drei rote Kostenschwellen auf der rechten Spur markieren die wiederholte Bremswirkung.
 * MATERIAL: Emerald kennzeichnet den günstigeren Wachstumspfad, warmes Gold den teureren und Rot ausschließlich die Kostenschwellen.
 * DEPTH: Beide Depots bewegen sich vom unteren Vordergrund nach oben; Kostenschwellen liegen quer vor der rechten Spur und erzeugen sichtbare Staffelung.
 */
export const RESULT_HOLD_FRAMES = 24;
const CLAMP = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 156}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [16, 118], [0, 1], CLAMP);
  const payoff = interpolate(frame, [118, Math.max(130, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], CLAMP);
  const cheapY = interpolate(travel, [0, 1], [900, 420], CLAMP);
  const expensiveY = interpolate(travel, [0, 0.34, 0.62, 0.84, 1], [900, 785, 690, 610, 560], CLAMP);
  const cheapScale = interpolate(travel, [0, 1], [0.72, 1.28], CLAMP);
  const expensiveScale = interpolate(travel, [0, 0.34, 0.62, 0.84, 1], [0.72, 0.84, 0.93, 1.0, 1.06], CLAMP);

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount x={120} y={cheapY} label="Depot A" state="protected" scale={cheapScale} />
      <PhysicalAccount x={650} y={expensiveY} label="Depot B" state="normal" scale={expensiveScale} />

      {[0, 1, 2].map((index) => {
        const hit = 47 + index * 27;
        const pulse = interpolate(frame, [hit - 7, hit, hit + 10], [0.25, 1, 0.36], CLAMP);
        return (
          <div
            key={index}
            style={{
              position: 'absolute', left: 612, top: 825 - index * 122, width: 345, height: 26,
              borderRadius: 13, background: ANIMATION_COLORS.warning, opacity: pulse,
              boxShadow: '0 0 22px rgba(255,84,62,.24)',
            }}
          />
        );
      })}

      <div style={{position: 'absolute', left: 150, top: 1050, opacity: payoff}}><PhysicalTag material="positive" style={{fontSize: 27}}>0,2 % KOSTEN</PhysicalTag></div>
      <div style={{position: 'absolute', left: 680, top: 1050, opacity: payoff}}><PhysicalTag material="warning" style={{fontSize: 27}}>1,2 % KOSTEN</PhysicalTag></div>
    </PremiumPhysicalStage>
  );
};
