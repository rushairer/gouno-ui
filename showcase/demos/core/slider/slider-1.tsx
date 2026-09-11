import { Slider, Space, Text } from "../../../../src/core";

export default function SliderVerticalDemo() {
  return (
    <Space align="center" gap="lg">
      <Slider aria-label="亮度" orientation="vertical" min={0} max={100} defaultValue={65} />
      <Text tone="muted" size="sm">vertical 保留原生 range 键盘语义。</Text>
    </Space>
  );
}
