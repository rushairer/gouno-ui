import { Watermark } from "../../../../src/core";

export default function WatermarkExample() {
  return (
    <Watermark
      content="仅供内部评审"
      className="rounded-lg border"
      aria-label="评审内容区域"
    >
      <div className="min-h-48 p-6">
        <h3 className="font-medium">发布前检查</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          水印文字由调用方提供；背景水印保持装饰性，不改变内容区域本身的语义。
        </p>
      </div>
    </Watermark>
  );
}
