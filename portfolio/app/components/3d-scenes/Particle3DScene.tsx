'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  isActive: boolean;
}

// 粒子系统组件
function ParticleSystem({ isActive }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const frameCountRef = useRef(0);

  // 粒子配置参数
  const config = useMemo(
    () => ({
      // 基础粒子数量
      baseCount: 800,
      // 激活状态粒子数量
      activeCount: 1500,
      // 发射半径
      emitRadius: 0.5,
      // 重力
      gravity: -0.015,
      // 基础发射速度
      baseEmitSpeed: 0.08,
      // 激活状态发射速度
      activeEmitSpeed: 0.15,
      // 粒子生命周期
      particleLife: 120,
    }),
    []
  );

  // 粒子颜色调色板 - 青色、紫色、金色
  const colorPalette = useMemo(
    () => [
      new THREE.Color(0x00ffff), // 青色
      new THREE.Color(0x8b5cf6), // 紫色
      new THREE.Color(0xffd700), // 金色
      new THREE.Color(0x00ced1), // 深青色
      new THREE.Color(0xa855f7), // 亮紫色
    ],
    []
  );

  // 初始化粒子数据
  const particleData = useMemo(() => {
    const count = config.activeCount;
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifes = new Float32Array(count);
    const maxLifes = new Float32Array(count);
    const active = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
      // 初始位置在中心
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // 随机速度方向
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * config.baseEmitSpeed + 0.02;

      velocities.push(
        new THREE.Vector3(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.cos(phi),
          speed * Math.sin(phi) * Math.sin(theta)
        )
      );

      // 随机颜色
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // 随机大小
      sizes[i] = Math.random() * 0.15 + 0.05;

      // 生命周期
      const life = Math.random() * config.particleLife;
      lifes[i] = life;
      maxLifes[i] = config.particleLife + Math.random() * 60;

      // 初始激活状态 - 只激活部分粒子
      active[i] = i < config.baseCount ? 1 : 0;
    }

    return { positions, velocities, colors, sizes, lifes, maxLifes, active };
  }, [config, colorPalette]);

  // 使用 ref 存储粒子数据以便在动画循环中更新
  const particlesRef = useRef(particleData);

  // 动画循环
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    frameCountRef.current++;
    // 每2帧更新一次，优化性能
    if (frameCountRef.current % 2 !== 0) return;

    const positions = particlesRef.current.positions;
    const velocities = particlesRef.current.velocities;
    const lifes = particlesRef.current.lifes;
    const maxLifes = particlesRef.current.maxLifes;
    const sizes = particlesRef.current.sizes;
    const active = particlesRef.current.active;

    const currentCount = isActive ? config.activeCount : config.baseCount;
    const emitSpeed = isActive ? config.activeEmitSpeed : config.baseEmitSpeed;

    for (let i = 0; i < currentCount; i++) {
      // 更新生命周期
      lifes[i] -= 1;

      // 粒子死亡或超出范围时重置
      if (lifes[i] <= 0 || positions[i * 3 + 1] < -8 || Math.abs(positions[i * 3]) > 10) {
        // 重置位置到中心附近
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * config.emitRadius;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * radius;

        // 重置速度
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.6; // 主要向上发射
        const speed = Math.random() * emitSpeed + 0.03;

        velocities[i].set(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.cos(phi) + 0.05,
          speed * Math.sin(phi) * Math.sin(theta)
        );

        // 重置生命周期
        lifes[i] = maxLifes[i];

        // 重置大小
        sizes[i] = Math.random() * (isActive ? 0.2 : 0.15) + 0.05;
      } else {
        // 应用重力
        velocities[i].y += config.gravity;

        // 添加一些扰动
        velocities[i].x += (Math.random() - 0.5) * 0.002;
        velocities[i].z += (Math.random() - 0.5) * 0.002;

        // 更新位置
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // 随生命周期缩小
        const lifeRatio = lifes[i] / maxLifes[i];
        sizes[i] *= 0.995;
      }
    }

    // 更新几何体属性
    const geometry = pointsRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;

    // 旋转整个粒子系统
    pointsRef.current.rotation.y += delta * 0.1;
  });

  // 创建自定义着色器材质实现发光效果
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(1, 1, 1) },
      },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        varying vec3 vColor;
        
        void main() {
          vAlpha = 1.0;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        
        void main() {
          // 创建圆形粒子
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // 发光效果 - 中心亮边缘暗
          float glow = 1.0 - (dist * 2.0);
          glow = pow(glow, 1.5);
          
          // 添加内部亮点
          float core = 1.0 - smoothstep(0.0, 0.2, dist);
          
          vec3 finalColor = vColor * (glow * 0.8 + core * 0.5);
          float alpha = glow * 0.9;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particleData.sizes, 1]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

// 简化版粒子系统 - 使用PointMaterial
function SimpleParticleSystem({ isActive }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const frameCountRef = useRef(0);

  const config = useMemo(
    () => ({
      baseCount: 600,
      activeCount: 1200,
      emitRadius: 0.8,
      gravity: -0.012,
      baseEmitSpeed: 0.06,
      activeEmitSpeed: 0.12,
    }),
    []
  );

  // 生成粒子数据
  const { positions, velocities, colors } = useMemo(() => {
    const count = config.activeCount;
    const posArray = new Float32Array(count * 3);
    const velArray: THREE.Vector3[] = [];
    const colArray = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color(0x00ffff),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0xffd700),
      new THREE.Color(0x00ced1),
      new THREE.Color(0xa855f7),
    ];

    for (let i = 0; i < count; i++) {
      // 初始位置
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * config.emitRadius;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;

      // 速度
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const speed = Math.random() * config.baseEmitSpeed + 0.02;

      velArray.push(
        new THREE.Vector3(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.cos(phi) + 0.03,
          speed * Math.sin(phi) * Math.sin(theta)
        )
      );

      // 颜色
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colArray[i * 3] = color.r;
      colArray[i * 3 + 1] = color.g;
      colArray[i * 3 + 2] = color.b;
    }

    return { positions: posArray, velocities: velArray, colors: colArray };
  }, [config]);

  const particlesRef = useRef({ positions, velocities, life: new Float32Array(config.activeCount).fill(1) });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    const pos = particlesRef.current.positions;
    const vel = particlesRef.current.velocities;
    const life = particlesRef.current.life;

    const currentCount = isActive ? config.activeCount : config.baseCount;
    const emitSpeed = isActive ? config.activeEmitSpeed : config.baseEmitSpeed;

    for (let i = 0; i < currentCount; i++) {
      life[i] -= 0.008;

      if (life[i] <= 0 || pos[i * 3 + 1] < -6) {
        // 重置
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * config.emitRadius;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = Math.sin(angle) * radius * 0.2;
        pos[i * 3 + 2] = Math.sin(angle) * radius;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.6;
        const speed = Math.random() * emitSpeed + 0.02;

        vel[i].set(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.cos(phi) + 0.04,
          speed * Math.sin(phi) * Math.sin(theta)
        );

        life[i] = 1;
      } else {
        vel[i].y += config.gravity;
        vel[i].x += (Math.random() - 0.5) * 0.001;
        vel[i].z += (Math.random() - 0.5) * 0.001;

        pos[i * 3] += vel[i].x;
        pos[i * 3 + 1] += vel[i].y;
        pos[i * 3 + 2] += vel[i].z;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Points ref={pointsRef} limit={config.activeCount} range={config.activeCount}>
      <pointsMaterial
        size={isActive ? 0.12 : 0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
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
    </Points>
  );
}

// 相机控制器
function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // 相机缓慢环绕
    const radius = 8;
    const x = Math.sin(time * 0.15) * radius;
    const z = Math.cos(time * 0.15) * radius;

    state.camera.position.x = x;
    state.camera.position.z = z;
    state.camera.lookAt(0, 1, 0);
  });

  return null;
}

// 发光球体核心
function GlowCore({ isActive }: ParticleSystemProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;

    const scale = isActive ? 1.2 + Math.sin(time * 3) * 0.1 : 1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshBasicMaterial
        color={isActive ? 0x00ffff : 0x8b5cf6}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

interface Particle3DSceneProps {
  isActive?: boolean;
}

export default function Particle3DScene({ isActive = false }: Particle3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        <SimpleParticleSystem isActive={isActive} />
        <GlowCore isActive={isActive} />
        <CameraController />
      </Canvas>
    </div>
  );
}
