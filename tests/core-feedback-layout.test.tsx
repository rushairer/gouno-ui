import { describe, expect, it } from "vitest";
import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Badge, CheckableTag, Drawer, InputOTP, Layout, LayoutContent, LayoutHeader, MessageProvider, Modal, Popconfirm, Space, Splitter, useMessage } from "../src/core";

describe("Core layout and feedback", () => {
  it("renders layout regions and splitter semantics",()=>{render(<><Layout><LayoutHeader>Header</LayoutHeader><LayoutContent>Content</LayoutContent></Layout><Splitter first="A" second="B"/></>);expect(screen.getByText("Header")).toBeTruthy();expect(screen.getByRole("separator")).toBeTruthy();});
  it("stretches vertical children by default like Ant Design", () => {
    const { container } = render(<Space direction="vertical"><Badge count={5}>Inbox</Badge><CheckableTag defaultChecked>TypeScript</CheckableTag></Space>);
    expect(container.firstElementChild?.className).not.toContain("items-start");
    expect(container.firstElementChild?.className).not.toContain("items-end");
  });
  it("allows vertical Space children to stretch explicitly", () => {
    const { container } = render(<Space direction="vertical" align="stretch"><button>Full width</button></Space>);
    expect(container.firstElementChild?.className).toContain("items-stretch");
  });
  it("supports block containers and split content", () => {
    const { container } = render(<Space direction="vertical" block split={<span>|</span>}><button>A</button><button>B</button></Space>);
    const root = container.firstElementChild!;
    expect(root.getAttribute("data-slot")).toBe("space");
    expect(root.getAttribute("data-block")).toBe("true");
    expect(root.className).toContain("w-full");
    expect(root.querySelectorAll("button")).toHaveLength(2);
    expect(root.textContent).toContain("|");
    expect(root.className).not.toContain("items-start");
  });
  it("supports OTP digit entry",()=>{render(<InputOTP length={4}/>);const first=screen.getByLabelText("Digit 1");fireEvent.change(first,{target:{value:"1"}});expect((first as HTMLInputElement).value).toBe("1");});
  it("opens a confirmation dialog",()=>{render(<Popconfirm title="Delete item?"><button>Delete</button></Popconfirm>);fireEvent.click(screen.getByRole("button",{name:"Delete"}));expect(screen.getByRole("alertdialog")).toBeTruthy();});
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
  it("supports Drawer placement and Escape close", async () => {
    function Probe() { const [open, setOpen] = React.useState(true); return <Drawer open={open} placement="bottom" height={320} title="Drawer" onClose={() => setOpen(false)}>Content</Drawer>; }
    render(<Probe />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("bottom");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
