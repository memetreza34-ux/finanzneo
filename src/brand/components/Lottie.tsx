import React, { useEffect, useState } from 'react';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

// FinanzNeo Lottie support layer.
// Finale JSON-Dateien liegen lokal unter public/lottie/ und werden deterministisch
// von Remotion gerendert. Loops sind absichtlich NICHT der Standard.
export const LottieBox: React.FC<{
  file: string;            // z.B. 'lottie/reel-slug/scene-09-calendar-flip.json'
  size?: number;
  loop?: boolean;
  playbackRate?: number;
  style?: React.CSSProperties;
}> = ({ file, size = 300, loop = false, playbackRate = 1, style }) => {
  const [handle] = useState(() => delayRender(`Lottie ${file}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle, file]);

  if (!data) return null;

  return (
    <div style={{ width: size, height: size, ...style }}>
      <Lottie animationData={data} loop={loop} playbackRate={playbackRate} />
    </div>
  );
};
