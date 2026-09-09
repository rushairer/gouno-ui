# Gouno UI API 合规清单

核查基线：2026-09-09。目标依据：[公共 API 规范](api-specification.md)。

本清单只描述当前 canonical 公共面。`src/legacy` 不参加 canonical API 合规认证，也不构成重新引入时的命名/结构先例。

## 当前公共所有权

| Owner | 当前状态 | 说明 |
| --- | --- | --- |
| Core | active | 产品无关基础组件；按真实产品持续压力测试 API。 |
| Theme | active | ThemeProvider、ThemeToggle、useTheme 及主题/品牌类型。 |
| Patterns | active/minimal | 当前仅准入 `BulkActionBar`；继续要求跨真实产品证据，不恢复历史 feature bag。 |
| Gouno | active/minimal | `AppShell`、`PageContainer`、`PageHeader`、`NavigationGroup`、`navigationItemClass`。 |
| Legacy | non-public | 不编译、不发布、不展示、canonical/Showcase 禁止依赖。 |

## 已验证治理项

| ID | 当前约束 | 主要验证 |
| --- | --- | --- |
| API-001 | 正式所有权保持 `Core → Theme → Patterns → Gouno`；Legacy 在 DAG 外。 | architecture/dependency tests |
| API-002 | 每个 canonical public symbol 只有一个 owner；根入口为四层精确并集 + `cn`。 | public-api ownership tests |
| API-003 | 每个 PascalCase runtime public component 导出同 owner `ComponentNameProps`。 | public-component-props test |
| API-004 | `src/core/public-props.ts` 为 type-only manifest。 | type-contract-manifest test |
| API-005 | 正式入口使用显式 symbol manifest，不使用 layer-level `export *`。 | architecture tests |
| API-006 | 不公开 `core/*`、`patterns/*`、`gouno/*`、`legacy/*` wildcard subpath。 | package/architecture tests |
| API-007 | Legacy 从构建排除；canonical 与 Showcase 禁止 import Legacy。 | legacy-boundaries test |
| API-008 | Showcase 运行时只消费 canonical layer，不消费 root/Legacy。 | Showcase boundary tests |
| API-009 | `ConfigProvider/useConfig/UIConfig` 等无实际消费者的 speculative 全局配置不公开。 | architecture tests |
| API-010 | Gouno UI Showcase 按 Core/Theme/Patterns/Gouno owner 展示；产品空间只显示真实迁移页面。 | Showcase catalog/router |
| API-011 | 共享应用结构使用 `AppShell` / `PageContainer` 中性名称；不保留 `AdminShell` / `AdminPage` alias。 | Gouno source/tests |
| API-012 | `PageHeader` 重新准入后只有 `title/description/actions/className`；不恢复 `action/actions` 双入口。 | PageHeader tests / PD-011 |
| API-013 | Pattern 层只保留经真实产品重新认证的窄职责抽象；当前准入 `BulkActionBar`。System Management 等表格证据继续只触发 DataTable review，不恢复 Legacy feature bag。 | BulkActionBar focused tests / product fixtures / PD-012 |
| API-014 | Tabs canonical 高层 API 使用 `activeKey/defaultActiveKey/items[].key/onChange`，默认 line 视觉；Radix 保持行为/a11y。 | Tabs docs/tests / PD-010 |
| API-015 | Showcase-local tooling 重复仅算辅助证据，不能单独创建公共抽象。 | architecture / PD-009 |
| API-016 | Node.js 24 下 Pages 发布前必须通过 typecheck、tests、package build、Showcase build。 | workflow hardening |
| API-017 | Alert 使用 `title/description/type/showIcon/icon/action/closable/banner/variant/classNames/styles` canonical API；语义 type 与视觉 variant 分离，并提供 `Alert.ErrorBoundary`。 | Alert docs/focused tests / PD-015 |
| API-018 | 复合组件负责自身语义区域之间的 structural spacing；内容槽内部 padding/rhythm 由内容拥有者负责。Tabs 四个 `tabPosition` 保持同一 TabBar↔Panel 间距语义，active indicator 不得扩大 TabList 的滚动区域。 | Tabs docs/focused tests / PD-020 |
| API-019 | `NavigationGroup` 拥有侧栏导航 section 的组内与组间节奏；`label` 可选。带 label 的组渲染可见标题，无 label 的组用于概览等独立一级入口并保持相同 section spacing，产品不得复制 `mb-*` 修补组间距。 | NavigationGroup focused test / AppShell Showcase / Gosso Admin |

