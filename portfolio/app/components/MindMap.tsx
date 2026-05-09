'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
}

const mindMapData: MindMapNode = {
  id: 'root',
  label: 'DeltaForce\n实时界面技术框架',
  color: '#7ce7d0',
  children: [
    {
      id: 'arch',
      label: '架构设计',
      color: '#88a8ff',
      children: [
        { id: 'arch-1', label: '模块化架构', color: '#88a8ff' },
        { id: 'arch-2', label: '组件化系统', color: '#88a8ff' },
        { id: 'arch-3', label: '状态管理', color: '#88a8ff' },
      ],
    },
    {
      id: 'render',
      label: '渲染技术',
      color: '#62d8c8',
      children: [
        { id: 'render-1', label: 'UI材质系统', color: '#62d8c8' },
        { id: 'render-2', label: '实时渲染优化', color: '#62d8c8' },
        { id: 'render-3', label: 'Substrate材质', color: '#62d8c8' },
      ],
    },
    {
      id: 'anim',
      label: '动效系统',
      color: '#f0b562',
      children: [
        { id: 'anim-1', label: 'Sequencer集成', color: '#f0b562' },
        { id: 'anim-2', label: '参数化动效', color: '#f0b562' },
        { id: 'anim-3', label: '过渡动画', color: '#f0b562' },
      ],
    },
    {
      id: 'tools',
      label: '工具链',
      color: '#d7c77a',
      children: [
        { id: 'tools-1', label: '编辑器工具', color: '#d7c77a' },
        { id: 'tools-2', label: 'Blueprint开发', color: '#d7c77a' },
        { id: 'tools-3', label: '自动化流程', color: '#d7c77a' },
      ],
    },
    {
      id: 'perf',
      label: '性能优化',
      color: '#59c8ff',
      children: [
        { id: 'perf-1', label: '性能分析', color: '#59c8ff' },
        { id: 'perf-2', label: '资源管理', color: '#59c8ff' },
        { id: 'perf-3', label: '多平台适配', color: '#59c8ff' },
      ],
    },
  ],
};

function MindMapNodeComponent({
  node,
  level = 0,
  expanded = true,
  onToggle,
}: {
  node: MindMapNode;
  level?: number;
  expanded?: boolean;
  onToggle?: (id: string) => void;
}) {
  const isRoot = level === 0;
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: level * 0.1 }}
      className="flex flex-col items-center"
    >
      <div
        className={`
          ${isRoot ? 'px-8 py-6 text-xl font-bold' : 'px-4 py-3 text-sm'}
          rounded-full border-2 bg-white/5 backdrop-blur-sm
          hover:bg-white/10 transition-all duration-300
          cursor-pointer text-center whitespace-nowrap
        `}
        style={{ borderColor: node.color || '#7ce7d0' }}
        onClick={() => onToggle && onToggle(node.id)}
      >
        <span className="block" style={{ color: node.color || '#7ce7d0' }}>
          {node.label.split('\n')[0]}
        </span>
        {node.label.includes('\n') && (
          <span className="block text-white/70 mt-1">
            {node.label.split('\n')[1]}
          </span>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div className="flex flex-wrap justify-center gap-6 mt-6 max-w-4xl">
          {node.children?.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              <div
                className="w-px h-6"
                style={{ backgroundColor: child.color || '#7ce7d0' }}
              />
              <MindMapNodeComponent
                node={child}
                level={level + 1}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function MindMap() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div className="py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-bold text-white mb-2">方法论思维导图</h3>
        <p className="text-white/60 text-sm">点击节点可展开/收起</p>
      </motion.div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <MindMapNodeComponent
            node={mindMapData}
            expanded={expandedNodes.has('root')}
            onToggle={toggleNode}
          />
        </div>
      </div>
    </div>
  );
}
