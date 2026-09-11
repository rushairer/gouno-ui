import { Button, Card, Flex, Text } from "../../../../src/core";

export default function FlexDemo() {
  return (
    <Card padding="sm">
      <Flex justify="space-between" align="center" gap="lg">
        <Flex direction="column" gap="xs">
          <Text className="font-semibold">Build status</Text>
          <Text size="sm" tone="muted">All verification gates passed.</Text>
        </Flex>
        <Button size="small">Details</Button>
      </Flex>
    </Card>
  );
}
