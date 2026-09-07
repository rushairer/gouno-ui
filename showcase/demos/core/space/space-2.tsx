import { Button, Space } from "../../../../src/core";

export default function SpaceWrapSplitDemo() {
  return (
    <Space wrap split={<span aria-hidden="true">·</span>} gap="sm">
      <Button size="small">筛选</Button>
      <Button size="small">排序</Button>
      <Button size="small">导出</Button>
      <Button size="small">刷新</Button>
    </Space>
  );
}
