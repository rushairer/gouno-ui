import { QRCode, Space, Text } from "../../../../src/core";

export default function QRCodeExample() {
  return (
    <Space orientation="vertical" align="start" gap={12}>
      <div className="rounded-lg border bg-white p-4">
        <QRCode
          value="otpauth://totp/Gouno:demo?secret=SHOWCASEDEMO&issuer=Gouno"
          size={180}
          aria-label="Gouno MFA 配置二维码"
        />
      </div>
      <Text size="sm" tone="muted">
        二维码的可访问名称由调用方根据实际用途提供。
      </Text>
    </Space>
  );
}
