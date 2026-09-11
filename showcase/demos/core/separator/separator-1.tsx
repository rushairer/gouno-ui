import { Button, Separator, Space } from "../../../../src/core";

export default function SeparatorVerticalDemo() {
  return (
    <Space align="center" gap="md">
      <Button variant="text">Overview</Button>
      <Separator orientation="vertical" decorative={false} aria-label="Section separator" />
      <Button variant="text">Activity</Button>
      <Separator orientation="vertical" variant="dashed" />
      <Button variant="text">Settings</Button>
    </Space>
  );
}
