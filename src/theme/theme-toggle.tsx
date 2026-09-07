import { Monitor, Moon, Sun } from "lucide-react";
import { IconButton } from "../core/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/primitives/dropdown-menu";
import { useTheme, type ThemeMode } from "./provider";

export interface ThemeToggleProps {
  label?: string;
  labels?: Record<ThemeMode, string>;
}

export function ThemeToggle({
  label = "主题",
  labels = { light: "浅色", dark: "深色", system: "跟随系统" },
}: ThemeToggleProps) {
  const { mode, resolvedMode, setMode } = useTheme();
  const Icon =
    mode === "system" ? Monitor : resolvedMode === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label={label}
          icon={<Icon />}
          aria-pressed={resolvedMode === "dark"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={mode}
            onValueChange={(next) => setMode(next as ThemeMode)}
          >
            {(["light", "dark", "system"] as const).map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {labels[value]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
