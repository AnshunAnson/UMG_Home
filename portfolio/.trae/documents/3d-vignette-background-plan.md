# 3D效果、全局暗角与页面背景动画联动计划

## 需求分析

用户要求：
1. **3D效果** - 项目卡片需要有3D变换效果
2. **全局暗角(Vignette)** - 只有悬停项目卡片时才出现，覆盖整个页面
3. **页面背景动画联动** - 整个页面背景要随悬停变化，不仅仅是项目卡片背景

## 实现方案

### 1. 全局悬停状态管理 (React Context)

创建 `ProjectHoverContext` 来管理悬停状态，让全局组件可以访问：

```typescript
// app/context/ProjectHoverContext.tsx
interface ProjectHoverContextType {
  hoveredId: number | null;
  isLeaving: boolean;
  themeColor: string | null;
  setHoveredId: (id: number | null) => void;
  setIsLeaving: (leaving: boolean) => void;
}
```

### 2. 全局暗角效果 (Global Vignette)

创建固定在视口的暗角遮罩：

```typescript
// 组件: GlobalVignette
- 位置: fixed inset-0
- z-index: 50 (在所有内容之上，但在模态框之下)
- 效果: radial-gradient 从透明中心到深色边缘
- 触发: 仅在 hoveredId !== null 时显示
- 动画: opacity 0 -> 1, 持续时间 0.6s
- 颜色: 根据悬停项目动态调整 (themeColor + 暗角)
```

### 3. 页面背景动画联动 (Global Background)

增强背景效果，让整个页面都有动画：

```typescript
// 组件: GlobalAnimatedBackground
- 位置: fixed inset-0
- z-index: -1 (在最底层)
- 效果:
  - 渐变背景色随悬停项目变化
  - 添加动态粒子/网格效果
  - 颜色主题与悬停项目一致
- 动画: 
  - 背景色过渡 0.8s
  - 粒子密度在悬停时增加
```

### 4. 3D卡片效果 (3D Project Cards)

为项目卡片添加3D变换：

```typescript
// 在 ProjectCard 组件中:
- 容器添加 perspective: 1000px
- 卡片添加 transform-style: preserve-3d
- 悬停效果:
  - rotateX: 根据鼠标Y位置计算 (-5deg to 5deg)
  - rotateY: 根据鼠标X位置计算 (-5deg to 5deg)
  - translateZ: 悬停时向前突出 20px
  - scale: 1.02 (轻微放大)
- 光泽效果:
  - 悬停时添加渐变光泽层
  - 跟随鼠标位置移动
```

### 5. 具体实现步骤

#### 步骤1: 创建 ProjectHoverContext
- 文件: `app/context/ProjectHoverContext.tsx`
- 提供全局悬停状态
- 在 layout.tsx 中包裹整个应用

#### 步骤2: 创建 GlobalVignette 组件
- 文件: `app/components/GlobalVignette.tsx`
- 使用 Context 获取悬停状态
- 实现径向渐变暗角效果
- 添加模糊背景效果

#### 步骤3: 创建 GlobalAnimatedBackground 组件
- 文件: `app/components/GlobalAnimatedBackground.tsx`
- 全页面动态背景
- 粒子系统随悬停项目变色
- 网格/线条动画效果

#### 步骤4: 更新 Projects.tsx
- 使用 Context 替代本地 state
- 添加3D变换逻辑
- 鼠标位置追踪用于3D效果

#### 步骤5: 更新 ProjectCard 组件
- 添加 perspective 容器
- 实现鼠标跟随的3D旋转
- 添加光泽反射层

### 6. 视觉效果细节

#### 暗角效果规格
```css
/* 默认状态 */
opacity: 0
pointer-events: none

/* 悬停状态 */
opacity: 1
background: radial-gradient(
  ellipse at center,
  transparent 0%,
  transparent 30%,
  rgba(0,0,0,0.4) 70%,
  rgba(0,0,0,0.8) 100%
)
backdrop-filter: blur(2px)
```

#### 3D卡片规格
```css
/* 容器 */
perspective: 1000px

/* 卡片 */
transform-style: preserve-3d
transition: transform 0.3s ease

/* 悬停时 */
transform: 
  rotateX(var(--rotate-x, 0deg)) 
  rotateY(var(--rotate-y, 0deg)) 
  translateZ(20px)
  scale(1.02)
```

#### 背景联动规格
```css
/* 默认 */
background: #0d0d0d

/* 悬停项目1 */
background: 
  radial-gradient(ellipse at 30% 40%, rgba(0,212,170,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 70% 60%, rgba(0,212,170,0.08) 0%, transparent 40%),
  #0d0d0d
```

### 7. 文件修改清单

1. **新建文件**:
   - `app/context/ProjectHoverContext.tsx`
   - `app/components/GlobalVignette.tsx`
   - `app/components/GlobalAnimatedBackground.tsx`

2. **修改文件**:
   - `app/layout.tsx` - 添加 Context Provider
   - `app/sections/Projects.tsx` - 3D效果 + Context集成
   - `app/page.tsx` - 添加全局组件

### 8. 交互流程

```
用户悬停项目卡片
    ↓
ProjectHoverContext 更新 hoveredId
    ↓
GlobalVignette 显示暗角遮罩
GlobalAnimatedBackground 切换主题色
ProjectCard 应用3D变换
    ↓
用户移动鼠标
    ↓
ProjectCard 更新 rotateX/Y (鼠标跟随)
光泽层跟随鼠标移动
    ↓
用户离开卡片
    ↓
等待2秒动画周期
    ↓
所有效果恢复原状
```

## 预期效果

- **3D卡片**: 卡片会随鼠标移动产生微妙的3D倾斜效果，增加沉浸感
- **全局暗角**: 悬停时页面四周变暗，聚焦注意力到项目卡片
- **背景联动**: 整个页面背景会根据悬停的项目改变色调，创造统一的视觉体验
