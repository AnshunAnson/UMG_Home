'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  originalX: number;
  originalY: number;
}

interface ParticleFieldProps {
  mousePosition: MousePosition;
}

const BACKGROUND_COLOR = '#0a0a0f';
const PARTICLE_COLOR = '#00d4aa';
const CONNECTION_COLOR = 'rgba(0, 212, 170, 0.15)';

export default function ParticleField({ mousePosition }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // 根据屏幕大小计算粒子数量
  const getParticleCount = useCallback((width: number, height: number): number => {
    const area = width * height;
    const baseCount = Math.floor(area / 15000); // 每15000像素一个粒子
    return Math.max(30, Math.min(baseCount, 120)); // 最少30个，最多120个
  }, []);

  // 初始化粒子
  const initParticles = useCallback((width: number, height: number) => {
    const count = getParticleCount(width, height);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
      });
    }

    particlesRef.current = particles;
  }, [getParticleCount]);

  // 更新鼠标位置
  useEffect(() => {
    mouseRef.current = {
      x: mousePosition.x,
      y: mousePosition.y,
    };
  }, [mousePosition]);

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制DPR避免性能问题
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
      };

      // 重新初始化粒子
      initParticles(rect.width, rect.height);
    };

    resizeCanvas();

    // 监听窗口大小变化
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    // 动画参数
    const mouseRadius = 150; // 鼠标影响半径
    const mouseForce = 0.03; // 鼠标排斥力
    const returnForce = 0.02; // 回归原位的力
    const friction = 0.95; // 摩擦力
    const maxSpeed = 3; // 最大速度
    const connectionDistance = 100; // 连线距离阈值
    const maxConnections = 3; // 每个粒子最大连接数

    let frameCount = 0;

    // 动画函数
    const animate = () => {
      frameCount++;
      
      // 每2帧渲染一次，优化性能
      if (frameCount % 2 === 0) {
        const { width, height } = dimensionsRef.current;
        const mouse = mouseRef.current;

        // 清空画布
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);

        const particles = particlesRef.current;

        // 更新和绘制粒子
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];

          // 计算与鼠标的距离
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 鼠标排斥效果
          if (distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            const repelX = -Math.cos(angle) * force * mouseForce * 100;
            const repelY = -Math.sin(angle) * force * mouseForce * 100;
            
            particle.vx += repelX;
            particle.vy += repelY;
          }

          // 回归原位的力（弹性效果）
          const homeDx = particle.originalX - particle.x;
          const homeDy = particle.originalY - particle.y;
          particle.vx += homeDx * returnForce;
          particle.vy += homeDy * returnForce;

          // 应用摩擦力
          particle.vx *= friction;
          particle.vy *= friction;

          // 限制最大速度
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
          }

          // 更新位置
          particle.x += particle.vx;
          particle.y += particle.vy;

          // 边界处理（软边界）
          const margin = 50;
          if (particle.x < -margin) particle.x = width + margin;
          if (particle.x > width + margin) particle.x = -margin;
          if (particle.y < -margin) particle.y = height + margin;
          if (particle.y > height + margin) particle.y = -margin;

          // 绘制粒子
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = PARTICLE_COLOR;
          ctx.fill();

          // 绘制发光效果
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 212, 170, 0.2)';
          ctx.fill();
        }

        // 绘制粒子之间的连线
        ctx.strokeStyle = CONNECTION_COLOR;
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
          let connections = 0;
          
          for (let j = i + 1; j < particles.length; j++) {
            if (connections >= maxConnections) break;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const opacity = (1 - distance / connectionDistance) * 0.15;
              ctx.strokeStyle = `rgba(0, 212, 170, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: BACKGROUND_COLOR,
        display: 'block',
      }}
    />
  );
}
