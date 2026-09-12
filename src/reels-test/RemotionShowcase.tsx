import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {C} from '../brand/tokens';

const SCENE_FRAMES = 105;
const TRANSITION_FRAMES = 12;
const SCENE_COUNT = 8;
export const REMOTION_SHOWCASE_FRAMES =
  SCENE_COUNT * SCENE_FRAMES - (SCENE_COUNT - 1) * TRANSITION_FRAMES;

const BROLL_URL =
  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Speed_typing_with_dvorak.webm';
const EURO_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/6/63/Euro_banknotes%2C_Europa_series.png';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const reveal = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: ease});

const money = (value: number) =>
  `${Math.round(value).toLocaleString('de-DE')} €`;

const SvgIcon: React.FC<{
  kind: 'wallet' | 'clock' | 'chart' | 'shield';
  size?: number;
}> = ({kind, size = 66}) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'wallet' ? (
        <>
          <path {...common} d="M3 6.5h15a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2v-9Z" />
          <path {...common} d="M3.5 7 16 3.5a2 2 0 0 1 2.5 1.9V7" />
          <path {...common} d="M15 11h6v4h-6a2 2 0 0 1 0-4Z" />
        </>
      ) : null}
      {kind === 'clock' ? (
        <>
          <circle {...common} cx="12" cy="12" r="9" />
          <path {...common} d="M12 7v5l3.5 2" />
        </>
      ) : null}
      {kind === 'chart' ? (
        <>
          <path {...common} d="M4 19V5" />
          <path {...common} d="M4 19h16" />
          <path {...common} d="m7 15 4-4 3 2 5-6" />
          <path {...common} d="M16 7h3v3" />
        </>
      ) : null}
      {kind === 'shield' ? (
        <>
          <path {...common} d="M12 3 19 6v5c0 4.6-2.7 7.7-7 10-4.3-2.3-7-5.4-7-10V6l7-3Z" />
          <path {...common} d="m8.5 12 2.2 2.2 4.8-5" />
        </>
      ) : null}
    </svg>
  );
};

const GridBackground: React.FC<{glow?: string}> = ({glow = C.accent}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, SCENE_FRAMES], [0, 42], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#050706', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '74px 74px',
          translate: `${drift}px ${-drift * 0.35}px`,
          opacity: 0.62,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 780,
          height: 780,
          borderRadius: 999,
          left: 150,
          top: 460,
          background: `radial-gradient(circle, ${glow}33 0%, transparent 67%)`,
          scale: 1 + Math.sin(frame / 18) * 0.06,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneLabel: React.FC<{index: string; label: string}> = ({index, label}) => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: 30, config: {damping: 20, stiffness: 150}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 74,
        left: 66,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        opacity: p,
        translate: `${interpolate(p, [0, 1], [-20, 0], clamp)}px 0`,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderRadius: 999,
          backgroundColor: C.accent,
          color: '#021108',
          fontSize: 18,
          fontWeight: 950,
          letterSpacing: 1,
        }}
      >
        {index}
      </div>
      <div style={{fontSize: 19, fontWeight: 850, color: C.gray, letterSpacing: 2}}>
        {label}
      </div>
    </div>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 13, stiffness: 125, mass: 0.8}});
  const monthly = Math.round(interpolate(frame, [10, 66], [0, 100], clamp));
  const orbit = frame / 32;

  return (
    <AbsoluteFill style={{fontFamily: 'Arial, Helvetica, sans-serif', color: C.white}}>
      <GridBackground glow={C.gold} />
      <SceneLabel index="01" label="KINETIC HOOK" />
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 70,
          right: 70,
          fontSize: 66,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: -2.8,
        }}
      >
        Was können
        <br />
        <span style={{color: C.gold}}>100 € im Monat</span>
        <br />
        wirklich werden?
      </div>
      <div
        style={{
          position: 'absolute',
          top: 730,
          left: 130,
          width: 820,
          height: 820,
          display: 'grid',
          placeItems: 'center',
          scale: 0.78 + pop * 0.22,
          opacity: pop,
        }}
      >
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            style={{
              position: 'absolute',
              width: 520 + ring * 110,
              height: 520 + ring * 110,
              borderRadius: 999,
              border: `2px solid rgba(255,200,61,${0.34 - ring * 0.08})`,
              rotate: `${orbit * (ring % 2 ? -24 : 18)}deg`,
              scale: 1 + Math.sin(orbit + ring) * 0.025,
            }}
          />
        ))}
        <div
          style={{
            width: 410,
            height: 410,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: 'radial-gradient(circle at 35% 25%, #FFE49A, #FFC83D 46%, #A56B00 100%)',
            color: '#1C1200',
            boxShadow: '0 0 100px rgba(255,200,61,0.35)',
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 126, fontWeight: 1000, letterSpacing: -7}}>{monthly}</div>
            <div style={{fontSize: 34, fontWeight: 900, marginTop: -12}}>€ / Monat</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 126, left: 70, right: 70, color: C.gray, fontSize: 24, fontWeight: 750}}>
        Ein Remotion-Showcase: B-Roll · Bilder · Icons · 3D · Charts · Motion
      </div>
    </AbsoluteFill>
  );
};

const BrollScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 19, stiffness: 120}});
  const scan = interpolate(frame, [0, SCENE_FRAMES], [-120, 860], clamp);
  const zoom = interpolate(frame, [0, SCENE_FRAMES], [1.05, 1.18], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <GridBackground glow={C.blue} />
      <SceneLabel index="02" label="REAL B-ROLL + MASKING" />
      <div style={{position: 'absolute', top: 220, left: 66, right: 66}}>
        <div style={{fontSize: 62, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2.5}}>
          Geldanlage passiert
          <br />
          heute <span style={{color: C.blueLt}}>digital.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 510,
          height: 900,
          borderRadius: 48,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 100px rgba(0,0,0,0.5)',
          opacity: card,
          scale: 0.94 + card * 0.06,
        }}
      >
        <OffthreadVideo
          src={BROLL_URL}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            scale: zoom,
            filter: 'saturate(0.76) contrast(1.12) brightness(0.82)',
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.62))'}} />
        <div
          style={{
            position: 'absolute',
            top: scan,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: C.accentLt,
            boxShadow: '0 0 34px rgba(92,255,173,0.75)',
          }}
        />
        <div style={{position: 'absolute', left: 34, right: 34, bottom: 36, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          {['Research', 'Vergleichen', 'Entscheiden'].map((text, i) => (
            <div
              key={text}
              style={{
                padding: '13px 18px',
                borderRadius: 999,
                backgroundColor: i === 2 ? C.accent : 'rgba(4,12,8,0.72)',
                color: i === 2 ? '#021108' : C.white,
                border: '1px solid rgba(255,255,255,0.16)',
                fontSize: 23,
                fontWeight: 900,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 92, left: 66, right: 66, fontSize: 17, color: C.grayDk}}>
        B-Roll: “Speed typing with dvorak” · Wikimedia Commons · CC0
      </div>
    </AbsoluteFill>
  );
};

const ImageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const y = interpolate(frame, [0, SCENE_FRAMES], [36, -46], clamp);
  const amount = Math.round(interpolate(frame, [18, 82], [0, 36000], clamp));

  return (
    <AbsoluteFill style={{backgroundColor: '#050706', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <GridBackground glow={C.gold} />
      <SceneLabel index="03" label="REAL IMAGE + PARALLAX" />
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 242,
          width: 940,
          height: 920,
          borderRadius: 52,
          overflow: 'hidden',
          backgroundColor: C.white,
          opacity: enter,
          rotate: `${interpolate(enter, [0, 1], [-4, 0], clamp)}deg`,
          scale: 0.9 + enter * 0.1,
          boxShadow: '0 38px 120px rgba(0,0,0,0.58)',
        }}
      >
        <Img
          src={EURO_IMAGE_URL}
          style={{
            width: '100%',
            height: '112%',
            objectFit: 'contain',
            translate: `0 ${y}px`,
          }}
        />
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 -160px 120px rgba(0,0,0,0.22)'}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 1180,
          padding: '34px 38px',
          borderRadius: 34,
          backgroundColor: 'rgba(5,12,8,0.88)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div style={{fontSize: 28, color: C.gray, fontWeight: 800}}>Nur eingezahlt nach 30 Jahren</div>
        <div style={{fontSize: 86, color: C.gold, fontWeight: 1000, letterSpacing: -4, marginTop: 6}}>{money(amount)}</div>
      </div>
      <div style={{position: 'absolute', bottom: 92, left: 66, right: 66, fontSize: 17, color: C.grayDk}}>
        Bild: “Euro banknotes, Europa series” · Wikimedia Commons · CC0
      </div>
    </AbsoluteFill>
  );
};

const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = reveal(frame, 9, 92);
  const pathLength = 820;
  const value = interpolate(p, [0, 1], [36000, 100452], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#030604', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <GridBackground glow={C.accent} />
      <SceneLabel index="04" label="DATA STORY + SVG MOTION" />
      <div style={{position: 'absolute', top: 235, left: 66, right: 66}}>
        <div style={{fontSize: 60, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2.2}}>Zeit verändert die Kurve.</div>
        <div style={{fontSize: 25, color: C.gray, marginTop: 18, fontWeight: 760}}>Beispielrechnung: 100 €/Monat · 30 Jahre · 6 % p.a.</div>
      </div>
      <div style={{position: 'absolute', top: 520, left: 70, right: 70, height: 690}}>
        <svg width="940" height="690" viewBox="0 0 940 690">
          {[0, 1, 2, 3, 4].map((line) => (
            <line key={line} x1="40" x2="900" y1={90 + line * 125} y2={90 + line * 125} stroke="rgba(255,255,255,0.09)" strokeWidth="2" />
          ))}
          <path
            d="M40 586 C180 565 270 535 365 482 C490 412 570 335 660 244 C750 153 825 102 900 72"
            fill="none"
            stroke={C.accentLt}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - p)}
          />
          <path
            d="M40 586 C180 565 270 535 365 482 C490 412 570 335 660 244 C750 153 825 102 900 72 L900 630 L40 630 Z"
            fill="url(#growthFill)"
            opacity={p * 0.62}
          />
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{position: 'absolute', left: 34, right: 34, bottom: 8, display: 'flex', justifyContent: 'space-between', color: C.gray, fontSize: 20, fontWeight: 750}}>
          <span>Start</span><span>10 Jahre</span><span>20 Jahre</span><span>30 Jahre</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 1270,
          padding: '30px 34px',
          borderRadius: 32,
          backgroundColor: 'rgba(17,38,26,0.9)',
          border: '1px solid rgba(92,255,173,0.28)',
        }}
      >
        <div style={{fontSize: 24, color: C.gray, fontWeight: 800}}>Illustrativer Endwert</div>
        <div style={{fontSize: 92, fontWeight: 1000, color: C.accentLt, letterSpacing: -5}}>{money(value)}</div>
        <div style={{fontSize: 18, color: C.grayDk}}>Keine Renditezusage · vor Steuern und individuellen Kosten</div>
      </div>
    </AbsoluteFill>
  );
};

