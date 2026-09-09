import { Button, Result, Text } from "../../../../src/core";

export default function ResultExample() {
  return (
    <Result
      status="success"
      title="发布成功"
      subTitle="文章已经发布，读者现在可以访问。"
      extra={<Button>返回文章列表</Button>}
    >
      <Text size="sm" tone="muted">
        你仍然可以继续编辑或查看公开页面。
      </Text>
    </Result>
  );
}
