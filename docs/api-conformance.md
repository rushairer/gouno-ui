# Gouno UI API 合规清单

核查与整改日期：2026-09-07。目标依据：[公共 API 规范](api-specification.md)。本清单记录规范发布后发现的差异、完成的源码迁移和架构治理；它不是对未登记 API 的全库认证。

登记项不是例外许可。历史接口已移除，不保留同义别名；后续如需兼容迁移，必须按规范的变更与迁移流程单独评审。

## 已验证关闭的差异

| ID / 规则 | 已完成的整改 | 主要实现位置 | 验证 |
| --- | --- | --- | --- |
| API-017 / TYPE-01、STATE-03、DOC-01 | Card、Heading、Text、Spinner、Progress、AspectRatio、Kbd、Typography 补充具名 Props；Card 子组件建立独立 API 表；CardHeader 保留 `0`/空字符串；Progress 对非法边界归一化并保持有效 ARIA 数值；相关 Preview/Code 同源。 | [Card](../src/core/card.tsx)、[Typography](../src/core/typography.tsx)、[Spinner](../src/core/spinner.tsx)、[Progress](../src/core/progress.tsx)、[AspectRatio](../src/core/aspect-ratio.tsx)、[Kbd](../src/core/kbd.tsx) | typecheck、Core 回归测试、Showcase build |
| API-018 / STATE-02、DOC-02 | Select 增加 `allowClear`/`onClear`；清除操作保持受控契约并补充清除状态、反馈 Demo。 | [Select](../src/core/select.tsx)、[Select demos](../showcase/demos/core/data-entry.tsx) | typecheck、tests、build |
| API-019 / STATE-02、COMP-03、A11Y-01 | Select 支持 `multiple/tags`、搜索、Tag、`maxTagCount`、键盘与可访问 Listbox；隐藏原生 select 保留表单序列化与 ref。 | [Select](../src/core/select.tsx)、[Select tests](../tests/core-entry-controls.test.tsx) | typecheck、行为测试 |
| API-001 / NAME-01、COMP-01 | `TableCaption` 与 `DataTable` 统一 `captionSide`，移除旧位置别名。 | [Table](../src/components/primitives/table.tsx)、[DataTable](../src/patterns/data-table.tsx) | TypeScript、Table/DataTable tests |
| API-002 / NAME-02、COMP-03 | Popover/Tooltip 将 Radix `side/align` 收敛为公开 `placement/offset`。 | [Popover](../src/components/primitives/popover.tsx)、[Tooltip](../src/components/primitives/tooltip.tsx) | typecheck、build |
| API-003 / NAME-02 | `Space.direction` 改为 `orientation`。 | [Space](../src/core/layout.tsx) | typecheck、Showcase build |
| API-004 / NAME-02 | Flex 使用 CSS `direction`，Stack 补齐反向值，Splitter 使用 `orientation`。 | [Flex](../src/core/layout.tsx)、[Stack](../src/core/layout-primitives.tsx)、[Splitter](../src/core/splitter.tsx) | typecheck、layout tests |
| API-005 / NAME-03 | Space/Flex/Stack 数值 gap 统一为 CSS px，具名 gap 使用共享 token。 | [Layout](../src/core/layout.tsx)、[Stack](../src/core/layout-primitives.tsx) | layout tests、Showcase build |
| API-006 / NAME-03 | Button 常规尺寸统一 `small/middle/large`；图标按钮由 IconButton/shape 表达。 | [Button](../src/core/button.tsx) | Button tests、typecheck |
| API-007 / NAME-03 | Button 的 `variant` 与 `color` 分离；Tag 从 `tone` 收敛到 `color`。 | [Button](../src/core/button.tsx)、[Tag](../src/core/tag.tsx) | Button/Tag tests、typecheck |
| API-008 / COMP-01 | Button 图标位置统一为 `iconPlacement="start | end"`。 | [Button](../src/core/button.tsx) | tests、typecheck |
| API-009 / STATE-01 | Modal/Drawer 统一 `open/defaultOpen/onOpenChange`。 | [Modal](../src/core/modal.tsx)、[Drawer](../src/core/drawer.tsx) | tests、typecheck |
| API-010 / STATE-02 | AutoComplete/Tabs 复合值回调统一类型化 `onChange(value)`；Tabs 显式排除冲突事件属性。 | [AutoComplete](../src/core/autocomplete.tsx)、[Tabs](../src/core/tabs.tsx) | control tests、typecheck |
| API-011 / DOC-01 | Table 家族每个公开 JSX 组件拥有独立 API 表。 | [Table API sections](../showcase/demos/core/table/api-sections.ts) | Showcase build、人工审阅 |
| API-012 / TYPE-01、COMP-03 | Table 家族从 Core 正式入口导出具名 Props。 | [Table](../src/components/primitives/table.tsx)、[Core exports](../src/core/index.ts) | TypeScript public entry check |
| API-013 / TYPE-01 | `DataTableProps.columns/dataSource` 接受 readonly 数组。 | [DataTable types](../src/patterns/data-table.types.ts) | DataTable tests、typecheck |
| API-014 / STYLE-01 | DataTable 两模式拥有稳定 `data-table` 根节点，className owner 固定。 | [DataTable](../src/patterns/data-table.tsx) | tests、Showcase build |
| API-015 / COMP-03、STATE-03 | DataTable 两模式都支持 caption，并保留合法 falsy ReactNode。 | [DataTable](../src/patterns/data-table.tsx) | tests、typecheck |
| API-016 / DOM-01、A11Y-01 | Modal/Drawer 使用原生 `aria-label` 并作用到 dialog 节点。 | [Modal](../src/core/modal.tsx)、[Drawer](../src/core/drawer.tsx) | tests、Showcase build |
| API-020 / GOV-02、COMP-03、TYPE-01 | 建立 `Core → Theme → Patterns → Gouno` 正向依赖层级；业务状态标签和页面抽象归 Gouno；低层不得依赖高层。 | [Core](../src/core/index.ts)、[Theme](../src/theme/index.ts)、[Patterns](../src/patterns/index.ts)、[Gouno](../src/gouno/index.ts) | architecture/dependency tests、typecheck、tests、build |
| API-021 / GOV-02、COMP-03、TYPE-01、DOC-01 | 完成公共面纯化：移除 `core/*/patterns/*/gouno/*` 源目录通配 subpath；Patterns 不再二次导出 Core Form 或重复实现 Tabs/Pagination；Theme 独立为唯一 owner；BulkActionBar 去产品 AI 语义；Core 拆除 `misc/visual/date-time` 聚合实现；Gouno layout 改为纯 barrel 并拆分 Panel/Page/DefinitionList/ListStack 家族；移除 `WorkspacePanel`/`AdminPageHeader` 同义 alias；`TableDensity` 仅由 Core owner。 | [package exports](../package.json)、[Core](../src/core/index.ts)、[Patterns](../src/patterns/index.ts)、[Theme](../src/theme/index.ts)、[Gouno layout](../src/gouno/layout.tsx)、[Architecture tests](../tests/architecture-boundaries.test.ts) | staged main commits、GitHub Actions typecheck/tests/package build/Showcase build |
| API-022 / GOV-02、TYPE-01、COMP-03、DOC-01 | 进一步硬化架构纯度：Feedback/AsyncState/Toast 分离 owner；DataTable 状态与派生逻辑下沉 private model 且不再 re-export Table primitives；四个正式 layer 入口全部改成显式 symbol manifest；TypeScript checker 验证 type-only symbol 唯一 owner 与 root 精确并集；真实 import/export DAG 自动校验；Gouno 模板补齐具名 Props；ToastProvider/useToast/Toast 统一到单一 Sonner backend。 | [Architecture contract](architecture.md)、[Feedback](../src/patterns/feedback.tsx)、[AsyncState](../src/patterns/async-state.tsx)、[Toast](../src/patterns/toast.tsx)、[DataTable model](../src/patterns/data-table-model.ts)、[Public ownership tests](../tests/public-api-ownership.test.ts)、[Dependency graph tests](../tests/dependency-graph.test.ts) | focused Toast tests、architecture tests、typecheck、tests、package build、Showcase build、main GitHub Actions |
| API-023 / TYPE-01、GOV-02 | 将具名 Props 约束提升为全库正式契约：Core、Theme、Patterns、Gouno 的每个 PascalCase runtime public component 都必须从所属正式入口导出同名 `ComponentNameProps`；测试直接读取 TypeScript symbol table，不使用组件白名单。复杂组件继续导出手写精确类型，简单 wrapper/compound primitive 使用 type-only runtime-derived alias，避免契约漂移。 | [Core public Props](../src/core/public-props.ts)、[Core exports](../src/core/index.ts)、[Patterns exports](../src/patterns/index.ts)、[Theme provider](../src/theme/provider.tsx)、[Props contract test](../tests/public-component-props.test.ts) | zero-whitelist TypeScript checker test、typecheck、tests、package build、Showcase build |
| API-024 / GOV-02、COMP-01 | 移除无行为效果的 `ConfigProvider/useConfig/UIConfig`。该上下文仅保存 `componentSize/direction`，但没有任何正式组件消费；项目内外消费者检索也未发现真实调用。未来若重新引入全局配置，必须和实际组件消费、优先级、文档、示例及行为测试一并设计。 | [Core exports](../src/core/index.ts)、[Architecture tests](../tests/architecture-boundaries.test.ts)、[Migration guide](migration.md) | consumer code search、architecture tests、typecheck、tests、build |

