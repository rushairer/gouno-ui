import { Space, Textarea } from "../../../../src/core";

export default function Example6() {
  return (
    <Space orientation="vertical">
      <Textarea size="small" placeholder="Small" />
      <Textarea size="large" placeholder="Large" />
      <Textarea status="warning" defaultValue="需要确认" />
      <Textarea status="error" defaultValue="格式错误" />
      <Textarea readOnly value="只读内容" />
      <Textarea disabled value="禁用内容" />
    </Space>
  );
}
