import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { showcaseCatalog } from "../showcase/catalog";
import { componentProgress } from "../showcase/catalog/component-progress";
import {
  PatternCollectionCompositionDemo,
  PatternDataSummaryCompositionDemo,
  PatternMasterDetailCompositionDemo,
  PatternRecordDetailCompositionDemo,
  PatternSettingsCompositionDemo,
} from "../showcase/demos/patterns/admin-data-composition";

afterEach(cleanup);

const compositionIds = [
  "pattern-collection-composition",
  "pattern-record-detail-composition",
  "pattern-master-detail-composition",
  "pattern-settings-composition",
  "pattern-data-summary-composition",
];

describe("admin data composition contracts", () => {
  it("publishes five reviewed Showcase-only contracts without page-level public runtime APIs", () => {
    const ids = showcaseCatalog
      .filter((group) => group.workspace === "gouno-ui" && group.layer === "patterns")
      .flatMap((group) => group.items.map((item) => item.id));
    const publicPatterns = readFileSync(resolve(process.cwd(), "src/patterns/index.ts"), "utf8");

    for (const id of compositionIds) {
      expect(ids).toContain(id);
      expect(componentProgress(id, 0)).toBe(100);
    }

    expect(publicPatterns).not.toContain("CollectionComposition");
    expect(publicPatterns).not.toContain("RecordDetailComposition");
    expect(publicPatterns).not.toContain("MasterDetailComposition");
    expect(publicPatterns).not.toContain("SettingsComposition");
    expect(publicPatterns).not.toContain("DataSummaryComposition");
  });

  it("keeps Collection ownership in summary -> toolbar -> data view -> pagination order", () => {
    const { container } = render(<PatternCollectionCompositionDemo />);
    const collection = container.querySelector('[data-pattern="collection-composition"]');
    const summary = collection?.querySelector('[data-slot="collection-summary"]');
    const toolbar = collection?.querySelector('[data-slot="collection-toolbar"]');
    const data = collection?.querySelector('[data-slot="collection-data-view"]');
    const pagination = collection?.querySelector('[data-slot="collection-pagination"]');

    expect(collection).toBeTruthy();
    expect(summary).toBeTruthy();
    expect(toolbar).toBeTruthy();
    expect(data).toBeTruthy();
    expect(pagination).toBeTruthy();
    expect(summary?.compareDocumentPosition(toolbar as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toolbar?.compareDocumentPosition(data as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(data?.compareDocumentPosition(pagination as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    fireEvent.change(screen.getByLabelText("搜索资产"), { target: { value: "不存在" } });
    expect(screen.getByText("没有符合条件的资产")).toBeTruthy();
    expect(screen.getByLabelText("搜索资产")).toBeTruthy();
  });

  it("keeps Record Detail identity -> feedback -> summary -> sections order", () => {
    const { container } = render(<PatternRecordDetailCompositionDemo />);
    const record = container.querySelector('[data-pattern="record-detail-composition"]');
    const identity = record?.querySelector('[data-slot="record-identity"]');
    const feedback = record?.querySelector('[data-slot="record-feedback"]');
    const summary = record?.querySelector('[data-slot="record-summary"]');
    const sections = record?.querySelector('[data-slot="record-sections"]');

    expect(identity).toBeTruthy();
    expect(feedback).toBeTruthy();
    expect(summary).toBeTruthy();
    expect(sections).toBeTruthy();
    expect(identity?.compareDocumentPosition(feedback as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(feedback?.compareDocumentPosition(summary as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(summary?.compareDocumentPosition(sections as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("keeps Master and Detail ownership separate while mobile drill-in has an explicit return path", () => {
    const { container } = render(<PatternMasterDetailCompositionDemo />);
    const composition = container.querySelector('[data-pattern="master-detail-composition"]');
    expect(container.querySelector('[data-slot="master-detail-master"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="master-detail-detail"]')).toBeTruthy();
    expect(composition).toHaveAttribute("data-mobile-pane", "master");
    expect(screen.getByRole("heading", { level: 2, name: "确认文章分类" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /批准外部写入/ }));
    expect(composition).toHaveAttribute("data-mobile-pane", "detail");
    expect(screen.getByRole("heading", { level: 2, name: "批准外部写入" })).toBeTruthy();
    expect(screen.getByText(/D-30/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "返回待处理列表" }));
    expect(composition).toHaveAttribute("data-mobile-pane", "master");
  });

  it("keeps Settings feedback before semantic sections and one task action boundary", () => {
    const { container } = render(<PatternSettingsCompositionDemo />);
    const settings = container.querySelector('[data-pattern="settings-composition"]');
    const feedback = settings?.querySelector('[data-slot="settings-feedback"]');
    const sections = settings?.querySelector('[data-slot="settings-sections"]');
    const actions = settings?.querySelector('[data-slot="settings-actions"]');

    expect(feedback).toBeTruthy();
    expect(sections).toBeTruthy();
    expect(actions).toBeTruthy();
    expect(container.querySelectorAll('[data-pattern="settings-section"]')).toHaveLength(2);
    expect(feedback?.compareDocumentPosition(sections as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(sections?.compareDocumentPosition(actions as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("keeps Data Summary as a semantic metric group before detailed data", () => {
    const { container } = render(<PatternDataSummaryCompositionDemo />);
    const summary = container.querySelector('[data-pattern="data-summary-composition"]');
    expect(summary).toBeTruthy();
    expect(screen.getByText("今日运行")).toBeTruthy();
    expect(screen.getByText("成功率")).toBeTruthy();
    expect(screen.getByText("待人工")).toBeTruthy();
    expect(screen.getByText("失败")).toBeTruthy();
    expect(summary?.compareDocumentPosition(screen.getByRole("heading", { level: 3, name: "详细数据区域" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
