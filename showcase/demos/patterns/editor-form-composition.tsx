import { useState } from "react";
import { ClipboardList, Save } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Form,
  FormGrid,
  Heading,
  Input,
  Segmented,
  Switch,
  Tag,
  Text,
  Textarea,
} from "../../../src/core";
import {
  EditorFieldStack,
  EditorFormActions,
  EditorFormStack,
  EditorFormSurfaceSection,
} from "../../components/patterns/editor-form-composition";

type EditorSurface = "modal" | "drawer" | "dedicated";

const surfaceOptions = [
  { label: "Modal", value: "modal" },
  { label: "Drawer", value: "drawer" },
  { label: "Dedicated", value: "dedicated" },
] as const;

const surfaceCopy: Record<EditorSurface, string> = {
  modal: "轻量 mutation：表单短、概念少，动作由 Modal action boundary 承担。",
  drawer: "上下文 CRUD：列表继续保留，Drawer 控制外层滚动与 footer，字段节奏不变。",
  dedicated: "深度配置：页面拥有完整任务上下文与 Back；内部字段/Section 仍使用同一节奏。",
};

export function PatternEditorFormCompositionDemo() {
  const [surface, setSurface] = useState<EditorSurface>("drawer");
  const [showFeedback, setShowFeedback] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Composition Pattern · Showcase contract
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1}>Editor Form 编辑表单组合</Heading>
          <Tag color="success">Canonical</Tag>
          <Tag>Showcase-only</Tag>
        </div>
        <Text tone="muted" className="max-w-4xl leading-relaxed">
          Modal、Drawer 与 Dedicated Editor 的外层任务语义不同，但进入编辑表单后共享同一套 Feedback → Sections → Field rhythm → Actions 语法。这个页面定义组合契约，不新增公开 EditorForm runtime API。
        </Text>
      </header>

      <section className="flex flex-col gap-4 rounded-xl border bg-muted/[0.08] p-4" aria-label="Editor Form Fixture">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <Text size="xs" tone="muted">Editor surface</Text>
            <Segmented<EditorSurface>
              aria-label="编辑器 Surface"
              options={surfaceOptions}
              value={surface}
              onChange={setSurface}
            />
          </div>
          <Button size="small" variant="outline" onClick={() => setShowFeedback((value) => !value)}>
            {showFeedback ? "隐藏反馈" : "显示反馈"}
          </Button>
        </div>
        <Text size="sm" tone="muted">{surfaceCopy[surface]}</Text>
      </section>

      <Form onFinish={() => undefined}>
        <EditorFormStack>
          <div className="flex items-start gap-3" data-slot="editor-identity">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary" aria-hidden="true">
              <ClipboardList className="size-5" />
            </span>
            <div className="min-w-0">
              <Heading level={2}>编辑自动化资产</Heading>
              <Text size="sm" tone="muted">外层由 {surface} surface 拥有；下面的表单 anatomy 不随 surface 漂移。</Text>
            </div>
          </div>

          {showFeedback ? (
            <Alert type="warning" showIcon title="存在未保存变更" description="Form-wide feedback 固定在 identity/header 之后、字段主体之前。" />
          ) : null}

          <EditorFormSurfaceSection title="基础信息" description="普通字段使用统一 20px vertical rhythm。">
            <EditorFieldStack>
              <FormGrid columns={2}>
                <Field label="名称" required><Input defaultValue="内容维护" /></Field>
                <Field label="状态"><Switch defaultChecked label="启用资产" /></Field>
              </FormGrid>
              <Field label="说明">
                <Textarea rows={4} defaultValue="持续执行内容维护与治理任务。" />
              </Field>
            </EditorFieldStack>
          </EditorFormSurfaceSection>

          <EditorFormSurfaceSection title="运行边界" description="Section 间距由父级 FormStack 拥有，不靠 section-local margin。">
            <EditorFieldStack>
              <Field label="Scope"><Input defaultValue="posts:published" /></Field>
              <Field label="日运行上限"><Input type="number" defaultValue="10" /></Field>
            </EditorFieldStack>
          </EditorFormSurfaceSection>

          <EditorFormActions>
            <Button type="button" variant="outline">取消</Button>
            <Button type="submit" variant="solid" color="primary" icon={<Save />}>保存</Button>
          </EditorFormActions>
        </EditorFormStack>
      </Form>
    </div>
  );
}

export default PatternEditorFormCompositionDemo;
