import {
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export type CollapseSize = "small" | "middle" | "large";
export type CollapseCollapsible = "header" | "icon" | "disabled";
export type CollapseExpandIconPlacement = "start" | "end";
export type CollapseActiveKey = Key | readonly Key[];

export interface CollapseItem {
  key: Key;
  label: ReactNode;
  children: ReactNode;
  extra?: ReactNode;
  collapsible?: CollapseCollapsible;
  forceRender?: boolean;
  showArrow?: boolean;
  classNames?: Partial<Record<"header" | "body", string>>;
  styles?: Partial<Record<"header" | "body", CSSProperties>>;
}

export interface CollapseExpandIconInfo {
  active: boolean;
  item: CollapseItem;
}

export type CollapseSemantic = "root" | "item" | "header" | "body";

export interface CollapseSemanticInfo {
  props: Readonly<{
    accordion: boolean;
    bordered: boolean;
    ghost: boolean;
    size: CollapseSize;
  }>;
}

export type CollapseClassNames =
  | Partial<Record<CollapseSemantic, string>>
  | ((info: CollapseSemanticInfo) => Partial<Record<CollapseSemantic, string>>);
export type CollapseStyles =
  | Partial<Record<CollapseSemantic, CSSProperties>>
  | ((info: CollapseSemanticInfo) => Partial<Record<CollapseSemantic, CSSProperties>>);

export interface CollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  items: readonly CollapseItem[];
  activeKey?: CollapseActiveKey;
  defaultActiveKey?: CollapseActiveKey;
  accordion?: boolean;
  bordered?: boolean;
  collapsible?: CollapseCollapsible;
  destroyOnHidden?: boolean;
  expandIcon?: (info: CollapseExpandIconInfo) => ReactNode;
  expandIconPlacement?: CollapseExpandIconPlacement;
  ghost?: boolean;
  size?: CollapseSize;
  onChange?: (activeKey: Key | Key[]) => void;
  classNames?: CollapseClassNames;
  styles?: CollapseStyles;
  ref?: Ref<HTMLDivElement>;
}

function isKeyArray(value: CollapseActiveKey): value is readonly Key[] {
  return Array.isArray(value);
}

function normalizeActiveKeys(
  value: CollapseActiveKey | undefined,
  accordion: boolean,
) {
  const keys: Key[] =
    value === undefined ? [] : isKeyArray(value) ? [...value] : [value];
  return accordion ? keys.slice(0, 1) : keys;
}

function includesKey(keys: readonly Key[], key: Key) {
  return keys.some((candidate) => candidate === key);
}

function sameKeys(a: readonly Key[], b: readonly Key[]) {
  return a.length === b.length && a.every((key, index) => key === b[index]);
}

function keyToken(key: Key) {
  return `${typeof key === "number" ? "n" : "s"}-${String(key)}`.replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  );
}

const sizeClasses: Record<CollapseSize, { header: string; body: string }> = {
  small: {
    header: "min-h-9 px-3 py-2 text-sm",
    body: "px-3 pb-3 text-sm",
  },
  middle: {
    header: "min-h-11 px-4 py-3 text-sm",
    body: "px-4 pb-4 text-sm",
  },
  large: {
    header: "min-h-13 px-5 py-4 text-base",
    body: "px-5 pb-5 text-sm",
  },
};

