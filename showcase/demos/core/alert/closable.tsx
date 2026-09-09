import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Alert, Button } from "../../../../src/core";

export default function ClosableAlert() {
  const [key, setKey] = useState(0);
  const [status, setStatus] = useState("尚未关闭");

  return (
    <div className="grid w-full gap-3">
      <Alert
        key={key}
        type="info"
        showIcon
        title="可关闭通知"
        description="关闭完成后会触发 afterClose。"
        action={<Button size="small">查看详情</Button>}
        closable={{
          "aria-label": "关闭通知",
          onClose: () => setStatus("正在关闭"),
          afterClose: () => setStatus("已关闭"),
        }}
      />
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span aria-live="polite">{status}</span>
        <Button
          size="small"
          icon={<RotateCcw />}
          onClick={() => {
            setKey((value) => value + 1);
            setStatus("尚未关闭");
          }}
        >
          重新显示
        </Button>
      </div>
    </div>
  );
}
