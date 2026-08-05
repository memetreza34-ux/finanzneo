import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Captions, PremiumGrade, ThemeProvider} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {
  PrebuiltEtfCreationAnimation,
  PrebuiltEtfOrderMatchAnimation,
} from './PrebuiltEtfAnimations';
import type {EtfImageMotion, EtfKauf100EuroRenderProps, EtfRuntimeScene} from './types';
import {ETF_COLORS, SceneHeader, clamp01} from './visual';

const getMotion = (motion?: EtfImageMotion): EtfImageMotion => motion ?? {
  type: 'two-phase-push-focus',
  scaleFrom: 1,
  scaleTo: 1.06,
  panX: 0,
  panY: 0,
};

const ImageScene: React.FC<{
  scene: EtfRuntimeScene;
}> = ({scene}) => {
  const frame = useCurrentFrame();
  const duration = Math.max(2, scene.durationInFrames);
  const p = clamp01(frame / (duration - 1));
  const motion = getMotion(scene.motion);
  const split = 0.48;
  const midpointScale = motion.scaleFrom + (motion.scaleTo - motion.scaleFrom) * 0.42;
  const scale = p <= split
    ? interpolate(p, [0, split], [motion.scaleFrom, midpointScale])
    : interpolate(p, [split, 1], [midpointScale, motion.scaleTo]);
  const midpointX = motion.panX * 0.36;
  const midpointY = motion.panY * 0.36;
  const translateX = p <= split
    ? interpolate(p, [0, split], [0, midpointX])
    : interpolate(p, [split, 1], [midpointX, motion.panX]);
  const translateY = p <= split
    ? interpolate(p, [0, split], [0, midpointY])
    : interpolate(p, [split, 1], [midpointY, motion.panY]);
  const reveal = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: 'clamp'});
  const settle = interpolate(frame, [duration - 12, duration - 1], [1, 0.985], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: ETF_COLORS.background}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: '50% 48%',
            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale * settle})`,
            opacity: reveal,
          }}
        />
      ) : (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #10251A, #06110A)'}} />
      )}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(2,8,4,0.72) 0%, rgba(2,8,4,0.08) 25%, rgba(2,8,4,0.04) 61%, rgba(2,8,4,0.82) 100%)',
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 130px rgba(0,0,0,0.28)'}} />
    </AbsoluteFill>
  );
};

const AnimationScene: React.FC<{scene: EtfRuntimeScene}> = ({scene}) => {
  if (scene.id === 'scene-02-order-match') {
    return <PrebuiltEtfOrderMatchAnimation sceneDurationInFrames={scene.durationInFrames} />;
  }
  if (scene.id === 'scene-05-creation') {
    return <PrebuiltEtfCreationAnimation sceneDurationInFrames={scene.durationInFrames} />;
  }
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #10251A, #06110A)',
        color: ETF_COLORS.text,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: 44,
        fontWeight: 900,
      }}
    >
      Unbekannte Animationsszene: {scene.id}
    </AbsoluteFill>
  );
};

const DebugLabel: React.FC<{scene: EtfRuntimeScene}> = ({scene}) => (
  <div
    style={{
      position: 'absolute',
      top: 18,
      right: 18,
      zIndex: 100,
      padding: '9px 14px',
      borderRadius: 999,
      background: 'rgba(0,0,0,0.74)',
      border: '1px solid rgba(98,245,154,0.5)',
      color: ETF_COLORS.green,
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 17,
      fontWeight: 900,
    }}
  >
    {scene.id} · {scene.durationInFrames}f
  </div>
);

export const EtfKauf100EuroReel: React.FC<EtfKauf100EuroRenderProps> = (props) => {
  const hardBreaksMs = props.scenes.slice(1).map((scene) => scene.startFrame / props.fps * 1000);

  return (
    <ThemeProvider value={BRAND}>
      <AbsoluteFill style={{backgroundColor: ETF_COLORS.background}}>
        {props.scenes.map((scene) => (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            premountFor={Math.round(props.fps * 0.5)}
            name={`${scene.id} · ${scene.type === 'image' ? 'Bild' : 'Vorprogrammierte Animation'}`}
          >
            {scene.type === 'image' ? <ImageScene scene={scene} /> : <AnimationScene scene={scene} />}
            <SceneHeader
              kicker={scene.kicker}
              headline={scene.headline}
              body={scene.body}
              accent={scene.id === 'scene-05-creation' ? ETF_COLORS.gold : ETF_COLORS.green}
            />
            {props.debug ? <DebugLabel scene={scene} /> : null}
          </Sequence>
        ))}

        {props.runtimeAudio ? <Audio src={staticFile(props.runtimeAudio)} volume={1} /> : null}

        {props.captions.length > 0 ? (
          <Captions
            captions={props.captions}
            perGroup={4}
            bottom={285}
            size={62}
            highlight={BRAND.accent}
            hardBreaksMs={hardBreaksMs}
            instant
          />
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 58,
            right: 58,
            bottom: 72,
            height: 5,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            zIndex: 85,
          }}
        >
          <GlobalProgress durationInFrames={props.durationInFrames} />
        </div>
        <PremiumGrade intensity="subtle" bloomColor="98,245,154" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};

const GlobalProgress: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        width: `${width}%`,
        height: '100%',
        borderRadius: 99,
        background: `linear-gradient(90deg, ${ETF_COLORS.green}, ${ETF_COLORS.mint})`,
        boxShadow: '0 0 18px rgba(98,245,154,0.48)',
      }}
    />
  );
};
