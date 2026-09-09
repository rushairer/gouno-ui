import { Button, Result } from "../../../../src/core";

export default function ResultExample() {
  return (
    <Result
      status="success"
      title="操作成功"
      description="数据已经保存，可以返回列表继续处理。"
      extra={<Button variant="solid" color="primary">返回列表</Button>}
    />
  );
}
