import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Key,
  Laptop,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import {
  Alert,
  Button,
  ButtonLink,
  Card,
  Heading,
  Segmented,
  Tag,
  Text,
} from "../../../src/core";
import { FixtureDock } from "../../components/fixture-dock";

type PreviewRole = "admin" | "user";

interface QuickLink {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  showcasePage?: string;
}

const roleOptions = [
  { label: "管理员", value: "admin" },
  { label: "普通用户", value: "user" },
] as const;

const adminQuickLinks: readonly QuickLink[] = [
  {
    href: "/system-management/clients",
    icon: <Key className="size-5" />,
    title: "客户端注册",
    description: "注册和配置 OAuth2 客户端凭据、授权重定向 URI、范围及授权流程模式。",
    showcasePage: "gosso-system-management",
  },
  {
    href: "/system-management/users",
    icon: <UserCheck className="size-5" />,
    title: "用户管理",
    description: "审计活跃账户、更新账户状态、分配权限范围角色。",
    showcasePage: "gosso-system-management",
  },
  {
    href: "/system-management/system",
    icon: <Settings className="size-5" />,
    title: "系统状态与审计",
    description: "查看系统运行指标、全局审计日志与站点公开品牌配置。",
    showcasePage: "gosso-system-management",
  },
];

const userQuickLinks: readonly QuickLink[] = [
  {
    href: "/account-settings/profile",
    icon: <User className="size-5" />,
    title: "个人资料与密码",
    description: "查看并维护个人账户基础信息、电子邮箱及登录密码凭据。",
    showcasePage: "gosso-account-settings",
  },
  {
    href: "/account-settings/mfa",
    icon: <Shield className="size-5" />,
    title: "安全认证 (MFA 与通行密钥)",
    description: "绑定双因素认证 (TOTP) 或注册 FIDO2 通行密钥以强化账户安全。",
    showcasePage: "gosso-account-settings",
  },
  {
    href: "/account-settings/sessions",
    icon: <Laptop className="size-5" />,
    title: "活跃登录会话",
    description: "查看当前登录设备、IP 地址及最后活跃时间，支持一键下线异常会话。",
    showcasePage: "gosso-account-settings",
  },
];

function QuickLinkCard({ link }: { link: QuickLink }) {
  const migrated = Boolean(link.showcasePage);
  return (
    <a
      href={migrated ? `#${link.showcasePage}` : link.href}
      title={migrated ? `真实产品目标：${link.href}；已由对应 Showcase 页面族覆盖` : `真实产品目标：${link.href}；该目标页面尚未迁入 Showcase`}
      aria-label={migrated ? `${link.title}，查看已迁移 Showcase 页面` : `${link.title}，目标页面尚未迁入 Showcase`}
      onClick={migrated ? undefined : (event) => event.preventDefault()}
      className="group flex min-h-32 w-full items-center gap-4 rounded-lg border bg-card p-5 text-left text-card-foreground shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary" aria-hidden="true">
        {link.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{link.title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{link.description}</span>
      </span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  );
}

export function GossoOverviewDemo() {
  const [role, setRole] = useState<PreviewRole>("admin");
  const isAdmin = role === "admin";
  const quickLinks = isAdmin ? adminQuickLinks : userQuickLinks;
  const userName = isAdmin ? "admin" : "demo-user";
  const primaryTarget = isAdmin ? "/system-management" : "/account-settings/profile";
  const primaryHref = isAdmin ? "#gosso-system-management" : "#gosso-account-settings";

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <FixtureDock
        route="/"
        note="真实页面由当前会话角色决定；Showcase 使用静态身份覆盖管理员与普通用户两种主要状态。"
        controls={<Segmented<PreviewRole> aria-label="预览身份" options={roleOptions} value={role} onChange={setRole} block />}
      />

      <Card padding="lg" variant="elevated" className="relative overflow-hidden border-primary/20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-primary/15">
              {isAdmin ? <ShieldCheck className="size-7" aria-hidden="true" /> : <UserCheck className="size-7" aria-hidden="true" />}
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
              <Heading level={1} className="text-2xl sm:text-3xl">{isAdmin ? "身份管理控制台" : "个人账户与安全中心"}</Heading>
              <Tag color="success">当前登录：{userName}（{isAdmin ? "管理员" : "普通用户"}）</Tag>
            </div>
          </div>

          <Text tone="muted" className="max-w-3xl leading-relaxed">
            {isAdmin
              ? "欢迎使用自托管 OpenID Connect / OAuth 2.0 身份提供者管理界面。管理安全凭据、客户端、用户范围及活跃会话。"
              : "欢迎使用身份管理账户中心。您可以在此更新个人基本信息、管理多因素身份验证与通行密钥，并监控活跃登录会话。"}
          </Text>

          <ButtonLink
            href={primaryHref}
            title={`真实产品目标：${primaryTarget}；已由对应 Showcase 页面族覆盖`}
            variant="solid"
            color="primary"
            icon={<ArrowRight className="size-4" />}
            iconPlacement="end"
          >
            {isAdmin ? "进入管理控制面板" : "前往账户设置"}
          </ButtonLink>
        </div>
      </Card>

      {!isAdmin ? (
        <Alert
          type="info"
          showIcon
          title="系统管理权限受限"
          description="如需访问系统管理（OAuth2 客户端及用户管理），请联系管理员分配权限或切换管理员账户登录。"
          action={<Button size="small" icon={<LogOut className="size-4" />} onClick={() => setRole("admin")}>切换账户</Button>}
        />
      ) : null}

      <section aria-labelledby="gosso-overview-quick-navigation" className="flex flex-col gap-5">
        <Heading id="gosso-overview-quick-navigation" level={2} className="text-sm font-semibold text-muted-foreground">快速导航</Heading>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickLinks.map((link) => <QuickLinkCard key={`${role}-${link.title}`} link={link} />)}
        </div>
      </section>
    </div>
  );
}
