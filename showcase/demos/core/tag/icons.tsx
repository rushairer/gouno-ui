import { Check, Plus } from "lucide-react";
import { Space, Tag } from "../../../../src/core";

export default function IconTagDemo() {
  return (
    <Space wrap>
      <Tag icon={<Check />} color="success">
        Verified
      </Tag>
      <Tag icon={<Plus />} color="primary">
        New
      </Tag>
      <Tag color="warning" bordered={false}>
        Borderless
      </Tag>
    </Space>
  );
}
