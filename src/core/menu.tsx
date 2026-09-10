import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import type { ButtonColor } from "./button";

export type MenuMode = "vertical" | "horizontal" | "inline";
export type MenuTriggerSubMenuAction = "hover" | "click";
export type MenuItemColor = Extract<ButtonColor, "default" | "error">;

interface MenuBaseItem {
  key: Key;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export interface MenuLeafItem extends MenuBaseItem {
  type?: "item";
  color?: MenuItemColor;
}

export interface MenuSubMenuItem extends MenuBaseItem {
  type?: "submenu";
  children: readonly MenuItem[];
}

export interface MenuItemGroup {
  key: Key;
  type: "group";
  label: ReactNode;
  children: readonly MenuItem[];
  className?: string;
  style?: CSSProperties;
}

export interface MenuDividerItem {
  key: Key;
  type: "divider";
  dashed?: boolean;
  className?: string;
  style?: CSSProperties;
}

export type MenuItem =
  | MenuLeafItem
  | MenuSubMenuItem
  | MenuItemGroup
  | MenuDividerItem;

export interface MenuEventInfo {
  key: Key;
  keyPath: Key[];
  item: MenuLeafItem;
  domEvent: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;
}

export interface MenuSelectInfo extends MenuEventInfo {
  selectedKeys: Key[];
}

export interface MenuExpandIconInfo {
  item: MenuSubMenuItem;
  open: boolean;
  level: number;
}

export interface MenuPopupRenderInfo {
  item: MenuSubMenuItem;
  keys: Key[];
}

export type MenuSemantic =
  | "root"
  | "item"
  | "subMenu"
  | "group"
  | "divider"
  | "icon"
  | "label"
  | "extra"
  | "popup";

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
  extends Omit<
    HTMLAttributes<HTMLUListElement>,
    "children" | "onClick" | "onSelect"
  > {
  items: readonly MenuItem[];
  mode?: MenuMode;
  selectedKeys?: readonly Key[];
  defaultSelectedKeys?: readonly Key[];
  openKeys?: readonly Key[];
  defaultOpenKeys?: readonly Key[];
  multiple?: boolean;
  selectable?: boolean;
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: MenuTriggerSubMenuAction;
  expandIcon?: ReactNode | ((info: MenuExpandIconInfo) => ReactNode);
  popupRender?: (
    originalNode: ReactElement,
    info: MenuPopupRenderInfo,
  ) => ReactElement;
  onClick?: (info: MenuEventInfo) => void;
  onSelect?: (info: MenuSelectInfo) => void;
  onDeselect?: (info: MenuSelectInfo) => void;
  onOpenChange?: (openKeys: Key[]) => void;
  classNames?: MenuClassNames;
  styles?: MenuStyles;
  ref?: Ref<HTMLUListElement>;
}

interface MenuEntry {
  item: MenuLeafItem | MenuSubMenuItem;
  parentKey?: Key;
  level: number;
  keyPath: Key[];
}

function isDivider(item: MenuItem): item is MenuDividerItem {
  return item.type === "divider";
}

function isGroup(item: MenuItem): item is MenuItemGroup {
  return item.type === "group";
}

function isSubMenu(item: MenuItem): item is MenuSubMenuItem {
  return !isDivider(item) && !isGroup(item) && "children" in item;
}

function includesKey(keys: readonly Key[], key: Key) {
  return keys.some((candidate) => candidate === key);
}

function uniqueKeys(keys: readonly Key[]) {
  return Array.from(new Set(keys));
}

function keyToken(key: Key) {
  return `${typeof key === "number" ? "n" : "s"}:${String(key)}`;
}

function flattenVisible(
  items: readonly MenuItem[],
  openKeys: readonly Key[],
  parentKey?: Key,
  level = 1,
  parentPath: readonly Key[] = [],
): MenuEntry[] {
  const entries: MenuEntry[] = [];
  for (const item of items) {
    if (isDivider(item)) continue;
    if (isGroup(item)) {
      entries.push(
        ...flattenVisible(item.children, openKeys, parentKey, level, parentPath),
      );
      continue;
    }
    const keyPath = [item.key, ...parentPath];
    entries.push({ item, parentKey, level, keyPath });
    if (isSubMenu(item) && includesKey(openKeys, item.key)) {
      entries.push(
        ...flattenVisible(item.children, openKeys, item.key, level + 1, keyPath),
      );
    }
  }
  return entries;
}

function firstFocusableChild(item: MenuSubMenuItem) {
  const find = (items: readonly MenuItem[]): Key | undefined => {
    for (const child of items) {
      if (isDivider(child)) continue;
      if (isGroup(child)) {
        const groupChild = find(child.children);
        if (groupChild !== undefined) return groupChild;
        continue;
      }
      if (!child.disabled) return child.key;
    }
    return undefined;
  };
  return find(item.children);
}

function accessibleLabel(item: MenuLeafItem | MenuSubMenuItem) {
  if (item.title) return item.title;
  return typeof item.label === "string" ? item.label : undefined;
}

export function Menu({
  items,
  mode = "vertical",
  selectedKeys,
  defaultSelectedKeys = [],
  openKeys,
  defaultOpenKeys = [],
  multiple = false,
  selectable = true,
  inlineCollapsed = false,
  inlineIndent = 24,
  forceSubMenuRender = false,
  triggerSubMenuAction = "hover",
  expandIcon,
  popupRender,
  onClick,
  onSelect,
  onDeselect,
  onOpenChange,
  classNames,
  styles,
  className,
  style,
  "aria-label": ariaLabel = "Menu",
  ref,
  ...props
}: MenuProps) {
  const rootRef = useRef<HTMLUListElement | null>(null);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Key[]>(() =>
    uniqueKeys(defaultSelectedKeys),
  );
  const activeSelectedKeys = selectedKeys ?? internalSelectedKeys;
  const [internalOpenKeys, setInternalOpenKeys] = useState<Key[]>(() =>
    uniqueKeys(defaultOpenKeys),
  );
  const activeOpenKeys = openKeys ?? internalOpenKeys;
  const visibleEntries = useMemo(
    () => flattenVisible(items, activeOpenKeys),
    [items, activeOpenKeys],
  );
  const [focusKey, setFocusKey] = useState<Key | undefined>(
    () => visibleEntries.find(({ item }) => !item.disabled)?.item.key,
  );

  const semanticInfo: MenuSemanticInfo = {
    props: { mode, multiple, selectable, inlineCollapsed },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});
  const popupMode = mode !== "inline" || inlineCollapsed;

