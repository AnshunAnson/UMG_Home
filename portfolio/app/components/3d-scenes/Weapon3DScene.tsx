'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Ring } from '@react-three/drei';
import * as THREE from 'three';

interface Weapon3DSceneProps {
  isActive?: boolean;
}

// 弹壳组件
interface ShellCasingProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  onComplete: () => void;
}

function ShellCasing({ position, rotation, velocity, onComplete }: ShellCasingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [life, setLife] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    setLife((prev) => prev + delta);

    // 物理模拟
    meshRef.current.position.add(velocity.clone().multiplyScalar(delta));
    velocity.y -= 9.8 * delta; // 重力
    velocity.multiplyScalar(0.98); // 空气阻力

    // 旋转
    meshRef.current.rotation.x += delta * 10;
    meshRef.current.rotation.z += delta * 5;

    // 地面碰撞
    if (meshRef.current.position.y < -1.5) {
      meshRef.current.position.y = -1.5;
      velocity.y *= -0.3;
      velocity.x *= 0.8;
      velocity.z *= 0.8;
    }

    // 淡出
    if (life > 1.5) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = Math.max(0, 1 - (life - 1.5) * 2);
    }

    // 生命周期结束
    if (life > 2) {
      onComplete();
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} transparent />
    </mesh>
  );
}

// 枪口闪光组件
interface MuzzleFlashProps {
  visible: boolean;
}

function MuzzleFlash({ visible }: MuzzleFlashProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [flashScale, setFlashScale] = useState(1);

  useFrame(() => {
    if (visible && groupRef.current) {
      // 随机缩放模拟闪烁
      setFlashScale(0.8 + Math.random() * 0.4);
      groupRef.current.rotation.z = Math.random() * Math.PI * 2;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0.15, 1.2]} scale={[flashScale, flashScale, flashScale]}>
      {/* 主闪光 */}
      <mesh>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshBasicMaterial color="#FFFF80" transparent opacity={0.9} />
      </mesh>
      {/* 外层光晕 */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="#FFAA00" transparent opacity={0.5} />
      </mesh>
      {/* 火花粒子 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            0.2 + Math.random() * 0.2,
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.02, 4, 4]} />
          <meshBasicMaterial color="#FF6600" />
        </mesh>
      ))}
    </group>
  );
}

// 准星组件
function Crosshair() {
  return (
    <group position={[0, 0, -2]}>
      {/* 中心点 */}
      <mesh>
        <ringGeometry args={[0.008, 0.012, 32]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.8} />
      </mesh>
      {/* 十字线 */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.04, 0.003, 0.001]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.04, 0, 0]}>
        <boxGeometry args={[0.04, 0.003, 0.001]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.003, 0.04, 0.001]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.003, 0.04, 0.001]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// 武器模型组件
