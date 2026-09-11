import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, Col, Grid, Row } from "../src/core";

function cssNumber(element: HTMLElement, name: string) {
  return Number.parseFloat(element.style.getPropertyValue(name));
}

describe("Core Avatar/Grid batch 6B1", () => {
  it("uses canonical Avatar sizes, shape, numeric sizing and a real root ref", () => {
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
      <Avatar ref={ref} size="small" shape="square" data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>,
    );
    const avatar = screen.getByTestId("avatar");
    expect(ref.current).toBe(avatar);
    expect(avatar.dataset.size).toBe("small");
    expect(avatar.dataset.shape).toBe("square");
    expect(avatar.className).toContain("size-6");
    expect(avatar.className).toContain("rounded-md");
    rerender(<Avatar size="lg" data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>);
    expect(screen.getByTestId("avatar").dataset.size).toBe("large");
    rerender(<Avatar size={48} data-testid="avatar"><AvatarFallback>AB</AvatarFallback></Avatar>);
    expect(screen.getByTestId("avatar").style.width).toBe("48px");
    expect(screen.getByTestId("avatar").style.height).toBe("48px");
  });

  it("keeps AvatarGroup overflow bounded and caller-owned", () => {
    render(
      <AvatarGroup max={3} overflowRender={(count) => `还有 ${count}`} data-testid="group">
        {['A', 'B', 'C', 'D'].map((label) => <Avatar key={label}><AvatarFallback>{label}</AvatarFallback></Avatar>)}
      </AvatarGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.dataset.max).toBe("3");
    expect(group.dataset.overflow).toBe("true");
    expect(group.children).toHaveLength(3);
    expect(screen.getByText("还有 2").dataset.slot).toBe("avatar-group-count");
  });

  it("keeps AvatarBadge as a standard caller-labelled semantic slot", () => {
    render(<Avatar><AvatarFallback>AB</AvatarFallback><AvatarBadge aria-label="在线" /></Avatar>);
    expect(screen.getByLabelText("在线").dataset.slot).toBe("avatar-badge");
  });

  it("keeps Grid helper ref-safe and applies numeric gap through style", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref} columns={3} gap={11} data-testid="grid"><div>A</div></Grid>);
    const grid = screen.getByTestId("grid");
    expect(ref.current).toBe(grid);
    expect(grid.dataset.slot).toBe("grid");
    expect(grid.dataset.columns).toBe("3");
    expect(grid.style.gap).toBe("11px");
  });

  it("maps Row gutter and cumulative responsive 24-grid Col variables", () => {
    render(
      <Row gutter={[16, 8]} data-testid="row">
        <Col xs={12} sm={8} md={{ span: 6, offset: 2, order: 3, push: 1 }} data-testid="col" />
      </Row>,
    );
    const row = screen.getByTestId("row");
    const col = screen.getByTestId("col");
    expect(row.style.marginInline).toBe("-8px");
    expect(row.style.rowGap).toBe("8px");
    expect(col.style.paddingInline).toBe("8px");
    expect(col.dataset.span).toBe("12");
    expect(col.dataset.smSpan).toBe("8");
    expect(col.dataset.mdSpan).toBe("6");
    expect(col.dataset.lgSpan).toBe("6");
    expect(cssNumber(col, "--gouno-col-basis")).toBeCloseTo(50);
    expect(cssNumber(col, "--gouno-col-sm-basis")).toBeCloseTo(100 / 3);
    expect(cssNumber(col, "--gouno-col-md-offset")).toBeCloseTo(100 / 12);
    expect(cssNumber(col, "--gouno-col-md-shift")).toBeCloseTo(100 / 24);
    expect(col.style.getPropertyValue("--gouno-col-lg-order")).toBe("3");
  });
});
