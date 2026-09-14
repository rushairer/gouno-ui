import { useState, type ReactNode } from "react";
import { Key, Laptop, Lock, Shield, User } from "lucide-react";
import { Alert, Card, Empty, Segmented, Skeleton, Tabs, Text } from "../../../../../src/core";
import { PageHeader } from "../../../../../src/gouno";
import { FixtureDock } from "../../../../components/fixture-dock";
import { MfaPanel } from "./mfa";
import { PasswordPanel } from "./password";
import { ProfilePanel } from "./profile";
import { PasskeysPanel, SessionsPanel } from "./security";

export type AccountSettingsTab = "profile" | "password" | "mfa" | "passkeys" | "sessions";
type AccountFixtureScenario = "ready" | "loading" | "empty" | "error" | "recent-auth";

type AccountTabDefinition = {
  key: AccountSettingsTab;
  label: string;
  icon: ReactNode;
};

const accountTabDefinitions: readonly AccountTabDefinition[] = [
  { key: "profile", label: "个人资料", icon: <User aria-hidden="true" className="size-4" /> },
  { key: "password", label: "修改密码", icon: <Lock aria-hidden="true" className="size-4" /> },
  { key: "mfa", label: "多因素认证 (MFA)", icon: <Shield aria-hidden="true" className="size-4" /> },
  { key: "passkeys", label: "通行密钥 (FIDO2)", icon: <Key aria-hidden="true" className="size-4" /> },
  { key: "sessions", label: "活跃会话", icon: <Laptop aria-hidden="true" className="size-4" /> },
] as const;

const commonReadOptions = [
  { value: "ready", label: "已载入" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "加载失败" },
] as const;
const collectionOptions = [
  { value: "ready", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "加载失败" },
] as const;
const passwordOptions = [
  { value: "ready", label: "可修改" },
  { value: "recent-auth", label: "需要近期认证" },
  { value: "error", label: "服务异常" },
] as const;

function LoadingAccountPanel({ label }: { label: string }) {
  return (
    <Card padding="base" role="status" aria-label={`${label}加载中`}>
      <Text size="sm" tone="muted">正在加载{label}…</Text>
      <div className="mt-5 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    </Card>
  );
}

function renderReadyPanel(tab: Exclude<AccountSettingsTab, "mfa">) {
  switch (tab) {
    case "profile": return <ProfilePanel />;
    case "password": return <PasswordPanel />;
    case "passkeys": return <PasskeysPanel />;
    case "sessions": return <SessionsPanel />;
  }
}

function AccountFixturePanel({ tab, scenario }: { tab: Exclude<AccountSettingsTab, "mfa">; scenario: AccountFixtureScenario }) {
  const label = accountTabDefinitions.find((item) => item.key === tab)?.label ?? "账户设置";

  if (scenario === "loading") return <LoadingAccountPanel label={label} />;
  if (scenario === "error") {
    return <Alert type="error" showIcon title={`${label}加载失败`} description="身份服务暂时无法返回该账户设置。真实产品会保留当前路由并提供重试。" />;
  }
  if (scenario === "recent-auth") {
    return <Alert type="warning" showIcon title="需要近期强认证" description="修改密码属于高风险操作。真实产品会先完成 Sudo / recent-MFA 验证，再允许提交新凭据。" />;
  }
  if (scenario === "empty") {
    return (
      <Card padding="base">
        <Empty
          title={tab === "passkeys" ? "还没有通行密钥" : "没有其他活跃会话"}
          description={tab === "passkeys" ? "添加可信设备后，可使用 WebAuthn 完成抗钓鱼登录。" : "除当前浏览器外，身份服务没有返回其他登录会话。"}
        />
      </Card>
    );
  }
  return renderReadyPanel(tab);
}

export function GossoAccountSettingsDemo() {
  const [activeTab, setActiveTab] = useState<AccountSettingsTab>("profile");
  const [scenario, setScenario] = useState<AccountFixtureScenario>("ready");

  const scenarioOptions = activeTab === "password"
    ? passwordOptions
    : activeTab === "passkeys" || activeTab === "sessions"
      ? collectionOptions
      : commonReadOptions;

  const items = [
    {
      key: "profile",
      label: "个人资料",
      icon: <User aria-hidden="true" className="size-4" />,
      children: <AccountFixturePanel tab="profile" scenario={activeTab === "profile" ? scenario : "ready"} />,
    },
    {
      key: "password",
      label: "修改密码",
      icon: <Lock aria-hidden="true" className="size-4" />,
      children: <AccountFixturePanel tab="password" scenario={activeTab === "password" ? scenario : "ready"} />,
    },
    {
      key: "mfa",
      label: "多因素认证 (MFA)",
      icon: <Shield aria-hidden="true" className="size-4" />,
      children: <MfaPanel />,
    },
    {
      key: "passkeys",
      label: "通行密钥 (FIDO2)",
      icon: <Key aria-hidden="true" className="size-4" />,
      children: <AccountFixturePanel tab="passkeys" scenario={activeTab === "passkeys" ? scenario : "ready"} />,
    },
    {
      key: "sessions",
      label: "活跃会话",
      icon: <Laptop aria-hidden="true" className="size-4" />,
      children: <AccountFixturePanel tab="sessions" scenario={activeTab === "sessions" ? scenario : "ready"} />,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {activeTab === "mfa" ? null : (
        <FixtureDock
          route={`/account-settings/${activeTab}`}
          note="账户设置 Fixture 按页面语义区分读取生命周期、空集合与 recent-auth 安全分支；MFA 保持独立 enrollment 状态机。"
          controls={(
            <Segmented<AccountFixtureScenario>
              aria-label={`${accountTabDefinitions.find((item) => item.key === activeTab)?.label ?? "账户设置"} Fixture 状态`}
              options={scenarioOptions}
              value={scenario}
              onChange={setScenario}
              block
            />
          )}
        />
      )}
      <PageHeader title="账户设置" description="维护个人资料、登录凭据、多因素认证、通行密钥与活跃会话。" />
      <Tabs<AccountSettingsTab>
        activeKey={activeTab}
        items={items}
        onChange={(next) => { setActiveTab(next); setScenario("ready"); }}
        ariaLabel="账户设置栏目"
      />
    </div>
  );
}
