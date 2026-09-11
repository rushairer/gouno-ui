import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { Mentions } from "../src/core";
import { componentProgress } from "../showcase/component-progress";
import { mentionsReviewDocuments } from "../showcase/demos/core/data-entry-review-6d4";

afterEach(cleanup);

describe("Mentions 6D4", () => {
  it("keeps controlled text state and exposes textbox/listbox suggestion semantics", () => {
    function Probe() {
      const [value, setValue] = React.useState("");
      return (
        <Mentions
          aria-label="Comment"
          options={["alice", "aben", "bob"]}
          value={value}
          onChange={setValue}
        />
      );
    }

    render(<Probe />);
    const textbox = screen.getByRole("textbox", { name: "Comment" });
    fireEvent.focus(textbox);
    fireEvent.change(textbox, { target: { value: "Hello @a" } });

    expect((textbox as HTMLTextAreaElement).value).toBe("Hello @a");
    expect(textbox.getAttribute("aria-autocomplete")).toBe("list");
    expect(textbox.getAttribute("aria-haspopup")).toBe("listbox");
    const listbox = screen.getByRole("listbox");
    expect(textbox.getAttribute("aria-controls")).toBe(listbox.id);
    expect(screen.getByRole("option", { name: "@alice" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "@aben" })).toBeTruthy();
  });

  it("supports roving suggestion highlight and Enter selection", () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Mentions
        aria-label="Comment"
        options={["alice", "aben"]}
        defaultValue="Hello @a"
        onChange={onChange}
        onSelect={onSelect}
      />,
    );

    const textbox = screen.getByRole("textbox", { name: "Comment" });
    fireEvent.focus(textbox);
    const options = screen.getAllByRole("option");
    expect(textbox.getAttribute("aria-activedescendant")).toBe(options[0]?.id);

    fireEvent.keyDown(textbox, { key: "ArrowDown" });
    expect(textbox.getAttribute("aria-activedescendant")).toBe(options[1]?.id);
    fireEvent.keyDown(textbox, { key: "Enter" });

    expect((textbox as HTMLTextAreaElement).value).toBe("Hello @aben ");
    expect(onChange).toHaveBeenLastCalledWith("Hello @aben ");
    expect(onSelect).toHaveBeenCalledWith("aben");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("escapes special-character prefixes instead of treating them as regex syntax", () => {
    render(
      <Mentions
        aria-label="Recipients"
        prefix="+"
        options={["alpha", "beta"]}
        defaultValue="Notify +al"
      />,
    );

    const textbox = screen.getByRole("textbox", { name: "Recipients" });
    fireEvent.focus(textbox);
    const option = screen.getByRole("option", { name: "+alpha" });
    fireEvent.mouseDown(option);
    expect((textbox as HTMLTextAreaElement).value).toBe("Notify +alpha ");
  });

  it("forwards the real textarea ref and reuses Textarea size/status contracts", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(
      <Mentions
        ref={ref}
        aria-label="Comment"
        options={["alice"]}
        size="large"
        status="error"
        data-testid="mentions-input"
      />,
    );

    const textbox = screen.getByTestId("mentions-input");
    expect(ref.current).toBe(textbox);
    expect(textbox.tagName).toBe("TEXTAREA");
    expect(textbox.getAttribute("data-slot")).toBe("mentions-input");
    expect(textbox.getAttribute("data-size")).toBe("large");
    expect(textbox.getAttribute("data-status")).toBe("error");
    expect(textbox.getAttribute("aria-invalid")).toBe("true");
  });

  it("composes consumer keyboard handlers before internal selection behavior", () => {
    const onSelect = vi.fn();
    render(
      <Mentions
        aria-label="Comment"
        options={["alice"]}
        defaultValue="@a"
        onSelect={onSelect}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );

    const textbox = screen.getByRole("textbox", { name: "Comment" });
    fireEvent.focus(textbox);
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.keyDown(textbox, { key: "Enter" });

    expect(onSelect).not.toHaveBeenCalled();
    expect((textbox as HTMLTextAreaElement).value).toBe("@a");
  });

  it("does not manufacture a suggestion popup without an active mention token", () => {
    render(
      <Mentions aria-label="Comment" options={["alice"]} defaultValue="plain text" />,
    );
    fireEvent.focus(screen.getByRole("textbox", { name: "Comment" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("keeps Preview/Code executable and marks the reviewed family complete", () => {
    const document = mentionsReviewDocuments.mentions;
    expect(document.code).toContain("<Mentions");
    expect(document.code).toContain("onSelect");
    expect(document.code).toContain('prefix="+"');
    expect(componentProgress("core-mentions", 65)).toBe(100);
  });
});
