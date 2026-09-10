import { useState } from "react";
import { Steps } from "../../../../src/core";

const items = [
  {
    key: "account",
    title: "Account",
    content: "Create the workspace owner profile.",
  },
  {
    key: "security",
    title: "Security",
    subTitle: "Current",
    content: "Configure MFA and recovery options.",
  },
  {
    key: "review",
    title: "Review",
    content: "Confirm the configuration before activation.",
  },
  {
    key: "complete",
    title: "Complete",
    content: "Workspace is ready for use.",
  },
] as const;

export default function StepsControlledExample() {
  const [current, setCurrent] = useState(1);

  return (
    <Steps
      aria-label="Workspace setup"
      current={current}
      percent={65}
      onChange={setCurrent}
      items={items}
    />
  );
}
