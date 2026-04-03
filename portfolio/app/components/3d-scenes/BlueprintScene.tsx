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

interface BlueprintSceneProps {
  isActive: boolean;
}

// 蓝图节点组件
function BlueprintNode({
  position,
  title,
  inputs,
  outputs,
  isActive,
  delay = 0,
}: {
  position: [number, number, number];
  title: string;
  inputs: number;
  outputs: number;
  isActive: boolean;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const width = 1.8;
  const height = 0.6 + Math.max(inputs, outputs) * 0.25;

  // 节点背景着色器
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#f39c12") },
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
            // 节点背景渐变
            float gradient = smoothstep(0.0, 1.0, vUv.y);
            vec3 baseColor = mix(uColor * 0.2, uColor * 0.4, gradient);
            
            // 边框发光
            float borderX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
            float borderY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
            float border = borderX * borderY;
            
            vec3 borderColor = uColor * (1.0 - border) * 3.0;
            
            // 扫描效果
            float scan = smoothstep(0.98, 1.0, sin(vUv.y * 10.0 + uTime * 2.0));
            vec3 scanColor = uColor * scan * 0.5;
            
            vec3 finalColor = baseColor + borderColor + scanColor;
            float alpha = 0.85;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || !isActive) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime + delay;

    if (groupRef.current) {
      // 轻微浮动
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.02;
    }
  });

  // 生成输入端口
  const inputPorts = useMemo(() => {
    return Array.from({ length: inputs }, (_, i) => ({
      y: 0.2 - (i + 1) * (0.8 / (inputs + 1)),
      x: -width / 2,
    }));
  }, [inputs, width]);

  // 生成输出端口
  const outputPorts = useMemo(() => {
    return Array.from({ length: outputs }, (_, i) => ({
      y: 0.2 - (i + 1) * (0.8 / (outputs + 1)),
      x: width / 2,
    }));
  }, [outputs, width]);

  return (
    <group ref={groupRef} position={position}>
      {/* 节点主体 */}
      <RoundedBox args={[width, height, 0.1]} radius={0.08} smoothness={4}>
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </RoundedBox>

      {/* 标题栏 */}
      <mesh position={[0, height / 2 - 0.15, 0.06]}>
        <boxGeometry args={[width - 0.1, 0.25, 0.02]} />
        <meshStandardMaterial
          color="#f39c12"
          emissive="#f39c12"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 标题文字 */}
      <Text
        position={[0, height / 2 - 0.15, 0.08]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* 输入端口 */}
      {inputPorts.map((port, i) => (
        <group key={`input-${i}`} position={[port.x, port.y, 0.06]}>
          <mesh>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f39c12"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-0.08, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#f39c12" />
          </mesh>
        </group>
      ))}

      {/* 输出端口 */}
      {outputPorts.map((port, i) => (
        <group key={`output-${i}`} position={[port.x, port.y, 0.06]}>
          <mesh>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f39c12"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.08, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#f39c12" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 连接线组件
function NodeConnection({
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
          uColor: { value: new THREE.Color("#f39c12") },
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
            float flow = fract(vUv.x * 5.0 - uTime * 3.0);
            float pulse = smoothstep(0.0, 0.3, flow) * smoothstep(1.0, 0.7, flow);
            
            vec3 baseColor = uColor * 0.3;
            vec3 flowColor = uColor * pulse * 2.0;
            
            vec3 finalColor = baseColor + flowColor;
            float alpha = 0.6 + pulse * 0.4;
            
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
        start[1],
        (start[2] + end[2]) / 2 + 0.5
      ),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 30, 0.025, 8, false);
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

// 网格背景组件
function GridBackground() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    // 网格轻微移动效果
    gridRef.current.position.z = (state.clock.elapsedTime * 0.1) % 1;
  });

  return (
    <>
      <gridHelper
        ref={gridRef}
        args={[20, 40, "#f39c12", "#2a2a3a"]}
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* 背景平面 */}
      <mesh position={[0, -3.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>
    </>
  );
}

// 浮动参数面板
function ParamPanel({
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
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.position.y = position[1] + Math.sin(time) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[1.2, 1.5, 0.08]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#f39c12"
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* 参数滑块示意 */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[-0.4, 0.3 - i * 0.35, 0.05]}>
          <mesh>
            <boxGeometry args={[0.8, 0.06, 0.02]} />
            <meshBasicMaterial color="#2a2a3a" />
          </mesh>
          <mesh position={[-0.2 + i * 0.15, 0, 0.02]}>
            <boxGeometry args={[0.1, 0.1, 0.03]} />
            <meshStandardMaterial
              color="#f39c12"
              emissive="#f39c12"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 场景组件
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#f39c12" />

      <GridBackground />

      {/* 主节点 - Event BeginPlay */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <BlueprintNode
          position={[-3, 0, 0]}
          title="Event BeginPlay"
          inputs={0}
          outputs={1}
          isActive={isActive}
          delay={0}
        />
      </Float>

      {/* 节点 - Get Player Character */}
      <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.1}>
        <BlueprintNode
          position={[0, 1.5, 0.5]}
          title="Get Player Character"
          inputs={1}
          outputs={2}
          isActive={isActive}
          delay={0.3}
        />
      </Float>

      {/* 节点 - Cast To Character */}
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
        <BlueprintNode
          position={[3, 0.5, 0]}
          title="Cast To BP_Hero"
          inputs={2}
          outputs={2}
          isActive={isActive}
          delay={0.6}
        />
      </Float>

      {/* 节点 - Set Health */}
      <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.1}>
        <BlueprintNode
          position={[0, -1.5, 0.3]}
          title="Set Health"
          inputs={2}
          outputs={1}
          isActive={isActive}
          delay={0.9}
        />
      </Float>

      {/* 节点 - Print String */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <BlueprintNode
          position={[3, -1.5, 0.5]}
          title="Print String"
          inputs={2}
          outputs={1}
          isActive={isActive}
          delay={1.2}
        />
      </Float>

      {/* 连接线 */}
      <NodeConnection
        start={[-2.1, 0, 0]}
        end={[-0.9, 1.3, 0.5]}
        isActive={isActive}
        delay={0}
      />
      <NodeConnection
        start={[0.9, 1.3, 0.5]}
        end={[2.1, 0.7, 0]}
        isActive={isActive}
        delay={0.3}
      />
      <NodeConnection
        start={[0.9, 1.1, 0.5]}
        end={[-0.9, -1.3, 0.3]}
        isActive={isActive}
        delay={0.6}
      />
      <NodeConnection
        start={[0.9, -1.3, 0.3]}
        end={[2.1, -1.3, 0.5]}
        isActive={isActive}
        delay={0.9}
      />

      {/* 参数面板 */}
      <ParamPanel position={[-3.5, 2.5, -1]} isActive={isActive} delay={0} />
      <ParamPanel position={[3.5, 2.5, -0.5]} isActive={isActive} delay={0.5} />

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

export default function BlueprintScene({ isActive }: BlueprintSceneProps) {
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
