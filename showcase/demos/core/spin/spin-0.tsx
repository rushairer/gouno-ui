import { Spin, Text } from "../../../../src/core";

export default function SpinExample() {
  return (
    <Spin spinning tip="正在刷新内容">
      <div className="min-h-32 rounded border p-6">
        <Text>已有内容在后台刷新时仍保留。</Text>
      </div>
    </Spin>
  );
}
