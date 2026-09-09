import type { ComponentDocument } from "../../components/component-page";
import { alertDocuments } from "./alert";
import { badgeDocuments } from "./badge";
import { buttonDocuments } from "./button";
import { dataDisplayDocuments } from "./data-display";
import { dataEntryDocuments } from "./data-entry";
import { feedbackDocuments } from "./feedback";
import { formDocuments } from "./form";
import { generalDocuments } from "./general";
import { layoutDocuments } from "./layout";
import { navigationDocuments } from "./navigation";
import { otherDocuments } from "./other";
import { overlayDocuments } from "./overlay";
import { segmentedDocuments } from "./segmented";
import { selectionControlDocuments } from "./selection-controls";
import { statusDocuments } from "./status";
import { tagDocuments } from "./tag";
import { typographyDocuments } from "./typography";

export const coreDocuments: Record<string, ComponentDocument> = {
  ...buttonDocuments,
  ...generalDocuments,
  ...typographyDocuments,
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
  ...statusDocuments,
  ...overlayDocuments,
  ...alertDocuments,
  ...otherDocuments,
};
