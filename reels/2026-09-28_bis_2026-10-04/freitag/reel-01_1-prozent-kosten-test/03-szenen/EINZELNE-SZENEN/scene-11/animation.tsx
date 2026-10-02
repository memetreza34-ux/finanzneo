import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: kostenpositionen-auf-dokumenten-pruefen
 * FOCAL_PATH: Fondsblatt -> Depotblatt -> Beratungsblatt -> markierte Kostenzeilen -> grüner Prüfstatus
 * PRIMARY_ACTION: Eine große Lupenlinse fährt nacheinander über drei reale Dokumente und hebt TER, Depotkosten und Servicekosten hervor.
 * CAMERA_ROLE: follow — die Aufmerksamkeit folgt der Lupe von links nach rechts über die drei Dokumente.
 * PAYOFF: Alle relevanten Kostenzeilen sind sichtbar markiert und ein klarer grüner Haken bestätigt den Prüfschritt.
 *
 * ANIMATION_NARRATIVE
 * START: Drei hochwertige Dokumente für Fonds, Depot und Beratung liegen noch unmarkiert nebeneinander.
 * MECHANISM: Eine physische Lupe wandert über jedes Dokument; die jeweilige laufende Kostenzeile leuchtet kurz warm rot-orange auf.
 * RESULT: TER, Depotkosten und Servicekosten sind sichtbar identifiziert; anschließend erscheint ein grüner Prüfhaken.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Große stilisierte Lupe über echten Papierdokumenten statt Dashboard-Karten.
 * SUPPORT: Drei Kostenzeilen und ein finaler Haken, sonst keine zusätzlichen UI-Elemente.
 * MATERIAL: Ivory-Papier, Emerald-Prüfstatus, Warm Red-Orange für Kosten, Glaslinse mit subtiler Reflexion.
 * DEPTH: Dokumente liegen leicht gestaffelt in 3/4-Perspektive; die Lupe schwebt darüber und erzeugt klare Vordergrundtiefe.
 */
export const RESULT_HOLD_FRAMES = 18;
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene11Animation: React.FC<{durationFrames?: number}> = ({durationFrames=174}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:17, stiffness:105}});
  const positions = [180,430,680];
  const scan = interpolate(frame,[24,132],[0,2],clamp);
  const lensX = scan < 1 ? interpolate(scan,[0,1],[positions[0],positions[1]],clamp) : interpolate(scan,[1,2],[positions[1],positions[2]],clamp);
  const labels = ['TER','Depotkosten','Service'];

  return <div style={{width:'100%',height:'100%',position:'relative',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'absolute',left:55,top:130,width:970,height:650,transform:'perspective(1200px) rotateX(3deg) scale('+(0.94+enter*0.06)+')'}}>
      {positions.map((x,i)=>{
        const active = interpolate(frame,[30+i*38,40+i*38,58+i*38],[0,1,1],clamp);
        return <div data-finanzneo-object="cost-document" key={x} style={{position:'absolute',left:x-120,top:150+i*18,width:250,height:360,borderRadius:24,background:'linear-gradient(145deg,#FFF9EE,#DDD5C9)',boxShadow:'0 24px 42px rgba(0,0,0,.38)',transform:'rotate('+(i-1)*2+'deg)'}}>
          <div style={{position:'absolute',left:22,top:24,fontSize:27,fontWeight:900,color:'#19221D'}}>{['Fonds','Depot','Beratung'][i]}</div>
          {[0,1,2,3].map((r)=><div key={r} style={{position:'absolute',left:22,top:82+r*48,width:206,height:14,borderRadius:7,background:r===2?'rgba(255,51,51,'+(0.18+active*0.52)+')':'rgba(30,45,36,.13)'}} />)}
          <div style={{position:'absolute',left:24,top:172,fontSize:20,fontWeight:900,color:active>0.45?ANIMATION_COLORS.warning:'#5A6B61'}}>{labels[i]}</div>
        </div>;
      })}

      <div data-finanzneo-object="magnifying-glass" style={{position:'absolute',left:lensX-82,top:252,width:164,height:164,borderRadius:'50%',border:'12px solid #F4FAF6',background:'rgba(255,255,255,.05)',boxShadow:'0 18px 30px rgba(0,0,0,.35), inset 0 0 24px rgba(255,255,255,.08)'}}>
        <div style={{position:'absolute',right:-64,bottom:-48,width:92,height:18,borderRadius:12,background:'#F4FAF6',transform:'rotate(44deg)',transformOrigin:'left center'}} />
      </div>

      <div style={{position:'absolute',left:422,top:560,width:130,height:130,borderRadius:'50%',background:ANIMATION_COLORS.focus,display:'flex',alignItems:'center',justifyContent:'center',fontSize:78,fontWeight:900,color:'#06210F',opacity:interpolate(frame,[138,154],[0,1],clamp),transform:'scale('+interpolate(frame,[138,152],[.7,1],clamp)+')'}}>✓</div>
    </div>
  </div>;
};
