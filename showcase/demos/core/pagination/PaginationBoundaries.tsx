import { Pagination, Space, Text } from "../../../../src/core";
export function PaginationBoundaries() {
  return (
    <Space orientation="vertical">
      <Pagination
        ariaLabel="禁用分页"
        total={200}
        defaultPage={3}
        disabled
        showQuickJumper
        showSizeChanger
      />
      <Pagination ariaLabel="末页" total={15} defaultPage={2} />
      <Pagination
        ariaLabel="空数据"
        total={0}
        showTotal={(total, [start, end]) => `${start}–${end} / ${total}`}
      />
      <Text>下面的单页分页通过 hideOnSinglePage 隐藏。</Text>
      <Pagination ariaLabel="隐藏单页" total={5} hideOnSinglePage />
    </Space>
  );
}
