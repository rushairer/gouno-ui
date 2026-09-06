import { useState } from "react";

import { Upload } from "../../../../src/core";
function ControlledUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Upload
      files={files}
      multiple
      maxCount={2}
      maxSize={1024 * 1024}
      accept="image/*"
      drag
      onFiles={setFiles}
    >
      拖放图片或点击选择，最多 2 张
    </Upload>
  );
}
export default function Example17() {
  return <ControlledUploadDemo />;
}
