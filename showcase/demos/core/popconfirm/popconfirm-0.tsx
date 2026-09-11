import { useState } from "react";
import { Button, Popconfirm } from "../../../../src/core";

export default function PopconfirmDemo() {
  const [result, setResult] = useState("等待操作");

  return (
    <div className="space-y-3">
      <Popconfirm
        title="确认删除这个版本？"
        description="删除后无法恢复。"
        okText="删除"
        cancelText="取消"
        danger
        onConfirm={async () => {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 500);
          });
          setResult("已删除");
        }}
        onCancel={() => setResult("已取消")}
      >
        <Button variant="solid" color="error">
          删除版本
        </Button>
      </Popconfirm>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {result}
      </p>
    </div>
  );
}
