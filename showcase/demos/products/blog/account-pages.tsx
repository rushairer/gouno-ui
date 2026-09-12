import { useMemo, useState } from "react";
import { Bell, CheckCheck, ExternalLink, MessageCircleReply, Settings2, UserRound } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Input,
  Segmented,
  Skeleton,
  Textarea,
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import { BlogPublicShellFixture } from "./public-shell";

type NotificationFilter = "all" | "unread";
type NotificationsScenario = "data" | "empty" | "error";
type SettingsScenario = "data" | "save-error";

type AccountNotification = {
  id: string;
  type: "reply" | "mention" | "system";
  title: string;
  detail: string;
  createdAt: string;
  destination: string;
  read: boolean;
};

const notificationFilterOptions = [
  { value: "all", label: "全部" },
  { value: "unread", label: "未读" },
] as const;

const notificationScenarioOptions = [
  { value: "data", label: "正常" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "加载失败" },
] as const;

const settingsScenarioOptions = [
  { value: "data", label: "正常" },
  { value: "save-error", label: "保存失败" },
] as const;

const initialNotifications: AccountNotification[] = [
  {
    id: "notification-1",
    type: "reply",
    title: "Aben 回复了你的评论",
    detail: "“BFF 边界这一段能不能再补一个移动端的例子？”",
    createdAt: "10 分钟前",
    destination: "/articles/oauth2-bff-product-experience#comment-comment-1",
    read: false,
  },
  {
    id: "notification-2",
    type: "mention",
    title: "你在一条讨论中被提及",
    detail: "小桔：@Paw 这个 Anchor 的原生 hash 设计和文章里说的一致。",
    createdAt: "2 小时前",
    destination: "/articles/gouno-ui-product-driven#article-community",
    read: false,
  },
  {
    id: "notification-3",
    type: "system",
    title: "站点通知偏好已更新",
    detail: "评论回复和站内提及通知保持开启。",
    createdAt: "昨天",
    destination: "/account/settings",
    read: true,
  },
];

function notificationIcon(type: AccountNotification["type"]) {
  if (type === "reply") return <MessageCircleReply aria-hidden="true" className="size-4" />;
  if (type === "mention") return <UserRound aria-hidden="true" className="size-4" />;
  return <Settings2 aria-hidden="true" className="size-4" />;
}

function AccountPageSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="mx-auto w-full max-w-[900px] space-y-5">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-4/5" />
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="sm">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </Card>
      ))}
    </div>
  );
}

