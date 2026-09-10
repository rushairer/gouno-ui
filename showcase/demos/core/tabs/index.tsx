import { BasicTabs } from "./BasicTabs";
import BasicTabsSource from "./BasicTabs.tsx?raw";
import { ControlledTabs } from "./ControlledTabs";
import ControlledTabsSource from "./ControlledTabs.tsx?raw";
import { TabsVariants } from "./TabsVariants";
import TabsVariantsSource from "./TabsVariants.tsx?raw";
import { TabsPlacement } from "./TabsPlacement";
import TabsPlacementSource from "./TabsPlacement.tsx?raw";
import { PrimitiveTabs } from "./PrimitiveTabs";
import PrimitiveTabsSource from "./PrimitiveTabs.tsx?raw";
import type { ApiRow } from "../../../components/api-table";
import type { ComponentDocument } from "../../../components/component-page";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

const tabListApi: ApiRow[] = [
  {
    name: "type",
    type: '"line" | "card"',
    defaultValue: '"line"',
    description: "与高层 Tabs 相同的导航视觉形态。",
  },
  {
    name: "size",
    type: '"small" | "middle" | "large"',
    defaultValue: '"middle"',
    description: "控制 Tab 的固定高度与导航间距。",
  },
  {
    name: "tabPosition",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    description: "决定横向/纵向布局、边线方向与滚动轴。",
  },
  {
    name: "centered",
    type: "boolean",
    defaultValue: "false",
    description: "无 extra 时居中排列标签。",
  },
  {
    name: "extra",
    type: "ReactNode",
    description: "导航末端的补充操作或状态。",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "通常为同 owner 的 Tab。",
  },
  {
    name: "className",
    type: "string",
    description: "扩展 canonical TabsList surface。",
  },
  {
    name: "...TabsList props",
    type: "ComponentProps<typeof Primitive.TabsList>",
    description: "透传底层 tablist 的可访问性与原生属性。",
  },
];

const tabApi: ApiRow[] = [
  {
    name: "value",
    type: "string",
    description: "与对应 TabPanel 共享的稳定 key。该 primitive value 不等于高层 Tabs 的状态 API。",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "禁用标签并从可用激活目标中排除。",
  },
  {
    name: "size",
    type: '"small" | "middle" | "large"',
    defaultValue: '"middle"',
    description: "控制标签固定高度。",
  },
  {
    name: "tabPosition",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    description: "控制活动指示线和 card 边角方向。",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "标签文案、图标或轻量元数据。",
  },
  {
    name: "className",
    type: "string",
    description: "扩展 canonical Tab trigger。",
  },
  {
    name: "...TabsTrigger props",
    type: "ComponentProps<typeof Primitive.TabsTrigger>",
    description: "透传底层 tab trigger 属性。",
  },
];

const tabPanelApi: ApiRow[] = [
  {
    name: "value",
    type: "string",
    description: "与对应 Tab 的 primitive value 一致。",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "面板业务内容；TabPanel 不注入业务 padding。",
  },
  {
    name: "className",
    type: "string",
    description: "扩展 min-w-0/flex-1 的结构面板。",
  },
  {
    name: "...TabsContent props",
    type: "ComponentProps<typeof Primitive.TabsContent>",
    description: "透传底层 tabpanel 属性。",
  },
];

