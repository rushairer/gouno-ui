# Gouno UI API 合规清单

核查与整改日期：2026-09-07。目标依据：[公共 API 规范](api-specification.md)。本清单记录该规范发布时发现的差异，以及本轮完成的源码迁移和验证；它不是对未登记 API 的全库认证。

登记项不是例外许可。历史接口已移除，不保留同义别名；后续如需兼容迁移，必须按规范的变更与迁移流程单独评审。

## 已验证关闭的差异

| ID / 规则 | 已完成的整改 | 主要实现位置 | 验证 |
| --- | --- | --- | --- |
| API-001 / NAME-01、COMP-01 | `TableCaption` 与 `DataTable` 统一使用 `captionSide`，导出 `CaptionSide`；此前的 `position`、`captionPosition` 和 `TableCaptionPosition` 已移除。 | [Table primitives](../src/components/primitives/table.tsx)、[DataTable types](../src/patterns/data-table.types.ts)、[DataTable](../src/patterns/data-table.tsx) | TypeScript 公开入口检查、Table/DataTable 测试 |
| API-002 / NAME-02、COMP-03 | Popover 与 Tooltip 将 Radix 的 `side`/`align` 收敛为公开的 12 值 `placement` 和 `offset`；第三方定位属性被 `Omit`，仅在实现内部转换。 | [Popover](../src/components/primitives/popover.tsx)、[Tooltip](../src/components/primitives/tooltip.tsx)、[core exports](../src/core/index.ts) | TypeScript 检查、构建 |
| API-003 / NAME-02 | `Space.direction` 改为 `orientation="horizontal \| vertical"`。 | [Space](../src/core/layout.tsx)、[layout showcase](../showcase/demos/core/layout.tsx) | TypeScript 检查、Showcase 构建 |
| API-004 / NAME-02 | `Flex` 使用 CSS Flex 语义的 `direction`，完整支持四个方向；`Stack.direction` 同步补齐反向值；`Splitter` 使用 `orientation`，移除 `vertical` 布尔别名。 | [Flex](../src/core/layout.tsx)、[Stack](../src/core/layout-primitives.tsx)、[Splitter](../src/core/splitter.tsx) | TypeScript 检查、布局测试 |
| API-005 / NAME-03 | `Space.size` 改为 `gap`；`Space`、`Flex`、`Stack` 的数值 gap 均以 CSS px 解释，具名 gap 保留 token 语义。 | [Space/Flex](../src/core/layout.tsx)、[Stack](../src/core/layout-primitives.tsx) | 布局测试、Showcase 构建 |
| API-006 / NAME-03 | Button 常规尺寸仅为 `small/middle/large`，默认 `middle`；图标按钮通过 `IconButton` 与 `shape` 表达，不再使用 `size="icon"`。 | [Button](../src/core/button.tsx)、[Button showcase](../showcase/demos/core/general.tsx) | Button 测试、TypeScript 检查 |
| API-007 / NAME-03 | Button 的视觉形态 (`variant`) 与语义色 (`color`) 分离；Tag 的语义色从 `tone` 收敛为 `color`，并允许 CSS 颜色字符串作为明确的自定义扩展。 | [Button](../src/core/button.tsx)、[Tag](../src/core/tag.tsx)、[Tag showcase](../showcase/demos/core/tag.tsx) | Button/Tag 测试、TypeScript 检查 |
| API-008 / COMP-01 | `Button.iconPosition` 改为逻辑方向的 `iconPlacement="start \| end"`，示例和调用已迁移。 | [Button](../src/core/button.tsx)、[Button showcase](../showcase/demos/core/general.tsx) | Button 测试、TypeScript 检查 |
| API-009 / STATE-01 | Modal 与 Drawer 移除 `isOpen`，统一 `open/defaultOpen/onOpenChange` 的受控状态契约。 | [Modal](../src/core/modal.tsx)、[Drawer](../src/core/drawer.tsx) | Modal/Drawer 测试、TypeScript 检查 |
| API-010 / STATE-02 | AutoComplete 与 Tabs 的复合值回调统一为类型化 `onChange(value)`；Tabs 显式排除原语的冲突事件属性。 | [AutoComplete](../src/core/autocomplete.tsx)、[Tabs](../src/core/tabs.tsx)、[navigation patterns](../src/patterns/navigation-patterns.tsx) | 控件测试、TypeScript 检查 |
| API-011 / DOC-01 | Table、TableHeader、TableBody、TableFooter、TableRow、TableHead、TableCell 与 TableCaption 各有独立 API 表；caption 属性不再混入单元格表。 | [Table API sections](../showcase/demos/core/table/api-sections.ts) | Showcase 构建、人工文档审阅 |
| API-012 / TYPE-01、COMP-03 | Table 家族定义并从 core 正式入口导出具名 Props 类型，包括 `TableCaptionProps`。 | [Table primitives](../src/components/primitives/table.tsx)、[core exports](../src/core/index.ts) | TypeScript 公开入口检查 |
| API-013 / TYPE-01 | `DataTableProps.columns` 和 `dataSource` 接受 `readonly` 数组，保持泛型与调用方不可变数据的兼容。 | [DataTable types](../src/patterns/data-table.types.ts) | DataTable 测试、TypeScript 检查 |
| API-014 / STYLE-01 | DataTable 两个模式都拥有稳定的 `data-table` 根容器；`className` 不再在 Table 与外层容器之间漂移。 | [DataTable](../src/patterns/data-table.tsx) | DataTable 测试、Showcase 构建 |
| API-015 / COMP-03、STATE-03 | DataTable 的组合模式与数据模式都支持 caption；使用 `caption !== undefined`，因此 `0`、空字符串等合法内容不会因真假判断丢失。 | [DataTable](../src/patterns/data-table.tsx) | DataTable 测试、TypeScript 检查 |
| API-016 / DOM-01、A11Y-01 | Modal/Drawer 移除自定义 `ariaLabel`，改用原生 `aria-label` 并作用于 dialog 内容节点。 | [Modal](../src/core/modal.tsx)、[Drawer](../src/core/drawer.tsx)、[feedback showcase](../showcase/demos/core/feedback.tsx) | Modal/Drawer 测试、Showcase 构建 |

## 本轮验证基线

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run showcase:build`
- `git diff --check`

上述命令在本次整改完成后执行。可视化验证覆盖 Showcase 中 TableCaption、DataTable 和迁移后的公共 API 示例。

## 仍需遵守的边界

- Radix 等第三方内部实现可继续使用 `side`、`align` 和 `onValueChange`；它们不得绕过 Gouno 的公开适配层。
- `Text.tone`、反馈组件的内部 `tone` 等未登记 API 不属于 Tag 的公共语义色接口，不能据此为 Tag 恢复 `tone`。
- `density="default \| compact \| touch"`、弹窗宽度和二维码像素尺寸具有独立语义，不能机械套用控件 `size`。

## 后续登记与关闭

新增发现使用新的 `API-` 编号，不覆盖本表历史记录。关闭一项至少要同时更新实现、公开类型、组件自身 API 表和示例，并附上适用的自动化或可视验证证据。规范例外需要记录规则号、限定组件、原因、替代方案、影响、维护模块、退出条件和评审依据；没有批准记录的例外不得实现。
