'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  MeshTransmissionMaterial,
  Float
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

interface Car3DSceneV2Props {
  isActive?: boolean;
}

// 高性能跑车模型
function SportsCar({ isActive }: { isActive: boolean }) {
  const carRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 车身悬浮动画
    if (carRef.current) {
      carRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      carRef.current.rotation.y = time * 0.1;
    }

    // 车轮旋转
    wheelRefs.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x = time * 2;
      }
    });
  });

  // 材质定义
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#00d4aa',
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.5,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#111',
    metalness: 0.9,
    roughness: 0.05,
    transmission: 0.2,
    transparent: true,
    opacity: 0.9,
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.4,
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c0c0c0',
    metalness: 1,
    roughness: 0.1,
  }), []);

  const lightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 2,
  }), []);

  const tailLightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff0000',
    emissive: '#ff0000',
    emissiveIntensity: 1,
  }), []);

  return (
    <group ref={carRef}>
      {/* 车身主体 - 流线型设计 */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 4.2]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* 车顶 */}
      <mesh position={[0, 1, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.5, 2]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* 前引擎盖倾斜 */}
      <mesh position={[0, 0.7, 1.8]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.3, 1.2]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* 后尾翼 */}
      <mesh position={[0, 0.9, -1.8]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.4]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.6, 0.75, -1.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      <mesh position={[0.6, 0.75, -1.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* 挡风玻璃 */}
      <mesh position={[0, 0.95, 0.9]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[1.3, 0.6, 0.05]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* 侧窗 */}
      <mesh position={[-0.71, 0.95, -0.3]}>
        <boxGeometry args={[0.05, 0.5, 1.8]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      <mesh position={[0.71, 0.95, -0.3]}>
        <boxGeometry args={[0.05, 0.5, 1.8]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* 前大灯 */}
      <mesh position={[-0.5, 0.5, 2.1]}>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <primitive object={lightMaterial} attach="material" />
      </mesh>
      <mesh position={[0.5, 0.5, 2.1]}>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <primitive object={lightMaterial} attach="material" />
      </mesh>

      {/* 尾灯 */}
      <mesh position={[-0.5, 0.6, -2.1]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <primitive object={tailLightMaterial} attach="material" />
      </mesh>
      <mesh position={[0.5, 0.6, -2.1]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <primitive object={tailLightMaterial} attach="material" />
      </mesh>

      {/* 车轮 */}
      {[
        [-0.9, 0.35, 1.3],
        [0.9, 0.35, 1.3],
        [-0.9, 0.35, -1.3],
        [0.9, 0.35, -1.3],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* 轮胎 */}
          <mesh 
            ref={(el) => { if (el) wheelRefs.current[i] = el; }}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
            <primitive object={wheelMaterial} attach="material" />
          </mesh>
          {/* 轮毂 */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.26, 16]} />
            <primitive object={rimMaterial} attach="material" />
          </mesh>
          {/* 轮毂细节 */}
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh
              key={j}
              rotation={[0, 0, Math.PI / 2 + (j * Math.PI * 2) / 5]}
            >
              <boxGeometry args={[0.04, 0.3, 0.27]} />
              <primitive object={rimMaterial} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 进气格栅 */}
      <mesh position={[0, 0.4, 2.11]}>
        <boxGeometry args={[1, 0.3, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
}

// 发光环装饰
function GlowRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial 
            color="#00d4aa" 
            transparent 
            opacity={0.3 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// 粒子轨迹
function ParticleTrails() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.83;
      colors[i * 3 + 2] = 0.67;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function Car3DSceneV2({ isActive = false }: Car3DSceneV2Props) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        camera={{ position: [5, 3, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[4, 2, 4]} fov={45} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00d4aa" />
        <spotLight
          position={[0, 10, 0]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={1}
          castShadow
        />

        {/* Environment */}
        <Environment preset="city" background={false} />

        {/* Scene Content */}
        <SportsCar isActive={isActive} />
        <GlowRings />
        <ParticleTrails />

        {/* Ground Shadow */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Post Processing */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.025}
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
