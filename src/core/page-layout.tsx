import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
export const Layout = ({className,...props}:HTMLAttributes<HTMLDivElement>) => <div {...props} className={cn("flex min-h-0 min-w-0 flex-1 flex-col bg-background",className)}/>;
export const LayoutHeader = ({className,...props}:HTMLAttributes<HTMLElement>) => <header {...props} className={cn("flex min-h-14 items-center border-b px-5",className)}/>;
export const LayoutSider = ({className,...props}:HTMLAttributes<HTMLElement>) => <aside {...props} className={cn("w-60 shrink-0 border-r bg-sidebar p-4",className)}/>;
export const LayoutContent = ({className,...props}:HTMLAttributes<HTMLElement>) => <main {...props} className={cn("min-w-0 flex-1 p-5",className)}/>;
export const LayoutFooter = ({className,...props}:HTMLAttributes<HTMLElement>) => <footer {...props} className={cn("border-t px-5 py-4 text-sm text-muted-foreground",className)}/>;
