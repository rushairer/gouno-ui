import { ColorPicker } from "../../../../src/core";

export default function ColorPickerDemo() {
  return (
    <div className="flex items-center gap-4">
      <ColorPicker aria-label="品牌色" defaultValue="#1677ff" />
      <ColorPicker
        aria-label="警告色"
        defaultValue="#faad14"
        size="large"
        status="warning"
      />
    </div>
  );
}
