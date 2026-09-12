import { useState, type FormEvent } from "react";
import { Image, Save } from "lucide-react";
import { Alert, Button, Card, CardContent, CardFooter, FormField, Input, Text, Textarea } from "../../../../../src/core";
import { ManagementPanelLead } from "./shared";

type Branding = {
  productName: string;
  logoUrl: string;
  faviconUrl: string;
  loginTitle: string;
  loginDescription: string;
  loginBackground: string;
};

const initialBranding: Branding = {
  productName: "GOSSO",
  logoUrl: "https://sso.io84.com/assets/logo.svg",
  faviconUrl: "https://sso.io84.com/favicon.svg",
  loginTitle: "统一身份中心",
  loginDescription: "安全登录并继续访问受保护的 Gouno 产品。",
  loginBackground: "https://images.example.test/gosso-login.webp",
};

export function SiteSettingsPanel() {
  const [settings, setSettings] = useState<Branding>(initialBranding);
  const [baseline, setBaseline] = useState<Branding>(initialBranding);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(settings) !== JSON.stringify(baseline);

  const update = <K extends keyof Branding>(key: K, value: Branding[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    setBaseline(settings);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <ManagementPanelLead description="维护 GOSSO 登录入口的产品名称、品牌资源和登录页文案，并在保存前预览结果。" />
      {saved ? <Alert type="success" showIcon title="站点设置已保存（Showcase 模拟）。" /> : null}

      <form onSubmit={save} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card padding="none" className="gap-0 overflow-clip">
          <CardContent className="flex flex-col gap-5 p-6">
            <FormField label="产品名称" required><Input value={settings.productName} onChange={(event) => update("productName", event.target.value)} maxLength={120} /></FormField>
            <FormField label="Logo URL"><Input value={settings.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} placeholder="https://…/logo.svg" /></FormField>
            <FormField label="Favicon URL"><Input value={settings.faviconUrl} onChange={(event) => update("faviconUrl", event.target.value)} placeholder="https://…/favicon.svg" /></FormField>
            <FormField label="登录标题"><Input value={settings.loginTitle} onChange={(event) => update("loginTitle", event.target.value)} maxLength={160} /></FormField>
            <FormField label="登录说明"><Textarea value={settings.loginDescription} onChange={(event) => update("loginDescription", event.target.value)} rows={3} maxLength={500} showCount /></FormField>
            <FormField label="登录背景 URL / Base64" hint="真实产品支持常见网络图片 URL 和 Base64 图片源，保存前仍由服务端执行长度/类型校验。"><Textarea value={settings.loginBackground} onChange={(event) => update("loginBackground", event.target.value)} rows={5} spellCheck={false} /></FormField>
          </CardContent>
          <CardFooter className="sticky bottom-0 z-10 justify-between border-t bg-card/95 px-6 py-4 backdrop-blur">
            <Text size="sm" tone="muted">{dirty ? "有未保存修改" : "所有修改已保存"}</Text>
            <Button type="submit" variant="solid" color="primary" icon={<Save />} disabled={!dirty}>保存设置</Button>
          </CardFooter>
        </Card>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <Card padding="base" className="overflow-hidden">
            <div className="mb-4 flex items-center gap-2"><Image aria-hidden="true" className="size-4 text-muted-foreground" /><Text size="sm" className="font-medium">登录页预览</Text></div>
            <div className="relative min-h-[430px] overflow-hidden rounded-xl border bg-muted/30 p-6">
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/60" />
              <div className="relative mx-auto mt-12 max-w-sm rounded-xl border bg-background/95 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{settings.productName.slice(0, 2).toUpperCase()}</div>
                  <div><div className="font-semibold">{settings.productName || "GOSSO"}</div><Text size="xs" tone="muted">Identity Provider</Text></div>
                </div>
                <div className="text-xl font-semibold">{settings.loginTitle || settings.productName || "登录"}</div>
                <Text size="sm" tone="muted" className="mt-2 leading-relaxed">{settings.loginDescription || "安全登录并继续。"}</Text>
                <div className="mt-6 grid gap-3"><div className="h-9 rounded-md border bg-muted/30" /><div className="h-9 rounded-md border bg-muted/30" /><div className="h-9 rounded-md bg-primary" /></div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}