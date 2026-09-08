import { useState, type ReactNode } from "react";
import {
  FileText,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  FormField,
  Input,
  Segmented,
  Skeleton,
  Tabs,
  Text,
  Textarea,
} from "../../../src/core";
import { PageHeader } from "../../../src/gouno";
import { FixtureDock } from "../../components/fixture-dock";
import { TabPanelLead } from "../../components/tab-panel-lead";

type SettingsTab = "basic" | "appearance" | "hero" | "social" | "seo";
type FixtureScenario = "data" | "loading" | "error";
type SecurityState = "unlocked" | "locked";

type SiteSettingsFixture = {
  site_title: string;
  site_description: string;
  author_name: string;
  author_bio: string;
  email: string;
  github_url: string;
  rss_url: string;
  default_seo_title: string;
  default_seo_description: string;
  footer_text: string;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  hero_image_caption: string;
  favicon_url: string;
};

const defaultHero = {
  hero_title: "记录探索与思考，\n沉淀见解与价值。",
  hero_description: "专注于长期记录、深度思考与知识沉淀。写下探索的过程，也分享有价值的见解。",
  hero_image_url: "/editorial-system-map.png",
  hero_image_caption: "EXPLORE / THINK / SHARE",
};

const initialSettings: SiteSettingsFixture = {
  site_title: "Gouno Blog",
  site_description: "互联网技术分析、工程实践与长期思考。",
  author_name: "Paw",
  author_bio: "记录真实问题、技术决策与产品演进。",
  email: "hello@io84.com",
  github_url: "https://github.com/rushairer",
  rss_url: "/feed.xml",
  default_seo_title: "Gouno Blog",
  default_seo_description: "记录、思考与分享。",
  footer_text: "Built with care, code, and curiosity.",
  ...defaultHero,
  favicon_url: "/favicon.svg",
};

const scenarioOptions = [
  { value: "data", label: "正常" },
  { value: "loading", label: "加载中" },
  { value: "error", label: "错误" },
] as const;

const securityOptions = [
  { value: "unlocked", label: "已解锁" },
  { value: "locked", label: "已锁定" },
] as const;

