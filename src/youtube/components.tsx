// FinanzNeo YouTube Layout V1 — Bühne, Zwischenüberschrift, Bild, Untertitel.
//
// Zwischenüberschrift und Untertitel nutzen bewusst dieselben Komponenten wie die
// Reels. Sie nehmen ihre Layoutwerte als Props, also gibt es keine zweite
// Karaoke- oder Header-Logik, die auseinanderlaufen könnte — nur andere Zahlen.

import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {SceneHeader, type SceneHeaderTone} from '../brand/components/SceneHeader';
import type {IconName} from '../brand/components/Icon';
import {C} from '../brand/tokens';
import {FONT} from '../brand/fonts';
import {YOUTUBE_FORMAT, YOUTUBE_STYLE} from './layout';

const {header: H, visual: V, infoText: INFO, transition: T} = YOUTUBE_STYLE;

/**
 * Schwarzer Vollframe. Der einzige produktive YouTube-Hintergrund.
 *
 * Setzt zusaetzlich die Kanalschrift fuer alles, was darin liegt. Ohne das erbt
 * eine Animation, die selbst keine Schrift setzt, die Chromium-Standardschrift —
 * im Notgroschen-Render kamen so `Notgroschen`, `3 Monatsgehaelter` und `1.000 €`
 * in Times New Roman heraus, direkt unter einem Inter-Header.
 */
export const YouTubeStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: '#000000', fontFamily: FONT.body}}>{children}</AbsoluteFill>
);

export const YouTubeHeader: React.FC<{
  title: string;
  icon: IconName;
  tone?: SceneHeaderTone;
  at?: number;
}> = ({title, icon, tone = 'default', at = 0}) => (
  <SceneHeader
    title={title}
    icon={icon}
    tone={tone}
    at={at}
    top={H.top}
    left={H.left}
    right={H.right}
    size={H.fontSize}
    minSize={H.minFontSize}
    iconBox={H.iconBox}
    iconSize={H.iconSize}
    gap={H.gap}
    maxWidth={H.maxWidth}
    maxLines={H.maxLines}
    enterFrames={H.enterFrames}
  />
);

/**
 * Das Flow-Bild steht auf exakt zwei Dritteln der Framebreite, zentriert in der
 * Visualzone. Es füllt den Frame bewusst nicht aus: darüber bleibt die Bahn für
 * die Zwischenüberschrift frei.
 *
 * Weil die Bildwelt reines Schwarz als Hintergrund vorschreibt, gehen die
 * Bildkanten in die Videofläche über — es entsteht kein sichtbarer Kasten.
 */
/**
 * Sichtbarkeit, mit der ein Bild einsetzt.
 *
 * Nicht 0: die Szenen stehen in einer Series direkt aneinander, es gibt also
 * keine vorige Szene, durch die hindurchgeblendet würde. Ein Einblenden aus 0
 * hieße, dass der erste Frame jeder Bildszene schwarz ist — beim Wechsel von
 * Bild zu Bild blitzt dann Schwarz auf, genau das, was `fadeToBlackForbidden`
 * ausschließt. Gemessen an einem Render traf das 10 von 27 Schnitten.
 * Das Bild setzt deshalb sichtbar ein und zieht nur noch leicht an.
 */
const IMAGE_ENTER_FROM = 0.82;

export const YouTubeImage: React.FC<{src: string; at?: number}> = ({src, at = 0}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + T.imageEnterFrames], [IMAGE_ENTER_FROM, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', left: V.left, top: V.top, width: V.width, height: V.height, opacity: enter}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
    </div>
  );
};

/**
 * Bühne für native Animationen.
 *
 * Das Koordinatensystem bleibt volle 1920 × 1080, damit Phase-1-Code in echten
 * Framekoordinaten geschrieben werden kann. Sichtbar ist aber nur die Visualzone:
 * die Bahn oben gehört der Zwischenüberschrift, die unten den Untertiteln. Was
 * eine Animation dort hineinzeichnet, wird hart abgeschnitten statt zu kollidieren.
 *
 * Die volle Breite bleibt erhalten — anders als beim Bild, das als 16:9-Quelle in
 * der kürzeren Bahn zwangsläufig auch schmaler wird.
 */
export const YouTubeAnimationFrame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 0, top: V.top, width: YOUTUBE_FORMAT.width, height: V.height, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: -V.top, width: YOUTUBE_FORMAT.width, height: YOUTUBE_FORMAT.height}}>
      {children}
    </div>
  </div>
);

/**
 * Perspektiv-Bühne für die Physical-Primitives.
 *
 * `PremiumPhysicalStage` aus dem Reel-Baukasten ist NICHT formatoffen: sie clippt
 * über `AnimationStage` mit `inset(320px 0 520px 0)` aus den Reel-Tokens. In einem
 * 1080 hohen Frame schneidet das bei y = 560 ab und skaliert zusätzlich um den
 * Reel-Mittelpunkt. Für YouTube gibt es deshalb diese Bühne: nur Perspektive,
 * kein Clipping und keine Skalierung — das Beschneiden auf die Visualzone macht
 * bereits YouTubeAnimationFrame.
 */
export const YouTubePhysicalStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{perspective: 1400, background: 'transparent', pointerEvents: 'none'}}>
    {children}
  </AbsoluteFill>
);

/**
 * Optionale kurze Zeile unter dem Visual — Quelle, Annahme oder Hinweis.
 *
 * YouTube bekommt bewusst KEINE Karaoke-Untertitel: Reels laufen stumm im Feed
 * und brauchen sie, Longform wird mit Ton geschaut. Was hier steht, hat dieselbe
 * Rolle wie ein Label in einer Animation und bleibt eine Zeile.
 */
export const YouTubeInfoText: React.FC<{children: React.ReactNode; at?: number}> = ({children, at = 0}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + T.imageEnterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute',
      left: INFO.left,
      right: INFO.right,
      bottom: INFO.bottom,
      fontFamily: FONT.body,
      fontSize: INFO.fontSize,
      lineHeight: 1.2,
      color: C.gray,
      textAlign: 'center',
      opacity: enter,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      {children}
    </div>
  );
};
