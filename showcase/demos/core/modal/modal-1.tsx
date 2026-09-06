import { useState } from "react";
import { Button, Modal, Space, Text } from "../../../../src/core";
function ModalSizeDemo() {
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | null>(null);
  return (
    <>
      <Space wrap>
        {(["sm", "md", "lg", "xl"] as const).map((value) => (
          <Button key={value} onClick={() => setSize(value)}>
            {value}
          </Button>
        ))}
      </Space>
      <Modal
        open={size !== null}
        size={size ?? "md"}
        title={`${size ?? "md"} Modal`}
        description="不同尺寸使用一致的语义结构。"
        onClose={() => setSize(null)}
        footer={
          <Button variant="primary" onClick={() => setSize(null)}>
            完成
          </Button>
        }
      >
        <Text>对话框正文区域。</Text>
      </Modal>
    </>
  );
}
export default function Example2() {
  return <ModalSizeDemo />;
}
