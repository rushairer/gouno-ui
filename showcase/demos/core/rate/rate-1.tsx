import { Rate, Space } from "../../../../src/core";

export default function RateCharacterDemo() {
  return (
    <Space orientation="vertical" gap="md">
      <Rate aria-label="优先级" size="small" defaultValue={2} character="●" />
      <Rate aria-label="重要程度" size="large" defaultValue={4} character="◆" />
    </Space>
  );
}
