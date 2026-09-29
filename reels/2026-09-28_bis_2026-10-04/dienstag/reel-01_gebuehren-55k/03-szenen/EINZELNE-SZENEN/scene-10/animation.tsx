import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: salary-fills-overdraft-before-free-money
 * PRIMARY_ACTION: Ein Gehaltsstapel trifft auf ein negatives Girokonto, füllt zuerst das Minus bis null und nur der Rest bleibt frei verfügbar.
 * ANIMATION_NARRATIVE
 * START: Girokonto ist sichtbar im Minus.
 * MECHANISM: Gehalt kommt an; ein großer Teil verschwindet physisch in der roten Kontolücke; der Kontostand stabilisiert sich bei null.
 * RESULT: Nur ein kleiner verbleibender Geldstapel steht als REST FREI daneben.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Negatives Girokonto und Gehaltsstapel.
 * SUPPORT: Verbleibender Rest macht den Unterschied sichtbar.
 * MATERIAL: Rot für Minus, Gold für Gehalt, Emerald erst nach Ausgleich.
 * DEPTH: Gehalt links vorne, Konto zentral, freier Rest rechts vorne.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=165}) => {
  const frame = useCurrentFrame();
  const salaryIn = interpolate(frame,[18,62],[0,1],clamp);
  const fillMinus = interpolate(frame,[52,108],[0,1],clamp);
  const restOut = interpolate(frame,[104,136],[0,1],clamp);
  const result = interpolate(frame,[132,Math.max(140,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const salaryX = 30 + salaryIn*360;
  const salaryY = 720 - salaryIn*45;
  return <PremiumPhysicalStage>
    <PhysicalAccount x={390} y={550} label="Girokonto" balance={fillMinus>0.82?'0 €':'−250 €'} state={fillMinus>0.82?'protected':'danger'} scale={0.97+fillMinus*0.03} />
    <PhysicalCoinStack x={salaryX} y={salaryY} count={7} scale={0.78-fillMinus*0.18} opacity={1-fillMinus*0.62} />
    <div style={{position:'absolute',left:80,top:560,opacity:salaryIn*(1-fillMinus*0.7),color:ANIMATION_COLORS.money}}><PhysicalTag material="money" style={{fontSize:25}}>GEHALT</PhysicalTag></div>
    <PhysicalCoinStack x={760+restOut*35} y={760-restOut*45} count={3} scale={0.46+restOut*0.28} opacity={restOut} />
    <div style={{position:'absolute',left:750,top:970,opacity:result,color:ANIMATION_COLORS.positive}}><PhysicalTag material="positive" style={{fontSize:27}}>REST FREI</PhysicalTag></div>
  </PremiumPhysicalStage>;
};
