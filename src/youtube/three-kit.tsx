// Echtes 3D für YouTube-Animationen.
//
// Die Motion-Szenen bestanden bisher aus CSS-Divs mit Farbverläufen. Neben den
// Flow-Bildern, die aus einem 3D-Renderer kommen, wirkt das flach — eine Münze
// war eine Ellipse mit Verlauf, kein Körper. three, @remotion/three und
// @react-three/fiber liegen seit jeher im Projekt und wurden nie benutzt.
//
// Dieses Modul kapselt die beiden Entscheidungen, an denen selbstgebautes 3D
// sonst scheitert: Licht und Material. Eine Animation soll `<ThreeStage>` und
// einen Körper daraus benutzen, nicht jedes Mal ein eigenes Lichtsetup erfinden.
//
// WICHTIG: Der Render braucht `--gl=angle`. Ohne den Flag bricht WebGL im
// Headless-Chromium ab. `youtube:render` setzt ihn; bei einem Einzelaufruf von
// `npx remotion render` muss er mit angegeben werden.

import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';

/**
 * Materialwerte, die ohne Environment-Map funktionieren.
 *
 * Ein metallisches Material ist ein Spiegel. Ohne Umgebung spiegelt es Schwarz
 * und wird dunkel: bei `metalness: 0.9` kam eine braune Scheibe heraus. Ein
 * mittlerer Metallanteil plus leichtes Eigenleuchten hält die Form lesbar, ohne
 * dass HDRIs geladen werden müssen — das wäre eine externe Abhängigkeit.
 *
 * Gemessen an vier Varianten nebeneinander; diese Werte hatten die klarste Kante.
 */
export const THREE_MATERIALS = {
  gold: {color: '#E8B93A', metalness: 0.55, roughness: 0.3, emissive: '#7A5610', emissiveIntensity: 0.35},
  paper: {color: '#F4F1E8', metalness: 0.05, roughness: 0.72, emissive: '#2A2620', emissiveIntensity: 0.18},
  green: {color: '#2FBE77', metalness: 0.3, roughness: 0.38, emissive: '#073A24', emissiveIntensity: 0.3},
  steel: {color: '#C2C9CE', metalness: 0.45, roughness: 0.34, emissive: '#1A2024', emissiveIntensity: 0.22},
  warning: {color: '#E0603F', metalness: 0.32, roughness: 0.4, emissive: '#5A1A0E', emissiveIntensity: 0.32},
} as const;

export type ThreeMaterial = keyof typeof THREE_MATERIALS;

/** Setzt die Materialwerte als three-Material. */
export const Material: React.FC<{kind: ThreeMaterial}> = ({kind}) => {
  const m = THREE_MATERIALS[kind];
  return (
    <meshStandardMaterial
      color={m.color}
      metalness={m.metalness}
      roughness={m.roughness}
      emissive={m.emissive}
      emissiveIntensity={m.emissiveIntensity}
    />
  );
};

/**
 * Drei-Punkt-Licht gegen Schwarz.
 *
 * Key warm von vorn oben modelliert die Form, Fill kühl von links nimmt die
 * Schatten zurück, Rim von hinten trennt den Körper vom schwarzen Hintergrund.
 * Ohne das Rim-Licht verschwinden Kanten im Hintergrund der Bildwelt.
 */
const StudioLight: React.FC = () => (
  <>
    <ambientLight intensity={0.55} />
    <directionalLight position={[6, 8, 7]} intensity={3.6} color="#FFF3D2" castShadow />
    <directionalLight position={[-7, 2, 4]} intensity={1.3} color="#BFD8FF" />
    <directionalLight position={[0, 3, -6]} intensity={2.6} color="#FFE7A8" />
  </>
);

/**
 * 3D-Bühne für eine Animationsszene.
 *
 * Der Hintergrund bleibt transparent — der schwarze Reel-Hintergrund liegt
 * darunter und ist die einzige Hintergrundfläche, die die Bildwelt erlaubt.
 */
export const ThreeStage: React.FC<{
  children: React.ReactNode;
  cameraY?: number;
  cameraZ?: number;
  fov?: number;
}> = ({children, cameraY = 0.6, cameraZ = 11, fov = 38}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} camera={{fov, position: [0, cameraY, cameraZ]}}>
        <StudioLight />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** Münze als echter Körper mit sichtbarer Kante. */
export const Coin3D: React.FC<{
  position: [number, number, number];
  spin?: number;
  tilt?: number;
  radius?: number;
  material?: ThreeMaterial;
}> = ({position, spin = 0, tilt = 0.95, radius = 1.25, material = 'gold'}) => (
  <mesh position={position} rotation={[tilt, spin, 0.2]} castShadow receiveShadow>
    <cylinderGeometry args={[radius, radius, radius * 0.21, 72]} />
    <Material kind={material} />
  </mesh>
);

/** Aufeinanderliegende Münzen; `count` ist die sichtbare Höhe des Stapels. */
export const CoinStack3D: React.FC<{
  position: [number, number, number];
  count: number;
  radius?: number;
  material?: ThreeMaterial;
}> = ({position, count, radius = 1.25, material = 'gold'}) => {
  const visible = Math.max(0, Math.round(count));
  const thickness = radius * 0.21;
  return (
    <group position={position}>
      {Array.from({length: visible}, (_, index) => (
        <mesh key={index} position={[0, index * thickness * 1.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, thickness, 72]} />
          <Material kind={material} />
        </mesh>
      ))}
    </group>
  );
};

/** Quader für Dokumente, Policen, Belege und Behälter. */
export const Slab3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  material?: ThreeMaterial;
}> = ({position, size, rotation = [0, 0, 0], material = 'paper'}) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    <Material kind={material} />
  </mesh>
);

/** Offener Behälter aus vier Wänden und einem Boden, mit sichtbarem Füllstand. */
export const Tank3D: React.FC<{
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  fill: number;
  material?: ThreeMaterial;
  fillMaterial?: ThreeMaterial;
}> = ({position, width = 3, height = 4, depth = 1.6, fill, material = 'steel', fillMaterial = 'green'}) => {
  const clamped = Math.max(0, Math.min(1, fill));
  const wall = 0.12;
  const fillHeight = Math.max(0.001, clamped * (height - wall * 2));
  return (
    <group position={position}>
      <mesh position={[0, -height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, wall, depth]} />
        <Material kind={material} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[wall, height, depth]} />
        <Material kind={material} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[wall, height, depth]} />
        <Material kind={material} />
      </mesh>
      <mesh position={[0, 0, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wall]} />
        <Material kind={material} />
      </mesh>
      {clamped > 0 ? (
        <mesh position={[0, -height / 2 + wall / 2 + fillHeight / 2, 0]} castShadow>
          <boxGeometry args={[width - wall * 2, fillHeight, depth - wall * 2]} />
          <Material kind={fillMaterial} />
        </mesh>
      ) : null}
    </group>
  );
};
