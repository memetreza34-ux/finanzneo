import React from 'react';
import {ANIMATION_COLORS, C, REEL_STYLE, a} from '../brand/tokens';

type PhysicalMaterialRole = 'neutral' | 'money' | 'warning' | 'positive';

type PhysicalObjectProps = {
  children?: React.ReactNode;
  role?: PhysicalMaterialRole;
  x?: number;
  y?: number;
  width: number;
  height: number;
  depth?: number;
  radius?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
  grounding?: number;
  style?: React.CSSProperties;
};

const material: Record<PhysicalMaterialRole, {front: string; edge: string; highlight: string; ambient: string}> = {
  neutral: {
    front: `linear-gradient(145deg, ${C.white}, ${C.whiteSoft} 52%, #cbd6d0)`,
    edge: '#788c82',
    highlight: ANIMATION_COLORS.neutralText,
    ambient: 'rgba(235,247,240,0.18)',
  },
  money: {
    front: `linear-gradient(145deg, ${C.goldLt}, ${C.gold} 54%, #b77908)`,
    edge: '#744600',
    highlight: C.goldLt,
    ambient: 'rgba(255,200,61,0.18)',
  },
  warning: {
    front: `linear-gradient(145deg, #ffb08d, ${C.negativeLt} 48%, ${C.negativeDk})`,
    edge: '#620515',
    highlight: '#ffd1bf',
    ambient: 'rgba(255,107,107,0.17)',
  },
  positive: {
    front: `linear-gradient(145deg, ${C.accentSoft}, ${C.accent} 50%, ${C.accentDk})`,
    edge: '#004522',
    highlight: C.accentLt,
    ambient: 'rgba(0,210,106,0.18)',
  },
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Transparent production stage. The central reel canvas remains responsible
 * for the black background; this component only constrains the visual zone.
 */
export const PremiumPhysicalStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      top: REEL_STYLE.visual.top,
      left: 0,
      right: 0,
      bottom: 1920 - REEL_STYLE.visual.bottom,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {children}
  </div>
);

/**
 * Base stylized-3D object. It intentionally contains no animation of its own;
 * every transform is supplied from the Remotion timeline by the parent scene.
 */
export const PhysicalObject: React.FC<PhysicalObjectProps> = ({
  children,
  role = 'neutral',
  x = 0,
  y = 0,
  width,
  height,
  depth = 16,
  radius = 28,
  opacity = 1,
  scale = 1,
  rotate = 0,
  grounding = 1,
  style,
}) => {
  const colors = material[role];
  const ground = clamp01(grounding);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `translate3d(0, 0, 0) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: 'center center',
        filter: `drop-shadow(0 ${Math.max(7, depth * 0.72)}px ${Math.max(16, depth * 1.65)}px rgba(0,0,0,0.48))`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '10%',
          right: '8%',
          height: Math.max(18, depth * 1.25),
          bottom: -Math.max(18, depth * 1.15),
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, rgba(0,0,0,${0.56 * ground}) 0%, rgba(0,0,0,${0.28 * ground}) 48%, rgba(0,0,0,0) 76%)`,
          filter: `blur(${Math.max(5, depth * 0.34)}px)`,
          transform: 'scaleX(1.04)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: depth * 0.5,
          top: depth * 0.72,
          width,
          height,
          borderRadius: radius,
          background: `linear-gradient(160deg, ${colors.edge}, #111 145%)`,
          boxShadow: `0 7px 18px rgba(0,0,0,0.34)`,
          opacity: 0.98,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background: colors.front,
          border: `2px solid ${a(colors.highlight, 0.4)}`,
          boxShadow: [
            `inset 0 2px 0 ${a(colors.highlight, 0.6)}`,
            'inset 0 -12px 26px rgba(0,0,0,0.17)',
            `0 0 24px ${colors.ambient}`,
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '7%',
            top: '6%',
            width: '58%',
            height: '12%',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.38)',
            filter: 'blur(1.5px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '5%',
            right: '5%',
            bottom: '5%',
            height: Math.max(4, Math.min(9, depth * 0.34)),
            borderRadius: 999,
            background: 'rgba(0,0,0,0.12)',
          }}
        />
        {children}
      </div>
    </div>
  );
};

export const PhysicalBill: React.FC<{
  x: number;
  y: number;
  progress?: number;
  value?: string;
  role?: PhysicalMaterialRole;
  rotate?: number;
  scale?: number;
}> = ({x, y, progress = 1, value = '100 €', role = 'money', rotate = 0, scale = 1}) => {
  const p = clamp01(progress);
  return (
    <PhysicalObject
      x={x}
      y={y + (1 - p) * 42}
      width={330}
      height={174}
      depth={18}
      radius={30}
      role={role}
      opacity={p}
      scale={(0.9 + p * 0.1) * scale}
      rotate={rotate}
      grounding={p}
    >
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 102,
            height: 102,
            borderRadius: '50%',
            border: '5px solid rgba(40,24,0,0.35)',
            boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 46,
            fontWeight: 950,
            color: '#3b2500',
          }}
        >
          €
        </div>
        <div style={{marginLeft: 34, fontSize: 46, fontWeight: 950, color: '#3b2500'}}>{value}</div>
      </div>
    </PhysicalObject>
  );
};

