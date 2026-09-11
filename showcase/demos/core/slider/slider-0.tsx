import { useState } from "react";
import { Slider } from "../../../../src/core";

export default function SliderDemo() {
  const [volume, setVolume] = useState(40);

  return (
    <div className="grid max-w-sm gap-4">
      <label className="grid gap-2 text-sm">
        <span>音量：{volume}</span>
        <Slider
          aria-label="音量"
          min={0}
          max={100}
          step={5}
          value={volume}
          onChange={(event) => setVolume(event.currentTarget.valueAsNumber)}
        />
      </label>
      <Slider aria-label="锁定范围" defaultValue={65} disabled />
    </div>
  );
}
