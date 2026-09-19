// Belegt, dass beide neuen Wege im Render tragen: echtes 3D und Lottie.
//
// Links drei Körper aus dem three-kit, rechts eine der vierzehn Lottie-Dateien,
// die seit jeher unter public/lottie liegen und nie eingebunden wurden.

import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Lottie} from '@remotion/lottie';
import {CoinStack3D, Slab3D, ThreeStage} from '../three-kit';

export const ThreeCoinTest: React.FC = () => {
  const frame = useCurrentFrame();
  const collapse = interpolate(frame, [20, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const count = Math.round(interpolate(collapse, [0, 1], [11, 2]));
  const gap = interpolate(frame, [84, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const [animationData, setAnimationData] = React.useState<unknown>(null);
  React.useEffect(() => {
    fetch(staticFile('lottie/sparschwein.json'))
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, []);

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <ThreeStage cameraY={1.2} cameraZ={11}>
        <CoinStack3D position={[-4.2, -2.2, 0]} count={count} radius={1.1} />
        {gap > 0 ? (
          <Slab3D position={[-0.6, -0.9, 0]} size={[2, Math.max(0.01, gap * 2.4), 1.1]} material="warning" />
        ) : null}
      </ThreeStage>

      <div style={{position: 'absolute', right: 180, top: 300, width: 520, height: 520}}>
        {animationData ? <Lottie animationData={animationData as never} loop /> : null}
      </div>

      <div style={{
        position: 'absolute', left: 60, top: 54, fontSize: 30, fontWeight: 900,
        color: '#F7F7F2', fontFamily: 'Arial, Helvetica, sans-serif',
      }}>
        links: three-kit · rechts: public/lottie/sparschwein.json
      </div>
    </AbsoluteFill>
  );
};

export const THREE_COIN_TEST_FRAMES = 140;
