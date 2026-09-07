import { useState } from "react";
import { Select, Space, Text, Upload } from "../../../../src/core";

const initialFile = new File(["Gouno UI"], "readme.txt", {
  type: "text/plain",
});
export default function UploadStatesDemo() {
  const [state, setState] = useState("ready");
  const [files, setFiles] = useState<File[]>([initialFile]);
  const [message, setMessage] = useState(
    "最多选择两个文本文件，每个文件最多 1 KB。",
  );
  return (
    <Space orientation="vertical" align="stretch">
      <Select
        aria-label="上传状态"
        value={state}
        onChange={(event) => setState(event.target.value)}
      >
        <option value="ready">可编辑</option>
        <option value="disabled">禁用</option>
        <option value="readonly">只读</option>
        <option value="error">错误</option>
      </Select>
      <Upload
        drag
        multiple
        files={files}
        onFiles={setFiles}
        accept=".txt"
        maxCount={2}
        maxSize={1024}
        disabled={state === "disabled"}
        readOnly={state === "readonly"}
        error={state === "error" ? "文件未通过检查，请重新选择。" : undefined}
        beforeSelect={(file) => !file.name.startsWith("private")}
        onReject={(file, reason) =>
          setMessage(`${file.name} 被拒绝：${reason}`)
        }
        onRemove={(file) => setMessage(`已移除 ${file.name}`)}
      >
        点击或拖入文本文件
      </Upload>
      <Text role="status">{message}</Text>
    </Space>
  );
}
