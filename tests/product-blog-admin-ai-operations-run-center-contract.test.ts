import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(resolve(process.cwd(), file), "utf8");

describe("Blog Admin AI Operations canonical run-center contract", () => {
  it("uses the canonical panel lead across all top-level AI Operations tabs", () => {
    const overviewInbox = read(
      "showcase/demos/products/blog-admin/ai/operations/overview-inbox.tsx",
    );
    const automation = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx",
    );
    const records = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",
    );
    const panelLead = read("showcase/components/tab-panel-lead.tsx");

    expect(panelLead).toContain('data-pattern="tab-panel-lead"');
    expect(
      overviewInbox.match(/<TabPanelLead/g)?.length ?? 0,
    ).toBeGreaterThanOrEqual(2);
    expect(automation).toContain("<TabPanelLead");
    expect(records).toContain("<TabPanelLead");
  });

  it("keeps Workflow and Agent records on the same master/detail anatomy", () => {
    const records = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",
    );

    expect(records.match(/data-slot="ops-master-detail"/g)?.length).toBe(2);
    expect(records.match(/data-slot="ops-rail"/g)?.length).toBe(2);
    expect(records.match(/data-slot="ops-rail-body"/g)?.length).toBe(2);
    expect(
      records.match(/xl:grid-cols-\[19rem_minmax\(0,1fr\)\]/g)?.length,
    ).toBe(2);
  });

  it("keeps Recent Runs on the canonical five-column responsive row", () => {
    const automation = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx",
    );
    expect(automation).toContain(
      "sm:grid-cols-[7rem_7rem_minmax(7rem,0.7fr)_6rem_minmax(0,1.5fr)]",
    );
    expect(automation).toContain("[&>span]:contents");
  });
});
