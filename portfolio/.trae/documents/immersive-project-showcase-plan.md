# 沉浸式项目展示页面设计计划

## 设计灵感来源

参考国际顶级设计：
1. **Apple产品页面** - 滚动触发动画，全屏沉浸式体验
2. **Awwwards获奖作品** - 创新交互，视觉冲击
3. **WebGL Experiments** - 3D与2D融合
4. **Brutalist Web Design** - 大胆排版，非传统布局

## 核心设计理念

### 1. 全屏滚动展示 (Full-Screen Scroll)

每个项目占据整个视口 (100vh)，用户通过滚动逐个浏览项目。

**交互模式：**
```
┌─────────────────────────────────────┐
│                                     │
│      [3D场景 - 占据主要视觉空间]      │
│                                     │
│    ┌─────────────────────────┐     │
│    │   项目标题              │     │
│    │   简短描述              │     │
│    │   [查看详情 →]          │     │
│    └─────────────────────────┘     │
│                                     │
│    01 / 05  ─────────────────────   │
└─────────────────────────────────────┘
```

### 2. 3D与内容深度联动

**联动方式：**
- 滚动进度控制3D场景动画
- 3D模型随滚动旋转/变换
- 文字内容淡入淡出与3D动画同步
- 每个项目独特的3D视觉语言

### 3. 视觉风格 - "数字工匠精神"

结合UE5的技术感与高端设计的精致感：
- **深色沉浸式背景** - 让3D内容成为焦点
- **精准 typography** - 大字体、紧凑字距
- **微交互细节** - 光标跟随、悬停效果
- **动态网格系统** - 非对称布局

## 页面结构

### 整体架构

```
/ (首页 - 简洁入口)
├── Hero Section (全屏3D欢迎场景)
│   └── 滚动提示 + 进入项目展示
│
└── /projects (独立项目展示页面)
    ├── Project 1 - 智能座舱HMI (全屏)
    ├── Project 2 - 虚幻特效 (全屏)
    ├── Project 3 - 汽车设计 (全屏)
    ├── Project 4 - FPS游戏 (全屏)
    ├── Project 5 - UMG重构 (全屏)
    └── Project Detail Modal (详情弹窗)
```

### 项目展示页面布局

每个项目section结构：

```typescript
interface ProjectSection {
  // 背景层
  background: {
    gradient: string;        // 动态渐变
    particles: boolean;      // 粒子效果
    grid: boolean;          // 网格装饰
  };
  
  // 3D场景层 (中央/一侧)
  scene3D: {
    component: ReactNode;    // Three.js场景
    position: 'center' | 'left' | 'right';
    scale: number;
    scrollAnimation: {       // 滚动触发动画
      rotate: [start, end];
      translate: [start, end];
      scale: [start, end];
    };
  };
  
  // 内容层 (另一侧)
  content: {
    title: string;
    subtitle: string;
    description: string;
    tech: string[];
    achievements: string[];
    position: 'left' | 'right';
  };
  
  // 导航指示器
  navigation: {
    current: number;
    total: number;
    progress: number;        // 滚动进度
  };
}
```

## 技术实现

### 1. 滚动控制系统

使用 **GSAP ScrollTrigger** + **Lenis Smooth Scroll**：

```typescript
// 平滑滚动
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

// 滚动触发动画
gsap.registerPlugin(ScrollTrigger);

// 每个项目的滚动控制
projects.forEach((project, index) => {
  ScrollTrigger.create({
    trigger: project.ref,
    start: 'top top',
    end: 'bottom top',
    pin: true,                    // 固定当前section
    scrub: 1,                     // 平滑滚动联动
    onUpdate: (self) => {
      // 更新3D场景
      update3DScene(index, self.progress);
      // 更新UI
      updateUI(index, self.progress);
    },
  });
});
```

### 2. 3D场景动画系统

```typescript
// 3D场景随滚动变化
function update3DScene(projectIndex: number, scrollProgress: number) {
  const scene = scenes[projectIndex];
  
  // 根据滚动进度计算变换
  const rotation = lerp(0, Math.PI * 2, scrollProgress);
  const scale = lerp(0.8, 1.2, scrollProgress);
  const position = lerp(-2, 2, scrollProgress);
  
  scene.mesh.rotation.y = rotation;
  scene.mesh.scale.setScalar(scale);
  scene.mesh.position.x = position;
}
```

### 3. 页面过渡效果

**项目间过渡：**
- 3D场景淡出/淡入
- 背景色渐变过渡
- 文字内容滑动切换
- 进度指示器更新

## 具体设计方案

### 项目1: 智能座舱HMI - "Digital Cockpit"

**视觉概念：**
- 3D汽车仪表盘悬浮在深色空间中
- 仪表盘指针随滚动摆动
- 数字界面元素从虚到实

**布局：**
```
┌─────────────────────────────────────┐
│                                     │
│         [3D仪表盘 - 中央]            │
│              旋转展示                │
│                                     │
│   智能座舱HMI          [→ 滚动查看]  │
│   Digital Cockpit                   │
│                                     │
│   虚幻引擎5开发车载信息娱乐系统...    │
│                                     │
│   UE5 │ UMG │ C++                   │
│                                     │
│   01 / 05  ████████░░ 80%           │
└─────────────────────────────────────┘
```

**滚动动画：**
- 0%: 仪表盘远景，模糊
- 50%: 仪表盘清晰，指针开始摆动
- 100%: 仪表盘旋转180度，展示背面

