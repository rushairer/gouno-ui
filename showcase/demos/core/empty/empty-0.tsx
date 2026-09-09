import { Inbox } from "lucide-react";
import { Button, Empty } from "../../../../src/core";

export default function EmptyExample() {
  return (
    <Empty
      icon={<Inbox aria-hidden="true" className="size-8 text-muted-foreground" />}
      title="暂无文章"
      description="创建第一篇文章后，它会出现在这里。"
      action={
        <Button variant="solid" color="primary">
          新建文章
        </Button>
      }
    />
  );
}
