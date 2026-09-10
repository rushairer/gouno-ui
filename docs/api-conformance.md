# Gouno UI API 合规清单

核查基线：2026-09-10。目标依据：[公共 API 规范](api-specification.md)。

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
| API-020 | Core `CodeBlock` 使用 `code` 作为唯一权威源码；拥有只读代码框、横向滚动、可选语言标识与复制成功反馈。`renderCode(code)` 仅是呈现钩子并接收同一 `code`，语法高亮/解析引擎继续由调用方拥有，不把 Prism、rehype 等第三方类型或依赖固化进公共 API。 | Core CodeBlock docs/focused tests / PD-038 |
| API-021 | Core `Anchor` 保持真实 `<a href="#...">` 章节链接与标准 `aria-label`/HTML 属性；默认 `offset=0` 不劫持原生 hash 导航。调用方显式设置 `offset` 时，滚动目标必须按 `scrollY + target.top - offset` 计算，而不是把 offset 本身当绝对滚动位置。Sticky header 优先由目标 heading 的 `scroll-margin-top` 拥有。 | Core Anchor same-source demo/focused tests / PD-039 |
| API-022 | Core `Empty` 只拥有 caller-owned `title/description/icon/action` 与标准 div/ARIA 扩展；不提供默认业务文案、不制造 Card-like border/shadow/radius，也不默认声明 live region。Surface 和动态播报策略由调用方按真实语义拥有。 | Core Empty same-source demos/API docs/focused tests + Gosso Admin/Blog Admin/Blog public corpus / PD-046 |
| API-023 | Core `Result` 使用 `status/title/description/extra/children/headingLevel` 与标准 section/ARIA 扩展；`description` 是唯一补充说明入口，`headingLevel` 默认 2、页面主结果显式使用 1。Result 不默认声明 live region，不拥有 Card/elevation，并由自身 `p-8` 结果节奏拥有内容 inset；包装 Card 仅作为边界/elevation 时使用 `padding="none"`。默认状态图标为 decorative。 | Core Result same-source demos/API docs/focused tests + Gosso/Blog public terminal-result corpus / PD-047 |
| API-024 | Core `Skeleton` 只表达视觉结构占位并默认 `aria-hidden=true`；父级 loading region 拥有 `role`、可访问名称与 live-region 策略。尺寸、形状、间距通过标准 `className`/div 属性组合，reduced-motion 继续由全局 `base.css` 统一负责。Skeleton 不扩展为 Loading/AsyncState 或 `size/shape/avatar/paragraph` feature bag。 | Core Skeleton same-source demo/focused tests + Blog public/Blog Admin loading corpus + Gosso Spinner counter-evidence / PD-048 |
| API-025 | Core `QRCode` 使用标准 canvas/ARIA 属性与真实 canvas ref；`aria-label`/`aria-labelledby` 由调用方按用途提供，组件不注入英文默认可访问名称。`size` 是 width/height 的唯一公共尺寸入口，现有 `value/size/color/background/errorLevel` 保持单一职责；不保留 `ariaLabel` alias，也不扩展 status/refresh/icon/bordered/type feature bag。 | Core QRCode same-source demo/API docs/focused tests + Gosso MFA product validation / PD-049 |
| API-026 | Core `Statistic` 保持 `title/value/prefix/suffix` 的窄指标展示合同，并把标准 div/ARIA/data/event 属性与 ref 交给真实根元素。指标值/单位/格式化、动态播报和 Card/elevation 继续由调用方拥有；不加入 precision/formatter/trend/valueStyle/card 等 feature-bag API。 | Core Statistic same-source demo/API docs/focused tests + Blog Admin Dashboard/AI Operations corpus / PD-050 |
| API-027 | Core `Spin` 是已有内容区域的 busy-state wrapper：`spinning` 是唯一 busy 状态写入口并驱动根 `aria-busy`；根节点接受标准 div/ARIA/data/event 属性与真实 ref。Core `Spinner` 默认仅为 decorative 视觉指示器（`aria-hidden=true`），不自动创建 `role=status` 或英文 `Loading` 名称；独立语义场景只通过标准 ARIA 显式 opt-in。Spin/Spinner 不扩展 delay/fullscreen/custom-indicator/AsyncState feature bag。 | Core Spin/Spinner same-source demos + focused tests + Gosso OAuth callback product validation / PD-051 |
| API-028 | Core `Steps` 与 `Menu` 均使用稳定 `items[].key`；Steps 以 `current/onChange` 表达单一流程位置并保持 disabled step 非交互，Menu 以 `selectedKeys/defaultSelectedKeys` 与 `openKeys/defaultOpenKeys` 分离选择和展开状态，并支持层级 item/submenu/group/divider、single/multiple、inline/horizontal/vertical 与键盘 roving focus。两者只使用标准 DOM/ARIA 命名，不保留 `ariaLabel`/`danger`/`theme` 兼容面，也不注入英文可访问文案；产品需要可访问名称时通过标准 `aria-label`/`aria-labelledby` 显式提供。 | Steps/Menu same-source demos + API AST/focused behavior tests + main run 279 / PD-052 |
| API-029 | 每个 PascalCase Core runtime export 都必须显式归入一个可见 Core Showcase family，且 sealing audit 不允许 `needs-review` 或 `unassigned` 残留。Established Core 遵守 retention policy：无当前产品调用不能单独构成删除理由。`SearchField`/`CheckboxField` 由真实 Blog 消费验证并归入 Input/Checkbox；`AvatarImage`/`AvatarFallback` 归入 Avatar compound family；`Divider` 保留为 deprecated Separator compatibility sibling；`App`/`Container`/`AspectRatio`/`Stack` 保留并归入 Layout/Flex family。 | core-family-coverage + 5A/5B focused tests + main runs 281/283 / PD-053 |
| API-030 | 高层 `Tabs` 的 pre-reset `value/defaultValue/items[].value` 兼容输入在稳定包前已删除；唯一状态入口为 `activeKey/defaultActiveKey/items[].key/onChange`。Primitive `Tab`/`TabPanel value` 仅是组合层 key，不是第二套高层状态 API。标准 `aria-label`/`aria-labelledby` 是 canonical 可访问命名；`ariaLabel` 仅作为真实产品 vendored artifact 迁移期的 deprecated alias 暂留，且标准属性优先。 | Tabs type/source/docs gates + 548-test main run 285 / PD-054 |

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

