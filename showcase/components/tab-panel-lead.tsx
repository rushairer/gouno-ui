import type { ReactNode } from "react";
import { Text } from "../../src/core";

export function TabPanelLead({
  description,
  actions,
}: {
  description?: ReactNode;
  actions?: ReactNode;
}) {
  if (!description && !actions) return null;

  return (
    <div
      data-slot="showcase-tab-panel-lead"
      className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0">
        {description ? (
          <Text tone="muted" size="sm" className="max-w-3xl leading-relaxed">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
