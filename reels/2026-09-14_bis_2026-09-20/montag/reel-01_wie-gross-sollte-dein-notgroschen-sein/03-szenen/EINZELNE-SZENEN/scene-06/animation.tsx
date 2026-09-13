import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalAccount, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: liquid-cash-chooses-stable-access
 * PRIMARY_ACTION: Ein einzelner Notgroschen-Geldstapel sieht rechts einen deutlich schwankenden ETF-Marktpfad und bewegt sich anschließend klar in das links stabile Tagesgeldkonto.
 * ANIMATION_NARRATIVE
 * START: Links steht ein stabiles Tagesgeldkonto, mittig der Notgroschen, rechts nur ein eigenständiger ETF-Marktpfad — kein zweites Konto und keine zweite Karte.
 * MECHANISM: Der rote ETF-Pfad fällt sichtbar und federt nur teilweise zurück; das Tagesgeld bleibt unverändert. Danach bewegt sich der Goldstapel vom Zentrum nach links zum Tagesgeld.
 * RESULT: Der Goldstapel liegt eindeutig beim Tagesgeld; VERFÜGBAR erscheint als Ergebnis, während der ETF-Pfad getrennt weiter sichtbar bleibt.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Eine Ortsentscheidung des Notgroschens zwischen stabil zugänglichem Tagesgeld und schwankendem Marktwert.
 * SUPPORT: Der ETF wird nur durch einen großen physischen Marktpfad mit kurzer Beschriftung dargestellt; keine zweite Account-Komponente und keine UI.
 * MATERIAL: Emerald für Tagesgeld, Gold für Notgroschen, warmes Red-Orange für Schwankung, Ivory für neutrale Markierungen.
 * DEPTH: Tagesgeld links in sicherem Innenabstand, Geldstapel mittig, ETF-Pfad rechts vollständig innerhalb X=620–920.
 */
export const RESULT_HOLD_FRAMES = 26;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 165}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = spring({frame, fps, config:{damping:20, stiffness:95}, durationInFrames:24});
  const marketDrop = interpolate(frame, [28, 62], [0, 1], clamp);
  const marketRecover = interpolate(frame, [64, 90], [0, 1], clamp);
  const chooseStable = interpolate(frame, [92, 128], [0, 1], clamp);
  const resultIn = interpolate(frame, [124, Math.max(138, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const coinX = 455 - chooseStable * 215;
  const coinY = 790 - chooseStable * 70;
  const pathOffset = marketDrop * 105 - marketRecover * 45;
  const chartOpacity = interpolate(frame, [8, 24], [0, 1], clamp);

  return (
    <PremiumPhysicalStage>
      <PhysicalAccount
        x={145}
        y={575}
        label="Tagesgeld"
        balance="jederzeit verfügbar"
        state="protected"
        scale={0.94 + chooseStable * 0.05}
        opacity={sceneIn}
      />

      <PhysicalCoinStack
        x={coinX}
        y={coinY}
        count={6}
        scale={0.70 + chooseStable * 0.07}
        opacity={sceneIn}
      />

      <div style={{
        position:'absolute',left:620,top:520,width:300,height:360,
        opacity:chartOpacity,
        transform:`translateY(${(1-chartOpacity)*18}px)`,
      }}>
        <div style={{fontSize:26,fontWeight:950,color:'#E8E0CC',letterSpacing:0.5}}>ETF-MARKTWERT</div>
        <svg width="300" height="245" viewBox="0 0 300 245" style={{marginTop:22,overflow:'visible'}}>
          <path
            d={`M 12 65 C 58 ${58 + pathOffset*0.15}, 78 ${54 + pathOffset*0.25}, 112 ${92 + pathOffset*0.55} C 148 ${126 + pathOffset}, 178 ${116 + pathOffset*0.82}, 212 ${145 + pathOffset*0.72} C 246 ${128 + pathOffset*0.58}, 266 ${118 + pathOffset*0.50}, 290 ${126 + pathOffset*0.42}`}
            fill="none"
            stroke={ANIMATION_COLORS.warning}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="10" y1="205" x2="292" y2="205" stroke="rgba(255,255,255,0.24)" strokeWidth="3" />
          <circle cx="112" cy={92 + pathOffset*0.55} r="12" fill={ANIMATION_COLORS.warning} />
          <circle cx="212" cy={145 + pathOffset*0.72} r="12" fill={ANIMATION_COLORS.warning} />
        </svg>
        <div style={{position:'absolute',left:66,top:300,color:ANIMATION_COLORS.warning,fontSize:23,fontWeight:900,opacity:Math.max(marketDrop,marketRecover)}}>
          SCHWANKT
        </div>
      </div>

      <div style={{position:'absolute',left:190,top:930,opacity:sceneIn,color:ANIMATION_COLORS.positive}}>
        <PhysicalTag material="positive" style={{fontSize:22}}>STABIL</PhysicalTag>
      </div>

      <div style={{
        position:'absolute',left:220,top:1045,
        opacity:resultIn,
        transform:`translateY(${(1-resultIn)*14}px)`,
        color:ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize:25}}>NOTGROSCHEN: VERFÜGBAR</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
