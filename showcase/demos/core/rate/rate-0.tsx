import { Rate, Space, Text } from "../../../../src/core";

export default function RateBasicDemo() {
  return (
    <Space orientation="vertical" gap="sm">
      <Rate
        aria-label="满意度"
        defaultValue={3}
        getItemLabel={(value) => `${value} 分`}
      />
      <Text tone="muted" size="sm">组名和每档读法由调用方本地化。</Text>
    </Space>
  );
}
