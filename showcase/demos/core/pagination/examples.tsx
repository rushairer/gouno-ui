import { useState } from "react";
import { Pagination, Space, Text } from "../../../../src/core";

export function BasicPagination() {
  return <Pagination total={500} defaultPage={6} />;
}

export function ControlledPagination() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState("选择页码、调整每页数量，或输入页码后按 Enter。");
  return (
    <Space direction="vertical">
      <Pagination
        total={286}
        page={page}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={[10, 25, 50]}
        showQuickJumper
        showTotal={(total, [start, end]) => `${start}–${end} / 共 ${total} 条`}
        onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }}
        onShowSizeChange={(nextPage, nextSize) => setMessage(`每页 ${nextSize} 条，当前第 ${nextPage} 页`)}
      />
      <Text aria-live="polite">当前第 {page} 页，每页 {pageSize} 条。{message}</Text>
    </Space>
  );
}

export function PaginationVariants() {
  return (
    <Space direction="vertical">
      <Pagination ariaLabel="紧凑分页" total={500} defaultPage={12} size="small" showLessItems />
      <Pagination ariaLabel="简单分页" total={86} defaultPage={3} simple align="center" />
      <Pagination ariaLabel="自定义分页" total={120} defaultPageSize={20} align="end" itemRender={(page, type) => type === "prev" ? "上一页" : type === "next" ? "下一页" : <span>第 {page} 页</span>} />
    </Space>
  );
}

export function PaginationBoundaries() {
  return (
    <Space direction="vertical">
      <Pagination ariaLabel="禁用分页" total={200} defaultPage={3} disabled showQuickJumper showSizeChanger />
      <Pagination ariaLabel="末页" total={15} defaultPage={2} />
      <Pagination ariaLabel="空数据" total={0} showTotal={(total, [start, end]) => `${start}–${end} / ${total}`} />
      <Text>下面的单页分页通过 hideOnSinglePage 隐藏。</Text>
      <Pagination ariaLabel="隐藏单页" total={5} hideOnSinglePage />
    </Space>
  );
}
