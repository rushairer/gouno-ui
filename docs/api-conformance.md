# Gouno UI API 合规清单

核查基线：2026-09-08。目标依据：[公共 API 规范](api-specification.md)。

本清单只描述**当前 canonical 公共面**的合规状态。2026-09-07 之前关闭的 DataTable、Toast、Panel、PageHeader、模板等记录仍可从 Git 历史追溯，但这些实现现已进入 `src/legacy`，不再属于当前公共 API，也不构成重新引入时的命名/结构先例。

Legacy 的历史实现不参加 canonical API 合规认证；任何重新进入 Core/Patterns/Gouno 的能力必须重新经过 [产品驱动抽象准入](product-driven-development.md)。

## 当前公共所有权

| Owner | 当前状态 | 说明 |
| --- | --- | --- |
| Core | active | 产品无关基础组件；继续按真实产品压力测试 API。 |
| Theme | active | ThemeProvider、ThemeToggle、useTheme 及主题/品牌类型。 |
| Patterns | empty by design | 当前没有经过真实产品重新认证的公共 Pattern。空层是合法状态，不是缺陷。 |
| Gouno | active/minimal | 仅 `AppShell`、`PageContainer`、`NavigationGroup`、`navigationItemClass`。 |
| Legacy | non-public | 不编译、不发布、不展示、canonical/Showcase 禁止依赖。 |

## 当前已验证架构/API 治理项

| ID / 规则 | 当前约束 | 主要实现/验证 |
| --- | --- | --- |
| API-001 / GOV-02 | 正式所有权保持 `Core → Theme → Patterns → Gouno` 单向依赖；Legacy 在 DAG 之外。 | `docs/architecture.md`、dependency/architecture tests |
| API-002 / GOV-02 | 每个 canonical public symbol 只有一个 owner；根入口只等于四层精确并集 + `cn`。 | `tests/public-api-ownership.test.ts` |
| API-003 / TYPE-01 | 每个 PascalCase runtime public component 必须从 owner 入口导出同名 `ComponentNameProps`。 | `tests/public-component-props.test.ts` |
| API-004 / TYPE-01 | `src/core/public-props.ts` 保持 type-only contract manifest，不能产生 runtime export。 | `tests/type-contract-manifest.test.ts` |
| API-005 / GOV-02 | 正式入口均使用显式 symbol manifest，不使用 layer-level `export *`。 | architecture tests |
| API-006 / GOV-02 | 不公开 `core/*`、`patterns/*`、`gouno/*`、`legacy/*` 源目录 wildcard subpath。 | `package.json`、architecture/legacy tests |
| API-007 / GOV-02 | Legacy 从 `tsconfig.json` / `tsconfig.build.json` 排除；canonical 与 Showcase 禁止 import Legacy。 | `tests/legacy-boundaries.test.ts` |
| API-008 / GOV-02 | Showcase 运行时只消费 canonical layer；不消费根 umbrella，也不消费 Legacy。 | `tests/showcase-boundaries.test.ts`、legacy tests |
| API-009 / GOV-02 | `ConfigProvider/useConfig/UIConfig` 等无行为效果的 speculative 全局配置仍不公开。 | architecture tests |
| API-010 / DOC-01 | Gouno UI Showcase 明确按 Core/Theme/Patterns/Gouno owner 展示；Core 内保留用途分类；只展示 canonical API。 | `showcase/catalog.tsx`、`showcase/main.tsx` |
| API-011 / DOC-01 | 产品空间只展示真实迁移页面；旧模拟产品页面不作为迁移结果保留。 | Showcase catalog/router |
| API-012 / GOV-02、NAME-01 | 共享应用结构采用中性 canonical 名称 `AppShell` / `PageContainer`；不保留 `AdminShell` / `AdminPage` 同义 alias。 | `src/gouno/app-shell.tsx`、`src/gouno/page-container.tsx` |
| API-013 / GOV-02 | Pattern 允许为空；不得为了填充目录恢复历史 DataTable/Toast/Feedback 等实现。 | `src/patterns/index.ts`、product-driven contract |
| API-014 / STATE/TYPE/DOC | Input、Textarea、Select、InputNumber、DatePicker、Upload、Form、Table、Pagination、Modal、Drawer 等已审 Core API 保持现有 focused tests / Showcase 文档约束。 | Core tests、Showcase Core documents |
| API-015 / DELIVERY | Node.js 24 下必须在 Pages 发布前通过 typecheck、tests、package build、Showcase build；Actions 固定 immutable SHA。 | workflow hardening tests |

## 当前破坏式迁移说明

产品驱动归零阶段明确移除了尚未重新认证的公共 Pattern/Gouno surface。典型历史 API 包括但不限于：

- Patterns: `DataTable`, `Feedback`, `AsyncState`, `Toast`, `ToastProvider`, `useToast`, `BulkActionBar`, `SectionNav`, `ConfirmDialog`。
- Gouno: `AdminShell`, `AdminPage`, `Panel`, `PageHeader`, `ActionGroup`, `FilterBar`, `TableContainer`, `ButtonGroup`, `DefinitionList`, `ListStack`, `DashboardTemplate`, `ListPageTemplate`, `EditorWorkspaceTemplate`, `StatusBadge`, `RiskBadge` 等。

其中只有应用结构被重新确认并以更精确的名称进入 canonical：

```text
AdminShell → AppShell
AdminPage  → PageContainer
```

这不是兼容 alias。未来发布 package artifact 时必须按 SemVer/迁移公告评估 breaking impact。当前使用旧 vendored archive 的产品可以在各自页面迁移前继续固定旧 artifact。

迁移说明见 [Migration guide](migration.md)。

## Core 继续验证的原则

当前 Core 覆盖面足以进入产品压力测试，但不意味着每个 API 已最终冻结。后续真实产品需求可以：

- 证明现有 Core API 足够，保持页面局部组合；
- 证明某个 Core 缺少真正 product-agnostic 能力，从而扩展 canonical API；
- 发现 API 命名/状态模型不理想并按规范执行显式迁移；
- 证明某个现有 Core 组件本身不值得保留。

所有调整仍以 `docs/api-specification.md` 为约束，不允许从 Gosso/Blog Legacy API 倒推同义命名。

## 当前验证基线

- Node.js 24
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`
- GitHub Actions `Publish Showcase to GitHub Pages`
- 外部 GitHub Actions immutable commit SHA

## 不得回退的边界

- 不把 Legacy 当 compatibility layer。
- 不为了减少 JSX 重复而提前创建 Pattern/Gouno。
- 不把 Legacy 重新放进 Showcase。
- 不把产品空间中的模拟页面当真实迁移进度。
- 不创建 `src/candidates` 或公开 incubator；候选留在产品局部代码 + `abstraction-register.md`。
- 不因为 Ant Design / shadcn/ui 存在某组件就自动扩充 Core。
- 不使用旧产品 prop/component 名称作为规范例外。
