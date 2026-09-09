import { useState } from "react";
import { ChoiceButton, Space } from "../../../../src/core";

export default function ButtonChoiceDemo() {
  const [selected, setSelected] = useState("preview");

  return (
    <Space wrap>
      <ChoiceButton
        selected={selected === "preview"}
        onClick={() => setSelected("preview")}
      >
        Preview
      </ChoiceButton>
      <ChoiceButton
        selected={selected === "code"}
        onClick={() => setSelected("code")}
      >
        Code
      </ChoiceButton>
    </Space>
  );
}
