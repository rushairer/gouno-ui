import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import CascaderDemo from "./cascader/cascader-0";
import CascaderDemoSource from "./cascader/cascader-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const cascaderReviewDocuments: Record<string, ComponentDocument> = {
  cascader: {
    ...dataEntryDocuments.cascader,
    description:
      "Cascader 使用 Gouno 自渲染的单一 combobox trigger 与多列 popup 表达层级路径：调用方拥有组级可访问名称和 placeholder，Core 管理受控/非受控路径、列展开、disabled、清空截断与横向键盘导航。可见 UI 不再依赖 OS native select；搜索、异步加载与业务地址模型继续由产品拥有。",
    code: canonicalCoreSource(CascaderDemoSource),
    render: () => <CascaderDemo />,
    api: [
      {
        name: "options",
        description: "层级选项树；value 是路径身份，disabled 节点不可选择。",
        type: "readonly CascaderOption[]",
      },
      {
        name: "value",
        description: "受控选中路径。",
        type: "readonly string[]",
      },
      {
        name: "defaultValue",
        description: "非受控初始路径。",
        type: "readonly string[]",
        defaultValue: "[]",
      },
      {
        name: "onChange",
        description: "路径变化后回传下一条 value path 与对应选项对象。",
        type: "(value: string[], selected: CascaderOption[]) => void",
      },
      {
        name: "placeholder",
        description: "调用方拥有的空路径文案；未提供时只使用语言无关占位符，不注入 Please select / Select。",
        type: "string",
      },
      {
        name: "size",
        description: "统一控件尺寸。",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "status",
        description: "统一校验状态；error 同步 aria-invalid。",
        type: '"error" | "warning"',
      },
      {
        name: "disabled",
        description: "禁用 trigger 与 popup 内全部层级选择。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "...div props",
        description: "根 group 透传标准 div/ARIA/data/event/className 属性；aria-label / aria-labelledby 由调用方命名整组。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
      {
        name: "ref",
        description: "指向真实根 div。",
        type: "Ref<HTMLDivElement>",
      },
    ],
  },
};
