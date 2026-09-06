import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
export interface IconButtonProps extends Omit<ButtonProps, "children" | "icon"> { label: string; icon: ReactNode; }
export function IconButton({ label, icon, ...props }: IconButtonProps) { return <Button {...props} icon={icon} size="icon" aria-label={label} title={label} />; }
