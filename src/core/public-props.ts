import type { ComponentProps } from "react";
import type {
  ChoiceButton,
  IconButtonLink,
  NavigationProvider,
} from "./button";
import type { Icon } from "./icon";
import type { SearchField } from "./input";
import type {
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FormField,
} from "./field";
import type {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
  Radio,
  Switch,
} from "./selection-controls";
import type { FormActions, FormGrid, FormLayout, OverlayForm } from "./form";
import type { Tab, TabList, TabPanel } from "./tabs";
import type { Skeleton } from "./feedback";
import type { Container } from "./layout-primitives";
import type { Divider, Grid } from "./layout";
import type { Breadcrumb } from "./breadcrumb";
import type { Calendar } from "./calendar";
import type { Carousel } from "./carousel";
import type { Slider } from "./slider";
import type { Rate } from "./rate";
import type { Segmented } from "./segmented";
import type { Collapse } from "./collapse";
import type {
  Popover,
  PopoverAnchor,
  PopoverTrigger,
} from "../components/primitives/popover";
import type {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "../components/primitives/tooltip";
import type {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/primitives/dropdown-menu";
import type { Tree } from "./tree";
import type {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from "./page-layout";
import type { InputOTP } from "./input-otp";

/**
 * Exact, runtime-derived props for public components whose implementation is a
 * thin wrapper or compound primitive and therefore does not need a separate
 * handwritten props contract. These aliases are type-only and cannot add a
 * runtime dependency edge or drift away from the component implementation.
 */
export type IconButtonLinkProps = ComponentProps<typeof IconButtonLink>;
export type ChoiceButtonProps = ComponentProps<typeof ChoiceButton>;
export type NavigationProviderProps = ComponentProps<typeof NavigationProvider>;
export type IconProps = ComponentProps<typeof Icon>;
export type SearchFieldProps = ComponentProps<typeof SearchField>;
export type FormFieldProps = ComponentProps<typeof FormField>;
export type FieldGroupProps = ComponentProps<typeof FieldGroup>;
export type FieldSetProps = ComponentProps<typeof FieldSet>;
export type FieldLegendProps = ComponentProps<typeof FieldLegend>;
export type FieldLabelProps = ComponentProps<typeof FieldLabel>;
export type CheckboxProps = ComponentProps<typeof Checkbox>;
export type RadioProps = ComponentProps<typeof Radio>;
export type SwitchProps = ComponentProps<typeof Switch>;
export type CheckboxFieldProps = ComponentProps<typeof CheckboxField>;
export type CheckboxGroupProps = ComponentProps<typeof CheckboxGroup>;
export type FormLayoutProps = ComponentProps<typeof FormLayout>;
export type FormGridProps = ComponentProps<typeof FormGrid>;
export type FormActionsProps = ComponentProps<typeof FormActions>;
export type OverlayFormProps = ComponentProps<typeof OverlayForm>;
export type TabListProps = ComponentProps<typeof TabList>;
export type TabProps = ComponentProps<typeof Tab>;
export type TabPanelProps = ComponentProps<typeof TabPanel>;
export type SkeletonProps = ComponentProps<typeof Skeleton>;
export type ContainerProps = ComponentProps<typeof Container>;
export type DividerProps = ComponentProps<typeof Divider>;
export type GridProps = ComponentProps<typeof Grid>;
export type BreadcrumbProps = ComponentProps<typeof Breadcrumb>;
export type CalendarProps = ComponentProps<typeof Calendar>;
export type CarouselProps = ComponentProps<typeof Carousel>;
export type SliderProps = ComponentProps<typeof Slider>;
export type RateProps = ComponentProps<typeof Rate>;
export type SegmentedProps = ComponentProps<typeof Segmented>;
export type CollapseProps = ComponentProps<typeof Collapse>;
export type PopoverProps = ComponentProps<typeof Popover>;
export type PopoverTriggerProps = ComponentProps<typeof PopoverTrigger>;
export type PopoverAnchorProps = ComponentProps<typeof PopoverAnchor>;
export type TooltipProps = ComponentProps<typeof Tooltip>;
export type TooltipTriggerProps = ComponentProps<typeof TooltipTrigger>;
export type TooltipProviderProps = ComponentProps<typeof TooltipProvider>;
export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
export type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuTrigger>;
export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuContent>;
export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
export type DropdownMenuSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;
export type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuLabel>;
export type TreeProps = ComponentProps<typeof Tree>;
export type LayoutProps = ComponentProps<typeof Layout>;
export type LayoutHeaderProps = ComponentProps<typeof LayoutHeader>;
export type LayoutSiderProps = ComponentProps<typeof LayoutSider>;
export type LayoutContentProps = ComponentProps<typeof LayoutContent>;
export type LayoutFooterProps = ComponentProps<typeof LayoutFooter>;
export type InputOTPProps = ComponentProps<typeof InputOTP>;
