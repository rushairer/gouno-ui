import type { ComponentProps, CSSProperties, ReactNode } from "react";
import * as Primitive from "../components/primitives/tabs";
import type { ControlSize } from "./control-types";
import { cn } from "../lib/utils";

export type TabsType = "line" | "card";
export type TabsPosition = "top" | "right" | "bottom" | "left";

export interface TabItem<T extends string = string> {
  key: T;
  label: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

type LegacyTabItem<T extends string> = {
  /** @deprecated Use key. Kept temporarily for pre-reset product fixtures. */
  value: T;
  label: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

type TabsRootProps = ComponentProps<typeof Primitive.Tabs>;

export interface TabsProps<T extends string = string>
  extends Omit<TabsRootProps, "onValueChange" | "orientation"> {
  activeKey?: T;
  defaultActiveKey?: T;
  items?: readonly (TabItem<T> | LegacyTabItem<T>)[];
  onChange?: (activeKey: T) => void;
  type?: TabsType;
  size?: ControlSize;
  tabPosition?: TabsPosition;
  centered?: boolean;
  tabBarExtraContent?: ReactNode;
  ariaLabel?: string;
}

const gapBySize: Record<ControlSize, number> = {
  small: 16,
  middle: 24,
  large: 28,
};

const triggerSizeClass: Record<ControlSize, string> = {
  small: "min-h-8 px-1.5 py-1.5 text-sm",
  middle: "min-h-10 px-2 py-2.5 text-sm",
  large: "min-h-11 px-2.5 py-3 text-base",
};

function itemKey<T extends string>(item: TabItem<T> | LegacyTabItem<T>) {
  return "key" in item ? item.key : item.value;
}

function orientationFor(position: TabsPosition) {
  return position === "left" || position === "right" ? "vertical" : "horizontal";
}

function flexDirectionFor(position: TabsPosition): CSSProperties["flexDirection"] {
  return {
    top: "column",
    bottom: "column-reverse",
    left: "row",
    right: "row-reverse",
  }[position] as CSSProperties["flexDirection"];
}

function listPositionClass(position: TabsPosition) {
  switch (position) {
    case "bottom":
      return "w-full border-t border-border/70";
    case "left":
      return "h-fit w-48 shrink-0 border-r border-border/70";
    case "right":
      return "h-fit w-48 shrink-0 border-l border-border/70";
    default:
      return "w-full border-b border-border/70";
  }
}

function triggerPositionClass(position: TabsPosition) {
  switch (position) {
    case "bottom":
      return "after:top-[-1px] after:bottom-auto";
    case "right":
      return "after:left-[-1px] after:right-auto";
    default:
      return "";
  }
}

export function Tabs<T extends string = string>({
  activeKey,
  defaultActiveKey,
  items,
  onChange,
  type = "line",
  size = "middle",
  tabPosition = "top",
  centered = false,
  tabBarExtraContent,
  ariaLabel,
  className,
  children,
  style,
  value: legacyValue,
  defaultValue: legacyDefaultValue,
  ...props
}: TabsProps<T>) {
  const firstEnabledKey = items?.find((item) => !item.disabled);
  const orientation = orientationFor(tabPosition);
  const resolvedActiveKey = activeKey ?? (legacyValue as T | undefined);
  const resolvedDefaultKey =
    defaultActiveKey ??
    (legacyDefaultValue as T | undefined) ??
    (resolvedActiveKey === undefined && firstEnabledKey ? itemKey(firstEnabledKey) : undefined);

  return (
    <Primitive.Tabs
      {...props}
      value={resolvedActiveKey}
      defaultValue={resolvedDefaultKey}
      onValueChange={(next) => onChange?.(next as T)}
      orientation={orientation}
      data-tab-position={tabPosition}
      data-tab-type={type}
      data-tab-size={size}
      className={cn("gap-0", className)}
      style={{ ...style, flexDirection: flexDirectionFor(tabPosition) }}
    >
      {items ? (
        <TabList
          aria-label={ariaLabel}
          type={type}
          size={size}
          tabPosition={tabPosition}
          centered={centered}
          extra={tabBarExtraContent}
        >
          {items.map((item) => {
            const key = itemKey(item);
            return (
              <Tab
                key={key}
                value={key}
                disabled={item.disabled}
                size={size}
                tabPosition={tabPosition}
              >
                {item.icon}
                {item.label}
              </Tab>
            );
          })}
        </TabList>
      ) : null}

      {items?.map((item) => {
        const key = itemKey(item);
        return item.children === undefined ? null : (
          <TabPanel key={key} value={key}>
            {item.children}
          </TabPanel>
        );
      })}
      {children}
    </Primitive.Tabs>
  );
}

export function TabList({
  className,
  type = "line",
  size = "middle",
  tabPosition = "top",
  centered = false,
  extra,
  style,
  children,
  ...props
}: Omit<ComponentProps<typeof Primitive.TabsList>, "variant"> & {
  type?: TabsType;
  size?: ControlSize;
  tabPosition?: TabsPosition;
  centered?: boolean;
  extra?: ReactNode;
}) {
  const vertical = tabPosition === "left" || tabPosition === "right";
  return (
    <Primitive.TabsList
      {...props}
      variant={type === "line" ? "line" : "default"}
      data-tab-position={tabPosition}
      className={cn(
        "max-w-full justify-start overflow-x-auto !rounded-none !bg-transparent !p-0",
        vertical && "flex-col items-stretch overflow-x-visible overflow-y-auto",
        type === "line" && listPositionClass(tabPosition),
        type === "card" && "border-b border-border/70",
        className,
      )}
      style={{
        ...style,
        gap: type === "card" ? 4 : gapBySize[size],
        justifyContent: centered && !extra ? "center" : "flex-start",
      }}
    >
      {children}
      {extra ? (
        <span className={cn("shrink-0", vertical ? "mt-2" : "ml-auto pl-4")}>{extra}</span>
      ) : null}
    </Primitive.TabsList>
  );
}

export function Tab({
  className,
  size = "middle",
  tabPosition = "top",
  ...props
}: ComponentProps<typeof Primitive.TabsTrigger> & {
  size?: ControlSize;
  tabPosition?: TabsPosition;
}) {
  return (
    <Primitive.TabsTrigger
      {...props}
      data-tab-position={tabPosition}
      className={cn(
        "!flex-none font-medium transition-colors",
        triggerSizeClass[size],
        "group-data-[variant=line]/tabs-list:!rounded-none group-data-[variant=line]/tabs-list:!border-0 group-data-[variant=line]/tabs-list:!bg-transparent group-data-[variant=line]/tabs-list:!px-0 group-data-[variant=line]/tabs-list:!shadow-none",
        "group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:hover:text-foreground group-data-[variant=line]/tabs-list:data-[state=active]:!bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-primary",
        "group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        "group-data-[variant=default]/tabs-list:!rounded-t-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-b-0 group-data-[variant=default]/tabs-list:border-border/70 group-data-[variant=default]/tabs-list:bg-muted/35 group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground",
        triggerPositionClass(tabPosition),
        className,
      )}
    />
  );
}

export function TabPanel({ className, ...props }: ComponentProps<typeof Primitive.TabsContent>) {
  return <Primitive.TabsContent {...props} className={cn("pt-5", className)} />;
}
