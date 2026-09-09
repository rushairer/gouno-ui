import { useState } from "react";
import { ArrowLeft, FileText, Home, Search } from "lucide-react";
import { Alert, Button, Card, Result } from "../../../src/core";
import { FixtureDock } from "../../components/fixture-dock";
import { BlogPublicShellFixture } from "./blog-public-shell";

export function BlogNotFoundDemo() {
  const [notice, setNotice] = useState("");
  const navigate = (target: string) => setNotice(`将进入 ${target}（Showcase 模拟）。`);

  return (
    <div className="relative">
      <FixtureDock
        route="/*"
        note="公开站点 NotFound 的静态迁移：未知公共路径进入 PublicShell 下的结果页；`/:slug` 仍优先属于 CustomPage 路由族，404 不创建第二套文档页语法。"
      />
      <BlogPublicShellFixture currentPath="/missing-page" onNavigate={navigate}>
        {notice ? <Alert className="mb-6" type="info" description={notice} showIcon /> : null}

        <Card variant="subtle" className="mx-auto max-w-[760px]">
          <Result
            status="info"
            title="页面未找到"
            subTitle="你访问的地址不存在、已经移动，或者当前内容不再公开。"
            extra={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="solid" color="primary" icon={<Home />} onClick={() => navigate("/")}>返回首页</Button>
                <Button variant="outline" icon={<FileText />} onClick={() => navigate("/articles")}>浏览文章</Button>
                <Button variant="text" icon={<Search />} onClick={() => navigate("/search")}>搜索内容</Button>
              </div>
            }
          />
        </Card>

        <div className="mx-auto mt-6 flex max-w-[760px] justify-center">
          <Button variant="text" icon={<ArrowLeft />} onClick={() => setNotice("将返回浏览器上一页（Showcase 模拟）。")}>返回上一页</Button>
        </div>
      </BlogPublicShellFixture>
    </div>
  );
}
