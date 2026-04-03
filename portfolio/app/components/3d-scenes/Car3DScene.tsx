'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Car3DSceneProps {
  isActive?: boolean;
  scrollProgress?: number;
}

// 汽车组件
function Car({ isActive }: { isActive: boolean }) {
  const carRef = useRef<THREE.Group>(null);
  const speed = isActive ? 0.02 : 0.005;

  useFrame((_, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += speed;
    }
  });

  // 使用 useMemo 优化材质和几何体的创建
  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ 
      color: '#3b82f6', 
      metalness: 0.6, 
      roughness: 0.3 
    }),
    glass: new THREE.MeshStandardMaterial({ 
      color: '#1e3a5f', 
      metalness: 0.9, 
      roughness: 0.1,
      transparent: true,
      opacity: 0.8
    }),
    wheel: new THREE.MeshStandardMaterial({ 
      color: '#1f2937', 
      metalness: 0.3, 
      roughness: 0.8 
    }),
    rim: new THREE.MeshStandardMaterial({ 
      color: '#9ca3af', 
      metalness: 0.8, 
      roughness: 0.2 
    }),
    light: new THREE.MeshStandardMaterial({ 
      color: '#fef3c7', 
      emissive: '#fbbf24',
      emissiveIntensity: 0.5
    }),
    tailLight: new THREE.MeshStandardMaterial({ 
      color: '#dc2626', 
      emissive: '#991b1b',
      emissiveIntensity: 0.5
    })
  }), []);

  return (
    <group ref={carRef}>
      {/* 车身底盘 */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.4, 4.5]} />
        <primitive object={materials.body} attach="material" />
      </mesh>

      {/* 车顶/座舱 */}
      <mesh position={[0, 0.9, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 2.5]} />
        <primitive object={materials.body} attach="material" />
      </mesh>

      {/* 挡风玻璃 */}
      <mesh position={[0, 0.9, 1.05]} castShadow>
        <boxGeometry args={[1.7, 0.5, 0.05]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* 后窗 */}
      <mesh position={[0, 0.9, -1.45]} castShadow>
        <boxGeometry args={[1.7, 0.5, 0.05]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* 侧窗 - 左 */}
      <mesh position={[-0.9, 0.9, -0.2]} castShadow>
        <boxGeometry args={[0.05, 0.45, 2]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* 侧窗 - 右 */}
      <mesh position={[0.9, 0.9, -0.2]} castShadow>
        <boxGeometry args={[0.05, 0.45, 2]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* 前大灯 - 左 */}
      <mesh position={[-0.7, 0.4, 2.26]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.1]} />
        <primitive object={materials.light} attach="material" />
      </mesh>

      {/* 前大灯 - 右 */}
      <mesh position={[0.7, 0.4, 2.26]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.1]} />
        <primitive object={materials.light} attach="material" />
      </mesh>

      {/* 尾灯 - 左 */}
      <mesh position={[-0.7, 0.45, -2.26]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <primitive object={materials.tailLight} attach="material" />
      </mesh>

      {/* 尾灯 - 右 */}
      <mesh position={[0.7, 0.45, -2.26]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <primitive object={materials.tailLight} attach="material" />
      </mesh>

      {/* 车轮 - 左前 */}
      <group position={[-1.1, 0, 1.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <primitive object={materials.wheel} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          <primitive object={materials.rim} attach="material" />
        </mesh>
      </group>

      {/* 车轮 - 右前 */}
      <group position={[1.1, 0, 1.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <primitive object={materials.wheel} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          <primitive object={materials.rim} attach="material" />
        </mesh>
      </group>

      {/* 车轮 - 左后 */}
      <group position={[-1.1, 0, -1.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <primitive object={materials.wheel} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          <primitive object={materials.rim} attach="material" />
        </mesh>
      </group>

      {/* 车轮 - 右后 */}
      <group position={[1.1, 0, -1.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <primitive object={materials.wheel} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          <primitive object={materials.rim} attach="material" />
        </mesh>
      </group>

      {/* 格栅 */}
      <mesh position={[0, 0.3, 2.26]} castShadow>
        <boxGeometry args={[1.2, 0.3, 0.05]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.7} />
      </mesh>
    </group>
  );
}

// 仪表盘组件
function Dashboard({ isActive }: { isActive: boolean }) {
  const speedometerRef = useRef<THREE.Group>(null);
  const tachometerRef = useRef<THREE.Group>(null);
  const speedNeedleRef = useRef<THREE.Mesh>(null);
  const rpmNeedleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = isActive ? 3 : 1;
    
    // 速度表指针摆动
    if (speedNeedleRef.current) {
      const speedAngle = Math.sin(time * speed) * 0.8 - 0.8;
      speedNeedleRef.current.rotation.z = speedAngle;
    }
    
    // 转速表指针摆动
    if (rpmNeedleRef.current) {
      const rpmAngle = Math.sin(time * speed * 1.5 + 1) * 1.2 - 1.2;
      rpmNeedleRef.current.rotation.z = rpmAngle;
    }
  });

  const gaugeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#0f172a', 
    metalness: 0.8, 
    roughness: 0.2 
  }), []);

  const needleMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ef4444', 
    emissive: '#dc2626',
    emissiveIntensity: 0.3
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#64748b', 
    metalness: 0.9, 
    roughness: 0.1 
  }), []);

  return (
    <group position={[0, 2.5, 0]}>
      {/* 速度表 */}
      <group ref={speedometerRef} position={[-1.2, 0, 0]}>
        {/* 表盘 */}
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />
          <primitive object={gaugeMaterial} attach="material" />
        </mesh>
        {/* 表圈 */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <torusGeometry args={[0.6, 0.05, 16, 64]} />
          <primitive object={rimMaterial} attach="material" />
        </mesh>
        {/* 指针 */}
        <mesh ref={speedNeedleRef} position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <primitive object={needleMaterial} attach="material" />
        </mesh>
        {/* 中心点 */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <primitive object={rimMaterial} attach="material" />
        </mesh>
      </group>

      {/* 转速表 */}
      <group ref={tachometerRef} position={[1.2, 0, 0]}>
        {/* 表盘 */}
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />
          <primitive object={gaugeMaterial} attach="material" />
        </mesh>
        {/* 表圈 */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <torusGeometry args={[0.6, 0.05, 16, 64]} />
          <primitive object={rimMaterial} attach="material" />
        </mesh>
        {/* 指针 */}
        <mesh ref={rpmNeedleRef} position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <primitive object={needleMaterial} attach="material" />
        </mesh>
        {/* 中心点 */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <primitive object={rimMaterial} attach="material" />
        </mesh>
      </group>

      {/* 仪表盘底座 */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

// 环境光照组件
function Lighting() {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* 主方向光 */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* 补光 - 蓝色调 */}
      <pointLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#60a5fa"
        distance={20}
        decay={2}
      />
      
      {/* 补光 - 暖色调 */}
      <pointLight
        position={[5, 2, -5]}
        intensity={0.3}
        color="#fbbf24"
        distance={15}
        decay={2}
      />
    </>
  );
}

// 场景组件
function Scene({ isActive, scrollProgress }: { isActive: boolean; scrollProgress?: number }) {
  // 根据 isActive 和 scrollProgress 调整相机位置
  const baseCameraZ = isActive ? 6 : 9;
  const baseCameraY = isActive ? 3 : 4;
  const cameraZ = baseCameraZ - (scrollProgress || 0) * 2;
  const cameraY = baseCameraY + (scrollProgress || 0) * 1;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, cameraY, cameraZ]}
        fov={50}
        near={0.1}
        far={100}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
      <Lighting />
      <Car isActive={isActive} />
      <Dashboard isActive={isActive} />
    </>
  );
}

export default function Car3DScene({ isActive = false, scrollProgress = 0 }: Car3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows
        dpr={[1, 2]} // 响应式像素比
        camera={{ position: [0, 4, 9], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene isActive={isActive} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
