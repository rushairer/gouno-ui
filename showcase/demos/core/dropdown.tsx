import type { ComponentDocument } from "../../components/component-page";
import DropdownExample from "./dropdown/dropdown-0";
import DropdownExampleSource from "./dropdown/dropdown-0.tsx?raw";

export const dropdownDocument: ComponentDocument = {
  title: "Dropdown 下拉菜单",
  description:
    "由 Trigger 打开的操作菜单。Content 管理菜单 surface，Item 承担可选择动作，Label/Separator 只表达分组结构，不拥有业务状态。",
  code: DropdownExampleSource.replaceAll(
    "../../../../src/core",
    "@gouno/ui/core",
  ).trim(),
  render: () => <DropdownExample />,
  api: [
    { name: "open", description: "受控打开状态。", type: "boolean" },
    { name: "defaultOpen", description: "非受控初始状态。", type: "boolean", defaultValue: "false" },
    { name: "onOpenChange", description: "打开状态变化回调。", type: "(open: boolean) => void" },
    { name: "modal", description: "是否使用模态菜单行为。", type: "boolean", defaultValue: "true" },
  ],
  apiSections: [
    {
      title: "DropdownMenuTrigger API",
      rows: [
        { name: "asChild", description: "把菜单触发语义合并到唯一子元素。", type: "boolean", defaultValue: "false" },
        { name: "children", description: "菜单触发控件。", type: "ReactNode" },
      ],
    },
    {
      title: "DropdownMenuContent API",
      rows: [
        { name: "sideOffset", description: "菜单与 Trigger 的 side 距离。", type: "number", defaultValue: "4" },
        { name: "align", description: "沿 Trigger 的对齐方式。", type: '"start" | "center" | "end"', defaultValue: '"center"' },
        { name: "side", description: "菜单首选出现方向。", type: '"top" | "right" | "bottom" | "left"', defaultValue: '"bottom"' },
        { name: "className", description: "扩展 canonical menu surface。", type: "string" },
        { name: "children", description: "Label、Item、Separator 等菜单内容。", type: "ReactNode" },
      ],
    },
    {
      title: "DropdownMenuItem API",
      rows: [
        { name: "variant", description: "动作语义色。", type: '"default" | "destructive"', defaultValue: '"default"' },
        { name: "inset", description: "与带图标/指示器的项目保持左侧对齐。", type: "boolean", defaultValue: "false" },
        { name: "disabled", description: "禁用该菜单动作。", type: "boolean", defaultValue: "false" },
        { name: "onSelect", description: "键盘或指针选择动作后的回调。", type: "(event: Event) => void" },
        { name: "children", description: "菜单动作内容。", type: "ReactNode" },
      ],
    },
    {
      title: "DropdownMenuLabel API",
      rows: [
        { name: "inset", description: "与 inset Item 对齐。", type: "boolean", defaultValue: "false" },
        { name: "children", description: "不可选择的菜单分组标题。", type: "ReactNode" },
        { name: "className", description: "扩展 label 样式。", type: "string" },
      ],
    },
    {
      title: "DropdownMenuSeparator API",
      rows: [
        { name: "className", description: "扩展分隔线样式。", type: "string" },
      ],
    },
  ],
};
