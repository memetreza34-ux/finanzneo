// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · BRAND TOKENS
//  Eine zentrale Quelle für Farben, Easing, Helpers — überall importiert.
// ════════════════════════════════════════════════════════════════════════════
import { Easing, interpolate } from 'remotion';

export const C = {
  bg:'#0A1A0F', bgDeep:'#06120A', bgNeutral:'#0B0F14', bgLight:'#F4F7F5',
  surface:'#11261A', surfaceStrong:'#112A1B', surfacePositive:'#0E3B27',
  white:'#FFFFFF', whiteSoft:'#F4FAF6', gray:'#9DB0A6', graySoft:'#8FA89A', grayDk:'#5A6B61', ink:'#0A1410', line:'rgba(255,255,255,0.10)',
  accent:'#00D26A', accentLt:'#5CFFAD', accentSoft:'#7BFFC0', accentDk:'#00803F',
  negative:'#FF3333', negativeLt:'#FF6B6B', negativeDk:'#B01030',
  gold:'#FFC83D', goldLt:'#FFE49A', blue:'#3D8BFF', blueLt:'#8FBEFF', purple:'#B98CFF', purpleLt:'#D9C4FF',
} as const;

export const MEANING = {positive:C.accent,problem:C.negative,money:C.gold,trust:C.blue,premium:C.purple,neutral:C.white} as const;

export const ANIMATION_COLORS = {
  neutralText:C.white, secondaryText:C.whiteSoft, focus:C.accent, positive:C.accent,
  warning:C.negative, loss:C.negative, money:C.gold, blackOnDarkForbidden:true,
} as const;

export const PREMIUM = {
  ink:C.whiteSoft, muted:C.graySoft, line:C.line, positive:C.accent,
  positiveLight:C.accentSoft, positiveDeep:C.surfacePositive, money:C.gold, loss:C.negativeLt,
} as const;

export const FORMAT = {
  landscape:{width:1920,height:1080}, vertical:{width:1080,height:1920}, fps:30,
} as const;

export const SAFE_AREA = {
  topRatio:0.18, bottomRatio:0.22,
  topPx:Math.round(FORMAT.vertical.height*0.18), bottomPx:Math.round(FORMAT.vertical.height*0.22),
} as const;

// ─── Verbindlicher Reel-Look V5 ─────────────────────────────────────────────
// Klare Hierarchie für Mobile: große weiße Zwischenüberschrift, großzügiger
// Visualbereich und eine feste untere Sicherheitszone für Captions. Animationen
// werden technisch auf dieselbe Visualzone begrenzt wie Bilder.
export const REEL_STYLE = {
  caption:{
    fontSize:50,minFontSize:40,fontWeight:800,letterSpacing:0,lineHeight:1.14,
    bottom:340,left:72,right:140,maxWidth:780,maxLines:2,maxWords:9,maxChars:52,
    maxRenderedHeight:150,holdSeconds:0.38,textShadow:'0 2px 7px rgba(0,0,0,0.55)',textStrokeForbidden:true,
  },
  header:{
    presentation:'plain',align:'center',headlineColor:C.white,defaultIconColor:C.accentLt,
    top:154,left:72,right:72,fontSize:56,minFontSize:50,fontWeight:800,iconBox:40,iconSize:34,gap:14,
    maxWidth:880,maxLines:2,enterFrames:4,textShadow:'0 2px 6px rgba(0,0,0,0.48)',
  },
  sourceNote:{
    bottom:514,fontSize:21,maxWidth:760,
  },
  transition:{continuityFrames:3,imageEnterFrames:4,fadeToBlackForbidden:true},
  visual:{
    top:320,bottom:1400,
    /** Native Vollbild-Animationen werden innerhalb der festen Visualzone skaliert. */
    animationTranslateY:-70,
    animationScale:1.10,
  },
} as const;

export const E = {
  out:Easing.bezier(0.16,1,0.3,1), inOut:Easing.bezier(0.65,0,0.35,1),
  in:Easing.bezier(0.5,0,0.75,0), spring:Easing.bezier(0.34,1.56,0.64,1),
} as const;

export const CLAMP = {extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
export const sec = (s:number,fps=FORMAT.fps)=>Math.round(s*fps);
export const prog = (f:number,a:number,b:number,e=E.out)=>interpolate(f,[a,b],[0,1],{...CLAMP,easing:e});
export const lerpF = (f:number,va:number,vb:number,a:number,b:number,e=E.out)=>interpolate(f,[a,b],[va,vb],{...CLAMP,easing:e});
export const life = (f:number,inF:number,outF:number,ramp=9)=>interpolate(f,[inF,inF+ramp,outF-ramp,outF],[0,1,1,0],CLAMP);
export const euro = (n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
export const num = (n:number)=>Math.round(n).toLocaleString('de-DE');
export const a = (hex:string,alpha:number)=>hex+Math.round(Math.min(1,Math.max(0,alpha))*255).toString(16).padStart(2,'0');
