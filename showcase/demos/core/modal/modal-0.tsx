import { useState } from "react";
import { Button, Modal, Text } from "../../../../src/core";
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开 Modal</Button>
      <Modal
        open={open}
        title="编辑资料"
        onClose={() => setOpen(false)}
        footer={<Button onClick={() => setOpen(false)}>完成</Button>}
      >
        <Text>Modal 内容和焦点回收示例。</Text>
      </Modal>
    </>
  );
}
export default function Example1() {
  return <ModalDemo />;
}
