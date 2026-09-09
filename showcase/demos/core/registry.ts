import type { ComponentDocument } from "../../components/component-page";
import { buttonDocuments } from "./button";
import { generalDocuments } from "./general";
import { badgeDocuments } from "./badge";
import { tagDocuments } from "./tag";
import { layoutDocuments } from "./layout";
import { dataEntryDocuments } from "./data-entry";
import { formDocuments } from "./form";
import { selectionControlDocuments } from "./selection-controls";
import { segmentedDocuments } from "./segmented";
import { navigationDocuments } from "./navigation";
import { dataDisplayDocuments } from "./data-display";
import { feedbackDocuments } from "./feedback";
import { alertDocuments } from "./alert";
import { otherDocuments } from "./other";

export const coreDocuments: Record<string, ComponentDocument> = {
  ...buttonDocuments,
  ...generalDocuments,
  ...badgeDocuments,
  ...tagDocuments,
  ...layoutDocuments,
  ...dataEntryDocuments,
  ...formDocuments,
  ...selectionControlDocuments,
  ...segmentedDocuments,
  ...navigationDocuments,
  ...dataDisplayDocuments,
  ...feedbackDocuments,
  ...alertDocuments,
  ...otherDocuments,
};
