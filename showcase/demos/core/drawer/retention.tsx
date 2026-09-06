import { useState } from "react";
import { Button, Drawer, Input, Space, Text } from "../../../../src/core";

export default function DrawerRetention() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("尚未打开");
  return (
    <Space direction="vertical">
      <Button onClick={() => setOpen(true)}>保留草稿与自定义区域</Button>
      <Drawer
        open={open}
        ariaLabel="自定义抽屉"
        onOpenChange={setOpen}
        destroyOnClose={false}
        mask={false}
        zIndex={1200}
        width={460}
        showCloseButton={false}
        closeOnEsc
        closeOnBackdrop={false}
        extra={
          <Button size="small" onClick={() => setOpen(false)}>
            关闭
          </Button>
        }
        footer={<Text>关闭后重新打开仍保留草稿。</Text>}
        contentStyle={{ borderTopLeftRadius: 16 }}
        styles={{
          body: { paddingBlock: 24 },
          footer: { justifyContent: "flex-start" },
        }}
        afterOpenChange={(value) => setMessage(value ? "已打开" : "已关闭")}
      >
        <Input aria-label="草稿" defaultValue="可以编辑" />
      </Drawer>
      <Text aria-live="polite">{message}</Text>
    </Space>
  );
}
