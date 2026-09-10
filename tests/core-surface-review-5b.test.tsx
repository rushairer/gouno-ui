import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { App, AspectRatio, Container, Stack } from "../src/core";
import { coreDocuments } from "../showcase/demos/core/registry";

afterEach(() => {
  cleanup();
});

describe("Core retained layout foundations", () => {
  it("forwards refs to the semantic App, Container, AspectRatio and Stack roots", () => {
    const appRef = createRef<HTMLDivElement>();
    const containerRef = createRef<HTMLDivElement>();
    const ratioRef = createRef<HTMLDivElement>();
    const stackRef = createRef<HTMLDivElement>();

    render(
      <App ref={appRef} data-testid="app">
        <Container ref={containerRef} data-testid="container">
          <AspectRatio ref={ratioRef} ratio={0} data-testid="ratio">
            <Stack ref={stackRef} gap={12} data-testid="stack">
              <span>One</span>
              <span>Two</span>
            </Stack>
          </AspectRatio>
        </Container>
      </App>,
    );

    expect(appRef.current).toBe(screen.getByTestId("app"));
    expect(containerRef.current).toBe(screen.getByTestId("container"));
    expect(ratioRef.current).toBe(screen.getByTestId("ratio"));
    expect(stackRef.current).toBe(screen.getByTestId("stack"));
    expect(appRef.current?.dataset.slot).toBe("app");
    expect(containerRef.current?.dataset.slot).toBe("container");
    expect(ratioRef.current?.dataset.slot).toBe("aspect-ratio");
    expect(stackRef.current?.dataset.slot).toBe("stack");
  });

  it("keeps AspectRatio defensive and Stack numeric spacing deterministic", () => {
    render(
      <AspectRatio ratio={Number.NaN} data-testid="ratio">
        <Stack gap={12} data-testid="stack" />
      </AspectRatio>,
    );

    expect(screen.getByTestId("ratio").style.aspectRatio).toBe(String(16 / 9));
    expect(screen.getByTestId("stack").style.gap).toBe("12px");
  });

  it("documents retained wrappers inside existing Layout and Flex families", () => {
    const layoutSections =
      coreDocuments["page-layout"].apiSections?.map((section) => section.title) ?? [];
    expect(layoutSections).toEqual(
      expect.arrayContaining(["App API", "Container API", "AspectRatio API"]),
    );
    expect(coreDocuments["page-layout"].demos?.some(
      (demo) => demo.title === "App / Container / AspectRatio 基础结构",
    )).toBe(true);

    const flexSections = coreDocuments.flex.apiSections?.map((section) => section.title) ?? [];
    expect(flexSections).toContain("Stack API");
    expect(coreDocuments.flex.demos?.some((demo) => demo.title === "Stack 便捷堆叠")).toBe(true);
  });
});
