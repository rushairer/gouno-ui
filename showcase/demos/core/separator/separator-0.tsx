import { Separator, Space, Text } from "../../../../src/core";

export default function SeparatorDemo() {
  return (
    <Space orientation="vertical" gap="lg" block>
      <Separator>Centered section</Separator>
      <Separator titlePlacement="start" variant="dashed">
        Start title
      </Separator>
      <Separator titlePlacement="end" variant="dotted">
        End title
      </Separator>
      <Text size="sm" tone="muted">
        Parent layout owns the spacing around each separator.
      </Text>
    </Space>
  );
}
