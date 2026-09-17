import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Blog Admin AI Operations panel lead contract", () => {
  it("uses one titled lead anatomy across every top-level AI Operations panel", () => {
    const lead = read("showcase/components/tab-panel-lead.tsx");
    const overview = read(
      "showcase/demos/products/blog-admin/ai/operations/overview-inbox.tsx",
    );
    const automation = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-management.tsx",
    );
    const records = read(
      "showcase/demos/products/blog-admin/ai/operations/automation-records.tsx",
    );

    expect(lead).toContain("title?: ReactNode");
    expect(lead).toContain("<Heading level={2}>{title}</Heading>");
    expect(overview).toContain('title="今天需要关注什么"');
    expect(overview).toContain('title="人工决策队列"');
    expect(automation).toContain('title="自动化资产"');
    expect(records).toContain('title="运行证据中心"');
  });
});
