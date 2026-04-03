"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Float,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface UMGSceneProps {
  isActive: boolean;
}

// UI面板组件
function UIPanel({
  position,
  size,
  color,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isActive: boolean;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 自定义着色器材质
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          
          void main() {
            // 渐变背景
            float gradient = smoothstep(0.0, 1.0, vUv.y);
            vec3 baseColor = mix(uColor * 0.15, uColor * 0.25, gradient);
            
            // 边框发光
            float borderX = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x);
            float borderY = smoothstep(0.0, 0.03, vUv.y) * smoothstep(1.0, 0.97, vUv.y);
            float border = borderX * borderY;
            
            vec3 borderColor = uColor * (1.0 - border) * 2.5;
            
            // 扫描线
            float scanLine = smoothstep(0.98, 1.0, sin(vUv.y * 15.0 + uTime * 2.0));
            vec3 scanColor = uColor * scanLine * 0.4;
            
            vec3 finalColor = baseColor + borderColor + scanColor;
            float alpha = 0.8 + scanLine * 0.1;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={size}
      radius={0.04}
      smoothness={4}
      position={position}
    >
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </RoundedBox>
  );
}

// 按钮组件
function UIButton({
  position,
  label,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  label: string;
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;
    
    // 脉冲效果
    const scale = 1 + Math.sin(time * 2) * 0.02;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 按钮背景 */}
      <RoundedBox args={[0.7, 0.2, 0.03]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* 按钮文字 */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// 进度条组件
function ProgressBar({
  position,
  progress,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  progress: number;
  isActive: boolean;
  delay?: number;
}) {
  const barRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!fillRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;
    // 动态进度变化
    const dynamicProgress = (progress + Math.sin(time) * 0.1 + 1) / 2;
    fillRef.current.scale.x = Math.max(0.01, dynamicProgress);
    fillRef.current.position.x = -0.4 + (dynamicProgress * 0.8) / 2;
  });

  return (
    <group position={position}>
      {/* 背景条 */}
      <RoundedBox args={[0.9, 0.08, 0.02]} radius={0.02} smoothness={4}>
        <meshStandardMaterial color="#2a2a3a" />
      </RoundedBox>
      
      {/* 填充条 */}
      <RoundedBox
        ref={fillRef}
        args={[0.8, 0.06, 0.025]}
        radius={0.015}
        smoothness={4}
        position={[-0.4 + (progress * 0.8) / 2, 0, 0.01]}
      >
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </RoundedBox>
    </group>
  );
}

// 图标组件
function UIIcon({
  position,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;
    groupRef.current.rotation.y = time * 0.5;
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.03;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 图标背景 */}
      <RoundedBox args={[0.3, 0.3, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>
      
      {/* 图标内部 */}
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 布局网格组件
function LayoutGrid({
  position,
  isActive,
}: {
  position: [number, number, number];
  isActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;
    
    // 轻微旋转
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 水平线 */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[4, 0.01, 0.005]} />
          <meshBasicMaterial color="#e74c3c" transparent opacity={0.3} />
        </mesh>
      ))}
      
      {/* 垂直线 */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.01, 3.5, 0.005]} />
          <meshBasicMaterial color="#e74c3c" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// 层级指示器组件
function HierarchyIndicator({
  position,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;
    
    // 层级呼吸效果
    groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 父级 */}
      <RoundedBox args={[0.5, 0.15, 0.03]} radius={0.02} smoothness={4} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
      </RoundedBox>
      
      {/* 连接线 */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.01]} />
        <meshBasicMaterial color="#e74c3c" />
      </mesh>
      
      {/* 子级1 */}
      <RoundedBox args={[0.4, 0.12, 0.02]} radius={0.015} smoothness={4} position={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#c0392b" />
      </RoundedBox>
      
      {/* 子级2 */}
      <RoundedBox args={[0.4, 0.12, 0.02]} radius={0.015} smoothness={4} position={[0.3, 0, 0]}>
        <meshStandardMaterial color="#c0392b" />
      </RoundedBox>
      
      {/* 连接线 */}
      <mesh position={[-0.15, -0.12, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.01]} />
        <meshBasicMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0.15, -0.12, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.01]} />
        <meshBasicMaterial color="#e74c3c" />
      </mesh>
      
      {/* 孙级 */}
      <RoundedBox args={[0.3, 0.1, 0.015]} radius={0.01} smoothness={4} position={[-0.3, -0.25, 0]}>
        <meshStandardMaterial color="#a93226" />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.1, 0.015]} radius={0.01} smoothness={4} position={[0.3, -0.25, 0]}>
        <meshStandardMaterial color="#a93226" />
      </RoundedBox>
    </group>
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#e74c3c" />

      {/* 主画布面板 */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <UIPanel
          position={[0, 0, 0]}
          size={[3.5, 2.5, 0.08]}
          color="#e74c3c"
          isActive={isActive}
          delay={0}
        />
      </Float>

      {/* 顶部栏 */}
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.08}>
        <UIPanel
          position={[0, 1.8, 0.2]}
          size={[3.5, 0.4, 0.06]}
          color="#c0392b"
          isActive={isActive}
          delay={0.3}
        />
      </Float>

      {/* 左侧面板 */}
      <Float speed={0.9} rotationIntensity={0.06} floatIntensity={0.12}>
        <UIPanel
          position={[-2.3, 0, 0.3]}
          size={[0.8, 2.5, 0.06]}
          color="#a93226"
          isActive={isActive}
          delay={0.5}
        />
      </Float>

      {/* 右侧面板 */}
      <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.1}>
        <UIPanel
          position={[2.3, 0, 0.3]}
          size={[0.8, 2.5, 0.06]}
          color="#a93226"
          isActive={isActive}
          delay={0.7}
        />
      </Float>

      {/* 底部面板 */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.08}>
        <UIPanel
          position={[0, -1.8, 0.2]}
          size={[3.5, 0.4, 0.06]}
          color="#c0392b"
          isActive={isActive}
          delay={0.9}
        />
      </Float>

      {/* 布局网格 */}
      <LayoutGrid position={[0, 0, 0.05]} isActive={isActive} />

      {/* 按钮组 */}
      <UIButton position={[-1, -1.5, 0.3]} label="Play" isActive={isActive} delay={0} />
      <UIButton position={[0, -1.5, 0.35]} label="Pause" isActive={isActive} delay={0.3} />
      <UIButton position={[1, -1.5, 0.3]} label="Stop" isActive={isActive} delay={0.6} />

      {/* 进度条 */}
      <ProgressBar position={[0, 1.5, 0.3]} progress={0.7} isActive={isActive} delay={0} />

      {/* 图标组 */}
      <UIIcon position={[-2.3, 1.8, 0.4]} isActive={isActive} delay={0} />
      <UIIcon position={[-2.3, 1.2, 0.4]} isActive={isActive} delay={0.5} />
      <UIIcon position={[-2.3, 0.6, 0.4]} isActive={isActive} delay={1} />
      <UIIcon position={[-2.3, 0, 0.4]} isActive={isActive} delay={1.5} />

      {/* 层级指示器 */}
      <HierarchyIndicator position={[2.3, 0.5, 0.4]} isActive={isActive} delay={0} />

      <EffectComposer>
        <Bloom
          intensity={1}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </>
  );
}

export default function UMGScene({ isActive }: UMGSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#0a0a0f" }}
      >
        <Scene isActive={isActive} />
      </Canvas>
    </div>
  );
}
