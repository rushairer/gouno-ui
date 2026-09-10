import { Descriptions } from "../../../../src/core";

export default function DescriptionsBorderedExample() {
  return (
    <Descriptions
      bordered
      size="small"
      layout="vertical"
      colon={false}
      column={{ xs: 1, sm: 2 }}
      items={[
        { key: "owner", label: "Owner", children: "Core" },
        { key: "status", label: "Status", children: "Review complete" },
        {
          key: "note",
          label: "Notes",
          children: "Responsive spans keep long values readable without product-specific wrappers.",
          span: "filled",
        },
      ]}
    />
  );
}
