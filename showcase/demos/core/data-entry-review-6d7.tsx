import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import TreeSelectDemo from "./tree-select/tree-select-0";
import TreeSelectDemoSource from "./tree-select/tree-select-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const treeSelectReviewDocuments: Record<string, ComponentDocument> = {
  "tree-select": {
    ...dataEntryDocuments["tree-select"],
    description:
      "TreeSelect 保留原生 select 的窄实现：Core 只把 readonly 层级数据稳定展平为原生 option，并保留 single/multiple 的浏览器选择语义。title 明确为 string，避免 ReactNode 经 String() 退化为 [object Object]；placeholder 完全由调用方拥有，Core 不再注入 Please select。支持标准 select DOM/ARIA/form 属性、真实 ref、统一 size/status 与 disabled；搜索、异步树、checkbox、弹层和自定义节点渲染继续由 Tree 或产品层拥有。",
    code: canonicalCoreSource(TreeSelectDemoSource),
    render: () => <TreeSelectDemo />,
    api: [
      {
        name: "treeData",
        description: "readonly 层级选项；value 为稳定身份，title 为 native option 可直接表达的 string。",
        type: "readonly TreeSelectNode[]",
      },
      {
        name: "value",
        description: "受控值；single 为 string，multiple 为 readonly string[]。",
        type: "string | readonly string[]",
      },
      {
        name: "defaultValue",
        description: "非受控初始值。",
        type: "string | readonly string[]",
      },
      {
        name: "onChange",
        description: "原生选择变化后的值回调；multiple 返回 string[]。",
        type: "(value: string | string[]) => void",
      },
      {
        name: "multiple",
        description: "启用原生 multiple select；不引入 checkbox/tree-popup 语义。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "placeholder",
        description: "single 模式的调用方占位文案；未提供时 Core 不注入任何默认 copy。",
        type: "string",
      },
      {
        name: "size",
        description: "统一控件尺寸；multiple 模式保留原生多行高度。",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "status",
        description: "统一校验状态；error 同步 aria-invalid。",
        type: '"error" | "warning"',
      },
      {
        name: "...select props",
        description: "透传标准 select 的 name/required/ARIA/data/event/className 等属性。",
        type: "SelectHTMLAttributes<HTMLSelectElement>",
      },
      {
        name: "ref",
        description: "指向真实 native select。",
        type: "Ref<HTMLSelectElement>",
      },
    ],
  },
};
