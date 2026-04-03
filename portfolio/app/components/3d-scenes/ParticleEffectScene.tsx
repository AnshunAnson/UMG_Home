"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Float,
  Sphere,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface ParticleEffectSceneProps {
  isActive: boolean;
}

// 粒子发射器组件
function ParticleEmitter({
  position,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particleCount = 200;

  // 粒子着色器材质
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#9b59b6") },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uPixelRatio;
          
          attribute float aScale;
          attribute vec3 aVelocity;
          attribute float aLife;
          attribute float aOffset;
          
          varying float vAlpha;
          varying float vLife;
          
          void main() {
            float time = uTime + aOffset;
            
            // 粒子运动轨迹 - 螺旋上升
            float t = mod(time * 0.5, aLife);
            float progress = t / aLife;
            
            vec3 pos = position;
            
            // 螺旋运动
            float angle = time * 2.0 + aVelocity.x * 10.0;
            float radius = 0.5 + progress * 2.0;
            pos.x += cos(angle) * radius;
            pos.z += sin(angle) * radius;
            pos.y += progress * 4.0;
            
            // 添加一些随机扰动
            pos.x += sin(time * 3.0 + aVelocity.y * 10.0) * 0.3;
            pos.z += cos(time * 2.5 + aVelocity.z * 10.0) * 0.3;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // 粒子大小随生命周期变化
            float sizeScale = sin(progress * 3.14159);
            gl_PointSize = aScale * uPixelRatio * sizeScale * (100.0 / -mvPosition.z);
            
            // 透明度随生命周期变化
            vAlpha = 1.0 - progress;
            vLife = progress;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          
          varying float vAlpha;
          varying float vLife;
          
          void main() {
            // 圆形粒子
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // 中心亮边缘暗
            float glow = 1.0 - dist * 2.0;
            glow = pow(glow, 1.5);
            
            // 颜色渐变 - 从紫色到青色
            vec3 color1 = uColor;
            vec3 color2 = vec3(0.0, 0.8, 1.0);
            vec3 finalColor = mix(color1, color2, vLife);
            
            // 核心更亮
            finalColor += vec3(1.0) * glow * 0.5;
            
            gl_FragColor = vec4(finalColor, vAlpha * glow);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  // 粒子几何体和属性
  const { geometry, attributes } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const lives = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // 初始位置（发射器中心）
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // 随机大小
      scales[i] = Math.random() * 15 + 5;

      // 随机速度方向
      velocities[i * 3] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 1] = Math.random() * 2 + 1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // 生命周期
      lives[i] = Math.random() * 2 + 2;

      // 时间偏移
      offsets[i] = Math.random() * 10;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute("aLife", new THREE.BufferAttribute(lives, 1));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

    return { geometry: geo, attributes: { positions, scales, velocities, lives, offsets } };
  }, []);

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 发射器核心 */}
      <Sphere args={[0.15, 16, 16]}>
        <meshStandardMaterial
          color="#9b59b6"
          emissive="#9b59b6"
          emissiveIntensity={2}
        />
      </Sphere>

      {/* 粒子系统 */}
      <points ref={particlesRef} geometry={geometry}>
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </points>
    </group>
  );
}

// 流动光带组件
function FlowRibbon({
  position,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#9b59b6") },
        },
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 pos = position;
            
            // 波浪变形
            float wave = sin(position.x * 3.0 + uTime * 2.0) * 0.2;
            wave += sin(position.y * 2.0 + uTime * 1.5) * 0.15;
            pos.z += wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            // 流动效果
            float flow = fract(vUv.x * 4.0 - uTime * 1.5);
            float pulse = smoothstep(0.0, 0.3, flow) * smoothstep(1.0, 0.7, flow);
            
            // 边缘发光
            float edge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            
            vec3 baseColor = uColor * 0.2;
            vec3 flowColor = uColor * pulse * 2.0;
            vec3 edgeColor = uColor * (1.0 - edge) * 3.0;
            
            vec3 finalColor = baseColor + flowColor + edgeColor;
            float alpha = 0.6 + pulse * 0.4;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-1, 0.5, 0.5),
      new THREE.Vector3(0, -0.3, -0.3),
      new THREE.Vector3(1, 0.4, 0.2),
      new THREE.Vector3(2, 0, 0),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
  }, []);

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;

    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

