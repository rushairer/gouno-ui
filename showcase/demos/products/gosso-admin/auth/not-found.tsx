import { ArrowLeft, Home } from "lucide-react";
import { Button, Card, Result, Text } from "../../../../../src/core";

export function GossoNotFoundDemo() {
  return (
    <div className="flex min-h-[520px] items-center justify-center py-8">
      <Card padding="none" variant="elevated" className="w-full max-w-lg">
        <Result
          status="info"
          headingLevel={1}
          title="页面不存在"
          description="请求的 GOSSO 管理页面不存在、已移动，或当前账户没有对应入口。"
          extra={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="solid" color="primary" icon={<Home />} onClick={() => { window.location.hash = "gosso-overview"; }}>返回概览</Button>
              <Button icon={<ArrowLeft />} onClick={() => window.history.back()}>返回上一页</Button>
            </div>
          }
        >
          <Text as="div" size="sm" tone="muted" className="font-mono">/unknown-route</Text>
        </Result>
      </Card>
    </div>
  );
}
