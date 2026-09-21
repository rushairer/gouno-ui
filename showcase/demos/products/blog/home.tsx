import { useMemo, useState, type MouseEvent } from "react";
import { ArrowRight, GitBranch, Mail, Rss } from "lucide-react";
import { Alert, Button, Empty, Heading, Segmented } from "../../../../src/core";
import { FixtureDock } from "../../../components/fixture-dock";
import {
  BlogArticleTeaser,
  blogCategories,
  blogPosts,
  blogTags,
} from "./public-content";
import { BlogPublicShellFixture } from "./public-shell";
import { BlogHomeLoading } from "./loading";

type Scenario = "data" | "loading" | "empty" | "error";

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
  { value: "error", label: "错误" },
] as const;

export function BlogHomeDemo({
  initialScenario = "data",
}: {
  initialScenario?: Scenario;
}) {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const visiblePosts = scenario === "empty" ? [] : blogPosts;
  const featured = visiblePosts[0];
  const secondary = visiblePosts.slice(1, 5);
  const latest = useMemo(() => visiblePosts.slice(0, 4), [visiblePosts]);
  const navigate = (target: string) =>
    setNotice(`将进入 ${target}（Showcase 模拟）。`);
  const navigateLink = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    event.preventDefault();
    navigate(target);
  };

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
        {notice ? (
          <Alert
            className="mb-8"
            type="info"
            description={notice}
            showIcon
          />
        ) : null}
        {scenario === "loading" ? (
          <BlogHomeLoading />
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            <section className="grid items-center gap-8 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <Heading level={1} variant="display" className="max-w-3xl text-balance whitespace-pre-line">
                  把真实工程问题，写成可以长期复用的知识。
                </Heading>
                <p className="mt-5 max-w-2xl type-reading-lead text-muted-foreground">
                  记录架构、安全、AI、Go
                  与产品设计中的真实判断、失败和复盘，而不是只整理漂亮答案。
                </p>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-gradient-to-br from-muted via-background to-primary/10 p-5">
                <div className="grid h-full place-items-center rounded-md border border-dashed text-center type-body-sm text-muted-foreground">
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
              <Empty
                title="这里还没有文章"
                description="完成第一篇写作后，它会成为首页主角。"
              />
            ) : null}

            {scenario !== "error" && featured ? (
              <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-w-0">
                  <BlogArticleTeaser
                    post={featured}
                    featured
                    onNavigate={navigate}
                  />
                  {secondary.length ? (
                    <section className="mt-10">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <Heading level={2} variant="subsection">精选文章</Heading>
                        <a
                          href="/articles"
                          className="inline-flex items-center gap-2 type-body-sm text-primary"
                          onClick={(event) => navigateLink(event, "/articles")}
                        >
                          查看全部
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </a>
                      </div>
                      <div className="grid gap-x-8 md:grid-cols-2">
                        {secondary.map((post) => (
                          <BlogArticleTeaser
                            post={post}
                            key={post.id}
                            onNavigate={navigate}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>

                <aside className="flex flex-col gap-8 lg:sticky lg:top-24">
                  <section>
                    <Heading level={2} variant="label" className="mb-5">主题索引</Heading>
                    <div className="flex flex-col gap-3">
                      <Heading level={3} variant="micro" className="text-muted-foreground">核心分类</Heading>
                      {blogCategories.map((category) => {
                        const target = `/categories/${category.slug}`;
                        return (
                          <a
                            href={target}
                            key={category.slug}
                            className="flex items-center justify-between gap-3 type-body-sm hover:text-primary"
                            onClick={(event) => navigateLink(event, target)}
                          >
                            <span>{category.name}</span>
                            <span className="type-caption tabular-nums text-muted-foreground">
                              {category.postCount} 篇
                            </span>
                          </a>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <Heading level={3} variant="micro" className="mb-3 text-muted-foreground">
                        热门标签
                      </Heading>
                      <div className="flex flex-wrap gap-2">
                        {blogTags.slice(0, 6).map((tag) => {
                          const target = `/tags/${encodeURIComponent(tag)}`;
                          return (
                            <a
                              href={target}
                              key={tag}
                              className="rounded-md bg-muted px-2 py-1 type-caption hover:bg-accent"
                              onClick={(event) => navigateLink(event, target)}
                            >
                              {tag}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <section className="border-t pt-6">
                    <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent type-weight-semibold text-primary">
                      PW
                    </span>
                    <Heading level={2} variant="compact">Paw</Heading>
                    <p className="mt-2 type-reading-sm text-muted-foreground">
                      Full Stack Developer。关注工程、产品与 AI
                      在真实团队中的长期实践。
                    </p>
                    <div className="mt-4 flex gap-4 type-body-sm text-primary">
                      <a
                        href="/about"
                        onClick={(event) => navigateLink(event, "/about")}
                      >
                        关于本站
                      </a>
                      <a
                        href="https://github.com"
                        className="inline-flex items-center gap-1"
                        onClick={(event) => navigateLink(event, "GitHub")}
                      >
                        <GitBranch className="size-4" aria-hidden="true" />
                        GitHub
                      </a>
                    </div>
                  </section>
                </aside>
              </div>
            ) : null}

            {scenario !== "error" && latest.length ? (
              <section>
                <Heading level={2} variant="subsection" className="mb-2">最新文章</Heading>
                <div className="grid gap-x-10 md:grid-cols-2">
                  {latest.map((post) => (
                    <BlogArticleTeaser
                      key={post.id}
                      post={post}
                      compact
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="flex flex-col justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center">
              <div>
                <Heading level={2} variant="subsection">订阅更新</Heading>
                <p className="mt-2 type-body-sm text-muted-foreground">
                  每当有新文章发布，都可以通过你熟悉的方式收到。
                </p>
              </div>
              <div className="flex gap-5 type-body-sm text-primary">
                <a
                  href="/feed.xml"
                  className="inline-flex items-center gap-2"
                  onClick={(event) => navigateLink(event, "/feed.xml")}
                >
                  <Rss className="size-4" aria-hidden="true" />
                  RSS
                </a>
                <a
                  href="mailto:hello@example.com"
                  className="inline-flex items-center gap-2"
                  onClick={(event) =>
                    navigateLink(event, "mailto:hello@example.com")
                  }
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email
                </a>
              </div>
            </section>
          </div>
        )}
      </BlogPublicShellFixture>
    </div>
  );
}