## 公共 API 兼容说明

- `StatusBadge`、`StatusIndicator`、`RiskBadge` 只属于 `@gouno/ui/gouno`。
- `FilterBar`、`AdminPageState` 只属于 `@gouno/ui/gouno`。
- `FormLayout`、`FormGrid`、`FormActions` 只属于 `@gouno/ui/core`，Patterns 不再转出。
- `Tabs`、`Pagination` 只属于 `@gouno/ui/core`；Patterns 的历史重复实现和 `SubnavTabs` alias 已移除。
- `ThemeProvider`、`useTheme`、`ThemeToggle` 的正式 owner 是 `@gouno/ui/theme`；根入口继续提供便捷聚合导入，`@gouno/ui/gouno` 不再转出 Theme API。
- `TableDensity` 的正式 owner 是 Core Table API；DataTable 继续使用该类型，但 Patterns 不再建立第二个导出位置。
- `BulkActionBar` 只处理 selection/action composition；AI 等产品动作通过 `children` 组合。
- 物理文件不再自动成为 public subpath。消费者必须使用包根或 `core/patterns/gouno/theme` 正式入口。
- `WorkspacePanel`、`AdminPageHeader` 同义 alias 已移除，分别使用 `Panel`、`PageHeader`。
- `DataTable` 仍是唯一公开表格 Pattern；`useDataTableModel`/`DataTableRecord` 为 private implementation，不从正式入口导出。
- `ConfigProvider`、`useConfig`、`UIConfig` 已移除；此前设置不会改变任何正式组件行为，因此不提供替代兼容 alias。

