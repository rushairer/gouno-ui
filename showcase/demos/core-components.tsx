import { ComponentPage } from "../components/component-page";
import { coreDocuments } from "./core/registry";
export function CoreComponentPage({ component }: { component: string }) { return <ComponentPage document={coreDocuments[component] || coreDocuments.button} />; }
