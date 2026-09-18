import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Surface Foundation conformance", () => {
  it("keeps Card as the canonical persistent business-surface owner", () => {
    const card = source("src/core/card.tsx");

    expect(card).toContain(
      '"min-w-0 rounded-lg border bg-card text-card-foreground flex flex-col gap-5"',
    );
    expect(card).toContain('variant === "default" && "shadow-surface"');
    expect(card).toContain('variant === "subtle" && "bg-muted"');
    expect(card).toContain(
      'variant === "elevated" && "bg-raised shadow-raised"',
    );
    expect(card).toContain(
      'interactive && "cursor-pointer transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-raised"',
    );
  });

  it("keeps bordered Table as a canonical collection surface", () => {
    const table = source("src/components/primitives/table.tsx");

    expect(table).toContain(
      'bordered ? "border border-border/80 bg-card shadow-surface" : "bg-card/40"',
    );
  });

  it("keeps Gosso Quick Link semantics on the anchor and Surface ownership on Card", () => {
    const overview = source(
      "showcase/demos/products/gosso-admin/overview.tsx",
    );

    expect(overview).toContain("<a");
    expect(overview).toContain("<Card");
    expect(overview).toContain("interactive");
    expect(overview).toContain('padding="none"');
    expect(overview).toContain(
      'className="min-h-32 w-full flex-row items-center gap-4 px-6 py-5 text-left hover:bg-accent/20"',
    );
    expect(overview).not.toContain("shadow-surface");
    expect(overview).not.toContain("hover:shadow-raised");
  });

  it("does not turn legitimate nested grouping into a second Surface rule", () => {
    const security = source(
      "showcase/demos/products/gosso-admin/account-settings/security.tsx",
    );
    const siteSettings = source(
      "showcase/demos/products/blog-admin/site-settings.tsx",
    );

    expect(security).toContain(
      'divide-y overflow-hidden rounded-lg border border-border/80 bg-card',
    );
    expect(siteSettings).toContain(
      'rounded-lg border bg-muted/30 p-4',
    );
  });
});