  const setRootRef = (node: HTMLUListElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const orderedKeys = visibleEntries.map(({ item }) => item.key);
  const sortKeys = (keys: Iterable<Key>) =>
    Array.from(new Set(keys)).sort(
      (a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b),
    );

  const focusNode = (key: Key | undefined) => {
    if (key === undefined) return;
    setFocusKey(key);
    queueMicrotask(() => {
      const token = keyToken(key);
      const nodes =
        rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-menu-key]") ?? [];
      Array.from(nodes)
        .find((node) => node.dataset.menuKey === token && !node.disabled)
        ?.focus();
    });
  };

  const setOpen = (item: MenuSubMenuItem, open: boolean) => {
    const next = open
      ? sortKeys([...activeOpenKeys, item.key])
      : activeOpenKeys.filter((key) => key !== item.key);
    if (openKeys === undefined) setInternalOpenKeys(next);
    onOpenChange?.(next);
  };

  const closePopupAncestors = (entry: MenuEntry) => {
    if (!popupMode) return;
    const ancestorKeys = new Set(entry.keyPath.slice(1));
    const next = activeOpenKeys.filter((key) => !ancestorKeys.has(key));
    if (openKeys === undefined) setInternalOpenKeys(next);
    onOpenChange?.(next);
  };

  const activateLeaf = (
    entry: MenuEntry & { item: MenuLeafItem },
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (entry.item.disabled) return;
    const baseInfo: MenuEventInfo = {
      key: entry.item.key,
      keyPath: entry.keyPath,
      item: entry.item,
      domEvent: event,
    };
    onClick?.(baseInfo);

    if (!selectable) {
      closePopupAncestors(entry);
      return;
    }

    const selected = includesKey(activeSelectedKeys, entry.item.key);
    if (multiple && selected) {
      const next = activeSelectedKeys.filter((key) => key !== entry.item.key);
      if (selectedKeys === undefined) setInternalSelectedKeys(next);
      onDeselect?.({ ...baseInfo, selectedKeys: next });
      closePopupAncestors(entry);
      return;
    }

    const next = multiple
      ? uniqueKeys([...activeSelectedKeys, entry.item.key])
      : [entry.item.key];
    if (selectedKeys === undefined) setInternalSelectedKeys(next);
    onSelect?.({ ...baseInfo, selectedKeys: next });
    closePopupAncestors(entry);
  };

