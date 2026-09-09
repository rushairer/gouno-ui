import {
  Button,
  Form,
  FormActions,
  FormField,
  FormGrid,
  Input,
  OverlayForm,
  Textarea,
} from "../../../../src/core";

export default function FormAnatomyDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Form>
        <FormGrid columns={2}>
          <FormField label="站点名称" required>
            <Input name="siteName" defaultValue="Gouno" />
          </FormField>
          <FormField label="联系邮箱" hint="用于接收系统通知。">
            <Input name="email" type="email" placeholder="ops@example.com" />
          </FormField>
        </FormGrid>
        <FormActions>
          <Button type="button">取消</Button>
          <Button type="submit" variant="solid" color="primary">
            保存
          </Button>
        </FormActions>
      </Form>

      <OverlayForm
        aria-label="抽屉表单结构"
        actions={
          <>
            <Button type="button">取消</Button>
            <Button type="submit" variant="solid" color="primary">
              保存草稿
            </Button>
          </>
        }
      >
        <FormField label="摘要">
          <Textarea name="summary" rows={5} defaultValue="用于覆盖层中的稳定表单骨架。" />
        </FormField>
      </OverlayForm>
    </div>
  );
}
