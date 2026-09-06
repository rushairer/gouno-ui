import { useState } from "react";
import { Button, Drawer, Space, Text } from "../../../../src/core";
function DrawerStateDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lifecycle, setLifecycle] = useState("尚未打开");
  return (
    <Space wrap>
      <Button onClick={() => setOpen(true)}>打开生命周期示例</Button>
      <Button
        onClick={() => {
          setOpen(true);
          setLoading(true);
          window.setTimeout(() => setLoading(false), 600);
        }}
      >
        加载状态
      </Button>
      <Text role="status">{lifecycle}</Text>
      <Drawer
        open={open}
        title="生命周期"
        description="支持受控状态、加载状态和回调。"
        loading={loading}
        onOpenChange={setOpen}
        afterOpenChange={(visible) =>
          setLifecycle(visible ? "已打开" : "已关闭")
        }
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
