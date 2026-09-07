import { BasicTabs } from "./BasicTabs";
import BasicTabsSource from "./BasicTabs.tsx?raw";
import { ControlledTabs } from "./ControlledTabs";
import ControlledTabsSource from "./ControlledTabs.tsx?raw";
import { TabsVariants } from "./TabsVariants";
import TabsVariantsSource from "./TabsVariants.tsx?raw";
import { TabsPlacement } from "./TabsPlacement";
import TabsPlacementSource from "./TabsPlacement.tsx?raw";
import type { ComponentDocument } from "../../../components/component-page";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const tabsDocument: ComponentDocument = {
  title: "Tabs 标签页",
  description:
    "采用成熟的 activeKey / defaultActiveKey / items / onChange 高层语义，并保留 TabList / Tab / TabPanel 组合能力。默认 line 样式使用轻量指示条，不以方块边框强调选中态。",
  code: publicSource(BasicTabsSource),
  render: () => <BasicTabs />,
  demos: [
    {
      title: "受控状态与额外操作",
      description: "activeKey 由业务路由或页面状态持有；tabBarExtraContent 用于同一导航栏的补充操作。",
      code: publicSource(ControlledTabsSource),
      render: () => <ControlledTabs />,
    },
    {
      title: "Line 与 Card",
      description: "line 是默认产品导航样式；card 仅在明确需要卡片页签语义时使用。",
      code: publicSource(TabsVariantsSource),
      render: () => <TabsVariants />,
    },
    {
      title: "左侧标签页",
      description: "tabPosition 负责高层位置语义，内部仍由 Radix Tabs 维持键盘导航与 ARIA 关系。",
      code: publicSource(TabsPlacementSource),
      render: () => <TabsPlacement />,
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
      description: "非受控初始激活项；未提供时选择 items 中第一个未禁用项。",
    },
    {
      name: "items",
      type: "readonly TabItem[]",
      defaultValue: "[]",
      description: "标签项集合；每项使用 key、label，可选 icon、children 与 disabled。",
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
      description: "视觉形态。默认 line 使用连续底线与活动指示条。",
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
      description: "标签导航相对内容的位置。左右位置自动使用垂直方向键语义。",
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
      name: "ariaLabel",
      type: "string",
      description: "标签列表的可访问名称。产品路由型 Tabs 应提供明确名称。",
    },
  ],
  notes: (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p>
        高层 API 参考 Ant Design 的稳定语义；可访问性与组合结构建立在 Radix Tabs 上，不复制第三方内部实现。
      </p>
      <p>
        需要完全自定义标签结构时可使用同 owner 的 TabList、Tab、TabPanel；不要同时为同一状态传 activeKey 与另一套 value 写入口。
      </p>
    </div>
  ),
};
