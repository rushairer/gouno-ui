import { useState, type Key } from "react";
import { Button, Collapse } from "../../../../src/core";

export default function CollapseControlledExample() {
  const [activeKey, setActiveKey] = useState<Key | Key[]>("api");

  return (
    <div className="grid gap-3">
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={setActiveKey}
        size="middle"
        items={[
          {
            key: "api",
            label: "Public API",
            children: "Stable props, events and semantic slots are documented together.",
            extra: (
              <Button size="small" variant="text" onClick={() => undefined}>
                Docs
              </Button>
            ),
          },
          {
            key: "behavior",
            label: "Interaction behavior",
            children: "Accordion mode keeps exactly one panel active at a time.",
          },
          {
            key: "disabled",
            label: "Unavailable section",
            children: "This content cannot be expanded.",
            collapsible: "disabled",
          },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        Active: {Array.isArray(activeKey) ? activeKey.map(String).join(", ") || "none" : String(activeKey)}
      </p>
    </div>
  );
}
