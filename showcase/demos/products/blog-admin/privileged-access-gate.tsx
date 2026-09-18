import type { ReactNode } from "react";
import { Alert, Button } from "../../../../src/core";

export type PrivilegedAccessState = "locked" | "unlocked" | "expiring";

interface PrivilegedAccessGateProps {
  state: PrivilegedAccessState;
  policyTitle: string;
  policyDescription: string;
  actionLabel: string;
  onUnlock: () => void;
  onRelock: () => void;
  children: ReactNode;
  remainingMinutes?: number;
}

export function PrivilegedAccessGate({
  state,
  policyTitle,
  policyDescription,
  actionLabel,
  onUnlock,
  onRelock,
  children,
  remainingMinutes = 10,
}: PrivilegedAccessGateProps) {
  const locked = state === "locked";
  const expiring = state === "expiring";
  const type = locked ? "info" : expiring ? "warning" : "success";
  const title = locked
    ? "高权限操作需要身份验证"
    : expiring
      ? "近期 MFA 即将过期"
      : "高权限操作已解锁";
  const sessionDescription = locked
    ? "完成近期 MFA 后可继续。"
    : expiring
      ? "下一次高权限写操作将触发 Step-Up；待执行动作会被保留并在验证后继续。"
      : `当前 Showcase 模拟近期 MFA 已完成；真实产品会在约 ${remainingMinutes} 分钟后重新要求验证。`;

  return (
    <div className="flex flex-col gap-4" data-slot="blog-privileged-access-gate">
      <Alert
        type={type}
        showIcon
        title={title}
        description={(
          <span>
            <strong className="type-weight-medium">{policyTitle}</strong>
            ：{policyDescription} {sessionDescription}
          </span>
        )}
        action={(
          <Button
            size="small"
            type="button"
            variant={locked ? "solid" : "outline"}
            color={locked ? "primary" : undefined}
            onClick={locked ? onUnlock : onRelock}
          >
            {locked ? actionLabel : "重新锁定"}
          </Button>
        )}
      />
      {locked ? (
        <div className="hidden" inert aria-hidden="true">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
