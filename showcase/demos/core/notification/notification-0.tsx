import { Button, NotificationProvider, useNotification } from "../../../../src/core";

function NotificationActions() {
  const notification = useNotification();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          notification.open({
            type: "success",
            title: "构建完成",
            description: "Showcase 已成功生成。",
            duration: 4500,
            closable: { "aria-label": "关闭成功通知" },
          })
        }
      >
        成功通知
      </Button>
      <Button
        onClick={() =>
          notification.open({
            type: "error",
            title: "构建失败",
            description: "请检查日志后重试。",
            closable: { "aria-label": "关闭错误通知" },
          })
        }
      >
        错误通知
      </Button>
      <Button
        onClick={() =>
          notification.open({
            type: "warning",
            title: "需要人工确认",
            description: "这条通知会一直保留，直到用户主动关闭。",
            persistent: true,
            closable: { "aria-label": "关闭持久通知" },
          })
        }
      >
        持久通知
      </Button>
    </div>
  );
}

export default function NotificationDemo() {
  return (
    <NotificationProvider>
      <NotificationActions />
    </NotificationProvider>
  );
}
