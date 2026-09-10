import {
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/primitives/dropdown-menu";
import { cn } from "../lib/utils";

export interface BreadcrumbMenuItem {
  key: Key;
  title: ReactNode;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export interface BreadcrumbMenu {
  items: readonly BreadcrumbMenuItem[];
  ariaLabel?: string;
}

export interface BreadcrumbRouteItem {
  key: Key;
  title: ReactNode;
  href?: string;
  path?: string;
  className?: string;
  style?: CSSProperties;
  menu?: BreadcrumbMenu;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export interface BreadcrumbSeparatorItem {
  key: Key;
  type: "separator";
  separator?: ReactNode;
}

export type BreadcrumbItem = BreadcrumbRouteItem | BreadcrumbSeparatorItem;

export type BreadcrumbSemantic = "root" | "item" | "separator";

export interface BreadcrumbSemanticInfo {
  props: Readonly<{
    itemCount: number;
  }>;
}

export type BreadcrumbClassNames =
  | Partial<Record<BreadcrumbSemantic, string>>
  | ((info: BreadcrumbSemanticInfo) => Partial<Record<BreadcrumbSemantic, string>>);
export type BreadcrumbStyles =
  | Partial<Record<BreadcrumbSemantic, CSSProperties>>
  | ((info: BreadcrumbSemanticInfo) => Partial<Record<BreadcrumbSemantic, CSSProperties>>);

export interface BreadcrumbItemRenderInfo {
  item: BreadcrumbRouteItem;
  index: number;
  items: readonly BreadcrumbItem[];
  paths: readonly string[];
  href?: string;
  isLast: boolean;
}

export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode;
  dropdownIcon?: ReactNode;
  params?: Readonly<Record<string, string | number>>;
  itemRender?: (info: BreadcrumbItemRenderInfo) => ReactNode;
  classNames?: BreadcrumbClassNames;
  styles?: BreadcrumbStyles;
  ref?: Ref<HTMLElement>;
}

function isSeparatorItem(item: BreadcrumbItem): item is BreadcrumbSeparatorItem {
  return "type" in item && item.type === "separator";
}

function interpolatePath(
  path: string,
  params: Readonly<Record<string, string | number>>,
) {
  return path.replace(/:([A-Za-z0-9_]+)/g, (match, name: string) =>
    name in params ? encodeURIComponent(String(params[name])) : match,
  );
}

function joinRoutePaths(paths: readonly string[]) {
  const joined = paths
    .filter(Boolean)
    .map((path) => path.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return joined ? `/${joined}` : "/";
}

function routeEntries(items: readonly BreadcrumbItem[]) {
  return items.filter((item): item is BreadcrumbRouteItem => !isSeparatorItem(item));
}

function menuItemNode(item: BreadcrumbMenuItem) {
  const content = (
    <span className="flex min-w-0 items-center gap-2">
      <span className="min-w-0 truncate">{item.title}</span>
    </span>
  );

  if (item.href) {
    return (
      <DropdownMenuItem
        key={item.key}
        asChild
        disabled={item.disabled}
        variant={item.danger ? "destructive" : "default"}
      >
        <a
          href={item.href}
          onClick={(event) => item.onClick?.(event)}
        >
          {content}
        </a>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      key={item.key}
      disabled={item.disabled}
      variant={item.danger ? "destructive" : "default"}
      onSelect={(event) => item.onClick?.(event as unknown as MouseEvent<HTMLElement>)}
    >
      {content}
    </DropdownMenuItem>
  );
}

export function Breadcrumb({
  items,
  separator = "/",
  dropdownIcon = <ChevronDown aria-hidden="true" />,
  params = {},
  itemRender,
  classNames,
  styles,
  className,
  style,
  "aria-label": ariaLabel = "Breadcrumb",
  ref,
  ...props
}: BreadcrumbProps) {
  const routes = routeEntries(items);
  const semanticInfo: BreadcrumbSemanticInfo = {
    props: { itemCount: routes.length },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const paths: string[] = [];
  let routeIndex = -1;

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      data-slot="breadcrumb"
      className={cn("min-w-0", semanticClassNames.root, className)}
      style={{ ...semanticStyles.root, ...style }}
    >
      <ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-sm text-muted-foreground">
        {items.map((item) => {
          if (isSeparatorItem(item)) {
            return (
              <li
                key={item.key}
                aria-hidden="true"
                data-slot="breadcrumb-separator"
                className={cn(
                  "flex shrink-0 items-center text-muted-foreground/80",
                  semanticClassNames.separator,
                )}
                style={semanticStyles.separator}
              >
                {item.separator ?? separator}
              </li>
            );
          }

          routeIndex += 1;
          if (item.path) paths.push(interpolatePath(item.path, params));
          const href = item.href ?? (item.path ? joinRoutePaths(paths) : undefined);
          const isLast = routeIndex === routes.length - 1;
          const rendered = itemRender?.({
            item,
            index: routeIndex,
            items,
            paths: [...paths],
            href,
            isLast,
          });

          const titleNode =
            rendered ??
            (href ? (
              <a
                href={href}
                onClick={(event) => item.onClick?.(event)}
                aria-current={isLast ? "page" : undefined}
                className="inline-flex min-w-0 items-center gap-1 rounded-sm text-inherit transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
              >
                <span className="min-w-0 truncate">{item.title}</span>
              </a>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn("inline-flex min-w-0 items-center gap-1", isLast && "text-foreground")}
              >
                <span className="min-w-0 truncate">{item.title}</span>
              </span>
            ));

          return (
            <li
              key={item.key}
              data-slot="breadcrumb-item"
              className={cn(
                "flex min-w-0 items-center gap-2",
                semanticClassNames.item,
                item.className,
              )}
              style={{ ...semanticStyles.item, ...item.style }}
            >
              {routeIndex > 0 ? (
                <span
                  aria-hidden="true"
                  data-slot="breadcrumb-separator"
                  className={cn(
                    "flex shrink-0 items-center text-muted-foreground/80",
                    semanticClassNames.separator,
                  )}
                  style={semanticStyles.separator}
                >
                  {separator}
                </span>
              ) : null}

              <span className="flex min-w-0 items-center gap-1">
                {titleNode}
                {item.menu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={item.menu.ariaLabel ?? "Open breadcrumb menu"}
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex size-4 items-center justify-center [&_svg]:size-3.5">
                          {dropdownIcon}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.menu.items.map(menuItemNode)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
