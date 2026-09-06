import { Pagination, Space } from "../../../../src/core";
export function PaginationVariants() {
  return (
    <Space direction="vertical">
      <Pagination
        ariaLabel="紧凑分页"
        total={500}
        defaultPage={12}
        size="small"
        showLessItems
      />
      <Pagination
        ariaLabel="简单分页"
        total={86}
        defaultPage={3}
        simple
        align="center"
      />
      <Pagination
        ariaLabel="自定义分页"
        total={120}
        defaultPageSize={20}
        align="end"
        itemRender={(page, type) =>
          type === "prev" ? (
            "上一页"
          ) : type === "next" ? (
            "下一页"
          ) : (
            <span>第 {page} 页</span>
          )
        }
      />
    </Space>
  );
}
