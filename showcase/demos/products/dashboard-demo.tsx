import { useState } from "react";
import { ArrowUpRight, BarChart3, CheckCircle2, Clock3, FileText, Plus, Settings, Shield } from "lucide-react";
import {
  ActionGroup, Button, Card, CardContent, CardHeader, DashboardTemplate, Tag,
  Panel, PanelHeader,
} from "../../../src";
import { showcaseRecords as records } from "../../fixtures";
import { StateControls, StatePanel, type DemoState } from "../../scenarios";

export function DashboardDemo({ gosso = false }: { gosso?: boolean }) {
  const [state, setState] = useState<DemoState>("ready");
  return (
    <DashboardTemplate
      title={gosso ? "系统状态" : "早上好，Gouno"}
      description={
        gosso
          ? "服务健康度、运行版本和最近系统事件。"
          : "这里是你的内容工作台，查看今天的发布进度和需要关注的事项。"
      }
      actions={
        <ActionGroup>
          <Button variant="secondary">查看站点</Button>
          <Button variant="primary" icon={<Plus />}>
            新建文章
          </Button>
        </ActionGroup>
      }
      stateControls={<StateControls state={state} setState={setState} />}
    >
      {state !== "ready" ? (
        <Panel>
          <StatePanel state={state} onRetry={() => setState("ready")} />
        </Panel>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ...(gosso
                ? [
                    ["运行服务", "12", "全部正常", "当前集群", "up"],
                    ["活跃用户", "1,284", "+8.2%", "较上周", "up"],
                    ["客户端", "36", "2", "待审核", "warn"],
                    ["审计事件", "248", "过去 24h", "最近活动", "neutral"],
                  ]
                : [
                    ["本月阅读", "28.4k", "+18.6%", "较上月", "up"],
                    ["已发布", "126", "+24", "本月新增", "up"],
                    ["待处理", "18", "4", "需要关注", "warn"],
                    ["草稿", "32", "6", "最近 7 天", "neutral"],
                  ]),
            ].map(([label, value, change, hint, tone]) => (
              <Card key={label} className="relative overflow-hidden">
                <div className="absolute right-5 top-5 rounded-full bg-accent p-2 text-primary">
                  <BarChart3 className="size-4" />
                </div>
                <CardHeader title={label} />
                <CardContent>
                  <div className="mt-4 text-3xl font-semibold tracking-tight">
                    {value}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span
                      className={
                        tone === "warn"
                          ? "text-warning"
                          : tone === "neutral"
                            ? "text-muted-foreground"
                            : "text-success"
                      }
                    >
                      {change}
                    </span>
                    {tone === "up" ? (
                      <ArrowUpRight className="size-4 text-success" />
                    ) : null}
                    <span className="text-muted-foreground">{hint}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Panel>
                <PanelHeader
                title={gosso ? "系统健康度" : "内容表现"}
                description={gosso ? "服务、数据库和队列的实时状态。" : "过去 7 天的阅读趋势。"}
                actions={
                  <Button size="sm" variant="ghost">
                  {gosso ? "查看详情" : "查看分析"}
                  </Button>
                }
              />
              <div className="flex h-48 items-end gap-2 rounded-lg bg-muted/40 px-4 pb-4 pt-6 sm:gap-4">
                {[35, 52, 44, 70, 58, 82, 96].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
                    >
                      <div
                        className="h-full rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-center text-[11px] text-muted-foreground">
                        {["周一", "周二", "周三", "周四", "周五", "周六", "周日"][index]}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  阅读量
                </span>
                <span className="ml-auto font-medium text-foreground">
                  +18.6% 较上周
                </span>
              </div>
            </Panel>
            <Panel>
              <PanelHeader title={gosso ? "管理入口" : "快捷操作"} description={gosso ? "常用系统管理操作" : "常用工作流"} />
              <div className="flex flex-col gap-2">
                <Button
                  className="justify-start"
                  variant="ghost"
                  icon={<Plus />}
                >
                  {gosso ? "管理用户" : "创建新文章"}
                </Button>
                <Button
                  className="justify-start"
                  variant="ghost"
                  icon={<FileText />}
                >
                  {gosso ? "管理客户端" : "管理页面"}
                </Button>
                <Button
                  className="justify-start"
                  variant="ghost"
                  icon={<Settings />}
                >
                  {gosso ? "站点设置" : "站点设置"}
                </Button>
                <Button
                  className="justify-start"
                  variant="ghost"
                  icon={<Shield />}
                >
                  {gosso ? "查看审计日志" : "查看审核队列"}
                </Button>
              </div>
            </Panel>
          </div>
          <Panel>
            <PanelHeader
              title="最近活动"
              description="按时间倒序排列的内容和系统事件。"
              action={
                <Button size="sm" variant="ghost">
                  查看全部
                </Button>
              }
            />
            <div className="grid gap-1 md:grid-cols-2">
              {records.map(([name, status, type, date], index) => (
                <div
                  key={name}
                  className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-0.5 rounded-full bg-success-subtle p-1.5 text-success">
                    {index === 2 ? (
                      <Clock3 className="size-3.5" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {type} · {date}
                    </div>
                  </div>
                  <Tag tone={status === "已发布" ? "success" : status === "草稿" ? "neutral" : "warning"}>
                    {status}
                  </Tag>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </DashboardTemplate>
  );
}
