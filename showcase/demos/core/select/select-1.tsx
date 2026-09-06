import { Select, Space } from "../../../../src/core";

export default function Example8() {
  return (
    <Space direction="vertical">
      <Select size="small" placeholder="请选择">
        <option value="a">Small</option>
      </Select>
      <Select size="middle" status="warning" defaultValue="a">
        <option value="a">Warning</option>
      </Select>
      <Select size="large" status="error" defaultValue="a">
        <option value="a">Error</option>
      </Select>
      <Select loading>
        <option>加载中</option>
      </Select>
      <Select disabled>
        <option>禁用</option>
      </Select>
    </Space>
  );
}
