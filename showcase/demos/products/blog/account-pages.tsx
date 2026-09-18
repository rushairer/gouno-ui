import { useMemo, useState } from "react";
import {
  CheckCheck,
  ExternalLink,
  MessageCircleReply,
  Settings2,
  Shield,
  UserRound,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Empty,
  Heading,
  Segmented,
} from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";
import { FixtureDock } from "../../../components/fixture-dock";
import { BlogPublicShellFixture } from "./public-shell";
import { BlogNotificationsLoading } from "./loading";

type NotificationFilter = "all" | "unread";
type NotificationsScenario =
  | "data"
  | "loading"
  | "empty"
  | "error"
  | "mutation-error";
type SettingsScenario = "available" | "missing-admin-url";

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
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "加载失败" },
  { value: "mutation-error", label: "操作失败" },
] as const;

const settingsScenarioOptions = [
  { value: "available", label: "正常" },
  { value: "missing-admin-url", label: "缺少身份中心地址" },
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
    title: "站点通知已送达",
    detail: "这是一条 Blog 站内事件通知。",
    createdAt: "昨天",
    destination: "/account/settings",
    read: true,
  },
];

function notificationIcon(type: AccountNotification["type"]) {
  if (type === "reply")
    return <MessageCircleReply aria-hidden="true" className="size-4" />;
  if (type === "mention")
    return <UserRound aria-hidden="true" className="size-4" />;
  return <Settings2 aria-hidden="true" className="size-4" />;
}

