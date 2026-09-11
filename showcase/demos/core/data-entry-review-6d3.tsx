import type { ComponentDocument } from "../../components/component-page";
import { dataEntryDocuments } from "./data-entry";
import InputOTPDemo from "./input-otp/input-otp-0";
import InputOTPDemoSource from "./input-otp/input-otp-0.tsx?raw";

const canonicalCoreSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core").trim();

export const inputOtpReviewDocuments: Record<string, ComponentDocument> = {
  "input-otp": {
    ...dataEntryDocuments["input-otp"],
    description:
      "多格数字验证码输入保持单一字符串 value 合同；组级可访问名称由调用方通过标准 aria-label/aria-labelledby 提供，各输入格使用语言无关数字位置名。支持自动前进、空格退格回退、方向键/Home/End 导航与多位粘贴。",
    code: canonicalCoreSource(InputOTPDemoSource),
    render: () => <InputOTPDemo />,
    api: [
      {
        name: "length",
        description: "验证码格数；小于 1 的输入规范化为 1。",
        type: "number",
        defaultValue: "6",
      },
      {
        name: "value",
        description: "受控验证码字符串；只保留数字并截断到 length。",
        type: "string",
      },
      {
        name: "defaultValue",
        description: "非受控初始验证码字符串。",
        type: "string",
        defaultValue: '""',
      },
      {
        name: "onChange",
        description: "任一格输入、退格或多位粘贴后回传当前验证码字符串。",
        type: "(value: string) => void",
      },
      {
        name: "disabled",
        description: "禁用整组输入并同步 group aria-disabled。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "mask",
        description: "将各输入格切换为 password 显示；不改变数字值合同。",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "size",
        description: "Gouno ControlSize。",
        type: '"small" | "middle" | "large"',
        defaultValue: '"middle"',
      },
      {
        name: "status",
        description: "error 同步组与输入格 aria-invalid；warning 只表达校验视觉。",
        type: '"error" | "warning"',
      },
      {
        name: "...div props",
        description:
          "根 group 透传标准 className/data-*、aria-label/aria-labelledby 与事件；role 和 aria-disabled 由组件语义拥有。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
      {
        name: "ref",
        description: "指向真实 role=group 根 div。",
        type: "Ref<HTMLDivElement>",
      },
    ],
  },
};
