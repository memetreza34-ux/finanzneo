import React from 'react';
import {Composition} from 'remotion';
import {YouTubeVideo} from '../youtube-projekt/YouTubeVideo';
import {YOUTUBE_PROJEKTE} from '../youtube-projekt/projekte.generated';

// YouTube-Longform-Projekte aus `npm run youtube:zusammenbau`. 1920 × 1080, 30 fps.
// Props bleiben JSON-fähig (nur die Projekt-ID); Zeitplan und Animationen kommen aus der Registry.
const YouTubeProjektVideo: React.FC<{projektId: string}> = ({projektId}) => {
  const projekt = YOUTUBE_PROJEKTE.find((p) => p.id === projektId);
  if (!projekt) throw new Error(`YouTube-Projekt ${projektId} ist nicht registriert — npm run youtube:zusammenbau ausführen.`);
  return <YouTubeVideo zeitplan={projekt.zeitplan} animationen={projekt.animationen} />;
};

export const YouTubeCompositions: React.FC = () => (
  <>
    {YOUTUBE_PROJEKTE.map((projekt) => (
      <Composition
        key={projekt.id}
        id={projekt.id}
        component={YouTubeProjektVideo}
        durationInFrames={projekt.zeitplan.durationFrames}
        fps={projekt.zeitplan.fps}
        width={1920}
        height={1080}
        defaultProps={{projektId: projekt.id}}
      />
    ))}
  </>
);
