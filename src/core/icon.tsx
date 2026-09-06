import type { ReactElement } from "react";
import { cloneElement } from "react";
import { cn } from "../lib/utils";
export function Icon({ icon, label, spin = false, rotate, className }: { icon: ReactElement<{className?:string;style?:React.CSSProperties;"aria-hidden"?:boolean}>; label?: string; spin?: boolean; rotate?: number; className?: string }) { return cloneElement(icon,{className:cn("inline-block size-4",spin&&"animate-spin",className,icon.props.className),style:{...icon.props.style,transform:rotate?`rotate(${rotate}deg)`:icon.props.style?.transform},"aria-hidden":label?undefined:true,...(label?{"aria-label":label}: {})}); }
