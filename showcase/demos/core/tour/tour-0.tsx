import { useState } from "react";
import { Button, Tour, type TourStep } from "../../../../src/core";

const steps = [
  { title: "欢迎", description: "这是第一步。" },
  { title: "组件目录", description: "从左侧选择组件。" },
] as const satisfies readonly TourStep[];

export default function TourDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>开始引导</Button>
      <Tour
        open={open}
        steps={steps}
        previousText="上一步"
        nextText="下一步"
        finishText="完成"
        onClose={() => setOpen(false)}
      />
    </>
  );
}