上述高层兼容输入现已从 canonical `TabsProps`/`TabItem` 删除，下一 package artifact 只接受新的状态命名。`Tab` / `TabPanel` primitive 的 `value` 继续作为组合层稳定 key。`ariaLabel` 不属于 canonical API 命名，只因真实 Gosso/Showcase 产品仍锁定旧 vendored artifact 而暂时保留为 deprecated 迁移别名；新代码使用标准 `aria-label` / `aria-labelledby`，产品源码与 vendored artifact 在 0.2.0 升级阶段原子迁移后再移除别名。

Tabs 布局还遵循 structural/content spacing 分离：Tabs 自己拥有 TabBar 与 TabPanel 的结构间距，`TabPanel` 不默认注入业务内容 padding；四个方向只改变轴向，不改变这条职责。活动指示线始终绘制在 TabList 可视/滚动边界内部，滚动只用于真实标签溢出。

NavigationGroup 同样遵循 structural spacing ownership：组内 navigation item 使用统一紧凑节奏，组与下一个侧栏 section 的间距由 `NavigationGroup` 自己承担。`label` 是可选的可见标题，不是决定是否拥有 section spacing 的开关；独立一级入口应放入无标题 `NavigationGroup`，而不是在产品页面给裸 NavLink 追加 `margin`。

Alert 不再暴露 shadcn primitive 的颜色化 `variant="default|destructive"`。迁移为：

```text
variant="destructive" → type="error"
variant="default"     → type="info"（或按真实语义选择 success/warning）
纯文本 children        → title（主要提示）或 description（补充说明）
```

Alert 的 canonical `variant` 只表示 `outlined|filled` 视觉形态。当前 Ant Design 已弃用的 `message`、顶层 `onClose/afterClose/closeIcon/closeText` 不作为兼容别名进入 Gouno API；关闭生命周期统一放入 `closable` 对象。

Core `CodeBlock` 的复制源与显示源不拆成两套属性。`code` 是唯一权威字符串；`renderCode` 只能消费该字符串做 token/高亮呈现，不能提供另一个 source/value/children 写入口。语法引擎属于调用方，所以 Showcase 的 Prism 适配和 Blog 的 Markdown/rehype 组合可以共存而不污染 Core 依赖边界。

Core `Anchor` 的默认路径保持原生 hash 链接语义，不用组件 JS 重写浏览器滚动。真实阅读页的固定头部遮挡通过 heading `scroll-margin-top` 解决，因此键盘激活、复制链接和直接访问 hash 共用同一位置规则。只有调用方不能控制目标样式而显式传 `offset` 时，Anchor 才拦截本地 hash 点击并按目标真实位置减去偏移量平滑滚动；外部链接和缺失目标不被拦截。

Core `Empty` 不再把业务文案、Surface 或 live-region 策略当作默认组件行为。调用方必须显式提供需要展示的 `title/description`；需要边界时由真实 Card/Table/List/route surface 拥有；需要动态播报时通过标准 `role` / `aria-live` 显式声明。旧 `"No data"`、dashed border/radius 和自动 `role="status"` 都不是 canonical contract，也不通过兼容 alias 保留。

