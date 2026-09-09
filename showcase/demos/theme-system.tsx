import { Card, Heading, Segmented, Tag, Text } from "../../src/core";
import { ThemeToggle, useTheme, type ThemeMode } from "../../src/theme";
import { DemoSection } from "../components/demo-section";

const modeOptions = [
  { label: "跟随系统", value: "system" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
] as const;

const themeExampleCode = `import { Segmented, Tag } from "@gouno/ui/core";
import { ThemeToggle, useTheme, type ThemeMode } from "@gouno/ui/theme";

const modeOptions = [
  { label: "跟随系统", value: "system" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
] as const;

export function ThemeControls() {
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
      <Segmented<ThemeMode>
        aria-label="主题模式"
        options={modeOptions}
        value={mode}
        onChange={setMode}
      />
      <ThemeToggle />
    </div>
  );
}`;

export function ThemeSystemDemo() {
  const { brand, mode, resolvedMode, setMode } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Theme · @gouno/ui/theme
        </div>
        <Heading level={1}>Theme System 主题系统</Heading>
        <Text tone="muted" className="max-w-3xl leading-relaxed">
          Theme 是正式所有权层，负责品牌、明暗模式、持久化与主题控制；它不是通用应用状态 Provider。
        </Text>
      </header>

      <DemoSection
        title="主题模式控制"
        description="交互预览与 canonical @gouno/ui/theme 用法保持成对展示，便于直接核对和复制。"
        code={themeExampleCode}
      >
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
              ThemeToggle 与上面的显式模式控制共享同一个 ThemeProvider 状态。
            </Text>
          </div>
        </div>
      </DemoSection>

      <Card variant="subtle">
        <Heading level={3}>当前 canonical API</Heading>
        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div>ThemeProvider / ThemeProviderProps</div>
          <div>ThemeToggle / ThemeToggleProps</div>
          <div>useTheme</div>
          <div>ThemeMode / Brand / Density</div>
          <div>resolveMode / readMode</div>
          <div>brandNames</div>
        </div>
      </Card>
    </div>
  );
}
