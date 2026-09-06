import { useState } from "react";
import { Button, Modal, Space, Text } from "../../../../src/core";
function ModalStateDemo() {
  const [open, setOpen] = useState(false);
  const [lifecycle, setLifecycle] = useState("尚未打开");
  const [loading, setLoading] = useState(false);
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
      <Modal
        open={open}
        title="生命周期"
        description="onOpenChange、afterOpenChange 和 loading。"
        loading={loading}
        onOpenChange={setOpen}
        afterOpenChange={(visible) =>
          setLifecycle(visible ? "已打开" : "已关闭")
        }
        onClose={() => setOpen(false)}
        closeOnEsc={false}
        closeOnBackdrop={false}
        footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
      >
        <Text>内容</Text>
      </Modal>
    </Space>
  );
}
export default function Example3() {
  return <ModalStateDemo />;
}
