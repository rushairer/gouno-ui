import type { ComponentDocument } from "../../components/component-page";
import { alertDocuments } from "./alert";
import { badgeDocuments } from "./badge";
import { buttonDocuments } from "./button";
import { codeBlockDocuments } from "./code-block";
import { dataDisplayDocuments } from "./data-display";
import { advancedDataDisplayDocuments } from "./data-display-advanced";
import { treeDocuments } from "./tree-document";
import { dataEntryDocuments } from "./data-entry";
import { nativePickerReviewDocuments } from "./data-entry-review-6c1";
import { autoCompleteReviewDocuments } from "./data-entry-review-6d1";
import { sliderRateReviewDocuments } from "./data-entry-review-6d2";
import { inputOtpReviewDocuments } from "./data-entry-review-6d3";
import { mentionsReviewDocuments } from "./data-entry-review-6d4";
import { transferReviewDocuments } from "./data-entry-review-6d5";
import { cascaderReviewDocuments } from "./data-entry-review-6d6";
import { treeSelectReviewDocuments } from "./data-entry-review-6d7";
import { feedbackDocuments } from "./feedback";
import { popconfirmReviewDocuments } from "./feedback-review-6e1";
import { messageReviewDocuments } from "./feedback-review-6e2";
import { notificationReviewDocuments } from "./feedback-review-6e3";
import { tourReviewDocuments } from "./feedback-review-6e4";
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
import { surfaceReview5bDocuments } from "./surface-review-5b";
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
  ...nativePickerReviewDocuments,
  ...autoCompleteReviewDocuments,
  ...sliderRateReviewDocuments,
  ...inputOtpReviewDocuments,
  ...mentionsReviewDocuments,
  ...transferReviewDocuments,
  ...cascaderReviewDocuments,
  ...treeSelectReviewDocuments,
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
  ...popconfirmReviewDocuments,
  ...messageReviewDocuments,
  ...notificationReviewDocuments,
  ...tourReviewDocuments,
  ...overlayDocuments,
  ...alertDocuments,
  ...otherDocuments,
  // Review overlays extend existing families without duplicating their base
  // implementation or creating new Showcase family IDs.
  ...surfaceReviewDocuments,
  ...surfaceReview5bDocuments,
};
