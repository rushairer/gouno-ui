import { useState } from "react";
import { Slider, Space, Text } from "../../../../src/core";

export default function SliderBasicDemo() {
  const [value, setValue] = useState(40);
  const [committed, setCommitted] = useState(40);

  return (
    <Space orientation="vertical" block>
      <Slider
        aria-label="音量"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
        onChangeComplete={setCommitted}
      />
      <Text tone="muted" size="sm">当前 {value} · 已提交 {committed}</Text>
    </Space>
  );
}
