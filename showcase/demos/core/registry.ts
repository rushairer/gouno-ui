import type { ComponentDocument } from "../../components/component-page";
import { alertDocuments } from "./alert";
import { badgeDocuments } from "./badge";
import { buttonDocuments } from "./button";
import { codeBlockDocuments } from "./code-block";
import { dataDisplayDocuments } from "./data-display";
import { advancedDataDisplayDocuments } from "./data-display-advanced";
import { treeDocuments } from "./tree-document";
import { dataEntryDocuments } from "./data-entry";
import { feedbackDocuments } from "./feedback";
import { formDocuments } from "./form";
import { generalDocuments } from "./general";
import { layoutDocuments } from "./layout";
import { navigationDocuments } from "./navigation";
import { advancedNavigationDocuments } from "./navigation-advanced";
import { stepsMenuDocuments } from "./steps-menu";
import { otherDocuments } from "./other";
import { overlayDocuments } from "./overlay";
import { segmentedDocuments } from "./segmented";
import { selectionControlDocuments } from "./selection-controls";
import { surfaceReviewDocuments } from "./surface-review-5a";
import { tagDocuments } from "./tag";
import { typographyDocuments } from "./typography";

export const coreDocuments: Record<string, ComponentDocument> = {
  ...buttonDocuments,
  ...generalDocuments,
  ...typographyDocuments,
  ...codeBlockDocuments,
  ...badgeDocuments,
  ...tagDocuments,
  ...layoutDocuments,
  ...dataEntryDocuments,
  ...formDocuments,
  ...selectionControlDocuments,
  ...segmentedDocuments,
  ...navigationDocuments,
  ...advancedNavigationDocuments,
  ...stepsMenuDocuments,
  ...dataDisplayDocuments,
  ...advancedDataDisplayDocuments,
  ...treeDocuments,
  ...feedbackDocuments,
  ...overlayDocuments,
  ...alertDocuments,
  ...otherDocuments,
  // Review overlays extend existing families without duplicating their base
  // implementation or creating new Showcase family IDs.
  ...surfaceReviewDocuments,
};
