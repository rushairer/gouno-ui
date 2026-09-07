import { useState, type ReactNode } from "react";
import { Alert, Button, Modal, Tag, Text } from "../../../../src/core";

export function FixtureBanner({ route }: { route: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Text as="div" size="sm" className="font-medium">
          真实产品路由
        </Text>
        <Text size="xs" tone="muted" className="mt-0.5">
          <code className="font-mono">{route}</code> · Showcase 使用本地 fixture 表达真实交互状态。
        </Text>
      </div>
      <Tag>静态 Fixture</Tag>
    </div>
  );
}

export function StatusNotice({ children }: { children: ReactNode }) {
  return <Alert>{children}</Alert>;
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
      <Button
        size="small"
        variant={color === "error" ? "solid" : "outline"}
        color={color}
        icon={icon}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <Modal
        open={open}
        title={title}
        description={description}
        onOpenChange={setOpen}
        onOk={() => {
          onConfirm();
          setOpen(false);
        }}
        okText={confirmText}
        cancelText="取消"
        okButtonProps={{ variant: "solid", color }}
      >
        <Text size="sm" tone="muted">
          Showcase 只更新当前 fixture，不会调用真实 GOSSO 管理 API。
        </Text>
      </Modal>
    </>
  );
}
