import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  GitBranch,
  Mail,
  Menu,
  Rss,
  Search,
} from "lucide-react";
import {
  Alert,
  Button,
  Drawer,
  Empty,
  IconButton,
  Input,
  Segmented,
  Skeleton,
  Text,
} from "../../../src/core";
import { ThemeToggle } from "../../../src/theme";
import { FixtureDock } from "../../components/fixture-dock";

type Scenario = "data" | "loading" | "empty" | "error";

type PostFixture = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  cover?: string;
};

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
  { value: "error", label: "错误" },
] as const;

const posts: PostFixture[] = [
  {
    id: 1,
    title: "从 OAuth2 BFF 到产品体验：安全边界如何影响前端架构",
    slug: "oauth2-bff-product-experience",
    summary: "浏览器不持有长期 Token 并不只是安全策略，它会进一步塑造会话恢复、错误反馈与跨产品导航。",
    publishedAt: "2026-09-08",
    readTime: 8,
    tags: ["OAuth2", "BFF", "Architecture"],
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Gouno UI：用真实产品反推设计系统，而不是先造组件大全",
    slug: "gouno-ui-product-driven",
    summary: "从 Gosso Admin、Blog Admin 到公开 Blog，第三个产品形态开始检验哪些抽象是真的共享语义。",
    publishedAt: "2026-09-07",
    readTime: 6,
    tags: ["Design System", "React"],
  },
  {
    id: 3,
    title: "Kafka 背压实践：为什么并发更多不一定吞吐更高",
    slug: "kafka-backpressure",
    summary: "从分区、锁竞争和下游 I/O 看 goroutine 数量与真实吞吐之间的关系。",
    publishedAt: "2026-09-05",
    readTime: 7,
    tags: ["Go", "Kafka"],
  },
  {
    id: 4,
    title: "把 AI Agent 放进真实工程流程后，我们重新理解了自动化",
    slug: "agent-engineering-loop",
    summary: "Agent 的价值不只在生成代码，而在约束、验证、回归和可追踪交付形成闭环。",
    publishedAt: "2026-09-03",
    readTime: 9,
    tags: ["AI", "Engineering"],
  },
  {
    id: 5,
    title: "一个公开技术博客应该如何组织发现、阅读与长期归档",
    slug: "public-blog-information-architecture",
    summary: "首页不是后台 Dashboard。公开内容站点更关心阅读路径、主题索引、作者关系和长期可发现性。",
    publishedAt: "2026-09-01",
    readTime: 5,
    tags: ["Blog", "UX"],
  },
];

const navItems = ["首页", "文章", "分类", "标签", "归档", "关于"];
const categories = [
  ["工程实践", 18],
  ["AI 与工具", 14],
  ["架构与安全", 11],
] as const;
const popularTags = ["Go", "React", "OAuth2", "AI", "Design System", "Kafka"];

function navigateLabel(target: string) {
  return `将进入 ${target}（Showcase 模拟）。`;
}