## 当前破坏式迁移说明

产品驱动归零阶段移除了尚未重新认证的历史 Pattern/Gouno surface，例如 DataTable、Toast、Feedback、AsyncState、ConfirmDialog、Panel、ActionGroup、FilterBar、模板和业务状态组件。

当前重新准入的 Pattern 只有 `BulkActionBar`。它只拥有批量选择上下文、产品动作插槽、取消入口和 toolbar/sticky 语义；资源列表、选择状态、确认流程、AI/发布/删除等业务动作继续由产品拥有。它不能作为恢复 DataTable、FilterBar 或通用 feature bag 的先例。

已重新确认的能力必须以新的 canonical contract 为准：

```text
AdminShell → AppShell
AdminPage  → PageContainer
历史 PageHeader → 新 PageHeader(title, description?, actions?, className?)
```

这不是兼容 alias。未来发布 package artifact 时应按 SemVer/迁移公告评估 breaking impact。当前使用旧 vendored archive 的产品可以在页面迁移前继续固定旧 artifact。

`FormActions.surface` 也已从 canonical API 移除：该属性只产生没有任何样式定义或运行时语义的迁移期 class hook。需要特殊 action-surface 组合时应通过明确的父级 surface anatomy 或 `className` 表达，而不是恢复无效布尔属性。

Tabs 迁移采用单一 canonical 命名：

```text
value         → activeKey
defaultValue  → defaultActiveKey
items[].value → items[].key
onValueChange → onChange
```

旧值仅作为迁移期临时兼容输入，不是第二套文档 API，并应在下一个稳定 package release 前删除。

Tabs 布局还遵循 structural/content spacing 分离：Tabs 自己拥有 TabBar 与 TabPanel 的结构间距，`TabPanel` 不默认注入业务内容 padding；四个方向只改变轴向，不改变这条职责。活动指示线始终绘制在 TabList 可视/滚动边界内部，滚动只用于真实标签溢出。

NavigationGroup 同样遵循 structural spacing ownership：组内 navigation item 使用统一紧凑节奏，组与下一个侧栏 section 的间距由 `NavigationGroup` 自己承担。`label` 是可选的可见标题，不是决定是否拥有 section spacing 的开关；独立一级入口应放入无标题 `NavigationGroup`，而不是在产品页面给裸 NavLink 追加 `margin`。

Alert 不再暴露 shadcn primitive 的颜色化 `variant="default|destructive"`。迁移为：

```text
variant="destructive" → type="error"
variant="default"     → type="info"（或按真实语义选择 success/warning）
纯文本 children        → title（主要提示）或 description（补充说明）
```

Alert 的 canonical `variant` 只表示 `outlined|filled` 视觉形态。当前 Ant Design 已弃用的 `message`、顶层 `onClose/afterClose/closeIcon/closeText` 不作为兼容别名进入 Gouno API；关闭生命周期统一放入 `closable` 对象。

## Core 继续验证原则

真实产品可以证明现有 Core 足够、证明缺少 product-agnostic 能力、发现 API 需要显式迁移，或证明某个 Core 本身不值得保留。所有调整继续受 `docs/api-specification.md` 约束；Gosso/Blog/Legacy prop 名称不是规范例外。

## 不得回退的边界

- 不把 Legacy 当 compatibility layer。
- 不为了减少 JSX 重复提前创建 Pattern/Gouno。
- 不把 Legacy 或模拟产品页放回 Showcase。
- 不创建 `src/candidates`；候选保留在产品局部代码 + `abstraction-register.md`。
- 不因 Ant Design/shadcn/ui 存在某组件就自动扩 Core；成熟库只用于 API/行为参考。
- 不把 Showcase tooling reuse 当成真实产品需求证据。