### 项目2: 虚幻特效 - "Particle Symphony"

**视觉概念：**
- 3D粒子爆炸效果
- 彩色粒子流形成螺旋
- 悬停时粒子汇聚成Niagara图标

**布局：**
```
┌─────────────────────────────────────┐
│                                     │
│   虚幻特效开发                       │
│   Particle Symphony                 │
│                                     │
│   Niagara粒子系统开发...             │
│                                     │
│         [3D粒子 - 右侧]              │
│           螺旋上升                   │
│                                     │
│   02 / 05  ██████░░░░ 60%           │
└─────────────────────────────────────┘
```

### 项目3: 汽车设计 - "Design Excellence"

**视觉概念：**
- 3D汽车线框模型
- 线框逐渐填充为实体
- 奖杯在旁边旋转

**布局：**
```
┌─────────────────────────────────────┐
│                                     │
│         [3D汽车 - 左侧]              │
│        线框→实体渐变                 │
│                                     │
│          汽车设计大赛                │
│          Design Excellence          │
│                                     │
│   全国大学生汽车设计大赛三等奖...     │
│                                     │
│   03 / 05  ████░░░░░░ 40%           │
└─────────────────────────────────────┘
```

### 项目4: FPS游戏 - "Combat Zone"

**视觉概念：**
- 第一人称3D武器视角
- 武器随滚动上膛/瞄准
- 弹壳掉落物理效果

**布局：**
```
┌─────────────────────────────────────┐
│                                     │
│   FPS多人游戏                        │
│   Combat Zone                       │
│                                     │
│   虚幻引擎5开发FPS多人对战游戏...     │
│                                     │
│         [3D武器 - 中央]              │
│           第一人称                   │
│                                     │
│   04 / 05  ██░░░░░░░░ 20%           │
└─────────────────────────────────────┘
```

### 项目5: UMG重构 - "Interface Revolution"

**视觉概念：**
- 3D UI元素悬浮
- 按钮、面板、进度条浮动
- 玻璃态效果

**布局：**
```
┌─────────────────────────────────────┐
│                                     │
│         [3D UI - 全屏]               │
│      浮动面板和按钮                  │
│                                     │
│   UMG界面重构                        │
│   Interface Revolution              │
│                                     │
│   负责游戏UMG界面重构工作...          │
│                                     │
│   05 / 05  ██████████ 100%          │
└─────────────────────────────────────┘
```

## 交互细节

### 1. 滚动进度指示器

固定在底部中央：
```
01 ─────────────────────── 05
████████░░░░░░░░░░░░ 20%
```

### 2. 快速导航

右侧固定导航点：
```
●  ← 当前
○
○
○
○
```

点击可跳转到对应项目。

### 3. 键盘导航

- `↓` / `Space` / `PageDown` - 下一个项目
- `↑` / `PageUp` - 上一个项目
- `Home` - 第一个项目
- `End` - 最后一个项目

### 4. 触摸/手势

- 下滑 - 下一个项目
- 上滑 - 上一个项目
- 轻点 - 查看详情

## 技术栈

### 核心依赖
```json
{
  "gsap": "^3.12.0",
  "@gsap/react": "^2.1.0",
  "lenis": "^1.0.0",
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.90.0",
  "framer-motion": "^10.0.0"
}
```

### 文件结构
```
app/
├── projects/
│   ├── page.tsx                 # 项目展示主页面
│   ├── components/
│   │   ├── ProjectSection.tsx   # 单个项目section
│   │   ├── ProjectNavigation.tsx # 导航指示器
│   │   ├── ProgressBar.tsx      # 进度条
│   │   └── ScrollController.tsx # 滚动控制
│   ├── hooks/
│   │   ├── useScrollProgress.ts # 滚动进度hook
│   │   └── useLenis.ts          # 平滑滚动hook
│   └── styles/
│       └── projects.module.css  # 项目页面样式
├── components/3d-scenes/        # 复用现有3D场景
├── page.tsx                     # 首页（简化）
└── layout.tsx
```

## 性能优化

1. **3D场景懒加载** - 只加载当前和相邻项目
2. **GPU加速** - transform3d, will-change
3. **图片优化** - WebP格式, 懒加载
4. **代码分割** - 动态导入3D组件
5. **防抖处理** - 滚动事件节流

## 响应式设计

### 桌面端 (>= 1024px)
- 3D场景与文字左右分栏
- 完整动画效果

### 平板端 (768px - 1023px)
- 3D场景在上，文字在下
- 简化部分动画

### 移动端 (< 768px)
- 3D场景缩小，居中
- 文字叠加在底部
- 触摸优先交互

## 实现步骤

### 第一阶段: 基础架构
1. 安装GSAP、Lenis依赖
2. 创建项目展示页面路由
3. 实现基础滚动控制

### 第二阶段: 3D场景整合
1. 迁移现有3D场景组件
2. 添加滚动联动动画
3. 优化3D性能

### 第三阶段: UI组件
1. 创建项目section组件
2. 实现导航指示器
3. 添加进度条

### 第四阶段: 交互完善
1. 键盘导航
2. 触摸手势
3. 快速跳转

### 第五阶段: 优化测试
1. 性能测试
2. 响应式测试
3. 浏览器兼容

## 预期效果

- **沉浸式体验** - 全屏3D场景，无干扰浏览
- **流畅滚动** - 60fps平滑滚动，丝滑体验
- **深度联动** - 3D与内容完美同步
- **高端质感** - 国际顶级设计水准
