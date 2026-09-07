import { Button, Input, Space, Text } from "../../../../src/core";

export default function SpaceAlignmentDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Space orientation="vertical" align="start">
        <Button>按内容宽度</Button>
        <Button>显式 align=start</Button>
        <Text tone="muted">垂直布局按内容宽度排列</Text>
      </Space>
      <Space orientation="vertical" block>
        <Button>Block 容器</Button>
        <Input placeholder="与其他控件对齐" />
      </Space>
    </div>
  );
}
