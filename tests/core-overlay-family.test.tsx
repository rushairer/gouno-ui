import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../src/core";
import { dropdownDocument } from "../showcase/demos/core/dropdown";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { navigationDocuments } from "../showcase/demos/core/navigation";
import { overlayDocuments } from "../showcase/demos/core/overlay";

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  writable: true,
  value: class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

afterEach(cleanup);

describe("Core overlay and dropdown families", () => {
  it("keeps Popover and Tooltip in one source-backed overlay owner", () => {
    expect(feedbackDocuments.popover).toBeUndefined();
    expect(feedbackDocuments.tooltip).toBeUndefined();

    expect(overlayDocuments.popover.code).toContain('from "@gouno/ui/core"');
    expect(overlayDocuments.popover.code).toContain("<PopoverAnchor");
    expect(overlayDocuments.popover.code).toContain('placement="bottom-start"');
    expect(overlayDocuments.tooltip.code).toContain("<TooltipProvider");
    expect(overlayDocuments.tooltip.code).toContain('placement="bottom-start"');

    const popoverSections = new Set(
      overlayDocuments.popover.apiSections?.map((section) => section.title),
    );
    expect(popoverSections).toEqual(
      new Set(["PopoverTrigger API", "PopoverContent API", "PopoverAnchor API"]),
    );

    const tooltipSections = new Set(
      overlayDocuments.tooltip.apiSections?.map((section) => section.title),
    );
    expect(tooltipSections).toEqual(
      new Set(["TooltipProvider API", "TooltipTrigger API", "TooltipContent API"]),
    );
  });

  it("keeps Dropdown on one exact source document", () => {
    expect(navigationDocuments.dropdown).toBe(dropdownDocument);
    expect(dropdownDocument.code).toContain('from "@gouno/ui/core"');
    expect(dropdownDocument.code).toContain("<DropdownMenuLabel");
    expect(dropdownDocument.code).toContain("<DropdownMenuSeparator");
    expect(dropdownDocument.code).toContain('variant="destructive"');

    expect(dropdownDocument.apiSections?.map((section) => section.title)).toEqual([
      "DropdownMenuTrigger API",
      "DropdownMenuContent API",
      "DropdownMenuItem API",
      "DropdownMenuLabel API",
      "DropdownMenuSeparator API",
    ]);
  });

  it("renders controlled Popover public primitives with anchor and placement", () => {
    render(
      <Popover open>
        <PopoverAnchor asChild>
          <span>Anchor</span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <button type="button">Open</button>
        </PopoverTrigger>
        <PopoverContent placement="bottom-start" offset={8}>
          Popover content
        </PopoverContent>
      </Popover>,
    );

    const content = document.querySelector<HTMLElement>('[data-slot="popover-content"]');
    expect(content).toBeTruthy();
    expect(content?.textContent).toContain("Popover content");
    expect(screen.getByText("Anchor")).toBeTruthy();
  });

  it("renders controlled Tooltip through its Provider/Trigger/Content family", () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip open>
          <TooltipTrigger asChild>
            <button type="button">Help</button>
          </TooltipTrigger>
          <TooltipContent placement="bottom" offset={6}>
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const content = document.querySelector<HTMLElement>('[data-slot="tooltip-content"]');
    expect(content).toBeTruthy();
    expect(content?.textContent).toContain("Tooltip content");
  });

  it("renders Dropdown label, item and separator semantics from public primitives", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <button type="button">Actions</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Article</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeTruthy();
    expect(document.querySelector('[data-slot="dropdown-menu-label"]')?.textContent).toBe(
      "Article",
    );
    expect(document.querySelector('[data-slot="dropdown-menu-separator"]')).toBeTruthy();
    expect(document.querySelector('[data-variant="destructive"]')?.textContent).toBe(
      "Delete",
    );
  });
});
