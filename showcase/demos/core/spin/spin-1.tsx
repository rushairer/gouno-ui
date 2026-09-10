import { Spinner, Text } from "../../../../src/core";

export default function SpinnerExample() {
  return (
    <div role="status" className="flex items-center gap-2">
      <Spinner />
      <Text size="sm">正在保存…</Text>
    </div>
  );
}
