import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Menu } from "lucide-react";
import { Badge, Select } from "../src/core";
import {
  AppShell,
  NavigationGroup,
  PageContainer,
  navigationItemClass,
} from "../src/gouno";
import { ThemeProvider, ThemeToggle } from "../src/theme";
import {
  showcaseCatalog as nav,
  type ShowcaseLayer,
  type ShowcaseWorkspace,
} from "./catalog";
import { ShowcasePage } from "./app/page-router";
import { StandaloneNavigation } from "./components/standalone-navigation";
import "./showcase.css";

type Brand = "blog" | "blog-admin" | "gosso-admin";
type Workspace = ShowcaseWorkspace;
type PreviewWidth = "full" | "desktop" | "tablet" | "mobile";

const layerOrder: readonly ShowcaseLayer[] = ["core", "theme", "patterns", "gouno"];
const layerLabels: Record<ShowcaseLayer, string> = {
  core: "Core 基础组件",
  theme: "Theme 主题",
  patterns: "Patterns 复合模式",
  gouno: "Gouno 产品结构",
};
const workspaceLabels: Record<Workspace, string> = {
  "gouno-ui": "Gouno UI",
  blog: "Blog",
  "blog-admin": "Blog Admin",
  "gosso-admin": "Gosso Admin",
};

function isWorkspace(value: string | null): value is Workspace {
  return value === "gouno-ui" || value === "blog" || value === "blog-admin" || value === "gosso-admin";
}

function isBrand(value: string | null): value is Brand {
  return value === "blog" || value === "blog-admin" || value === "gosso-admin";
}

function workspaceItems(workspace: Workspace) {
  return nav.filter((group) => group.workspace === workspace).flatMap((group) => group.items);
}

function firstPageForWorkspace(workspace: Workspace) {
  return workspaceItems(workspace)[0]?.id ?? "";
}

function workspaceForPage(page: string): Workspace {
  return nav.find((group) => group.items.some((item) => item.id === page))?.workspace ?? "gouno-ui";
}

