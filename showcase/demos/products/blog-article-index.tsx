import { useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import {
  Alert,
  Button,
  Empty,
  Field,
  Pagination,
  SearchField,
  Segmented,
  Skeleton,
} from "../../../src/core";
import { FixtureDock } from "../../components/fixture-dock";
import {
  BlogArticleTeaser,
  blogCategories,
  blogPosts,
  blogTags,
} from "./blog-public-content";
import { BlogPublicShellFixture } from "./blog-public-shell";

type ArticleIndexMode = "articles" | "search" | "tag" | "category";
type ArticleIndexScenario = "data" | "loading" | "empty" | "error";

const scenarioOptions = [
  { value: "data", label: "有数据" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空数据" },
  { value: "error", label: "错误" },
] as const;

const modeDefaults: Record<ArticleIndexMode, { route: string; query: string; tag: string; category: string }> = {
  articles: { route: "/articles", query: "", tag: "", category: "" },
  search: { route: "/search?q=OAuth2", query: "OAuth2", tag: "", category: "" },
  tag: { route: "/tags/OAuth2", query: "", tag: "OAuth2", category: "" },
  category: { route: "/categories/engineering", query: "", tag: "", category: "工程实践" },
};

function ArticleListSkeleton() {
  return (
    <div role="status" aria-label="文章列表加载中" className="flex flex-col gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="border-b pb-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-7 w-4/5" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function BlogArticleIndexDemo({
  mode = "articles",
  initialScenario = "data",
}: {
  mode?: ArticleIndexMode;
  initialScenario?: ArticleIndexScenario;
}) {
  const defaults = modeDefaults[mode];
  const [scenario, setScenario] = useState<ArticleIndexScenario>(initialScenario);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(defaults.query);
  const [submittedQuery, setSubmittedQuery] = useState(defaults.query);
  const [notice, setNotice] = useState("");

  const title =
    mode === "search"
      ? submittedQuery
        ? `“${submittedQuery}”的搜索结果`
        : "搜索文章"
      : mode === "tag"
        ? `标签：${defaults.tag}`
        : mode === "category"
          ? `分类：${defaults.category}`
          : "全部文章";

  const filteredPosts = useMemo(() => {
    if (scenario === "empty") return [];
    return blogPosts.filter((post) => {
      const matchesQuery = !submittedQuery || `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase().includes(submittedQuery.toLowerCase());
      const matchesTag = !defaults.tag || post.tags.includes(defaults.tag);
      const matchesCategory = !defaults.category || post.category === defaults.category;
      return matchesQuery && matchesTag && matchesCategory;
    });
  }, [defaults.category, defaults.tag, scenario, submittedQuery]);

  const pageSize = 10;
  const total = filteredPosts.length;
  const visiblePosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
  const currentPath = mode === "search" ? `/search?q=${encodeURIComponent(submittedQuery)}` : defaults.route;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    setSubmittedQuery(value);
    setPage(1);
    setNotice(value ? `将进入 /search?q=${encodeURIComponent(value)}（Showcase 模拟）。` : "搜索关键词为空。 ");
  };

  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route={currentPath}
        note="真实 ArticleIndex 的静态迁移：同一页面结构承载 /articles、/search、/tags/:slug 与 /categories/:slug；保留搜索、标签筛选、分页和加载/错误/空态，不调用真实 Blog API。"
        controls={
          <Segmented<ArticleIndexScenario>
            aria-label="Blog ArticleIndex Fixture 状态"
            options={scenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
              setPage(1);
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath={currentPath} onNavigate={navigate}>
        {notice ? <Alert className="mb-8" type="info" description={notice} showIcon /> : null}
        <div className="flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{total} 篇文章，持续记录问题、选择与实现。</p>
          </header>

          <section aria-label="筛选" className="flex flex-col gap-4 border-y py-5">
            <form className="flex max-w-xl gap-3" onSubmit={submitSearch}>
              <Field label="关键词" className="flex-1">
                <SearchField
                  id={`article-search-${mode}`}
                  name="q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="搜索文章"
                />
              </Field>
              <Button type="submit" className="self-end" icon={<Search />}>搜索</Button>
            </form>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm text-muted-foreground">标签</span>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
                onClick={() => navigate("/articles")}
              >
                全部
              </button>
              {blogTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  aria-current={tag === defaults.tag ? "page" : undefined}
                  className="rounded-md border px-3 py-1 text-sm hover:bg-accent aria-[current=page]:border-primary aria-[current=page]:bg-accent"
                  onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section aria-live="polite" className="mx-auto w-full max-w-[900px]">
            {scenario === "loading" ? (
              <ArticleListSkeleton />
            ) : scenario === "error" ? (
              <div className="flex flex-col items-start gap-3">
                <Alert type="error" title="文章载入失败" description="公开文章接口暂时不可用。" showIcon />
                <Button onClick={() => setScenario("data")}>重试</Button>
              </div>
            ) : visiblePosts.length === 0 ? (
              <Empty
                title="没有找到符合条件的文章。"
                description="可以调整关键词或返回全部文章继续浏览。"
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => navigate("/articles")}>浏览全部文章</Button>
                    <Button onClick={() => navigate("/archive")}>浏览归档</Button>
                  </div>
                }
              />
            ) : (
              visiblePosts.map((post) => <BlogArticleTeaser key={post.id} post={post} onNavigate={navigate} />)
            )}

            {scenario === "data" && total > pageSize ? (
              <Pagination
                className="mt-8"
                page={page}
                total={total}
                pageSize={pageSize}
                ariaLabel="文章分页"
                onChange={(nextPage) => setPage(nextPage)}
              />
            ) : null}
          </section>

          {mode === "category" ? (
            <span className="sr-only">{blogCategories.find((category) => category.name === defaults.category)?.slug}</span>
          ) : null}
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}
