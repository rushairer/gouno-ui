import { useState, type FormEvent, type ReactNode } from "react";
import { LayoutDashboard, Menu, Rss, Search } from "lucide-react";
import gounoBlogLogo from "../../../assets/brand-icons/gouno-blog.svg";
import { Drawer, IconButton, Input } from "../../../src/core";
import { ThemeToggle } from "../../../src/theme";
import { BrandMark } from "../../components/brand-mark";

const navItems = [
  { label: "文章", path: "/articles" },
  { label: "分类", path: "/categories" },
  { label: "归档", path: "/archive" },
] as const;

function activePath(currentPath: string, target: string) {
  if (target === "/articles") {
    return currentPath === "/articles" || currentPath.startsWith("/search") || currentPath.startsWith("/tags/") || currentPath.startsWith("/categories/");
  }
  return currentPath === target;
}

export function BlogPublicShellFixture({
  children,
  currentPath = "/",
  onNavigate,
}: {
  children: ReactNode;
  currentPath?: string;
  onNavigate: (target: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const search = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value) onNavigate(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a href="#public-main" className="sr-only focus:not-sr-only focus:bg-accent focus:p-3">
        跳至正文
      </a>
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex min-h-16 w-full max-w-[1200px] items-center gap-6 px-4 md:px-6">
          <button
            type="button"
            aria-label="Gouno Blog 首页"
            className="mr-auto inline-flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight text-primary"
            onClick={() => onNavigate("/")}
          >
            <BrandMark src={gounoBlogLogo} className="size-8" />
            <span className="truncate">Gouno Blog</span>
          </button>
          <nav aria-label="主导航" className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                aria-current={activePath(currentPath, item.path) ? "page" : undefined}
                className="py-5 text-sm text-muted-foreground hover:text-primary aria-[current=page]:text-primary"
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <form role="search" onSubmit={search} className="hidden items-center gap-1 lg:flex">
            <Input
              aria-label="搜索文章"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索文章…"
            />
            <IconButton type="submit" label="提交搜索" icon={<Search />} />
          </form>
          <button
            type="button"
            aria-label="进入内容后台"
            className="hidden rounded-md p-2 text-muted-foreground hover:text-primary sm:block"
            onClick={() => onNavigate("/admin")}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
          </button>
          <ThemeToggle label="切换主题" />
          <IconButton
            label="打开主导航"
            icon={<Menu />}
            className="md:hidden"
            onClick={() => setOpen(true)}
          />
        </div>
      </header>

      <main
        id="public-main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 outline-none md:px-6 md:py-12"
      >
        {children}
      </main>

      <footer className="mt-12 border-t">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-[1fr_1fr] md:px-6">
          <div>
            <button type="button" className="inline-flex items-center gap-2 font-semibold text-primary" onClick={() => onNavigate("/")}>
              <BrandMark src={gounoBlogLogo} className="size-7" />
              <span>Gouno Blog</span>
            </button>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              互联网技术分析、工程实践与长期思考。
            </p>
          </div>
          <nav aria-label="页脚导航" className="flex flex-wrap items-start gap-5 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <button type="button" key={item.path} onClick={() => onNavigate(item.path)}>{item.label}</button>
            ))}
            <button type="button" onClick={() => onNavigate("/admin")}>管理后台</button>
            <button type="button" className="inline-flex items-center gap-2" onClick={() => onNavigate("/feed.xml")}>
              <Rss className="size-4" aria-hidden="true" />RSS
            </button>
          </nav>
          <p className="text-xs text-muted-foreground md:col-span-2">© 2026 Gouno Blog</p>
        </div>
      </footer>

      <Drawer open={open} title="Gouno Blog" onClose={() => setOpen(false)}>
        <form role="search" onSubmit={search} className="mb-6 flex gap-2">
          <Input
            aria-label="移动端搜索文章"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文章…"
          />
          <IconButton type="submit" label="提交移动端搜索" icon={<Search />} />
        </form>
        <nav aria-label="移动导航" className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              aria-current={activePath(currentPath, item.path) ? "page" : undefined}
              className="rounded-md px-3 py-3 text-left hover:bg-accent aria-[current=page]:bg-accent"
              onClick={() => {
                onNavigate(item.path);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="px-3 py-3 text-left"
            onClick={() => {
              onNavigate("/admin");
              setOpen(false);
            }}
          >
            管理后台
          </button>
        </nav>
      </Drawer>
    </div>
  );
}
