import { Text } from "../../../../src/core";
import { PageContainer } from "../../../../src/gouno";

export default function GounoPageContainerExample() {
  return (
    <div className="rounded-lg bg-muted/20 p-3">
      <PageContainer
        data-page="settings"
        className="rounded-md border border-dashed bg-background p-5"
      >
        <Text size="sm">PageContainer content track</Text>
        <Text size="xs" tone="muted">
          semantic page track · width 100% · governed vertical rhythm
        </Text>
      </PageContainer>
    </div>
  );
}
