import { Empty } from "../../../../src/core";

export default function EmptyLiveRegionExample() {
  return (
    <Empty
      role="status"
      aria-live="polite"
      title="没有匹配结果"
      description="筛选条件已更新，可以继续调整关键词。"
    />
  );
}
