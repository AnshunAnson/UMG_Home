'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, SpotLight, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Design3DSceneProps {
  isActive?: boolean;
}

// 3D汽车线框模型
function CarWireframe({ isActive }: { isActive: boolean }) {
  const carRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.MeshBasicMaterial>(null);
  const solidRef = useRef<THREE.MeshStandardMaterial>(null);

  // 汽车360度缓慢旋转
  useFrame((state, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += delta * 0.3;
    }
    
    // 悬停时线框闪烁效果
    if (wireframeRef.current && isActive) {
      const time = state.clock.elapsedTime;
      wireframeRef.current.opacity = 0.6 + Math.sin(time * 8) * 0.4;
    } else if (wireframeRef.current) {
      wireframeRef.current.opacity = 0.3;
    }
  });

  // 汽车车身几何体
  const carGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // 绘制汽车侧面轮廓
    shape.moveTo(-2, 0);
    shape.lineTo(-2, 0.6);
    shape.lineTo(-1.5, 0.8);
    shape.lineTo(-0.5, 1.2);
    shape.lineTo(0.8, 1.2);
    shape.lineTo(1.5, 0.9);
    shape.lineTo(2, 0.7);
    shape.lineTo(2.2, 0.5);
    shape.lineTo(2.2, 0.2);
    shape.lineTo(2, 0);
    shape.lineTo(1.6, 0);
    shape.lineTo(1.4, 0.4);
    shape.lineTo(0.6, 0.4);
    shape.lineTo(0.4, 0);
    shape.lineTo(-0.4, 0);
    shape.lineTo(-0.6, 0.4);
    shape.lineTo(-1.4, 0.4);
    shape.lineTo(-1.6, 0);
    shape.lineTo(-2, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // 车窗几何体
  const windowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.3, 0.85);
    shape.lineTo(-0.6, 1.1);
    shape.lineTo(0.6, 1.1);
    shape.lineTo(1.2, 0.95);
    shape.lineTo(1.1, 0.85);
    shape.lineTo(-1.2, 0.85);
    shape.lineTo(-1.3, 0.85);

    const extrudeSettings = {
      steps: 1,
      depth: 0.82,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // 车轮几何体
  const wheelGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
  }, []);

  // 轮毂几何体
  const rimGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.2, 0.2, 0.26, 16);
  }, []);

  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      {/* 汽车主体 - 线框/实体切换 */}
      <mesh geometry={carGeometry}>
        {isActive ? (
          <meshStandardMaterial
            ref={solidRef}
            color="#ff6b35"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        ) : (
          <meshBasicMaterial
            ref={wireframeRef}
            color="#ff6b35"
            wireframe
            transparent
            opacity={0.3}
          />
        )}
      </mesh>

      {/* 车窗 - 始终线框 */}
      <mesh geometry={windowGeometry} position={[0, 0, -0.01]}>
        <meshBasicMaterial color="#00a8e8" wireframe transparent opacity={0.4} />
      </mesh>

      {/* 左前轮 */}
      <mesh geometry={wheelGeometry} position={[-1, 0.35, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#333" wireframe={!isActive} />
      </mesh>
      <mesh geometry={rimGeometry} position={[-1, 0.35, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 左后轮 */}
      <mesh geometry={wheelGeometry} position={[1.2, 0.35, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#333" wireframe={!isActive} />
      </mesh>
      <mesh geometry={rimGeometry} position={[1.2, 0.35, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 右前轮 */}
      <mesh geometry={wheelGeometry} position={[-1, 0.35, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#333" wireframe={!isActive} />
      </mesh>
      <mesh geometry={rimGeometry} position={[-1, 0.35, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 右后轮 */}
      <mesh geometry={wheelGeometry} position={[1.2, 0.35, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#333" wireframe={!isActive} />
      </mesh>
      <mesh geometry={rimGeometry} position={[1.2, 0.35, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 前大灯 */}
      <mesh position={[2.1, 0.4, 0.3]}>
        <boxGeometry args={[0.1, 0.15, 0.2]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={isActive ? 2 : 0.5} />
      </mesh>
      <mesh position={[2.1, 0.4, -0.05]}>
        <boxGeometry args={[0.1, 0.15, 0.2]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={isActive ? 2 : 0.5} />
      </mesh>

      {/* 尾灯 */}
      <mesh position={[-2.05, 0.5, 0.3]}>
        <boxGeometry args={[0.1, 0.1, 0.15]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.05, 0.5, -0.05]}>
        <boxGeometry args={[0.1, 0.1, 0.15]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// 3D奖杯模型
function Trophy({ isActive }: { isActive: boolean }) {
  const trophyRef = useRef<THREE.Group>(null);

  // 奖杯旋转动画
  useFrame((state, delta) => {
    if (trophyRef.current) {
      if (isActive) {
        // 悬停时快速旋转
        trophyRef.current.rotation.y += delta * 3;
        trophyRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        // 默认缓慢旋转
        trophyRef.current.rotation.y += delta * 0.5;
        trophyRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime) * 0.05;
      }
    }
  });

  // 奖杯杯身几何体
  const cupGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = 0.3 + Math.sin(t * Math.PI) * 0.4;
      const y = t * 0.8;
      points.push(new THREE.Vector2(x, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // 奖杯底座几何体
  const baseGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.25, 0.3, 0.15, 32);
  }, []);

  // 奖杯把手几何体
  const handleGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.6, 0.5, 0),
      new THREE.Vector3(0.9, 0.6, 0),
      new THREE.Vector3(0.9, 0.3, 0),
      new THREE.Vector3(0.6, 0.2, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
  }, []);

  return (
    <group ref={trophyRef} position={[2.5, 2.5, -1]} scale={isActive ? 1.3 : 1}>
      {/* 奖杯杯身 */}
      <mesh geometry={cupGeometry} position={[0, 0.2, 0]}>
        <meshStandardMaterial
          color="#ffd700"
          metalness={1}
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </mesh>

      {/* 奖杯底座 */}
      <mesh geometry={baseGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color="#daa520" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 奖杯顶部装饰 */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>

      {/* 左把手 */}
      <mesh geometry={handleGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>

      {/* 右把手 */}
      <mesh geometry={handleGeometry} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>

      {/* 悬停时的粒子效果 */}
      {isActive && (
        <>
          <mesh position={[0.8, 0.8, 0.5]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.7, 1.2, -0.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffed4e" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.5, 1.5, 0.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}

// 设计蓝图平面
function BlueprintPlane() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // 蓝图网格轻微波动效果
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 蓝图背景平面 */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a1628" transparent opacity={0.8} />
      </mesh>

      {/* 蓝图网格 */}
      <Grid
        position={[0, -0.1, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1e3a5f"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#2a4a6f"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid
      />

      {/* 蓝图标注线 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(8, 0, 4)]} />
        <lineBasicMaterial color="#00a8e8" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// 聚光灯效果
function SpotLightEffect({ isActive }: { isActive: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame((state) => {
    if (lightRef.current && targetRef.current) {
      // 聚光灯跟随汽车旋转
      const time = state.clock.elapsedTime;
      lightRef.current.position.x = Math.sin(time * 0.3) * 5;
      lightRef.current.position.z = Math.cos(time * 0.3) * 5;
      lightRef.current.target = targetRef.current;
    }
  });

  return (
    <>
      {/* 主聚光灯 */}
      <SpotLight
        ref={lightRef}
        position={[5, 8, 5]}
        angle={Math.PI / 6}
        penumbra={0.3}
        intensity={isActive ? 200 : 100}
        color="#ff6b35"
        castShadow
        distance={20}
      />

      {/* 目标点 */}
      <object3D ref={targetRef} position={[0, 0.5, 0]} />

      {/* 辅助聚光灯 - 金色 */}
      <SpotLight
        position={[-3, 6, -3]}
        angle={Math.PI / 8}
        penumbra={0.5}
        intensity={isActive ? 150 : 80}
        color="#ffd700"
        distance={15}
      />

      {/* 环境光 */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* 补光 */}
      <pointLight position={[0, 5, 0]} intensity={50} color="#ffffff" />
    </>
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={50} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        target={[0, 0.5, 0]}
      />

      {/* 聚光灯效果 */}
      <SpotLightEffect isActive={isActive} />

      {/* 设计蓝图平面 */}
      <BlueprintPlane />

      {/* 3D汽车线框模型 */}
      <CarWireframe isActive={isActive} />

      {/* 3D奖杯模型 */}
      <Trophy isActive={isActive} />

      {/* 环境贴图 */}
      <Environment preset="city" background={false} />
    </>
  );
}

// 主组件
export default function Design3DScene({ isActive = false }: Design3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene isActive={isActive} />
      </Canvas>
    </div>
  );
}
