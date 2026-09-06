import { useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Container, Input, Kbd, Progress, Spinner, Stack, Statistic, Timeline, Typography } from "../../src/core";
import { PageHeader, Panel, PanelHeader } from "../../src/gouno";

export function CoreOverview() {
  const [value, setValue] = useState(42);
  return <Container className="space-y-6">
    <PageHeader title="Gouno UI Core" description="纯产品无关基础组件：视觉、交互、可访问性和通用状态。" />
    <div className="grid gap-6 md:grid-cols-2">
      <Panel><PanelHeader title="Actions & feedback" description="组件可以独立使用，不依赖 Blog 或 Admin 业务。" /><Stack gap={3}><div className="flex flex-wrap items-center gap-2"><Button variant="primary">Primary</Button><Button variant="secondary">Secondary</Button><Button loading>Loading</Button><Badge tone="info">Info</Badge><Spinner /></div><Progress value={value} /><div className="flex items-center gap-2"><Input aria-label="进度" type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} /><span className="text-sm tabular-nums">{value}%</span></div></Stack></Panel>
      <Panel><PanelHeader title="Typography & shortcuts" /><Stack gap={3}><Typography as="h2" className="text-2xl font-semibold">可组合的文字层级</Typography><Typography className="text-muted-foreground">基础组件只负责呈现和交互，不包含产品业务状态。</Typography><div className="flex items-center gap-2 text-sm">打开命令面板 <Kbd>⌘</Kbd><Kbd>K</Kbd></div></Stack></Panel>
      <Card><CardHeader><CardTitle>Statistic</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><Statistic title="Components" value="42" /><Statistic title="Coverage" value="86" suffix="%" /></div></CardContent></Card>
      <Panel><PanelHeader title="Timeline" /><Timeline items={[{ title: "Core API", description: "基础组件边界已建立" }, { title: "Patterns API", description: "复合交互持续补齐" }, { title: "Product API", description: "等待场景迁移" }]} /></Panel>
    </div>
  </Container>;
}