export function BlogAccountNotificationsDemo({
  initialScenario = "data",
}: {
  initialScenario?: NotificationsScenario;
}) {
  const [scenario, setScenario] =
    useState<NotificationsScenario>(initialScenario);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    () =>
      new Set(
        initialNotifications.filter((item) => item.read).map((item) => item.id),
      ),
  );
  const [navigationNotice, setNavigationNotice] = useState("");
  const [mutationNotice, setMutationNotice] = useState("");

  const notifications = useMemo(() => {
    if (scenario === "empty") return [];
    const withReadState = initialNotifications.map((item) => ({
      ...item,
      read: readIds.has(item.id),
    }));
    return filter === "unread"
      ? withReadState.filter((item) => !item.read)
      : withReadState;
  }, [filter, readIds, scenario]);

  const unreadCount = initialNotifications.filter(
    (item) => !readIds.has(item.id),
  ).length;

  const markRead = (id: string) => {
    if (scenario === "mutation-error") {
      setMutationNotice("标记已读失败，通知列表保持可用，请稍后重试。");
      return;
    }
    setReadIds((current) => new Set(current).add(id));
    setMutationNotice("");
  };

  const markAllRead = () => {
    if (scenario === "mutation-error") {
      setMutationNotice("全部标记已读失败，已有通知状态保持不变。");
      return;
    }
    setReadIds(new Set(initialNotifications.map((item) => item.id)));
    setMutationNotice("");
  };

  const navigate = (target: string) =>
    setNavigationNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/account/notifications"
        note="账户通知页只模拟 Blog 站内事件队列和已读状态。加载错误属于持久页面状态，标记已读失败属于瞬时操作反馈；兼容 /notifications 只是路由重定向。"
        controls={
          <Segmented<NotificationsScenario>
            aria-label="Account Notifications Fixture 状态"
            options={notificationScenarioOptions}
            value={scenario}
            onChange={(value) => {
              setScenario(value);
              setMutationNotice("");
              setNavigationNotice("");
            }}
          />
        }
      />
      <BlogPublicShellFixture
        currentPath="/account/notifications"
        onNavigate={navigate}
      >
        {navigationNotice ? (
          <Alert
            className="mb-6"
            type="info"
            description={navigationNotice}
            showIcon
          />
        ) : null}

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

          {scenario === "loading" ? (
            <BlogNotificationsLoading />
          ) : scenario === "error" ? (
            <Alert
              type="error"
              title="通知加载失败"
              description="站内通知服务暂时不可用；公开阅读和账户身份不受影响。"
              action={
                <Button size="small" onClick={() => setScenario("data")}>
                  重试
                </Button>
              }
              showIcon
            />
          ) : null}

          {mutationNotice ? (
            <Alert
              type="error"
              role="alert"
              title="通知操作失败"
              description={mutationNotice}
              showIcon
            />
          ) : null}

          {scenario !== "loading" && scenario !== "error" ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <Segmented<NotificationFilter>
                aria-label="通知筛选"
                options={notificationFilterOptions}
                value={filter}
                onChange={setFilter}
              />
              <span className="type-body-sm text-muted-foreground">
                {unreadCount} 条未读
              </span>
            </div>
          ) : null}

          {scenario === "loading" || scenario === "error" ? null : notifications.length ===
            0 ? (
            <Empty
              title={filter === "unread" ? "没有未读通知" : "还没有通知"}
              description={
                filter === "unread"
                  ? "新的回复或提及出现后会显示在这里。"
                  : "站内事件会按时间出现在这里。"
              }
            />
          ) : (
            <div className="space-y-3" aria-label="通知列表">
              {notifications.map((item) => (
                <Card
                  key={item.id}
                  padding="sm"
                  className={
                    item.read
                      ? "gap-3"
                      : "gap-3 border-primary/30 bg-primary/[0.025]"
                  }
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground">
                      {notificationIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <strong className="min-w-0 flex-1 type-body-sm type-weight-semibold text-foreground">
                          {item.title}
                        </strong>
                        {!item.read ? (
                          <Badge status="processing" text="未读" />
                        ) : null}
                      </div>
                      <p className="type-reading-summary text-muted-foreground">
                        {item.detail}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 type-caption text-muted-foreground">
                        <span>{item.createdAt}</span>
                        <Button
                          variant="text"
                          size="small"
                          icon={<ExternalLink />}
                          onClick={() => {
                            markRead(item.id);
                            if (scenario !== "mutation-error") {
                              navigate(item.destination);
                            }
                          }}
                        >
                          查看
                        </Button>
                        {!item.read ? (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => markRead(item.id)}
                          >
                            标为已读
                          </Button>
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

export function BlogAccountSettingsDemo({
  initialScenario = "available",
}: {
  initialScenario?: SettingsScenario;
}) {
  const [scenario, setScenario] = useState<SettingsScenario>(initialScenario);
  const [notice, setNotice] = useState("");
  const adminURL =
    scenario === "available" ? "https://sso.example.test/account-settings" : "";
  const navigate = (target: string) =>
    setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/account/settings"
        note="Account Settings 以当前 Blog Product 为事实来源：Blog 当前没有独立 profile/preferences 写入 API，因此 Showcase 不虚构昵称、简介或通知偏好表单。密码、MFA、Passkey 与身份会话始终归 GOSSO。兼容 /settings 只是路由重定向。"
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
      <BlogPublicShellFixture
        currentPath="/account/settings"
        onNavigate={navigate}
      >
        <div className="mx-auto w-full max-w-[900px] space-y-6">
          <PageHeader
            title="账户设置"
            description="Blog 只展示当前账户边界；身份安全设置继续由 GOSSO 统一管理。"
          />

          {notice ? (
            <Alert type="info" description={notice} showIcon />
          ) : null}

          <Card as="section" aria-labelledby="identity-boundary-title">
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Heading
                  id="identity-boundary-title"
                  level={2}
                  variant="subsection"
                  className="flex items-center gap-2"
                >
                  <Shield size={18} aria-hidden="true" />
                  账户安全由 GOSSO Admin 管理
                </Heading>
                <p className="type-reading-sm text-muted-foreground">
                  Blog 仅维护博客侧资料、成员关系和权限，不直接提供密码、邮箱、MFA、Passkey
                  或身份会话管理。需要修改登录安全设置时，请前往身份管理中心完成近期强认证。
                </p>
                <div className="type-body-sm">
                  <span className="text-muted-foreground">当前身份：</span>
                  <strong>paw@example.test</strong>
                </div>
                {adminURL ? (
                  <Button
                    variant="solid"
                    color="primary"
                    icon={<ExternalLink />}
                    iconPlacement="end"
                    onClick={() => navigate(adminURL)}
                  >
                    打开 GOSSO Admin
                  </Button>
                ) : (
                  <Alert type="error" showIcon>
                    当前会话未提供身份管理中心地址，请联系管理员配置 GOSSO Admin URL。
                  </Alert>
                )}
              </div>
            </div>
          </Card>
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}
