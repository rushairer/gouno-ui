import { Button, Card, Result } from "../../../../src/core";

export default function ResultPageExample() {
  return (
    <Card padding="none" className="max-w-xl">
      <Result
        status="info"
        headingLevel={1}
        title="页面未找到"
        description="你访问的地址不存在、已经移动，或者当前内容不再公开。"
        extra={<Button variant="outline">返回首页</Button>}
      />
    </Card>
  );
}
