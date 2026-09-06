import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink, IconButton, NavigationProvider, type LinkAdapterProps } from "../src/core";

function RouterLink({ to, ...props }: LinkAdapterProps) {
  return <a {...props} data-route={to} href={to} />;
}

describe("Core Button", () => {
  it("renders variants, sizes, shapes, block, icons and loading state", () => {
    render(<><Button variant="dashed" size="large" shape="round" block icon={<ArrowRight />}>Continue</Button><Button loading loadingText="Saving">Save</Button></>);
    const action = screen.getByRole("button", { name: "Continue" });
    expect(action.className).toContain("border-dashed");
    expect(action.className).toContain("rounded-full");
    expect(action.className).toContain("w-full");
    const loading = screen.getByRole("button", { name: "Saving" }) as HTMLButtonElement;
    expect(loading.disabled).toBe(true);
    expect(loading.getAttribute("aria-busy")).toBe("true");
  });

  it("renders navigation as a real link and prevents disabled navigation", () => {
    const onClick = vi.fn();
    render(<><ButtonLink href="/external">External</ButtonLink><ButtonLink href="/disabled" disabled onClick={onClick}>Disabled</ButtonLink></>);
    expect(screen.getByRole("link", { name: "External" }).getAttribute("href")).toBe("/external");
    fireEvent.click(screen.getByRole("link", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses a router adapter through NavigationProvider", () => {
    render(<NavigationProvider link={RouterLink}><ButtonLink to="/docs" variant="primary">Docs</ButtonLink></NavigationProvider>);
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("data-route")).toBe("/docs");
  });

  it("centers a single icon without rendering an empty label span", () => {
    render(<IconButton label="Next" icon={<ArrowRight />} />);
    const button = screen.getByRole("button", { name: "Next" });
    expect(button.className).toContain("icon-button");
    expect(button.children).toHaveLength(1);
    expect(button.firstElementChild?.classList.contains("btn__icon")).toBe(true);
  });
});
