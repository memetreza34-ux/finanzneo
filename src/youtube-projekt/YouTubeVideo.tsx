// Phase 3 für YouTube-Longform: setzt Bilder, versiegelte Animationen, Voiceover
// und Untertitel nach dem Zeitplan aus `npm run youtube:zusammenbau` zusammen.
//
// Der Zeitplan kommt vollständig aus den echten Wort-Zeitstempeln: Jedes Visual
// beginnt bei seinem startCue, jede Animationsstufe bei ihrem beatCue.
// Animationen bekommen nur `beats` — ihr Code bleibt unverändert (Seal).

import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../brand';
import {DATEN} from '../design-system/daten';

export type ZeitVisual = {
  id: string;
  type: 'image' | 'animation' | 'data' | 'hybrid';
  startFrame: number;
  durationFrames: number;
  /** Pfad unter public/ (staticFile), nur bei Bildern. null = Bild fehlt (nur Vorschau). */
  bild?: string | null;
  beats?: number[];
  /** Kurze Hinweise auf Standbildern, Frames relativ zum Visual-Start. */
  akzente?: Array<{ab: number; text: string; ton: 'gruen' | 'rot' | 'neutral'}>;
};
export type CaptionWort = {text: string; start: number; end: number};
export type CaptionSatz = {start: number; end: number; words: CaptionWort[]};
export type YouTubeZeitplan = {
  fps: number;
  durationFrames: number;
  audio: string;
  visuals: ZeitVisual[];
  captions: CaptionSatz[];
  untertitel: boolean;
};

const UEBERBLENDEN = 8;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BildVisual: React.FC<{bild?: string | null; dauer: number; id: string}> = ({bild, dauer, id}) => {
  const frame = useCurrentFrame();
  // Ganz ruhiger Zug ins Bild, damit ein Standbild nicht einfriert.
  const zoom = interpolate(frame, [0, Math.max(1, dauer)], [1, 1.035], CLAMP);
  if (!bild) {
    return (
      <AbsoluteFill style={{backgroundColor: DATEN.linie, alignItems: 'center', justifyContent: 'center', fontFamily: FONT.body, fontSize: 48, fontWeight: 800, color: DATEN.leise}}>
        Vorschau: Bild für {id} fehlt noch
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: DATEN.grund, overflow: 'hidden'}}>
      <Img src={staticFile(bild)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom.toFixed(4)})`}} />
    </AbsoluteFill>
  );
};

const TON = {gruen: DATEN.gruen, rot: DATEN.rot, neutral: DATEN.leise} as const;

/** Bild-Akzente: kleine Karten oben links, die beim gesprochenen Wort einrasten und stehen bleiben. */
const Akzente: React.FC<{akzente: NonNullable<ZeitVisual['akzente']>}> = ({akzente}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 72, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
      {akzente.map((akzent, i) => {
        const p = interpolate(frame, [akzent.ab, akzent.ab + 10], [0, 1], {...CLAMP, easing: (t) => 1 - (1 - t) ** 3});
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              opacity: p,
              transform: `translateX(${((1 - p) * -24).toFixed(1)}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 26px 16px 18px',
              borderRadius: 16,
              backgroundColor: DATEN.papier,
              boxShadow: '0 14px 36px rgba(32, 42, 37, 0.16)',
              fontFamily: FONT.body,
              fontSize: 38,
              fontWeight: 800,
              color: DATEN.text,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{width: 8, height: 40, borderRadius: 4, backgroundColor: TON[akzent.ton]}} />
            {akzent.text}
          </div>
        );
      })}
    </div>
  );
};

const Einblenden: React.FC<{children: React.ReactNode; aktiv: boolean}> = ({children, aktiv}) => {
  const frame = useCurrentFrame();
  const opacity = aktiv ? interpolate(frame, [0, UEBERBLENDEN], [0, 1], CLAMP) : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Satzweise Untertitel; das gerade gesprochene Wort ist grün. */
const Untertitel: React.FC<{saetze: CaptionSatz[]}> = ({saetze}) => {
  const frame = useCurrentFrame();
  const satz = saetze.find((s) => frame >= s.start && frame < s.end);
  if (!satz) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1480,
          padding: '14px 28px',
          borderRadius: 18,
          backgroundColor: 'rgba(32, 42, 37, 0.82)',
          fontFamily: FONT.body,
          fontSize: 44,
          fontWeight: 800,
          lineHeight: 1.25,
          textAlign: 'center',
          color: '#FFFFFF',
        }}
      >
        {satz.words.map((wort, i) => (
          <span key={i} style={{color: frame >= wort.start && frame < wort.end ? '#7FD6A0' : '#FFFFFF'}}>
            {wort.text}
            {i < satz.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const YouTubeVideo: React.FC<{zeitplan: YouTubeZeitplan; animationen: Record<string, React.FC<{beats?: number[]}>>}> = ({zeitplan, animationen}) => (
  <AbsoluteFill style={{backgroundColor: DATEN.grund}}>
    {zeitplan.visuals.map((visual, index) => {
      const Animation = animationen[visual.id];
      const letztes = index === zeitplan.visuals.length - 1;
      return (
        <Sequence key={visual.id} from={visual.startFrame} durationInFrames={visual.durationFrames + (letztes ? 0 : UEBERBLENDEN)} name={visual.id}>
          <Einblenden aktiv={index > 0}>
            {visual.type === 'image' ? (
              <>
                <BildVisual bild={visual.bild} dauer={visual.durationFrames} id={visual.id} />
                {visual.akzente?.length ? <Akzente akzente={visual.akzente} /> : null}
              </>
            ) : Animation ? (
              <Animation beats={visual.beats} />
            ) : (
              <BildVisual bild={null} dauer={visual.durationFrames} id={visual.id} />
            )}
          </Einblenden>
        </Sequence>
      );
    })}
    <Audio src={staticFile(zeitplan.audio)} />
    {zeitplan.untertitel ? <Untertitel saetze={zeitplan.captions} /> : null}
  </AbsoluteFill>
);
