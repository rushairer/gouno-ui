import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Blog Admin AI Operations panel lead contract", () => {
  it("uses one description-first lead anatomy across every top-level AI Operations panel", () => {
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

    expect(lead).toContain("min-h-9");
    expect(lead).toContain('size="sm"');
    expect(overview).not.toContain('title="今天需要关注什么"');
    expect(overview).not.toContain('title="人工决策队列"');
    expect(overview).toContain("先处理失败与等待人工的运行");
    expect(overview).toContain("把审批、选择、确认、运营建议和后续编辑任务");
    expect(automation).not.toContain('title="自动化资产"');
    expect(automation).not.toContain('title="编辑自动化"');
    expect(automation).toContain("Workflow 是持续运行的版本化自动化资产");
    expect(records).not.toContain('title="运行证据中心"');
    expect(records).toContain("从一次 Run 追溯执行步骤");
  });
});
