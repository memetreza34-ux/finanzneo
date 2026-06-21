// FinanzNeo PREMIUM-Upgrade: FNPortfolioGlobe als ECHTE 3D-Kugel (three.js / R3F).
// Vorher: flache 2D-SVG-Punktwolke. Jetzt: rotierende 3D-Sphere mit Tiefe, Glow-Kern, Atmosphäre.
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {C, bebas, AuroraBG} from './fn_core';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Fibonacci-Sphere: gleichmäßig verteilte Punkte. Solide Punkte + Tiefentest
// → hintere Punkte werden vom Kern verdeckt = echte 3D-Kugel statt Ring.
const PointsSphere: React.FC<{n?: number; radius?: number}> = ({n = 2400, radius = 1}) => {
  const {positions, colors} = useMemo(() => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const green = new THREE.Color(C.greenLt);
    const gold = new THREE.Color(C.gold);
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.399963; // goldener Winkel
      pos[i * 3] = Math.cos(th) * r * radius;
      pos[i * 3 + 1] = y * radius;
      pos[i * 3 + 2] = Math.sin(th) * r * radius;
      const c = i % 6 === 0 ? gold : green; // ~17% Gold-Akzente
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return {positions: pos, colors: col};
  }, [n, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.034} vertexColors sizeAttenuation transparent opacity={0.98} />
    </points>
  );
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [0, 36], [0.55, 1], {...CL, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <group scale={grow}>
      <group rotation={[0.35, f * 0.012, 0]}>
        {/* dunkler, undurchsichtiger Kern: verdeckt hintere Punkte/Gitter */}
        <mesh>
          <sphereGeometry args={[0.965, 64, 64]} />
          <meshBasicMaterial color={'#04160C'} />
        </mesh>
        {/* feines Längen-/Breitengrad-Gitter → liest sofort als Globus */}
        <mesh>
          <sphereGeometry args={[0.985, 36, 24]} />
          <meshBasicMaterial color={C.green} wireframe transparent opacity={0.10} />
        </mesh>
        <PointsSphere />
      </group>
      {/* Innen-Glow + Atmosphäre (rotieren nicht mit) */}
      <mesh>
        <sphereGeometry args={[0.99, 48, 48]} />
        <meshBasicMaterial color={C.green} transparent opacity={0.10} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={1.22}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={C.green} transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export const FNGlobe3D: React.FC<{caption?: string}> = ({caption = 'weltweit gestreut · 1.000+ Firmen'}) => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AuroraBG />
      {/* weicher Glow hinter der Kugel */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, ${C.green}22, transparent 42%)`}} />
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 3.15], fov: 45}}
        style={{position: 'absolute'}}>
        <Scene />
      </ThreeCanvas>
      <div style={{position: 'absolute', bottom: 110, width: '100%', textAlign: 'center',
        fontFamily: bebas, fontSize: 76, letterSpacing: 1, color: C.ink,
        opacity: interpolate(f, [40, 58], [0, 1], CL), filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.6))'}}>
        {caption}
      </div>
    </AbsoluteFill>
  );
};
