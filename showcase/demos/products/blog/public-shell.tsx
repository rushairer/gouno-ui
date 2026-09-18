import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { LayoutDashboard, Menu, Rss } from "lucide-react";
import gounoBlogLogo from "../../../../assets/brand-icons/gouno-blog.svg";
import { Drawer, IconButton, Input } from "../../../../src/core";
import { ThemeToggle } from "../../../../src/theme";
import { BrandMark } from "../../../components/brand-mark";

const navItems = [
  { label: "文章", path: "/articles" },
  { label: "分类", path: "/categories" },
  { label: "归档", path: "/archive" },
] as const;

function activePath(currentPath: string, target: string) {
  if (target === "/articles") {
    return (
      currentPath === "/articles" ||
      currentPath.startsWith("/search") ||
      currentPath.startsWith("/tags/") ||
      currentPath.startsWith("/categories/")
    );
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

  const navigate = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
    closeDrawer = false,
  ) => {
    event.preventDefault();
    onNavigate(target);
    if (closeDrawer) setOpen(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#public-main"
        className="sr-only focus:not-sr-only focus:bg-accent focus:p-3"
      >
        跳至正文
      </a>
      <header className="sticky top-0 layer-shell border-b bg-background">
        <div className="mx-auto flex min-h-16 w-full max-w-[1200px] items-center gap-6 px-4 md:px-6">
          <a
            href="/"
            aria-label="Gouno Blog 首页"
            className="mr-auto inline-flex min-w-0 items-center gap-2 type-body-lg type-weight-semibold type-tracking-title text-primary"
            onClick={(event) => navigate(event, "/")}
          >
            <BrandMark src={gounoBlogLogo} className="size-8" />
            <span className="truncate">Gouno Blog</span>
          </a>
          <nav aria-label="主导航" className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                aria-current={
                  activePath(currentPath, item.path) ? "page" : undefined
                }
                className="py-5 type-body-sm text-muted-foreground hover:text-primary aria-[current=page]:text-primary"
                onClick={(event) => navigate(event, item.path)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <form role="search" onSubmit={search} className="hidden lg:block">
            <Input
              aria-label="搜索文章"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索文章…"
            />
          </form>
          <IconButton
            label="进入内容后台"
            icon={<LayoutDashboard />}
            className="hidden sm:inline-flex"
            onClick={() => onNavigate("/admin")}
          />
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
            <a
              href="/"
              className="inline-flex items-center gap-2 type-weight-semibold"
              onClick={(event) => navigate(event, "/")}
            >
              <BrandMark
                src={gounoBlogLogo}
                className="size-7 text-primary"
              />
              <span>Gouno Blog</span>
            </a>
            <p className="mt-2 max-w-md type-body-sm text-muted-foreground">
              互联网技术分析、工程实践与长期思考。
            </p>
          </div>
          <nav
            aria-label="页脚导航"
            className="flex flex-wrap items-start gap-5 type-body-sm text-muted-foreground"
          >
            {navItems.map((item) => (
              <a
                href={item.path}
                key={item.path}
                onClick={(event) => navigate(event, item.path)}
              >
                {item.label}
              </a>
            ))}
            <a href="/admin" onClick={(event) => navigate(event, "/admin")}>
              管理后台
            </a>
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-2"
              onClick={(event) => navigate(event, "/feed.xml")}
            >
              <Rss className="size-4" aria-hidden="true" />
              RSS
            </a>
          </nav>
          <p className="type-caption text-muted-foreground md:col-span-2">
            © 2026 Gouno Blog
          </p>
        </div>
      </footer>

      <Drawer open={open} title="Gouno Blog" onClose={() => setOpen(false)}>
        <form role="search" onSubmit={search} className="mb-6">
          <Input
            aria-label="移动端搜索文章"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文章…"
          />
        </form>
        <nav aria-label="移动导航" className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              aria-current={
                activePath(currentPath, item.path) ? "page" : undefined
              }
              className="rounded-md px-3 py-3 text-left hover:bg-accent aria-[current=page]:bg-accent"
              onClick={(event) => navigate(event, item.path, true)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/admin"
            className="px-3 py-3 text-left"
            onClick={(event) => navigate(event, "/admin", true)}
          >
            管理后台
          </a>
        </nav>
      </Drawer>
    </div>
  );
}
