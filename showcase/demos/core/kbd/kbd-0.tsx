import { Kbd, Space, Text } from "../../../../src/core";

export default function KbdDemo() {
  return (
    <Space orientation="vertical" gap="md" align="start">
      <Space align="center" gap="sm">
        <Text size="sm">Command palette</Text>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Space>
      <Space align="center" gap="sm">
        <Text size="sm">Move focus</Text>
        <Kbd>⇧</Kbd>
        <Kbd>Tab</Kbd>
      </Space>
    </Space>
  );
}
