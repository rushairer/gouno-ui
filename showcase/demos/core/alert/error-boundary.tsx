import { useState } from "react";
import { Alert, Button } from "../../../../src/core";

function BrokenWidget(): never {
  throw new Error("Widget render failed");
}

export default function ErrorBoundaryDemo() {
  const [broken, setBroken] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="grid w-full gap-3">
      <Alert.ErrorBoundary key={key} title="局部模块渲染失败">
        {broken ? (
          <BrokenWidget />
        ) : (
          <div className="rounded-lg border p-4">模块运行正常。</div>
        )}
      </Alert.ErrorBoundary>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setBroken(true)}>触发渲染错误</Button>
        <Button
          onClick={() => {
            setBroken(false);
            setKey((value) => value + 1);
          }}
        >
          重置边界
        </Button>
      </div>
    </div>
  );
}
