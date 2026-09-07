import { useState } from "react";
import { Database, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { Alert, Button, Card, Tag, Text } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";

const oidcRows = [["Issuer", "https://sso.io84.com"], ["Authorization Endpoint", "https://sso.io84.com/oauth2/authorize"], ["Token Endpoint", "https://sso.io84.com/oauth2/token"], ["UserInfo Endpoint", "https://sso.io84.com/oauth2/userinfo"], ["JWKS URI", "https://sso.io84.com/.well-known/jwks.json"]] as const;
const policyRows = [["Session TTL", "12 hours"], ["Maximum sessions", "10"], ["Access / refresh token", "15 min / 30 days"], ["Login rate limit", "8 attempts / 15 min"], ["MFA rate limit", "6 attempts / 10 min"]] as const;

function DefinitionCard({ title, rows }: { title: string; rows: readonly (readonly [string, string])[] }) {
  return <Card padding="lg"><div className="mb-4 font-semibold">{title}</div><dl className="divide-y">{rows.map(([label, value]) => <div key={label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-5"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="min-w-0 break-all font-mono text-sm">{value}</dd></div>)}</dl></Card>;
}

export function SystemStatusPanel() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [degraded, setDegraded] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="系统状态" description="查看身份服务健康探针、关键依赖、OpenID Connect 发现信息和安全策略摘要。" actions={<Button icon={<RefreshCw />} onClick={() => setRefreshCount((count) => count + 1)}>刷新状态</Button>} />
      {degraded ? <Alert type="error" showIcon title="Redis 探针异常" description="真实产品会展示服务端返回的故障详情与重试入口。" /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="lg"><Text size="xs" tone="muted">检查时间</Text><div className="mt-2 text-lg font-semibold">刚刚</div><Text size="xs" tone="muted" className="mt-1">刷新次数：{refreshCount}</Text></Card>
        <Card padding="lg"><Text size="xs" tone="muted">HTTP Status</Text><div className="mt-2 text-lg font-semibold">200 OK</div><Text size="xs" tone="muted" className="mt-1">/health/ready</Text></Card>
        <Card padding="lg"><Text size="xs" tone="muted">Probe Duration</Text><div className="mt-2 text-lg font-semibold">12 ms</div><Text size="xs" tone="muted" className="mt-1">readiness probe</Text></Card>
      </div>
      <Card padding="lg">
        <div className="mb-4 flex items-center justify-between gap-3"><div><div className="font-semibold">基础设施健康</div><Text size="sm" tone="muted">数据库与 Redis 是 GOSSO 会话、锁和身份数据的关键依赖。</Text></div><Button size="small" onClick={() => setDegraded((value) => !value)}>切换故障 Fixture</Button></div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border p-4"><span className="flex size-10 items-center justify-center rounded-lg bg-success-subtle text-success"><Database aria-hidden="true" className="size-5" /></span><div className="min-w-0 flex-1"><div className="font-medium">PostgreSQL</div><Text size="xs" tone="muted">primary database</Text></div><Tag color="success">Healthy</Tag></div>
          <div className="flex items-center gap-3 rounded-lg border p-4"><span className={`flex size-10 items-center justify-center rounded-lg ${degraded ? "bg-danger-subtle text-destructive" : "bg-success-subtle text-success"}`}><Server aria-hidden="true" className="size-5" /></span><div className="min-w-0 flex-1"><div className="font-medium">Redis</div><Text size="xs" tone="muted">session cache & distributed lock</Text></div><Tag color={degraded ? "error" : "success"}>{degraded ? "Degraded" : "Healthy"}</Tag></div>
        </div>
      </Card>
      <DefinitionCard title="OpenID Connect Profile" rows={oidcRows} />
      <Card padding="lg"><div className="mb-4 flex items-center gap-2"><ShieldCheck aria-hidden="true" className="size-5 text-primary" /><div className="font-semibold">支持能力</div></div><div className="grid gap-4 md:grid-cols-2"><div><Text size="xs" tone="muted" className="mb-2">Scopes</Text><div className="flex flex-wrap gap-2">{["openid", "profile", "email", "admin"].map((item) => <Tag key={item} color={item === "admin" ? "warning" : "primary"}>{item}</Tag>)}</div></div><div><Text size="xs" tone="muted" className="mb-2">Grant Types</Text><div className="flex flex-wrap gap-2">{["authorization_code", "refresh_token", "client_credentials", "device_code"].map((item) => <Tag key={item}>{item}</Tag>)}</div></div></div></Card>
      <DefinitionCard title="安全策略" rows={policyRows} />
    </div>
  );
}
