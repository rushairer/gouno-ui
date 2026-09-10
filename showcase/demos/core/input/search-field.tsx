import { useRef } from "react";
import { Button, SearchField, Space } from "../../../../src/core";

export default function SearchFieldDemo() {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <Space orientation="vertical" block>
      <SearchField
        ref={searchRef}
        aria-label="搜索文章"
        placeholder="输入标题或关键词"
      />
      <Button size="small" onClick={() => searchRef.current?.focus()}>
        聚焦搜索框
      </Button>
    </Space>
  );
}
