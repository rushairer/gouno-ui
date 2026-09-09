import { Checkbox, CheckboxGroup } from "../../../../src/core";

export default function CheckboxGroupDemo() {
  return (
    <form>
      <CheckboxGroup label="内容权限">
        <Checkbox name="permissions" value="read" label="读取" defaultChecked />
        <Checkbox name="permissions" value="write" label="编辑" />
        <Checkbox name="permissions" value="publish" label="发布" />
      </CheckboxGroup>
    </form>
  );
}
