import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalCoinStack, PhysicalObject, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: safety-vault-unlocks-investment-step
 * PRIMARY_ACTION: Zwei kleine Geldstapel schließen zuerst sichtbar einen grünen Sicherheits-Tresor; erst nach dem gesetzten Sicherheitsstatus richtet sich rechts ein separater langfristiger Investment-Baustein auf.
 * ANIMATION_NARRATIVE
 * START: Links steht ein noch unvollständiger Sicherheits-Tresor, rechts ein flach zurückgenommener Investment-Baustein.
 * MECHANISM: Zwei Goldstapel wandern nacheinander zum Tresor. Erst wenn beide angekommen sind, schließt sich der sichtbare Sicherheitsring; danach und nicht vorher hebt sich der Investment-Baustein rechts an.
 * RESULT: Links bleibt SICHERHEIT ✓ vollständig stehen, rechts ist erst danach LANGFRISTIG INVESTIEREN aktiv. Die zeitliche Reihenfolge ist ohne Flowchart lesbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Ein massiver grüner Tresor links ist die erste Stufe; ein goldener langfristiger Baustein rechts wird sichtbar erst danach freigegeben.
 * SUPPORT: Zwei kleine Goldstapel zeigen den Aufbau der Sicherheitsstufe; kurze Nummern-Tags bestätigen nur die bereits sichtbare Reihenfolge.
 * MATERIAL: Emerald für Sicherheit, Gold für Spar- und Investmentkapital, Ivory für neutrale Beschriftung.
 * DEPTH: Tresor X=145–485 und Investment X=650–910 bleiben mit großem Rand vollständig innerhalb der horizontalen Safe-Zone.
 */
export const RESULT_HOLD_FRAMES = 26;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const firstDeposit = interpolate(frame,[4,32],[0,1],clamp);
  const secondDeposit = interpolate(frame,[26,56],[0,1],clamp);
  const lockIn = spring({frame:Math.max(0,frame-52),fps,config:{damping:17,stiffness:115},durationInFrames:20});
  const investRise = interpolate(frame,[70,96],[0,1],clamp);
  const resultIn = interpolate(frame,[94,Math.max(102,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);

  const coin1X = 510 - firstDeposit*235;
  const coin1Y = 830 - firstDeposit*110;
  const coin2X = 555 - secondDeposit*255;
  const coin2Y = 900 - secondDeposit*165;

  return (
    <PremiumPhysicalStage>
      <PhysicalObject
        x={145}
        y={500}
        width={340}
        height={430}
        material="positive"
        scale={0.97+lockIn*0.03}
        rotateY={-5}
        radius={46}
      >
        <div style={{position:'absolute',left:0,right:0,top:54,textAlign:'center',fontSize:31,fontWeight:950,color:'#FFFFFF'}}>
          SICHERHEIT
        </div>
        <div style={{
          position:'absolute',left:103,top:145,width:134,height:134,borderRadius:'50%',
          border:'12px solid rgba(255,255,255,0.72)',
          boxShadow:`0 0 ${16+lockIn*28}px rgba(108,255,181,${0.18+lockIn*0.28})`,
          transform:`scale(${0.88+lockIn*0.12}) rotate(${lockIn*18}deg)`,
        }}>
          <div style={{position:'absolute',left:49,top:18,width:12,height:86,borderRadius:10,background:'#FFFFFF'}} />
          <div style={{position:'absolute',left:18,top:49,width:86,height:12,borderRadius:10,background:'#FFFFFF'}} />
        </div>
        <div style={{position:'absolute',left:0,right:0,bottom:46,textAlign:'center',fontSize:25,fontWeight:900,color:'#D8FFE9',opacity:lockIn}}>
          NOTFALLPUFFER ✓
        </div>
      </PhysicalObject>

      <PhysicalCoinStack x={coin1X} y={coin1Y} count={4} scale={0.50} opacity={1-firstDeposit*0.35} />
      <PhysicalCoinStack x={coin2X} y={coin2Y} count={4} scale={0.50} opacity={1-secondDeposit*0.35} />

      <PhysicalObject
        x={650}
        y={590}
        width={260}
        height={300}
        material="money"
        scale={0.62+investRise*0.38}
        opacity={0.14+investRise*0.86}
        rotateY={5-investRise*5}
        rotateZ={-4+investRise*4}
        radius={42}
      >
        <div style={{position:'absolute',left:0,right:0,top:58,textAlign:'center',fontSize:27,fontWeight:950,color:'#251B07'}}>
          LANGFRISTIG
        </div>
        <div style={{position:'absolute',left:0,right:0,top:108,textAlign:'center',fontSize:36,fontWeight:950,color:'#251B07'}}>
          INVESTIEREN
        </div>
        <div style={{position:'absolute',left:62,right:62,bottom:55,height:72,display:'flex',alignItems:'end',gap:13}}>
          {[0.35,0.58,0.82,1].map((height,index)=>(
            <div key={index} style={{flex:1,height:`${height*100*investRise}%`,minHeight:4,borderRadius:8,background:'#6E4D0E'}} />
          ))}
        </div>
      </PhysicalObject>

      <div style={{position:'absolute',left:180,top:980,opacity:lockIn,color:ANIMATION_COLORS.positive}}>
        <PhysicalTag material="positive" style={{fontSize:23}}>1  SICHERHEIT ✓</PhysicalTag>
      </div>
      <div style={{position:'absolute',left:665,top:980,opacity:investRise,color:ANIMATION_COLORS.money}}>
        <PhysicalTag material="money" style={{fontSize:23}}>2  INVESTIEREN</PhysicalTag>
      </div>
      <div style={{
        position:'absolute',left:300,top:1075,opacity:resultIn,
        transform:`translateY(${(1-resultIn)*12}px)`,color:ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize:23}}>ERST SICHERHEIT, DANN LANGFRISTIG</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
