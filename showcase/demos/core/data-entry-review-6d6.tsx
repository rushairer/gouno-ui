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
      "Cascader 保留逐级原生 select 的窄职责：调用方拥有组级可访问名称和本地化 placeholder，Core 只管理一条受控/非受控路径、层级展开、disabled 保护与清空截断。每一级使用语言无关的数字位置名，避免 Core 注入 Level/Select 等英文文案。搜索、异步加载、自定义弹层与业务地址模型继续由产品拥有。",
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
        description: "调用方拥有的逐级空选项文案；Core 不注入 Please select / Select。",
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
        description: "禁用整组逐级选择。",
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
