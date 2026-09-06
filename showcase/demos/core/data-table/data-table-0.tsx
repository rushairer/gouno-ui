import { useState } from "react";
import { Input, Space, Tag, Text } from "../../../../src/core";
import { DataTable } from "../../../../src";
function DataTableDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [
    { id: "ui", name: "Gouno UI", status: "Stable", score: 98 },
    { id: "blog", name: "Blog", status: "Preview", score: 86 },
    { id: "admin", name: "Admin", status: "Stable", score: 94 },
    { id: "gosso", name: "Gosso", status: "Draft", score: 72 },
    { id: "docs", name: "Docs", status: "Stable", score: 91 },
  ];
  return (
    <Space direction="vertical" className="w-full" size="lg">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
        <div>
          <Text>产品目录</Text>
          <Text tone="muted" className="block text-xs">
            支持筛选、排序、选择、展开和分页
          </Text>
        </div>
        <Input
          className="w-full sm:w-64"
          aria-label="筛选名称"
          placeholder="筛选名称"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <DataTable
        rowKey="id"
        dataSource={rows}
        density="default"
        bordered
        filter={(row) => row.name.toLowerCase().includes(query.toLowerCase())}
        columns={[
          {
            key: "name",
            title: "名称",
            dataIndex: "name",
            sorter: true,
            width: 220,
          },
          {
            key: "status",
            title: "状态",
            dataIndex: "status",
            render: (value) => (
              <Tag
                tone={
                  value === "Stable"
                    ? "success"
                    : value === "Draft"
                      ? "warning"
                      : "info"
                }
              >
                {String(value)}
              </Tag>
            ),
          },
          {
            key: "score",
            title: "评分",
            dataIndex: "score",
            sorter: (a, b) => a.score - b.score,
            align: "right",
            render: (value) => (
              <span className="font-medium tabular-nums">{String(value)}%</span>
            ),
          },
        ]}
        selectable
        selectedRowKeys={selected}
        onSelectionChange={(keys) => setSelected(keys)}
        rowDisabled={(row) => row.status === "Draft"}
        expandedRowRender={(row) => (
          <div className="rounded-md bg-muted/40 px-3 py-2 text-sm">
            <Text tone="muted">
              {row.name} 当前完成度为 {row.score}%，可在此放置更多操作。
            </Text>
          </div>
        )}
        pagination={{ pageSize: 3 }}
      />
    </Space>
  );
}
export default function Example4() {
  return <DataTableDemo />;
}
