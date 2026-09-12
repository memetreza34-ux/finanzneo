import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  LottieBox,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalTag,
  PremiumPhysicalStage,
} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: nominal-balance-real-power-divergence
 * PRIMARY_ACTION: Ein Konto bleibt sichtbar bei 100 Euro, während sich der Preis desselben Einkaufs daneben bis auf 134 Euro erhöht und damit die Kaufkraftlücke real sichtbar wird.
 * ANIMATION_NARRATIVE
 * START: Kontostand und Einkaufsbeleg beginnen beide bei 100 Euro.
 * MECHANISM: Das Konto verändert seinen nominalen Betrag nicht; der Beleg steigt dagegen schrittweise auf 134 Euro und ein kleiner Lupenhinweis fokussiert erst danach die entstandene Differenz.
 * RESULT: Das Konto zeigt weiterhin 100 Euro, während derselbe Einkauf 134 Euro verlangt; Kaufkraftverlust ist ohne verschwindendes Kontogeld sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Konto und Einkaufsbeleg bilden den direkten realen Vergleich.
 * SUPPORT: Gold-Geldstapel und eine kleine lokale Lottie-Lupe unterstützen die Wahrnehmung der Differenz, ohne die Hauptmechanik zu ersetzen.
 * MATERIAL: Emerald-Neutral für den stabilen Kontostand, Ivory für den Beleg, Gold für Geld und Warm Red-Orange für die Preisbelastung.
 * DEPTH: Konto links vorne, Geld mittig, Beleg rechts; der Lupenhinweis sitzt klein über dem Preisbereich.
 */
export const RESULT_HOLD_FRAMES = 22;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const accountIn = interpolate(frame, [2, 24], [0, 1], clamp);
  const billIn = interpolate(frame, [12, 38], [0, 1], clamp);
  const priceGap = interpolate(frame, [44, 101], [0, 1], clamp);
  const lottieIn = interpolate(frame, [88, 112], [0, 1], clamp);
  const result = interpolate(frame, [103, Math.max(112, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const amount = priceGap < 0.3 ? '100 €' : priceGap < 0.58 ? '116 €' : '134 €';

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={92}
        y={600}
        label="Kontostand"
        balance="100 €"
        state="protected"
        scale={0.88 + accountIn * 0.1}
        opacity={accountIn}
      />
      <PhysicalCoinStack x={420} y={790} count={6} scale={0.66} opacity={0.82} />
      <PhysicalBill
        x={690}
        y={585 + (1 - billIn) * 52}
        label="Derselbe Einkauf"
        amount={amount}
        rotate={4 - priceGap * 2}
        scale={0.82 + billIn * 0.08}
        opacity={billIn}
        paid={false}
      />
      <div style={{position: 'absolute', left: 720, top: 500, opacity: lottieIn * (0.85 + result * 0.15)}}>
        <LottieBox file="lottie/lupe.json" size={145} loop={false} playbackRate={1} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 335,
          top: 1040,
          opacity: result,
          color: ANIMATION_COLORS.warning,
          transform: `translateY(${(1 - result) * 15}px)`,
        }}
      >
        <PhysicalTag material="warning" style={{fontSize: 26}}>KONTO 100 € · EINKAUF 134 €</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
