import { ArrowLeft, Home, HelpCircle } from "lucide-react";
import { Button, Card, Heading, Text } from "../../../../src/core";

export function GossoNotFoundDemo() {
  return (
    <div className="flex min-h-[520px] items-center justify-center py-8">
      <Card padding="lg" variant="elevated" className="w-full max-w-lg text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <HelpCircle aria-hidden="true" className="size-7" />
        </div>
        <Heading level={1} className="text-2xl tracking-tight">页面不存在</Heading>
        <Text size="sm" tone="muted" className="mx-auto mt-2 max-w-md leading-relaxed">
          请求的 GOSSO 管理页面不存在、已移动，或当前账户没有对应入口。
        </Text>
        <Text size="sm" tone="muted" className="mt-3 font-mono">/unknown-route</Text>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="solid" color="primary" icon={<Home />} onClick={() => { window.location.hash = "gosso-overview"; }}>返回概览</Button>
          <Button icon={<ArrowLeft />} onClick={() => window.history.back()}>返回上一页</Button>
        </div>
      </Card>
    </div>
  );
}
