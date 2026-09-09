import { Text } from "../../../src/core";
import { PageContainer } from "../../../src/gouno";

export default function GounoPageContainerExample() {
  return (
    <div className="rounded-lg bg-muted/20 p-3">
      <PageContainer
        data-page="settings"
        className="rounded-md border border-dashed bg-background p-5"
      >
        <Text size="sm">PageContainer content track</Text>
        <Text size="xs" tone="muted">
          max-width 1440px · width 100% · vertical gap 24px
        </Text>
      </PageContainer>
    </div>
  );
}
