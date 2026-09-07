import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Space,
  Text,
} from "../../../../src/core";

export default function CardExample() {
  const [variant, setVariant] = useState<"default" | "subtle" | "elevated">("default");
  return (
    <Space orientation="vertical" gap="lg" className="w-full">
      <Space wrap>
        {(["default", "subtle", "elevated"] as const).map((value) => (
          <Button key={value} size="small" variant={variant === value ? "solid" : "outline"} onClick={() => setVariant(value)}>
            {value}
          </Button>
        ))}
      </Space>
      <Card variant={variant} className="max-w-xl">
        <CardHeader title="Release 0.1.0" description="稳定版本已准备发布" action={<Text tone="success">Ready</Text>} />
        <CardContent>
          <Text>卡片内容与 header/footer 保持一致的间距层级。</Text>
        </CardContent>
        <CardFooter>
          <Button size="small" variant="solid" color="primary">查看变更</Button>
          <Text tone="muted">最后更新：今天</Text>
        </CardFooter>
      </Card>
    </Space>
  );
}
