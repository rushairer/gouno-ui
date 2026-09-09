import type { ComponentDocument } from "../../components/component-page";
import PopoverExample from "./popover/popover-0";
import PopoverExampleSource from "./popover/popover-0.tsx?raw";
import TooltipExample from "./tooltip/tooltip-0";
import TooltipExampleSource from "./tooltip/tooltip-0.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const overlayDocuments: Record<string, ComponentDocument> = {
  popover: {
    title: "Popover 气泡卡片",
    description:
      "由 Trigger 打开的轻量上下文面板。Anchor 可独立定义定位基准，Content 用 placement/offset 表达方位；业务状态仍由消费方拥有。",
    code: publicSource(PopoverExampleSource),
    render: () => <PopoverExample />,
    api: [
      { name: "open", description: "受控打开状态。", type: "boolean" },
      { name: "defaultOpen", description: "非受控初始状态。", type: "boolean", defaultValue: "false" },
      { name: "onOpenChange", description: "打开状态变化回调。", type: "(open: boolean) => void" },
      { name: "modal", description: "是否使用模态交互语义。", type: "boolean", defaultValue: "false" },
    ],
    apiSections: [
      {
        title: "PopoverTrigger API",
        rows: [
          { name: "asChild", description: "把触发语义合并到唯一子元素，避免额外按钮层。", type: "boolean", defaultValue: "false" },
          { name: "children", description: "触发控件。", type: "ReactNode" },
        ],
      },
      {
        title: "PopoverContent API",
        rows: [
          { name: "placement", description: "方位与对齐，例如 bottom-start。", type: "OverlayPlacement", defaultValue: '"bottom"' },
          { name: "offset", description: "沿 side 方向与锚点的距离。", type: "number", defaultValue: "4" },
          { name: "alignOffset", description: "沿对齐轴的附加偏移。", type: "number" },
          { name: "children", description: "轻量上下文内容。", type: "ReactNode" },
          { name: "className", description: "扩展 canonical overlay surface。", type: "string" },
        ],
      },
      {
        title: "PopoverAnchor API",
        rows: [
          { name: "asChild", description: "使用现有元素作为定位锚点。", type: "boolean", defaultValue: "false" },
          { name: "children", description: "定位锚点元素。", type: "ReactNode" },
        ],
      },
    ],
  },
  tooltip: {
    title: "Tooltip 文字提示",
    description:
      "为可聚焦或可悬停控件提供简短补充说明。Provider 统一延时策略，Trigger 与 Content 组合保持 Radix 的焦点和悬停语义。",
    code: publicSource(TooltipExampleSource),
    render: () => <TooltipExample />,
    api: [
      { name: "open", description: "受控打开状态。", type: "boolean" },
      { name: "defaultOpen", description: "非受控初始状态。", type: "boolean", defaultValue: "false" },
      { name: "onOpenChange", description: "打开状态变化回调。", type: "(open: boolean) => void" },
      { name: "delayDuration", description: "覆盖当前 Tooltip 的打开延时。", type: "number" },
    ],
    apiSections: [
      {
        title: "TooltipProvider API",
        rows: [
          { name: "delayDuration", description: "同一 Provider 下 Tooltip 的默认打开延时。", type: "number", defaultValue: "0" },
          { name: "skipDelayDuration", description: "连续浏览多个 Tooltip 时的跳过延时窗口。", type: "number" },
          { name: "disableHoverableContent", description: "是否在指针进入 Content 后立即关闭。", type: "boolean" },
          { name: "children", description: "共享延时策略的 Tooltip 子树。", type: "ReactNode" },
        ],
      },
      {
        title: "TooltipTrigger API",
        rows: [
          { name: "asChild", description: "把触发语义合并到唯一子元素。", type: "boolean", defaultValue: "false" },
          { name: "children", description: "需要解释的可交互控件。", type: "ReactNode" },
        ],
      },
      {
        title: "TooltipContent API",
        rows: [
          { name: "placement", description: "方位与对齐，例如 top、bottom-start。", type: "OverlayPlacement", defaultValue: '"top"' },
          { name: "offset", description: "沿 side 方向与 Trigger 的距离。", type: "number", defaultValue: "0" },
          { name: "alignOffset", description: "沿对齐轴的附加偏移。", type: "number" },
          { name: "children", description: "简短说明内容。", type: "ReactNode" },
          { name: "className", description: "扩展 canonical tooltip surface。", type: "string" },
        ],
      },
    ],
  },
};
