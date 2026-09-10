import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const productsRoot = resolve(process.cwd(), "showcase/demos/products");

function source(path: string) {
  return readFileSync(resolve(productsRoot, path), "utf8");
}

describe("tabbed product layout conformance", () => {
  it("keeps account-context Tabs while promoting durable system domains to sidebar navigation", () => {
    const account = source("gosso-account-settings/index.tsx");
    const system = source("gosso-system-management/index.tsx");

    expect(account.match(/children:\s*</g)).toHaveLength(5);
    expect(account).not.toContain("<AccountSettingsPanel tab={activeTab} />");

    expect(system).not.toContain('import { Tabs }');
    expect(system.match(/children:\s*</g)).toBeNull();
    expect(system).toContain("SystemManagementSection");
    expect(system).toContain('route: "/system-management/clients"');
    expect(system).toContain('route: "/system-management/system"');
  });
});
