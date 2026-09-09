import { Space, Tag } from "../../../../src/core";

export default function BasicTagDemo() {
  return (
    <Space wrap>
      <Tag>Default</Tag>
      <Tag color="primary">Brand</Tag>
      <Tag color="success">Success</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="error">Danger</Tag>
      <Tag color="info">Info</Tag>
    </Space>
  );
}
