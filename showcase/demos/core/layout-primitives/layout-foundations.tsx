import { useRef } from "react";
import {
  App,
  AspectRatio,
  Button,
  Container,
  Space,
  Text,
} from "../../../../src/core";

export default function LayoutFoundationsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <App className="rounded-lg border bg-background p-4">">
      <Container
        ref={containerRef}
        tabIndex={-1}
        className="max-w-2xl px-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Space orientation="vertical" block>
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border bg-muted">
            <div className="flex size-full items-center justify-center">
              <Text tone="muted">16:9 content region</Text>
            </div>
          </AspectRatio>
          <Button size="small" onClick={() => containerRef.current?.focus()}>
            聚焦 Container
          </Button>
        </Space>
      </Container>
    </App>
  );
}