export function BlogAccountNotificationsDemo({
  initialScenario = "data",
}: {
  initialScenario?: NotificationsScenario;
}) {
  const [scenario, setScenario] = useState<NotificationsScenario>(initialScenario);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(initialNotifications.filter((item) => item.read).map((item) => item.id)),
  );
  const [notice, setNotice] = useState("");

  const notifications = useMemo(() => {
    if (scenario === "empty") return [];
    const withReadState = initialNotifications.map((item) => ({ ...item, read: readIds.has(item.id) }));
    return filter === "unread" ? withReadState.filter((item) => !item.read) : withReadState;
  }, [filter, readIds, scenario]);

  const unreadCount = initialNotifications.filter((item) => !readIds.has(item.id)).length;
  const markRead = (id: string) => setReadIds((current) => new Set(current).add(id));
  const markAllRead = () => setReadIds(new Set(initialNotifications.map((item) => item.id)));
  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/account/notifications"
        note="账户通知页的静态迁移：只模拟 Blog 站内事件队列和已读状态，不请求真实账户/通知服务；兼容 /notifications 只是路由重定向，不单独建 Showcase 页面。"
        controls={
          <Segmented<NotificationsScenario>
            aria-label="Account Notifications Fixture 状态"
            options={notificationScenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath="/account/notifications" onNavigate={navigate}>
        {notice ? <Alert className="mb-6" type="info" description={notice} showIcon /> : null}

        <div className="mx-auto w-full max-w-[900px] space-y-6">
          <PageHeader
            title="通知"
            description="查看评论回复、提及和站点事件。已读状态只属于当前 Blog 账户。"
            actions={
              <Button
                variant="outline"
                size="small"
                icon={<CheckCheck />}
                disabled={unreadCount === 0}
                onClick={markAllRead}
              >
                全部标为已读
              </Button>
            }
          />

          {scenario === "error" ? (
            <Alert
              type="error"
              title="通知加载失败"
              description="站内通知服务暂时不可用；公开阅读和账户身份不受影响。"
              action={<Button size="small" onClick={() => setScenario("data")}>重试</Button>}
              showIcon
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <Segmented<NotificationFilter>
              aria-label="通知筛选"
              options={notificationFilterOptions}
              value={filter}
              onChange={setFilter}
            />
            <span className="text-sm text-muted-foreground">{unreadCount} 条未读</span>
          </div>

          {scenario === "error" ? null : notifications.length === 0 ? (
            <Empty
              title={filter === "unread" ? "没有未读通知" : "还没有通知"}
              description={filter === "unread" ? "新的回复或提及出现后会显示在这里。" : "站内事件会按时间出现在这里。"}
            />
          ) : (
            <div className="space-y-3" aria-label="通知列表">
              {notifications.map((item) => (
                <Card key={item.id} padding="sm" className={item.read ? "gap-3" : "gap-3 border-primary/30 bg-primary/[0.025]"}>
                  <div className="flex gap-3">
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground">
                      {notificationIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <strong className="min-w-0 flex-1 text-sm text-foreground">{item.title}</strong>
                        {!item.read ? <Badge status="processing" text="未读" /> : null}
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.createdAt}</span>
                        <Button variant="text" size="small" icon={<ExternalLink />} onClick={() => {
                          markRead(item.id);
                          navigate(item.destination);
                        }}>
                          查看
                        </Button>
                        {!item.read ? (
                          <Button variant="text" size="small" onClick={() => markRead(item.id)}>标为已读</Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}

type PreferenceKey = "reply" | "mention" | "system";

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${checked ? "border-primary bg-primary" : "bg-muted"}`}
        onClick={() => onChange(!checked)}
      >
        <span className={`absolute top-0.5 size-4 rounded-full bg-background transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

export function BlogAccountSettingsDemo({
  initialScenario = "data",
}: {
  initialScenario?: SettingsScenario;
}) {
  const [scenario, setScenario] = useState<SettingsScenario>(initialScenario);
  const [displayName, setDisplayName] = useState("Paw");
  const [bio, setBio] = useState("记录真实工程问题、产品取舍与可复现结果。");
  const [savedDisplayName, setSavedDisplayName] = useState("Paw");
  const [savedBio, setSavedBio] = useState("记录真实工程问题、产品取舍与可复现结果。");
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    reply: true,
    mention: true,
    system: false,
  });
  const [savedPreferences, setSavedPreferences] = useState(preferences);
  const [notice, setNotice] = useState("");

  const dirty = displayName !== savedDisplayName || bio !== savedBio ||
    (Object.keys(preferences) as PreferenceKey[]).some((key) => preferences[key] !== savedPreferences[key]);

  const save = () => {
    if (!displayName.trim()) return;
    if (scenario === "save-error") {
      setNotice("账户偏好保存失败（Showcase 模拟），当前编辑内容仍保留。 ");
      return;
    }
    setSavedDisplayName(displayName);
    setSavedBio(bio);
    setSavedPreferences(preferences);
    setNotice("Blog 账户偏好已保存。 ");
  };

  const updatePreference = (key: PreferenceKey, checked: boolean) => {
    setPreferences((current) => ({ ...current, [key]: checked }));
    setNotice("");
  };

  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/account/settings"
        note="Blog-local 账户设置静态迁移：只管理公开站点昵称、简介和站内通知偏好。密码、MFA、Passkey 与身份资料继续归 GOSSO；兼容 /settings 只是路由重定向。"
        controls={
          <Segmented<SettingsScenario>
            aria-label="Account Settings Fixture 状态"
            options={settingsScenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture currentPath="/account/settings" onNavigate={navigate}>
        <div className="mx-auto w-full max-w-[900px] space-y-6">
          <PageHeader
            title="账户设置"
            description="管理这个 Blog 的公开资料与站内通知偏好。身份安全设置仍由 GOSSO 统一管理。"
            actions={<Button variant="outline" size="small" icon={<Bell />} onClick={() => navigate("/account/notifications")}>通知中心</Button>}
          />

          {notice ? (
            <Alert
              type={notice.includes("失败") ? "error" : "success"}
              description={notice.trim()}
              showIcon
            />
          ) : null}

          <Card as="section" aria-labelledby="profile-settings-title">
            <div>
              <h2 id="profile-settings-title" className="text-base font-semibold">公开资料</h2>
              <p className="mt-1 text-sm text-muted-foreground">这些内容只影响 Blog 展示，不修改 GOSSO 身份凭据。</p>
            </div>
            <div className="grid gap-4">
              <Field label="显示名称" required error={!displayName.trim() ? "显示名称不能为空。" : undefined}>
                <Input value={displayName} onChange={(event) => {
                  setDisplayName(event.target.value);
                  setNotice("");
                }} />
              </Field>
              <Field label="个人简介" hint="在公开内容和讨论身份旁展示。">
                <Textarea rows={4} value={bio} onChange={(event) => {
                  setBio(event.target.value);
                  setNotice("");
                }} />
              </Field>
            </div>
          </Card>

          <Card as="section" aria-labelledby="identity-boundary-title" variant="subtle">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 id="identity-boundary-title" className="text-base font-semibold">身份与安全</h2>
                <p className="mt-1 text-sm text-muted-foreground">登录邮箱、密码、MFA、Passkey 与会话由 GOSSO 账户中心管理；Blog 不承载身份表单。</p>
                <div className="mt-3 text-sm"><span className="text-muted-foreground">当前身份：</span><strong>paw@example.test</strong></div>
              </div>
              <Button variant="outline" icon={<ExternalLink />} onClick={() => navigate("https://sso.example.test/account-settings")}>前往 GOSSO 账户中心</Button>
            </div>
          </Card>

          <Card as="section" aria-labelledby="notification-preferences-title">
            <div>
              <h2 id="notification-preferences-title" className="text-base font-semibold">站内通知偏好</h2>
              <p className="mt-1 text-sm text-muted-foreground">只控制 Blog 内部通知，不改变身份系统安全通知。</p>
            </div>
            <div>
              <PreferenceToggle label="评论回复" description="有人回复你的文章评论时通知。" checked={preferences.reply} onChange={(checked) => updatePreference("reply", checked)} />
              <PreferenceToggle label="讨论提及" description="有人在公开讨论中提及你时通知。" checked={preferences.mention} onChange={(checked) => updatePreference("mention", checked)} />
              <PreferenceToggle label="站点动态" description="接收与内容站点相关的低频产品更新。" checked={preferences.system} onChange={(checked) => updatePreference("system", checked)} />
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <span className="text-sm text-muted-foreground">{dirty ? "有未保存的 Blog-local 修改" : "所有 Blog-local 设置已保存"}</span>
            <Button variant="solid" color="primary" disabled={!dirty || !displayName.trim()} onClick={save}>保存设置</Button>
          </div>
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}
