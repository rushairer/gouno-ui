import { ArrowDown, Plus } from "lucide-react";
import { FloatButton } from "../../../../src/core";

export default function FloatButtonExample() {
  return (
    <div className="flex min-h-32 items-center gap-4">
      <FloatButton
        className="static"
        aria-label="新建内容"
        tooltip="新建内容"
        icon={<Plus />}
      />
      <FloatButton
        className="static"
        href="#float-button-target"
        aria-label="跳转到说明"
        tooltip="跳转到说明"
        icon={<ArrowDown />}
      />
      <span id="float-button-target" className="text-sm text-muted-foreground">
        按钮模式执行局部操作；href 模式使用真实链接语义。
      </span>
    </div>
  );
}