function ArticleTeaser({ post, featured = false, compact = false }: { post: PostFixture; featured?: boolean; compact?: boolean }) {
  return (
    <article
      className={`group grid min-w-0 gap-5 border-b py-6 ${post.cover && !compact ? "sm:grid-cols-[minmax(0,1fr)_180px]" : ""}`}
    >
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          <span>{post.readTime} 分钟阅读</span>
        </div>
        <button type="button" className="inline-flex items-start gap-2 text-left" onClick={() => undefined}>
          <h2 className={`${featured ? "text-2xl md:text-3xl" : compact ? "text-base" : "text-xl"} break-words font-semibold leading-snug tracking-tight group-hover:text-primary`}>
            {post.title}
          </h2>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground" />
        </button>
        <p className={`mt-3 text-sm leading-7 text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
          {post.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-primary">
          {post.tags.slice(0, compact ? 3 : post.tags.length).map((tag) => (
            <button type="button" key={tag} className="hover:underline">{tag}</button>
          ))}
        </div>
      </div>
      {post.cover && !compact ? (
        <div aria-hidden="true" className="self-center">
          <img src={post.cover} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
        </div>
      ) : null}
    </article>
  );
}

function HomeLoading() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="首页加载中">
      <div className="grid gap-6 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4"><Skeleton className="h-10 w-4/5" /><Skeleton className="h-5 w-3/4" /></div>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      </div>
      <Skeleton className="h-52 w-full" />
      <div className="grid gap-8 md:grid-cols-2"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
    </div>
  );
}

function PublicShellFixture({ children, onNavigate }: { children: React.ReactNode; onNavigate: (target: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    const query = search.trim();
    if (query) onNavigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[720px] bg-background text-foreground">
      <a href="#blog-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow-overlay">
        跳到正文
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-5 px-5 lg:px-8">
          <button type="button" className="shrink-0 text-base font-semibold tracking-tight" onClick={() => onNavigate("/")}>Gouno Blog</button>
          <nav aria-label="主导航" className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button key={item} type="button" className="rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => onNavigate(item)}>{item}</button>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <div className="flex w-48 items-center gap-1">
              <Input aria-label="搜索文章" placeholder="搜索" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitSearch()} />
              <IconButton label="搜索" icon={<Search />} variant="ghost" onClick={submitSearch} />
            </div>
            <Button size="small" variant="text" onClick={() => onNavigate("/admin/dashboard")}>管理</Button>
            <ThemeToggle />
          </div>
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <IconButton label="打开导航" icon={<Menu />} variant="ghost" onClick={() => setMobileOpen(true)} />
          </div>
        </div>
      </header>

      <Drawer open={mobileOpen} title="Gouno Blog" placement="right" width={320} onClose={() => setMobileOpen(false)}>
        <nav aria-label="移动端主导航" className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button key={item} type="button" className="rounded-md px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { onNavigate(item); setMobileOpen(false); }}>{item}</button>
          ))}
        </nav>
        <div className="mt-5 flex gap-2 border-t pt-5">
          <Input aria-label="移动端搜索文章" placeholder="搜索文章" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button onClick={() => { submitSearch(); setMobileOpen(false); }}>搜索</Button>
        </div>
      </Drawer>

      <main id="blog-main" className="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-8 lg:py-14">{children}</main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div><strong className="text-foreground">Gouno Blog</strong><p className="mt-1">互联网技术分析、工程实践与长期思考。</p></div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => onNavigate("/about")}>关于</button>
            <button type="button" className="inline-flex items-center gap-1.5" onClick={() => onNavigate("/feed.xml")}><Rss className="size-4" />RSS</button>
            <button type="button" className="inline-flex items-center gap-1.5" onClick={() => onNavigate("GitHub")}><GitBranch className="size-4" />GitHub</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function BlogHomeDemo({ initialScenario = "data" }: { initialScenario?: Scenario }) {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const visiblePosts = scenario === "empty" ? [] : posts;
  const featured = visiblePosts[0];
  const secondary = visiblePosts.slice(1, 5);
  const latest = useMemo(() => visiblePosts.slice(0, 4), [visiblePosts]);

  return (
    <div className="relative">
      <FixtureDock
        route="/"
        note="真实 Blog PublicShell + Home 的静态迁移：保留公共导航、搜索、主题切换、移动端 Drawer、加载/错误/空态、首页 Hero、精选文章、主题索引、作者信息与订阅入口；不调用真实 Blog API。"
        controls={<Segmented<Scenario> aria-label="Blog Home Fixture 状态" options={scenarioOptions} value={scenario} onChange={(value) => { setScenario(value); setNotice(""); }} />}
      />
      <PublicShellFixture onNavigate={(target) => setNotice(navigateLabel(target))}>
        {notice ? <Alert className="mb-8" type="info" description={notice} showIcon /> : null}
        {scenario === "loading" ? <HomeLoading /> : (
          <div className="flex flex-col gap-12 md:gap-16">
            <section className="grid items-center gap-8 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h1 className="max-w-3xl whitespace-pre-line text-3xl font-semibold leading-tight tracking-tight md:text-[40px]">把真实工程问题，写成可以长期复用的知识。</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">记录架构、安全、AI、Go 与产品设计中的真实判断、失败和复盘，而不是只整理漂亮答案。</p>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-gradient-to-br from-muted via-background to-primary/10 p-5">
                <div className="grid h-full place-items-center rounded-md border border-dashed text-center text-sm text-muted-foreground">系统关系 / 工程路径 / 产品演进</div>
              </div>
            </section>

            {scenario === "error" ? (
              <div className="flex flex-col items-start gap-3">
                <Alert type="error" title="首页内容加载失败" description="无法读取公开文章与主题索引，请稍后重试。" showIcon />
                <Button onClick={() => setScenario("data")}>重试</Button>
              </div>
            ) : null}

            {scenario !== "error" && visiblePosts.length === 0 ? (
              <Empty title="这里还没有文章" description="完成第一篇写作后，它会成为首页主角。" />
            ) : null}

            {scenario !== "error" && featured ? (
              <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-w-0">
                  <ArticleTeaser post={featured} featured />
                  {secondary.length ? (
                    <section className="mt-10">
                      <div className="mb-2 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold">精选文章</h2><button type="button" className="inline-flex items-center gap-2 text-sm text-primary" onClick={() => setNotice(navigateLabel("/articles"))}>查看全部<ArrowRight className="size-4" /></button></div>
                      <div className="grid gap-x-8 md:grid-cols-2">{secondary.map((post) => <ArticleTeaser post={post} key={post.id} />)}</div>
                    </section>
                  ) : null}
                </div>
                <aside className="flex flex-col gap-8 lg:sticky lg:top-24">
                  <section>
                    <h2 className="mb-5 text-sm font-semibold">主题索引</h2>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xs text-muted-foreground">核心分类</h3>
                      {categories.map(([name, count]) => <button type="button" key={name} className="flex items-center justify-between gap-3 text-sm hover:text-primary" onClick={() => setNotice(navigateLabel(`/categories/${name}`))}><span>{name}</span><span className="text-xs tabular-nums text-muted-foreground">{count} 篇</span></button>)}
                    </div>
                    <div className="mt-6"><h3 className="mb-3 text-xs text-muted-foreground">热门标签</h3><div className="flex flex-wrap gap-2">{popularTags.map((tag) => <button type="button" key={tag} className="rounded-md bg-muted px-2 py-1 text-xs hover:bg-accent" onClick={() => setNotice(navigateLabel(`/tags/${tag}`))}>{tag}</button>)}</div></div>
                  </section>
                  <section className="border-t pt-6">
                    <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent font-semibold text-primary">PW</span>
                    <h2 className="font-semibold">Paw</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Full Stack Developer。关注工程、产品与 AI 在真实团队中的长期实践。</p>
                    <div className="mt-4 flex gap-4 text-sm text-primary"><button type="button" onClick={() => setNotice(navigateLabel("/about"))}>关于本站</button><button type="button" className="inline-flex items-center gap-1" onClick={() => setNotice(navigateLabel("GitHub"))}><GitBranch className="size-4" />GitHub</button></div>
                  </section>
                </aside>
              </div>
            ) : null}

            {scenario !== "error" && latest.length ? (
              <section><h2 className="mb-2 text-lg font-semibold">最新文章</h2><div className="grid gap-x-10 md:grid-cols-2">{latest.map((post) => <ArticleTeaser key={post.id} post={post} compact />)}</div></section>
            ) : null}

            <section className="flex flex-col justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center">
              <div><h2 className="text-lg font-semibold">订阅更新</h2><p className="mt-2 text-sm text-muted-foreground">每当有新文章发布，都可以通过你熟悉的方式收到。</p></div>
              <div className="flex gap-5 text-sm text-primary"><button type="button" className="inline-flex items-center gap-2" onClick={() => setNotice(navigateLabel("/feed.xml"))}><Rss className="size-4" />RSS</button><button type="button" className="inline-flex items-center gap-2" onClick={() => setNotice(navigateLabel("mailto:hello@example.com"))}><Mail className="size-4" />Email</button></div>
            </section>
          </div>
        )}
      </PublicShellFixture>
    </div>
  );
}
