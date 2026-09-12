import { Card, Heading, Text } from "../../../src/core";
import { ComponentPage } from "../../components/component-page";
import { coreDocuments } from "./registry";

export function CoreComponentPage({ component }: { component: string }) {
  const document = coreDocuments[component];

  if (!document) {
    return (
      <Card variant="subtle">
        <Heading level={1}>Showcase document missing</Heading>
        <Text tone="muted">
          No canonical Core documentation is registered for <code>{component}</code>.
        </Text>
      </Card>
    );
  }

  return <ComponentPage document={document} />;
}
