import { useState } from "react";
import { Key, Laptop, Lock, Shield, User } from "lucide-react";
import { Tabs } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import { MfaPanel } from "./mfa";
import { PasswordPanel } from "./password";
import { ProfilePanel } from "./profile";
import { PasskeysPanel, SessionsPanel } from "./security";

export type AccountSettingsTab = "profile" | "password" | "mfa" | "passkeys" | "sessions";

const accountTabs = [
  { key: "profile", label: "个人资料", icon: <User aria-hidden="true" className="size-4" /> },
  { key: "password", label: "修改密码", icon: <Lock aria-hidden="true" className="size-4" /> },
  { key: "mfa", label: "多因素认证 (MFA)", icon: <Shield aria-hidden="true" className="size-4" /> },
  { key: "passkeys", label: "通行密钥 (FIDO2)", icon: <Key aria-hidden="true" className="size-4" /> },
  { key: "sessions", label: "活跃会话", icon: <Laptop aria-hidden="true" className="size-4" /> },
] as const;

function AccountSettingsPanel({ tab }: { tab: AccountSettingsTab }) {
  switch (tab) {
    case "profile": return <ProfilePanel />;
    case "password": return <PasswordPanel />;
    case "mfa": return <MfaPanel />;
    case "passkeys": return <PasskeysPanel />;
    case "sessions": return <SessionsPanel />;
  }
}

export function GossoAccountSettingsDemo() {
  const [activeTab, setActiveTab] = useState<AccountSettingsTab>("profile");
  return (
    <div className="flex flex-col gap-6">
      {activeTab === "mfa" ? null : (
        <FixtureDock
          route={`/account-settings/${activeTab}`}
          note="Showcase 使用本地状态模拟真实 route-backed Tab；该工具层不会进入真实账户页面。"
        />
      )}
      <PageHeader
        title="账户设置"
        description="维护个人资料、登录凭据、多因素认证、通行密钥与活跃会话。"
      />
      <Tabs<AccountSettingsTab> activeKey={activeTab} items={accountTabs} onChange={setActiveTab} ariaLabel="账户设置栏目" />
      <AccountSettingsPanel tab={activeTab} />
    </div>
  );
}