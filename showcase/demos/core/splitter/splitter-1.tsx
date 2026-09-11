import { Splitter } from "../../../../src/core";

export default function SplitterMultipleDemo() {
  return (
    <Splitter orientation="vertical" defaultSizes={[28, 42, 30]} className="h-64">
      <Splitter.Panel min={18} className="p-3">Inspector</Splitter.Panel>
      <Splitter.Panel min={24} className="p-3">Canvas</Splitter.Panel>
      <Splitter.Panel min={18} className="p-3">Console</Splitter.Panel>
    </Splitter>
  );
}
