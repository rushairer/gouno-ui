import { useState } from "react";
import { FileText, KeyRound, Shield, SlidersHorizontal, Users } from "lucide-react";
import { Tabs } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { AuditLogsPanel } from "./audit-logs";
import { ClientsPanel } from "./clients";
import { FixtureBanner } from "./shared";
import { SiteSettingsPanel } from "./site-settings";
import { SystemStatusPanel } from "./system-status";
import { UsersPanel } from "./users";

export type SystemManagementTab = "clients" | "users" | "audit-logs" | "site-settings" | "system";

const systemTabs = [
  { key: "clients", label: "OAuth2 客户端", icon: <KeyRound aria-hidden="true" /> },
  { key: "users", label: "用户管理", icon: <Users aria-hidden="true" /> },
  { key: "audit-logs", label: "审计日志", icon: <FileText aria-hidden="true" /> },
  { key: "site-settings", label: "站点设置", icon: <SlidersHorizontal aria-hidden="true" /> },
  { key: "system", label: "系统状态", icon: <Shield aria-hidden="true" /> },
] as const;

function Panel({ tab }: { tab: SystemManagementTab }) {
  switch (tab) {
    case "clients":
      return <ClientsPanel />;
    case "users":
      return <UsersPanel />;
    case "audit-logs":
      return <AuditLogsPanel />;
    case "site-settings":
      return <SiteSettingsPanel />;
    case "system":
      return <SystemStatusPanel />;
  }
}

export function GossoSystemManagementDemo() {
  const [activeTab, setActiveTab] = useState<SystemManagementTab>("clients");

  return (
    <div className="flex flex-col gap-6">
      <FixtureBanner route={`/system-management/${activeTab}`} />
      <PageHeader
        title="系统管理"
        description="管理身份平台客户端、用户、审计记录、公开站点配置与系统运行状态。"
      />
      <Tabs<SystemManagementTab>
        activeKey={activeTab}
        items={systemTabs}
        onChange={setActiveTab}
        ariaLabel="系统管理栏目"
      />
      <Panel tab={activeTab} />
    </div>
  );
}