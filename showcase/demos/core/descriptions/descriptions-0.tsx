import { Button, Descriptions, Tag } from "../../../../src/core";

const items = [
  { key: "version", label: "版本", children: "0.2.0" },
  {
    key: "status",
    label: "状态",
    children: <Tag color="success">Stable</Tag>,
  },
  {
    key: "scope",
    label: "覆盖范围",
    children: "Core API、Demo、示例代码与测试",
    span: { xs: "filled", md: 2 } as const,
  },
  {
    key: "baseline",
    label: "设计基线",
    children: "Ant Design 6.6.x + Gouno API governance",
    span: "filled" as const,
  },
] as const;

export default function DescriptionsBasicExample() {
  return (
    <Descriptions
      title="组件收尾状态"
      extra={<Button size="small">查看详情</Button>}
      column={{ xs: 1, md: 2, xl: 3 }}
      items={items}
    />
  );
}
