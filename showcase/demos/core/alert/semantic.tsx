import { Megaphone } from "lucide-react";
import { Alert, Button } from "../../../../src/core";

export default function SemanticStyles() {
  return (
    <Alert
      type="info"
      showIcon
      icon={<Megaphone />}
      title="Semantic DOM"
      description="classNames 与 styles 可以只定制指定语义区域，而无需依赖内部 DOM 层级。"
      classNames={{ title: "font-mono", actions: "self-center" }}
      styles={{ root: { maxWidth: 640 }, description: { maxWidth: 480 } }}
      action={<Button size="small">了解更多</Button>}
    />
  );
}