export const PhysicalCoinStack: React.FC<{
  x: number;
  y: number;
  progress?: number;
  coins?: number;
  role?: PhysicalMaterialRole;
}> = ({x, y, progress = 1, coins = 8, role = 'money'}) => {
  const total = Math.max(1, coins);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 270, height: 460}}>
      <div
        style={{
          position: 'absolute',
          left: 28,
          width: 214,
          height: 38,
          bottom: -6,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.58), rgba(0,0,0,0) 72%)',
          filter: 'blur(7px)',
          opacity: clamp01(progress),
        }}
      />
      {Array.from({length: total}).map((_, index) => {
        const reveal = clamp01((progress - index * 0.075) / 0.2);
        const bottom = index * 38;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 10,
              bottom: bottom + (1 - reveal) * 58,
              width: 250,
              height: 72,
              opacity: reveal,
              transform: `scale(${0.9 + reveal * 0.1})`,
              transformOrigin: 'center bottom',
            }}
          >
            <PhysicalObject x={0} y={0} width={250} height={62} depth={12} radius={999} role={role} grounding={index === 0 ? reveal : 0}>
              <div
                style={{
                  position: 'absolute',
                  left: 88,
                  top: 10,
                  width: 72,
                  height: 40,
                  borderRadius: 999,
                  border: '3px solid rgba(60,37,0,0.32)',
                  color: '#4a2d00',
                  fontSize: 29,
                  fontWeight: 950,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                €
              </div>
            </PhysicalObject>
          </div>
        );
      })}
    </div>
  );
};

export const PhysicalAccount: React.FC<{
  x: number;
  y: number;
  balance: string;
  role?: PhysicalMaterialRole;
  progress?: number;
  label?: string;
}> = ({x, y, balance, role = 'neutral', progress = 1, label = 'DEPOT'}) => {
  const p = clamp01(progress);
  return (
    <PhysicalObject
      x={x}
      y={y + (1 - p) * 32}
      width={430}
      height={265}
      depth={22}
      radius={42}
      role={role}
      opacity={p}
      scale={0.94 + p * 0.06}
      grounding={p}
    >
      <div style={{position: 'absolute', left: 38, right: 38, top: 48}}>
        <div style={{fontSize: 24, fontWeight: 900, letterSpacing: 3, color: 'rgba(0,0,0,0.55)'}}>{label}</div>
        <div style={{marginTop: 34, fontSize: 60, lineHeight: 1, fontWeight: 950, color: '#07110b'}}>{balance}</div>
        <div style={{marginTop: 28, height: 12, borderRadius: 999, background: 'rgba(0,0,0,0.16)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'}}>
          <div style={{width: `${35 + p * 58}%`, height: '100%', borderRadius: 999, background: 'rgba(0,0,0,0.42)'}} />
        </div>
      </div>
    </PhysicalObject>
  );
};

export const PhysicalReserveTank: React.FC<{
  x: number;
  y: number;
  fill: number;
  label: string;
  role?: PhysicalMaterialRole;
}> = ({x, y, fill, label, role = 'positive'}) => {
  const f = clamp01(fill);
  const liquid = role === 'warning' ? C.negativeLt : role === 'money' ? C.gold : C.accent;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 260, height: 480}}>
      <PhysicalObject x={0} y={0} width={260} height={410} depth={18} radius={44} role="neutral">
        <div style={{position: 'absolute', left: 24, right: 24, top: 24, bottom: 24, borderRadius: 28, background: '#111a15', border: '3px solid rgba(255,255,255,0.22)', overflow: 'hidden', boxShadow: 'inset 0 12px 28px rgba(0,0,0,0.7)'}}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${f * 100}%`,
              background: `linear-gradient(180deg, ${a(liquid, 0.82)}, ${liquid})`,
              boxShadow: 'inset 0 10px 18px rgba(255,255,255,0.16)',
            }}
          />
        </div>
      </PhysicalObject>
      <div style={{position: 'absolute', top: 432, width: '100%', textAlign: 'center', color: C.white, fontSize: 26, fontWeight: 900}}>{label}</div>
    </div>
  );
};

export const PhysicalCalendarPage: React.FC<{
  x: number;
  y: number;
  month: string;
  year: string;
  progress?: number;
}> = ({x, y, month, year, progress = 1}) => {
  const p = clamp01(progress);
  return (
    <PhysicalObject x={x} y={y + (1 - p) * 42} width={300} height={330} depth={20} radius={34} role="neutral" opacity={p} scale={0.92 + 0.08 * p} grounding={p}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 82, background: C.negative, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 950, letterSpacing: 2}}>{month}</div>
      <div style={{position: 'absolute', inset: '105px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#111'}}>
        <div style={{fontSize: 72, fontWeight: 950}}>12</div>
        <div style={{fontSize: 29, fontWeight: 900, marginTop: 12}}>{year}</div>
      </div>
    </PhysicalObject>
  );
};

/** A concrete machine-like mechanism for fees/costs; it is not an app UI. */
export const PhysicalWasher: React.FC<{
  x: number;
  y: number;
  progress?: number;
  role?: 'warning' | 'neutral';
}> = ({x, y, progress = 1, role = 'warning'}) => {
  const p = clamp01(progress);
  return (
    <PhysicalObject x={x} y={y} width={330} height={400} depth={24} radius={50} role={role} opacity={p} scale={0.94 + p * 0.06} grounding={p}>
      <div style={{position: 'absolute', left: 58, top: 78, width: 214, height: 214, borderRadius: '50%', background: '#111814', border: '16px solid rgba(255,255,255,0.38)', boxShadow: 'inset 0 12px 30px rgba(0,0,0,0.65), 0 3px 0 rgba(255,255,255,0.12)'}}>
        <div style={{position: 'absolute', inset: 42, borderRadius: '50%', border: '7px dashed rgba(255,255,255,0.36)'}} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 46, textAlign: 'center', color: role === 'warning' ? C.white : '#111', fontSize: 26, fontWeight: 950, letterSpacing: 2}}>KOSTEN</div>
    </PhysicalObject>
  );
};
