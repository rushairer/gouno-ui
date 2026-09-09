import type { ComponentDocument } from "../../components/component-page";
import BasicTagDemo from "./tag/basic";
import BasicTagDemoSource from "./tag/basic.tsx?raw";
import ColorTagDemo from "./tag/colors";
import ColorTagDemoSource from "./tag/colors.tsx?raw";
import IconTagDemo from "./tag/icons";
import IconTagDemoSource from "./tag/icons.tsx?raw";
import ClosableTagDemo from "./tag/closable";
import ClosableTagDemoSource from "./tag/closable.tsx?raw";
import CheckableTagDemo from "./tag/checkable";
import CheckableTagDemoSource from "./tag/checkable.tsx?raw";
import UncontrolledTagDemo from "./tag/uncontrolled";
import UncontrolledTagDemoSource from "./tag/uncontrolled.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const tagDocuments: Record<string, ComponentDocument> = {
  tag: {
    title: "Tag 标签",
    description:
      "用于分类、属性和可选条件。支持语义色、自定义颜色、图标、关闭、无边框与受控或非受控选择。所有 Preview 与 Code 均来自同一个可执行示例文件。",
    code: publicSource(BasicTagDemoSource),
    render: () => <BasicTagDemo />,
    demos: [
      {
        title: "自定义颜色",
        code: publicSource(ColorTagDemoSource),
        render: () => <ColorTagDemo />,
      },
      {
        title: "图标与无边框",
        code: publicSource(IconTagDemoSource),
        render: () => <IconTagDemo />,
      },
      {
        title: "可关闭标签",
        description: "onClose 负责同步业务状态；disabled 会禁止关闭操作。",
        code: publicSource(ClosableTagDemoSource),
        render: () => <ClosableTagDemo />,
      },
      {
        title: "受控可选标签",
        description: "CheckableTag 使用 checked 与 onChange 管理筛选条件。",
        code: publicSource(CheckableTagDemoSource),
        render: () => <CheckableTagDemo />,
      },
      {
        title: "非受控可选标签",
        code: publicSource(UncontrolledTagDemoSource),
        render: () => <UncontrolledTagDemo />,
      },
    ],
    api: [
      {
        name: "color",
        description: "语义色或自定义 CSS 背景色",
        type: "TagColor | string",
        defaultValue: '"default"',
      },
      { name: "icon", description: "标签前置图标", type: "ReactNode" },
      {
        name: "bordered",
        description: "是否显示边框",
        type: "boolean",
        defaultValue: "true",
      },
      {
        name: "closable",
        description: "是否显示关闭按钮",
        type: "boolean",
        defaultValue: "false",
      },
      { name: "closeIcon", description: "自定义关闭图标", type: "ReactNode" },
      {
        name: "onClose",
        description: "点击关闭按钮时触发",
        type: "(event: MouseEvent<HTMLButtonElement>) => void",
      },
      {
        name: "checkable",
        description: "启用可选标签行为；也可直接使用 CheckableTag",
        type: "boolean",
        defaultValue: "false",
      },
      { name: "checked", description: "受控选中状态", type: "boolean" },
      {
        name: "defaultChecked",
        description: "非受控初始选中状态",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "onChange",
        description: "可选标签状态变化回调",
        type: "(checked: boolean) => void",
      },
      {
        name: "disabled",
        description: "禁止选择与关闭",
        type: "boolean",
        defaultValue: "false",
      },
    ],
  },
};
