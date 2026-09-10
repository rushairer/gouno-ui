import { Sparkles } from "lucide-react";
import { Collapse } from "../../../../src/core";

export default function CollapseBehaviorExample() {
  return (
    <Collapse
      ghost
      destroyOnHidden
      expandIconPlacement="end"
      items={[
        {
          key: "icon-only",
          label: "Icon-only trigger",
          collapsible: "icon",
          children:
            "Only the disclosure icon toggles this panel; the header label remains inert.",
        },
        {
          key: "lazy",
          label: "Lazy content",
          children:
            "This panel is mounted on first expansion and destroyed again when hidden.",
        },
        {
          key: "eager",
          label: "Force rendered",
          forceRender: true,
          extra: <Sparkles className="size-4" aria-label="Pre-rendered" />,
          children:
            "forceRender keeps this panel body mounted even before first expansion.",
        },
      ]}
    />
  );
}
