import { useState, type ReactNode } from "react";
import { Alert, IconButton, Modal, Text } from "../../../../../src/core";
import { FixtureDock } from "../../../../components/fixture-dock";
import { TabPanelLead } from "../../../../components/tab-panel-lead";

export function FixtureBanner({ route }: { route: string }) {
  return (
    <FixtureDock
      route={route}
      note="Showcase 使用本地 fixture 表达真实交互状态；该工具层不会进入真实 GOSSO 页面。"
    />
  );
}

export const ManagementPanelLead = TabPanelLead;

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
  label: string;
  title: ReactNode;
  description: ReactNode;
  confirmText: string;
  icon: ReactNode;
  color?: "primary" | "error";
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        label={label}
        icon={icon}
        variant="ghost"
        color={color}
        disabled={disabled}
        onClick={() => setOpen(true)}
      />
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