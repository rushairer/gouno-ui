import { Button, NotificationProvider, useNotification } from "../../../../src/core";

function NotificationAction() {
  const notification = useNotification();

  return (
    <Button
      onClick={() =>
        notification.open({
          title: "构建完成",
          description: "Showcase 已成功生成。",
          duration: 4500,
        })
      }
    >
      打开通知
    </Button>
  );
}

export default function NotificationDemo() {
  return (
    <NotificationProvider>
      <NotificationAction />
    </NotificationProvider>
  );
}