  const moveFocus = (entry: MenuEntry, delta: number) => {
    const enabledEntries = visibleEntries.filter(({ item }) => !item.disabled);
    const index = enabledEntries.findIndex(({ item }) => item.key === entry.item.key);
    if (index < 0 || !enabledEntries.length) return;
    const next = enabledEntries[(index + delta + enabledEntries.length) % enabledEntries.length];
    focusNode(next?.item.key);
  };

  const handleKeyDown = (
    entry: MenuEntry,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const submenu = isSubMenu(entry.item) ? entry.item : undefined;
    const open = submenu ? includesKey(activeOpenKeys, submenu.key) : false;

    if (event.key === "Home") {
      event.preventDefault();
      focusNode(visibleEntries.find(({ item }) => !item.disabled)?.item.key);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusNode([...visibleEntries].reverse().find(({ item }) => !item.disabled)?.item.key);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (submenu && !open) {
        setOpen(submenu, true);
        focusNode(firstFocusableChild(submenu));
      } else {
        moveFocus(entry, 1);
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(entry, -1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (submenu) {
        if (!open) setOpen(submenu, true);
        focusNode(firstFocusableChild(submenu));
      } else if (mode === "horizontal" && entry.level === 1) {
        moveFocus(entry, 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      if (entry.parentKey !== undefined) {
        event.preventDefault();
        const parent = visibleEntries.find(({ item }) => item.key === entry.parentKey);
        if (parent && isSubMenu(parent.item)) setOpen(parent.item, false);
        focusNode(entry.parentKey);
      } else if (mode === "horizontal") {
        event.preventDefault();
        moveFocus(entry, -1);
      }
      return;
    }
    if (event.key === "Escape" && entry.parentKey !== undefined) {
      event.preventDefault();
      const parent = visibleEntries.find(({ item }) => item.key === entry.parentKey);
      if (parent && isSubMenu(parent.item)) setOpen(parent.item, false);
      focusNode(entry.parentKey);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (submenu) {
        setOpen(submenu, !open);
        if (!open && event.key === "Enter") focusNode(firstFocusableChild(submenu));
      } else {
        activateLeaf(entry as MenuEntry & { item: MenuLeafItem }, event);
      }
    }
  };

  const renderItems = (
    entries: readonly MenuItem[],
    parentKey?: Key,
    level = 1,
    parentPath: readonly Key[] = [],
  ): ReactNode =>
    entries.map((item) => {
      if (isDivider(item)) {
        return (
          <li
            key={item.key}
            role="separator"
            data-slot="menu-divider"
            className={cn(
              "my-1 border-t",
              item.dashed && "border-dashed",
              semanticClassNames.divider,
              item.className,
            )}
            style={{ ...semanticStyles.divider, ...item.style }}
          />
        );
      }

      if (isGroup(item)) {
        return (
          <li
            key={item.key}
            role="presentation"
            data-slot="menu-group"
            className={cn("min-w-0", semanticClassNames.group, item.className)}
            style={{ ...semanticStyles.group, ...item.style }}
          >
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {item.label}
            </div>
            <ul role="group" className="m-0 list-none p-0">
              {renderItems(item.children, parentKey, level, parentPath)}
            </ul>
          </li>
        );
      }

      const submenu = isSubMenu(item);
      const keyPath = [item.key, ...parentPath];
      const entry: MenuEntry = { item, parentKey, level, keyPath };
      const open = submenu && includesKey(activeOpenKeys, item.key);
      const selected = !submenu && includesKey(activeSelectedKeys, item.key);
      const childSelected =
        submenu &&
        flattenVisible(item.children, item.children.flatMap(() => []))
          .some(({ item: child }) => includesKey(activeSelectedKeys, child.key));
      const tabbable =
        focusKey === undefined
          ? visibleEntries.find(({ item: candidate }) => !candidate.disabled)?.item.key === item.key
          : focusKey === item.key;
      const collapsed = inlineCollapsed && level === 1;
      const label = accessibleLabel(item);
      const indent = mode === "inline" && !inlineCollapsed ? (level - 1) * inlineIndent : 0;

      const trigger = (
        <button
          type="button"
          role="menuitem"
          disabled={item.disabled}
          aria-disabled={item.disabled || undefined}
          aria-haspopup={submenu ? "menu" : undefined}
          aria-expanded={submenu ? open : undefined}
          aria-current={selected ? "page" : undefined}
          aria-label={collapsed ? label : undefined}
          title={collapsed ? item.title ?? label : item.title}
          tabIndex={tabbable ? 0 : -1}
          data-menu-key={keyToken(item.key)}
          data-selected={selected || undefined}
          data-submenu-selected={childSelected || undefined}
          onFocus={() => setFocusKey(item.key)}
          onKeyDown={(event) => handleKeyDown(entry, event)}
          onClick={(event) => {
            if (submenu) {
              setOpen(item, !open);
              return;
            }
            activateLeaf(entry as MenuEntry & { item: MenuLeafItem }, event);
          }}
          className={cn(
            "flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "hover:bg-accent hover:text-accent-foreground",
            selected && "bg-accent text-accent-foreground",
            childSelected && "text-primary",
            !submenu && item.color === "error" && "text-destructive",
            collapsed && "justify-center px-2",
            mode === "horizontal" && level === 1 && "w-auto whitespace-nowrap",
            semanticClassNames.item,
            submenu && semanticClassNames.subMenu,
            item.className,
          )}
          style={{
            paddingInlineStart:
              mode === "inline" && !inlineCollapsed ? 12 + indent : undefined,
            ...semanticStyles.item,
            ...(submenu ? semanticStyles.subMenu : undefined),
            ...item.style,
          }}
        >
          {item.icon !== undefined && item.icon !== null ? (
            <span
              data-slot="menu-icon"
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center [&_svg]:size-4",
                semanticClassNames.icon,
              )}
              style={semanticStyles.icon}
            >
              {item.icon}
            </span>
          ) : null}
          <span
            data-slot="menu-label"
            className={cn(
              "min-w-0 flex-1 truncate",
              collapsed && "sr-only",
              semanticClassNames.label,
            )}
            style={semanticStyles.label}
          >
            {item.label}
          </span>
          {!collapsed && item.extra !== undefined && item.extra !== null ? (
            <span
              data-slot="menu-extra"
              className={cn(
                "ml-auto shrink-0 text-xs text-muted-foreground",
                semanticClassNames.extra,
              )}
              style={semanticStyles.extra}
            >
              {item.extra}
            </span>
          ) : null}
          {submenu && !collapsed ? (
            <span aria-hidden="true" className="ml-auto flex size-4 shrink-0 items-center justify-center">
              {typeof expandIcon === "function"
                ? expandIcon({ item, open, level })
                : expandIcon ?? (
                    <ChevronRight
                      className={cn(
                        "size-3.5 transition-transform",
                        !popupMode && open && "rotate-90",
                      )}
                    />
                  )}
            </span>
          ) : null}
        </button>
      );

      if (!submenu) {
        return (
          <li key={item.key} role="none" className="min-w-0">
            {trigger}
          </li>
        );
      }

      const children = (
        <ul
          role="menu"
          aria-label={label ? `${label} submenu` : undefined}
          data-slot={popupMode ? "menu-popup" : "menu-submenu"}
          className={cn(
            "m-0 min-w-40 list-none p-1",
            popupMode
              ? cn(
                  "absolute z-50 rounded-md border bg-popover text-popover-foreground shadow-overlay",
                  level === 1 && mode === "horizontal"
                    ? "left-0 top-full mt-1"
                    : "left-full top-0 ml-1",
                )
              : "mt-1",
            popupMode ? semanticClassNames.popup : semanticClassNames.subMenu,
          )}
          style={
            popupMode
              ? semanticStyles.popup
              : semanticStyles.subMenu
          }
        >
          {renderItems(item.children, item.key, level + 1, keyPath)}
        </ul>
      );
      const renderedChildren = popupRender && popupMode
        ? popupRender(children, { item, keys: keyPath })
        : children;

      return (
        <li
          key={item.key}
          role="none"
          className="relative min-w-0"
          onMouseEnter={() => {
            if (popupMode && triggerSubMenuAction === "hover" && !item.disabled) {
              setOpen(item, true);
            }
          }}
          onMouseLeave={() => {
            if (popupMode && triggerSubMenuAction === "hover" && !item.disabled) {
              setOpen(item, false);
            }
          }}
        >
          {trigger}
          {open || forceSubMenuRender ? (
            <div hidden={!open} className="contents">
              {renderedChildren}
            </div>
          ) : null}
        </li>
      );
    });

  return (
    <ul
      {...props}
      ref={setRootRef}
      role="menu"
      aria-label={ariaLabel}
      aria-orientation={mode === "horizontal" ? "horizontal" : "vertical"}
      data-slot="menu"
      data-mode={mode}
      data-inline-collapsed={inlineCollapsed || undefined}
      className={cn(
        "m-0 min-w-0 list-none p-1",
        mode === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-1",
        inlineCollapsed && "w-16",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {renderItems(items)}
    </ul>
  );
}
