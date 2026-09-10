import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export type MenuMode = "vertical" | "horizontal" | "inline";
export type MenuTriggerSubMenuAction = "hover" | "click";

export interface MenuItem {
  key: Key;
  label: ReactNode;
  type?: "item";
  icon?: ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface MenuSubMenuItem {
  key: Key;
  label: ReactNode;
  type: "submenu";
  children: readonly MenuNode[];
  icon?: ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface MenuItemGroup {
  key: Key;
  type: "group";
  label?: ReactNode;
  children: readonly MenuNode[];
}

export interface MenuDividerItem {
  key: Key;
  type: "divider";
}

export type MenuNode = MenuItem | MenuSubMenuItem | MenuItemGroup | MenuDividerItem;

export interface MenuClickInfo {
  key: Key;
  keyPath: Key[];
  item: MenuItem;
  nativeEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
}

export interface MenuSelectInfo extends MenuClickInfo {
  selectedKeys: Key[];
}

export interface MenuExpandIconInfo {
  item: MenuSubMenuItem;
  open: boolean;
  mode: MenuMode;
}

export type MenuSemantic =
  | "root"
  | "list"
  | "item"
  | "icon"
  | "label"
  | "submenu"
  | "expandIcon"
  | "group"
  | "groupLabel"
  | "divider";

export interface MenuSemanticInfo {
  props: Readonly<{
    mode: MenuMode;
    multiple: boolean;
    selectable: boolean;
    inlineCollapsed: boolean;
  }>;
}

export type MenuClassNames =
  | Partial<Record<MenuSemantic, string>>
  | ((info: MenuSemanticInfo) => Partial<Record<MenuSemantic, string>>);
export type MenuStyles =
  | Partial<Record<MenuSemantic, CSSProperties>>
  | ((info: MenuSemanticInfo) => Partial<Record<MenuSemantic, CSSProperties>>);

export interface MenuProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onClick" | "onSelect"> {
  items: readonly MenuNode[];
  selectedKeys?: readonly Key[];
  defaultSelectedKeys?: readonly Key[];
  openKeys?: readonly Key[];
  defaultOpenKeys?: readonly Key[];
  mode?: MenuMode;
  multiple?: boolean;
  selectable?: boolean;
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  triggerSubMenuAction?: MenuTriggerSubMenuAction;
  forceSubMenuRender?: boolean;
  expandIcon?: ReactNode | ((info: MenuExpandIconInfo) => ReactNode);
  onClick?: (info: MenuClickInfo) => void;
  onSelect?: (info: MenuSelectInfo) => void;
  onDeselect?: (info: MenuSelectInfo) => void;
  onOpenChange?: (openKeys: Key[]) => void;
  classNames?: MenuClassNames;
  styles?: MenuStyles;
  ref?: Ref<HTMLElement>;
}

function isSubMenu(item: MenuNode): item is MenuSubMenuItem {
  return item.type === "submenu";
}

function isGroup(item: MenuNode): item is MenuItemGroup {
  return item.type === "group";
}

function isDivider(item: MenuNode): item is MenuDividerItem {
  return item.type === "divider";
}

function keyToken(key: Key) {
  return `${typeof key === "number" ? "n" : "s"}:${String(key)}`;
}

function includesKey(keys: readonly Key[], key: Key) {
  return keys.some((candidate) => candidate === key);
}

function uniqueKeys(keys: readonly Key[]) {
  return Array.from(new Set(keys));
}

function collectVisibleFocusableKeys(
  items: readonly MenuNode[],
  openKeys: readonly Key[],
): Key[] {
  return items.flatMap((item) => {
    if (isDivider(item)) return [];
    if (isGroup(item)) return collectVisibleFocusableKeys(item.children, openKeys);
    if (item.disabled) return [];
    return [
      item.key,
      ...(isSubMenu(item) && includesKey(openKeys, item.key)
        ? collectVisibleFocusableKeys(item.children, openKeys)
        : []),
    ];
  });
}

function collectKeyMap(items: readonly MenuNode[], map = new Map<string, Key>()) {
  for (const item of items) {
    map.set(keyToken(item.key), item.key);
    if (isSubMenu(item) || isGroup(item)) collectKeyMap(item.children, map);
  }
  return map;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}

function hasHiddenAncestor(element: HTMLElement) {
  let current: HTMLElement | null = element;
  while (current) {
    if (current.hidden) return true;
    current = current.parentElement;
  }
  return false;
}

export function Menu({
  items,
  selectedKeys,
  defaultSelectedKeys = [],
  openKeys,
  defaultOpenKeys = [],
  mode = "vertical",
  multiple = false,
  selectable = true,
  inlineCollapsed = false,
  inlineIndent = 24,
  triggerSubMenuAction = "click",
  forceSubMenuRender = false,
  expandIcon,
  onClick,
  onSelect,
  onDeselect,
  onOpenChange,
  classNames,
  styles,
  className,
  style,
  onKeyDown,
  "aria-label": ariaLabel = "Menu",
  ref,
  ...props
}: MenuProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<Key[]>(() =>
    uniqueKeys(defaultSelectedKeys),
  );
  const [innerOpenKeys, setInnerOpenKeys] = useState<Key[]>(() => uniqueKeys(defaultOpenKeys));
  const actualSelectedKeys = selectedKeys ?? innerSelectedKeys;
  const actualOpenKeys = openKeys ?? innerOpenKeys;
  const visibleFocusableKeys = useMemo(
    () => collectVisibleFocusableKeys(items, actualOpenKeys),
    [items, actualOpenKeys],
  );
  const keyMap = useMemo(() => collectKeyMap(items), [items]);
  const [focusKey, setFocusKey] = useState<Key | null>(() =>
    defaultSelectedKeys[0] ?? null,
  );
  const effectiveFocusKey =
    focusKey !== null && includesKey(visibleFocusableKeys, focusKey)
      ? focusKey
      : (visibleFocusableKeys[0] ?? null);
  const normalizedInlineIndent = Number.isFinite(inlineIndent) ? Math.max(0, inlineIndent) : 24;
  const collapsedInline = mode === "inline" && inlineCollapsed;
  const semanticInfo: MenuSemanticInfo = {
    props: { mode, multiple, selectable, inlineCollapsed: collapsedInline },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const setSelected = (next: Key[]) => {
    const normalized = uniqueKeys(next);
    if (selectedKeys === undefined) setInnerSelectedKeys(normalized);
    return normalized;
  };

  const setOpen = (next: Key[]) => {
    const normalized = uniqueKeys(next);
    if (openKeys === undefined) setInnerOpenKeys(normalized);
    onOpenChange?.(normalized);
    return normalized;
  };

  const toggleOpen = (key: Key, nextOpen?: boolean) => {
    const currentlyOpen = includesKey(actualOpenKeys, key);
    const shouldOpen = nextOpen ?? !currentlyOpen;
    if (shouldOpen === currentlyOpen) return;
    setOpen(
      shouldOpen
        ? [...actualOpenKeys, key]
        : actualOpenKeys.filter((candidate) => candidate !== key),
    );
  };

  const activateItem = (
    item: MenuItem,
    keyPath: Key[],
    nativeEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => {
    const info: MenuClickInfo = { key: item.key, keyPath, item, nativeEvent };
    onClick?.(info);
    if (!selectable || item.disabled) return;

    const selected = includesKey(actualSelectedKeys, item.key);
    if (multiple && selected) {
      const next = setSelected(actualSelectedKeys.filter((key) => key !== item.key));
      onDeselect?.({ ...info, selectedKeys: next });
      return;
    }

    const next = setSelected(multiple ? [...actualSelectedKeys, item.key] : [item.key]);
    onSelect?.({ ...info, selectedKeys: next });
  };

  const focusByToken = (token: string | null) => {
    if (!token) return;
    const nextKey = keyMap.get(token);
    if (nextKey === undefined) return;
    setFocusKey(nextKey);
    const nextElement = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-menu-key]") ?? [],
    ).find((element) => element.dataset.menuKey === token && !hasHiddenAncestor(element));
    nextElement?.focus();
  };

  const visibleFocusableElements = () =>
    Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-menu-key]") ?? []).filter(
      (element) => element.getAttribute("aria-disabled") !== "true" && !hasHiddenAncestor(element),
    );

  const moveFocus = (target: HTMLElement, delta: number, sameDepth = false) => {
    const targetDepth = target.dataset.menuDepth;
    const elements = visibleFocusableElements().filter(
      (element) => !sameDepth || element.dataset.menuDepth === targetDepth,
    );
    const index = elements.indexOf(target);
    if (index < 0 || elements.length === 0) return;
    const next = elements[(index + delta + elements.length) % elements.length];
    focusByToken(next.dataset.menuKey ?? null);
  };

  const focusBoundary = (toEnd: boolean) => {
    const elements = visibleFocusableElements();
    const next = toEnd ? elements[elements.length - 1] : elements[0];
    focusByToken(next?.dataset.menuKey ?? null);
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target?.dataset.menuKey) return;
    const isHorizontalRoot = mode === "horizontal" && target.dataset.menuDepth === "0";

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusBoundary(event.key === "End");
      return;
    }

    if (event.key === "ArrowRight") {
      if (isHorizontalRoot) {
        event.preventDefault();
        moveFocus(target, 1, true);
        return;
      }
      if (target.dataset.menuSubmenu === "true") {
        const key = keyMap.get(target.dataset.menuKey);
        if (key !== undefined) {
          event.preventDefault();
          toggleOpen(key, true);
        }
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      const parentToken = target.dataset.menuParentKey;
      if (parentToken) {
        const parentKey = keyMap.get(parentToken);
        if (parentKey !== undefined) {
          event.preventDefault();
          toggleOpen(parentKey, false);
          focusByToken(parentToken);
        }
        return;
      }
      if (isHorizontalRoot) {
        event.preventDefault();
        moveFocus(target, -1, true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (isHorizontalRoot && target.dataset.menuSubmenu === "true") {
        const key = keyMap.get(target.dataset.menuKey);
        if (key !== undefined) {
          event.preventDefault();
          toggleOpen(key, true);
        }
        return;
      }
      event.preventDefault();
      moveFocus(target, 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(target, -1);
      return;
    }

    if (event.key === "Escape") {
      const parentToken = target.dataset.menuParentKey;
      if (parentToken) {
        const parentKey = keyMap.get(parentToken);
        if (parentKey !== undefined) {
          event.preventDefault();
          toggleOpen(parentKey, false);
          focusByToken(parentToken);
        }
      }
    }
  };

  const renderNodes = (
    nodes: readonly MenuNode[],
    path: readonly Key[] = [],
    depth = 0,
    parentKey?: Key,
  ): ReactNode =>
    nodes.map((node) => {
      if (isDivider(node)) {
        return (
          <li
            key={node.key}
            role="separator"
            data-slot="menu-divider"
            className={cn("my-1 h-px bg-border", semanticClassNames.divider)}
            style={semanticStyles.divider}
          />
        );
      }

      if (isGroup(node)) {
        return (
          <li
            key={node.key}
            role="none"
            data-slot="menu-group"
            className={cn("min-w-0", semanticClassNames.group)}
            style={semanticStyles.group}
          >
            {node.label !== undefined ? (
              <div
                data-slot="menu-group-label"
                className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", semanticClassNames.groupLabel)}
                style={semanticStyles.groupLabel}
              >
                {node.label}
              </div>
            ) : null}
            <ul role="group" className="m-0 flex list-none flex-col gap-1 p-0">
              {renderNodes(node.children, path, depth, parentKey)}
            </ul>
          </li>
        );
      }

      const token = keyToken(node.key);
      const parentToken = parentKey === undefined ? undefined : keyToken(parentKey);
      const selected = includesKey(actualSelectedKeys, node.key);
      const isFocused = effectiveFocusKey === node.key;
      const itemPadding =
        mode === "inline" && !collapsedInline
          ? { paddingInlineStart: `${12 + depth * normalizedInlineIndent}px` }
          : undefined;
      const label = (
        <span
          data-slot="menu-label"
          className={cn(
            "min-w-0 flex-1 truncate",
            collapsedInline && "sr-only",
            semanticClassNames.label,
          )}
          style={semanticStyles.label}
        >
          {node.label}
        </span>
      );
      const icon = node.icon !== undefined ? (
        <span
          aria-hidden="true"
          data-slot="menu-icon"
          className={cn("flex size-4 shrink-0 items-center justify-center [&_svg]:size-4", semanticClassNames.icon)}
          style={semanticStyles.icon}
        >
          {node.icon}
        </span>
      ) : null;

      if (isSubMenu(node)) {
        const open = includesKey(actualOpenKeys, node.key);
        const popup = mode !== "inline" || collapsedInline;
        const originExpandIcon = (
          <ChevronRight
            aria-hidden="true"
            className={cn("transition-transform", open && !popup && "rotate-90")}
          />
        );
        const resolvedExpandIcon =
          typeof expandIcon === "function"
            ? expandIcon({ item: node, open, mode })
            : (expandIcon ?? originExpandIcon);
        const shouldRenderSubmenu = open || forceSubMenuRender;

        return (
          <li
            key={node.key}
            role="none"
            data-slot="menu-submenu"
            className={cn("relative min-w-0", semanticClassNames.submenu)}
            style={semanticStyles.submenu}
            onMouseEnter={
              triggerSubMenuAction === "hover" && !node.disabled
                ? () => toggleOpen(node.key, true)
                : undefined
            }
            onMouseLeave={
              triggerSubMenuAction === "hover" && !node.disabled
                ? () => toggleOpen(node.key, false)
                : undefined
            }
          >
            <button
              type="button"
              role="menuitem"
              title={node.title}
              disabled={node.disabled}
              aria-disabled={node.disabled || undefined}
              aria-haspopup="menu"
              aria-expanded={open}
              data-menu-key={token}
              data-menu-parent-key={parentToken}
              data-menu-submenu="true"
              data-menu-depth={depth}
              tabIndex={isFocused ? 0 : -1}
              onFocus={() => setFocusKey(node.key)}
              onClick={() => {
                if (triggerSubMenuAction === "click") toggleOpen(node.key);
              }}
              className={cn(
                "flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                open && "bg-accent/70 text-accent-foreground",
                collapsedInline && "justify-center px-2",
                semanticClassNames.item,
              )}
              style={{ ...semanticStyles.item, ...itemPadding }}
            >
              {icon}
              {label}
              <span
                aria-hidden="true"
                data-slot="menu-expand-icon"
                className={cn("ml-auto flex size-4 shrink-0 items-center justify-center [&_svg]:size-4", collapsedInline && "sr-only", semanticClassNames.expandIcon)}
                style={semanticStyles.expandIcon}
              >
                {resolvedExpandIcon}
              </span>
            </button>

            {shouldRenderSubmenu ? (
              <ul
                role="menu"
                hidden={!open}
                aria-label={typeof node.label === "string" ? node.label : undefined}
                data-slot="menu-list"
                className={cn(
                  "m-0 list-none p-0",
                  popup
                    ? cn(
                        "absolute z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-overlay",
                        mode === "horizontal" && depth === 0
                          ? "left-0 top-full mt-1"
                          : "left-full top-0 ml-1",
                      )
                    : "mt-1 flex flex-col gap-1",
                  semanticClassNames.list,
                )}
                style={semanticStyles.list}
              >
                {renderNodes(node.children, [...path, node.key], depth + 1, node.key)}
              </ul>
            ) : null}
          </li>
        );
      }

      const role = multiple && selectable ? "menuitemcheckbox" : "menuitem";
      const keyPath = [...path, node.key];
      return (
        <li key={node.key} role="none" className="min-w-0">
          <button
            type="button"
            role={role}
            title={node.title}
            disabled={node.disabled}
            aria-disabled={node.disabled || undefined}
            aria-current={!multiple && selectable && selected ? "page" : undefined}
            aria-checked={multiple && selectable ? selected : undefined}
            data-menu-key={token}
            data-menu-parent-key={parentToken}
            data-menu-depth={depth}
            tabIndex={isFocused ? 0 : -1}
            onFocus={() => setFocusKey(node.key)}
            onClick={(event) => activateItem(node, keyPath, event)}
            className={cn(
              "flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              selected ? "bg-accent text-accent-foreground" : "text-foreground",
              collapsedInline && "justify-center px-2",
              semanticClassNames.item,
            )}
            style={{ ...semanticStyles.item, ...itemPadding }}
          >
            {icon}
            {label}
          </button>
        </li>
      );
    });

  return (
    <nav
      {...props}
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      aria-label={ariaLabel}
      data-slot="menu"
      data-mode={mode}
      data-inline-collapsed={collapsedInline || undefined}
      onKeyDown={handleRootKeyDown}
      className={cn("min-w-0", semanticClassNames.root, className)}
      style={{ ...semanticStyles.root, ...style }}
    >
      <ul
        role={mode === "horizontal" ? "menubar" : "menu"}
        data-slot="menu-list"
        className={cn(
          "m-0 min-w-0 list-none p-0",
          mode === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-1",
          collapsedInline && "w-12",
          semanticClassNames.list,
        )}
        style={semanticStyles.list}
      >
        {renderNodes(items)}
      </ul>
    </nav>
  );
}
