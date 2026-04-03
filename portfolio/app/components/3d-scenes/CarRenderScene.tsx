"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Float,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface CarRenderSceneProps {
  isActive: boolean;
}

// 简化的汽车模型组件
function CarModel({ isActive }: { isActive: boolean }) {
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // 车身材质 - 金属青绿色
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#00d4aa"),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
      }),
    []
  );

  // 玻璃材质
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#1a1a2e"),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.6,
        transparent: true,
        thickness: 0.5,
      }),
    []
  );

  // 轮胎材质
  const tireMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1a"),
        metalness: 0.1,
        roughness: 0.9,
      }),
    []
  );

  // 轮毂材质
  const rimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c0c0c0"),
        metalness: 0.95,
        roughness: 0.1,
      }),
    []
  );

  // 灯光材质
  const lightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 2,
      }),
    []
  );

  // 尾灯材质
  const tailLightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff0000"),
        emissive: new THREE.Color("#ff0000"),
        emissiveIntensity: 1.5,
      }),
    []
  );

  useFrame((state) => {
    if (!isActive || !carRef.current) return;

    // 整体旋转展示
    carRef.current.rotation.y = state.clock.elapsedTime * 0.3;

    // 轻微的上下浮动
    carRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <group ref={carRef}>
      {/* 车身主体 */}
      <mesh material={bodyMaterial} position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 1.8]} />
      </mesh>

      {/* 车顶 */}
      <mesh material={bodyMaterial} position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.2, 0.6, 1.4]} />
      </mesh>

      {/* 前挡风玻璃 */}
      <mesh material={glassMaterial} position={[1.1, 1.0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.5, 1.3]} />
      </mesh>

      {/* 后挡风玻璃 */}
      <mesh material={glassMaterial} position={[-1.1, 1.0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.5, 1.3]} />
      </mesh>

      {/* 侧窗 - 左 */}
      <mesh material={glassMaterial} position={[0, 1.0, 0.71]}>
        <boxGeometry args={[1.8, 0.4, 0.05]} />
      </mesh>

      {/* 侧窗 - 右 */}
      <mesh material={glassMaterial} position={[0, 1.0, -0.71]}>
        <boxGeometry args={[1.8, 0.4, 0.05]} />
      </mesh>

      {/* 前大灯 - 左 */}
      <mesh material={lightMaterial} position={[2.01, 0.6, 0.5]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
      </mesh>

      {/* 前大灯 - 右 */}
      <mesh material={lightMaterial} position={[2.01, 0.6, -0.5]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
      </mesh>

      {/* 尾灯 - 左 */}
      <mesh material={tailLightMaterial} position={[-2.01, 0.6, 0.5]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
      </mesh>

      {/* 尾灯 - 右 */}
      <mesh material={tailLightMaterial} position={[-2.01, 0.6, -0.5]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
      </mesh>

      {/* 车轮组 */}
      <group ref={wheelsRef}>
        {/* 前轮 - 左 */}
        <group position={[1.3, 0.35, 0.9]}>
          <mesh material={tireMaterial} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
          <mesh material={rimMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          </mesh>
        </group>

        {/* 前轮 - 右 */}
        <group position={[1.3, 0.35, -0.9]}>
          <mesh material={tireMaterial} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
          <mesh material={rimMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          </mesh>
        </group>

        {/* 后轮 - 左 */}
        <group position={[-1.3, 0.35, 0.9]}>
          <mesh material={tireMaterial} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
          <mesh material={rimMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          </mesh>
        </group>

        {/* 后轮 - 右 */}
        <group position={[-1.3, 0.35, -0.9]}>
          <mesh material={tireMaterial} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
          <mesh material={rimMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          </mesh>
        </group>
      </group>

      {/* 进气格栅 */}
      <mesh position={[2.02, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.3, 1.2]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* 装饰线条 */}
      <mesh position={[0, 0.65, 0.91]}>
        <boxGeometry args={[3.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.65, -0.91]}>
        <boxGeometry args={[3.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// 地面反射
function Ground() {
  return (
    <ContactShadows
      position={[0, 0, 0]}
      opacity={0.4}
      scale={15}
      blur={2.5}
      far={5}
    />
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={45} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00d4aa" />
      
      <Float
        speed={1}
        rotationIntensity={0.1}
        floatIntensity={0.2}
      >
        <CarModel isActive={isActive} />
      </Float>
      
      <Ground />
      
      <Environment preset="city" />
      
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </>
  );
}

export default function CarRenderScene({ isActive }: CarRenderSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#0a0a0f" }}
      >
        <Scene isActive={isActive} />
      </Canvas>
    </div>
  );
}
