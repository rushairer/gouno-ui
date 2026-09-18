import { useEffect, useState, type ReactNode } from "react";
import { IconButton, MessageProvider, Modal, Text, useMessage } from "../../../../../src/core";
import { FixtureDock } from "../../../../components/fixture-dock";
import { TabPanelFeedback, TabPanelLead } from "../../../../components/tab-panel-lead";

type FixtureBannerProps = {
  route: string;
  controls?: ReactNode;
  note?: string;
};

export function FixtureBanner({ route, controls, note }: FixtureBannerProps) {
  return (
    <FixtureDock
      route={route}
      note={note ?? "Showcase 使用本地 fixture 表达真实交互状态；该工具层不会进入真实 GOSSO 页面。"}
      controls={controls}
    />
  );
}

export const ManagementPanelLead = TabPanelLead;
export const ManagementPanelFeedback = TabPanelFeedback;

function FixtureMessageContent({ children }: { children: ReactNode }) {
  const message = useMessage();
  useEffect(() => {
    message.success(children);
  }, [children, message]);
  return null;
}

export function FixtureMessage({ children }: { children: ReactNode }) {
  return (
    <MessageProvider>
      <FixtureMessageContent>{children}</FixtureMessageContent>
    </MessageProvider>
  );
}

// Compatibility name for existing fixtures; the presentation owner is Message, not Alert.
export function StatusNotice({ children }: { children: ReactNode }) {
  return <FixtureMessage>{children}</FixtureMessage>;
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