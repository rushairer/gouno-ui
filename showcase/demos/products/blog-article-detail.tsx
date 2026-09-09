import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Eye, Heart, UserRound } from "lucide-react";
import {
  Alert,
  Anchor,
  Button,
  Card,
  CodeBlock,
  Result,
  Segmented,
  Skeleton,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";
import { BlogArticleTeaser, blogPosts } from "./blog-public-content";
import { BlogPublicShellFixture } from "./blog-public-shell";

type ArticleDetailScenario = "data" | "preview" | "loading" | "error" | "not-found";

const scenarioOptions = [
  { value: "data", label: "正常" },
  { value: "preview", label: "预览" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "错误" },
  { value: "not-found", label: "未找到" },
] as const;

const article = blogPosts[0];

const articleMeta = {
  author: "Paw",
  views: 1284,
  likes: 96,
};

const tocItems = [
  { key: "boundary-first", title: "先画边界，再谈组件" },
  { key: "browser-session", title: <span className="pl-3">浏览器只持有本域会话</span> },
  { key: "reading-contract", title: "把安全约束翻译成阅读体验" },
  { key: "single-source-code", title: <span className="pl-3">代码展示也需要单一来源</span> },
  { key: "product-validation", title: "让真实产品反向验证设计系统" },
] as const;

const sampleCode = `export async function loadSession(request: Request) {
  const session = await readBusinessSession(request.headers.get("cookie"));
  if (!session) return { authenticated: false };

  return {
    authenticated: true,
    user: await fetchUserFromBff(session),
  };
}`;

function renderSyntaxPreview(source: string) {
  const tokens = source.split(/(export|async|function|const|if|return|await|true|false|null)/g);
  return tokens.map((token, index) =>
    /^(export|async|function|const|if|return|await|true|false|null)$/.test(token) ? (
      <span key={`${token}-${index}`} className="text-primary">{token}</span>
    ) : (
      token
    ),
  );
}

function ArticleDetailSkeleton() {
  return (
    <div role="status" aria-label="文章详情加载中" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <Card padding="none" className="overflow-hidden">
        <Skeleton className="aspect-[16/7] w-full rounded-none" />
        <div className="space-y-6 p-6 sm:p-8">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className={`h-4 ${index % 2 === 0 ? "w-full" : "w-5/6"}`} />
          ))}
        </div>
      </Card>
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function ArticleMetadata({ onNavigate }: { onNavigate: (target: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y py-4 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-4" />{article.publishedAt}</span>
      <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-4" />{article.readTime} 分钟阅读</span>
      <span className="inline-flex items-center gap-1.5"><UserRound aria-hidden="true" className="size-4" />{articleMeta.author}</span>
      <span className="inline-flex items-center gap-1.5"><Eye aria-hidden="true" className="size-4" />{articleMeta.views.toLocaleString()} 阅读</span>
      <span className="inline-flex items-center gap-1.5"><Heart aria-hidden="true" className="size-4" />{articleMeta.likes}</span>
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        {article.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-md border px-2 py-1 text-xs text-foreground hover:border-primary hover:bg-accent"
            onClick={() => onNavigate(`/tags/${encodeURIComponent(tag)}`)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadingBody() {
  return (
    <div className="space-y-7 text-[15px] leading-8 text-foreground sm:text-base">
      <p>
        浏览器不持有长期 Token 看起来是一条安全规则，但真正落进产品以后，它会继续影响会话恢复、错误提示、跨产品跳转和前端能否独立调用身份服务。安全边界最终会变成用户体验的一部分。
      </p>

      <section aria-labelledby="boundary-first" className="space-y-4">
        <h2 id="boundary-first" className="scroll-mt-24 text-2xl font-semibold tracking-tight">先画边界，再谈组件</h2>
        <p>
          公开 Blog、Blog Admin 与 GOSSO 控制台可以共享视觉语言，但它们不是同一种应用壳。公开站点首先是阅读和发现系统；后台才需要持续的应用导航、任务操作和权限上下文。
        </p>
        <blockquote className="border-l-4 border-primary/40 bg-muted/40 px-5 py-4 text-muted-foreground">
          共享设计语言，不等于共享所有页面结构。真正稳定的抽象必须来自相同的用户意图与交互责任。
        </blockquote>

        <h3 id="browser-session" className="scroll-mt-24 text-xl font-semibold tracking-tight">浏览器只持有本域会话</h3>
        <p>
          当 Token exchange、refresh、userinfo 与 revoke 都收回 BFF，浏览器只需要理解自己的业务会话。这样做降低了跨域凭证暴露面，也让前端错误状态更接近用户真正能理解的“登录态是否可恢复”。
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>业务 Cookie 只属于当前站点，并使用 Secure / HttpOnly。</li>
          <li>身份协议细节停留在 BFF 与身份服务之间。</li>
          <li>浏览器拿到的是产品语义，而不是一组可跨域滥用的 Token。</li>
        </ul>
      </section>

      <section aria-labelledby="reading-contract" className="space-y-4">
        <h2 id="reading-contract" className="scroll-mt-24 text-2xl font-semibold tracking-tight">把安全约束翻译成阅读体验</h2>
        <p>
          对公开文章页而言，真正重要的是稳定标题层级、可复制的深链接、窄而可读的正文宽度，以及在移动端仍然可访问的目录。TOC 本身不应该发明第二套滚动系统。
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="border-b px-4 py-3 font-semibold">问题</th>
                <th className="border-b px-4 py-3 font-semibold">稳定责任</th>
                <th className="border-b px-4 py-3 font-semibold">归属</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border-b px-4 py-3">固定头部遮挡标题</td><td className="border-b px-4 py-3">scroll-margin-top</td><td className="border-b px-4 py-3">Heading / product content</td></tr>
              <tr><td className="border-b px-4 py-3">目录导航</td><td className="border-b px-4 py-3">真实 hash 链接</td><td className="border-b px-4 py-3">Core Anchor</td></tr>
              <tr><td className="px-4 py-3">代码复制</td><td className="px-4 py-3">单一源码 + clipboard feedback</td><td className="px-4 py-3">Core CodeBlock</td></tr>
            </tbody>
          </table>
        </div>

        <h3 id="single-source-code" className="scroll-mt-24 text-xl font-semibold tracking-tight">代码展示也需要单一来源</h3>
        <p>
          高亮器可以不同，但展示和复制不能来自两份字符串。下面的静态示例用产品局部 token 呈现模拟高亮，而复制仍然只读取同一个 canonical code。
        </p>
        <CodeBlock
          code={sampleCode}
          language="tsx"
          copyLabel="复制代码"
          copiedLabel="已复制"
          renderCode={renderSyntaxPreview}
        />
      </section>

      <figure className="space-y-3">
        <div
          role="img"
          aria-label="浏览器、Blog BFF 与 GOSSO 身份服务边界示意图"
          className="grid aspect-[16/7] place-items-center rounded-lg border bg-gradient-to-br from-primary/10 via-muted/60 to-background p-6"
        >
          <div className="grid w-full max-w-2xl grid-cols-3 items-center gap-3 text-center text-sm">
            <div className="rounded-lg border bg-background p-4 font-medium">Browser</div>
            <div className="rounded-lg border bg-background p-4 font-medium">Blog BFF</div>
            <div className="rounded-lg border bg-background p-4 font-medium">GOSSO</div>
          </div>
        </div>
        <figcaption className="text-center text-xs text-muted-foreground">阅读页中的静态架构插图占位：图片语义属于文章内容，不提升为公共 Diagram 组件。</figcaption>
      </figure>

      <section aria-labelledby="product-validation" className="space-y-4">
        <h2 id="product-validation" className="scroll-mt-24 text-2xl font-semibold tracking-tight">让真实产品反向验证设计系统</h2>
        <p>
          同一套规则先被后台产品验证，再来到公开内容站点，才能看出哪些能力是真正产品无关的。PageHeader 在公开文章标题语义下仍然成立；AppShell 则不成立。Anchor 与 CodeBlock 都是被真实阅读路径重新证明后才完成收口。
        </p>
        <p>
          这也是产品驱动迁移的价值：不是先决定设计系统应该有什么，而是在实际页面里找到最小、稳定、可复用的责任边界。
        </p>
      </section>
    </div>
  );
}

export function BlogArticleDetailDemo({
  initialScenario = "data",
}: {
  initialScenario?: ArticleDetailScenario;
}) {
  const [scenario, setScenario] = useState<ArticleDetailScenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const route = scenario === "preview" ? `/articles/${article.slug}?preview=1` : `/articles/${article.slug}`;

  const relatedPosts = useMemo(() => blogPosts.slice(1, 3), []);
  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route={route}
        note="真实 PostDetail 阅读骨架的静态迁移：保留文章层级、元信息、TOC 深链接、代码复制、媒体、相关阅读和主要加载/错误/未找到/管理员预览状态；点赞与评论/回复/举报状态机留到 Reading 下一阶段。"
        controls={
          <Segmented<ArticleDetailScenario>
            aria-label="Blog ArticleDetail Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath={route} onNavigate={navigate}>
        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-1 bg-muted">
          <div className="h-full w-[42%] bg-primary" />
        </div>

        {notice ? <Alert className="mb-6" type="info" description={notice} showIcon /> : null}
        {scenario === "preview" ? (
          <Alert
            className="mb-6"
            type="warning"
            title="管理员预览模式"
            description="此 Fixture 模拟真实文章预览入口，不改变公开阅读页的布局责任。"
            showIcon
          />
        ) : null}

        <Button variant="text" icon={<ArrowLeft />} className="mb-6 px-0" onClick={() => navigate("/articles")}>返回文章列表</Button>

        {scenario === "loading" ? (
          <ArticleDetailSkeleton />
        ) : scenario === "error" ? (
          <Card padding="none" variant="subtle">
            <Result
              status="error"
              headingLevel={1}
              title="文章载入失败"
              description="公开文章接口暂时不可用，请稍后重试。"
              extra={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={() => setScenario("data")}>重试</Button>
                  <Button variant="outline" onClick={() => navigate("/articles")}>返回文章列表</Button>
                </div>
              }
            />
          </Card>
        ) : scenario === "not-found" ? (
          <Card padding="none" variant="subtle">
            <Result
              status="info"
              headingLevel={1}
              title="文章不存在或已下线"
              description="可以返回文章索引继续浏览其他内容。"
              extra={<Button onClick={() => navigate("/articles")}>浏览全部文章</Button>}
            />
          </Card>
        ) : (
          <>
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <Card as="article" padding="none" className="overflow-hidden">
                <div
                  role="img"
                  aria-label={`${article.title} 封面占位`}
                  className="grid aspect-[16/7] place-items-center border-b bg-gradient-to-br from-primary/15 via-muted to-background p-6"
                >
                  <span className="rounded-full border bg-background/80 px-4 py-2 text-xs text-muted-foreground">ARTICLE COVER · STATIC FIXTURE</span>
                </div>
                <div className="space-y-8 p-6 sm:p-8">
                  <PageHeader title={article.title} description={article.summary} />
                  <ArticleMetadata onNavigate={navigate} />
                  <ReadingBody />
                </div>
              </Card>

              <aside className="lg:sticky lg:top-24">
                <Card variant="subtle" padding="sm">
                  <div className="mb-3 text-sm font-semibold">文章目录</div>
                  <Anchor aria-label="文章目录" items={tocItems} />
                </Card>
              </aside>
            </div>

            <section aria-labelledby="related-reading" className="mx-auto mt-12 w-full max-w-[900px]">
              <div className="border-b pb-3">
                <h2 id="related-reading" className="text-xl font-semibold tracking-tight">相关阅读</h2>
                <p className="mt-1 text-sm text-muted-foreground">继续沿着架构与设计系统的阅读路径向下探索。</p>
              </div>
              {relatedPosts.map((post) => (
                <BlogArticleTeaser key={post.id} post={post} compact onNavigate={navigate} />
              ))}
            </section>
          </>
        )}
      </BlogPublicShellFixture>
    </div>
  );
}