这些变化包含公开导出归属调整和破坏式兼容影响。发布时必须按 SemVer 评估主版本或提供明确迁移公告；本轮不自动修改版本号、不发布包。迁移路径见 [Migration guide](migration.md)。

## 已知边界

DataTable 是同一领域的复合 Pattern。公开契约保持单一；sorting/filtering/pagination/selection/expansion 的模型状态与派生已移动到 private model。后续如拆 render helpers，仍不得扩大 public API。

根 `@gouno/ui` 保留作为兼容 umbrella，但不拥有独立 symbol。正式 owner 仍只有 Core/Theme/Patterns/Gouno，根入口必须持续通过精确并集测试。

Showcase 的历史源码仍允许使用仓库内相对 layer import；后续应进一步移除对根 `src/index.ts` umbrella 的运行时依赖，使文档自身也作为 canonical owner 的真实消费者。

## 本轮验证基线

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`
- GitHub Actions `Publish Showcase to GitHub Pages`

## 仍需遵守的边界

- Radix 等内部实现可使用 `side`、`align`、`onValueChange`，但不得绕过公开适配层。
- `Text.tone` 等独立语义不能被用来恢复 Tag 的 `tone`。
- `density="default | compact | touch"`、弹窗宽度、二维码像素尺寸具有独立语义，不机械套用 control size。
- 每个 public symbol 必须只有一个 canonical owner；barrel 只能负责导出，不能承载无关实现；不得重新引入源目录 wildcard exports 或同义 alias。
- 每个正式 public JSX runtime component 必须有同 owner 的 `ComponentNameProps` 导出；此规则没有组件白名单。
- 正式层依赖只能沿 `Core → Theme → Patterns → Gouno` 正向组合；实现模块禁止反向依赖、禁止绕回根 umbrella、禁止内部依赖正式 layer barrel。
- 不得发布未被任何正式组件消费的“预留式”全局配置上下文；全局配置必须有明确行为、优先级和回归测试。

## 后续登记与关闭

新增发现使用新的 `API-` 编号，不覆盖历史记录。关闭一项至少同步更新实现、公开类型、组件自身 API 表/示例和适用测试；规范例外必须记录规则号、组件、原因、影响、替代方案、维护 owner 与退出条件。
