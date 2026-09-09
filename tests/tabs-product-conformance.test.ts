import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const productsRoot = resolve(process.cwd(), "showcase/demos/products");

function source(path: string) {
  return readFileSync(resolve(productsRoot, path), "utf8");
}

describe("tabbed product layout conformance", () => {
  it("keeps Gosso route-family panels inside Tabs structural ownership", () => {
    const account = source("gosso-account-settings/index.tsx");
    const system = source("gosso-system-management/index.tsx");

    expect(account.match(/children:\s*</g)).toHaveLength(5);
    expect(system.match(/children:\s*</g)).toHaveLength(5);
    expect(account).not.toContain("<AccountSettingsPanel tab={activeTab} />");
    expect(system).not.toContain("<Panel tab={activeTab} />");
  });
});
