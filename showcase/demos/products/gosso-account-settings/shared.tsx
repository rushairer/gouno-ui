import { useState, type ReactNode } from "react";
import { Alert, Button, Card, Heading, Modal, Text } from "../../../../src/core";

export interface SectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  surface?: "card" | "direct";
  children: ReactNode;
}

export interface SettingRowProps {
  label: ReactNode;
  children: ReactNode;
}

export interface ConfirmActionProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  color?: "primary" | "error";
  icon?: ReactNode;
  onConfirm: () => void;
}

export function Section({ title, description, actions, surface = "card", children }: SectionProps) {
  const hasLead = Boolean(title || description || actions);
  return (
    <div className="flex flex-col gap-5">
      {hasLead ? (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title ? <Heading level={2} className="text-lg leading-tight">{title}</Heading> : null}
            {description ? (
              <Text tone="muted" size="sm" className={title ? "mt-1.5 max-w-3xl leading-relaxed" : "max-w-3xl leading-relaxed"}>
                {description}
              </Text>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {surface === "card" ? (
        <Card padding="base" className="overflow-hidden">{children}</Card>
      ) : children}
    </div>
  );
}

export function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="grid gap-2 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="m-0 min-w-0 text-sm">{children}</dd>
    </div>
  );
}

export function StatusMessage({ message, type = "success" }: { message: ReactNode; type?: "success" | "error" | "info" }) {
  return <Alert type={type} showIcon title={message} />;
}

export function ConfirmAction({ triggerLabel, title, description, confirmLabel, color = "error", icon, onConfirm }: ConfirmActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="small" variant={color === "error" ? "solid" : "outline"} color={color} icon={icon} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal
        open={open}
        title={title}
        description={description}
        onOpenChange={setOpen}
        onOk={() => { onConfirm(); setOpen(false); }}
        okText={confirmLabel}
        cancelText="取消"
        okButtonProps={{ variant: "solid", color }}
      >
        <Text size="sm" tone="muted">这是静态 Showcase fixture；确认后只会更新当前预览状态，不会调用真实身份服务。</Text>
      </Modal>
    </>
  );
}
