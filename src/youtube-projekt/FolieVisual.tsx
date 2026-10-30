// Erklär-Folie (finanzneo-youtube-folie-v2): weiße Folie, wenig Text, farbiges 3D-Icon — das
// Finanzbär-Prinzip. Jedes Teil erscheint beim gesprochenen Wort (`marken`, in der Reihenfolge von
// folieCues); betonte Stellen bekommen den gelben FinanzNeo-Marker (derselbe wie in Belegen und auf
// dem Cover). Formen: zeilen · zahl · begriff · ablauf · vergleich.
// Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md · Icons: scripts/lib/youtube-icons.mjs

import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../brand';
import {DATEN} from '../design-system/daten';

type Teil = {text: string; cue?: string};
export type FolieDaten = {
  titel?: string;
  icon?: string;
  zeilen?: Array<{text: string; betont?: string}>;
  zahl?: {wert: string; label: string; ton?: 'gruen' | 'rot'};
  begriff?: {text: string; betont?: string};
  ablauf?: {von: Teil & {icon: string}; nach: Teil & {icon: string}; punkte?: Teil[]};
  vergleich?: Array<Teil & {icon: string; oben?: string; hinweis?: string}>;
};

const WEISS = '#FFFFFF';
const MARKER = 'rgba(255, 205, 60, 0.85)';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (frame: number, von: number, dauer = 12) => interpolate(frame, [von, von + dauer], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
const tonFarbe = {gruen: DATEN.gruen, rot: DATEN.rot} as const;

/** 3D-Icon, das beim Wort kurz aufspringt. */
const Icon: React.FC<{name: string; groesse: number; ab: number}> = ({name, groesse, ab}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - ab, fps, config: {damping: 14, stiffness: 160}});
  return (
    <Img
      src={staticFile(`icons/fluent-3d/${name}.png`)}
      style={{flex: 'none', width: groesse, height: groesse, opacity: weich(frame, ab, 8), transform: `scale(${(0.6 + 0.4 * s).toFixed(3)})`}}
    />
  );
};

