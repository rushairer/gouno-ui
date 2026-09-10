import { Steps } from "../../../../src/core";

const releaseSteps = [
  { key: "plan", title: "Plan", content: "Scope accepted." },
  { key: "build", title: "Build", content: "Implementation complete." },
  { key: "test", title: "Test", content: "Regression suite running." },
  { key: "review", title: "Review", content: "Awaiting approval." },
  { key: "stage", title: "Stage", content: "Prepare rollout." },
  { key: "ship", title: "Ship", content: "Production release." },
] as const;

export default function StepsVariantsExample() {
  return (
    <div className="flex flex-col gap-8">
      <Steps
        aria-label="Release workflow"
        current={2}
        status="error"
        maxCount={4}
        variant="outlined"
        items={releaseSteps}
      />

      <Steps
        aria-label="Compact vertical workflow"
        orientation="vertical"
        titlePlacement="vertical"
        type="dot"
        size="small"
        current={3}
        items={releaseSteps.slice(0, 4)}
      />
    </div>
  );
}
