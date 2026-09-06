import { useState } from "react";
import { Button, Drawer, Space, Text } from "../../../../src/core";
function DrawerStateDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Space wrap>
      <Button onClick={() => setOpen(true)}>打开生命周期示例</Button>
      <Drawer
        open={open}
        title="生命周期"
        description="支持受控状态、加载状态和回调。"
        loading={open}
        onOpenChange={setOpen}
        afterOpenChange={() => undefined}
        onClose={() => setOpen(false)}
        footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
      >
        <Text>内容</Text>
      </Drawer>
    </Space>
  );
}
export default function Example6() {
  return <DrawerStateDemo />;
}
