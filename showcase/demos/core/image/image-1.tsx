import { useState } from "react";
import { Button, Image, Tag } from "../../../../src/core";

export default function ImageControlledExample() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState("none");

  return (
    <div className="flex flex-col items-start gap-3">
      <Image
        src="/missing-primary-image.png"
        fallback="https://picsum.photos/seed/gouno-fallback/640/360"
        alt="带备用地址的示例图片"
        width={320}
        className="rounded-lg"
        preview={{
          open,
          onOpenChange: setOpen,
          cover: "打开预览",
          onTransform: ({ action }) => setLastAction(action),
        }}
      />
      <div className="flex items-center gap-2">
        <Button size="small" onClick={() => setOpen(true)}>
          从外部打开预览
        </Button>
        <Tag>最近动作：{lastAction}</Tag>
      </div>
    </div>
  );
}
