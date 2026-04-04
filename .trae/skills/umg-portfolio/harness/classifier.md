# Task Classifier — 6-Axis Taxonomy

> 定义如何将用户输入分类到 6 个维度。Router 根据分类结果选择加载的模块。

## Axis 1: Type (任务类型)

| Value | 触发词 | 示例 |
|-------|--------|------|
| fix | 修复/解决/bug/报错/崩溃/不工作/报错/出错 | "修复 Contact 表单提交后白屏" |
| feature | 新建/添加/实现/增加/做个/加个 | "给 Projects 卡片加 3D tilt" |
| refactor | 重构/优化/整理/简化/合并/拆分 | "把 Projects.tsx 拆成小组件" |
| review | 审查/检查/review/有没有问题/好不好 | "帮我 review Hero 动画" |
| debug | 排查/为什么/怎么/定位/怎么回事 | "为什么粒子背景不显示" |
| test | 测试/测试用例/覆盖/验证 | "给内容编辑器加表单验证" |
| deploy | 部署/发布/build/CI/CD/push | "部署最新版本到 Pages" |

## Axis 2: Uncertainty (不确定度)

| Value | 判定标准 | 示例 |
|-------|---------|------|
| low | 明确的单一变更, 有现成参照, 结果可预测 | "把 CTA 按钮颜色改成 #00a8e8" |
| medium | 需要少量设计决策, 有 2~3 个可行方案 | "重新设计 Skills 区域布局" |
| high | 开放性问题, 需要探索/研究/原型/架构决策 | "重构整个数据层以支持多语言" |

## Axis 3: Scope (影响范围)

| Value | 判定标准 | 示例 |
|-------|---------|------|
| single-file | 只改一个文件 | "调整 Footer 字体大小" |
| multi-file | 改 2~5 个相关文件 | "新增 Testimonials Section" |
| repo-wide | 影响配置/构建/全局样式 | "升级 Next.js 到 17" |

## Axis 4: Domain (技术领域)

| Value | 判定标准 | 示例 |
|-------|---------|------|
| visual | 颜色/排版/间距/UI 组件/布局 | "修改 About 区块间距" |
| animation | 动画/过渡/交互/动效/motion | "优化卡片 hover 效果" |
| data | 数据模型/状态管理/API/存储 | "添加新的编辑字段" |
| architecture | 目录结构/架构/依赖/构建 | "拆分 components 为子目录" |
| style | CSS/Tailwind/主题/变量 | "统一按钮样式系统" |
| config | 配置文件/环境变量/next.config | "修改 basePath" |

## Axis 5: Blast Radius (爆炸半径)

| Value | 判定标准 | 示例 |
|-------|---------|------|
| component | 只影响一个组件内部 | "修改 ProjectCard 内部结构" |
| section | 影响整个 section 及其子组件 | "重做 Hero 区域" |
| system | 影响全局状态/构建/路由/数据流 | "重构 ContentProvider" |

## Axis 6: Verifiability (可验证性)

| Value | 判定标准 | 示例 |
|-------|---------|------|
| easy | 肉眼可见, 一眼判断对错 | "改文字颜色" |
| medium | 需要简单测试或对比才能确认 | "优化动画流畅度" |
| hard | 需要多场景测试/性能分析/边界条件 | "修复移动端响应式问题" |

## Classification Examples

| 输入 | type | uncertainty | scope | domain | blast_radius | verifiability |
|------|------|-------------|-------|--------|-------------|---------------|
| 给 Projects 卡片加 3D tilt | feature | low | multi-file | animation | component | easy |
| 重构 ContentProvider | refactor | high | repo-wide | architecture | system | hard |
| 修复 Contact 表单提交 bug | fix | medium | multi-file | data | section | medium |
| 为什么粒子背景不显示 | debug | medium | single-file | visual | component | easy |
| 新增 Testimonials Section | feature | medium | multi-file | architecture | section | medium |
| 部署到 GitHub Pages | deploy | low | repo-wide | config | system | easy |
