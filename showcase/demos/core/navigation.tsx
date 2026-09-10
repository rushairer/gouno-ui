import type { ComponentDocument } from "../../components/component-page";
import { anchorDocument } from "./anchor";
import { dropdownDocument } from "./dropdown";
import { paginationDocument } from "./pagination";
import { tabsDocument } from "./tabs";

export const navigationDocuments: Record<string, ComponentDocument> = {
  pagination: paginationDocument,
  anchor: anchorDocument,
  tabs: tabsDocument,
  dropdown: dropdownDocument,
};
