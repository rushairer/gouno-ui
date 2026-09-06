import type { ComponentDocument } from "../../components/component-page";
import { generalDocuments } from "./general";
import { layoutDocuments } from "./layout";
import { dataEntryDocuments } from "./data-entry";
import { navigationDocuments } from "./navigation";
import { dataDisplayDocuments } from "./data-display";
import { feedbackDocuments } from "./feedback";
import { otherDocuments } from "./other";
export const coreDocuments: Record<string, ComponentDocument> = { ...generalDocuments, ...layoutDocuments, ...dataEntryDocuments, ...navigationDocuments, ...dataDisplayDocuments, ...feedbackDocuments, ...otherDocuments };
