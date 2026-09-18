import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Heading, Text, Typography } from "../src/core";

afterEach(cleanup);

describe("Core Typography family", () => {
  it("renders Heading semantic level independently from its visual role", () => {
    render(
      <>
        <Heading
          level={1}
          variant="page"
          id="page-title"
          data-context="page"
          className="custom-heading"
        >
          页面主标题
        </Heading>
        <Heading level={2} variant="task">
          嵌套编辑任务
        </Heading>
        <Heading level={1} variant="task">
          独立编辑任务
        </Heading>
      </>,
    );

    const pageTitle = screen.getByRole("heading", {
      level: 1,
      name: "页面主标题",
    });
    expect(pageTitle.tagName).toBe("H1");
    expect(pageTitle.getAttribute("data-slot")).toBe("heading");
    expect(pageTitle.getAttribute("data-context")).toBe("page");
    expect(pageTitle.getAttribute("data-typography-role")).toBe("page");
    expect(pageTitle.className).toContain("type-page-title");
    expect(pageTitle.className).toContain("custom-heading");

    const nestedTask = screen.getByRole("heading", {
      level: 2,
      name: "嵌套编辑任务",
    });
    const standaloneTask = screen.getByRole("heading", {
      level: 1,
      name: "独立编辑任务",
    });
    expect(nestedTask.getAttribute("data-typography-role")).toBe("task");
    expect(standaloneTask.getAttribute("data-typography-role")).toBe("task");
    expect(nestedTask.className).toContain("type-task-title");
    expect(standaloneTask.className).toContain("type-task-title");
  });

  it("keeps level-based visual defaults only as a compatibility fallback", () => {
    render(
      <>
        <Heading level={1}>默认页面标题</Heading>
        <Heading level={2}>默认任务标题</Heading>
        <Heading level={3}>默认区块标题</Heading>
        <Heading level={6}>默认次级标题</Heading>
      </>,
    );

    expect(screen.getByText("默认页面标题").getAttribute("data-typography-role")).toBe("page");
    expect(screen.getByText("默认任务标题").getAttribute("data-typography-role")).toBe("task");
    expect(screen.getByText("默认区块标题").getAttribute("data-typography-role")).toBe("section");
    expect(screen.getByText("默认次级标题").getAttribute("data-typography-role")).toBe("subsection");
  });

  it("lets Text change semantic host without losing semantic body scale, tone or native attributes", () => {
    render(
      <Text
        as="span"
        size="sm"
        tone="muted"
        data-kind="metadata"
        className="custom-text"
      >
        5 分钟阅读
      </Text>,
    );

    const text = screen.getByText("5 分钟阅读");
    expect(text.tagName).toBe("SPAN");
    expect(text.getAttribute("data-slot")).toBe("text");
    expect(text.getAttribute("data-kind")).toBe("metadata");
    expect(text.getAttribute("data-typography-role")).toBe("body-sm");
    expect(text.className).toContain("type-body-sm");
    expect(text.className).toContain("text-muted-foreground");
    expect(text.className).toContain("custom-text");
  });

  it("keeps danger and success tones semantic and independent of the host element", () => {
    render(
      <>
        <Text as="div" tone="danger">
          保存失败
        </Text>
        <Text as="span" tone="success">
          配置已保存
        </Text>
      </>,
    );

    expect(screen.getByText("保存失败").className).toContain("text-destructive");
    expect(screen.getByText("配置已保存").className).toContain("text-success");
  });

  it("keeps Typography only as a compatibility base host", () => {
    render(
      <Typography
        as="small"
        id="primitive-copy"
        data-kind="primitive"
        className="custom-primitive"
      >
        轻量文字
      </Typography>,
    );

    const primitive = screen.getByText("轻量文字");
    expect(primitive.tagName).toBe("SMALL");
    expect(primitive.getAttribute("data-slot")).toBe("typography");
    expect(primitive.getAttribute("data-typography-role")).toBe("body-sm");
    expect(primitive.getAttribute("id")).toBe("primitive-copy");
    expect(primitive.getAttribute("data-kind")).toBe("primitive");
    expect(primitive.className).toContain("type-body-sm");
    expect(primitive.className).toContain("text-foreground");
    expect(primitive.className).toContain("custom-primitive");
  });
});
