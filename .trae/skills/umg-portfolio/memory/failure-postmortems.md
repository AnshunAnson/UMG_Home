# Failure Postmortems

> 每个失败/回滚/bug 的详细复盘。
> 来源: v2 anti-patterns 转化 + 未来运行中发现的新问题。

## FP-001: 无防御属性访问 (Seeded from v2 Anti-Pattern #1)

**What happened**: 直接访问可能为 undefined 的嵌套属性导致白屏
**Root cause**: data 对象在 fetch 完成前或格式不匹配时为 undefined
**Fix**: 使用 optional chaining (`?.`) + nullish coalescing (`??`) + 长度检查
**Lesson learned**: 所有外部数据访问必须带 fallback
**Prevention**: 已写入 constraints/anti-patterns.md 陷阱 1

## FP-002: 硬编码 fetch 路径 (Seeded from v2 Anti-Pattern #2)

**What happened**: 本地 dev 正常，GitHub Pages 部署后 404
**Root cause**: basePath `/UMG_Home` 未被拼接
**Fix**: ContentProvider 中检测 window.location.pathname 前缀
**Lesson learned**: 所有 fetch URL 必须 basePath 感知
**Prevention**: 已写入 constraints/hard-rules.md #7

## FP-003: 阻塞式数据加载 (Seeded from v2 Anti-Pattern #3)

**What happened**: 用户看到空白 Loading 页面直到 fetch 完成
**Root cause**: useState(null) + await 渲染
**Fix**: useState(defaultContent) 先渲染，useEffect 后台异步合并
**Lesson learned**: 渲染永远不能被数据加载阻塞
**Prevention**: 已写入 constraints/hard-rules.md #8

## FP-004: CSS 变量在内联 style 中失效 (Seeded from v2 Anti-Pattern #5)

**What happened**: Tailwind v4 内联 style 不解析 var(--xxx)
**Root cause**: Tailwind v4 不支持 CSS 变量在 style 属性中的运行时解析
**Fix**: 使用硬编码色值 bg-[#00d4aa] 或 style={{ background: '#00d4aa' }}
**Lesson learned**: 内联 style 只用字面量
**Prevention**: 已写入 constraints/anti-patterns.md 陷阱 5

<!-- MANUAL-START:postmortems -->
<!-- 发现新问题时追加到这里 -->
<!-- MANUAL-END:postmortems -->
