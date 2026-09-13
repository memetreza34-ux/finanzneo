import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: reserve-completes-before-investment-activates
 * PRIMARY_ACTION: Der Notgroschen wird zuerst vollständig aufgebaut; erst nach dem sicheren Zustand wird der getrennte langfristige ETF-Baustein sichtbar aktiviert.
 * ANIMATION_NARRATIVE
 * START: Eine teilweise gefüllte Reserve ist aktiv, während der ETF-Baustein rechts noch zurückgenommen und inaktiv bleibt.
 * MECHANISM: Zwei Geldstapel erhöhen zuerst den Reservefüllstand bis zum sicheren Ziel; danach erscheint der Sicherheits-Check und erst dann richtet sich der ETF-Baustein auf.
 * RESULT: SICHERHEIT steht sichtbar vor INVESTIEREN und beide Objekte bleiben als getrennte Stufen stabil stehen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der große Notgroschen-Reservetank schließt zuerst sichtbar ab und gibt erst danach den Investment-Baustein frei.
 * SUPPORT: Zwei kleine Geldstapel erklären den Aufbau; kurze Nummern-Tags markieren nur die bereits sichtbare Reihenfolge.
 * MATERIAL: Emerald für sichere Reserve, Gold für Aufbaukapital, neutrales Ivory für den später aktivierten Investment-Baustein.
 * DEPTH: Reserve links vorne als erste Stufe, Investment rechts hinten und zunächst kleiner; nach Freigabe rückt er sichtbar nach vorn.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const reserveBuild = interpolate(frame,[4,56],[0,1],clamp);
  const firstCoin = interpolate(frame,[0,30],[0,1],clamp);
  const secondCoin = interpolate(frame,[26,58],[0,1],clamp);
  const safetyLock = interpolate(frame,[54,72],[0,1],clamp);
  const investActivate = interpolate(frame,[70,96],[0,1],clamp);
  const resultIn = interpolate(frame,[92,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);

  return <PremiumPhysicalStage>
    <PhysicalReserveTank x={135} y={510} width={285} height={440} fill={0.28+reserveBuild*0.65} label="Notgroschen" scale={0.98+safetyLock*0.03} />
    <PhysicalCoinStack x={110+firstCoin*130} y={790-firstCoin*150} count={4} scale={0.55} opacity={1-firstCoin*0.45} />
    <PhysicalCoinStack x={245+secondCoin*105} y={850-secondCoin*190} count={4} scale={0.55} opacity={1-secondCoin*0.45} />

    <PhysicalAccount x={690} y={610-(investActivate*70)} label="ETF langfristig" balance="Investieren" state="normal" scale={0.72+investActivate*0.28} opacity={0.22+investActivate*0.78} tilt={-4+investActivate*4} />

    <div style={{position:'absolute',left:150,top:1010,opacity:safetyLock,color:ANIMATION_COLORS.positive}}>
      <PhysicalTag material="positive" style={{fontSize:24}}>1  SICHERHEIT ✓</PhysicalTag>
    </div>
    <div style={{position:'absolute',left:670,top:1010,opacity:investActivate,color:ANIMATION_COLORS.neutral}}>
      <PhysicalTag material="neutral" style={{fontSize:24}}>2  INVESTIEREN</PhysicalTag>
    </div>
    <div style={{position:'absolute',left:410,top:1090,opacity:resultIn,transform:`translateY(${(1-resultIn)*12}px)`,color:ANIMATION_COLORS.positive}}>
      <PhysicalTag material="positive" style={{fontSize:24}}>ERST SICHERHEIT, DANN LANGFRISTIG</PhysicalTag>
    </div>
  </PremiumPhysicalStage>;
};
