import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card, Empty, Segmented, Skeleton } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import { blogCategories, blogPosts, blogTags } from "./public-content";
import { BlogPublicShellFixture } from "./public-shell";

type DiscoveryPage = "categories" | "tags" | "archive";
type DiscoveryScenario = "data" | "loading" | "empty";

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
] as const;

const pageMeta: Record<DiscoveryPage, { route: string; title: string; meta: string; subtitle: string }> = {
  categories: {
    route: "/categories",
    title: "分类",
    meta: "CATEGORY INDEX",
    subtitle: "按主题浏览长期积累的文章与工程实践。",
  },
  tags: {
    route: "/tags",
    title: "标签",
    meta: "TAG INDEX",
    subtitle: "从技术关键词进入相关实践、复盘与分析。",
  },
  archive: {
    route: "/archive",
    title: "归档",
    meta: "ARCHIVE",
    subtitle: "按发布时间回看文章，保留长期可发现的阅读路径。",
  },
};

function PageDescription({ meta, children }: { meta: string; children: string }) {
  return (
    <span>
      <span className="mr-2 text-xs font-medium uppercase tracking-wider text-primary">{meta}</span>
      {children}
    </span>
  );
}

function IndexLoading({ page }: { page: DiscoveryPage }) {
  const count = page === "archive" ? 3 : 6;
  return (
    <div role="status" aria-label={`${pageMeta[page].title}加载中`} className={page === "archive" ? "space-y-8" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={page === "archive" ? "h-24 w-full" : "h-36 w-full rounded-lg"} />
      ))}
    </div>
  );
}

function CategoriesBody({ onNavigate }: { onNavigate: (target: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {blogCategories.map((item, index) => (
        <button
          type="button"
          key={item.id}
          className="group rounded-lg border p-5 text-left transition-colors hover:border-primary hover:bg-accent/40"
          onClick={() => onNavigate(`/categories/${encodeURIComponent(item.slug)}`)}
        >
          <span className="text-xs font-mono text-primary">{String(index + 1).padStart(2, "0")}</span>
          <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">{item.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{item.description}</p>
          <span className="mt-5 flex items-center justify-between text-sm text-primary">
            {item.postCount} 篇文章
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  );
}

function TagsBody({ onNavigate }: { onNavigate: (target: string) => void }) {
  const counts = blogTags
    .map((tag) => ({ tag, count: blogPosts.filter((post) => post.tags.includes(tag)).length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {counts.map(({ tag, count }, index) => (
        <button
          type="button"
          key={tag}
          className="group flex items-center gap-4 rounded-md border px-4 py-3 text-left hover:border-primary hover:bg-accent/40"
          onClick={() => onNavigate(`/tags/${encodeURIComponent(tag)}`)}
        >
          <span className="text-xs font-mono text-primary">{String(index + 1).padStart(2, "0")}</span>
          <strong className="min-w-0 flex-1 truncate group-hover:text-primary">{tag}</strong>
          <small className="text-xs text-muted-foreground">{count} 篇</small>
        </button>
      ))}
    </div>
  );
}

function ArchiveBody({ onNavigate }: { onNavigate: (target: string) => void }) {
  const periods = useMemo(() => {
    const groups = new Map<string, typeof blogPosts>();
    for (const post of blogPosts) {
      const [year, month] = post.publishedAt.split("-");
      const key = `${year}年${Number(month)}月`;
      const current = groups.get(key) ?? [];
      groups.set(key, [...current, post]);
    }
    return Array.from(groups.entries());
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {periods.map(([period, items]) => (
        <section key={period} className="border-t pt-5 first:border-0 first:pt-0">
          <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
            {period}
            <small className="text-xs font-normal text-muted-foreground">{items.length}</small>
          </h2>
          <div className="mt-3 divide-y">
            {items.map((post) => (
              <button
                type="button"
                key={post.id}
                className="group grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left hover:text-primary"
                onClick={() => onNavigate(`/articles/${post.slug}`)}
              >
                <time dateTime={post.publishedAt} className="text-xs font-mono text-muted-foreground">{post.publishedAt.slice(8, 10)}</time>
                <span className="truncate">{post.title}</span>
                <small className="hidden text-xs text-muted-foreground sm:block">{post.tags.slice(0, 2).join(" / ")}</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function BlogDiscoveryIndexDemo({
  page,
  initialScenario = "data",
}: {
  page: DiscoveryPage;
  initialScenario?: DiscoveryScenario;
}) {
  const [scenario, setScenario] = useState<DiscoveryScenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const meta = pageMeta[page];
  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route={meta.route}
        note={`真实 Blog ${meta.title}索引页的静态迁移：复用 PublicShell 与已认证 PageHeader，只保留产品内容编排和静态状态，不调用真实 Blog API。`}
        controls={
          <Segmented<DiscoveryScenario>
            aria-label={`Blog ${meta.title} Fixture 状态`}
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath={meta.route} onNavigate={navigate}>
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
          {notice ? <div role="status" className="rounded-md border bg-muted px-4 py-3 text-sm">{notice}</div> : null}
          <PageHeader title={meta.title} description={<PageDescription meta={meta.meta}>{meta.subtitle}</PageDescription>} />
          <Card aria-label={`${meta.title}内容`}>
            {scenario === "loading" ? (
              <IndexLoading page={page} />
            ) : scenario === "empty" ? (
              <Empty title={`暂无${meta.title}内容`} description="公开内容准备好后会出现在这里。" />
            ) : page === "categories" ? (
              <CategoriesBody onNavigate={navigate} />
            ) : page === "tags" ? (
              <TagsBody onNavigate={navigate} />
            ) : (
              <ArchiveBody onNavigate={navigate} />
            )}
          </Card>
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}