export const tabsDocument: ComponentDocument = {
  title: "Tabs 标签页",
  description:
    "采用 activeKey / defaultActiveKey / items[].key / onChange 的单一高层状态语义，并保留 TabList / Tab / TabPanel 组合能力。默认 line 样式使用轻量指示条；TabBar 与内容面板之间的结构间距由 Tabs 统一负责。",
  code: publicSource(BasicTabsSource),
  render: () => <BasicTabs />,
  demos: [
    {
      title: "受控状态与额外操作",
      description:
        "activeKey 由业务路由或页面状态持有；tabBarExtraContent 用于同一导航栏的补充操作。",
      code: publicSource(ControlledTabsSource),
      render: () => <ControlledTabs />,
    },
    {
      title: "Line 与 Card",
      description:
        "line 是默认产品导航样式；card 仅在明确需要卡片页签语义时使用。示例中的 Card padding 属于内容本身，不由 Tabs 注入。",
      code: publicSource(TabsVariantsSource),
      render: () => <TabsVariants />,
    },
    {
      title: "左侧标签页",
      description:
        "tabPosition 负责高层位置语义。Tabs 在四个方向统一拥有 TabBar 与 TabPanel 的 structural gap；面板内部 padding 仍由内容自己决定。",
      code: publicSource(TabsPlacementSource),
      render: () => <TabsPlacement />,
    },
    {
      title: "Primitive composition",
      description:
        "需要完全自定义标签结构时，仍使用 Tabs 作为状态根，并组合同 owner 的 TabList、Tab、TabPanel。Preview 与 Code 来自同一份源码。",
      code: publicSource(PrimitiveTabsSource),
      render: () => <PrimitiveTabs />,
    },
  ],
  api: [
    {
      name: "activeKey",
      type: "string",
      description: "受控激活项 key；由调用者与 onChange 共同维护。",
    },
    {
      name: "defaultActiveKey",
      type: "string",
      description:
        "非受控初始激活项；未提供时选择 items 中第一个未禁用项。",
    },
    {
      name: "items",
      type: "readonly TabItem[]",
      defaultValue: "[]",
      description:
        "标签项集合；每项必须使用稳定 key，并可提供 label、icon、children 与 disabled。高层 items[].value 已移除。",
    },
    {
      name: "onChange",
      type: "(activeKey: string) => void",
      description: "激活项变化回调。受控模式下由调用者更新 activeKey。",
    },
    {
      name: "type",
      type: '"line" | "card"',
      defaultValue: '"line"',
      description: "视觉形态。默认 line 使用连续边线与活动指示条。",
    },
    {
      name: "size",
      type: '"small" | "middle" | "large"',
      defaultValue: '"middle"',
      description: "标签导航尺寸，沿用统一 ControlSize。",
    },
    {
      name: "tabPosition",
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"top"',
      description:
        "标签导航相对内容的位置。四个方向使用同一结构间距规则；左右位置自动使用垂直方向键语义。",
    },
    {
      name: "centered",
      type: "boolean",
      defaultValue: "false",
      description: "在没有额外操作时将标签项整体居中。",
    },
    {
      name: "tabBarExtraContent",
      type: "ReactNode",
      description: "标签导航末端的补充操作或状态内容。",
    },
    {
      name: "aria-label",
      type: "string",
      description:
        "canonical 可访问命名入口；也可使用标准 aria-labelledby，高层 Tabs 会把名称传给生成的 TabList。",
    },
    {
      name: "ariaLabel",
      type: "string",
      description:
        "已弃用迁移别名。标准 aria-label 优先；仅保留到真实产品 vendored artifact 原子升级。",
    },
  ],
  apiSections: [
    {
      title: "TabList API",
      description: "完全自定义 Tabs 结构时使用。",
      rows: tabListApi,
    },
    {
      title: "Tab API",
      rows: tabApi,
    },
    {
      title: "TabPanel API",
      rows: tabPanelApi,
    },
  ],
  notes: (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p>
        高层 API 参考成熟组件库的稳定语义；可访问性与组合结构建立在 Radix Tabs 上，不复制第三方内部实现。
      </p>
      <p>
        高层 Tabs 的 pre-reset value/defaultValue/items[].value 输入已移除；状态只通过 activeKey/defaultActiveKey/items[].key/onChange 表达。primitive Tab/TabPanel 的 value 是组合层内部 key，不是第二套高层状态 API。
      </p>
      <p>
        Tabs 只负责 TabBar 与 TabPanel 的结构关系，包括方向感知的间距和活动指示线。TabPanel 不默认注入业务内容 padding；Card、Form、Table 等内容应自行声明内部间距。
      </p>
      <p>
        `ariaLabel` 仅作为旧产品 artifact 迁移期间的 deprecated alias 保留；新代码和 Showcase 示例使用标准 `aria-label` / `aria-labelledby`。
      </p>
    </div>
  ),
};
