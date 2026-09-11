import type { ComponentDocument } from "../../components/component-page";
import { feedbackDocuments } from "./feedback";
import PopconfirmDemo from "./popconfirm/popconfirm-0";
import PopconfirmDemoSource from "./popconfirm/popconfirm-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const popconfirmReviewDocuments: Record<string, ComponentDocument> = {
  popconfirm: {
    ...feedbackDocuments.popconfirm,
    description:
      "Popconfirm 只拥有一次本地确认交互：调用方显式提供标题、确认/取消文案与业务回调；Core 负责 alertdialog 生命周期、异步确认 busy 锁、取消与触发事件组合。触发器不再通过 cloneElement 改写 child click，而由包装 span 接收自然冒泡，并尊重 child/root 的 preventDefault 或 stopPropagation。异步确认成功后关闭；抛错/拒绝时保持打开且恢复可操作状态，错误反馈继续由调用方拥有。受控 open、业务删除状态、权限检查、二次验证与全局消息编排均不进入该 API。",
    code: canonicalCoreSource(PopconfirmDemoSource),
    render: () => <PopconfirmDemo />,
    api: [
      {
        name: "title",
        description: "确认对话框标题。",
        type: "string",
      },
      {
        name: "description",
        description: "可选补充说明。",
        type: "string",
      },
      {
        name: "children",
        description: "触发元素；Core 不 clone 或覆盖其事件。",
        type: "ReactElement",
      },
      {
        name: "okText",
        description: "调用方拥有的确认按钮文案；无 Core 默认语言。",
        type: "string",
      },
      {
        name: "cancelText",
        description: "调用方拥有的取消按钮文案；无 Core 默认语言。",
        type: "string",
      },
      {
        name: "danger",
        description: "确认按钮使用 destructive 视觉语义。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "onConfirm",
        description: "确认回调；Promise pending 时锁住取消/Escape，成功后关闭，拒绝时保持打开。",
        type: "() => void | Promise<void>",
      },
      {
        name: "onCancel",
        description: "显式取消后的回调。",
        type: "() => void",
      },
      {
        name: "disabled",
        description: "阻止 Popconfirm 打开；不篡改 child 自己的 disabled/click 语义。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "...span props",
        description: "触发包装层透传标准 span DOM/ARIA/data/event/className；root onClick 与打开动作组合并尊重 preventDefault。",
        type: "HTMLAttributes<HTMLSpanElement>",
      },
      {
        name: "ref",
        description: "指向真实触发包装 span。",
        type: "Ref<HTMLSpanElement>",
      },
    ],
  },
};
