import { Inbox } from "lucide-react";
import { Button, Card, Empty } from "../../../../src/core";

export default function EmptyExample() {
  return (
    <Card className="max-w-xl">
      <Empty
        icon={<Inbox aria-hidden="true" className="size-7 text-muted-foreground" />}
        title="暂无匹配内容"
        description="调整筛选条件，或清除筛选后继续浏览。"
        action={<Button variant="outline">清除筛选</Button>}
      />
    </Card>
  );
}
