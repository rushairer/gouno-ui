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
      "TreeSelect 使用 Gouno 自渲染的 combobox trigger + Tree popup 表达真实层级结构；single 使用 tree selection，multiple 使用 checkable tree。隐藏 native select 仅保留 name/required/value/ref 等表单兼容职责，不参与可见渲染。placeholder 完全由调用方拥有；统一 size/status/disabled 与 overlay 设计语言。搜索、异步树和自定义节点渲染仍不在当前窄职责内。",
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
        description: "树选择变化后的值回调；multiple 返回 string[]。",
        type: "(value: string | string[]) => void",
      },
      {
        name: "multiple",
        description: "启用多选；popup 使用 checkable Tree 并返回 string[]。",
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
        description: "统一控件尺寸；multiple 已选值以自渲染标签在 trigger 内换行。",
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
        description: "name/required/form 等标准 select 属性继续由隐藏 native bridge 承担；className 作用于可见 picker control。",
        type: "SelectHTMLAttributes<HTMLSelectElement>",
      },
      {
        name: "ref",
        description: "指向隐藏 native select compatibility bridge；可见交互由 combobox + Tree popup 拥有。",
        type: "Ref<HTMLSelectElement>",
      },
    ],
  },
};