function Weapon({ isActive }: { isActive: boolean }) {
  const weaponGroupRef = useRef<THREE.Group>(null);
  const [recoilOffset, setRecoilOffset] = useState(0);
  const [recoilRotation, setRecoilRotation] = useState(0);
  const [shellCasings, setShellCasings] = useState<
    Array<{
      id: number;
      position: THREE.Vector3;
      rotation: THREE.Euler;
      velocity: THREE.Vector3;
    }>
  >([]);
  const [muzzleFlashVisible, setMuzzleFlashVisible] = useState(false);
  const lastShotTime = useRef(0);
  const shellIdCounter = useRef(0);
  const { viewport } = useThree();

  // 鼠标位置追踪
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!weaponGroupRef.current) return;

    // 基础位置
    const basePosition = new THREE.Vector3(0.3, -0.4, 0);
    const baseRotation = new THREE.Euler(0, 0, 0);

    if (isActive) {
      // 跟随鼠标轻微移动
      const targetX = basePosition.x + mouseRef.current.x * 0.15;
      const targetY = basePosition.y + mouseRef.current.y * 0.1;
      const targetRotX = -mouseRef.current.y * 0.1;
      const targetRotY = mouseRef.current.x * 0.1;

      weaponGroupRef.current.position.x = THREE.MathUtils.lerp(
        weaponGroupRef.current.position.x,
        targetX - recoilOffset * 0.3,
        delta * 5
      );
      weaponGroupRef.current.position.y = THREE.MathUtils.lerp(
        weaponGroupRef.current.position.y,
        targetY,
        delta * 5
      );
      weaponGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        weaponGroupRef.current.rotation.x,
        baseRotation.x + targetRotX + recoilRotation,
        delta * 10
      );
      weaponGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        weaponGroupRef.current.rotation.y,
        baseRotation.y + targetRotY,
        delta * 5
      );

      // 模拟射击
      const now = state.clock.elapsedTime;
      if (now - lastShotTime.current > 0.15) {
        // 射击间隔 150ms
        lastShotTime.current = now;

        // 触发后坐力
        setRecoilOffset(0.15);
        setRecoilRotation(-0.15);

        // 显示枪口闪光
        setMuzzleFlashVisible(true);
        setTimeout(() => setMuzzleFlashVisible(false), 50);

        // 生成弹壳
        const newShell = {
          id: shellIdCounter.current++,
          position: new THREE.Vector3(0.2, 0.1, 0.3),
          rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
          velocity: new THREE.Vector3(
            0.5 + Math.random() * 0.3,
            0.8 + Math.random() * 0.4,
            -0.2 + Math.random() * 0.2
          ),
        };
        setShellCasings((prev) => [...prev.slice(-10), newShell]);
      }
    } else {
      // 非活跃状态，回到默认位置
      weaponGroupRef.current.position.lerp(basePosition, delta * 3);
      weaponGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        weaponGroupRef.current.rotation.x,
        baseRotation.x,
        delta * 3
      );
      weaponGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        weaponGroupRef.current.rotation.y,
        baseRotation.y,
        delta * 3
      );
      setMuzzleFlashVisible(false);
    }

    // 后坐力恢复
    setRecoilOffset((prev) => Math.max(0, prev - delta * 3));
    setRecoilRotation((prev) => Math.max(0, prev - delta * 5));
  });

  const removeShell = (id: number) => {
    setShellCasings((prev) => prev.filter((shell) => shell.id !== id));
  };

  return (
    <>
      <group ref={weaponGroupRef} position={[0.3, -0.4, 0]}>
        {/* 枪身主体 */}
        <Box args={[0.12, 0.25, 0.8]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#2A2A2A" metalness={0.7} roughness={0.4} />
        </Box>

        {/* 枪管 */}
        <Box args={[0.06, 0.08, 0.5]} position={[0, 0.15, 0.6]}>
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </Box>

        {/* 握把 */}
        <Box
          args={[0.1, 0.3, 0.15]}
          position={[0, -0.1, -0.2]}
          rotation={[-0.3, 0, 0]}
        >
          <meshStandardMaterial color="#3D2817" metalness={0.1} roughness={0.9} />
        </Box>

        {/* 弹匣 */}
        <Box
          args={[0.08, 0.35, 0.12]}
          position={[0, -0.15, 0.05]}
          rotation={[-0.1, 0, 0]}
        >
          <meshStandardMaterial color="#1A1A1A" metalness={0.6} roughness={0.5} />
        </Box>

        {/* 枪托 */}
        <Box args={[0.1, 0.2, 0.4]} position={[0, 0.05, -0.5]}>
          <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.6} />
        </Box>

        {/* 瞄准镜 */}
        <Box args={[0.05, 0.08, 0.25]} position={[0, 0.32, 0.1]}>
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
        </Box>
        <Cylinder
          args={[0.03, 0.03, 0.06, 16]}
          position={[0, 0.32, 0.22]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </Cylinder>

        {/* 扳机护圈 */}
        <Box args={[0.08, 0.02, 0.12]} position={[0, -0.05, -0.15]}>
          <meshStandardMaterial color="#1A1A1A" metalness={0.6} roughness={0.5} />
        </Box>

        {/* 抛壳窗 */}
        <Box args={[0.06, 0.04, 0.15]} position={[0.07, 0.15, 0]}>
          <meshStandardMaterial color="#0A0A0A" metalness={0.5} roughness={0.8} />
        </Box>

        {/* 枪口装置 */}
        <Cylinder
          args={[0.04, 0.04, 0.1, 16]}
          position={[0, 0.15, 0.85]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </Cylinder>

        {/* 枪口闪光 */}
        <MuzzleFlash visible={muzzleFlashVisible} />
      </group>

      {/* 弹壳 */}
      {shellCasings.map((shell) => (
        <ShellCasing
          key={shell.id}
          position={shell.position.clone().add(new THREE.Vector3(0.3, -0.4, 0))}
          rotation={shell.rotation}
          velocity={shell.velocity}
          onComplete={() => removeShell(shell.id)}
        />
      ))}
    </>
  );
}

// 场景灯光
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4080FF" />
      <pointLight position={[5, -3, 5]} intensity={0.3} color="#FF8040" />
    </>
  );
}

// 主场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <SceneLighting />
      <Weapon isActive={isActive} />
      <Crosshair />
    </>
  );
}

export default function Weapon3DScene({ isActive = false }: Weapon3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Scene isActive={isActive} />
      </Canvas>
    </div>
  );
}
