import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, life } from './tokens';
import { Background, Vignette } from './components/Background';
import { Kicker, Title, WordReveal } from './components/Text';
import { CompareSplit as _CompareSplit, Checklist, Quote } from './components/Layouts';
import { NumberedSteps } from './components/Steps';
import { LogoIntro } from './components/Branding';
import { RollingNumber } from './components/Effects';
import { SceneHeader } from './components/SceneHeader';
import { prog, E } from './tokens';
import { MEANING } from './tokens';
import type { IconName } from './components/Icon';

// ════════════════════════════════════════════════════════════════════════════
//  SZENEN-VORLAGEN — fertige Layouts. Timing in absoluten Frames (inF/outF).
//  V2: JEDE Szene trägt oben eine einheitliche Zwischenüberschrift + Icon.
// ════════════════════════════════════════════════════════════════════════════

// ─── HOOK — Zwischenüberschrift + starke Aussage ─────────────────────────────
export const HookScene: React.FC<{
  inF: number; outF: number; kicker?: string; statement: string; highlight?: string[]; color?: string; icon?: IconName;
}> = ({ inF, outF, kicker = 'WICHTIG', statement, highlight = [], color = C.accent, icon = 'bulb' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title={kicker} icon={icon} at={inF + 2} />
      <div style={{ textAlign: 'center', paddingInline: 60, zIndex: 2, marginTop: 90 }}>
        <WordReveal text={statement} start={inF + 14} perWord={5} size={92}
          highlight={highlight} highlightColor={color} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── STAT — eine große Zahl (Odometer) + Label ────────────────────────────────
export const StatScene: React.FC<{
  inF: number; outF: number; value: number; label: string; color?: string; suffix?: string; icon?: IconName;
}> = ({ inF, outF, value, label, color = C.accent, suffix = ' €', icon = 'euro' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title={label} icon={icon} at={inF + 2} />
      <div style={{ textAlign: 'center', zIndex: 2, marginTop: 80 }}>
        <RollingNumber to={value} start={inF + 8} end={inF + 50} size={200} color={color} suffix={suffix} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── VERGLEICH — A vs B ───────────────────────────────────────────────────────
export const CompareScene: React.FC<{
  inF: number; outF: number; title?: string; icon?: IconName;
  left: { title: string; value: string; sub?: string; icon?: any; color?: string };
  right: { title: string; value: string; sub?: string; icon?: any; color?: string };
}> = ({ inF, outF, title = 'VERGLEICH', icon = 'trending', left, right }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <SceneHeader title={title} icon={icon} at={inF + 2} />
      <div style={{ position: 'absolute', top: 390, left: 60, right: 60, zIndex: 2 }}>
        <_CompareSplit height={720}
          left={{ ...left, color: left.color ?? MEANING.problem, appear: inF + 14 }}
          right={{ ...right, color: right.color ?? MEANING.positive, appear: inF + 22 }} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── ERKLÄR — Zwischenüberschrift + freier Inhalt ─────────────────────────────
export const ExplainScene: React.FC<{
  inF: number; outF: number; title: string; children?: React.ReactNode; icon?: IconName;
}> = ({ inF, outF, title, children, icon = 'bulb' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <SceneHeader title={title} icon={icon} at={inF + 2} />
      <div style={{ zIndex: 2 }}>{children}</div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── CTA — klarer nächster Schritt ────────────────────────────────────────────
export const CTAScene: React.FC<{
  inF: number; outF: number; line1: string; line2: string; icon?: IconName;
}> = ({ inF, outF, line1, line2, icon = 'check' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 10), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title="DEIN NÄCHSTER SCHRITT" icon={icon} at={inF + 2} />
      <div style={{ textAlign: 'center', zIndex: 2, marginTop: 80 }}>
        <Title at={inF + 4} size={110} color={C.white}>{line1}</Title>
        <div style={{ marginTop: 10 }}><Title at={inF + 14} size={110} color={C.accent}>{line2}</Title></div>
        <div style={{ marginTop: 40, fontSize: 90, opacity: life(f, inF + 24, outF, 8) }}>👇</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── INTRO — Logo + Video-Titel zum Eröffnen ──────────────────────────────────
export const IntroScene: React.FC<{
  inF: number; outF: number; title: string; kicker?: string; icon?: IconName;
}> = ({ inF, outF, title, kicker = 'FinanzNeo', icon = 'wallet' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title={kicker} icon={icon} at={inF + 2} />
      <div style={{ position: 'absolute', top: '27%' }}><LogoIntro at={inF + 4} /></div>
      <div style={{ position: 'absolute', top: '58%', width: '100%', textAlign: 'center', paddingInline: 60 }}>
        <div style={{ opacity: prog(f, inF + 30, inF + 44) }}>
          <Kicker at={inF + 30}>{kicker}</Kicker>
        </div>
        <div style={{ marginTop: 24 }}>
          <Title at={inF + 38} size={88}>{title}</Title>
        </div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── STEPS — nummerierte Schritte ─────────────────────────────────────────────
export const StepsScene: React.FC<{
  inF: number; outF: number; title: string;
  steps: { label: string; icon?: IconName }[]; color?: string; icon?: IconName;
}> = ({ inF, outF, title, steps, color = C.accent, icon = 'list' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <SceneHeader title={title} icon={icon} at={inF + 2} />
      <div style={{ position: 'absolute', top: 370, left: 130, right: 130, zIndex: 2 }}>
        <NumberedSteps color={color} steps={steps.map((s, i) => ({ label: s.label, icon: s.icon, appear: inF + 18 + i * 16 }))} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── LIST — Checkliste / Aufzählung ───────────────────────────────────────────
export const ListScene: React.FC<{
  inF: number; outF: number; title: string; items: string[]; solveAll?: boolean; icon?: IconName;
}> = ({ inF, outF, title, items, solveAll = false, icon = 'check' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <SceneHeader title={title} icon={icon} at={inF + 2} />
      <div style={{ position: 'absolute', top: 370, left: 120, right: 120, zIndex: 2 }}>
        <Checklist items={items.map((t, i) => ({ text: t, appear: inF + 18 + i * 16, solve: solveAll ? inF + 40 + i * 12 : undefined }))} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── QUOTE — starke Aussage / Merksatz ────────────────────────────────────────
export const QuoteScene: React.FC<{
  inF: number; outF: number; text: string; author?: string; color?: string; icon?: IconName;
}> = ({ inF, outF, text, author, color = C.accent, icon = 'bulb' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title="MERKSATZ" icon={icon} at={inF + 2} />
      <div style={{ zIndex: 2, marginTop: 70 }}>
        <Quote text={text} author={author} at={inF + 8} color={color} size={70} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── SECTION DIVIDER — Kapitel-Trenner ────────────────────────────────────────
export const SectionDivider: React.FC<{
  inF: number; outF: number; part: string; title: string; color?: string; icon?: IconName;
}> = ({ inF, outF, part, title, color = C.accent, icon = 'arrowRight' }) => {
  const f = useCurrentFrame();
  const lineW = prog(f, inF + 14, inF + 34, E.out);
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 10), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <SceneHeader title={title} icon={icon} at={inF + 2} />
      <div style={{ textAlign: 'center', zIndex: 2, marginTop: 70 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 200, color, lineHeight: 0.9,
          opacity: prog(f, inF + 2, inF + 16, E.spring),
          transform: `scale(${0.7 + prog(f, inF + 2, inF + 16, E.spring) * 0.3})`,
          textShadow: `0 0 70px ${color}66` }}>{part}</div>
        <div style={{ width: lineW * 360, height: 5, background: color, margin: '24px auto', borderRadius: 3,
          boxShadow: `0 0 16px ${color}` }} />
        <Title at={inF + 22} size={76}>{title}</Title>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
