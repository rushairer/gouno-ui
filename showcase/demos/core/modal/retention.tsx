import { useState } from "react";
import { Button, Input, Modal, Space, Text } from "../../../../src/core";

export default function ModalRetention() {
  const [open, setOpen] = useState(false);
  const [destroy, setDestroy] = useState(false);
  return (
    <Space orientation="vertical">
      <Space wrap>
        <Button
          onClick={() => {
            setDestroy(false);
            setOpen(true);
          }}
        >
          保留内容
        </Button>
        <Button
          onClick={() => {
            setDestroy(true);
            setOpen(true);
          }}
        >
          关闭销毁
        </Button>
      </Space>
      <Modal
        open={open}
        aria-label="内容保留示例"
        onOpenChange={setOpen}
        destroyOnClose={destroy}
        mask={false}
        zIndex={1200}
        footer={null}
        contentStyle={{ borderRadius: 16 }}
        styles={{ body: { paddingBlock: 16 } }}
      >
        <Text>
          输入后关闭，再次打开观察内容。当前：{destroy ? "销毁" : "保留"}。
        </Text>
        <Input aria-label="保留的草稿" defaultValue="初始内容" />
      </Modal>
    </Space>
  );
}