/** Blendet weich von unten ein. */
const Ein: React.FC<{ab: number; children: React.ReactNode; style?: React.CSSProperties}> = ({ab, children, style}) => {
  const p = weich(useCurrentFrame(), ab);
  return <div style={{opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(1)}px)`, ...style}}>{children}</div>;
};

/** Text mit gelbem Marker hinter `betont`, der ab Frame `ab` von links nach rechts läuft. */
const MitMarker: React.FC<{text: string; betont?: string; ab: number}> = ({text, betont, ab}) => {
  const frame = useCurrentFrame();
  const i = betont ? text.indexOf(betont) : -1;
  if (!betont || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{position: 'relative', display: 'inline-block'}}>
        <span
          style={{
            position: 'absolute',
            left: '-0.1em',
            right: '-0.1em',
            top: '0.12em',
            bottom: '0.02em',
            borderRadius: '0.08em',
            backgroundColor: MARKER,
            transformOrigin: 'left center',
            transform: `rotate(-1deg) scaleX(${weich(frame, ab)})`,
          }}
        />
        <span style={{position: 'relative'}}>{betont}</span>
      </span>
      {text.slice(i + betont.length)}
    </>
  );
};

const Titel: React.FC<{titel: string; mittig?: boolean}> = ({titel, mittig}) => (
  <Ein ab={0} style={{textAlign: mittig ? 'center' : 'left'}}>
    <div style={{fontSize: 76, fontWeight: 800, letterSpacing: -0.5}}>{titel}</div>
    <div style={{width: 96, height: 8, borderRadius: 4, backgroundColor: DATEN.gruen, marginTop: 16, marginLeft: mittig ? 'auto' : 0, marginRight: mittig ? 'auto' : 0}} />
  </Ein>
);

const Liste: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const frame = useCurrentFrame();
  const zeilen = folie.zeilen ?? [];
  // Die zuletzt erschienene Zeile ist die aktuelle; alle anderen treten etwas zurück.
  const aktuell = marken.reduce((a, m, k) => (frame >= m ? k : a), -1);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 80}}>
      {folie.icon ? <Icon name={folie.icon} groesse={260} ab={0} /> : null}
      <div style={{display: 'flex', flexDirection: 'column', gap: 48}}>
        {folie.titel ? <Titel titel={folie.titel} /> : null}
        <div style={{display: 'flex', flexDirection: 'column', gap: 36}}>
          {zeilen.map((z, k) => {
            const ab = marken[k] ?? 0;
            return (
              <Ein key={k} ab={ab} style={{display: 'flex', alignItems: 'center', gap: 26, fontSize: 66, fontWeight: 700, lineHeight: 1.15, opacity: k < aktuell ? 0.45 : undefined}}>
                <span style={{flex: 'none', width: 62, height: 62, borderRadius: 31, backgroundColor: DATEN.gruen, color: WEISS, fontSize: 36, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {k + 1}
                </span>
                <span>
                  <MitMarker text={z.text} betont={z.betont} ab={ab + 6} />
                </span>
              </Ein>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Zahl: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const ab = marken[0] ?? 0;
  const zahl = folie.zahl!;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 70}}>
      {folie.icon ? <Icon name={folie.icon} groesse={320} ab={ab} /> : null}
      <div style={{textAlign: folie.icon ? 'left' : 'center'}}>
        <Ein ab={ab + 8} style={{fontSize: 210, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: zahl.ton ? tonFarbe[zahl.ton] : DATEN.text}}>
          {zahl.ton ? zahl.wert : <MitMarker text={zahl.wert} betont={zahl.wert} ab={ab + 24} />}
        </Ein>
        <Ein ab={ab + 20} style={{fontSize: 60, fontWeight: 700, color: DATEN.leise, marginTop: 18}}>{zahl.label}</Ein>
      </div>
    </div>
  );
};

const Begriff: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const ab = marken[0] ?? 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44}}>
      <Icon name={folie.icon!} groesse={300} ab={ab} />
      <Ein ab={ab + 12} style={{fontSize: 84, fontWeight: 800, textAlign: 'center', maxWidth: 1600}}>
        <MitMarker text={folie.begriff!.text} betont={folie.begriff!.betont} ab={ab + 34} />
      </Ein>
    </div>
  );
};

const Seite: React.FC<{teil: Teil & {icon: string}; ab: number; farbe: string}> = ({teil, ab, farbe}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
    <Icon name={teil.icon} groesse={230} ab={ab} />
    <Ein ab={ab + 8} style={{fontSize: 64, fontWeight: 800, color: farbe}}>{teil.text}</Ein>
  </div>
);

const Ablauf: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const frame = useCurrentFrame();
  const {von, nach, punkte = []} = folie.ablauf!;
  const [abVon = 0, abNach = 40] = marken;
  // Der Pfeil zeichnet sich zwischen den beiden Wörtern.
  const pfeilAb = Math.max(abVon + 10, abNach - 16);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 70}}>
      <Seite teil={von} ab={abVon} farbe={DATEN.text} />
      <svg width={260} height={60} viewBox="0 0 260 60" style={{flex: 'none'}}>
        <line x1={4} y1={30} x2={4 + 226 * weich(frame, pfeilAb, 14)} y2={30} stroke={DATEN.text} strokeWidth={8} strokeLinecap="round" />
        <path d="M215 10 L250 30 L215 50" fill="none" stroke={DATEN.text} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={weich(frame, pfeilAb + 12, 6)} />
      </svg>
      <Seite teil={nach} ab={abNach} farbe={DATEN.orange} />
      {punkte.length ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16, fontSize: 50, fontWeight: 700, marginLeft: 10}}>
          {punkte.map((p, k) => (
            <Ein key={k} ab={marken[2 + k] ?? abNach + 20 + k * 16}>
              <span style={{color: DATEN.gruen}}>{k + 1}.</span> {p.text}
            </Ein>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Vergleich: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 56}}>
    {folie.vergleich!.map((z, k) => {
      const ab = marken[k] ?? k * 30;
      return (
        <div key={k} style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <Icon name={z.icon} groesse={190} ab={ab} />
          <Ein ab={ab + 8} style={{lineHeight: 1.05}}>
            {z.oben ? <div style={{fontSize: 54, fontWeight: 500, color: DATEN.leise}}>{z.oben}</div> : null}
            <div style={{fontSize: 82, fontWeight: 800}}>{z.text}</div>
          </Ein>
          {z.hinweis ? (
            <Ein ab={ab + 22} style={{marginLeft: 24, padding: '12px 28px', borderRadius: 16, backgroundColor: DATEN.gruen, color: WEISS, fontSize: 46, fontWeight: 800, whiteSpace: 'nowrap'}}>
              {z.hinweis}
            </Ein>
          ) : null}
        </div>
      );
    })}
  </div>
);

export const FolieVisual: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const inhalt = folie.zahl ? (
    <Zahl folie={folie} marken={marken} />
  ) : folie.begriff ? (
    <Begriff folie={folie} marken={marken} />
  ) : folie.ablauf ? (
    <Ablauf folie={folie} marken={marken} />
  ) : folie.vergleich ? (
    <Vergleich folie={folie} marken={marken} />
  ) : null;
  return (
    <AbsoluteFill style={{backgroundColor: WEISS, fontFamily: FONT.body, color: DATEN.text, alignItems: 'center', justifyContent: 'center'}}>
      {inhalt ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
          {folie.titel ? <Titel titel={folie.titel} mittig /> : null}
          {inhalt}
        </div>
      ) : (
        <Liste folie={folie} marken={marken} />
      )}
    </AbsoluteFill>
  );
};
