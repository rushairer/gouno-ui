import { Card, Heading, Tag, Text } from "../../src/core";
import { NavigationGroup, PageContainer, navigationItemClass } from "../../src/gouno";
import { DemoSection } from "../components/demo-section";

type GounoComponent = "app-shell" | "page-container";

type ApiRow = {
  name: string;
  type: string;
  description: string;
};

const appShellExampleCode = `import { AppShell, NavigationGroup, navigationItemClass } from "@gouno/ui/gouno";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="Gouno Admin"
      navigation={(close) => (
        <>
          <NavigationGroup>
            <a href="/admin" className={navigationItemClass} onClick={close}>概览</a>
          </NavigationGroup>
          <NavigationGroup label="系统管理">
            <a href="/admin/oauth" className={navigationItemClass} onClick={close}>OAuth2 客户端</a>
            <a href="/admin/users" className={navigationItemClass} onClick={close}>用户</a>
          </NavigationGroup>
        </>
      )}
    >
      {children}
    </AppShell>
  );
}`;

const pageContainerExampleCode = `import { PageContainer } from "@gouno/ui/gouno";

export function SettingsPage() {
  return (
    <PageContainer>
      <section>Settings content</section>
    </PageContainer>
  );
}`;

const appShellApi: ApiRow[] = [
  { name: "brand", type: "ReactNode", description: "应用品牌/产品标识区域。" },
  { name: "navigation", type: "(close: () => void) => ReactNode", description: "桌面侧栏与移动抽屉共享的导航渲染入口。" },
  { name: "toolbar", type: "ReactNode", description: "全局工具操作区域。" },
  { name: "breadcrumbs", type: "ReactNode", description: "桌面端面包屑/上下文区域。" },
  { name: "account", type: "ReactNode", description: "账户入口区域。" },
  { name: "footer", type: "ReactNode", description: "侧栏底部区域。" },
  { name: "navigationLabel", type: "string", description: "主导航和移动入口的可访问名称。" },
  { name: "children", type: "ReactNode", description: "应用主要内容。" },
];

const pageContainerApi: ApiRow[] = [
  { name: "children", type: "ReactNode", description: "页面内容。" },
  { name: "className", type: "string", description: "在标准内容宽度/节奏之上扩展布局。" },
  { name: "...div props", type: "HTMLAttributes<HTMLDivElement>", description: "透传原生 div 属性。" },
];

function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">API</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">职责</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="px-4 py-3 font-mono text-xs text-primary">{row.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.type}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GounoComponentDemo({ component }: { component: GounoComponent }) {
  const isShell = component === "app-shell";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Gouno · @gouno/ui/gouno
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>{isShell ? "AppShell 应用框架" : "PageContainer 页面容器"}</Heading>
          <Tag color="success">Canonical</Tag>
        </div>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          {isShell
            ? "应用级 chrome：统一 header、桌面侧栏、移动导航抽屉、主内容区域和焦点返回；不拥有路由、鉴权或业务状态。"
            : "页面级内容边界：统一最大内容宽度、最小宽度和纵向节奏，不承载标题、筛选、操作区等尚未被真实产品证明的页面抽象。"}
        </Text>
      </header>

      <DemoSection
        title="基础用法"
        description={
          isShell
            ? "Showcase 用结构化缩略预览表达 AppShell 的真实区域关系，Code 展示 canonical 组件组合。"
            : "Preview 直接渲染 PageContainer，Code 给出对应的 canonical 消费方式。"
        }
        code={isShell ? appShellExampleCode : pageContainerExampleCode}
      >
        {isShell ? (
          <div className="overflow-hidden rounded-lg border bg-muted/20">
            <div className="flex h-12 items-center border-b bg-background px-4 text-sm font-medium">Header / brand / toolbar / account</div>
            <div className="grid min-h-56 grid-cols-[180px_1fr]">
              <div className="border-r bg-sidebar p-3 text-sm">
                <NavigationGroup>
                  <button type="button" className={navigationItemClass}>
                    概览
                  </button>
                </NavigationGroup>
                <NavigationGroup label="系统管理">
                  <button type="button" className={navigationItemClass}>
                    OAuth2 客户端
                  </button>
                  <button type="button" className={navigationItemClass}>
                    用户
                  </button>
                </NavigationGroup>
              </div>
              <div className="p-5">
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">Main / children</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/20 p-3">
            <PageContainer className="rounded-md border border-dashed bg-background p-5">
              <Text size="sm">PageContainer content track</Text>
              <Text size="xs" tone="muted">max-width 1440px · width 100% · vertical gap 24px</Text>
            </PageContainer>
          </div>
        )}
      </DemoSection>

      <div>
        <Heading level={3}>Public API</Heading>
        <div className="mt-3">
          <ApiTable rows={isShell ? appShellApi : pageContainerApi} />
        </div>
        {isShell ? (
          <Text size="sm" tone="muted" className="mt-3">
            NavigationGroup 的 label 可选：有 label 时渲染可见组标题；无 label 时仍拥有相同的组间距，用于概览等独立一级入口，不需要产品侧补 margin。
          </Text>
        ) : null}
      </div>
    </div>
  );
}
