import { Button, MessageProvider, Space, useMessage } from "../../../../src/core";

function MessageActions() {
  const message = useMessage();

  return (
    <Space wrap>
      <Button onClick={() => message.info("正在同步配置")}>信息</Button>
      <Button onClick={() => message.success("配置已保存")}>成功</Button>
      <Button onClick={() => message.warning("仍有未发布改动")}>警告</Button>
      <Button onClick={() => message.error("保存失败")}>错误</Button>
    </Space>
  );
}

export default function MessageDemo() {
  return (
    <MessageProvider duration={2500}>
      <MessageActions />
    </MessageProvider>
  );
}
