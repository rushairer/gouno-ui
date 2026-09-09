import type { ComponentDocument } from "../../components/component-page";
import EmptyExample from "./empty/empty-0";
import EmptyExampleSource from "./empty/empty-0.tsx?raw";
import ResultExample from "./result/result-0";
import ResultExampleSource from "./result/result-0.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const statusDocuments: Record<string, ComponentDocument> = {
  empty: {
    title: "Empty 空状态",
    description:
      "在集合或页面没有可展示内容时提供明确状态、解释和下一步操作。Empty 使用 role=status，不拥有数据加载或权限判断。",
    code: publicSource(EmptyExampleSource),
    render: () => <EmptyExample />,
    api: [
      {
        name: "title",
        description: "空状态主说明。",
        type: "ReactNode",
        defaultValue: '"No data"',
      },
      {
        name: "description",
        description: "补充原因、范围或下一步说明。",
        type: "ReactNode",
      },
      {
        name: "action",
        description: "可选恢复、创建或返回操作。",
        type: "ReactNode",
      },
      {
        name: "icon",
        description: "可选视觉图标；装饰性图标应 aria-hidden。",
        type: "ReactNode",
      },
    ],
  },
  result: {
    title: "Result 结果",
    description:
      "用于明确表达一次操作或流程的终态，并提供解释、后续操作和可选补充内容。Result 不替代瞬时 Message。",
    code: publicSource(ResultExampleSource),
    render: () => <ResultExample />,
    api: [
      {
        name: "status",
        description: "结果语义和状态图标色。",
        type: '"success" | "error" | "info" | "warning"',
        defaultValue: '"info"',
      },
      {
        name: "title",
        description: "结果主标题，渲染为 section 内 h2。",
        type: "ReactNode",
      },
      {
        name: "subTitle",
        description: "结果补充说明。",
        type: "ReactNode",
      },
      {
        name: "extra",
        description: "主要后续操作区域。",
        type: "ReactNode",
      },
      {
        name: "children",
        description: "操作区之后的补充内容。",
        type: "ReactNode",
      },
    ],
  },
};
