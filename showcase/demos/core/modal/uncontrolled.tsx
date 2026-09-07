import { useState } from "react";
import { Button, Modal, Space, Text } from "../../../../src/core";

export default function UncontrolledModal() {
  const [mounted, setMounted] = useState(false);
  return (
    <Space orientation="vertical">
      <Button onClick={() => setMounted(true)}>非受控对话框</Button>
      {mounted && (
        <Modal
          defaultOpen
          title="非受控模式"
          onClose={() => setMounted(false)}
          closeOnBackdrop
        >
          <Text>无需管理 open，Escape 或遮罩关闭。</Text>
        </Modal>
      )}
    </Space>
  );
}
