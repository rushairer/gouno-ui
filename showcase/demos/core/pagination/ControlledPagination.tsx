import { useState } from "react";
import { Pagination, Space, Text } from "../../../../src/core";
export function ControlledPagination() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState(
    "选择页码、调整每页数量，或输入页码后按 Enter。",
  );
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
        onChange={(nextPage, nextSize) => {
          setPage(nextPage);
          setPageSize(nextSize);
        }}
        onShowSizeChange={(nextPage, nextSize) =>
          setMessage(`每页 ${nextSize} 条，当前第 ${nextPage} 页`)
        }
      />
      <Text aria-live="polite">
        当前第 {page} 页，每页 {pageSize} 条。{message}
      </Text>
    </Space>
  );
}