const CompoundCore: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 22;
  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[5, 7, 6]} intensity={2.5} />
      <pointLight position={[-5, -2, 3]} intensity={1.7} color="#5CFFAD" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = t * (0.28 + i * 0.02) + i * 1.2;
        const radius = 2.7 + (i % 2) * 0.55;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.55, (i - 2) * 0.36]} rotation={[1.2, angle, 0.2]}>
            <torusGeometry args={[0.62 + i * 0.03, 0.18, 24, 72]} />
            <meshStandardMaterial color={i === 4 ? '#FFC83D' : '#00D26A'} roughness={0.28} metalness={0.35} />
          </mesh>
        );
      })}
      <mesh rotation={[t * 0.22, t * 0.3, t * 0.12]}>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshStandardMaterial color="#5CFFAD" roughness={0.25} metalness={0.22} />
      </mesh>
    </>
  );
};

const ThreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame, fps, config: {damping: 20, stiffness: 120}});
  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <SceneLabel index="05" label="REAL 3D · REACT THREE FIBER" />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 0, 8.6], fov: 44}}>
        <CompoundCore />
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 250,
          opacity: title,
          translate: `0 ${interpolate(title, [0, 1], [30, 0], clamp)}px`,
        }}
      >
        <div style={{fontSize: 65, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2.5}}>Zins auf Zins.</div>
        <div style={{fontSize: 31, fontWeight: 850, color: C.accentLt, marginTop: 14}}>Nicht nur mehr Geld — mehr Basis für den nächsten Zyklus.</div>
      </div>
      <div style={{position: 'absolute', bottom: 160, left: 70, right: 70, display: 'flex', gap: 14}}>
        {['Einzahlung', '+ Rendite', '+ Zeit'].map((item, index) => (
          <div key={item} style={{flex: 1, padding: '18px 12px', textAlign: 'center', borderRadius: 999, backgroundColor: index === 2 ? C.accent : 'rgba(255,255,255,0.08)', color: index === 2 ? '#021108' : C.white, fontSize: 22, fontWeight: 900}}>{item}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const FeesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(frame, 8, 94);
  const split = spring({frame: Math.max(0, frame - 12), fps, config: {damping: 18, stiffness: 130}});

  const rows = [
    {label: '0,20 % Kosten', end: 94, color: C.accentLt, icon: '✓'},
    {label: '1,50 % Kosten', end: 68, color: C.negativeLt, icon: '−'},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#030403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <GridBackground glow={C.negative} />
      <SceneLabel index="06" label="COMPARISON + MOTION MASKS" />
      <div style={{position: 'absolute', top: 230, left: 66, right: 66}}>
        <div style={{fontSize: 62, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2.4}}>Kleine Kosten.<br /><span style={{color: C.negativeLt}}>Große Strecke.</span></div>
      </div>
      <div style={{position: 'absolute', top: 570, left: 66, right: 66, display: 'flex', flexDirection: 'column', gap: 38}}>
        {rows.map((row, index) => (
          <div key={row.label} style={{opacity: split, translate: `${interpolate(split, [0, 1], [index ? 46 : -46, 0], clamp)}px 0`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
              <div style={{fontSize: 30, fontWeight: 900}}>{row.label}</div>
              <div style={{width: 48, height: 48, borderRadius: 16, display: 'grid', placeItems: 'center', backgroundColor: `${row.color}22`, color: row.color, fontSize: 30, fontWeight: 1000}}>{row.icon}</div>
            </div>
            <div style={{height: 150, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)'}}>
              <div style={{height: '100%', width: `${row.end * p}%`, borderRadius: 28, background: `linear-gradient(90deg, ${row.color}, ${row.color}99)`, boxShadow: `0 0 40px ${row.color}33`}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 66, right: 66, top: 1220, padding: 34, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.06)', fontSize: 30, fontWeight: 850, lineHeight: 1.3}}>
        Motion kann einen Unterschied <span style={{color: C.gold}}>sichtbar machen</span>, bevor Text ihn erklärt.
      </div>
    </AbsoluteFill>
  );
};

const IconsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items: Array<{icon: 'wallet' | 'clock' | 'chart' | 'shield'; label: string; sub: string}> = [
    {icon: 'wallet', label: 'Einzahlung', sub: 'klein starten'},
    {icon: 'clock', label: 'Zeit', sub: 'langfristig denken'},
    {icon: 'chart', label: 'Wachstum', sub: 'Schwankungen aushalten'},
    {icon: 'shield', label: 'Risiko', sub: 'bewusst steuern'},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#040705', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <GridBackground glow={C.purple} />
      <SceneLabel index="07" label="SVG ICON SYSTEM + STAGGER" />
      <div style={{position: 'absolute', top: 225, left: 66, right: 66}}>
        <div style={{fontSize: 61, fontWeight: 950, lineHeight: 1.03, letterSpacing: -2.2}}>Vier Dinge.<br />Ein System.</div>
      </div>
      <div style={{position: 'absolute', top: 530, left: 66, right: 66, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        {items.map((item, index) => {
          const p = spring({frame: Math.max(0, frame - index * 10), fps, config: {damping: 18, stiffness: 145}});
          return (
            <div
              key={item.label}
              style={{
                height: 310,
                borderRadius: 34,
                padding: 30,
                backgroundColor: index === 3 ? 'rgba(185,140,255,0.14)' : 'rgba(255,255,255,0.055)',
                border: `1px solid ${index === 3 ? 'rgba(185,140,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                opacity: p,
                scale: 0.82 + p * 0.18,
                translate: `0 ${interpolate(p, [0, 1], [42, 0], clamp)}px`,
              }}
            >
              <div style={{color: index === 3 ? C.purpleLt : C.accentLt}}><SvgIcon kind={item.icon} /></div>
              <div style={{fontSize: 34, fontWeight: 950, marginTop: 24}}>{item.label}</div>
              <div style={{fontSize: 22, color: C.gray, marginTop: 8, lineHeight: 1.3}}>{item.sub}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 66, right: 66, bottom: 180, height: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${reveal(frame, 8, 92) * 100}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.blue}, ${C.purple})`}} />
      </div>
    </AbsoluteFill>
  );
};

const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = spring({frame, fps, config: {damping: 16, stiffness: 105, mass: 0.9}});
  const p = reveal(frame, 15, 86);
  const end = interpolate(p, [0, 1], [36000, 100452], clamp);
  const dotCount = 18;

  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
      <GridBackground glow={C.accent} />
      <SceneLabel index="08" label="PAYOFF" />
      {Array.from({length: dotCount}).map((_, index) => {
        const angle = (Math.PI * 2 * index) / dotCount + frame / 70;
        const radius = 390 + (index % 3) * 70;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(angle) * radius,
              top: 960 + Math.sin(angle) * radius,
              width: 8 + (index % 3) * 5,
              height: 8 + (index % 3) * 5,
              borderRadius: 99,
              backgroundColor: index % 4 === 0 ? C.gold : C.accent,
              opacity: 0.25 + p * 0.65,
            }}
          />
        );
      })}
      <div style={{position: 'absolute', top: 295, left: 64, right: 64, textAlign: 'center', opacity: hero, scale: 0.88 + hero * 0.12}}>
        <div style={{fontSize: 28, fontWeight: 900, color: C.gray, letterSpacing: 2}}>100 € / MONAT · 30 JAHRE · BEISPIEL 6 % P.A.</div>
        <div style={{fontSize: 146, fontWeight: 1000, letterSpacing: -9, lineHeight: 0.95, color: C.accentLt, marginTop: 36}}>{money(end)}</div>
        <div style={{fontSize: 35, fontWeight: 850, marginTop: 34}}>Aus 36.000 € Einzahlungen wird eine andere Größenordnung.</div>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1010, height: 450, borderRadius: 999, border: `3px solid rgba(92,255,173,${0.18 + p * 0.42})`, scale: 0.72 + p * 0.28, boxShadow: '0 0 120px rgba(0,210,106,0.14)'}} />
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 235, display: 'flex', gap: 18}}>
        {['B-Roll', 'Real Images', 'SVG Icons', '3D', 'Charts'].map((tag) => (
          <div key={tag} style={{flex: 1, padding: '15px 8px', textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 17, fontWeight: 850}}>{tag}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 112, textAlign: 'center', color: C.gray, fontSize: 19, lineHeight: 1.35}}>
        Technischer Showcase – keine Anlageberatung und keine Renditezusage.
      </div>
    </AbsoluteFill>
  );
};

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
  />
);

export const RemotionShowcase: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><HookScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><BrollScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><ImageScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><GrowthScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><ThreeScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><FeesScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><IconsScene /></TransitionSeries.Sequence>
    {transition}
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><PayoffScene /></TransitionSeries.Sequence>
  </TransitionSeries>
);
