# Modal 布局精简优化计划

> **目标**: 解决 Lightbox 文字冗余、滚动穿透、视觉繁杂三个问题

## 问题分析

### 问题1：Lightbox 放大后文字过多
**现状**: [Projects.tsx:851-854](file:///e:\AnShunConfig\html\portfolio\app\sections\Projects.tsx#L851-L854)
- 显示 alt 描述文本 + 计数器 "1 / 7"，两行文字在GIF下方
- 用户只想专注看动效，文字和图标分散注意力

**方案**: Lightbox 模式下完全去除文字，仅保留：
- 图片本身（最大化显示区域）
- 关闭按钮（右上角）
- 导航箭头（左右侧，多图时）
- 计数器改为极简半透明角标（右下角，如 `3/7`）

### 问题2：Modal 打开时滚轮控制背景
**现状**: [Projects.tsx:531-552](file:///e:\AnShunConfig\html\portfolio\app\sections\Projects.tsx#L531-L552)
- `overflow: hidden` 仅在 `previewIndex !== null`（Lightbox模式）时生效
- Modal 本身打开时背景仍可滚动 → **滚动穿透**

**方案**: 将 `body overflow: hidden` 上移到 Modal 层级（组件挂载时即锁定），而非仅在 Lightbox 时锁定。使用独立的 `useEffect` 管理 Modal 的滚动锁。

### 问题3：整体排版不够简洁，装饰过多
**现状**: 当前代码中冗余装饰元素清单：

| 位置 | 元素 | 处理 |
|------|------|------|
| L580-588 | 图标容器（彩色背景+边框+圆角） | 简化：去掉容器装饰，仅保留图标 |
| L590-591 | 标题旁 period 单独一行 | 合并到标题行内 |
| L603-612 | category 彩色 badge | 简化：去掉边框和背景色，纯文本 |
| L618 | 工作内容标题前圆点装饰 | 去掉 |
| L624 | 列表项 › 符号 | 去掉 |
| L632-633 | 项目业绩标题前 Award 图标 | 去掉图标，纯文本 |
| L639 | 业绩列表项圆点 | 去掉 |
| L664-668 | 效果展示标题（脉冲动画圆点+计数badge） | 极简化：仅保留标题文字 |
| L696-699 | GIF缩略图底部 caption 栏（alt+"点击放大"） | **去掉整个caption栏**，GIF卡片更干净 |
| L569-571 | Modal 渐变背景+彩色边框+投影 | 简化为纯色背景+单层边框 |

---

## 修改文件

**唯一修改文件**: [Projects.tsx](file:///e:\AnShunConfig\html\portfolio\app\sections\Projects.tsx) — `ProjectModal` 组件（第517-863行）

## 实施步骤

### Step 1: 修复滚动穿透 — Modal级滚动锁
- 在现有 `useEffect`(键盘事件) 之外，新增独立 `useEffect`
- 条件：组件挂载时（不依赖 previewIndex）即锁定 body overflow
- cleanup: 组件卸载时恢复
- 保留 Lightbox 的锁定逻辑不变（双重保险）

### Step 2: 精简左侧信息面板
- **头部区域**:
  - 去掉图标的彩色容器装饰（background/border），图标直接显示或极简圆形底
  - title 和 period 合并为同一行：title + 小号 period
  - category badge: 去掉 border/background，改为小号灰色文本标签
- **工作内容列表**:
  - 去掉标题前的圆点装饰
  - 去掉列表项的 `›` 符号
  - 缩小间距
- **项目业绩**:
  - 去掉 Award 图标
  - 去掉列表项圆点
- **技术栈**:
  - tag 样式保持但缩小 padding，去掉 hover 动画（减少干扰）

### Step 3: 精简右侧GIF画廊
- **画廊标题栏**:
  - 去掉脉冲动画圆点
  - 去掉 "X 个动效" 计数 badge
  - 仅保留 "效果展示" 四字，字号缩小
- **GIF 卡片**:
  - **删除底部 caption 栏**（alt 文本 + "点击放大"）
  - 卡片变为纯图片容器：深色底 + GIF + hover 边框变色
  - 高度限制保持 max-h-[200px]
  - hover 效果保留但更微妙（仅边框变色，去掉 scale）

### Step 4: 精简 Lightbox 全屏预览
- **删除** 图片下方 caption 区域（alt 文本 + 计数器两行）
- **改为**: 右下角极简半透明数字角标 `3/7`（position absolute）
- 关闭按钮和导航箭头保留但样式更低调
- 图片区域扩大：max-h 从 70vh → 85vh

### Step 5: 精简 Modal 外壳装饰
- 背景：从 gradient 简化为纯 `#111118`
- 边框：从 `${project.color}40` 简化为 `rgba(255,255,255,0.08)`
- boxShadow：去掉彩色投影，改为微弱 `0 20px 60px rgba(0,0,0,0.5)`
- 圆角保持 rounded-2xl

---

## 设计原则（来自 UI/UX Pro Max）

- **`whitespace-balance`**: 用留白分组，避免视觉拥挤
- **`excessive-motion`**: 动画最多1-2个关键元素（去掉脉冲圆点、stagger可保留但减淡）
- **`primary-action`**: 每屏只有一个主要焦点（GIF就是焦点，其他都是噪音）
- **`scrim-and-modal-legibility`**: 遮罩足够强（当前95%OK），前景内容要干净
- **`content-priority`**: 移动端核心内容优先（GIF优先于描述文字）

## 预期效果对比

| 维度 | 修改前 | 修改后 |
|------|--------|--------|
| Lightbox | 图片+alt文本+双行计数器 | 纯图片+角标数字 |
| GIF缩略图 | 图片+caption栏(alt+提示) | 纯图片卡片 |
| 信息面板 | 图标容器+圆点+符号+图标装饰 | 纯文本层次 |
| Modal外壳 | 渐变背景+彩色边框+投影 | 纯色+素边框 |
| 滚动 | Modal打开时背景可滚动 | 完全锁定 |
| 整体感 | 装饰元素~15处 | 装饰元素~3处 |
