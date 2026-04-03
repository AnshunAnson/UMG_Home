'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { 
  Environment,
  PerspectiveCamera,
  Float,
  Trail,
  Sphere,
  Box
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';

extend({ UnrealBloomPass });

interface Particle3DSceneV2Props {
  isActive?: boolean;
}

// 粒子爆发效果
function ParticleExplosion({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 2000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  const colorPalette = useMemo(() => [
    new THREE.Color('#00ffff'),
    new THREE.Color('#ff00ff'),
    new THREE.Color('#ffff00'),
    new THREE.Color('#00ff88'),
    new THREE.Color('#ff6600'),
  ], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const speedMultiplier = isActive ? 3 : 1;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      
      t = particle.t += speed * speedMultiplier;
      
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(0.1, Math.cos(t) * 2);

      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      dummy.scale.set(s, s, s);
      dummy.rotation.set(t * 2, t * 2, t);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, colorPalette[i % colorPalette.length]);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.5}
        roughness={0.4}
        metalness={0.8}
      />
    </instancedMesh>
  );
}

// 核心发光球体
function CoreSphere({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
      meshRef.current.rotation.y = time;
      meshRef.current.rotation.z = time * 0.5;
    }
    
    if (lightRef.current) {
      lightRef.current.intensity = isActive ? 3 + Math.sin(time * 3) : 2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 4]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color="#00ffff"
        intensity={2}
        distance={10}
        decay={2}
      />
    </group>
  );
}

// 轨道环
function OrbitRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {[2, 3, 4].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={['#00ffff', '#ff00ff', '#ffff00'][i]}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// 浮动几何体
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const shapes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: 0.2 + Math.random() * 0.3,
      color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'][i % 4],
      type: i % 3,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={2 + Math.random()}
          rotationIntensity={2}
          floatIntensity={2}
        >
          <mesh position={shape.position} rotation={shape.rotation} scale={shape.scale}>
            {shape.type === 0 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <boxGeometry args={[1, 1, 1]} />}
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Particle3DSceneV2({ isActive = false }: Particle3DSceneV2Props) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={60} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
        <pointLight position={[10, -10, -10]} color="#00ffff" intensity={0.5} />

        {/* Environment */}
        <Environment preset="night" background={false} />

        {/* Scene Content */}
        <CoreSphere isActive={isActive} />
        <ParticleExplosion isActive={isActive} />
        <OrbitRings />
        <FloatingShapes />

        {/* Post Processing */}
        <EffectComposer>
          <Bloom
            intensity={2}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.025}
          />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
