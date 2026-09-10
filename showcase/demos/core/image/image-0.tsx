import { Image } from "../../../../src/core";

export default function ImagePreviewExample() {
  return (
    <Image
      src="https://picsum.photos/seed/gouno-ui/720/480"
      alt="Gouno UI 示例风景"
      width={360}
      className="rounded-lg"
      placeholder={
        <span className="text-sm text-muted-foreground">图片加载中…</span>
      }
      preview={{
        minScale: 1,
        maxScale: 8,
        scaleStep: 0.5,
        movable: true,
        wheel: true,
        cover: { coverNode: "预览", placement: "center" },
      }}
    />
  );
}
