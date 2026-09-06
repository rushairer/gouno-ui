import { useState } from "react";
import { Space, Text } from "../../../../src/core";
import { DataTable, type DataTableSortState } from "../../../../src/patterns";

export default function ServerPagination() {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState<DataTableSortState | null>(null);
  // Static fixtures simulate the response for the requested page. No API calls.
  const records = Array.from({ length: 32 }, (_, index) => ({
    id: String(index),
    name: `文章 ${index + 1}`,
    views: index * 17,
  }));
  const sorted = sort
    ? records
        .slice()
        .sort((a, b) =>
          sort.direction === "ascend" ? a.views - b.views : b.views - a.views,
        )
    : records;
  const response = sorted.slice((page - 1) * pageSize, page * pageSize);
  return (
    <Space direction="vertical" align="stretch">
      <DataTable
        rowKey="id"
        columns={[
          { key: "name", title: "文章", dataIndex: "name" },
          {
            key: "views",
            title: "浏览量",
            dataIndex: "views",
            sorter: true,
            align: "right",
          },
        ]}
        dataSource={response}
        sort={sort}
        onSortChange={(value) => {
          setSort(value ?? null);
          setPage(1);
        }}
        pagination={{
          mode: "server",
          total: 32,
          page,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10],
          showQuickJumper: true,
          onChange: (next, size) => {
            setPage(next);
            setPageSize(size);
          },
        }}
        locale={{
          totalText: (total) => `共 ${total} 篇`,
          previousText: "上一页",
          nextText: "下一页",
          emptyText: "暂无文章",
        }}
      />
      <Text aria-live="polite">
        模拟请求：第 {page} 页，每页 {pageSize} 条，排序{" "}
        {sort?.direction ?? "无"}
      </Text>
    </Space>
  );
}
