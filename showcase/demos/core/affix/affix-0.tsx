import { Affix, Button } from "../../../../src/core";

export default function AffixExample() {
  return (
    <div className="h-56 overflow-auto rounded-lg border bg-muted/20 p-4">
      <div className="min-h-96 space-y-4">
        <p className="text-sm text-muted-foreground">
          向下滚动此区域，操作条会保持在容器顶部 8px。
        </p>
        <Affix offsetTop={8} aria-label="固定操作区">
          <div className="flex items-center justify-between rounded-md border bg-background p-3 shadow-sm">
            <span className="text-sm font-medium">评审操作</span>
            <Button size="small">保存草稿</Button>
          </div>
        </Affix>
        <div className="space-y-3 text-sm text-muted-foreground">
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index}>内容段落 {index + 1}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
