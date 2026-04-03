'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface UseAnimateInViewOptions {
  once?: boolean;
  margin?: `${number}px` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`;
  amount?: 'some' | 'all' | number;
}

/**
 * 通用的视口动画 hook
 * 封装了 useInView 的常用配置
 */
export function useAnimateInView(options: UseAnimateInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? '-100px',
    amount: options.amount ?? 'some',
  });

  return { ref, isInView };
}

/**
 * 小margin版本的视口动画 hook
 * 适用于需要更早触发动画的场景
 */
export function useAnimateInViewSmall(options: Omit<UseAnimateInViewOptions, 'margin'> = {}) {
  return useAnimateInView({ ...options, margin: '-50px' });
}

/**
 * 大margin版本的视口动画 hook
 * 适用于需要更晚触发动画的场景
 */
export function useAnimateInViewLarge(options: Omit<UseAnimateInViewOptions, 'margin'> = {}) {
  return useAnimateInView({ ...options, margin: '-200px' });
}
