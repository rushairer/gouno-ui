import { useState } from "react";

import { Textarea } from "../../../../src/core";
function ControlledTextareaDemo() {
  const [value, setValue] = useState("组件 API、示例和代码应保持一致。");
  return (
    <Textarea
      value={value}
      maxLength={60}
      showCount
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
export default function Example5() {
  return <ControlledTextareaDemo />;
}
