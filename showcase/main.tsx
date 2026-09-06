import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Menu } from "lucide-react";
import {
  ActionGroup, AdminPage, AdminShell, Badge, NavigationGroup, Select, ThemeProvider,
  ThemeToggle, ToastProvider, navigationItemClass,
} from "../src";
import { showcaseCatalog as nav } from "./catalog";
import { ShowcasePage } from "./app/page-router";
import "./showcase.css";

type Brand = "blog" | "blog-admin" | "gosso-admin";
type Workspace = "gouno-ui" | Brand;
type PreviewWidth = "full" | "desktop" | "tablet" | "mobile";

function workspaceForPage(page: string): Workspace {
  if (page.startsWith("blog-")) return "blog";
  if (page.startsWith("admin-")) return "blog-admin";
  if (page.startsWith("gosso-")) return "gosso-admin";
  return "gouno-ui";
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const embedded = params.get("embedded") === "1";
  const embeddedPreview = params.get("preview") as PreviewWidth | null;
  const [page, setPage] = useState(() => {
    const candidate = window.location.hash.slice(1);
    return nav
      .flatMap((group) => group.items)
      .some((item) => item.id === candidate)
      ? candidate
      : "core-button";
  });
  const [brand, setBrand] = useState<Brand>(() => {
    const candidate = params.get("brand");
    if (
      candidate === "blog" ||
      candidate === "blog-admin" ||
      candidate === "gosso-admin"
    )
      return candidate;
    const initialWorkspace = workspaceForPage(window.location.hash.slice(1));
    return initialWorkspace === "gouno-ui" ? "blog-admin" : initialWorkspace;
  });
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const candidate = params.get("workspace");
    return candidate === "blog" ||
      candidate === "blog-admin" ||
      candidate === "gosso-admin" ||
      candidate === "gouno-ui"
      ? candidate
      : workspaceForPage(window.location.hash.slice(1));
  });
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("full");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeSrc, setIframeSrc] = useState(() =>
    `${window.location.pathname}?embedded=1&workspace=${workspace}&brand=${brand}&preview=${previewWidth}#${page}`,
  );
  const current = useMemo(
    () => nav.flatMap((g) => g.items).find((item) => item.id === page),
    [page],
  );
  const workspaceLabel =
    workspace === "gouno-ui"
      ? "Gouno UI"
      : workspace === "blog"
        ? "Blog"
        : workspace === "blog-admin"
          ? "Blog Admin"
          : "Gosso Admin";
  const workspaceGroup =
    workspace === "gouno-ui"
      ? "Foundations"
      : workspace === "blog"
      ? "Blog 公共"
      : workspace === "blog-admin"
        ? "Blog Admin"
        : "Gosso Admin";
  const navigationGroups = workspace === "gouno-ui"
    ? nav.filter((group) => !["Blog 公共", "Blog Admin", "Gosso Admin"].includes(group.group))
    : nav.filter((group) => group.group === workspaceGroup);
  const switchWorkspace = (nextWorkspace: Workspace) => {
    setWorkspace(nextWorkspace);
    if (nextWorkspace !== "gouno-ui") setBrand(nextWorkspace);
    const nextGroup =
      nextWorkspace === "gouno-ui"
        ? "Foundations"
        : nextWorkspace === "blog"
        ? "Blog 公共"
        : nextWorkspace === "blog-admin"
          ? "Blog Admin"
          : "Gosso Admin";
    const belongsToWorkspace = nextWorkspace === "gouno-ui"
      ? nav.filter((group) => !["Blog 公共", "Blog Admin", "Gosso Admin"].includes(group.group)).flatMap((group) => group.items).some((item) => item.id === page)
      : nav.find((group) => group.group === nextGroup)?.items.some((item) => item.id === page);
    if (!belongsToWorkspace) {
      const defaultPage =
        nextWorkspace === "gouno-ui"
          ? "core-button"
          : nextWorkspace === "blog"
          ? "blog-home"
          : nextWorkspace === "blog-admin"
            ? "admin-dashboard"
            : "gosso-system";
      window.location.hash = defaultPage;
      setPage(defaultPage);
    }
  };
  useEffect(() => {
    const onHashChange = () => {
      const candidate = window.location.hash.slice(1);
      if (
        nav
          .flatMap((group) => group.items)
          .some((item) => item.id === candidate)
      ) {
        setPage(candidate);
        const nextWorkspace = workspaceForPage(candidate);
        setWorkspace(nextWorkspace);
        if (nextWorkspace !== "gouno-ui") setBrand(nextWorkspace);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    if (embedded) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [embedded, page, previewWidth]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('[data-showcase-nav-item][aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page]);
  useEffect(() => {
    if (embedded && window.parent !== window)
      window.parent.postMessage(
        { type: "gouno-showcase:navigate", page },
        window.location.origin,
      );
  }, [embedded, page]);
  useEffect(() => {
    if (embedded) return;
    setIframeSrc(
      `${window.location.pathname}?embedded=1&workspace=${workspace}&brand=${brand}&preview=${previewWidth}#${page}`,
    );
  }, [embedded, workspace, brand, previewWidth]);
  useEffect(() => {
    if (embedded) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "gouno-showcase:navigate", page },
      window.location.origin,
    );
  }, [embedded, page]);
  useEffect(() => {
    if (embedded) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "gouno-showcase:navigate") {
        const nextPage = String(event.data.page || "");
        if (
          nav
            .flatMap((group) => group.items)
            .some((item) => item.id === nextPage)
        ) {
          setPage(nextPage);
          window.history.replaceState(null, "", `#${nextPage}`);
        }
      }
      if (event.data?.type === "gouno-showcase:brand")
        setBrand(event.data.brand as Brand);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedded]);
  const workspaceControl = (
      <Select
        aria-label="产品空间"
        size="compact"
        value={workspace}
        onChange={(e) => switchWorkspace(e.target.value as Workspace)}
      >
        <option value="gouno-ui">Gouno UI</option>
        <option value="blog">Blog</option>
        <option value="blog-admin">Blog Admin</option>
        <option value="gosso-admin">Gosso Admin</option>
      </Select>
  );
  const viewportControl = (
    <Select
      aria-label="预览宽度"
      size="compact"
      value={previewWidth}
      onChange={(event) =>
        setPreviewWidth(event.target.value as PreviewWidth)
      }
    >
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
      onChange={(event) => {
        const nextBrand = event.target.value as Brand;
        setBrand(nextBrand);
        if (embedded && window.parent !== window)
          window.parent.postMessage(
            { type: "gouno-showcase:brand", brand: nextBrand },
            window.location.origin,
          );
      }}
    >
      <option value="blog">Blog 蓝</option>
      <option value="blog-admin">Blog Admin 青</option>
      <option value="gosso-admin">Gosso Admin 紫</option>
    </Select>
  ) : null;
  const shellControls = (
    <ActionGroup>
      {themeColorControl}
      <ThemeToggle />
    </ActionGroup>
  );
  const navigation = (close: () => void) => (
    <>
      {navigationGroups.map((group) => (
        <NavigationGroup key={group.group} label={group.group}>
          {group.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-showcase-nav-item
              aria-current={page === item.id ? "page" : undefined}
              aria-label={`${item.label}，完善度 ${item.progress}%`}
              className={`${navigationItemClass} ${page === item.id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = item.id;
                setPage(item.id);
                close();
              }}
            >
              {item.icon}
              <span className="min-w-0 flex-1 leading-5">{item.label}</span>
              <Badge
                count={`${item.progress}%`}
                size="small"
                title={`${item.label} 完善度 ${item.progress}%`}
                className="shrink-0 [&_sup]:bg-primary [&_sup]:text-primary-foreground"
              />
            </a>
          ))}
        </NavigationGroup>
      ))}
    </>
  );
  return (
    <ThemeProvider brand={brand} storageKey="gouno-ui-showcase:theme">
      <ToastProvider>
        {!embedded ? (
          <div className="h-dvh overflow-hidden bg-background text-foreground">
            <header className="flex h-12 items-center justify-between gap-3 border-b border-primary/20 bg-sidebar px-3 text-sidebar-foreground shadow-sm lg:px-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary">
                <span className="size-2 rounded-full bg-primary" />
                Gouno UI Showcase
              </div>
              <ActionGroup>
                {workspaceControl}
                {viewportControl}
              </ActionGroup>
            </header>
            <main
              className={
                previewWidth === "full"
                  ? "h-[calc(100dvh-48px)] min-w-0"
                  : "h-[calc(100dvh-48px)] min-w-0 overflow-auto bg-muted/30 p-4 lg:p-6"
              }
            >
              <iframe
                ref={iframeRef}
                key={`${workspace}-${brand}-${previewWidth}`}
                title={`${current?.label ?? "页面"} ${previewWidth} 视口预览`}
                src={iframeSrc}
                className={
                  previewWidth === "full"
                    ? "block h-full w-full border-0 bg-background"
                    : "mx-auto block rounded-lg border bg-background shadow-sm"
                }
                style={{
                  boxSizing: previewWidth === "full" ? "border-box" : "content-box",
                  width:
                    previewWidth === "full"
                      ? "100%"
                      : previewWidth === "desktop"
                      ? 1024
                      : previewWidth === "tablet"
                        ? 768
                        : 390,
                  height:
                    previewWidth === "full"
                      ? "100%"
                      : previewWidth === "desktop"
                      ? 768
                      : previewWidth === "tablet"
                        ? 1024
                        : 844,
                }}
              />
            </main>
          </div>
        ) : (
        <AdminShell
          brand={
            embedded ? (
              <span className="font-semibold text-primary">{workspaceLabel}</span>
            ) : (
              <button
                className="font-semibold text-primary"
                onClick={() => setPage("core-button")}
              >
                Gouno UI Demo
              </button>
            )
          }
          toolbar={shellControls}
          navigation={navigation}
        >
          <AdminPage>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Menu className="size-4" />
              页面 Demo / {current?.label} / 预览：
              {
                {
                  full: "全宽",
                  desktop: "1024px",
                  tablet: "768px",
                  mobile: "390px",
                }[embeddedPreview || previewWidth]
              }
            </div>
            <ShowcasePage page={page} />
          </AdminPage>
        </AdminShell>
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
