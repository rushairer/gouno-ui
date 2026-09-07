import type { ComponentProps, KeyboardEvent, ReactNode } from "react";
import * as Primitive from "../components/primitives/tabs";
import { cn } from "../lib/utils";
export interface TabItem<T extends string = string> { value: T; label: ReactNode; icon?: ReactNode; }
export interface TabsProps<T extends string = string> extends Omit<ComponentProps<typeof Primitive.Tabs>, "onValueChange" | "onChange"> { items?: readonly TabItem<T>[]; ariaLabel?: string; tabClassName?: string; onChange?: (value: T) => void; }
export function Tabs<T extends string = string>({ items, ariaLabel, tabClassName, children, onChange, ...props }: TabsProps<T>) {
  return <Primitive.Tabs {...props} onValueChange={value => onChange?.(value as T)}>{items ? <Primitive.TabsList aria-label={ariaLabel} className={cn("h-auto max-w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0", tabClassName)}>{items.map((item, index) => <Primitive.TabsTrigger key={item.value} value={item.value} onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const nextIndex = event.key === "ArrowRight" ? (index + 1) % items.length : (index - 1 + items.length) % items.length; const next = items[nextIndex]; onChange?.(next.value); event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('button[role="tab"]')[nextIndex]?.focus(); }} className="gap-2 rounded-none border-b-2 border-transparent px-3 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary">{item.icon}{item.label}</Primitive.TabsTrigger>)}</Primitive.TabsList> : null}{children}</Primitive.Tabs>;
}
export function TabList({ className, ...props }: ComponentProps<typeof Primitive.TabsList>) { return <Primitive.TabsList {...props} className={cn("h-auto max-w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0", className)} />; }
export function Tab({ className, ...props }: ComponentProps<typeof Primitive.TabsTrigger>) { return <Primitive.TabsTrigger {...props} className={cn("gap-2 rounded-none border-b-2 border-transparent px-3 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none", className)} />; }
export const TabPanel = Primitive.TabsContent;
export const TabsRoot = Primitive.Tabs;
export const TabsList = TabList;
export const TabsTrigger = Tab;
export const TabsContent = TabPanel;
