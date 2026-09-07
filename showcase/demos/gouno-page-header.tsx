import { Plus, RefreshCw } from "lucide-react";
import { Button, Card, Heading, Tag, Text } from "../../src/core";
import { PageHeader } from "../../src/gouno";

const api = [
  ["title", "ReactNode", "页面主标题。"],
  ["description", "ReactNode", "标题下方的页面级说明。"],
  ["actions", "ReactNode", "页面级主次操作区域；内部统一换行和间距。"],
  ["className", "string", "扩展页面标题布局。"],
] as const;

export function GounoPageHeaderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Gouno · @gouno/ui/gouno</div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>PageHeader 页面标题</Heading>
          <Tag color="success">Canonical</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          Gouno 产品家族统一的页面标题、说明和页面级操作布局。它不拥有筛选、表格、路由或业务状态。
        </Text>
      </header>

      <Card padding="lg">
        <PageHeader
          title="OAuth2 客户端"
          description="注册和维护身份平台客户端、回调地址与授权范围。"
          actions={
            <>
              <Button icon={<RefreshCw />}>刷新</Button>
              <Button variant="solid" color="primary" icon={<Plus />}>注册客户端</Button>
            </>
          }
        />
      </Card>

      <div>
        <Heading level={3}>Public API</Heading>
        <div className="mt-3 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">API</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">职责</th></tr></thead>
            <tbody className="divide-y">
              {api.map(([name, type, description]) => (
                <tr key={name}><td className="px-4 py-3 font-mono text-xs text-primary">{name}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td><td className="px-4 py-3 text-muted-foreground">{description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
