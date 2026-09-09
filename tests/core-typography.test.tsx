import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Heading, Text, Typography } from "../src/core";

afterEach(cleanup);

describe("Core Typography family", () => {
  it("renders Heading with the requested native heading level and forwards HTML props", () => {
    render(
      <>
        <Heading
          level={1}
          id="page-title"
          data-context="page"
          className="custom-heading"
        >
          页面主标题
        </Heading>
        <Heading level={6}>细节标题</Heading>
      </>,
    );

    const pageTitle = screen.getByRole("heading", {
      level: 1,
      name: "页面主标题",
    });
    expect(pageTitle.tagName).toBe("H1");
    expect(pageTitle.getAttribute("data-slot")).toBe("heading");
    expect(pageTitle.getAttribute("data-context")).toBe("page");
    expect(pageTitle.className).toContain("text-3xl");
    expect(pageTitle.className).toContain("custom-heading");

    const detail = screen.getByRole("heading", {
      level: 6,
      name: "细节标题",
    });
    expect(detail.tagName).toBe("H6");
    expect(detail.className).toContain("text-lg");
  });

  it("lets Text change semantic host without losing size, tone or native attributes", () => {
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
    expect(text.className).toContain("text-sm");
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

  it("keeps Typography as a light base host with forwarded native props", () => {
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
    expect(primitive.getAttribute("id")).toBe("primitive-copy");
    expect(primitive.getAttribute("data-kind")).toBe("primitive");
    expect(primitive.className).toContain("text-sm");
    expect(primitive.className).toContain("text-foreground");
    expect(primitive.className).toContain("custom-primitive");
  });
});
