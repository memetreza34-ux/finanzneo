import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, a, E, prog, lerpF, num, FONT, PremiumIcon } from '@studio/core';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZ-VOKABULAR 6 — noch nicht abgedeckte Konzepte, auf Basis von
//  PremiumIcon (core/brand-kit). Nur Konzepte gebaut, die in vokabular*.tsx
//  noch fehlten (Notgroschen/Rente/Kredit-Zins existieren bereits — geprüft).
//  1) TaxReturnFlow (Steuererklärung) 2) RentVsOwnCompare (Miete vs. Eigentum)
// ════════════════════════════════════════════════════════════════════════════
const GREEN = C.green, GOLD = C.gold, RED = C.negative, GRAY = C.gray;

// ─── 1) TaxReturnFlow — Beleg → Rechner → Erstattung fließt zurück ──────────
export const TaxReturnFlow: React.FC<{ size?: number; at?: number; amount?: number }> = ({
  size = 320, at = 0, amount = 850,
}) => {
  const f = useCurrentFrame();
  const docP = prog(f, at, at + 14, E.spring);
  const calcP = prog(f, at + 14, at + 28, E.spring);
  const flowP = prog(f, at + 30, at + 54, E.out);
  const sumP = prog(f, at + 50, at + 64, E.spring);

  return (
    <div style={{ width: size, height: size * 0.72, position: 'relative' }}>
      {/* Beleg links */}
      <div style={{ position: 'absolute', left: 0, top: '50%', transform: `translateY(-50%) scale(${docP})`, opacity: docP }}>
        <PremiumIcon name="receipt-text" size="md" at={at} color={GRAY} glow={false} />
      </div>
      {/* Pfeil zum Rechner */}
      <svg width={size} height={size * 0.72} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={size * 0.16} y1={size * 0.36} x2={size * 0.36} y2={size * 0.36}
          stroke={a(GRAY, 0.4)} strokeWidth={3} strokeDasharray="8 6" opacity={calcP} />
      </svg>
      {/* Rechner Mitte */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${calcP})`, opacity: calcP }}>
        <PremiumIcon name="calculator" size="md" at={at + 14} color={GOLD} />
      </div>
      {/* Fließender Betrag zurück zur Person */}
      <svg width={size} height={size * 0.72} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={size * 0.62} y1={size * 0.36} x2={size * 0.82} y2={size * 0.36}
          stroke={GREEN} strokeWidth={4} opacity={flowP}
          style={{ filter: `drop-shadow(0 0 8px ${a(GREEN, 0.6)})` }} />
        <polygon points={`${size * 0.82},${size * 0.36 - 8} ${size * 0.82},${size * 0.36 + 8} ${size * 0.88},${size * 0.36}`}
          fill={GREEN} opacity={flowP} />
      </svg>
      {/* Person / Wallet rechts */}
      <div style={{ position: 'absolute', right: 0, top: '50%', transform: `translateY(-50%) scale(${lerpF(f, 0.9, 1, at + 44, at + 58, E.spring)})`, opacity: flowP }}>
        <PremiumIcon name="wallet" size="md" at={at + 44} color={GREEN} />
      </div>
      {/* Betrag */}
      <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
        opacity: sumP, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.title, fontSize: 44, color: GREEN,
          textShadow: `0 0 20px ${a(GREEN, 0.5)}` }}>+{num(amount)} €</div>
        <div style={{ fontFamily: FONT.body, fontSize: 18, color: GRAY, letterSpacing: 1 }}>ERSTATTUNG</div>
      </div>
    </div>
  );
};

// ─── 2) RentVsOwnCompare — Miete (Geld fließt raus) vs. Eigentum (Balken wächst) ─
export const RentVsOwnCompare: React.FC<{ size?: number; at?: number; years?: number }> = ({
  size = 420, at = 0, years = 20,
}) => {
  const f = useCurrentFrame();
  const headP = prog(f, at, at + 14, E.out);
  const colW = size * 0.42, gap = size * 0.14;
  const barMax = size * 0.5;
  const rentP = prog(f, at + 12, at + 60, E.out);
  const ownP = prog(f, at + 18, at + 66, E.out);

  return (
    <div style={{ width: size, height: size * 0.95, position: 'relative' }}>
      {/* Kopf */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: colW * 2 + gap,
        margin: '0 auto', opacity: headP }}>
        <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: RED,
          textTransform: 'uppercase', letterSpacing: 1 }}>Miete</span>
        <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: GREEN,
          textTransform: 'uppercase', letterSpacing: 1 }}>Eigentum</span>
      </div>

      <div style={{ position: 'absolute', top: 56, left: 0, width: size, height: barMax + 40,
        display: 'flex', justifyContent: 'center', gap, alignItems: 'flex-end' }}>
        {/* Miete-Spalte: Icons fließen kontinuierlich raus, kein Vermögensaufbau */}
        <div style={{ width: colW, height: barMax, position: 'relative', display: 'flex',
          flexDirection: 'column-reverse', alignItems: 'center' }}>
          <PremiumIcon name="building-2" size="sm" at={at + 6} color={RED} glow={false} />
          {/* Flug-Zone der Coins strikt über der Text-/Icon-Zone geclippt, keine Überlappung */}
          <div style={{ position: 'absolute', bottom: 140, left: 0, width: '100%', height: barMax - 140,
            overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const s = at + 20 + i * 10;
              const p = prog(f, s, s + 20, E.in);
              const y = -p * (barMax - 140);
              const op = p < 0.85 ? 1 : lerpF(f, 1, 0, s + 17, s + 20, E.out);
              return (
                <div key={i} style={{ position: 'absolute', bottom: 0, left: '50%',
                  transform: `translate(-50%, ${y}px)`, opacity: op * rentP }}>
                  <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 20, color: RED }}>−€</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontFamily: FONT.body, fontSize: 16, color: GRAY, opacity: rentP }}>
            {years} Jahre · 0 € Vermögen
          </div>
        </div>

        {/* Eigentum-Spalte: Balken wächst = Vermögen/Tilgung baut sich auf */}
        <div style={{ width: colW, height: barMax, position: 'relative', display: 'flex',
          flexDirection: 'column-reverse', alignItems: 'center' }}>
          <PremiumIcon name="key-round" size="sm" at={at + 12} color={GREEN} />
          <div style={{ width: colW * 0.5, height: barMax * 0.62 * ownP, borderRadius: '10px 10px 0 0',
            background: `linear-gradient(180deg, ${a(GREEN, 0.85)}, ${a(GREEN, 0.25)})`,
            boxShadow: `0 0 24px ${a(GREEN, 0.4)}`, marginBottom: 70 }} />
          <div style={{ marginTop: 12, fontFamily: FONT.body, fontSize: 16, color: GRAY, opacity: ownP }}>
            {years} Jahre · Vermögen wächst
          </div>
        </div>
      </div>
    </div>
  );
};
