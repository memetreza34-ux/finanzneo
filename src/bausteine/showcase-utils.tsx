import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {AuroraBG, C, StaticBG, bebas, inter} from './fn_core';

export type FNShowcaseBackground = 'static' | 'aurora' | 'none';

export type FNShowcaseItem = Readonly<{
  name: string;
  node: React.ReactNode;
}>;

export const showcaseFrames = (count: number, beat: number) => count * beat;

const BackgroundLayer: React.FC<{kind: FNShowcaseBackground}> = ({kind}) => {
  if (kind === 'none') return null;
  return kind === 'aurora' ? <AuroraBG /> : <StaticBG />;
};

const CatalogBeat: React.FC<{
  item: FNShowcaseItem;
  background: FNShowcaseBackground;
  contentPadding: React.CSSProperties['padding'];
  eyebrow?: string;
  eyebrowColor: string;
  footerFont: 'title' | 'body';
  footerSize: number;
  footerLetterSpacing: number;
  footerColor: string;
  footerBottom: number;
}> = ({
  item,
  background,
  contentPadding,
  eyebrow,
  eyebrowColor,
  footerFont,
  footerSize,
  footerLetterSpacing,
  footerColor,
  footerBottom,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <BackgroundLayer kind={background} />
      <AbsoluteFill
        style={{
          padding: contentPadding,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {eyebrow ? (
          <div
            style={{
              fontFamily: inter,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              color: eyebrowColor,
              opacity: Math.min(1, frame / 12),
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.node}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          bottom: footerBottom,
          width: '100%',
          textAlign: 'center',
          opacity: Math.min(1, (frame - 4) / 12),
          fontFamily: footerFont === 'title' ? bebas : inter,
          fontSize: footerSize,
          letterSpacing: footerLetterSpacing,
          color: footerColor,
        }}
      >
        {item.name}
      </div>
    </AbsoluteFill>
  );
};

export const FNShowcaseCatalog: React.FC<{
  items: readonly FNShowcaseItem[];
  beat: number;
  background?: FNShowcaseBackground;
  contentPadding?: React.CSSProperties['padding'];
  eyebrow?: string;
  eyebrowColor?: string;
  footerFont?: 'title' | 'body';
  footerSize?: number;
  footerLetterSpacing?: number;
  footerColor?: string;
  footerBottom?: number;
}> = ({
  items,
  beat,
  background = 'static',
  contentPadding = '120px',
  eyebrow,
  eyebrowColor = C.green,
  footerFont = 'body',
  footerSize = 28,
  footerLetterSpacing = 4,
  footerColor = 'rgba(255,255,255,0.4)',
  footerBottom = 50,
}) => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((item, index) => (
        <Series.Sequence key={`${item.name}-${index}`} durationInFrames={beat}>
          <CatalogBeat
            item={item}
            background={background}
            contentPadding={contentPadding}
            eyebrow={eyebrow}
            eyebrowColor={eyebrowColor}
            footerFont={footerFont}
            footerSize={footerSize}
            footerLetterSpacing={footerLetterSpacing}
            footerColor={footerColor}
            footerBottom={footerBottom}
          />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const FNShowcaseSeries: React.FC<{
  scenes: readonly React.ComponentType[];
  beat: number;
  background?: FNShowcaseBackground;
  centerContent?: boolean;
}> = ({scenes, beat, background = 'static', centerContent = true}) => (
  <AbsoluteFill style={{background: C.bg}}>
    <BackgroundLayer kind={background} />
    <Series>
      {scenes.map((Scene, index) => (
        <Series.Sequence key={index} durationInFrames={beat}>
          {centerContent ? (
            <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
              <Scene />
            </AbsoluteFill>
          ) : (
            <Scene />
          )}
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
