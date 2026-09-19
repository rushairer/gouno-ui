import { afterEach, describe, expect, it } from "vitest";
import * as React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Badge, CheckableTag, Drawer, InputOTP, Layout, LayoutContent, LayoutHeader, MessageProvider, Modal, Popconfirm, Space, Splitter, useMessage } from "../src/core";

afterEach(cleanup);

describe("Core layout and feedback", () => {
  it("renders layout regions and splitter semantics",()=>{render(<><Layout><LayoutHeader>Header</LayoutHeader><LayoutContent>Content</LayoutContent></Layout><Splitter first="A" second="B"/></>);expect(screen.getByText("Header")).toBeTruthy();expect(screen.getByRole("separator")).toBeTruthy();});
  it("stretches vertical children by default like Ant Design", () => {
    const { container } = render(<Space orientation="vertical"><Badge count={5}>Inbox</Badge><CheckableTag defaultChecked>TypeScript</CheckableTag></Space>);
    expect(container.firstElementChild?.className).not.toContain("items-start");
    expect(container.firstElementChild?.className).not.toContain("items-end");
  });
  it("allows vertical Space children to stretch explicitly", () => {
    const { container } = render(<Space orientation="vertical" align="stretch"><button>Full width</button></Space>);
    expect(container.firstElementChild?.className).toContain("items-stretch");
  });
  it("supports block containers and split content", () => {
    const { container } = render(<Space orientation="vertical" block split={<span>|</span>}><button>A</button><button>B</button></Space>);
    const root = container.firstElementChild!;
    expect(root.getAttribute("data-slot")).toBe("space");
    expect(root.getAttribute("data-block")).toBe("true");
    expect(root.className).toContain("w-full");
    expect(root.className).toContain("gap-space-md");
    expect(root.querySelectorAll("button")).toHaveLength(2);
    expect(root.textContent).toContain("|");
    expect(root.className).not.toContain("items-start");
  });
  it("forwards Space ref to its root and supports numeric gaps", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Space ref={ref} gap={12}><button>A</button></Space>);
    expect(ref.current?.getAttribute("data-slot")).toBe("space");
    expect(ref.current?.className).toContain("[gap:12px]");
  });
  it("supports OTP digit entry",()=>{render(<InputOTP aria-label="One-time code" length={4}/>);const first=screen.getByLabelText("1");fireEvent.change(first,{target:{value:"1"}});expect((first as HTMLInputElement).value).toBe("1");});
  it("opens a confirmation dialog",()=>{render(<Popconfirm title="Delete item?" okText="Confirm" cancelText="Cancel"><button>Delete</button></Popconfirm>);fireEvent.click(screen.getByRole("button",{name:"Delete"}));expect(screen.getByRole("alertdialog")).toBeTruthy();});
  it("provides transient message API",()=>{function Probe(){const api=useMessage();return <button onClick={()=>api.success("Saved")}>Show</button>}render(<MessageProvider><Probe/></MessageProvider>);fireEvent.click(screen.getByRole("button",{name:"Show"}));expect(screen.getByText("Saved")).toBeTruthy();});
  it("closes Modal with Escape and restores the trigger focus", async () => {
    function Probe() { const [open, setOpen] = React.useState(false); return <><button onClick={() => setOpen(true)}>Open modal</button><Modal open={open} title="Dialog" onClose={() => setOpen(false)}>Content</Modal></>; }
    render(<Probe />);
    const trigger = screen.getByRole("button", { name: "Open modal" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
  it("localizes overlay close actions and uses neutral fallback surface names", () => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = "zh-CN";

    const modal = render(<Modal open>Content</Modal>);
    expect(screen.getByRole("dialog", { name: "对话框" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "关闭" })).toBeTruthy();
    modal.unmount();

    render(<Drawer open>Content</Drawer>);
    expect(screen.getByRole("dialog", { name: "抽屉" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "关闭" })).toBeTruthy();

    document.documentElement.lang = previousLang;
  });

  it("supports Drawer placement and Escape close", async () => {
    function Probe() { const [open, setOpen] = React.useState(true); return <Drawer open={open} placement="bottom" height={320} title="Drawer" onClose={() => setOpen(false)}>Content</Drawer>; }
    render(<Probe />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("bottom");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
  it("keeps side Drawers inside the mobile viewport safe gutter", () => {
    render(<Drawer open title="Drawer" width={480}>Content</Drawer>);
    const dialog = screen.getByRole("dialog") as HTMLElement;
    expect(dialog.style.width).toBe("480px");
    expect(dialog.style.maxWidth).toBe("calc(100vw - 1rem)");
    expect(dialog.className).toContain("max-w-[calc(100vw-1rem)]");
  });
});