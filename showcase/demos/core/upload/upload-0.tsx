import { Upload } from "../../../../src/core";

export default function Example16() {
  return (
    <Upload accept="image/*" multiple maxCount={3}>
      选择图片
    </Upload>
  );
}
