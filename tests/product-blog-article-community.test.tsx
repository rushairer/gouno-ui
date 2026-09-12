import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BlogArticleCommunity,
  type BlogArticleCommunityMode,
} from "../showcase/demos/products/blog/article-community";
import { ThemeProvider } from "../src/theme";

afterEach(cleanup);

function renderCommunity(mode: BlogArticleCommunityMode = "signed-in") {
  return render(
    <ThemeProvider brand="blog" storageKey={`blog-community-${mode}-theme`}>
      <BlogArticleCommunity mode={mode} />
    </ThemeProvider>,
  );
}

describe("Blog public ArticleDetail community migration", () => {
  it("preserves an aria-pressed like state with reversible optimistic count", () => {
    renderCommunity();

    const initial = screen.getByRole("button", { name: "96 likes" });
    expect(initial.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(initial);
    const liked = screen.getByRole("button", { name: "97 likes" });
    expect(liked.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(liked);
    expect(screen.getByRole("button", { name: "96 likes" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("keeps replies one level deep and publishes a reply under the selected root comment", () => {
    renderCommunity();

    const abenCard = screen.getByText("Aben").closest('[data-slot="card"]');
    expect(abenCard).toBeTruthy();
    fireEvent.click(within(abenCard as HTMLElement).getByRole("button", { name: "回复" }));

    expect(screen.getByText("正在回复 Aben")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("回复 Aben…"), {
      target: { value: "这个边界拆分对移动端同样适用。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "发布回复" }));

    expect(screen.getByText("已回复 Aben。")).toBeTruthy();
    expect(screen.getByText("这个边界拆分对移动端同样适用。")).toBeTruthy();

    const guestReplyCard = screen.getByText("小桔").closest('[data-slot="card"]');
    expect(guestReplyCard).toBeTruthy();
    expect(within(guestReplyCard as HTMLElement).queryByRole("button", { name: "回复" })).toBeNull();
    expect(within(guestReplyCard as HTMLElement).getByRole("button", { name: "举报" })).toBeTruthy();
  });

  it("validates guest identity and comment content before publishing", () => {
    renderCommunity("guest");

    fireEvent.click(screen.getByRole("button", { name: "发布评论" }));
    expect(screen.getByText("请输入昵称。")).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText("怎么称呼你"), { target: { value: "访客甲" } });
    fireEvent.click(screen.getByRole("button", { name: "发布评论" }));
    expect(screen.getByText("请输入评论内容。")).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText("写下你的想法…"), {
      target: { value: "公开阅读页的交互边界很清楚。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "发布评论" }));

    expect(screen.getByText("评论已发布。")).toBeTruthy();
    expect(screen.getByText("访客甲")).toBeTruthy();
    expect(screen.getByText("公开阅读页的交互边界很清楚。")).toBeTruthy();
  });

  it("allows an initially empty discussion to gain its first local comment", () => {
    renderCommunity("empty");

    expect(screen.getByText("还没有评论")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("写下你的想法…"), {
      target: { value: "第一条 Fixture 评论" },
    });
    fireEvent.click(screen.getByRole("button", { name: "发布评论" }));

    expect(screen.queryByText("还没有评论")).toBeNull();
    expect(screen.getByText("第一条 Fixture 评论")).toBeTruthy();
    expect(screen.getByText("Paw")).toBeTruthy();
  });

  it("keeps reporting as a product-owned Modal lifecycle with required reason", () => {
    renderCommunity();

    const abenCard = screen.getByText("Aben").closest('[data-slot="card"]');
    fireEvent.click(within(abenCard as HTMLElement).getByRole("button", { name: "举报" }));

    expect(screen.getByRole("dialog", { name: "举报评论" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "提交举报" }));
    expect(screen.getByText("请填写举报原因。")).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText("请说明这条评论存在的问题"), {
      target: { value: "包含与文章无关的推广内容。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "提交举报" }));

    expect(screen.queryByRole("dialog", { name: "举报评论" })).toBeNull();
    expect(screen.getByText("已提交对 Aben 的举报。")).toBeTruthy();
  });

  it("preserves a non-fatal community error without replacing the reading page", () => {
    renderCommunity("error");

    expect(screen.getByText("评论交互暂时不可用")).toBeTruthy();
    expect(screen.getByText("Aben")).toBeTruthy();
    expect(screen.getByRole("button", { name: "96 likes" })).toBeTruthy();
  });

  it("keeps community orchestration product-local without a new Pattern or real service call", () => {
    const source = readFileSync(
      resolve(process.cwd(), "showcase/demos/products/blog/article-community.tsx"),
      "utf8",
    );

    expect(source).toContain('from "../../../../src/core"');
    expect(source).not.toContain('src/patterns');
    expect(source).not.toContain('src/gouno');
    expect(source).not.toMatch(/\b(?:CommentThread|CommentComposer|LikeButton|ReportDialog|CommunityPanel)\b/);
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|XMLHttpRequest|WebSocket/);
    expect(source).not.toMatch(/shadow-(?:md|lg|xl|2xl|raised|overlay|modal)/);
  });
});
