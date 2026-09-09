import { Segmented, Tag, Text } from "../../../src/core";
import { ThemeToggle, useTheme, type ThemeMode } from "../../../src/theme";

const modeOptions = [
  { label: "跟随系统", value: "system" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
] as const;

export default function ThemeControlsExample() {
  const { brand, mode, resolvedMode, setMode } = useTheme();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Tag color="primary">brand: {brand}</Tag>
        <Tag color="default">mode: {mode}</Tag>
        <Tag color={resolvedMode === "dark" ? "info" : "success"}>
          resolved: {resolvedMode}
        </Tag>
      </div>
      <div className="flex flex-col gap-3">
        <Text as="div" size="sm" className="font-medium">
          模式控制
        </Text>
        <Segmented<ThemeMode>
          aria-label="主题模式"
          options={modeOptions}
          value={mode}
          onChange={setMode}
        />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Text size="sm" tone="muted">
          ThemeToggle 与显式模式控制共享同一个 ThemeProvider 状态。
        </Text>
      </div>
    </div>
  );
}
