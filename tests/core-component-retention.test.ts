import { describe, expect, it } from "vitest";
import * as Core from "../src/core";
import { coreRuntimeFamilyCoverage } from "../showcase/core-family-coverage";

// Established canonical Core runtime components as of 2026-09-10.
//
// This is deliberately a retention baseline, not a completeness catalog. New
// components do not need to be added here merely to make this test pass. Removing
// or renaming an entry from this baseline requires explicit maintainer/user
// confirmation first; see docs/core-component-retention.md.
const establishedCoreRuntime = [
  "Affix",
  "Alert",
  "Anchor",
  "App",
  "AspectRatio",
  "AutoComplete",
  "Avatar",
  "AvatarFallback",
  "AvatarImage",
  "BackTop",
  "Badge",
  "Breadcrumb",
  "Button",
  "ButtonLink",
  "Calendar",
  "Card",
  "CardContent",
  "CardDescription",
  "CardFooter",
  "CardHeader",
  "CardTitle",
  "Carousel",
  "Cascader",
  "Checkbox",
  "CheckboxField",
  "CheckboxGroup",
  "CheckableTag",
  "ChoiceButton",
  "CodeBlock",
  "Collapse",
  "ColorPicker",
  "Container",
  "DatePicker",
  "DateRangePicker",
  "Descriptions",
  "Divider",
  "Drawer",
  "DropdownMenu",
  "DropdownMenuContent",
  "DropdownMenuItem",
  "DropdownMenuLabel",
  "DropdownMenuSeparator",
  "DropdownMenuTrigger",
  "Empty",
  "Field",
  "FieldGroup",
  "FieldLabel",
  "FieldLegend",
  "FieldSet",
  "Flex",
  "FloatButton",
  "Form",
  "FormActions",
  "FormField",
  "FormGrid",
  "FormLayout",
  "Grid",
  "Heading",
  "Icon",
  "IconButton",
  "IconButtonLink",
  "Image",
  "Input",
  "InputNumber",
  "InputOTP",
  "Kbd",
  "Layout",
  "LayoutContent",
  "LayoutFooter",
  "LayoutHeader",
  "LayoutSider",
  "List",
  "Mentions",
  "Menu",
  "MessageProvider",
  "Modal",
  "NavigationProvider",
  "NotificationProvider",
  "OverlayForm",
  "Pagination",
  "Popover",
  "PopoverAnchor",
  "PopoverContent",
  "PopoverTrigger",
  "Popconfirm",
  "Progress",
  "QRCode",
  "Radio",
  "Rate",
  "Result",
  "SearchField",
  "Segmented",
  "Select",
  "Separator",
  "Skeleton",
  "Slider",
  "Space",
  "Spin",
  "Spinner",
  "Splitter",
  "Stack",
  "Statistic",
  "Steps",
  "Switch",
  "Tab",
  "TabList",
  "TabPanel",
  "Table",
  "TableBody",
  "TableCaption",
  "TableCell",
  "TableFooter",
  "TableHead",
  "TableHeader",
  "TableRow",
  "Tabs",
  "Tag",
  "Text",
  "Textarea",
  "Timeline",
  "TimePicker",
  "Tooltip",
  "TooltipContent",
  "TooltipProvider",
  "TooltipTrigger",
  "Tour",
  "Transfer",
  "Tree",
  "TreeSelect",
  "Typography",
  "Upload",
  "Watermark",
] as const;

describe("established Core component retention", () => {
  it("keeps every established runtime component in the canonical Core API", () => {
    for (const name of establishedCoreRuntime) {
      expect(
        name in Core,
        `${name} is an established Core component. Removal or rename requires explicit maintainer/user confirmation; see docs/core-component-retention.md.`,
      ).toBe(true);
    }
  });

  it("keeps every established runtime component visible to Showcase coverage governance", () => {
    for (const name of establishedCoreRuntime) {
      expect(
        name in coreRuntimeFamilyCoverage,
        `${name} disappeared from Core runtime family coverage. Established component removal requires explicit confirmation; see docs/core-component-retention.md.`,
      ).toBe(true);
    }
  });

  it("specifically protects the restored families and the superseded Timeline removal", () => {
    for (const name of ["Image", "List", "Descriptions", "Timeline"] as const) {
      expect(name in Core).toBe(true);
      expect(name in coreRuntimeFamilyCoverage).toBe(true);
    }
  });
});
