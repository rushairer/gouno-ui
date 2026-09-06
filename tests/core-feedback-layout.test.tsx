import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { InputOTP, Layout, LayoutContent, LayoutHeader, MessageProvider, Popconfirm, Splitter, useMessage } from "../src/core";

describe("Core layout and feedback", () => {
  it("renders layout regions and splitter semantics",()=>{render(<><Layout><LayoutHeader>Header</LayoutHeader><LayoutContent>Content</LayoutContent></Layout><Splitter first="A" second="B"/></>);expect(screen.getByText("Header")).toBeTruthy();expect(screen.getByRole("separator")).toBeTruthy();});
  it("supports OTP digit entry",()=>{render(<InputOTP length={4}/>);const first=screen.getByLabelText("Digit 1");fireEvent.change(first,{target:{value:"1"}});expect((first as HTMLInputElement).value).toBe("1");});
  it("opens a confirmation dialog",()=>{render(<Popconfirm title="Delete item?"><button>Delete</button></Popconfirm>);fireEvent.click(screen.getByRole("button",{name:"Delete"}));expect(screen.getByRole("alertdialog")).toBeTruthy();});
  it("provides transient message API",()=>{function Probe(){const api=useMessage();return <button onClick={()=>api.success("Saved")}>Show</button>}render(<MessageProvider><Probe/></MessageProvider>);fireEvent.click(screen.getByRole("button",{name:"Show"}));expect(screen.getByText("Saved")).toBeTruthy();});
});
