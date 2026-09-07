import { useEffect, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import {
  showcaseCatalog,
  type ShowcaseWorkspace,
} from "../catalog";

export interface StandaloneNavigationProps {
  workspace: ShowcaseWorkspace;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function StandaloneNavigation({
  workspace,
  currentPage,
  onNavigate,
}: StandaloneNavigationProps) {
  const [open, setOpen] = useState(false);
  const groups = showcaseCatalog.filter(
    (group) => group.workspace === workspace && group.items.length > 0,
  );
  const firstApplicationPage =
    groups.find((group) => group.items.some((item) => item.presentation !== "standalone"))
      ?.items.find((item) => item.presentation !== "standalone")?.id ??
    groups[0]?.items[0]?.id ??
    "";

  useEffect(() => {
    setOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!groups.length) return null;

  return (
    <nav
      aria-label="Standalone Showcase navigation"
      className="fixed left-4 top-4 z-[100] flex max-w-[calc(100vw-2rem)] flex-col items-start gap-2"
    >
      <div className="flex items-center gap-1 rounded-full border border-border/80 bg-background/88 p-1 shadow-lg backdrop-blur-xl">
        <button
          type="button"
          aria-label="返回应用页"
          title="返回应用页"
          disabled={!firstApplicationPage || currentPage === firstApplicationPage}
          onClick={() => firstApplicationPage && onNavigate(firstApplicationPage)}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <span className="hidden px-1 text-xs font-medium text-muted-foreground sm:inline">
          Showcase
        </span>
        <button
          type="button"
          aria-label={open ? "关闭页面菜单" : "打开页面菜单"}
          aria-expanded={open}
          aria-controls="standalone-showcase-menu"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {open ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
        </button>
      </div>

      {open ? (
        <div
          id="standalone-showcase-menu"
          className="w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border/80 bg-background/94 p-2 shadow-xl backdrop-blur-xl"
        >
          {groups.map((group) => (
            <div key={group.group} className="py-1 first:pt-0 last:pb-0">
              <div className="px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {group.group}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={item.id === currentPage ? "page" : undefined}
                    onClick={() => onNavigate(item.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent aria-[current=page]:text-primary"
                  >
                    <span aria-hidden="true" className="[&_svg]:size-4">
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
