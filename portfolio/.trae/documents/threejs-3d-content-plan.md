# Three.js 3D项目内容展示计划

## 需求理解

用户要求将项目卡片中的2D动画替换为真正的 **Three.js 3D场景**，使用 React Three Fiber 实现。

不是卡片本身的3D倾斜效果，而是项目描述区域要显示真实的3D内容。

## 技术选型

- **@react-three/fiber** - React的Three.js渲染器
- **@react-three/drei** - Three.js的实用工具库
- **three** - 核心3D库

## 3D场景设计

### 1. 智能座舱HMI项目 - 3D汽车仪表盘

**3D元素：**
- 3D汽车模型 (简化版SUV/轿车)
- 3D旋转仪表盘 (速度表、转速表)
- 3D数字显示屏
- 3D方向盘
- 环境光照和材质

**交互：**
- 汽车模型缓慢旋转展示
- 仪表盘指针随动画摆动
- 悬停时相机拉近聚焦

### 2. 虚幻特效项目 - 3D粒子系统

**3D元素：**
- 3D粒子发射器
- 彩色粒子流 (火焰、烟雾、魔法效果)
- 3D力场可视化
- 粒子碰撞效果

**交互：**
- 粒子从中心发射
- 悬停时粒子密度增加
- 相机环绕粒子系统旋转

### 3. 汽车设计项目 - 3D汽车展示

**3D元素：**
- 精细3D汽车模型
- 线框/实体切换模式
- 3D奖杯模型
- 设计蓝图平面

**交互：**
- 汽车360度旋转展示
- 悬停时切换材质 (金属/线框)
- 聚光灯跟随效果

### 4. FPS游戏项目 - 3D游戏场景

**3D元素：**
- 3D武器模型 (枪械)
- 3D角色手部
- 3D准星
- 3D弹壳掉落效果

**交互：**
- 武器跟随鼠标轻微移动
- 悬停时模拟射击动画
- 枪口闪光效果

### 5. UMG项目 - 3D UI元素

**3D元素：**
- 3D按钮和面板
- 3D文字 (TextGeometry)
- 3D进度条
- 悬浮UI卡片

**交互：**
- UI元素浮动动画
- 悬停时元素展开
- 3D翻转效果

## 实现步骤

### 步骤1: 安装依赖
```bash
npm install three @react-three/fiber @react-three/drei @types/three
```

### 步骤2: 创建3D场景组件

每个项目创建一个独立的3D场景组件：

```
app/components/3d-scenes/
├── Car3DScene.tsx          # 汽车HMI 3D场景
├── Particle3DScene.tsx     # 粒子特效 3D场景
├── Design3DScene.tsx       # 汽车设计 3D场景
├── Weapon3DScene.tsx       # FPS武器 3D场景
└── UI3DScene.tsx           # UMG UI 3D场景
```

### 步骤3: 更新动画映射

修改 `Projects.tsx` 中的 `animationMap`，指向新的3D场景组件。

### 步骤4: 优化性能

- 使用 `useFrame` 控制动画
- 实现懒加载 (动态导入)
- 添加 `Suspense` 加载状态
- 限制渲染分辨率

## 3D场景详细规格

### Car3DScene.tsx

```typescript
// 场景设置
- Canvas: 全屏透明背景
- Camera: PerspectiveCamera, position [5, 3, 5], lookAt [0, 0, 0]
- Lights: AmbientLight + DirectionalLight + PointLight

// 3D对象
- CarModel: 使用基本几何体组合 (Box, Cylinder, Sphere)
- Dashboard: 圆柱体作为仪表盘
- Needles: 细长的Box作为指针
- Screen: 平面显示UI

// 动画
- 汽车整体缓慢旋转 (y轴)
- 指针摆动动画
- 材质发光效果
```

### Particle3DScene.tsx

```typescript
// 场景设置
- Canvas: 透明背景
- Camera: 环绕相机

// 3D对象
- ParticleSystem: 使用 Points 和 BufferGeometry
- Emitters: 球体作为发射源
- ForceFields: 可视化力场

// 动画
- 粒子从中心发射
- 重力影响
- 颜色渐变
```

### Design3DScene.tsx

```typescript
// 场景设置
- Canvas: 透明背景
- Camera: 可旋转视角

// 3D对象
- CarWireframe: 线框材质汽车
- Trophy: 3D奖杯模型
- Blueprint: 平面蓝图纹理

// 动画
- 线框闪烁效果
- 材质切换动画
```

### Weapon3DScene.tsx

```typescript
// 场景设置
- Canvas: 透明背景
- Camera: 第一人称视角

// 3D对象
- Gun: 组合几何体枪械
- Hands: 简化手部模型
- Bullets: 弹壳模型

// 动画
- 后坐力动画
- 弹壳弹出
- 枪口闪光
```

### UI3DScene.tsx

```typescript
// 场景设置
- Canvas: 透明背景
- Camera: 正视图

// 3D对象
- Panels: 3D面板
- Buttons: 3D按钮
- Text: 3D文字

// 动画
- 浮动动画
- 展开效果
```

## 文件修改清单

### 新建文件
1. `app/components/3d-scenes/Car3DScene.tsx`
2. `app/components/3d-scenes/Particle3DScene.tsx`
3. `app/components/3d-scenes/Design3DScene.tsx`
4. `app/components/3d-scenes/Weapon3DScene.tsx`
5. `app/components/3d-scenes/UI3DScene.tsx`
6. `app/components/3d-scenes/index.ts` - 统一导出

### 修改文件
1. `package.json` - 添加 three 相关依赖
2. `app/sections/Projects.tsx` - 更新 animationMap 指向3D场景

## 性能考虑

1. **懒加载**: 使用 `next/dynamic` 动态导入3D组件
2. **渲染优化**: 使用 `useFrame` 控制更新频率
3. **内存管理**: 组件卸载时清理3D资源
4. **降级方案**: 不支持WebGL时显示2D备用动画

## 预期效果

- 每个项目卡片悬停时显示真正的3D场景
- 3D内容与项目主题高度相关
- 流畅的3D动画和交互
- 保持页面整体性能
