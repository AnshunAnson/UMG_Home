# Animation Patterns — 项目参数参考

> 📎 Animation design principles & forbidden patterns → **ui-ux-pro-max** Skill
> 本文件仅保留**本项目的具体参数值**（从实际组件中提取）。

## 已有模式参考

| 模式 | 使用位置 | 核心特征 |
|------|---------|---------|
| variants + stagger | Hero 字母入场 | spring(d:12,s:100), rotateX:-90→0, delayChildren:0.3 |
| whileInView + isInView | 所有非 Hero section | once:true, margin:'-100px', opacity/y:0→1, duration:0.5~0.8 |
| useScroll + useTransform | Hero 视差 | offset:['start start','end start'], y:0→50%, opacity:1→0 |
| 鼠标跟随光晕 | Hero 背景 | spring(d:30,s:50), 600px blur-[120px], radial-gradient |
| 3D perspective tilt | Projects 卡片 | rotX/Y ±8°, translateZ(10px), 0.15s ease-out |
| 磁吸按钮 | Contact CTA | useSpring(d:15,s:150), offset * 0.4 |
| AnimatePresence | Modal 进退场 | opacity + scale + y, 0.3s |

## 过渡时间参考

| 场景 | duration | ease/type |
|------|----------|-----------|
| Hero 字母入场 | 0.6s | spring(d:12,s:100) |
| Section 块入场 | 0.5~0.8s | linear (whileInView) |
| 子元素 stagger delay | 0.1s 递增 | — |
| Hover 缩放/位移 | 0.2~0.3s | ease-out |
| 卡片 3D tilt | 0.15s | ease-out |
| 边框颜色变化 | 0.3s | ease |
| Modal 进出 | 0.3s | ease |
| 循环动画 | 2s | repeat: Infinity |
