import { useState, type ReactNode } from "react";
import { Alert, Button, Modal, Text } from "../../../../src/core";
import { FixtureDock } from "../../../components/fixture-dock";

export function FixtureBanner({ route }: { route: string }) {
  return (
    <FixtureDock
      route={route}
      note="Showcase 使用本地 fixture 表达真实交互状态；该工具层不会进入真实 GOSSO 页面。"
    />
  );
}

export function StatusNotice({ children }: { children: ReactNode }) {
  return <Alert type="success" showIcon title={children} />;
}

export function ConfirmAction({
  label,
  title,
  description,
  confirmText,
  icon,
  color = "error",
  disabled = false,
  onConfirm,
}: {
  label: ReactNode;
  title: ReactNode;
  description: ReactNode;
  confirmText: string;
  icon?: ReactNode;
  color?: "primary" | "error";
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="small" variant={color === "error" ? "solid" : "outline"} color={color} icon={icon} disabled={disabled} onClick={() => setOpen(true)}>{label}</Button>
      <Modal
        open={open}
        title={title}
        description={description}
        onOpenChange={setOpen}
        onOk={() => { onConfirm(); setOpen(false); }}
        okText={confirmText}
        cancelText="取消"
        okButtonProps={{ variant: "solid", color }}
      >
        <Text size="sm" tone="muted">Showcase 只更新当前 fixture，不会调用真实 GOSSO 管理 API。</Text>
      </Modal>
    </>
  );
}
