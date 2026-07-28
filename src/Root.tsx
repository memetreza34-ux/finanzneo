import React from 'react';
import {ProductionCompositions} from './root/ProductionCompositions';
import {ExperimentCompositions} from './root/ExperimentCompositions';
import {ShowcaseCompositions} from './root/ShowcaseCompositions';

/**
 * Zentrale Remotion-Registry.
 *
 * Neue Compositions werden nicht mehr direkt hier eingetragen, sondern genau
 * einem Bereich zugeordnet:
 * - Production: veröffentlichbare Videos und exportierbare Kanal-Assets
 * - Experiments: Stiltests, Prototypen und nicht freigegebene Entwürfe
 * - Showcases: interne Baukasten- und Komponentenübersichten
 */
export const RemotionRoot: React.FC = () => (
  <>
    <ProductionCompositions />
    <ExperimentCompositions />
    <ShowcaseCompositions />
  </>
);
