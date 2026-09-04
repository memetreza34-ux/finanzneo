import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: instant-payment-one-way-tube
 * VISUAL_TECHNIQUE_ID: pneumatic-instant-transfer-tube
 * PRIMARY_ACTION: Ein goldener Euro-Token wird in einer transparenten Pneumatikröhre in Sekunden von Bank A zu Bank B geschossen; hinter ihm schließen mehrere Rücklaufsperren.
 * ANIMATION_NARRATIVE
 * START: Ein goldener Euro-Token liegt links in einer transparenten Transferkammer zwischen zwei stilisierten Bankkörpern.
 * MECHANISM: Der Token beschleunigt sichtbar durch die Röhre, passiert nacheinander mehrere Einwegklappen und erreicht in kurzer Zeit die Empfängerseite.
 * RESULT: Der Token liegt rechts beim Empfänger, während die Rücklaufsperren hinter ihm geschlossen bleiben und ein Rückweg blockiert ist.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die große transparente Transfer-Röhre mit dem schnell beschleunigenden Goldtoken dominiert die Szene.
 * SUPPORT: Zwei stilisierte Bankkörper und Einwegklappen erklären Sender, Empfänger und fehlenden einfachen Rückweg.
 * MATERIAL: Transparentes Glas, dunkles Metall, Goldtoken, Emerald am Ziel und warmes Rot an den geschlossenen Rücklaufsperren.
 * DEPTH: Die Röhre läuft stark perspektivisch von vorne links in die Tiefe rechts und erzeugt echte Geschwindigkeit.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene11Animation: React.FC<{durationFrames?:number}> = ({durationFrames=150}) => {
  const frame = useCurrentFrame();
  const charge = interpolate(frame,[2,28],[0,1],clamp);
  const travel = interpolate(frame,[24,78],[0,1],clamp);
  const flap1 = interpolate(frame,[48,76],[0,1],clamp);
  const flap2 = interpolate(frame,[66,94],[0,1],clamp);
  const lock = interpolate(frame,[88,Math.max(116,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:65,top:540,width:950,height:600,perspective:1500}}>
      <div style={{position:'absolute',left:30,top:230,width:170,height:170,borderRadius:40,background:'#222825',border:'3px solid rgba(255,255,255,.2)',boxShadow:'0 26px 55px rgba(0,0,0,.5)'}}><div style={{paddingTop:58,textAlign:'center',fontSize:30,fontWeight:950}}>BANK A</div></div>
      <div style={{position:'absolute',right:20,top:150,width:190,height:190,borderRadius:44,background:'#222825',border:'3px solid rgba(255,255,255,.2)',boxShadow:'0 26px 55px rgba(0,0,0,.5)'}}><div style={{paddingTop:66,textAlign:'center',fontSize:30,fontWeight:950}}>BANK B</div></div>
      <div style={{position:'absolute',left:170,top:215,width:650,height:120,border:'4px solid rgba(220,220,220,.35)',borderRadius:60,transform:'rotate(-8deg)',boxShadow:'inset 0 0 28px rgba(255,255,255,.08)'}} />
      <div style={{position:'absolute',left:180+travel*570,top:244-travel*78,width:92,height:92,borderRadius:'50%',background:ANIMATION_COLORS.money,boxShadow:'0 18px 38px rgba(0,0,0,.45)',transform:'scale('+(0.8+charge*0.2)+') rotate('+(travel*260)+'deg)'}}><div style={{fontSize:42,fontWeight:950,textAlign:'center',paddingTop:20}}>€</div></div>
      <div style={{position:'absolute',left:430,top:190,width:18,height:170,borderRadius:9,background:ANIMATION_COLORS.warning,transformOrigin:'50% 0',transform:'rotate('+(flap1*68)+'deg)',opacity:flap1}} />
      <div style={{position:'absolute',left:620,top:165,width:18,height:170,borderRadius:9,background:ANIMATION_COLORS.warning,transformOrigin:'50% 0',transform:'rotate('+(flap2*68)+'deg)',opacity:flap2}} />
      <div style={{position:'absolute',left:510,top:420,fontSize:30,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:lock}}>RÜCKWEG NICHT EINFACH</div>
    </div>
  </AnimationStage>;
};
