import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} />; }
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("flex flex-col space-y-1.5 p-6", className)} />; }
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 {...props} className={cn("text-lg font-semibold leading-none tracking-tight", className)} />; }
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p {...props} className={cn("text-sm text-muted-foreground", className)} />; }
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("p-6 pt-0", className)} />; }
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("flex items-center p-6 pt-0", className)} />; }
