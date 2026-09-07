import { useState } from "react";
import { Button, Input, Modal, Space, Text } from "../../../../src/core";

export default function ModalActions() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("尚未保存");
  return (
    <Space orientation="vertical">
      <Button onClick={() => setOpen(true)}>默认确认操作</Button>
      <Modal
        open={open}
        title="保存草稿"
        description="保存期间确认与取消按钮禁用。"
        centered={false}
        maxWidth="min(520px, calc(100vw - 32px))"
        confirmLoading={saving}
        okText="保存"
        cancelText="暂不保存"
        okButtonProps={{ variant: "solid", color: "primary" }}
        cancelButtonProps={{ variant: "text" }}
        closeOnEsc={!saving}
        closeOnBackdrop={false}
        showCloseButton={!saving}
        onOpenChange={setOpen}
        onCancel={() => setMessage("已取消")}
        onOk={async () => {
          setSaving(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          setSaving(false);
          setMessage("已保存");
          setOpen(false);
        }}
        afterOpenChange={(value) => {
          if (value) setMessage("编辑中");
        }}
      >
        <Input aria-label="标题" defaultValue="Gouno UI" />
      </Modal>
      <Text aria-live="polite">{message}</Text>
    </Space>
  );
}
