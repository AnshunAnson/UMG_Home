'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

interface SceneContainerProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  showStars?: boolean;
  showEnvironment?: boolean;
  bloomIntensity?: number;
  backgroundColor?: string;
}

export default function SceneContainer({
  children,
  cameraPosition = [0, 0, 5],
  cameraFov = 45,
  showStars = true,
  showEnvironment = true,
  bloomIntensity = 0.5,
  backgroundColor = 'transparent',
}: SceneContainerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        style={{ background: backgroundColor }}
      >
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={cameraFov}
          near={0.1}
          far={1000}
        />

        {/* Environment */}
        {showEnvironment && (
          <Environment
            preset="city"
            background={false}
          />
        )}

        {/* Stars Background */}
        {showStars && (
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
        )}

        {/* Main Scene Content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>

        {/* Post Processing Effects */}
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.025}
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
