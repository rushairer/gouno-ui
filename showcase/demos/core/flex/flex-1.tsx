import { Flex, Tag } from "../../../../src/core";

export default function FlexWrapDemo() {
  return (
    <Flex
      direction="row-reverse"
      justify="end"
      align="center"
      wrap="wrap-reverse"
      gap={10}
      aria-label="Flexible tags"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <Tag key={index}>Item {index + 1}</Tag>
      ))}
    </Flex>
  );
}
