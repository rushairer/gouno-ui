import { useState } from "react";
import { InputOTP } from "../../../../src/core";

export default function InputOTPDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <span className="text-sm font-medium">短信验证码</span>
        <InputOTP
          aria-label="短信验证码"
          length={6}
          value={value}
          onChange={setValue}
        />
        <p className="text-sm text-muted-foreground">当前输入 {value.length} / 6 位</p>
      </div>
      <InputOTP
        aria-label="已锁定验证码"
        length={4}
        defaultValue="2841"
        mask
        size="large"
        disabled
      />
    </div>
  );
}
