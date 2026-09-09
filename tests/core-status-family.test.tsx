import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Empty, Result } from "../src/core";
import { feedbackDocuments } from "../showcase/demos/core/feedback";
import { statusDocuments } from "../showcase/demos/core/status";

describe("Core Empty and Result families", () => {
  it("keeps Empty and Result on one exact source-backed document owner", () => {
    expect(feedbackDocuments.empty).toBeUndefined();
    expect(feedbackDocuments.result).toBeUndefined();

    expect(statusDocuments.empty.code).toContain('from "@gouno/ui/core"');
    expect(statusDocuments.empty.code).toContain("<Empty");
    expect(statusDocuments.empty.code).toContain("action={");
    expect(statusDocuments.empty.code).toContain("icon={");

    expect(statusDocuments.result.code).toContain('from "@gouno/ui/core"');
    expect(statusDocuments.result.code).toContain('status="success"');
    expect(statusDocuments.result.code).toContain("subTitle=");
    expect(statusDocuments.result.code).toContain("extra={");
    expect(statusDocuments.result.code).toContain("<Text");
  });

  it("renders Empty status semantics with title, description, icon and action", () => {
    render(
      <Empty
        icon={<span aria-hidden="true">icon</span>}
        title="暂无文章"
        description="创建第一篇文章。"
        action={<button type="button">新建文章</button>}
      />,
    );

    const status = screen.getByRole("status");
    expect(status.textContent).toContain("暂无文章");
    expect(status.textContent).toContain("创建第一篇文章。");
    expect(screen.getByRole("button", { name: "新建文章" })).toBeTruthy();
  });

  it("renders Result as a status section with one result-level heading and follow-up content", () => {
    render(
      <Result
        status="success"
        title="发布成功"
        subTitle="文章已经发布。"
        extra={<button type="button">返回列表</button>}
      >
        补充信息
      </Result>,
    );

    const status = screen.getByRole("status");
    expect(status.tagName).toBe("SECTION");
    expect(screen.getByRole("heading", { level: 2, name: "发布成功" })).toBeTruthy();
    expect(status.textContent).toContain("文章已经发布。");
    expect(status.textContent).toContain("补充信息");
    expect(screen.getByRole("button", { name: "返回列表" })).toBeTruthy();
  });

  it("documents every library-defined Empty and Result prop", () => {
    expect(statusDocuments.empty.api?.map((row) => row.name)).toEqual([
      "title",
      "description",
      "action",
      "icon",
    ]);
    expect(statusDocuments.result.api?.map((row) => row.name)).toEqual([
      "status",
      "title",
      "subTitle",
      "extra",
      "children",
    ]);
  });
});