// 能量环组件
function EnergyRing({
  position,
  radius,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  radius: number;
  isActive: boolean;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#9b59b6") },
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
            // 环形效果
            float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (3.14159 * 2.0) + 0.5;
            
            // 旋转扫描
            float scan = fract(angle * 3.0 - uTime * 0.5);
            float glow = smoothstep(0.0, 0.2, scan) * smoothstep(0.4, 0.2, scan);
            
            // 内外边缘发光
            float dist = length(vUv - vec2(0.5));
            float ring = smoothstep(0.48, 0.5, dist) * smoothstep(0.52, 0.5, dist);
            
            vec3 finalColor = uColor * (ring + glow * 2.0);
            float alpha = ring + glow * 0.5;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;

    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

// 浮动光球组件
function FloatingOrb({
  position,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;

    // 轨道运动
    const radius = 1.5;
    groupRef.current.position.x = position[0] + Math.cos(time * 0.5) * radius;
    groupRef.current.position.z = position[2] + Math.sin(time * 0.5) * radius;
    groupRef.current.position.y = position[1] + Math.sin(time) * 0.3;

    // 自转
    if (orbRef.current) {
      orbRef.current.rotation.y = time;
      orbRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 内核 */}
      <Sphere ref={orbRef} args={[0.2, 32, 32]}>
        <meshStandardMaterial
          color="#9b59b6"
          emissive="#9b59b6"
          emissiveIntensity={3}
        />
      </Sphere>

      {/* 外发光 */}
      <Sphere args={[0.35, 32, 32]}>
        <meshBasicMaterial
          color="#9b59b6"
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* 光晕 */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial
          color="#9b59b6"
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#9b59b6" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00d4ff" />

      {/* 主粒子发射器 */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.15}>
        <ParticleEmitter position={[0, -1, 0]} isActive={isActive} delay={0} />
      </Float>

      {/* 次要发射器 */}
      <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.1}>
        <ParticleEmitter position={[-2, -0.5, 1]} isActive={isActive} delay={2} />
      </Float>

      <Float speed={0.7} rotationIntensity={0.09} floatIntensity={0.12}>
        <ParticleEmitter position={[2, -0.5, -1]} isActive={isActive} delay={4} />
      </Float>

      {/* 流动光带 */}
      <FlowRibbon position={[0, 1, 0]} isActive={isActive} delay={0} />
      <FlowRibbon position={[0, 0, 0.5]} isActive={isActive} delay={1} />
      <FlowRibbon position={[0, -0.5, -0.5]} isActive={isActive} delay={2} />

      {/* 能量环 */}
      <EnergyRing position={[0, 0, 0]} radius={2} isActive={isActive} delay={0} />
      <EnergyRing position={[0, 0.5, 0]} radius={2.5} isActive={isActive} delay={1} />
      <EnergyRing position={[0, -0.5, 0]} radius={1.5} isActive={isActive} delay={2} />

      {/* 浮动光球 */}
      <FloatingOrb position={[0, 0, 0]} isActive={isActive} delay={0} />
      <FloatingOrb position={[0, 0.5, 0]} isActive={isActive} delay={2} />
      <FloatingOrb position={[0, -0.5, 0]} isActive={isActive} delay={4} />

      {/* 背景粒子 */}
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#0a0a0f"
          side={THREE.BackSide}
        />
      </mesh>

      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </>
  );
}

export default function ParticleEffectScene({ isActive }: ParticleEffectSceneProps) {
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