function isKnownPage(page: string) {
  return nav.some((group) => group.items.some((item) => item.id === page));
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const embedded = params.get("embedded") === "1";
  const embeddedPreview = params.get("preview") as PreviewWidth | null;
  const hashCandidate = window.location.hash.slice(1);
  const requestedWorkspace = params.get("workspace");
  const initialWorkspace: Workspace = isWorkspace(requestedWorkspace)
    ? requestedWorkspace
    : isKnownPage(hashCandidate)
      ? workspaceForPage(hashCandidate)
      : "gouno-ui";

  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [page, setPage] = useState(() =>
    isKnownPage(hashCandidate) && workspaceForPage(hashCandidate) === initialWorkspace
      ? hashCandidate
      : firstPageForWorkspace(initialWorkspace),
  );
  const [brand, setBrand] = useState<Brand>(() => {
    const requestedBrand = params.get("brand");
    if (isBrand(requestedBrand)) return requestedBrand;
    return initialWorkspace === "gouno-ui" ? "blog-admin" : initialWorkspace;
  });
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("full");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameUrl = (nextWorkspace: Workspace, nextBrand: Brand, nextPreview: PreviewWidth, nextPage: string) =>
    `${window.location.pathname}?embedded=1&workspace=${nextWorkspace}&brand=${nextBrand}&preview=${nextPreview}${nextPage ? `#${nextPage}` : ""}`;
  const [iframeSrc, setIframeSrc] = useState(() => frameUrl(initialWorkspace, brand, previewWidth, page));

  const current = useMemo(
    () => nav.flatMap((group) => group.items).find((item) => item.id === page),
    [page],
  );
  const workspaceLabel = workspaceLabels[workspace];
  const navigationGroups = nav.filter((group) => group.workspace === workspace);

  const switchWorkspace = (nextWorkspace: Workspace) => {
    setWorkspace(nextWorkspace);
    if (nextWorkspace !== "gouno-ui") setBrand(nextWorkspace);
    const belongsToWorkspace = page ? workspaceItems(nextWorkspace).some((item) => item.id === page) : false;
    if (belongsToWorkspace) return;
    const nextPage = firstPageForWorkspace(nextWorkspace);
    setPage(nextPage);
    if (nextPage) window.location.hash = nextPage;
    else window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  };

  const navigateToPage = (nextPage: string) => {
    if (!isKnownPage(nextPage)) return;
    const nextWorkspace = workspaceForPage(nextPage);
    setPage(nextPage);
    setWorkspace(nextWorkspace);
    if (nextWorkspace !== "gouno-ui") setBrand(nextWorkspace);
    window.location.hash = nextPage;
  };

  useEffect(() => {
    const onHashChange = () => {
      const candidate = window.location.hash.slice(1);
      if (!isKnownPage(candidate)) return;
      setPage(candidate);
      const nextWorkspace = workspaceForPage(candidate);
      setWorkspace(nextWorkspace);
      if (nextWorkspace !== "gouno-ui") setBrand(nextWorkspace);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (embedded) document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [embedded, page, previewWidth]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('[data-showcase-nav-item][aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page]);

  useEffect(() => {
    if (embedded && window.parent !== window) {
      window.parent.postMessage({ type: "gouno-showcase:navigate", page }, window.location.origin);
    }
  }, [embedded, page]);

  useEffect(() => {
    if (!embedded) setIframeSrc(frameUrl(workspace, brand, previewWidth, page));
  }, [embedded, workspace, brand, previewWidth]);

  useEffect(() => {
    if (embedded) return;
    iframeRef.current?.contentWindow?.postMessage({ type: "gouno-showcase:navigate", page }, window.location.origin);
  }, [embedded, page]);

  useEffect(() => {
    if (embedded) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "gouno-showcase:navigate") {
        const nextPage = String(event.data.page || "");
        if (nextPage && isKnownPage(nextPage)) {
          setPage(nextPage);
          window.history.replaceState(null, "", `#${nextPage}`);
        }
      }
      if (event.data?.type === "gouno-showcase:brand" && isBrand(event.data.brand)) setBrand(event.data.brand);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedded]);

  const workspaceControl = (
    <Select aria-label="产品空间" size="small" value={workspace} onChange={(next) => switchWorkspace(String(next) as Workspace)}>
      <option value="gouno-ui">Gouno UI</option>
      <option value="blog">Blog</option>
      <option value="blog-admin">Blog Admin</option>
      <option value="gosso-admin">Gosso Admin</option>
    </Select>
  );

  const viewportControl = (
    <Select aria-label="预览宽度" size="small" value={previewWidth} onChange={(next) => setPreviewWidth(String(next) as PreviewWidth)}>
      <option value="full">全宽</option>
      <option value="desktop">桌面 1024</option>
      <option value="tablet">平板 768</option>
      <option value="mobile">移动 390</option>
    </Select>
  );

  const themeColorControl = workspace === "gouno-ui" ? (
    <Select
      aria-label="Gouno UI 主题色"
      value={brand}
      onChange={(next) => {
        const nextBrand = String(next) as Brand;
        setBrand(nextBrand);
        if (embedded && window.parent !== window) {
          window.parent.postMessage({ type: "gouno-showcase:brand", brand: nextBrand }, window.location.origin);
        }
      }}
    >
      <option value="blog">Blog 蓝</option>
      <option value="blog-admin">Blog Admin 青</option>
      <option value="gosso-admin">Gosso Admin 紫</option>
    </Select>
  ) : null;

  const shellControls = <div className="flex flex-wrap items-center gap-2">{themeColorControl}<ThemeToggle /></div>;

  const renderNavItem = (item: (typeof nav)[number]["items"][number], close: () => void) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      data-showcase-nav-item
      aria-current={page === item.id ? "page" : undefined}
      aria-label={item.progress < 100 ? `${item.label}，API 与示例阶段性完成度约 ${item.progress}%` : item.label}
      className={`${navigationItemClass} ${page === item.id ? "active" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        window.location.hash = item.id;
        setPage(item.id);
        close();
      }}
    >
      {item.icon}
      <span className="min-w-0 flex-1 leading-5">{item.label}</span>
      {item.progress < 100 ? <Badge count={`~${item.progress}%`} size="small" title={`${item.label} API 与示例阶段性完成度约 ${item.progress}%`} className="shrink-0" /> : null}
    </a>
  );

  const navigation = (close: () => void) => {
    if (workspace === "gouno-ui") {
      return <>{layerOrder.map((layer) => {
        const groups = navigationGroups.filter((group) => group.layer === layer);
        const itemCount = groups.reduce((count, group) => count + group.items.length, 0);
        return (
          <NavigationGroup key={layer} label={layerLabels[layer]}>
            {itemCount === 0 ? (
              <div className="mx-3 rounded-md border border-dashed px-3 py-3 text-xs leading-relaxed text-muted-foreground">暂无已认证组件。真实产品证据通过准入后才会出现在这里。</div>
            ) : groups.map((group) => (
              <div key={group.group} className="mb-4 last:mb-0">
                <div className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">{group.group}</div>
                <div className="flex flex-col gap-1">{group.items.map((item) => renderNavItem(item, close))}</div>
              </div>
            ))}
          </NavigationGroup>
        );
      })}</>;
    }

    if (!navigationGroups.some((group) => group.items.length)) {
      return (
        <NavigationGroup label={`${workspaceLabel} · 已迁移页面`}>
          <div className="mx-3 rounded-md border border-dashed px-3 py-3 text-xs leading-relaxed text-muted-foreground">暂无已迁移页面。旧模拟页面已清除。</div>
        </NavigationGroup>
      );
    }

    return <>{navigationGroups.filter((group) => group.items.length).map((group) => (
      <NavigationGroup key={group.group} label={group.group}>
        {group.items.map((item) => renderNavItem(item, close))}
      </NavigationGroup>
    ))}</>;
  };

  const previewLabel = ({ full: "全宽", desktop: "1024px", tablet: "768px", mobile: "390px" } as const)[embeddedPreview || previewWidth];

  return (
    <ThemeProvider brand={brand} storageKey="gouno-ui-showcase:theme">
      {!embedded ? (
        <div className="h-dvh overflow-hidden bg-background text-foreground">
          <header className="flex h-12 items-center justify-between gap-3 border-b border-primary/20 bg-sidebar px-3 text-sidebar-foreground shadow-sm lg:px-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary"><span className="size-2 rounded-full bg-primary" />Gouno UI Showcase</div>
            <div className="flex flex-wrap items-center gap-2">{workspaceControl}{viewportControl}</div>
          </header>
          <main className={previewWidth === "full" ? "h-[calc(100dvh-48px)] min-w-0" : "h-[calc(100dvh-48px)] min-w-0 overflow-auto bg-muted/30 p-4 lg:p-6"}>
            <iframe
              ref={iframeRef}
              key={`${workspace}-${brand}-${previewWidth}`}
              title={`${current?.label ?? workspaceLabel} ${previewWidth} 视口预览`}
              src={iframeSrc}
              className={previewWidth === "full" ? "block h-full w-full border-0 bg-background" : "mx-auto block rounded-lg border bg-background shadow-sm"}
              style={{
                boxSizing: previewWidth === "full" ? "border-box" : "content-box",
                width: previewWidth === "full" ? "100%" : previewWidth === "desktop" ? 1024 : previewWidth === "tablet" ? 768 : 390,
                height: previewWidth === "full" ? "100%" : previewWidth === "desktop" ? 768 : previewWidth === "tablet" ? 1024 : 844,
              }}
            />
          </main>
        </div>
      ) : current?.presentation === "standalone" ? (
        <div className="relative min-h-dvh">
          <StandaloneNavigation
            workspace={workspace}
            currentPage={page}
            onNavigate={navigateToPage}
          />
          <ShowcasePage page={page} workspace={workspace} />
        </div>
      ) : (
        <AppShell brand={<span className="font-semibold text-primary">{workspaceLabel}</span>} toolbar={shellControls} navigation={navigation}>
          <PageContainer>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Menu className="size-4" />{current ? `页面 Demo / ${current.label}` : `${workspaceLabel} / 暂无已迁移页面`} / 预览：{previewLabel}</div>
            <ShowcasePage page={page} workspace={workspace} />
          </PageContainer>
        </AppShell>
      )}
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
