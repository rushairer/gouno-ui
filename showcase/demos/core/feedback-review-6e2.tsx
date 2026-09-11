import type { ComponentDocument } from "../../components/component-page";
import { feedbackDocuments } from "./feedback";
import MessageDemo from "./message/message-0";
import MessageDemoSource from "./message/message-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const messageReviewDocuments: Record<string, ComponentDocument> = {
  message: {
    ...feedbackDocuments.message,
    description:
      "MessageProvider 只拥有当前 React 子树内的 transient message queue。每条消息自行使用 status 或 alert 语义，不在外层重复创建 aria-live；队列 key 使用 Provider 内单调 ID，不依赖时间或随机数，自动移除 timer 在 Provider 卸载时统一清理。duration 只控制自动消失时间，消息内容和触发时机由调用方拥有。Core 不提供全局 singleton、跨 React root manager、手动 key/update/destroy、Promise 生命周期或业务通知中心。",
    code: canonicalCoreSource(MessageDemoSource),
    render: () => <MessageDemo />,
    api: [
      {
        name: "children",
        description: "共享当前 Message context 的 React 子树。",
        type: "ReactNode",
      },
      {
        name: "duration",
        description: "新消息自动消失的毫秒数；负值按 0 处理。",
        type: "number",
        defaultValue: "2500",
      },
    ],
    apiSections: [
      {
        title: "useMessage API",
        rows: [
          {
            name: "open(content, tone?)",
            description: "显示一条消息；tone 省略时为 info。",
            type: '(content: ReactNode, tone?: "info" | "success" | "warning" | "error") => void',
          },
          {
            name: "info(content)",
            description: "显示普通信息，使用 status 语义。",
            type: "(content: ReactNode) => void",
          },
          {
            name: "success(content)",
            description: "显示成功反馈，使用 status 语义。",
            type: "(content: ReactNode) => void",
          },
          {
            name: "warning(content)",
            description: "显示警告反馈，使用 status 语义。",
            type: "(content: ReactNode) => void",
          },
          {
            name: "error(content)",
            description: "显示错误反馈，使用 alert 语义。",
            type: "(content: ReactNode) => void",
          },
        ],
      },
    ],
  },
};
