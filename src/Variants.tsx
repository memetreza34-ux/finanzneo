import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, a } from './brand';

const W = 1080, H = 1920;

// ─── 1 · CLEAN / MINIMAL (Apple-Keynote-Stil) ─────────────────────────────────
export const V1Clean: React.FC = () => (
  <AbsoluteFill style={{ background: '#0A0E12', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: 40, color: C.gray, letterSpacing: 8, textTransform: 'uppercase' }}>nach 30 Jahren</div>
      <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 220, color: '#fff', lineHeight: 1.1, marginTop: 30 }}>120.000<span style={{ color: C.accent }}>€</span></div>
      <div style={{ width: 120, height: 4, background: C.accent, margin: '40px auto 0' }} />
    </div>
  </AbsoluteFill>
);

// ─── 2 · GLASSMORPHISM ────────────────────────────────────────────────────────
export const V2Glass: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 30% 25%, ${a(C.accent,0.35)} 0%, transparent 60%), radial-gradient(60% 50% at 75% 80%, ${a(C.blue,0.3)} 0%, transparent 55%), #0A1A0F`, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 760, padding: '80px 50px', borderRadius: 48, textAlign: 'center',
      background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.25)',
      boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35)', backdropFilter: 'blur(30px)' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 42, color: 'rgba(255,255,255,0.7)' }}>nach 30 Jahren</div>
      <div style={{ fontFamily: FONT.title, fontSize: 200, color: '#fff', lineHeight: 1, marginTop: 16 }}>120.000 €</div>
    </div>
  </AbsoluteFill>
);

// ─── 3 · BOLD EDITORIAL (Magazin) ─────────────────────────────────────────────
export const V3Editorial: React.FC = () => (
  <AbsoluteFill style={{ background: C.accent }}>
    <div style={{ position: 'absolute', top: 200, left: 70 }}>
      <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.bg, lineHeight: 0.9 }}>NACH</div>
      <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.bg, lineHeight: 0.9 }}>30 JAHREN</div>
    </div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.bg, padding: '80px 70px' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.accent, letterSpacing: 4 }}>DEIN VERMÖGEN</div>
      <div style={{ fontFamily: FONT.title, fontSize: 280, color: '#fff', lineHeight: 0.95 }}>120k€</div>
    </div>
  </AbsoluteFill>
);

// ─── 4 · NEON / CYBER ─────────────────────────────────────────────────────────
export const V4Neon: React.FC = () => (
  <AbsoluteFill style={{ background: '#05080D', alignItems: 'center', justifyContent: 'center' }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${a(C.accent,0.12)} 1px, transparent 1px), linear-gradient(90deg, ${a(C.accent,0.12)} 1px, transparent 1px)`, backgroundSize: '70px 70px' }} />
    <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: `radial-gradient(circle, ${a(C.accent,0.4)} 0%, transparent 70%)` }} />
    <div style={{ textAlign: 'center', zIndex: 2 }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.accentLt, letterSpacing: 6 }}>NACH 30 JAHREN</div>
      <div style={{ fontFamily: FONT.title, fontSize: 210, color: C.accent, lineHeight: 1, marginTop: 20, textShadow: `0 0 40px ${C.accent}, 0 0 90px ${a(C.accent,0.6)}` }}>120.000€</div>
    </div>
  </AbsoluteFill>
);

// ─── 5 · GRADIENT (warm, elegant) ─────────────────────────────────────────────
export const V5Gradient: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, #04140C 0%, #0B3D24 45%, #00D26A 140%)`, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.8)' }}>aus 100 € / Monat werden</div>
      <div style={{ fontFamily: FONT.title, fontSize: 240, color: '#fff', lineHeight: 1, marginTop: 20, textShadow: '0 10px 50px rgba(0,0,0,0.4)' }}>120.000 €</div>
      <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.bg, marginTop: 30, background: '#fff', display: 'inline-block', padding: '14px 36px', borderRadius: 999 }}>in 30 Jahren</div>
    </div>
  </AbsoluteFill>
);

// ─── 6 · DUOTONE / FLAT (modern, geometrisch) ─────────────────────────────────
export const V6Duotone: React.FC = () => (
  <AbsoluteFill style={{ background: '#0A1A0F' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '42%', background: C.accent,
      clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }} />
    <div style={{ position: 'absolute', top: '14%', width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 100, color: C.bg }}>+140% MEHR</div>
    <div style={{ position: 'absolute', bottom: '18%', width: '100%', textAlign: 'center' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.gray }}>statt 50.000 € auf dem Sparbuch</div>
      <div style={{ fontFamily: FONT.title, fontSize: 230, color: '#fff', lineHeight: 1 }}>120.000<span style={{ color: C.accent }}>€</span></div>
    </div>
  </AbsoluteFill>
);
