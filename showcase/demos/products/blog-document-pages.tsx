import { useState, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, GitBranch, Rss } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CodeBlock,
  Result,
  Segmented,
  Skeleton,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";
import { BlogPublicShellFixture } from "./blog-public-shell";

type CustomPageScenario = "data" | "loading" | "error" | "not-found";

const customScenarioOptions = [
  { value: "data", label: "正常" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "错误" },
  { value: "not-found", label: "未找到" },
] as const;

const customPage = {
  slug: "design-system",
  title: "Gouno UI 设计系统说明",
  description: "记录 Gouno 产品家族如何从真实页面中收敛共享设计语言，而不是先造一个大而全的组件库。",
  updatedAt: "2026-09-09",
};

const customCode = `import { PageHeader } from "@gouno/ui/gouno";

export function ProductPage() {
  return <PageHeader title="真实页面" description="让产品需求验证抽象。" />;
}`;

function BlogDocumentSurface({
  title,
  description,
  meta,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card as="article" padding="none" className="mx-auto w-full max-w-[900px] overflow-hidden">
      <div className="space-y-7 p-6 sm:p-8">
        <PageHeader title={title} description={description} />
        {meta ? <div className="border-y py-3 text-sm text-muted-foreground">{meta}</div> : null}
        <div className="space-y-6 text-[15px] leading-8 text-foreground sm:text-base">{children}</div>
      </div>
    </Card>
  );
}

function CustomPageBody() {
  return (
    <>
      <p>
        这个单页来自站点内容管理，而不是前端写死的路由组件。它和文章都需要 Markdown 阅读语义，但没有文章作者、阅读量、评论和相关阅读等内容模型。
      </p>
      <h2 className="text-2xl font-semibold tracking-tight">为什么单页仍然是产品内容</h2>
      <p>
        隐私说明、项目介绍、使用指南等页面都可能由管理员持续维护。前台只负责把已经发布的内容稳定地呈现出来，加载、未找到和失败状态继续属于这个路由自己的生命周期。
      </p>
      <blockquote className="border-l-4 border-primary/40 bg-muted/40 px-5 py-4 text-muted-foreground">
        Markdown 能力可以复用，页面模型不能因为都叫“文档”就被强行合并。
      </blockquote>
      <h2 className="text-2xl font-semibold tracking-tight">公共能力保持窄职责</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>PageHeader 只表达标题与说明。</li>
        <li>CodeBlock 只表达只读代码与复制。</li>
        <li>PublicShell 继续只是 Blog 产品内部的公开站点壳。</li>
      </ul>
      <CodeBlock code={customCode} language="tsx" copyLabel="复制代码" copiedLabel="已复制" />
    </>
  );
}

function CustomPageSkeleton() {
  return (
    <Card padding="none" className="mx-auto w-full max-w-[900px] overflow-hidden" role="status" aria-label="自定义单页加载中">
      <div className="space-y-6 p-6 sm:p-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className={`h-4 ${index % 3 === 0 ? "w-full" : "w-5/6"}`} />
        ))}
      </div>
    </Card>
  );
}

