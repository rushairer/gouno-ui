import { useMemo, useState } from "react";
import { ArrowRight, GitBranch, Mail, Rss } from "lucide-react";
import { Alert, Button, Empty, Segmented, Skeleton } from "../../../src/core";
import { FixtureDock } from "../../components/fixture-dock";
import {
  BlogArticleTeaser,
  blogCategories,
  blogPosts,
  blogTags,
} from "./blog-public-content";
import { BlogPublicShellFixture } from "./blog-public-shell";

type Scenario = "data" | "loading" | "empty" | "error";

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
  { value: "error", label: "错误" },
] as const;

function HomeLoading() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="首页加载中">
      <div className="grid gap-6 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      </div>
      <Skeleton className="h-52 w-full" />
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export function BlogHomeDemo({ initialScenario = "data" }: { initialScenario?: Scenario }) {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const visiblePosts = scenario === "empty" ? [] : blogPosts;
  const featured = visiblePosts[0];
  const secondary = visiblePosts.slice(1, 5);
  const latest = useMemo(() => visiblePosts.slice(0, 4), [visiblePosts]);
  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/"
        note="真实 Blog PublicShell + Home 的静态迁移：保留公共导航、搜索、主题切换、移动端 Drawer、加载/错误/空态、首页 Hero、精选文章、主题索引、作者信息与订阅入口；不调用真实 Blog API。"
        controls={
          <Segmented<Scenario>
            aria-label="Blog Home Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath="/" onNavigate={navigate}>
        {notice ? <Alert className="mb-8" type="info" description={notice} showIcon /> : null}
        {scenario === "loading" ? (
          <HomeLoading />
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            <section className="grid items-center gap-8 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h1 className="max-w-3xl whitespace-pre-line text-3xl font-semibold leading-tight tracking-tight md:text-[40px]">
                  把真实工程问题，写成可以长期复用的知识。
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  记录架构、安全、AI、Go 与产品设计中的真实判断、失败和复盘，而不是只整理漂亮答案。
                </p>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-gradient-to-br from-muted via-background to-primary/10 p-5">
                <div className="grid h-full place-items-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
                  系统关系 / 工程路径 / 产品演进
                </div>
              </div>
            </section>

            {scenario === "error" ? (
              <div className="flex flex-col items-start gap-3">
                <Alert
                  type="error"
                  title="首页内容加载失败"
                  description="无法读取公开文章与主题索引，请稍后重试。"
                  showIcon
                />
                <Button onClick={() => setScenario("data")}>重试</Button>
              </div>
            ) : null}

            {scenario !== "error" && visiblePosts.length === 0 ? (
              <Empty title="这里还没有文章" description="完成第一篇写作后，它会成为首页主角。" />
            ) : null}

            {scenario !== "error" && featured ? (
              <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-w-0">
                  <BlogArticleTeaser post={featured} featured onNavigate={navigate} />
                  {secondary.length ? (
                    <section className="mt-10">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold">精选文章</h2>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-sm text-primary"
                          onClick={() => navigate("/articles")}
                        >
                          查看全部<ArrowRight className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="grid gap-x-8 md:grid-cols-2">
                        {secondary.map((post) => (
                          <BlogArticleTeaser post={post} key={post.id} onNavigate={navigate} />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>

                <aside className="flex flex-col gap-8 lg:sticky lg:top-24">
                  <section>
                    <h2 className="mb-5 text-sm font-semibold">主题索引</h2>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xs text-muted-foreground">核心分类</h3>
                      {blogCategories.map((category) => (
                        <button
                          type="button"
                          key={category.slug}
                          className="flex items-center justify-between gap-3 text-sm hover:text-primary"
                          onClick={() => navigate(`/categories/${category.slug}`)}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">{category.postCount} 篇</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h3 className="mb-3 text-xs text-muted-foreground">热门标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {blogTags.slice(0, 6).map((tag) => (
                          <button
                            type="button"
                            key={tag}
                            className="rounded-md bg-muted px-2 py-1 text-xs hover:bg-accent"
                            onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="border-t pt-6">
                    <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent font-semibold text-primary">PW</span>
                    <h2 className="font-semibold">Paw</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Full Stack Developer。关注工程、产品与 AI 在真实团队中的长期实践。
                    </p>
                    <div className="mt-4 flex gap-4 text-sm text-primary">
                      <button type="button" onClick={() => navigate("/about")}>关于本站</button>
                      <button type="button" className="inline-flex items-center gap-1" onClick={() => navigate("GitHub")}>
                        <GitBranch className="size-4" aria-hidden="true" />GitHub
                      </button>
                    </div>
                  </section>
                </aside>
              </div>
            ) : null}

            {scenario !== "error" && latest.length ? (
              <section>
                <h2 className="mb-2 text-lg font-semibold">最新文章</h2>
                <div className="grid gap-x-10 md:grid-cols-2">
                  {latest.map((post) => (
                    <BlogArticleTeaser key={post.id} post={post} compact onNavigate={navigate} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="flex flex-col justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold">订阅更新</h2>
                <p className="mt-2 text-sm text-muted-foreground">每当有新文章发布，都可以通过你熟悉的方式收到。</p>
              </div>
              <div className="flex gap-5 text-sm text-primary">
                <button type="button" className="inline-flex items-center gap-2" onClick={() => navigate("/feed.xml")}>
                  <Rss className="size-4" aria-hidden="true" />RSS
                </button>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => navigate("mailto:hello@example.com")}>
                  <Mail className="size-4" aria-hidden="true" />Email
                </button>
              </div>
            </section>
          </div>
        )}
      </BlogPublicShellFixture>
    </div>
  );
}
