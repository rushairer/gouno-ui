import { Button, Stack } from "../../../../src/core";

export default function StackDemo() {
  return (
    <Stack gap={8} className="max-w-xs">
      <Button>Primary action</Button>
      <Button variant="outline">Secondary action</Button>
      <Button variant="ghost">Tertiary action</Button>
    </Stack>
  );
}
