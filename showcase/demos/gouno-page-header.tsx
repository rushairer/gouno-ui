import { Plus, RefreshCw } from "lucide-react";
import { Button, Heading, Tag, Text } from "../../src/core";
import { PageHeader } from "../../src/gouno";
import { ApiTable, type ApiRow } from "../components/api-table";
import { DemoSection } from "../components/demo-section";

const exampleCode = `import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@gouno/ui/core";
import { PageHeader } from "@gouno/ui/gouno";

export function OAuthClientsHeader() {
  return (
    <PageHeader
      title="OAuth2 客户端"
      description="注册和维护身份平台客户端、回调地址与授权范围。"
      actions={
        <>
          <Button icon={<RefreshCw />}>刷新</Button>
          <Button variant="solid" color="primary" icon={<Plus />}>
            注册客户端
          </Button>
        </>
      }
    />
  );
}`;

export const pageHeaderApi: ApiRow[] = [
  { name: "title", type: "ReactNode", description: "页面主标题，渲染为唯一页面级 h1。" },
  { name: "description", type: "ReactNode", description: "标题下方的页面级说明。" },
  { name: "actions", type: "ReactNode", description: "页面级主次操作区域；内部统一换行和间距。" },
  { name: "className", type: "string", description: "扩展页面标题布局，不应承担页面内容间距。" },
];

export function GounoPageHeaderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Gouno · @gouno/ui/gouno
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>PageHeader 页面标题</Heading>
          <Tag color="success">Canonical</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          Gouno 产品家族统一的页面标题、说明和页面级操作布局。它不拥有筛选、表格、路由或业务状态。
        </Text>
      </header>

      <DemoSection
        title="基础用法"
        description="Preview 与可复制的 @gouno/ui/gouno 代码保持在同一个示例单元。"
        code={exampleCode}
      >
        <PageHeader
          title="OAuth2 客户端"
          description="注册和维护身份平台客户端、回调地址与授权范围。"
          actions={
            <>
              <Button icon={<RefreshCw />}>刷新</Button>
              <Button variant="solid" color="primary" icon={<Plus />}>
                注册客户端
              </Button>
            </>
          }
        />
      </DemoSection>

      <section className="space-y-4">
        <Heading level={3}>PageHeader API</Heading>
        <ApiTable rows={pageHeaderApi} />
      </section>
    </div>
  );
}
