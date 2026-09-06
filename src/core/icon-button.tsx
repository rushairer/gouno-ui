import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";
export interface IconButtonProps extends Omit<ButtonProps, "children" | "icon"> { label: string; icon: ReactNode; }
export function IconButton({ label, icon, className, ...props }: IconButtonProps) { return <Button {...props} icon={icon} size="icon" aria-label={label} title={label} className={cn("icon-button", className)} />; }
