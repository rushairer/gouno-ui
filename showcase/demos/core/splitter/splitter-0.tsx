import { Splitter } from "../../../../src/core";

export default function SplitterBasicDemo() {
  return (
    <Splitter defaultSizes={[36, 64]} className="h-44">
      <Splitter.Panel min={20} max={70} className="p-4">
        <strong>Navigation</strong>
        <p className="mt-2 text-sm text-muted-foreground">拖动或聚焦分隔条后使用方向键调整。</p>
      </Splitter.Panel>
      <Splitter.Panel className="p-4">
        <strong>Workspace</strong>
        <p className="mt-2 text-sm text-muted-foreground">Panel 只拥有尺寸约束与内容区域。</p>
      </Splitter.Panel>
    </Splitter>
  );
}