Core `Result` 不再暴露非 canonical `subTitle`，补充说明统一使用 `description`。Result 的标题默认是 H2；当它替代整页内容成为该路由主结果时，调用方显式使用 `headingLevel={1}`。静态 404/终态不被强制声明 `role="status"`，动态操作结果按需要显式选择标准 `role` / `aria-live`。Result 自己拥有结果内容节奏但不拥有 Card/surface/elevation；仅作为 Result 外壳的 Card 使用 `padding="none"`，避免父子重复 inset。旧固定 H2、自动 live-region 和 `subTitle` 都不通过兼容 alias 保留。

Core `Skeleton` 现在默认从辅助技术树中隐藏单个视觉占位块。业务如果需要播报“正在加载”，应把 `role="status"` / `aria-label` / `aria-live` 放在能描述整个 loading 区域的父容器，而不是让每个骨架块成为独立语义节点。显式 `aria-hidden={false}` 仍作为标准 DOM 覆盖存在，但不是常规推荐路径。尺寸和形状继续由 `className` 拥有；不添加 Skeleton-specific 业务状态或 presets。

Core `QRCode` 不再暴露非标准 `ariaLabel`，也不再注入英文 `"QR code"` 作为默认可访问名称。调用方根据实际业务用途使用标准 `aria-label` 或 `aria-labelledby`；其余标准 canvas/ARIA/data/className/style 属性与真实 canvas ref 直接透传。`size` 继续作为二维码 width/height 的唯一公共尺寸入口，因此不同时开放原生 `width`/`height` 第二写路径。当前 real `gosso-admin` 仍固定 `file:vendor/gouno-ui-0.1.0.tgz`，其 `MFAPanel` 的 `ariaLabel → aria-label` 必须与下一次 vendored Gouno UI artifact 刷新原子完成，不能单独先改产品源码制造类型不兼容。

Core `Spinner` 不再默认创建 `role="status"`，也不再注入英文 `"Loading"` 可访问名称；它默认 `aria-hidden=true`，仅负责旋转视觉。需要播报任务进度时，由能提供本地化状态文案的父级区域统一拥有 `role=status` / `aria-live`；确实独立使用 Spinner 且没有可见状态文字时，可显式设置 `aria-hidden={false}`、标准 `role` 与 `aria-label`。Core `Spin` 则用根 `aria-busy` 表达其已有内容区域正在忙，`tip` 与 overlay 不自动成为 live region。不要同时让父级和 Spinner 各自创建 status，避免重复播报。

Core `Steps` 不再接受缺少稳定 `key` 的流程项，也不使用 `description` 兼容旧的第二说明入口；流程项正文统一为 `content`，可选短补充使用 `subTitle`。当提供 `onChange` 时，仅非 disabled step 可交互；disabled step 保持非按钮内容并声明 `aria-disabled`。长流程的 `maxCount` 省略槽只呈现语言无关的省略标记，不注入英文屏幕阅读器文案。

Core `Menu` 的层级节点使用稳定 `key`，选择状态和展开状态分别由 `selectedKeys/defaultSelectedKeys` 与 `openKeys/defaultOpenKeys` 管理；单选、multiple、inline collapse、submenu/group/divider 和 keyboard roving focus 不通过业务别名拆出第二套状态 API。旧 `ariaLabel` 改为标准 `aria-label`；旧 `danger` 不再作为通用导航项属性，危险动作的业务语义由调用方动作/视觉组合表达；Core 不提供 `theme` 或 locale feature bag。Menu 根导航不会自动注入英文可访问名称，需要名称时由产品显式提供标准 ARIA。

Core runtime family sealing 现在要求所有 PascalCase runtime export 都有明确可见 family owner。这个“清零”不等于按当前使用率裁剪 API：established Core 在没有明确 maintainer 删除批准时按 retention policy 保留。低层 wrapper/compound sibling 可以归入现有 family 并通过 ref、DOM 语义、同源示例和 focused tests 硬化，而不是为每个导出制造独立 Showcase 页面。

## Core 继续验证原则

真实产品可以证明现有 Core 足够、证明缺少 product-agnostic 能力、发现 API 需要显式迁移，或证明某个 Core 本身不值得保留。所有调整继续受 `docs/api-specification.md` 约束；Gosso/Blog/Legacy prop 名称不是规范例外。

## 不得回退的边界

- 不把 Legacy 当 compatibility layer。
- 不为了减少 JSX 重复提前创建 Pattern/Gouno。
- 不把 Legacy 或模拟产品页放回 Showcase。
- 不创建 `src/candidates`；候选保留在产品局部代码 + `abstraction-register.md`。
- 不因 Ant Design/shadcn/ui 存在某组件就自动扩 Core；成熟库只用于 API/行为参考。
- 不把 Showcase tooling reuse 当成真实产品需求证据。