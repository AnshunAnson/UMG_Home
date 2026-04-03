'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface UI3DSceneProps {
  isActive?: boolean;
}

// 3D圆角按钮组件
function Button3D({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // 浮动动画
    const floatOffset = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.position.y = position[1] + floatOffset;
    
    // 悬停时的展开和翻转效果
    const targetScale = hovered ? 1.3 : 1;
    const targetRotationY = hovered ? Math.PI * 0.1 : 0;
    const targetRotationX = hovered ? -Math.PI * 0.05 : 0;
    
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.1);
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 0.5, 0.2]}
        radius={0.1}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.5}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={0.8}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 400]}
          color={hovered ? '#00ffff' : '#4a9eff'}
          emissive={hovered ? '#00ffff' : '#1a5fff'}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transmission={0.6}
          opacity={0.9}
          transparent
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.2}
        color={hovered ? '#ffffff' : '#e0f7ff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        点击
      </Text>
    </group>
  );
}

// 3D悬浮面板组件
function Panel3D({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // 浮动动画 - 相位偏移
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.5 + Math.PI / 3) * 0.08;
    meshRef.current.position.y = position[1] + floatOffset;
    
    // 悬停效果
    const targetScale = hovered ? 1.15 : 1;
    const targetRotationZ = hovered ? Math.PI * 0.05 : 0;
    
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08));
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotationZ, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, hovered ? -Math.PI * 0.1 : 0, 0.08);
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[2, 1.2, 0.1]}
        radius={0.08}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={hovered ? '#ff6b9d' : '#2a2a4a'}
          emissive={hovered ? '#ff4080' : '#1a1a3a'}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.85}
        />
      </RoundedBox>
      {/* 面板装饰线条 */}
      <mesh position={[-0.6, 0.3, 0.06]}>
        <boxGeometry args={[0.6, 0.05, 0.02]} />
        <meshBasicMaterial color={hovered ? '#ffffff' : '#4a9eff'} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.6, 0.1, 0.06]}>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshBasicMaterial color={hovered ? '#ffffff' : '#4a9eff'} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.6, -0.1, 0.06]}>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshBasicMaterial color={hovered ? '#ffffff' : '#4a9eff'} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// 3D进度条组件
function ProgressBar3D({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const barRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0.6);

  useFrame((state) => {
    if (!barRef.current || !fillRef.current) return;
    
    // 浮动动画
    const floatOffset = Math.sin(state.clock.elapsedTime * 2.5 + Math.PI / 1.5) * 0.06;
    barRef.current.position.y = position[1] + floatOffset;
    
    // 动态进度动画
    const newProgress = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    setProgress(newProgress);
    
    // 悬停效果
    const targetScale = hovered ? 1.2 : 1;
    barRef.current.scale.setScalar(THREE.MathUtils.lerp(barRef.current.scale.x, targetScale, 0.1));
    
    // 填充条伸缩动画
    fillRef.current.scale.x = THREE.MathUtils.lerp(fillRef.current.scale.x, newProgress, 0.1);
  });

  return (
    <group position={position} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* 背景条 */}
      <RoundedBox
        ref={barRef}
        args={[2, 0.25, 0.1]}
        radius={0.05}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </RoundedBox>
      
      {/* 填充条 */}
      <mesh ref={fillRef} position={[-1 + progress, 0, 0.06]}>
        <boxGeometry args={[2 * progress, 0.18, 0.08]} />
        <meshPhysicalMaterial
          color={hovered ? '#00ff88' : '#00cc66'}
          emissive={hovered ? '#00ff88' : '#00aa55'}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* 进度指示器 */}
      <mesh position={[-1 + progress * 2, 0, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color={hovered ? '#ffffff' : '#00ff88'}
          emissive={hovered ? '#ffffff' : '#00ff88'}
          emissiveIntensity={hovered ? 1 : 0.5}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// 3D文字效果组件
function Text3DEffect({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // 浮动动画
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.8) * 0.12;
    groupRef.current.position.y = position[1] + floatOffset;
    
    // 悬停时的3D翻转效果
    const targetRotationX = hovered ? Math.PI * 0.15 : 0;
    const targetRotationY = hovered ? Math.PI * 0.2 : 0;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);
  });

  return (
    <group ref={groupRef} position={position} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* 主文字 */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color={hovered ? '#ffffff' : '#4a9eff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        letterSpacing={0.05}
      >
        UMG
      </Text>
      
      {/* 发光层 */}
      <Text
        position={[0, 0, -0.02]}
        fontSize={0.5}
        color={hovered ? '#00ffff' : '#4a9eff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        letterSpacing={0.05}
        material-transparent
        material-opacity={hovered ? 0.6 : 0.3}
      >
        UMG
      </Text>
      
      {/* 副标题 */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.18}
        color={hovered ? '#ff6b9d' : '#a0a0c0'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        重构设计
      </Text>
    </group>
  );
}

// 装饰性浮动元素
function FloatingElements({ isActive }: { isActive: boolean }) {
  const elementsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!elementsRef.current) return;
    
    elementsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    
    elementsRef.current.children.forEach((child, index) => {
      const offset = (index * Math.PI * 2) / 8;
      child.position.y = Math.sin(state.clock.elapsedTime * 1.5 + offset) * 0.3;
    });
  });

  const positions = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.5;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number];
    });
  }, []);

  return (
    <group ref={elementsRef}>
      {positions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshPhysicalMaterial
            color={index % 2 === 0 ? '#4a9eff' : '#ff6b9d'}
            emissive={index % 2 === 0 ? '#4a9eff' : '#ff6b9d'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// 主场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      
      {/* 主光源 */}
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      
      {/* 蓝色补光 */}
      <pointLight position={[-5, 3, 3]} intensity={0.8} color="#4a9eff" />
      
      {/* 粉色补光 */}
      <pointLight position={[5, -3, 3]} intensity={0.6} color="#ff6b9d" />
      
      {/* UI元素 */}
      <Text3DEffect position={[0, 1.2, 0]} isActive={isActive} />
      <Button3D position={[-1.5, 0, 0]} isActive={isActive} />
      <Panel3D position={[1.5, 0.2, 0]} isActive={isActive} />
      <ProgressBar3D position={[0, -1.2, 0]} isActive={isActive} />
      
      {/* 装饰元素 */}
      <FloatingElements isActive={isActive} />
    </>
  );
}

// 主组件
export default function UI3DScene({ isActive = false }: UI3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene isActive={isActive} />
      </Canvas>
    </div>
  );
}
