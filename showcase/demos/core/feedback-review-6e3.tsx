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
      "NotificationProvider 只拥有当前 React 子树内的 transient notification queue。每条通知自行使用 status + aria-atomic 语义，外层容器不重复创建 aria-live；队列 key 使用 Provider 内单调 ID，自动移除 timer 在 Provider 卸载时统一清理。notice.duration 只接受有限正毫秒；省略、非有限值或非正值都回到 4500ms，因此不再用 duration=0 偷渡无法关闭的永久通知。持久通知、通知中心、已读状态、手动 close/update/destroy 和跨 root singleton 都继续由产品拥有。",
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
            description: "显示一条有限生命周期通知。",
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
            name: "notice.duration",
            description: "自动消失毫秒数；仅有限正值生效，其余回到 4500ms，不提供永久驻留 sentinel。",
            type: "number",
            defaultValue: "4500",
          },
        ],
      },
    ],
  },
};
