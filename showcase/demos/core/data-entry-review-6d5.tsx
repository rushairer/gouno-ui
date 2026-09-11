import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import TransferDemo from "./transfer/transfer-0";
import TransferDemoSource from "./transfer/transfer-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const transferReviewDocuments: Record<string, ComponentDocument> = {
  transfer: {
    ...dataEntryDocuments.transfer,
    description:
      "Transfer 保留简单的双集合移动职责：调用方拥有左右标题和操作文案，Core 只管理本地勾选、受控/非受控 targetKeys、disabled 项保护与移动行为。两侧列表拥有可见标题和 group 语义；搜索、分页、远程数据、批量业务规则继续由产品拥有。",
    code: canonicalCoreSource(TransferDemoSource),
    render: () => <TransferDemo />,
    api: [
      {
        name: "dataSource",
        description: "稳定 key 的可移动条目；disabled 条目不可选择或移动。",
        type: "readonly TransferItem[]",
      },
      {
        name: "targetKeys",
        description: "受控目标集合 key 列表。",
        type: "readonly string[]",
      },
      {
        name: "defaultTargetKeys",
        description: "非受控目标集合初始 key 列表。",
        type: "readonly string[]",
        defaultValue: "[]",
      },
      {
        name: "onChange",
        description: "移动完成后回传下一组目标 key。",
        type: "(keys: string[]) => void",
      },
      {
        name: "titles",
        description: "调用方拥有的左右列表可见标题；Core 不注入英文 Source/Target。",
        type: "readonly [ReactNode, ReactNode]",
      },
      {
        name: "operations",
        description: "调用方拥有的添加/移除按钮文案，同时提供按钮可访问名称。",
        type: "readonly [string, string]",
      },
      {
        name: "disabled",
        description: "禁用整个 Transfer 交互。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "...div props",
        description: "根节点透传标准 div/ARIA/data/event/className 属性。",
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
