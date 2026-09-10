import type { ComponentType } from "react";
import { PageHeader } from "../../../../src/gouno";
import { AuditLogsPanel } from "./audit-logs";
import { ClientsPanel } from "./clients";
import { FixtureBanner } from "./shared";
import { SiteSettingsPanel } from "./site-settings";
import { SystemStatusPanel } from "./system-status";
import { UsersPanel } from "./users";

export type SystemManagementSection = "clients" | "users" | "audit-logs" | "site-settings" | "system";

type SystemManagementPage = {
  title: string;
  route: string;
  panel: ComponentType;
};

const systemPages: Record<SystemManagementSection, SystemManagementPage> = {
  clients: {
    title: "OAuth2 客户端",
    route: "/system-management/clients",
    panel: ClientsPanel,
  },
  users: {
    title: "用户管理",
    route: "/system-management/users",
    panel: UsersPanel,
  },
  "audit-logs": {
    title: "审计日志",
    route: "/system-management/audit-logs",
    panel: AuditLogsPanel,
  },
  "site-settings": {
    title: "站点设置",
    route: "/system-management/site-settings",
    panel: SiteSettingsPanel,
  },
  system: {
    title: "系统状态",
    route: "/system-management/system",
    panel: SystemStatusPanel,
  },
};

export function GossoSystemManagementDemo({ section = "clients" }: { section?: SystemManagementSection }) {
  const page = systemPages[section];
  const Panel = page.panel;

  return (
    <div className="flex flex-col gap-6">
      <FixtureBanner route={page.route} />
      <PageHeader title={page.title} />
      <Panel />
    </div>
  );
}
