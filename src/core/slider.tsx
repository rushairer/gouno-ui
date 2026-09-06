import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";
export function Slider({ className, value, defaultValue, min = 0, max = 100, step = 1, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) { return <input {...props} type="range" value={value} defaultValue={defaultValue} min={min} max={max} step={step} className={cn("h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50", className)} />; }
