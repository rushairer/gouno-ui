import { InputNumber } from "../../../../src/core";

export default function Example10() {
  return <InputNumber aria-label="数量" min={0} max={10} defaultValue={3} />;
}
