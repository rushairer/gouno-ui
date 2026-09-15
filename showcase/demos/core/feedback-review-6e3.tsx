import type { ComponentDocument } from "../../components/component-page";
import { feedbackDocuments } from "./feedback";
import NotificationDemo from "./notification/notification-0";
import NotificationDemoSource from "./notification/notification-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const notificationReviewDocuments: Record<string, ComponentDocument> = {
  notification: {
    ...feedbackDocuments.notification,
    description:
      "NotificationProvider 只拥有当前 React 子树内的通知浮层队列，不扩展为业务通知中心。通知通过 type 表达 info/success/warning/error 语义；warning/error 使用 alert，其余使用 status，每条通知自行声明 aria-atomic，外层容器不重复创建 aria-live。默认通知继续有限生命周期，duration 只接受有限正毫秒，其他值回到 4500ms；真实产品已经证明需要用户可关闭和持久提示，因此 closable 提供 caller-owned 可访问关闭名称，persistent=true 明确跳过自动移除且类型上要求 closable。队列 key 使用 Provider 内单调 ID，timer 在触发、手动关闭和 Provider 卸载时清理。Notification 只拥有 overlay 展示与生命周期，不拥有已读状态、历史记录、路由动作、存储、跨 root singleton 或业务通知中心。",
    code: canonicalCoreSource(NotificationDemoSource),
    render: () => <NotificationDemo />,
    api: [
      {
        name: "children",
        description: "共享当前 Notification context 的 React 子树。",
        type: "ReactNode",
      },
    ],
    apiSections: [
      {
        title: "useNotification API",
        rows: [
          {
            name: "open(notice)",
            description: "显示一条当前 Provider 子树内的通知浮层。",
            type: "(notice: NotificationNotice) => void",
          },
          {
            name: "notice.title",
            description: "通知标题，由调用方提供。",
            type: "ReactNode",
          },
          {
            name: "notice.description",
            description: "可选补充内容。",
            type: "ReactNode",
          },
          {
            name: "notice.type",
            description: "通知语义级别；同时决定状态图标和 status/alert 播报角色。",
            type: '"info" | "success" | "warning" | "error"',
            defaultValue: '"info"',
          },
          {
            name: "notice.duration",
            description: "非持久通知的自动消失毫秒数；仅有限正值生效，其余回到 4500ms。",
            type: "number",
            defaultValue: "4500",
          },
          {
            name: "notice.closable",
            description: "启用手动关闭，并由调用方显式提供本地化 aria-label。",
            type: '{ "aria-label": string }',
          },
          {
            name: "notice.persistent",
            description: "显式持久显示直到用户关闭；为 true 时必须同时提供 closable，且不接受 duration。",
            type: "boolean",
            defaultValue: "false",
          },
        ],
      },
    ],
  },
};