export function BlogCustomPageDemo({
  initialScenario = "data",
}: {
  initialScenario?: CustomPageScenario;
}) {
  const [scenario, setScenario] = useState<CustomPageScenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const route = `/${customPage.slug}`;

  return (
    <div className="relative">
      <FixtureDock
        route={route}
        note="动态 CustomPageView 的静态迁移：页面数据、加载/错误/未找到生命周期保持 product-local；Markdown 阅读组合复用已认证 Core 能力，不创建公共 DocumentPage。"
        controls={
          <Segmented<CustomPageScenario>
            aria-label="Blog CustomPage Fixture 状态"
            options={customScenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath={route} onNavigate={(target) => setNotice(`将进入 ${target}（Showcase 模拟）。`)}>
        {notice ? <Alert className="mb-6" type="info" description={notice} showIcon /> : null}
        <Button variant="text" icon={<ArrowLeft />} className="mb-6 px-0" onClick={() => setNotice("将进入 /（Showcase 模拟）。")}>返回首页</Button>

        {scenario === "loading" ? (
          <CustomPageSkeleton />
        ) : scenario === "error" ? (
          <Card padding="none" variant="subtle" className="mx-auto max-w-[900px]">
            <Result
              status="error"
              headingLevel={1}
              title="页面载入失败"
              description="公开单页接口暂时不可用，请稍后重试。"
              extra={<Button onClick={() => setScenario("data")}>重试</Button>}
            />
          </Card>
        ) : scenario === "not-found" ? (
          <Card padding="none" variant="subtle" className="mx-auto max-w-[900px]">
            <Result
              status="info"
              headingLevel={1}
              title="页面不存在或已下线"
              description="可以返回首页继续浏览。"
              extra={<Button onClick={() => setNotice("将进入 /（Showcase 模拟）。")}>返回首页</Button>}
            />
          </Card>
        ) : (
          <BlogDocumentSurface
            title={customPage.title}
            description={customPage.description}
            meta={<span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-4" />最后更新：{customPage.updatedAt}</span>}
          >
            <CustomPageBody />
          </BlogDocumentSurface>
        )}
      </BlogPublicShellFixture>
    </div>
  );
}

export function BlogAboutDemo() {
  const [notice, setNotice] = useState("");

  return (
    <div className="relative">
      <FixtureDock
        route="/about"
        note="固定 About 页面迁移：它与动态 CustomPage 共享产品内文档阅读框架，但没有异步内容生命周期。"
      />
      <BlogPublicShellFixture currentPath="/about" onNavigate={(target) => setNotice(`将进入 ${target}（Showcase 模拟）。`)}>
        {notice ? <Alert className="mb-6" type="info" description={notice} showIcon /> : null}
        <BlogDocumentSurface
          title="关于 Gouno Blog"
          description="一个围绕真实软件工程、产品设计与 AI 协作持续记录的公开内容站点。"
        >
          <p>
            Gouno Blog 记录我们在身份系统、设计系统、前后端工程和 AI 工作流里的真实选择。内容优先解释为什么这样做、哪里踩过坑，以及最后如何用数据或代码验证结果。
          </p>

          <section aria-labelledby="about-topics" className="space-y-3">
            <h2 id="about-topics" className="text-2xl font-semibold tracking-tight">主要内容</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="rounded-lg border p-4"><strong>工程实践</strong><p className="mt-1 text-sm text-muted-foreground">Go、React、Swift、Kubernetes、性能与安全。</p></li>
              <li className="rounded-lg border p-4"><strong>设计系统</strong><p className="mt-1 text-sm text-muted-foreground">从真实产品迁移反推组件 API 与设计语言。</p></li>
              <li className="rounded-lg border p-4"><strong>身份与架构</strong><p className="mt-1 text-sm text-muted-foreground">OAuth2、BFF、会话边界与跨产品治理。</p></li>
              <li className="rounded-lg border p-4"><strong>AI 协作</strong><p className="mt-1 text-sm text-muted-foreground">Agent、模型、开发工具与可复现工作流。</p></li>
            </ul>
          </section>

          <section aria-labelledby="about-principles" className="space-y-3">
            <h2 id="about-principles" className="text-2xl font-semibold tracking-tight">写作原则</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>真实问题优先于完美故事。</li>
              <li>解释结果，也解释约束和取舍。</li>
              <li>能给证据就不给漂亮但不可验证的结论。</li>
            </ol>
          </section>

          <section aria-labelledby="about-links" className="space-y-3">
            <h2 id="about-links" className="text-2xl font-semibold tracking-tight">继续了解</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" icon={<GitBranch />} onClick={() => setNotice("将打开 GitHub（Showcase 模拟）。")}>GitHub</Button>
              <Button variant="outline" icon={<Rss />} onClick={() => setNotice("将打开 /rss.xml（Showcase 模拟）。")}>RSS</Button>
              <Button variant="text" icon={<ExternalLink />} onClick={() => setNotice("将进入 /articles（Showcase 模拟）。")}>浏览文章</Button>
            </div>
          </section>
        </BlogDocumentSurface>
      </BlogPublicShellFixture>
    </div>
  );
}