export function Collapse({
  items,
  activeKey,
  defaultActiveKey,
  accordion = false,
  bordered = true,
  collapsible = "header",
  destroyOnHidden = false,
  expandIcon,
  expandIconPlacement = "start",
  ghost = false,
  size = "middle",
  onChange,
  classNames,
  styles,
  className,
  style,
  ref,
  ...props
}: CollapseProps) {
  const instanceId = useId();
  const [internalActiveKeys, setInternalActiveKeys] = useState<Key[]>(() =>
    normalizeActiveKeys(defaultActiveKey, accordion),
  );
  const controlledActiveKeys = useMemo(
    () => normalizeActiveKeys(activeKey, accordion),
    [activeKey, accordion],
  );
  const activeKeys =
    activeKey === undefined ? internalActiveKeys : controlledActiveKeys;
  const [renderedKeys, setRenderedKeys] = useState<Key[]>(() => [
    ...new Set([
      ...normalizeActiveKeys(defaultActiveKey, accordion),
      ...normalizeActiveKeys(activeKey, accordion),
      ...items.filter((item) => item.forceRender).map((item) => item.key),
    ]),
  ]);

  useEffect(() => {
    const newlyVisible = [
      ...activeKeys,
      ...items.filter((item) => item.forceRender).map((item) => item.key),
    ];
    setRenderedKeys((keys) => {
      const nextKeys = [...new Set([...keys, ...newlyVisible])];
      return sameKeys(keys, nextKeys) ? keys : nextKeys;
    });
  }, [activeKeys, items]);

  const semanticInfo: CollapseSemanticInfo = {
    props: { accordion, bordered, ghost, size },
  };
  const semanticClassNames =
    typeof classNames === "function" ? classNames(semanticInfo) : (classNames ?? {});
  const semanticStyles =
    typeof styles === "function" ? styles(semanticInfo) : (styles ?? {});

  const commitActiveKeys = (nextKeys: Key[]) => {
    if (activeKey === undefined) setInternalActiveKeys(nextKeys);
    onChange?.(accordion ? (nextKeys[0] ?? []) : nextKeys);
  };

  const toggleItem = (item: CollapseItem) => {
    const active = includesKey(activeKeys, item.key);
    const nextKeys = active
      ? activeKeys.filter((key) => key !== item.key)
      : accordion
        ? [item.key]
        : [...activeKeys, item.key];
    if (!active) {
      setRenderedKeys((keys) =>
        includesKey(keys, item.key) ? keys : [...keys, item.key],
      );
    }
    commitActiveKeys(nextKeys);
  };

  return (
    <div
      {...props}
      ref={ref}
      data-slot="collapse"
      data-accordion={accordion || undefined}
      data-size={size}
      data-ghost={ghost || undefined}
      className={cn(
        "min-w-0 overflow-hidden rounded-lg",
        bordered && !ghost && "border",
        !ghost && "bg-background",
        semanticClassNames.root,
        className,
      )}
      style={{ ...semanticStyles.root, ...style }}
    >
      {items.map((item, index) => {
        const active = includesKey(activeKeys, item.key);
        const itemCollapsible = item.collapsible ?? collapsible;
        const showArrow = item.showArrow ?? true;
        const iconOnly = itemCollapsible === "icon";
        const disabled =
          itemCollapsible === "disabled" || (iconOnly && !showArrow);
        const token = keyToken(item.key);
        const headerId = `${instanceId}-header-${token}`;
        const labelId = `${instanceId}-label-${token}`;
        const bodyId = `${instanceId}-body-${token}`;
        const shouldRender =
          item.forceRender ||
          active ||
          (!destroyOnHidden && includesKey(renderedKeys, item.key));
        const arrow = showArrow ? (
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-4"
          >
            {expandIcon ? (
              expandIcon({ active, item })
            ) : (
              <ChevronRight
                className={cn(
                  "transition-transform duration-200",
                  active && "rotate-90",
                )}
              />
            )}
          </span>
        ) : null;

        const headerContent = (
          <>
            {expandIconPlacement === "start" ? arrow : null}
            <span
              id={labelId}
              className="min-w-0 flex-1 text-left font-medium"
            >
              {item.label}
            </span>
            {expandIconPlacement === "end" ? arrow : null}
          </>
        );

        return (
          <section
            key={item.key}
            data-slot="collapse-item"
            data-active={active || undefined}
            className={cn(
              "min-w-0",
              index > 0 && !ghost && "border-t",
              ghost && index > 0 && "border-t border-transparent",
              semanticClassNames.item,
            )}
            style={semanticStyles.item}
          >
            <div
              data-slot="collapse-header"
              className={cn(
                "flex min-w-0 items-center",
                sizeClasses[size].header,
                semanticClassNames.header,
                item.classNames?.header,
              )}
              style={{ ...semanticStyles.header, ...item.styles?.header }}
            >
              {iconOnly ? (
                <>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={active}
                    aria-controls={bodyId}
                    disabled={disabled}
                    aria-label={active ? "Collapse panel" : "Expand panel"}
                    onClick={() => toggleItem(item)}
                    className="mr-2 inline-flex size-7 shrink-0 items-center justify-center rounded-md outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {arrow}
                  </button>
                  <span id={labelId} className="min-w-0 flex-1 font-medium">
                    {item.label}
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={active}
                  aria-controls={bodyId}
                  disabled={disabled}
                  onClick={() => toggleItem(item)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-sm text-inherit outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {headerContent}
                </button>
              )}
              {item.extra !== undefined && item.extra !== null ? (
                <div
                  data-slot="collapse-extra"
                  className="ml-3 shrink-0"
                  onClick={(event) => event.stopPropagation()}
                >
                  {item.extra}
                </div>
              ) : null}
            </div>

            {shouldRender ? (
              <div
                id={bodyId}
                role="region"
                aria-labelledby={labelId}
                hidden={!active}
                data-slot="collapse-body"
                className={cn(
                  "text-muted-foreground",
                  sizeClasses[size].body,
                  semanticClassNames.body,
                  item.classNames?.body,
                )}
                style={{ ...semanticStyles.body, ...item.styles?.body }}
              >
                {item.children}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
