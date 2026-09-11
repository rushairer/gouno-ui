import { BackTop } from "../../../../src/core";

export default function BackTopExample() {
  return (
    <div className="flex min-h-28 items-center gap-3">
      <BackTop
        className="static"
        visibilityHeight={0}
        aria-label="回到顶部"
      />
      <span className="text-sm text-muted-foreground">
        正式页面默认滚动超过 200px 后出现；这里用 0 便于直接预览。
      </span>
    </div>
  );
}
