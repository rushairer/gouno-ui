import { CheckCircle2, Circle } from "lucide-react";
import { Timeline } from "../../../../src/core";

const items = [
  { key: "plan", title: "Plan", content: "API scope", icon: <CheckCircle2 className="size-3" /> },
  { key: "code", title: "Code", content: "Runtime", icon: <CheckCircle2 className="size-3" /> },
  { key: "verify", title: "Verify", content: "CI gate", icon: <Circle className="size-3" /> },
] as const;

export default function TimelineLayoutsExample() {
  return (
    <div className="grid gap-8">
      <Timeline mode="alternate" variant="filled" items={items} />
      <Timeline orientation="horizontal" reverse items={items} />
    </div>
  );
}
