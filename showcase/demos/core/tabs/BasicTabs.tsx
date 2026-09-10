import { BarChart3, FileText, Settings } from "lucide-react";
import { Tabs, Text } from "../../../../src/core";

const items = [
  {
    key: "overview",
    label: "概览",
    icon: <BarChart3 aria-hidden="true" />,
    children: <Text>查看关键指标和近期活动。</Text>,
  },
  {
    key: "reports",
    label: "报告",
    icon: <FileText aria-hidden="true" />,
    children: <Text>浏览已生成的分析报告。</Text>,
  },
  {
    key: "settings",
    label: "设置",
    icon: <Settings aria-hidden="true" />,
    children: <Text>管理当前工作区配置。</Text>,
  },
] as const;

export function BasicTabs() {
  return (
    <Tabs
      aria-label="工作区栏目"
      defaultActiveKey="overview"
      items={items}
    />
  );
}
