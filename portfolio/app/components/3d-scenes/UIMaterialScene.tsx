"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Float,
  RoundedBox,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface UIMaterialSceneProps {
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

  // 自定义着色器材质 - 流动效果
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uHover: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uHover;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            // 流动波纹效果
            float wave = sin(vUv.x * 10.0 + uTime * 2.0) * 0.5 + 0.5;
            float wave2 = sin(vUv.y * 8.0 + uTime * 1.5) * 0.5 + 0.5;
            
            // 边缘发光
            float edgeX = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
            float edgeY = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            float edge = edgeX * edgeY;
            
            // 基础颜色
            vec3 baseColor = uColor * 0.3;
            
            // 流动高光
            vec3 flowColor = uColor * wave * wave2 * 0.5;
            
            // 边缘发光
            vec3 edgeGlow = uColor * (1.0 - edge) * 2.0;
            
            // 扫描线效果
            float scanLine = smoothstep(0.98, 1.0, sin(vUv.y * 20.0 + uTime * 3.0));
            vec3 scanColor = uColor * scanLine * 0.3;
            
            vec3 finalColor = baseColor + flowColor + edgeGlow + scanColor;
            
            // 透明度渐变
            float alpha = 0.7 + wave * 0.2;
            
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
      radius={0.05}
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
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime + delay;
    
    // 脉冲缩放效果
    const scale = 1 + Math.sin(time * 3) * 0.05;
    groupRef.current.scale.setScalar(scale);
    
    // 浮动效果
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 按钮背景 */}
      <RoundedBox
        ref={meshRef}
        args={[0.8, 0.25, 0.05]}
        radius={0.03}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#00a8e8"
          emissive="#00a8e8"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>
      
      {/* 按钮文字区域（简化表示） */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.5, 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* 发光环 */}
      <mesh position={[0, 0, -0.03]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial
          color="#00a8e8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 连接线组件
function ConnectionLine({
  start,
  end,
  isActive,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
  delay?: number;
}) {
  const lineRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00a8e8") },
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
            // 数据流动效果
            float flow = fract(vUv.x * 3.0 - uTime * 2.0);
            float glow = smoothstep(0.0, 0.3, flow) * smoothstep(1.0, 0.7, flow);
            
            vec3 finalColor = uColor * (0.3 + glow * 2.0);
            float alpha = 0.5 + glow * 0.5;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
      }),
    []
  );

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.5,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, [start, end]);

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;
  });

  return (
    <mesh ref={lineRef} geometry={geometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

// 浮动图标组件
function FloatingIcon({
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
    
    // 旋转
    groupRef.current.rotation.y = time * 0.5;
    groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    
    // 浮动
    groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 图标外框 */}
      <RoundedBox args={[0.4, 0.4, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#00a8e8"
          emissive="#00a8e8"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>
      
      {/* 图标内部 */}
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00a8e8" />

      {/* 主面板 */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <UIPanel
          position={[0, 0.5, 0]}
          size={[2.5, 1.5, 0.1]}
          color="#00a8e8"
          isActive={isActive}
          delay={0}
        />
      </Float>

      {/* 侧面板 - 左 */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.15}>
        <UIPanel
          position={[-2, 0, 0.5]}
          size={[1.2, 1.8, 0.08]}
          color="#0080b8"
          isActive={isActive}
          delay={0.5}
        />
      </Float>

      {/* 侧面板 - 右 */}
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.18}>
        <UIPanel
          position={[2, -0.2, 0.3]}
          size={[1.0, 1.2, 0.08]}
          color="#00c0f0"
          isActive={isActive}
          delay={1}
        />
      </Float>

      {/* 底部面板 */}
      <Float speed={1} rotationIntensity={0.08} floatIntensity={0.1}>
        <UIPanel
          position={[0, -1.5, 0.2]}
          size={[3, 0.6, 0.06]}
          color="#006080"
          isActive={isActive}
          delay={1.5}
        />
      </Float>

      {/* 按钮组 */}
      <UIButton position={[-0.6, -1.5, 0.3]} isActive={isActive} delay={0} />
      <UIButton position={[0, -1.5, 0.35]} isActive={isActive} delay={0.3} />
      <UIButton position={[0.6, -1.5, 0.3]} isActive={isActive} delay={0.6} />

      {/* 连接线 */}
      <ConnectionLine
        start={[-1.4, 0.5, 0.5]}
        end={[-1.25, 0.5, 0]}
        isActive={isActive}
        delay={0}
      />
      <ConnectionLine
        start={[1.25, 0.3, 0]}
        end={[1.5, -0.2, 0.3]}
        isActive={isActive}
        delay={0.5}
      />
      <ConnectionLine
        start={[0, -0.25, 0]}
        end={[0, -1.2, 0.2]}
        isActive={isActive}
        delay={1}
      />

      {/* 浮动图标 */}
      <FloatingIcon position={[-2.5, 1.5, 0]} isActive={isActive} delay={0} />
      <FloatingIcon position={[2.5, 1.2, 0.5]} isActive={isActive} delay={0.7} />
      <FloatingIcon position={[1.8, -1.8, 0.8]} isActive={isActive} delay={1.4} />
      <FloatingIcon position={[-1.8, -2, 0.6]} isActive={isActive} delay={2.1} />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </>
  );
}

export default function UIMaterialScene({ isActive }: UIMaterialSceneProps) {
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