function SettingsSurface({
  description,
  dirty,
  onSave,
  secondaryAction,
  children,
}: {
  description: string;
  dirty: boolean;
  onSave: () => void;
  secondaryAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <TabPanelLead description={description} />
      <Card padding="none" className="gap-0 overflow-clip">
        <CardContent className="flex flex-col gap-5 p-6">
          {children}
        </CardContent>
        <CardFooter className="sticky bottom-0 z-10 justify-between border-t bg-card/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            {secondaryAction}
            <Text size="sm" tone="muted">{dirty ? "有未保存修改" : "当前设置已同步"}</Text>
          </div>
          <Button variant="solid" color="primary" icon={<Save />} disabled={!dirty} onClick={onSave}>
            保存设置
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function SiteSettingsSecurityGate({
  locked,
  onUnlock,
  children,
}: {
  locked: boolean;
  onUnlock: () => void;
  children: ReactNode;
}) {
  if (locked) {
    return (
      <Card padding="base" className="border-primary/20 bg-accent/20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock aria-hidden="true" className="size-6" />
          </div>
          <div className="flex flex-col gap-2">
            <Text className="text-lg font-semibold">站点核心配置保护</Text>
            <Text size="sm" tone="muted" className="leading-relaxed">
              修改站点品牌、SEO、页脚或联系方式等敏感设置需要近期多因素身份认证。解锁后享有 10 分钟无打扰编辑期。
            </Text>
          </div>
          <Button variant="solid" color="primary" icon={<KeyRound />} onClick={onUnlock}>解锁以修改设置</Button>
          <Text size="xs" tone="muted">安全认证由统一身份中心提供；Showcase 仅模拟近期 MFA/Sudo 状态。</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground" role="status">
        <ShieldCheck aria-hidden="true" className="size-3.5 text-[var(--status-success-text)]" />
        <span>Sudo 已解锁 · 剩余约 10 分钟</span>
      </div>
      {children}
    </div>
  );
}

function LoadingSettings() {
  return (
    <Card padding="base" aria-label="站点设置加载中">
      <div className="flex flex-col gap-5" role="status" aria-live="polite">
        <Text size="sm" tone="muted">正在载入站点设置…</Text>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    </Card>
  );
}

export function BlogAdminSiteSettingsDemo() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("basic");
  const [scenario, setScenario] = useState<FixtureScenario>("data");
  const [security, setSecurity] = useState<SecurityState>("unlocked");
  const [settings, setSettings] = useState<SiteSettingsFixture>(initialSettings);
  const [baseline, setBaseline] = useState<SiteSettingsFixture>(initialSettings);
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const dirty = JSON.stringify(settings) !== JSON.stringify(baseline);

  const field = <K extends keyof SiteSettingsFixture>(key: K, value: SiteSettingsFixture[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const save = () => {
    const rss = settings.rss_url.trim();
    if (rss && !rss.startsWith("/") && !/^https?:\/\//i.test(rss)) {
      setNotice({ type: "error", message: "RSS 地址必须是以 / 开头的站内路径，或完整的 http(s) URL。" });
      return;
    }
    const next = { ...settings, rss_url: rss || "/feed.xml" };
    setSettings(next);
    setBaseline(next);
    setNotice({ type: "success", message: "站点设置已成功保存（Showcase 模拟）。" });
  };

  const resetHeroDefaults = () => {
    setSettings((current) => ({ ...current, ...defaultHero }));
    setNotice({ type: "info", message: "已填充默认 Hero 标语与插图，保存后生效（Showcase 模拟）。" });
  };

  const uploadHero = () => {
    field("hero_image_url", "/media/hero-showcase.webp");
    setNotice({ type: "success", message: "Hero 插图已上传成功（Showcase 模拟）。" });
  };

  const uploadFavicon = () => {
    field("favicon_url", "/media/favicon-showcase.svg");
    setNotice({ type: "success", message: "站点图标已上传成功（Showcase 模拟）。" });
  };

  const content = (() => {
    if (scenario === "loading") return <LoadingSettings />;
    if (scenario === "error") {
      return (
        <Alert
          type="error"
          showIcon
          title="站点设置加载失败"
          description="无法读取 Blog 站点配置。真实产品会保留权限上下文并允许重新请求。"
          action={<Button size="small" onClick={() => setScenario("data")}>重新载入</Button>}
        />
      );
    }

    return (
      <SiteSettingsSecurityGate locked={security === "locked"} onUnlock={() => setSecurity("unlocked")}>
        <Tabs<SettingsTab>
          ariaLabel="站点设置"
          activeKey={activeTab}
          onChange={(key) => { setActiveTab(key); setNotice(null); }}
          items={[
            {
              key: "basic",
              label: "基础信息",
              icon: <FileText aria-hidden="true" className="size-4" />,
              children: (
                <SettingsSurface
                  description="站点名称、内容定位和作者展示信息。"
                  dirty={dirty}
                  onSave={save}
                >
                  <FormField label="站点名称" required>
                    <Input required value={settings.site_title} onChange={(event) => field("site_title", event.target.value)} />
                  </FormField>
                  <FormField label="站点描述">
                    <Textarea rows={3} value={settings.site_description} onChange={(event) => field("site_description", event.target.value)} />
                  </FormField>
                  <FormField label="页脚文本">
                    <Input value={settings.footer_text} onChange={(event) => field("footer_text", event.target.value)} placeholder="Built with care, code, and curiosity." />
                  </FormField>
                  <FormField label="作者名称">
                    <Input value={settings.author_name} onChange={(event) => field("author_name", event.target.value)} />
                  </FormField>
                  <FormField label="作者简介">
                    <Textarea rows={4} value={settings.author_bio} onChange={(event) => field("author_bio", event.target.value)} />
                  </FormField>
                </SettingsSurface>
              ),
            },
            {
              key: "appearance",
              label: "网站图标",
              icon: <ImageIcon aria-hidden="true" className="size-4" />,
              children: (
                <SettingsSurface
                  description="设置浏览器标签页中显示的 Favicon。"
                  dirty={dirty}
                  onSave={save}
                >
                  <FormField label="Favicon 地址" hint="支持站内路径或完整 http(s) URL；真实产品上传支持 SVG、ICO、AVIF、BMP 等常见网络图片格式。">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Input className="min-w-0 flex-1" value={settings.favicon_url} onChange={(event) => field("favicon_url", event.target.value)} placeholder="/favicon.svg" />
                      <Button icon={<Upload />} onClick={uploadFavicon}>上传图标</Button>
                    </div>
                  </FormField>
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-background text-sm font-bold text-primary">GB</div>
                    <div className="min-w-0">
                      <Text size="sm" className="font-medium">Favicon 预览</Text>
                      <code className="mt-1 block truncate text-xs text-muted-foreground">{settings.favicon_url || "未配置"}</code>
                    </div>
                  </div>
                </SettingsSurface>
              ),
            },
            {
              key: "hero",
              label: "首页 Hero",
              icon: <ImageIcon aria-hidden="true" className="size-4" />,
              children: (
                <SettingsSurface
                  description="定制前台首页顶部的 Slogan 标语、描述以及右侧系统图。"
                  dirty={dirty}
                  onSave={save}
                  secondaryAction={<Button size="small" variant="ghost" icon={<RotateCcw />} onClick={resetHeroDefaults}>恢复默认文案</Button>}
                >
                  <FormField label="Hero 主标题" hint="支持多行输入，回车换行将在首页以分行呈现。">
                    <Textarea rows={3} value={settings.hero_title} onChange={(event) => field("hero_title", event.target.value)} />
                  </FormField>
                  <FormField label="Hero 副标题描述" hint="对网站主题、关注领域的补充说明。">
                    <Textarea rows={3} value={settings.hero_description} onChange={(event) => field("hero_description", event.target.value)} />
                  </FormField>
                  <FormField label="右侧插图 URL" hint="可直接输入图片地址，或使用上传按钮模拟媒体库上传。">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Input className="min-w-0 flex-1" value={settings.hero_image_url} onChange={(event) => field("hero_image_url", event.target.value)} placeholder="/editorial-system-map.png" />
                      <Button icon={<Upload />} onClick={uploadHero}>上传插图</Button>
                    </div>
                  </FormField>
                  {settings.hero_image_url ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
                      <div className="min-w-0">
                        <Text size="sm" className="font-medium">Hero 插图</Text>
                        <code className="mt-1 block truncate text-xs text-muted-foreground">{settings.hero_image_url}</code>
                      </div>
                      <Button size="small" variant="ghost" onClick={() => field("hero_image_url", "")}>清空插图</Button>
                    </div>
                  ) : null}
                  <FormField label="右侧插图底部标注" hint="例如 EXPLORE / THINK / SHARE。">
                    <Input value={settings.hero_image_caption} onChange={(event) => field("hero_image_caption", event.target.value)} />
                  </FormField>
                </SettingsSurface>
              ),
            },
            {
              key: "social",
              label: "公开联系方式",
              icon: <Mail aria-hidden="true" className="size-4" />,
              children: (
                <SettingsSurface
                  description="留空时前台不会显示对应入口；这些信息与 GOSSO 登录账号资料相互独立。"
                  dirty={dirty}
                  onSave={save}
                >
                  <FormField label="公开联系邮箱">
                    <Input type="email" value={settings.email} onChange={(event) => field("email", event.target.value)} />
                  </FormField>
                  <FormField label="GitHub">
                    <Input type="url" value={settings.github_url} onChange={(event) => field("github_url", event.target.value)} />
                  </FormField>
                  <FormField label="RSS" hint="站内路径以 / 开头，也可使用完整 http(s) URL。">
                    <Input className="font-mono" value={settings.rss_url} onChange={(event) => field("rss_url", event.target.value)} placeholder="/feed.xml" />
                  </FormField>
                </SettingsSurface>
              ),
            },
            {
              key: "seo",
              label: "SEO",
              icon: <Search aria-hidden="true" className="size-4" />,
              children: (
                <SettingsSurface
                  description="作为文章未单独配置 SEO 信息时的站点级默认值。"
                  dirty={dirty}
                  onSave={save}
                >
                  <FormField label="默认标题">
                    <Input value={settings.default_seo_title} onChange={(event) => field("default_seo_title", event.target.value)} />
                  </FormField>
                  <FormField label="默认描述">
                    <Textarea rows={4} value={settings.default_seo_description} onChange={(event) => field("default_seo_description", event.target.value)} />
                  </FormField>
                </SettingsSurface>
              ),
            },
          ]}
        />
      </SiteSettingsSecurityGate>
    );
  })();

  return (
    <div className="flex flex-col gap-6">
      <FixtureDock
        route="/admin/settings"
        note="真实 Blog Admin 站点设置页面；Fixture 保留五组配置、Sudo/MFA、保存校验与上传状态，但不连接 Blog API 或媒体服务。"
        controls={(
          <div className="flex flex-col gap-3">
            <Segmented<FixtureScenario>
              aria-label="站点设置 Fixture 状态"
              options={scenarioOptions}
              value={scenario}
              onChange={(value) => { setScenario(value); setNotice(null); }}
              block
            />
            <Segmented<SecurityState>
              aria-label="站点设置安全状态"
              options={securityOptions}
              value={security}
              onChange={setSecurity}
              block
            />
          </div>
        )}
      />

      <PageHeader
        title="站点设置"
        description="管理品牌信息、首页标语、社交入口和默认 SEO 元数据。"
      />

      {notice ? (
        <Alert
          type={notice.type}
          showIcon
          title={notice.message}
          closable={{ onClose: () => setNotice(null) }}
        />
      ) : null}

      {content}
    </div>
  );
}