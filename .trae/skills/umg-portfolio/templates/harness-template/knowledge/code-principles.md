# Code Principles — 代码设计哲学

> 📎 Visual/Animation design principles → **ui-ux-pro-max** Skill
> 本文件仅保留**代码层面**的设计哲学。

## 数据哲学: 防御性乐观主义

先假设数据存在 (渲染 UI)，同时准备好数据不存在时的 fallback:

```tsx
const data = content?.section ?? defaultData;
const { title = '' } = data;
{items.length > 0 && items.map(item => <Card {...item} />)}
```

乐观渲染 (用户立即看到内容) + 防御性访问 (不会崩溃)。

## 代码哲学: 极简实用

- 不抽象不需要的东西
- 不拆分不需要的组件
- 不写不需要的注释
- 不引入不需要的依赖
每一行代码都要回答: "没有它会怎样?" 如果答案是"没什么", 删掉它。
