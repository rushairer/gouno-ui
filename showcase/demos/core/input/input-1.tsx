import { Search } from "lucide-react";
import { Input, Space } from "../../../../src/core";

export default function Example2() {
  return (
    <Space direction="vertical">
      <Input size="small" prefix={<Search />} placeholder="Small" />
      <Input size="middle" suffix=".com" placeholder="Middle" />
      <Input size="large" placeholder="Large" />
      <Input status="warning" defaultValue="需要确认" />
      <Input status="error" defaultValue="格式错误" />
      <Input readOnly value="只读内容" />
      <Input disabled value="禁用内容" />
    </Space>
  );
}
